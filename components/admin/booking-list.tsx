"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Phone, FileImage, Car } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { apiClient } from "@/lib/api-client"
import { sendWhatsAppNotification } from "@/lib/whatsapp-utils"
import type { Booking } from "@/lib/dummy-data"
import { ErrorState } from "@/components/ui/error-state"
import { showErrorToast, showSuccessToast } from "@/lib/error-utils"

interface BookingWithDetails extends Booking {
  // Properties from original Booking type that are explicitly needed
  serviceId: string;
  branchId: string;
  date: string;
  time: string;
  bookingSource: "online" | "offline"; // Make non-optional, handle default if needed
  vehiclePlateNumber: string;
  createdAt: string;
  updatedAt: string;
  loyaltyPointsEarned?: number; // Corrected name based on error suggestion
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "picked-up" | "in-progress" | "completed" | "cancelled";
  isPickupService: boolean;

  // Derived properties for display in the table and for the modal
  service: string; // Service name as string (non-nullable)
  branch: string;  // Branch name as string (non-nullable)

  // Property for the modal, mapping totalPrice to amount
  amount: number;
  paymentProof?: string | null;
  branchAddress: string;
  branchPhone: string;
  paymentMethod: string;
}

export function BookingList({ searchTerm = "" }: { searchTerm?: string }) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  useEffect(() => {
    fetchBookings()
  }, [page, searchTerm])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const { bookings: bookingsData, total } = await apiClient.getBookings({
        page,
        limit: pageSize,
        search: searchTerm,
      })

      const enrichedBookings: BookingWithDetails[] = bookingsData.map((booking) => ({
        id: booking.id,
        serviceId: booking.service_id,
        branchId: booking.branch_id,
        date: booking.booking_date,
        time: booking.booking_time,
        bookingSource:
          booking.booking_source === "online" || booking.booking_source === "offline"
            ? booking.booking_source
            : "offline",
        vehiclePlateNumber: booking.vehicle_plate_number,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
        loyaltyPointsEarned: booking.loyalty_points_earned,
        bookingCode: booking.booking_code,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        customerEmail: booking.customer_email,
        totalPrice: booking.total_price,
        status: booking.status,
        isPickupService: booking.is_pickup_service,

        service: booking.services?.name || "Layanan tidak ditemukan",
        branch: booking.branches?.name || "Cabang tidak ditemukan",
        amount: booking.total_price,
        paymentProof: booking.payment_proof || null,
        branchAddress: booking.branches?.address || "",
        branchPhone: booking.branches?.phone || "",
        paymentMethod: booking.payment_method,
      }))

      setBookings(enrichedBookings)
      setTotal(total)
    } catch (err) {
      console.error("[v0] Error fetching bookings:", err)
      setError("Gagal memuat data booking")
      showErrorToast(err, "Gagal Memuat Data")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dikonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>
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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId)

      const { booking } = await apiClient.updateBooking(bookingId, { status: newStatus as any })

      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...booking } : b)))

      showSuccessToast("Status Berhasil Diperbarui", `Booking ${booking.booking_code} telah diperbarui`)
    } catch (err) {
      console.error("[v0] Error updating booking status:", err)
      showErrorToast(err, "Gagal Memperbarui Status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleCallCustomer = (booking: BookingWithDetails) => {
    sendWhatsAppNotification(booking);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Daftar Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Daftar Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState title="Gagal Memuat Data Booking" message={error} onRetry={fetchBookings} />
        </CardContent>
      </Card>
    )
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
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Belum ada booking yang tersedia
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium font-mono">
                        <div className="flex items-center gap-2">
                          <span>{booking.bookingCode}</span>
                          {booking.paymentProof && (
                            <span title="Bukti pembayaran tersedia">
                              <FileImage className="h-4 w-4 text-primary" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* show indicator if payment proof uploaded */}
                      
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
                          <p className="text-sm">
                            {format(booking.date ? new Date(booking.date + "T00:00:00") : new Date(), "dd MMM yyyy", { locale: id })}
                          </p>
                          <p className="text-sm text-muted-foreground">{booking.time} WIB</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(booking.totalPrice)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCallCustomer(booking)}
                            className="h-8 w-8 p-0"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={updatingStatus === booking.id}>
                                <span className="sr-only">Open menu</span>
                                {updatingStatus === booking.id ? (
                                  <Clock className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </DropdownMenuItem>
                              {booking.paymentProof && (
                                <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                  <FileImage className="mr-2 h-4 w-4" />
                                  Lihat Bukti Pembayaran
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {booking.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Konfirmasi
                                </DropdownMenuItem>
                              )}
                              {booking.status === "confirmed" && booking.isPickupService && (
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "picked-up")}> 
                                  <Car className="mr-2 h-4 w-4" /> 
                                  Jemput 
                                </DropdownMenuItem> 
                              )}
                              {booking.status === "confirmed" && !booking.isPickupService && (
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "in-progress")}> 
                                  <Clock className="mr-2 h-4 w-4" /> 
                                  Mulai Layanan 
                                </DropdownMenuItem> 
                              )}
                              {booking.status === "picked-up" && (
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
                              {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "picked-up") && (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {bookings.length ? (page - 1) * pageSize + 1 : 0}-
              {(page - 1) * pageSize + bookings.length} dari {total} booking
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm">
                Halaman {page} dari {Math.ceil(total / pageSize) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                Selanjutnya
              </Button>
            </div>
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
