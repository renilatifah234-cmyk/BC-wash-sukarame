# Address Radius Validation

This document describes the technique and calculations used to validate whether a customer pickup address lies within a branch’s service radius.

## Summary
- We represent coverage as a circle centered on a branch coordinate `(lat, lng)` with radius `R` in kilometers.
- When a customer selects or types an address, we geocode it to `(lat, lng)` and compute the great‑circle distance to the branch.
- If `distance_km <= R`, the address is accepted; otherwise we show inline feedback and prevent continuing.

## Inputs
- Branch center: `branchLat`, `branchLng` (decimal degrees)
- Service radius: `radiusKm` (kilometers)
- Customer address coordinates: `addrLat`, `addrLng` (from geocoding)

## Technique A: Google Maps Geometry (Great‑Circle)
When the Google Maps JavaScript API is available, use the built‑in spherical geometry utility for accuracy and simplicity.

- Load Maps JS with `libraries=places,geometry`.
- Use Places Autocomplete or Geocoding API to obtain the address geometry.
- Compute distance using `google.maps.geometry.spherical.computeDistanceBetween(a, b)` which returns meters along the WGS84 ellipsoid.

TypeScript snippet used in the app:

```ts
const a = new google.maps.LatLng(branchLat, branchLng)
const b = place.geometry.location // from Places / Geocoding
const meters = google.maps.geometry.spherical.computeDistanceBetween(a, b)
const km = meters / 1000
const ok = km <= radiusKm
```

Pros:
- Accurate great‑circle distance on Earth’s surface.
- No manual math or constants to maintain.

## Technique B: Haversine Formula (Manual)
If Maps Geometry is not available, compute the great‑circle distance using the Haversine formula.

```ts
// Earth radius (mean) in kilometers
const EARTH_RADIUS_KM = 6371.0088

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const rLat1 = toRad(lat1)
  const rLat2 = toRad(lat2)

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

// Usage
const km = haversineKm(branchLat, branchLng, addrLat, addrLng)
const ok = km <= radiusKm
```

Pros:
- No external dependency; works server‑side too.

Notes:
- Use `R = 6371.0088 km` (mean Earth radius) for consistent results.
- For very small distances, Haversine and Google’s geometry will match closely.

## UI Integration Pattern
1. Geocode input:
   - Prefer Places Autocomplete so selecting a suggestion yields precise geometry.
   - If the user types free‑form, geocode on blur to obtain coordinates.
2. Compute distance:
   - Use Technique A when Maps JS is present; otherwise Technique B.
3. Compare and feedback:
   - If outside radius, show inline message (and optionally the approximate distance), style the input as invalid, and disable progression.
4. Persist minimal data:
   - Store the selected formatted address and whether validation passed.

In this repo, see:
- `components/booking/pickup-address-input.tsx`: uses Places + `geometry.spherical.computeDistanceBetween` and falls back gracefully.
- `app/booking/page.tsx`: passes branch `latitude`/`longitude` to enable validation.

## Server‑Side Enforcement (Recommended)
Always re‑validate on the server to prevent bypassing client checks.

Example (Next.js route) using Haversine:

```ts
import { NextResponse } from 'next/server'

const EARTH_RADIUS_KM = 6371.0088
const toRad = (d: number) => (d * Math.PI) / 180
const haversineKm = (lat1:number, lon1:number, lat2:number, lon2:number) => {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const r1 = toRad(lat1)
  const r2 = toRad(lat2)
  const a = Math.sin(dLat/2)**2 + Math.cos(r1)*Math.cos(r2)*Math.sin(dLon/2)**2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export async function POST(req: Request) {
  const body = await req.json()
  // Lookup branch center + radius from DB by body.branch_id
  const { branchLat, branchLng, radiusKm } = await getBranchConfig(body.branch_id)

  // Expect client to provide pickup lat/lng (from their geocoding step)
  const { pickup_lat, pickup_lng } = body

  if (branchLat == null || branchLng == null || radiusKm == null || pickup_lat == null || pickup_lng == null) {
    return NextResponse.json({ error: 'Missing coordinates for radius validation' }, { status: 422 })
  }

  const km = haversineKm(branchLat, branchLng, pickup_lat, pickup_lng)
  if (km > radiusKm) {
    return NextResponse.json({ error: 'Pickup address is outside service radius' }, { status: 422 })
  }

  // Continue creating booking...
}
```

Alternative: If you need driving distance along roads rather than straight‑line distance, use the Google Distance Matrix API server‑side and compare kilometers to `radiusKm` (note: billing and quotas apply).

## Edge Cases & UX Notes
- Missing branch coordinates: disable pickup or show a message until configured.
- Ambiguous addresses: force selection from autocomplete before enabling “Next”.
- Buffering: consider allowing a small buffer (e.g., +0.2 km) to account for geocoding jitter.
- Rounding: present `~X.Y km` to users; compute using full precision internally.
- Country restrictions: limit autocomplete to `ID` for Indonesian addresses.
- Privacy: do not store raw geocoding results beyond what’s necessary.

## Testing Checklist
- Addresses well inside the radius → accepted.
- Addresses just outside the radius (e.g., +0.1 km) → rejected.
- Manual typing + blur triggers geocoding and validation.
- Switching branches updates radius and center.
- Client disabled “Next” when invalid; server still rejects bypass attempts.

---
This approach yields consistent, accurate radius checks using great‑circle distance and clear customer feedback, with an optional server‑side guard for integrity.

