"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gift, Search, Star, TrendingUp, Users, Car } from "lucide-react"
import { useState } from "react"
import { sampleCustomers } from "@/lib/dummy-data"

export function LoyaltyDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = sampleCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.vehiclePlateNumbers.some((plate) => plate.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalCustomers = sampleCustomers.length
  const totalLoyaltyPoints = sampleCustomers.reduce((sum, customer) => sum + customer.totalLoyaltyPoints, 0)
  const averagePointsPerCustomer = Math.round(totalLoyaltyPoints / totalCustomers)
  const totalVehicles = sampleCustomers.reduce((sum, customer) => sum + customer.vehiclePlateNumbers.length, 0)

  const getCustomerTier = (points: number) => {
    if (points >= 200) return { name: "Platinum", color: "bg-purple-100 text-purple-800" }
    if (points >= 100) return { name: "Gold", color: "bg-yellow-100 text-yellow-800" }
    if (points >= 50) return { name: "Silver", color: "bg-gray-100 text-gray-800" }
    return { name: "Bronze", color: "bg-orange-100 text-orange-800" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Program Loyalitas</h1>
        <p className="text-muted-foreground mt-1">Kelola poin loyalitas dan data pelanggan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Poin</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoyaltyPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Poin yang beredar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Poin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePointsPerCustomer}</div>
            <p className="text-xs text-muted-foreground">Per pelanggan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="font-serif text-xl">Daftar Pelanggan Loyalitas</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari nama, telepon, atau plat nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Total Booking</TableHead>
                  <TableHead>Poin Loyalitas</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const tier = getCustomerTier(customer.totalLoyaltyPoints)
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.vehiclePlateNumbers.map((plate, index) => (
                            <Badge key={index} variant="outline" className="font-mono text-xs">
                              {plate}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{customer.totalBookings}</p>
                          <p className="text-xs text-muted-foreground">kali</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{customer.totalLoyaltyPoints}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={tier.color}>{tier.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(customer.joinDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
