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
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const pickupMarkerRef = useRef<any>(null)
  const branchMarkerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const geocoderRef = useRef<any>(null)
  const [distanceKm, setDistanceKm] = useState<number | undefined>(undefined)
  const [valid, setValid] = useState(true)
  const hasGoogle = typeof window !== "undefined" && !!window.google

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return // fallback to plain input

    const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]")
    if (existing) {
      initGoogle()
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.setAttribute("data-google-maps", "true")
    script.onload = () => initGoogle()
    document.body.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initGoogle = () => {
    if (!window.google) return
    if (!geocoderRef.current) geocoderRef.current = new window.google.maps.Geocoder()
    initMap()
    initAutocomplete()
    // If there is an initial value, attempt to geocode and place pin
    if (value?.trim()) {
      geocodeAddress(value)
    }
  }

  // Ensure map initializes/updates when container is ready or props change
  useEffect(() => {
    if (hasGoogle) {
      initMap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGoogle, branchLat, branchLng, radiusKm])

  const initMap = () => {
    if (!window.google || !mapContainerRef.current) return
    const branchCoord =
      branchLat != null && branchLng != null
        ? { lat: branchLat as number, lng: branchLng as number }
        : getBranchCoordinates(branchId)
    if (!branchCoord) return

    // Create map once
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: branchCoord,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })
    } else {
      mapRef.current.setCenter(branchCoord)
    }

    // Branch marker
    if (!branchMarkerRef.current) {
      branchMarkerRef.current = new window.google.maps.Marker({
        position: branchCoord,
        map: mapRef.current,
        title: branchName,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#0ea5e9",
          fillOpacity: 1,
          strokeColor: "#0369a1",
          strokeWeight: 2,
        },
      })
    } else {
      branchMarkerRef.current.setPosition(branchCoord)
    }

    // Coverage circle
    const radiusMeters = (radiusKm ?? 0) * 1000
    if (!circleRef.current) {
      circleRef.current = new window.google.maps.Circle({
        map: mapRef.current,
        center: branchCoord,
        radius: radiusMeters,
        strokeColor: "#0ea5e9",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#0ea5e9",
        fillOpacity: 0.08,
      })
    } else {
      circleRef.current.setCenter(branchCoord)
      circleRef.current.setRadius(radiusMeters)
    }

    // Pickup marker (draggable)
    if (!pickupMarkerRef.current) {
      pickupMarkerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: branchCoord,
        draggable: true,
        title: "Lokasi Pickup",
      })
      pickupMarkerRef.current.addListener("dragend", () => {
        const pos = pickupMarkerRef.current.getPosition()
        if (!pos) return
        validateDistance(pos)
        reverseGeocode(pos)
      })
    }
  }

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
      const loc = place?.geometry?.location
      if (loc && pickupMarkerRef.current && mapRef.current) {
        pickupMarkerRef.current.setPosition(loc)
        mapRef.current.panTo(loc)
      }
      validateDistance(loc)
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

  const geocodeAddress = (addr: string) => {
    if (!window.google || !geocoderRef.current) return
    geocoderRef.current.geocode({ address: addr }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location
        if (pickupMarkerRef.current && mapRef.current) {
          pickupMarkerRef.current.setPosition(loc)
          mapRef.current.panTo(loc)
        }
        validateDistance(loc)
      }
    })
  }

  const reverseGeocode = (latLng: any) => {
    if (!window.google || !geocoderRef.current) return
    geocoderRef.current.geocode({ location: latLng }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        onChange(results[0].formatted_address)
      }
    })
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
        onBlur={() => {
          // Attempt to geocode free-typed input to validate distance
          if (!window.google || !value?.trim()) return
          try {
            geocodeAddress(value)
          } catch {
            // no-op: keep last known validation state
          }
        }}
        className={!valid ? "border-destructive" : ""}
      />
      {hasGoogle && (branchLat != null || getBranchCoordinates(branchId)) && (
        <div className="h-64 w-full rounded-md border" ref={mapContainerRef} />
      )}
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
