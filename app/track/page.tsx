"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { Calendar, Car, CheckCircle, Clock, MapPin, Search, XCircle, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"

type BookingStatus = "pending" | "confirmed" | "picked-up" | "in-progress" | "completed" | "cancelled"

export default function TrackBookingPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<any | null>(null)

  const handleSearch = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setBooking(null)

    try {
      const { booking } = await apiClient.getBookingByCode(code.trim())
      setBooking(booking)
    } catch (err: any) {
      setError(err?.message || "Gagal mencari booking")
    } finally {
      setLoading(false)
    }
  }

  const StatusBadge = ({ status }: { status: BookingStatus }) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dikonfirmasi</Badge>
      case "in-progress":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Berlangsung</Badge>
      case "picked-up":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Dijemput</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Selesai</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const baseSteps: { key: BookingStatus; label: string; desc: string }[] = [
    { key: "pending", label: "Menunggu Pembayaran/Konfirmasi", desc: "Booking dibuat" },
    { key: "confirmed", label: "Dikonfirmasi", desc: "Jadwal sudah dikonfirmasi" },
    { key: "picked-up", label: "Dijemput", desc: "Kendaraan sedang dijemput" },
    { key: "in-progress", label: "Sedang Dikerjakan", desc: "Layanan sedang berlangsung" },
    { key: "completed", label: "Selesai", desc: "Layanan selesai" },
  ]

  const steps = booking?.is_pickup_service ? baseSteps : baseSteps.filter((s) => s.key !== "picked-up")

  const stepIndex = (s: BookingStatus) => steps.findIndex((st) => st.key === s)

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="container mx-auto max-w-3xl px-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 py-3 text-sm"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl space-y-6 px-4 pt-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Lacak Status Booking</h1>
          <p className="text-muted-foreground mt-1">Masukkan kode booking Anda untuk melihat progres.</p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Contoh: BCW2408311205"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} className="min-w-32">
            <Search className="w-4 h-4 mr-2" /> {loading ? "Mencari..." : "Cari"}
          </Button>
        </div>

        {error && (
          <Card className="border-destructive/30">
            <CardContent className="py-6 text-destructive flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {booking && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Booking #{booking.booking_code}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4" />
                    <span>{booking.services?.name || "Layanan"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.branches?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(booking.booking_date), "EEEE, dd MMMM yyyy", { locale: id })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{booking.booking_time} WIB</span>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Progres</h3>
                <div className="flex items-center justify-between">
                  {steps.map((s, idx) => {
                    const current = stepIndex(booking.status)
                    const reached = idx <= current
                    return (
                      <div key={s.key} className="flex items-center w-full">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${
                          reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {reached ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${idx < current ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  {steps.map((s) => (
                    <div key={s.key} className="text-center">
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

