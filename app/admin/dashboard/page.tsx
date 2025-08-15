"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { RevenueChart } from "@/components/admin/revenue-chart"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan operasional BC Wash Sukarame</p>
        </div>

        <DashboardStats />

        <div className="grid lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RecentBookings />
        </div>
      </div>
    </AdminLayout>
  )
}
