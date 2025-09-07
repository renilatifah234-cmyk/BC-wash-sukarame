"use client"

import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { BookingList } from "@/components/admin/booking-list"
import { BookingFilters } from "@/components/admin/booking-filters"
import { BookingStats } from "@/components/admin/booking-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { apiClient, type Booking } from "@/lib/api-client"
import { BookingExport } from "@/components/admin/booking-export"

export default function AdminBookingsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  interface BookingFilterState {
    search: string
    status: string
    branch: string
    dateFrom?: Date
    dateTo?: Date
  }

  const [filters, setFilters] = useState<BookingFilterState>({
    search: "",
    status: "all",
    branch: "all",
    dateFrom: undefined,
    dateTo: undefined,
  })
  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .getBookings({ limit: 1000 })
        .then(({ bookings }) => {
          setBookings(bookings as Booking[])
        })
        .catch((error: Error) => {
          console.error("Error fetching bookings:", error)
        })
    }
  }, [isAuthenticated])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Kelola Booking</h1>
            <p className="text-muted-foreground mt-1">Kelola dan pantau semua booking pelanggan</p>
          </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <BookingExport searchTerm={filters.search} />
            <Button asChild className="h-11">
              <Link href="/admin/bookings/create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Buat Booking Manual
              </Link>
            </Button>
          </div>
        </div>

        <BookingStats bookings={bookings} /> {/* Pass bookings to BookingStats */}
        <BookingFilters onChange={(f) => setFilters(f)} />
        <BookingList filters={filters} />
      </div>
    </AdminLayout>
  )
}
