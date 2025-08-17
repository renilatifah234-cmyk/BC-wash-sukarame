"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, MapPin, Calendar, Clock, Phone, Copy, Home, Car, Star } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { BookingData } from "@/app/booking/page"
import { useState } from "react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface BookingConfirmationProps {
  bookingData: BookingData
  onNewBooking: () => void
}

export function BookingConfirmation({ bookingData, onNewBooking }: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false)

  const copyBookingCode = async () => {
    if (!bookingData.bookingCode) return

    try {
      await navigator.clipboard.writeText(bookingData.bookingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy booking code: ", err)
    }
  }

  if (
    !bookingData.service ||
    !bookingData.branch ||
    !bookingData.date ||
    !bookingData.time ||
    !bookingData.bookingCode
  ) {
    return <div>Data booking tidak lengkap</div>
  }

  const bookingDate = new Date(bookingData.date)
  const formattedDate = format(bookingDate, "EEEE, dd MMMM yyyy", { locale: id })

  const totalPrice = bookingData.service.price + (bookingData.isPickupService ? bookingData.service.pickup_fee || 0 : 0)
  const loyaltyPointsEarned = Math.floor(totalPrice / 1000) // 1 point per 1000 IDR

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Booking Berhasil!</h1>
        <p className="text-muted-foreground mt-1">Terima kasih telah mempercayai layanan BC Wash Sukarame</p>
      </div>

      {/* Booking Code */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Kode Booking Anda</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold font-mono text-primary">{bookingData.bookingCode}</span>
              <Button variant="ghost" size="sm" onClick={copyBookingCode} className="h-8 w-8 p-0">
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Simpan kode ini untuk referensi dan tunjukkan saat datang ke lokasi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Detail Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{bookingData.service.name}</h3>
              <p className="text-sm text-muted-foreground">{bookingData.service.description}</p>
              {bookingData.service.features && bookingData.service.features.length > 0 && (
                <div className="mt-2">
                  {bookingData.service.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
              <p className="text-sm text-muted-foreground">~{bookingData.service.duration} menit</p>
              {bookingData.isPickupService && <p className="text-xs text-muted-foreground">Termasuk biaya pickup</p>}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.branch.name}</p>
                <p className="text-sm text-muted-foreground">{bookingData.branch.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <p>{formattedDate}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p>{bookingData.time} WIB</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <p>{bookingData.branch.phone}</p>
            </div>

            {bookingData.vehiclePlateNumber && (
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-muted-foreground" />
                <p className="font-mono">{bookingData.vehiclePlateNumber}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold">Informasi Kontak:</h4>
            <p className="text-sm">Nama: {bookingData.customerName}</p>
            <p className="text-sm">Telepon: {bookingData.customerPhone}</p>
            <p className="text-sm">Email: {bookingData.customerEmail}</p>
          </div>

          {bookingData.isPickupService && bookingData.pickupAddress && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Layanan Pickup:</h4>
                <p className="text-sm">Alamat: {bookingData.pickupAddress}</p>
                {bookingData.pickupNotes && <p className="text-sm">Catatan: {bookingData.pickupNotes}</p>}
              </div>
            </>
          )}

          {loyaltyPointsEarned > 0 && (
            <>
              <Separator />
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-semibold text-yellow-800">Poin Loyalitas Earned!</p>
                  <p className="text-sm text-yellow-700">
                    Anda mendapatkan <span className="font-bold">+{loyaltyPointsEarned} poin</span> dari booking ini
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-800">Status Booking: Menunggu Konfirmasi</h4>
            <div className="text-sm text-amber-700 space-y-1">
              <p>• Bukti transfer Anda sedang diverifikasi oleh tim kami</p>
              <p>• Anda akan menerima konfirmasi melalui WhatsApp/SMS dalam 1-2 jam</p>
              <p>• Datang 10 menit sebelum waktu booking dengan membawa kode booking</p>
              <p>• Hubungi cabang jika ada pertanyaan atau perlu mengubah jadwal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </Button>
        <Button onClick={onNewBooking} size="lg" className="flex-1">
          Booking Lagi
        </Button>
      </div>
    </div>
  )
}
