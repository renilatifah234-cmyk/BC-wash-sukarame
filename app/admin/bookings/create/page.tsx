"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ManualBookingForm } from "@/components/admin/manual-booking-form"
import { ManualBookingSuccess } from "@/components/admin/manual-booking-success"

export default function CreateBookingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingCode, setBookingCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
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

  const handleSuccess = (code: string) => {
    setBookingCode(code)
  }

  const handleNewBooking = () => {
    setBookingCode(null)
  }

  const handleBackToList = () => {
    router.push("/admin/bookings")
  }

  const handleCancel = () => {
    router.push("/admin/bookings")
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {bookingCode ? (
          <ManualBookingSuccess
            bookingCode={bookingCode}
            onNewBooking={handleNewBooking}
            onBackToList={handleBackToList}
          />
        ) : (
          <ManualBookingForm onSuccess={handleSuccess} onCancel={handleCancel} />
        )}
      </div>
    </AdminLayout>
  )
}
