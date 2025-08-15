"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookingDetailModal } from "@/components/admin/booking-detail-modal"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Phone } from "lucide-react"
import { formatCurrency } from "@/lib/dummy-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface BookingItem {
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
}

export function BookingList() {
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Mock booking data - in real app, this would come from API
  const bookings: BookingItem[] = [
    {
      id: "1",
      bookingCode: "BCW001",
      customerName: "Ahmad Rizki",
      customerPhone: "08123456789",
      customerEmail: "ahmad.rizki@email.com",
      service: "Cuci Mobil Kecil Hidrolik",
      branch: "Sukarame Utama",
      date: "2024-01-15",
      time: "10:00",
      amount: 45000,
      status: "confirmed",
      createdAt: "2024-01-14T10:00:00Z",
      paymentProof: "proof1.jpg",
    },
    {
      id: "2",
      bookingCode: "BCW002",
      customerName: "Sari Dewi",
      customerPhone: "08987654321",
      customerEmail: "sari.dewi@email.com",
      service: "Cuci Motor Sedang Steam",
      branch: "Sukarame Cabang 2",
      date: "2024-01-15",
      time: "14:00",
      amount: 15000,
      status: "pending",
      createdAt: "2024-01-14T14:00:00Z",
      paymentProof: "proof2.jpg",
    },
    {
      id: "3",
      bookingCode: "BCW003",
      customerName: "Budi Santoso",
      customerPhone: "08555666777",
      customerEmail: "budi.santoso@email.com",
      service: "Fogging Anti Bakteri",
      branch: "Sukarame Utama",
      date: "2024-01-15",
      time: "16:00",
      amount: 75000,
      status: "in-progress",
      createdAt: "2024-01-15T08:00:00Z",
      paymentProof: "proof3.jpg",
    },
    {
      id: "4",
      bookingCode: "BCW004",
      customerName: "Maya Putri",
      customerPhone: "08111222333",
      customerEmail: "maya.putri@email.com",
      service: "Cuci Mobil Besar Non-Hidrolik",
      branch: "Sukarame Utama",
      date: "2024-01-15",
      time: "11:30",
      amount: 40000,
      status: "completed",
      createdAt: "2024-01-15T09:00:00Z",
      paymentProof: "proof4.jpg",
    },
    {
      id: "5",
      bookingCode: "BCW005",
      customerName: "Andi Wijaya",
      customerPhone: "08444555666",
      customerEmail: "andi.wijaya@email.com",
      service: "Cuci Motor Kecil Steam",
      branch: "Sukarame Cabang 2",
      date: "2024-01-15",
      time: "09:00",
      amount: 13000,
      status: "cancelled",
      createdAt: "2024-01-15T07:00:00Z",
    },
  ]

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

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    // In real app, this would make an API call to update the booking status
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`)
    // For demo purposes, we'll just log it
  }

  const handleViewDetails = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Daftar Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium font-mono">{booking.bookingCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="text-sm truncate">{booking.service}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.branch}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{format(new Date(booking.date), "dd MMM yyyy", { locale: id })}</p>
                        <p className="text-sm text-muted-foreground">{booking.time} WIB</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(booking.amount)}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCallCustomer(booking.customerPhone)}
                          className="h-8 w-8 p-0"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {booking.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Konfirmasi
                              </DropdownMenuItem>
                            )}
                            {booking.status === "confirmed" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "in-progress")}>
                                <Clock className="mr-2 h-4 w-4" />
                                Mulai Layanan
                              </DropdownMenuItem>
                            )}
                            {booking.status === "in-progress" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "completed")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Selesaikan
                              </DropdownMenuItem>
                            )}
                            {(booking.status === "pending" || booking.status === "confirmed") && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(booking.id, "cancelled")}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBooking(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}
