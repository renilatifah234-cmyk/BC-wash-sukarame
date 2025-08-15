"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function RevenueChart() {
  // Mock revenue data for the last 7 days
  const revenueData = [
    { day: "Sen", revenue: 850000, bookings: 18 },
    { day: "Sel", revenue: 920000, bookings: 22 },
    { day: "Rab", revenue: 780000, bookings: 16 },
    { day: "Kam", revenue: 1100000, bookings: 25 },
    { day: "Jum", revenue: 1350000, bookings: 28 },
    { day: "Sab", revenue: 1580000, bookings: 32 },
    { day: "Min", revenue: 1250000, bookings: 24 },
  ]

  const chartConfig = {
    revenue: {
      label: "Pendapatan",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Pendapatan 7 Hari Terakhir</CardTitle>
        <CardDescription>Grafik pendapatan harian dalam Rupiah</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                  />
                }
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
