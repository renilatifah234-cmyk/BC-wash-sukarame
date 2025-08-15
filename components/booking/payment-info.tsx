"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, MapPin, Calendar, Clock, Copy, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/dummy-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { BookingData } from "@/app/booking/page"
import { useState } from "react"

interface PaymentInfoProps {
  onNext: () => void
  onPrev: () => void
  bookingData: BookingData
}

export function PaymentInfo({ onNext, onPrev, bookingData }: PaymentInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  if (!bookingData.service || !bookingData.branch || !bookingData.date || !bookingData.time) {
    return <div>Data booking tidak lengkap</div>
  }

  const bookingDate = new Date(bookingData.date)
  const formattedDate = format(bookingDate, "EEEE, dd MMMM yyyy", { locale: id })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Informasi Pembayaran</h1>
        <p className="text-muted-foreground mt-1">Transfer ke rekening cabang yang dipilih</p>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Ringkasan Booking</CardTitle>
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
              <p className="text-2xl font-bold text-primary">{formatCurrency(bookingData.service.price)}</p>
              <p className="text-sm text-muted-foreground">~{bookingData.service.duration} menit</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Instruksi Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Transfer ke Rekening Berikut:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bank:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{bookingData.branch.bankAccount.bank}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bookingData.branch!.bankAccount.bank, "bank")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "bank" ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">No. Rekening:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-mono">{bookingData.branch.bankAccount.accountNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bookingData.branch!.bankAccount.accountNumber, "account")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "account" ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atas Nama:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{bookingData.branch.bankAccount.accountName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bookingData.branch!.bankAccount.accountName, "name")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "name" ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jumlah Transfer:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{formatCurrency(bookingData.service.price)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bookingData.service!.price.toString(), "amount")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "amount" ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Penting:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Transfer sesuai dengan jumlah yang tertera</li>
              <li>• Simpan bukti transfer untuk langkah selanjutnya</li>
              <li>• Booking akan dikonfirmasi setelah pembayaran diverifikasi</li>
              <li>• Hubungi cabang jika ada kendala pembayaran</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} size="lg" className="px-8 bg-transparent">
          Kembali
        </Button>
        <Button onClick={onNext} size="lg" className="px-8">
          Sudah Transfer, Lanjutkan
        </Button>
      </div>
    </div>
  )
}
