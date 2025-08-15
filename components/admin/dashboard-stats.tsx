"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Car, Users, TrendingUp, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/dummy-data"

export function DashboardStats() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Booking Hari Ini",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Calendar,
      description: "dari kemarin",
    },
    {
      title: "Pendapatan Hari Ini",
      value: formatCurrency(1250000),
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "dari kemarin",
    },
    {
      title: "Layanan Aktif",
      value: "11",
      change: "0%",
      changeType: "neutral" as const,
      icon: Car,
      description: "total layanan",
    },
    {
      title: "Pelanggan Baru",
      value: "8",
      change: "+25%",
      changeType: "positive" as const,
      icon: Users,
      description: "minggu ini",
    },
    {
      title: "Rata-rata Waktu Layanan",
      value: "45 min",
      change: "-5%",
      changeType: "positive" as const,
      icon: Clock,
      description: "lebih cepat",
    },
    {
      title: "Tingkat Kepuasan",
      value: "4.8/5",
      change: "+0.2",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "rating rata-rata",
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <span className={getChangeColor(stat.changeType)}>{stat.change}</span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
