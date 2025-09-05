"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ReportSummaryProps {
  summary: { totalRevenue: number; totalBookings: number; averageBookingValue: number } | null
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  const summaryData = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(summary?.totalRevenue || 0),
      icon: DollarSign,
      description: "pendapatan keseluruhan",
    },
    {
      title: "Total Booking",
      value: summary ? String(summary.totalBookings) : "0",
      icon: Calendar,
      description: "booking selesai",
    },
    {
      title: "Rata-rata per Booking",
      value: formatCurrency(summary?.averageBookingValue || 0),
      icon: TrendingUp,
      description: "nilai rata-rata",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaryData.map((item, index) => {
        const IconComponent = item.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
