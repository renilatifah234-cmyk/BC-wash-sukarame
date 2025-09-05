"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Gift, Search, Star, TrendingUp, Users, Car } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  vehiclePlateNumbers: string[]
  totalBookings: number
  totalLoyaltyPoints: number
  joinDate: string
}

export function LoyaltyDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    totalLoyaltyPoints: 0,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const customerData = await apiClient.getCustomers()
      const mappedCustomers: Customer[] = customerData.customers.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        vehiclePlateNumbers: Array.isArray(c.vehicle_plate_numbers) ? c.vehicle_plate_numbers : [],
        totalBookings: c.total_bookings ?? 0,
        totalLoyaltyPoints: c.total_loyalty_points ?? 0,
        joinDate: c.join_date,
      }))
      setCustomers(mappedCustomers)
    } catch (err) {
      console.error("[v0] Error fetching customers:", err)
      setError("Gagal memuat data pelanggan")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.vehiclePlateNumbers.some((plate) => plate.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalCustomers = customers.length
  const totalLoyaltyPoints = customers.reduce((sum, customer) => sum + customer.totalLoyaltyPoints, 0)
  const averagePointsPerCustomer = totalCustomers > 0 ? Math.round(totalLoyaltyPoints / totalCustomers) : 0
  const totalVehicles = customers.reduce(
    (sum, customer) =>
      sum + (Array.isArray(customer.vehiclePlateNumbers) ? customer.vehiclePlateNumbers.length : 0),
    0,
  )

  const getCustomerTier = (points: number) => {
    if (points >= 200) return { name: "Platinum", color: "bg-purple-100 text-purple-800" }
    if (points >= 100) return { name: "Gold", color: "bg-yellow-100 text-yellow-800" }
    if (points >= 50) return { name: "Silver", color: "bg-gray-100 text-gray-800" }
    return { name: "Bronze", color: "bg-orange-100 text-orange-800" }
  }

  const handleViewCustomerDetail = async (customerId: string) => {
    try {
      const { customer } = await apiClient.getCustomerDetail(customerId)
      const mapped: Customer = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        vehiclePlateNumbers: Array.isArray(customer.vehicle_plate_numbers)
          ? customer.vehicle_plate_numbers
          : [],
        totalBookings: customer.total_bookings ?? 0,
        totalLoyaltyPoints: customer.total_loyalty_points ?? 0,
        joinDate: customer.join_date,
      }
      setDetailCustomer(mapped)
      setIsDetailDialogOpen(true)
    } catch (err) {
      console.error("[v0] Error fetching customer detail:", err)
      toast({
        title: "Gagal Memuat Detail",
        description: "Terjadi kesalahan saat memuat detail pelanggan.",
        variant: "destructive",
      })
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      totalLoyaltyPoints: customer.totalLoyaltyPoints,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return
    if (!editForm.name.trim() || !editForm.phone.trim()) {
      toast({
        title: "Input tidak valid",
        description: "Nama dan telepon wajib diisi",
        variant: "destructive",
      })
      return
    }
    setIsSaving(true)
    try {
      await apiClient.updateCustomer(editingCustomer.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        total_loyalty_points: editForm.totalLoyaltyPoints,
      })
      toast({ title: "Data pelanggan diperbarui" })
      setIsEditDialogOpen(false)
      setEditingCustomer(null)
      fetchCustomers()
    } catch (err) {
      console.error("[v0] Error updating customer:", err)
      toast({
        title: "Gagal memperbarui pelanggan",
        description: "Terjadi kesalahan saat memperbarui pelanggan",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Program Loyalitas</h1>
          <p className="text-muted-foreground mt-1">Memuat data pelanggan...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Program Loyalitas</h1>
          <p className="text-muted-foreground mt-1">Kelola poin loyalitas dan data pelanggan</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchCustomers}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Tidak ada pelanggan yang sesuai dengan pencarian." : "Belum ada pelanggan terdaftar."}
            </div>
          ) : (
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
                            {totalVehicles === 0 ? (
                              <span className="text-xs text-muted-foreground">-</span>
                            ) : (
                              customer.vehiclePlateNumbers.map((plate, index) => (
                                <Badge key={index} variant="outline" className="font-mono text-xs">
                                  {plate}
                                </Badge>
                              ))
                            )}
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
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => handleViewCustomerDetail(customer.id)}
                          >
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
          </DialogHeader>
          {detailCustomer ? (
            <div className="space-y-2">
              <p>
                <strong>Nama:</strong> {detailCustomer.name}
              </p>
              <p>
                <strong>Telepon:</strong> {detailCustomer.phone}
              </p>
              <p>
                <strong>Email:</strong> {detailCustomer.email || "-"}
              </p>
              <p>
                <strong>Poin:</strong> {detailCustomer.totalLoyaltyPoints}
              </p>
              <p>
                <strong>Gabung:</strong> {new Date(detailCustomer.joinDate).toLocaleDateString("id-ID")}
              </p>
              <div>
                <strong>Kendaraan:</strong>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {detailCustomer.vehiclePlateNumbers.length > 0 ? (
                    detailCustomer.vehiclePlateNumbers.map((plate, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono text-xs">
                        {plate}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>Perbarui informasi pelanggan dan poin loyalitas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Poin Loyalitas</Label>
              <Input
                id="points"
                type="number"
                value={editForm.totalLoyaltyPoints}
                onChange={(e) =>
                  setEditForm({ ...editForm, totalLoyaltyPoints: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSaveCustomer} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
          </DialogHeader>
          {detailCustomer ? (
            <div className="space-y-2">
              <p>
                <strong>Nama:</strong> {detailCustomer.name}
              </p>
              <p>
                <strong>Telepon:</strong> {detailCustomer.phone}
              </p>
              <p>
                <strong>Email:</strong> {detailCustomer.email || "-"}
              </p>
              <p>
                <strong>Poin:</strong> {detailCustomer.totalLoyaltyPoints}
              </p>
              <p>
                <strong>Gabung:</strong> {new Date(detailCustomer.joinDate).toLocaleDateString("id-ID")}
              </p>
              <div>
                <strong>Kendaraan:</strong>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {detailCustomer.vehiclePlateNumbers.length > 0 ? (
                    detailCustomer.vehiclePlateNumbers.map((plate, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono text-xs">
                        {plate}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>Perbarui informasi pelanggan dan poin loyalitas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Poin Loyalitas</Label>
              <Input
                id="points"
                type="number"
                value={editForm.totalLoyaltyPoints}
                onChange={(e) =>
                  setEditForm({ ...editForm, totalLoyaltyPoints: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSaveCustomer} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
