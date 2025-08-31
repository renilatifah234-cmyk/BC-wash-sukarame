"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  lat?: number | null
  lng?: number | null
  onChange: (lat: number, lng: number) => void
  height?: number
}

declare global {
  interface Window { google?: any }
}

export function BranchMapPicker({ lat, lng, onChange, height = 300 }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const mapObj = useRef<any>(null)
  const markerObj = useRef<any>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return // no maps key; component renders only inputs

    // load script once
    const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]")
    if (existing) {
      initMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.setAttribute("data-google-maps", "true")
    script.onload = () => initMap()
    document.body.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // keep marker position in sync when props change
    if (!window.google || !mapObj.current || !markerObj.current) return
    if (lat != null && lng != null) {
      const g = window.google
      const pos = new g.maps.LatLng(lat, lng)
      markerObj.current.setPosition(pos)
      mapObj.current.setCenter(pos)
    }
  }, [lat, lng])

  const initMap = () => {
    if (!window.google || !mapRef.current) return
    const g = window.google
    const center = (lat != null && lng != null) ? { lat, lng } : { lat: -2.5, lng: 117 }
    mapObj.current = new g.maps.Map(mapRef.current, {
      center,
      zoom: lat != null && lng != null ? 14 : 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    markerObj.current = new g.maps.Marker({
      position: center,
      map: mapObj.current,
      draggable: true,
    })
    g.maps.event.addListener(mapObj.current, "click", (e: any) => {
      markerObj.current.setPosition(e.latLng)
      onChange(e.latLng.lat(), e.latLng.lng())
    })
    g.maps.event.addListener(markerObj.current, "dragend", (e: any) => {
      onChange(e.latLng.lat(), e.latLng.lng())
    })

    if (searchRef.current) {
      const ac = new g.maps.places.Autocomplete(searchRef.current, {
        fields: ["geometry", "formatted_address"],
        componentRestrictions: { country: ["id"] },
      })
      ac.addListener("place_changed", () => {
        const place = ac.getPlace()
        const loc = place?.geometry?.location
        if (loc) {
          const pos = new g.maps.LatLng(loc.lat(), loc.lng())
          mapObj.current.setCenter(pos)
          mapObj.current.setZoom(15)
          markerObj.current.setPosition(pos)
          onChange(loc.lat(), loc.lng())
        }
      })
    }
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      onChange(latitude, longitude)
      if (window.google && mapObj.current && markerObj.current) {
        const g = window.google
        const p = new g.maps.LatLng(latitude, longitude)
        markerObj.current.setPosition(p)
        mapObj.current.setCenter(p)
        mapObj.current.setZoom(15)
      }
    })
  }

  const hasMaps = typeof window !== "undefined" && !!window.google

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="branch-map-search">Cari lokasi</Label>
          <Input id="branch-map-search" ref={searchRef} placeholder="Cari alamat atau tempat" />
        </div>
        <div className="pt-6">
          <Button type="button" variant="outline" onClick={useMyLocation}>Gunakan Lokasi Saya</Button>
        </div>
      </div>
      <div ref={mapRef} style={{ width: "100%", height }} className={!hasMaps ? "hidden" : "rounded-md border"} />
      {!hasMaps && (
        <div className="text-sm text-muted-foreground">
          Tambahkan kunci Google Maps di .env untuk mengaktifkan pemilih lokasi.
        </div>
      )}
    </div>
  )
}

