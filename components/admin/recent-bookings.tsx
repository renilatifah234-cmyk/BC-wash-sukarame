"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/dummy-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

export function RecentBookings() {
  // Mock recent bookings data
  const recentBookings = [
    {
      id: "BCW001",
      customerName: "Ahmad Rizki",
      service: "Cuci Mobil Kecil Hidrolik",
      amount: 45000,
      status: "confirmed" as const,
      date: new Date("2024-01-15T10:00:00"),
      branch: "Sukarame Utama",
    },
    {
      id: "BCW002",
      customerName: "Sari Dewi",
      service: "Cuci Motor Sedang Steam",
      amount: 15000,
      status: "pending" as const,
      date: new Date("2024-01-15T14:00:00"),
      branch: "Sukarame Cabang 2",
    },
    {
      id: "BCW003",
      customerName: "Budi Santoso",
      service: "Fogging Anti Bakteri",
      amount: 75000,
      status: "in-progress" as const,
      date: new Date("2024-01-15T16:00:00"),
      branch: "Sukarame Utama",
    },
    {
      id: "BCW004",
      customerName: "Maya Putri",
      service: "Cuci Mobil Besar Non-Hidrolik",
      amount: 40000,
      status: "completed" as const,
      date: new Date("2024-01-15T11:30:00"),
      branch: "Sukarame Utama",
    },
    {
      id: "BCW005",
      customerName: "Andi Wijaya",
      service: "Cuci Motor Kecil Steam",
      amount: 13000,
      status: "cancelled" as const,
      date: new Date("2024-01-15T09:00:00"),
      branch: "Sukarame Cabang 2",
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-xl">Booking Terbaru</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{booking.customerName}</span>
                  <span className="text-xs text-muted-foreground">#{booking.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">{booking.service}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{format(booking.date, "dd MMM, HH:mm", { locale: id })}</span>
                  <span>•</span>
                  <span>{booking.branch}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-sm">{formatCurrency(booking.amount)}</p>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
