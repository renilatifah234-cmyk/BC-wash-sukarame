"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react"

/**
 * Report Export Component
 *
 * Provides export functionality for admin reports in multiple formats.
 * Supports PDF, Excel export, and direct printing.
 */
interface ReportExportProps {
  filters?: { startDate?: string; endDate?: string; branchId?: string }
}

export function ReportExport({ filters }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const fetchReportData = async () => {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)
    if (filters?.branchId) params.append("branchId", filters.branchId)

    const res = await fetch(`/api/reports?${params.toString()}`)
    return res.json()
  }

  const exportCSV = (data: any) => {
    const rows = [
      ["Total Revenue", data.summary.totalRevenue],
      ["Total Bookings", data.summary.totalBookings],
      ["Average Booking Value", data.summary.averageBookingValue],
      [],
      ["Service", "Count", "Revenue"],
      ...data.serviceStats.map((s: any) => [s.name, s.count, s.revenue]),
      [],
      ["Branch", "Count", "Revenue"],
      ...data.branchStats.map((b: any) => [b.name, b.count, b.revenue]),
    ]

    const csvContent = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `report-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Handles report export in the specified format
   * @param format - Export format ('pdf' | 'excel')
   */
  const handleExport = async (format: string) => {
    setIsExporting(true)
    try {
      const data = await fetchReportData()
      if (format === "excel") {
        exportCSV(data)
      } else if (format === "pdf") {
        const doc = new jsPDF()
        doc.text("Laporan BC Wash", 10, 10)
        doc.text(`Total Revenue: ${data.summary.totalRevenue}`, 10, 20)
        doc.text(`Total Bookings: ${data.summary.totalBookings}`, 10, 30)
        doc.text(`Average Booking Value: ${data.summary.averageBookingValue}`, 10, 40)
        doc.save(`report-${Date.now()}.pdf`)
      }
    } catch (error) {
      console.error(`Failed to export report in ${format} format:`, error)
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Handles report printing using browser's print functionality
   */
  const handlePrint = () => {
    window.print()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? "Mengekspor..." : "Ekspor Laporan"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format Ekspor</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Cetak
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
