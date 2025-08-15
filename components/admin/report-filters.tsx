"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function ReportFilters() {
  const [dateRange, setDateRange] = useState("this-month")
  const [branchFilter, setBranchFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [customDateFrom, setCustomDateFrom] = useState<Date>()
  const [customDateTo, setCustomDateTo] = useState<Date>()

  const dateRangeOptions = [
    { value: "today", label: "Hari Ini" },
    { value: "yesterday", label: "Kemarin" },
    { value: "this-week", label: "Minggu Ini" },
    { value: "last-week", label: "Minggu Lalu" },
    { value: "this-month", label: "Bulan Ini" },
    { value: "last-month", label: "Bulan Lalu" },
    { value: "this-year", label: "Tahun Ini" },
    { value: "custom", label: "Kustom" },
  ]

  const getDateRangeText = () => {
    const today = new Date()
    switch (dateRange) {
      case "today":
        return format(today, "dd MMM yyyy", { locale: id })
      case "yesterday":
        return format(subDays(today, 1), "dd MMM yyyy", { locale: id })
      case "this-month":
        return (
          format(startOfMonth(today), "dd MMM", { locale: id }) +
          " - " +
          format(endOfMonth(today), "dd MMM yyyy", { locale: id })
        )
      case "last-month":
        const lastMonth = subMonths(today, 1)
        return (
          format(startOfMonth(lastMonth), "dd MMM", { locale: id }) +
          " - " +
          format(endOfMonth(lastMonth), "dd MMM yyyy", { locale: id })
        )
      case "custom":
        if (customDateFrom && customDateTo) {
          return (
            format(customDateFrom, "dd MMM", { locale: id }) +
            " - " +
            format(customDateTo, "dd MMM yyyy", { locale: id })
          )
        }
        return "Pilih tanggal"
      default:
        return "Pilih periode"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Periode Laporan</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {dateRange !== "custom" && <p className="text-xs text-muted-foreground">{getDateRangeText()}</p>}
          </div>

          {dateRange === "custom" && (
            <>
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDateFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateFrom ? format(customDateFrom, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={customDateFrom} onSelect={setCustomDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDateTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateTo ? format(customDateTo, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={customDateTo} onSelect={setCustomDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Cabang</Label>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih cabang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Cabang</SelectItem>
                <SelectItem value="sukarame-main">Sukarame Utama</SelectItem>
                <SelectItem value="sukarame-branch2">Sukarame Cabang 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kategori Layanan</Label>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Layanan</SelectItem>
                <SelectItem value="car-regular">Mobil Regular</SelectItem>
                <SelectItem value="car-premium">Mobil Premium</SelectItem>
                <SelectItem value="motorcycle">Motor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
