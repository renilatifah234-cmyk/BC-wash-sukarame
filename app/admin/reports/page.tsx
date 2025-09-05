"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ReportFilters } from "@/components/admin/report-filters"
import { ReportCharts } from "@/components/admin/report-charts"
import { ReportSummary } from "@/components/admin/report-summary"
import { ReportExport } from "@/components/admin/report-export"

export default function AdminReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string; branchId?: string }>({})
  const [summary, setSummary] = useState<{ totalRevenue: number; totalBookings: number; averageBookingValue: number } | null>(null)
  const [serviceStats, setServiceStats] = useState<{ name: string; count: number; revenue: number }[]>([])
  const [branchStats, setBranchStats] = useState<{ name: string; count: number; revenue: number }[]>([])
  const [reportLoading, setReportLoading] = useState(false)
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

  const fetchReport = async () => {
    try {
      setReportLoading(true)
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      if (filters.branchId) params.append("branchId", filters.branchId)

      const res = await fetch(`/api/reports?${params.toString()}`)
      const data = await res.json()
      setSummary(data.summary)
      setServiceStats(data.serviceStats || [])
      setBranchStats(data.branchStats || [])
    } catch (error) {
      console.error("Failed to fetch report:", error)
    } finally {
      setReportLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Laporan & Analisis</h1>
            <p className="text-muted-foreground mt-1">Analisis performa bisnis dan laporan keuangan</p>
          </div>
          <ReportExport />
        </div>

        <ReportFilters onChange={setFilters} />
        {reportLoading ? (
          <div className="text-center py-10">Memuat laporan...</div>
        ) : (
          <>
            <ReportSummary summary={summary} />
            <ReportCharts serviceStats={serviceStats} branchStats={branchStats} />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
