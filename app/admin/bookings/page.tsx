"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { BookingList } from "@/components/admin/booking-list"
import { BookingFilters } from "@/components/admin/booking-filters"
import { BookingStats } from "@/components/admin/booking-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client" // Import apiClient
import { Booking, BookingApiResponse } from "@/lib/types" // Import Booking and BookingApiResponse types

export default function AdminBookingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([]) // State for bookings
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      // Fetch bookings when authenticated
      apiClient.getBookings() // Use apiClient.getBookings()
        .then((data: BookingApiResponse) => { // Type the data parameter
          setBookings(data.bookings); // Assuming the API returns data in the format { bookings: Booking[] }
        })
        .catch((error: Error) => { // Type the error parameter
          console.error("Error fetching bookings:", error);
          // Handle error appropriately, e.g., show a message to the user
        });
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Kelola Booking</h1>
            <p className="text-muted-foreground mt-1">Kelola dan pantau semua booking pelanggan</p>
          </div>
          <Button asChild>
            <Link href="/admin/bookings/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Buat Booking Manual
            </Link>
          </Button>
        </div>

        <BookingStats bookings={bookings} /> {/* Pass bookings to BookingStats */}
        <BookingFilters />
        <BookingList />
      </div>
    </AdminLayout>
  )
}
