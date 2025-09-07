// Mapping koordinat cabang untuk hitung radius pickup
// TODO: ganti dengan koordinat asli tiap cabang
export type LatLng = { lat: number; lng: number }

const branchCoordinates: Record<string, LatLng> = {
  // contoh placeholder — isi dengan koordinat nyata
  // "sukarame-main": { lat: -6.2385, lng: 106.9756 },
  // "sukarame-branch2": { lat: -6.2498, lng: 106.9921 },
}

export function getBranchCoordinates(branchId: string): LatLng | undefined {
  return branchCoordinates[branchId]
}

