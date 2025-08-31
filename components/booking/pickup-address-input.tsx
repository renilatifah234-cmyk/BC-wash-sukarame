"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getBranchCoordinates } from "@/lib/locations"

interface PickupAddressInputProps {
  branchId: string
  branchName: string
  radiusKm?: number
  branchLat?: number | null
  branchLng?: number | null
  value: string
  onChange: (val: string) => void
  onValidationChange?: (ok: boolean, distanceKm?: number) => void
}

declare global {
  interface Window {
    google?: any
  }
}

export function PickupAddressInput({
  branchId,
  branchName,
  radiusKm,
  branchLat,
  branchLng,
  value,
  onChange,
  onValidationChange,
}: PickupAddressInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | undefined>(undefined)
  const [valid, setValid] = useState(true)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return // fallback to plain input

    const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]")
    if (existing) {
      initAutocomplete()
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.setAttribute("data-google-maps", "true")
    script.onload = () => initAutocomplete()
    document.body.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initAutocomplete = () => {
    if (!window.google || !inputRef.current) return
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: ["id"] },
    })
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place?.formatted_address) {
        onChange(place.formatted_address)
      }
      validateDistance(place?.geometry?.location)
    })
  }

  const validateDistance = (location?: any) => {
    if (!radiusKm) {
      setValid(true)
      onValidationChange?.(true)
      return
    }
    const branchCoord =
      branchLat != null && branchLng != null
        ? { lat: branchLat, lng: branchLng }
        : getBranchCoordinates(branchId)
    if (!branchCoord || !window.google || !location) {
      setValid(true)
      onValidationChange?.(true)
      return
    }
    const g = window.google
    const a = new g.maps.LatLng(branchCoord.lat, branchCoord.lng)
    const b = location
    const meters = g.maps.geometry.spherical.computeDistanceBetween(a, b)
    const km = meters / 1000
    setDistanceKm(km)
    const ok = km <= radiusKm
    setValid(ok)
    onValidationChange?.(ok, km)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="pickupAddress">Alamat Pickup</Label>
      <Input
        id="pickupAddress"
        ref={inputRef}
        placeholder={"Masukkan alamat lengkap untuk pickup kendaraan"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={!valid ? "border-destructive" : ""}
      />
      {radiusKm ? (
        <p className="text-xs text-muted-foreground">
          Radius layanan cabang {branchName}: {radiusKm} km
          {distanceKm !== undefined ? ` • Jarak Anda ~${distanceKm.toFixed(1)} km` : ""}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Radius layanan cabang {branchName}</p>
      )}
      {!valid && (
        <p className="text-sm text-destructive">Alamat di luar jangkauan radius penjemputan</p>
      )}
    </div>
  )
}
