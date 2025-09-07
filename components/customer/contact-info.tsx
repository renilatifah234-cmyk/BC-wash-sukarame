"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Branch } from "@/lib/dummy-data"

export function ContactInfo() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const { branches: branchData } = await apiClient.getBranches()
        // Hanya tampilkan cabang aktif ke pelanggan
        const activeBranches = branchData.filter((branch) => branch.status === "active")
        setBranches(activeBranches)
      } catch (err) {
        console.error("[v0] Error fetching branches:", err)
        setError("Gagal memuat informasi cabang. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Lokasi & Kontak</h2>
            <p className="text-lg text-muted-foreground">
              Kunjungi cabang terdekat atau hubungi kami untuk informasi lebih lanjut
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Lokasi & Kontak</h2>
            <p className="text-lg text-red-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Lokasi & Kontak</h2>
          <p className="text-lg text-muted-foreground">
            Kunjungi cabang terdekat atau hubungi kami untuk informasi lebih lanjut
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {branches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {branch.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{branch.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">{branch.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">
                    {branch.operating_hours_open} - {branch.operating_hours_close} WIB
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/booking">Mulai Booking Sekarang</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
