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

        <ReportFilters />
        <ReportSummary />
        <ReportCharts />
      </div>
    </AdminLayout>
  )
}
