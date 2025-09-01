// Simple branch coordinates mapping for pickup radius calculations
// TODO: Replace with real coordinates for each branch
export type LatLng = { lat: number; lng: number }

const branchCoordinates: Record<string, LatLng> = {
  // Example placeholders — please update with real coordinates
  // "sukarame-main": { lat: -6.2385, lng: 106.9756 },
  // "sukarame-branch2": { lat: -6.2498, lng: 106.9921 },
}

export function getBranchCoordinates(branchId: string): LatLng | undefined {
  return branchCoordinates[branchId]
}

