"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react"

export function ReportExport() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: string) => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real app, this would generate and download the actual file
    console.log(`Exporting report in ${format} format`)

    setIsExporting(false)
  }

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
