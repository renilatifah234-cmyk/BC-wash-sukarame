"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Car, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/dummy-data"

export function ReportSummary() {
  // Mock report data - in real app, this would come from API based on filters
  const summaryData = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(15750000),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "dari periode sebelumnya",
    },
    {
      title: "Total Booking",
      value: "342",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Calendar,
      description: "booking selesai",
    },
    {
      title: "Pelanggan Unik",
      value: "186",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
      description: "pelanggan berbeda",
    },
    {
      title: "Layanan Terpopuler",
      value: "Cuci Mobil Hidrolik",
      change: "45%",
      changeType: "neutral" as const,
      icon: Car,
      description: "dari total booking",
    },
    {
      title: "Rata-rata per Booking",
      value: formatCurrency(46053),
      change: "+3.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "nilai rata-rata",
    },
    {
      title: "Tingkat Pembatalan",
      value: "2.1%",
      change: "-0.5%",
      changeType: "positive" as const,
      icon: TrendingDown,
      description: "dari total booking",
    },
  ]

  const getChangeColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-muted-foreground"
    }
  }

  const getChangeIcon = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />
      case "negative":
        return <TrendingDown className="w-3 h-3" />
      default:
        return null
    }
  }

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
              <div className="flex items-center gap-1 text-xs">
                <span className={`flex items-center gap-1 ${getChangeColor(item.changeType)}`}>
                  {getChangeIcon(item.changeType)}
                  {item.change}
                </span>
                <span className="text-muted-foreground">{item.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
