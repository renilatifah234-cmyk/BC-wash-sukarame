"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, Plus, ArrowLeft } from "lucide-react"
import { useState } from "react"

interface ManualBookingSuccessProps {
  bookingCode: string
  loyaltyPoints: number
  onNewBooking: () => void
  onBackToList: () => void
}

export function ManualBookingSuccess({ bookingCode, loyaltyPoints, onNewBooking, onBackToList }: ManualBookingSuccessProps) {
  const [copied, setCopied] = useState(false)

  const copyBookingCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy booking code: ", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Booking Berhasil Dibuat!</h2>
        <p className="text-muted-foreground mt-1">Booking offline telah berhasil ditambahkan ke sistem</p>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-center text-green-800">Kode Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold font-mono text-green-700">{bookingCode}</span>
              <Button variant="ghost" size="sm" onClick={copyBookingCode} className="h-8 w-8 p-0">
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-green-700">Kode booking telah disimpan dan dapat digunakan untuk tracking</p>
            <p className="text-sm text-green-700 mt-2">Poin loyalitas didapat: {loyaltyPoints}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-green-800">Status: Dikonfirmasi</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Booking offline langsung dikonfirmasi dalam sistem</p>
              <p>• Pelanggan dapat langsung datang sesuai jadwal yang ditentukan</p>
              <p>• Poin loyalitas akan otomatis ditambahkan setelah layanan selesai</p>
              <p>• Booking dapat dilihat di daftar booking dengan status "Dikonfirmasi"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button variant="outline" onClick={onBackToList} className="flex-1 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Booking
        </Button>
        <Button onClick={onNewBooking} className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Buat Booking Lagi
        </Button>
      </div>
    </div>
  )
}
