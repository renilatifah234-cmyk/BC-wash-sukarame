"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ReportCharts() {
  // Mock chart data
  const revenueData = [
    { month: "Jan", revenue: 1200000, bookings: 28 },
    { month: "Feb", revenue: 1350000, bookings: 32 },
    { month: "Mar", revenue: 1180000, bookings: 26 },
    { month: "Apr", revenue: 1420000, bookings: 35 },
    { month: "May", revenue: 1580000, bookings: 38 },
    { month: "Jun", revenue: 1750000, bookings: 42 },
  ]

  const serviceData = [
    { name: "Cuci Mobil Regular", value: 45, color: "#3b82f6" },
    { name: "Cuci Mobil Premium", value: 30, color: "#8b5cf6" },
    { name: "Cuci Motor", value: 25, color: "#10b981" },
  ]

  const branchData = [
    { branch: "Sukarame Utama", revenue: 9500000, bookings: 215 },
    { branch: "Sukarame Cabang 2", revenue: 6250000, bookings: 127 },
  ]

  const chartConfig = {
    revenue: {
      label: "Pendapatan",
      color: "hsl(var(--primary))",
    },
    bookings: {
      label: "Booking",
      color: "hsl(var(--secondary))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Tren Pendapatan Bulanan</CardTitle>
          <CardDescription>Pendapatan dan jumlah booking per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
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
                      formatter={(value, name) => [
                        name === "revenue" ? `Rp ${Number(value).toLocaleString("id-ID")}` : value,
                        name === "revenue" ? "Pendapatan" : "Booking",
                      ]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-revenue)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Service Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Distribusi Layanan</CardTitle>
          <CardDescription>Persentase booking berdasarkan kategori layanan</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [`${value}%`, name]} />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {serviceData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branch Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Performa Cabang</CardTitle>
          <CardDescription>Perbandingan pendapatan antar cabang</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} layout="horizontal">
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis
                  type="category"
                  dataKey="branch"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  width={120}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        name === "revenue" ? `Rp ${Number(value).toLocaleString("id-ID")}` : value,
                        name === "revenue" ? "Pendapatan" : "Booking",
                      ]}
                    />
                  }
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Performa Harian</CardTitle>
          <CardDescription>Booking per hari dalam minggu terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { day: "Sen", bookings: 18 },
                  { day: "Sel", bookings: 22 },
                  { day: "Rab", bookings: 16 },
                  { day: "Kam", bookings: 25 },
                  { day: "Jum", bookings: 28 },
                  { day: "Sab", bookings: 32 },
                  { day: "Min", bookings: 24 },
                ]}
              >
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [value, "Booking"]} />} />
                <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
