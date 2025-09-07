"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import jsPDF from "jspdf"

interface BookingExportProps {
  searchTerm?: string
}

export function BookingExport({ searchTerm }: BookingExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const fetchBookings = async () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    params.append("limit", "1000")
    const res = await fetch(`/api/bookings?${params.toString()}`)
    return res.json()
  }

  const exportCSV = (data: any) => {
    const rows = [
      ["Kode", "Nama", "Telepon", "Layanan", "Cabang", "Tanggal", "Waktu", "Total", "Status"],
      ...data.bookings.map((b: any) => [
        b.booking_code,
        b.customer_name,
        b.customer_phone,
        b.services?.name || "",
        b.branches?.name || "",
        b.booking_date,
        b.booking_time,
        b.total_price,
        b.status,
      ]),
    ]

    const csvContent = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `bookings-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = async (format: string) => {
    setIsExporting(true)
    try {
      const data = await fetchBookings()
      if (format === "excel") {
        exportCSV(data)
      } else if (format === "pdf") {
        const doc = new jsPDF()
        doc.text("Daftar Booking", 10, 10)
        data.bookings.forEach((b: any, i: number) => {
          doc.text(
            `${i + 1}. ${b.booking_code} - ${b.customer_name} - ${b.status}`,
            10,
            20 + i * 10,
          )
        })
        doc.save(`bookings-${Date.now()}.pdf`)
      }
    } catch (err) {
      console.error("Failed to export bookings", err)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} className="flex items-center gap-2 h-11">
          <Download className="w-4 h-4" />
          {isExporting ? "Mengekspor..." : "Ekspor"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format Ekspor</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" /> PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Cetak
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
