"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Share } from "lucide-react"
import { formatCurrency } from "@/lib/dummy-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface ReceiptData {
  bookingCode: string
  customerName: string
  customerPhone: string
  service: string
  branch: string
  branchAddress: string
  date: string
  time: string
  amount: number
  paymentMethod: string
  completedAt: string
  staff: string
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData
  onClose?: () => void
}

export function ReceiptGenerator({ receiptData, onClose }: ReceiptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Downloading receipt PDF")
    setIsGenerating(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Struk BC Wash - ${receiptData.bookingCode}`,
          text: `Struk layanan cuci kendaraan BC Wash Sukarame`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      const receiptText = `
BC WASH SUKARAME
Struk Pembayaran

Kode Booking: ${receiptData.bookingCode}
Pelanggan: ${receiptData.customerName}
Layanan: ${receiptData.service}
Cabang: ${receiptData.branch}
Tanggal: ${format(new Date(receiptData.date), "dd MMMM yyyy", { locale: id })}
Waktu: ${receiptData.time} WIB
Total: ${formatCurrency(receiptData.amount)}

Terima kasih telah menggunakan layanan kami!
      `
      navigator.clipboard.writeText(receiptText)
      alert("Struk telah disalin ke clipboard")
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Receipt Header */}
      <div className="text-center p-6 border-b">
        <h1 className="font-serif text-2xl font-bold text-primary mb-2">BC WASH SUKARAME</h1>
        <p className="text-sm text-muted-foreground">Layanan Cuci Kendaraan Profesional</p>
        <p className="text-xs text-muted-foreground mt-1">{receiptData.branchAddress}</p>
      </div>

      {/* Receipt Content */}
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="font-semibold text-lg mb-2">STRUK PEMBAYARAN</h2>
          <Badge variant="outline" className="text-xs">
            {receiptData.bookingCode}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Tanggal & Waktu:</span>
            <span className="font-medium">
              {format(new Date(receiptData.date), "dd/MM/yyyy", { locale: id })} - {receiptData.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-medium">{receiptData.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Telepon:</span>
            <span className="font-medium">{receiptData.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span>Cabang:</span>
            <span className="font-medium">{receiptData.branch}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">DETAIL LAYANAN</h3>
          <div className="flex justify-between items-start">
            <span className="text-sm">{receiptData.service}</span>
            <span className="font-semibold">{formatCurrency(receiptData.amount)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-lg font-bold">
          <span>TOTAL BAYAR:</span>
          <span className="text-primary">{formatCurrency(receiptData.amount)}</span>
        </div>

        <Separator />

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Metode Bayar:</span>
            <span>{receiptData.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Selesai:</span>
            <span>{format(new Date(receiptData.completedAt), "dd/MM/yyyy HH:mm", { locale: id })}</span>
          </div>
          <div className="flex justify-between">
            <span>Dilayani:</span>
            <span>{receiptData.staff}</span>
          </div>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Terima kasih telah menggunakan layanan kami!</p>
          <p className="text-xs text-muted-foreground">Kritik & saran: 0721-123456</p>
          <p className="text-xs text-muted-foreground">www.bcwashsukarame.com</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 border-t bg-muted/30">
        <Button onClick={handleDownload} disabled={isGenerating} className="flex-1" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Download"}
        </Button>
        <Button onClick={handlePrint} variant="outline" className="flex-1 bg-transparent" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Cetak
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Bagikan
        </Button>
      </div>

      {onClose && (
        <div className="p-4">
          <Button onClick={onClose} variant="ghost" className="w-full">
            Tutup
          </Button>
        </div>
      )}
    </div>
  )
}
