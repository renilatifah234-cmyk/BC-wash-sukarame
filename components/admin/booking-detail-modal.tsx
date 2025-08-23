"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReceiptGenerator } from "@/components/admin/receipt-generator"
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileImage,
  CheckCircle,
  XCircle,
  MessageSquare,
  Receipt,
  Car,
  Star,
} from "lucide-react"
import { formatCurrency, generateReceiptData } from "@/lib/dummy-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface BookingDetailModalProps {
  booking: {
    id: string
    bookingCode: string
    customerName: string
    customerPhone: string
    customerEmail: string
    service: string
    branch: string
    date: string
    time: string
    amount: number
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
    createdAt: string
    paymentProof?: string
    isPickupService?: boolean
    pickupAddress?: string
    pickupNotes?: string
    vehiclePlateNumber?: string
    loyaltyPointsEarned?: number
  } | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (bookingId: string, newStatus: string) => void
}

export function BookingDetailModal({ booking, isOpen, onClose, onStatusChange }: BookingDetailModalProps) {
  const [newStatus, setNewStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)

  if (!booking) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dikonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>
      case "in-progress":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Berlangsung</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Selesai</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return [
          { value: "confirmed", label: "Konfirmasi" },
          { value: "cancelled", label: "Batalkan" },
        ]
      case "confirmed":
        return [
          { value: "in-progress", label: "Mulai Layanan" },
          { value: "cancelled", label: "Batalkan" },
        ]
      case "in-progress":
        return [{ value: "completed", label: "Selesaikan" }]
      default:
        return []
    }
  }

  const handleStatusUpdate = () => {
    if (newStatus) {
      onStatusChange(booking.id, newStatus)
      setNewStatus("")
      setNotes("")
      onClose()
    }
  }

  const handleCallCustomer = () => {
    window.open(`tel:${booking.customerPhone}`)
  }

  const handleEmailCustomer = () => {
    window.open(`mailto:${booking.customerEmail}`)
  }

  const handleGenerateReceipt = () => {
    setShowReceipt(true)
  }

  const statusOptions = getAvailableStatusOptions(booking.status)

  if (showReceipt) {
    const receiptData = generateReceiptData(booking.id)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <ReceiptGenerator receiptData={receiptData} onClose={() => setShowReceipt(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Detail Booking #{booking.bookingCode}</DialogTitle>
          <DialogDescription>Informasi lengkap booking pelanggan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{booking.service}</h3>
              <p className="text-sm text-muted-foreground">
                Dibuat: {booking.createdAt ? format(new Date(booking.createdAt), "dd MMM yyyy, HH:mm", { locale: id }) : "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatCurrency(booking.amount)}</p>
              {getStatusBadge(booking.status)}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Informasi Pelanggan
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.customerPhone}</p>
                    <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                {booking.vehiclePlateNumber && (
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium font-mono">{booking.vehiclePlateNumber}</p>
                      <p className="text-sm text-muted-foreground">Nomor Plat</p>
                    </div>
                  </div>
                )}
                {booking.loyaltyPointsEarned && (
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="font-medium">+{booking.loyaltyPointsEarned} poin</p>
                      <p className="text-sm text-muted-foreground">Poin Loyalitas</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button onClick={handleCallCustomer} className="w-full bg-transparent" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi Pelanggan
                </Button>
                <Button onClick={handleEmailCustomer} className="w-full bg-transparent" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Email
                </Button>
                {booking.status === "completed" && (
                  <Button onClick={handleGenerateReceipt} className="w-full bg-transparent" variant="outline">
                    <Receipt className="w-4 h-4 mr-2" />
                    Generate Struk
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Detail Booking
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.branch}</p>
                    <p className="text-sm text-muted-foreground">Lokasi Cabang</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(booking.date), "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                    <p className="text-sm text-muted-foreground">Tanggal Booking</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.time} WIB</p>
                    <p className="text-sm text-muted-foreground">Waktu Booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {booking.isPickupService && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Layanan Pickup
                </h4>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div>
                    <p className="font-medium">Alamat Pickup:</p>
                    <p className="text-sm text-muted-foreground">{booking.pickupAddress}</p>
                  </div>
                  {booking.pickupNotes && (
                    <div>
                      <p className="font-medium">Catatan:</p>
                      <p className="text-sm text-muted-foreground">{booking.pickupNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Payment Proof */}
          {booking.paymentProof && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Bukti Pembayaran
                </h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileImage className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{booking.paymentProof}</p>
                    <p className="text-sm text-muted-foreground">Bukti transfer telah diupload</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                    Lihat Bukti
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Status Update */}
          {statusOptions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Update Status
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status Baru</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status baru" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan (Opsional)</Label>
                    <Textarea
                      placeholder="Tambahkan catatan untuk perubahan status..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleStatusUpdate} disabled={!newStatus} className="w-full">
                    {newStatus === "confirmed" && <CheckCircle className="w-4 h-4 mr-2" />}
                    {newStatus === "cancelled" && <XCircle className="w-4 h-4 mr-2" />}
                    {newStatus === "in-progress" && <Clock className="w-4 h-4 mr-2" />}
                    {newStatus === "completed" && <CheckCircle className="w-4 h-4 mr-2" />}
                    Update Status
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
