"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Plus,
  Edit,
  MoreHorizontal,
  Eye,
  EyeOff,
  Building,
  CreditCard,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  manager?: string
  staffCount?: number
  bankAccount: {
    bank: string
    accountNumber: string
    accountName: string
  }
  operatingHours: {
    open: string
    close: string
  }
  pickupCoverageRadius?: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newBranchData, setNewBranchData] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
    staffCount: 1,
    bankName: "",
    accountNumber: "",
    accountName: "",
    openTime: "08:00",
    closeTime: "18:00",
    pickupRadius: 10,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const branchData = await apiClient.getBranches()
      setBranches(branchData)
    } catch (err) {
      console.error("[v0] Error fetching branches:", err)
      setError("Gagal memuat data cabang")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (branchId: string, currentStatus: "active" | "inactive") => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      await apiClient.updateBranchStatus(branchId, newStatus)
      setBranches(branches.map((branch) => (branch.id === branchId ? { ...branch, status: newStatus } : branch)))
      toast({
        title: "Status Berhasil Diperbarui",
        description: `Cabang telah ${newStatus === "active" ? "diaktifkan" : "dinonaktifkan"}.`,
      })
    } catch (err) {
      console.error("[v0] Error updating branch status:", err)
      toast({
        title: "Gagal Memperbarui Status",
        description: "Terjadi kesalahan saat memperbarui status cabang.",
        variant: "destructive",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newBranchData.name.trim()) {
      newErrors.name = "Nama cabang wajib diisi"
    }

    if (!newBranchData.address.trim()) {
      newErrors.address = "Alamat wajib diisi"
    }

    if (!newBranchData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi"
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(newBranchData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format nomor telepon tidak valid"
    }

    if (!newBranchData.manager.trim()) {
      newErrors.manager = "Nama manager wajib diisi"
    }

    if (!newBranchData.bankName.trim()) {
      newErrors.bankName = "Nama bank wajib diisi"
    }

    if (!newBranchData.accountNumber.trim()) {
      newErrors.accountNumber = "Nomor rekening wajib diisi"
    }

    if (!newBranchData.accountName.trim()) {
      newErrors.accountName = "Nama pemilik rekening wajib diisi"
    }

    if (newBranchData.staffCount < 1) {
      newErrors.staffCount = "Jumlah staff minimal 1"
    }

    if (newBranchData.pickupRadius < 1 || newBranchData.pickupRadius > 50) {
      newErrors.pickupRadius = "Radius pickup harus antara 1-50 km"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setNewBranchData({
      name: "",
      address: "",
      phone: "",
      manager: "",
      staffCount: 1,
      bankName: "",
      accountNumber: "",
      accountName: "",
      openTime: "08:00",
      closeTime: "18:00",
      pickupRadius: 10,
    })
    setErrors({})
  }

  const handleAddBranch = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const branchData = {
        name: newBranchData.name,
        address: newBranchData.address,
        phone: newBranchData.phone,
        manager: newBranchData.manager,
        staffCount: newBranchData.staffCount,
        bankAccount: {
          bank: newBranchData.bankName,
          accountNumber: newBranchData.accountNumber,
          accountName: newBranchData.accountName,
        },
        operatingHours: {
          open: newBranchData.openTime,
          close: newBranchData.closeTime,
        },
        pickupCoverageRadius: newBranchData.pickupRadius,
      }

      const newBranch = await apiClient.createBranch(branchData)
      setBranches([...branches, newBranch])
      resetForm()
      setIsAddDialogOpen(false)
      toast({
        title: "Cabang Berhasil Ditambahkan",
        description: `Cabang "${newBranch.name}" telah ditambahkan ke sistem.`,
      })
    } catch (err) {
      console.error("[v0] Error creating branch:", err)
      toast({
        title: "Gagal Menambahkan Cabang",
        description: "Terjadi kesalahan saat menambahkan cabang. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setNewBranchData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager || "",
      staffCount: branch.staffCount || 1,
      bankName: branch.bankAccount.bank,
      accountNumber: branch.bankAccount.accountNumber,
      accountName: branch.bankAccount.accountName,
      openTime: branch.operatingHours.open,
      closeTime: branch.operatingHours.close,
      pickupRadius: branch.pickupCoverageRadius || 10,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateBranch = async () => {
    if (!validateForm() || !selectedBranch) return

    setIsSubmitting(true)
    try {
      const branchData = {
        name: newBranchData.name,
        address: newBranchData.address,
        phone: newBranchData.phone,
        manager: newBranchData.manager,
        staffCount: newBranchData.staffCount,
        bankAccount: {
          bank: newBranchData.bankName,
          accountNumber: newBranchData.accountNumber,
          accountName: newBranchData.accountName,
        },
        operatingHours: {
          open: newBranchData.openTime,
          close: newBranchData.closeTime,
        },
        pickupCoverageRadius: newBranchData.pickupRadius,
      }

      const updatedBranch = await apiClient.updateBranch(selectedBranch.id, branchData)
      setBranches(branches.map((branch) => (branch.id === selectedBranch.id ? updatedBranch : branch)))
      resetForm()
      setSelectedBranch(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Cabang Berhasil Diperbarui",
        description: `Cabang "${updatedBranch.name}" telah diperbarui.`,
      })
    } catch (err) {
      console.error("[v0] Error updating branch:", err)
      toast({
        title: "Gagal Memperbarui Cabang",
        description: "Terjadi kesalahan saat memperbarui cabang. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsViewDialogOpen(true)
  }

  const getStatusBadge = (status: "active" | "inactive") => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Nonaktif</Badge>
    )
  }

  const BranchFormFields = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Cabang *</Label>
          <Input
            id="name"
            value={newBranchData.name}
            onChange={(e) => setNewBranchData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="BC Wash Cabang..."
            className={errors.name ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon *</Label>
          <Input
            id="phone"
            value={newBranchData.phone}
            onChange={(e) => setNewBranchData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="0721-123456"
            className={errors.phone ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat Lengkap *</Label>
        <Textarea
          id="address"
          value={newBranchData.address}
          onChange={(e) => setNewBranchData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan, Kota"
          className={errors.address ? "border-destructive" : ""}
          rows={3}
          disabled={isSubmitting}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manager">Nama Manager *</Label>
          <Input
            id="manager"
            value={newBranchData.manager}
            onChange={(e) => setNewBranchData((prev) => ({ ...prev, manager: e.target.value }))}
            placeholder="Nama lengkap manager"
            className={errors.manager ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.manager && <p className="text-sm text-destructive">{errors.manager}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="staffCount">Jumlah Staff *</Label>
          <Input
            id="staffCount"
            type="number"
            min="1"
            value={newBranchData.staffCount}
            onChange={(e) =>
              setNewBranchData((prev) => ({ ...prev, staffCount: Number.parseInt(e.target.value) || 1 }))
            }
            className={errors.staffCount ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.staffCount && <p className="text-sm text-destructive">{errors.staffCount}</p>}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Jam Operasional
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openTime">Jam Buka</Label>
            <Select
              value={newBranchData.openTime}
              onValueChange={(value) => setNewBranchData((prev) => ({ ...prev, openTime: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, "0")
                  return (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeTime">Jam Tutup</Label>
            <Select
              value={newBranchData.closeTime}
              onValueChange={(value) => setNewBranchData((prev) => ({ ...prev, closeTime: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, "0")
                  return (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupRadius">Radius Layanan Pickup (km) *</Label>
        <Input
          id="pickupRadius"
          type="number"
          min="1"
          max="50"
          value={newBranchData.pickupRadius}
          onChange={(e) =>
            setNewBranchData((prev) => ({ ...prev, pickupRadius: Number.parseInt(e.target.value) || 10 }))
          }
          className={errors.pickupRadius ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.pickupRadius && <p className="text-sm text-destructive">{errors.pickupRadius}</p>}
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Informasi Rekening Bank
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Nama Bank *</Label>
            <Select
              value={newBranchData.bankName}
              onValueChange={(value) => setNewBranchData((prev) => ({ ...prev, bankName: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.bankName ? "border-destructive" : ""}>
                <SelectValue placeholder="Pilih bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="Mandiri">Mandiri</SelectItem>
                <SelectItem value="BRI">BRI</SelectItem>
                <SelectItem value="BNI">BNI</SelectItem>
                <SelectItem value="CIMB Niaga">CIMB Niaga</SelectItem>
                <SelectItem value="Danamon">Danamon</SelectItem>
                <SelectItem value="Permata">Permata</SelectItem>
              </SelectContent>
            </Select>
            {errors.bankName && <p className="text-sm text-destructive">{errors.bankName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Nomor Rekening *</Label>
            <Input
              id="accountNumber"
              value={newBranchData.accountNumber}
              onChange={(e) => setNewBranchData((prev) => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="1234567890"
              className={errors.accountNumber ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Nama Pemilik Rekening *</Label>
          <Input
            id="accountName"
            value={newBranchData.accountName}
            onChange={(e) => setNewBranchData((prev) => ({ ...prev, accountName: e.target.value }))}
            placeholder="BC Wash Cabang..."
            className={errors.accountName ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.accountName && <p className="text-sm text-destructive">{errors.accountName}</p>}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Manajemen Cabang</h2>
            <p className="text-muted-foreground mt-1">Memuat data cabang...</p>
          </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Manajemen Cabang</h2>
            <p className="text-muted-foreground mt-1">Kelola informasi dan status cabang BC Wash</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchBranches}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Manajemen Cabang</h2>
          <p className="text-muted-foreground mt-1">Kelola informasi dan status cabang BC Wash</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Tambah Cabang
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Cabang Baru</DialogTitle>
              <DialogDescription>Lengkapi informasi cabang baru yang akan ditambahkan ke sistem</DialogDescription>
            </DialogHeader>
            <BranchFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button onClick={handleAddBranch} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  "Tambah Cabang"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Daftar Cabang</CardTitle>
        </CardHeader>
        <CardContent>
          {branches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada cabang yang tersedia. Tambahkan cabang pertama Anda.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Cabang</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{branch.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{branch.manager || "Tidak ada"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{branch.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {branch.operatingHours.open} - {branch.operatingHours.close}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{branch.staffCount || 0} orang</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(branch.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(new Date(branch.createdAt), "dd MMM yyyy", { locale: id })}</p>
                          <p className="text-muted-foreground">
                            {format(new Date(branch.createdAt), "HH:mm", { locale: id })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewBranch(branch)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditBranch(branch)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Cabang
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusToggle(branch.id, branch.status)}>
                              {branch.status === "active" ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Aktifkan
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cabang</DialogTitle>
            <DialogDescription>Perbarui informasi cabang {selectedBranch?.name}</DialogDescription>
          </DialogHeader>
          <BranchFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleUpdateBranch} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Branch Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {selectedBranch?.name}
            </DialogTitle>
            <DialogDescription>Detail lengkap informasi cabang</DialogDescription>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informasi Umum</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>{selectedBranch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedBranch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {selectedBranch.operatingHours.open} - {selectedBranch.operatingHours.close} WIB
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Manager: {selectedBranch.manager || "Tidak ada"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status & Layanan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>Status:</span>
                      {getStatusBadge(selectedBranch.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Jumlah Staff:</span>
                      <Badge variant="secondary">{selectedBranch.staffCount || 0} orang</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Radius Pickup:</span>
                      <span>{selectedBranch.pickupCoverageRadius || 0} km</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Informasi Rekening
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span className="font-medium">{selectedBranch.bankAccount.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. Rekening:</span>
                    <span className="font-mono">{selectedBranch.bankAccount.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atas Nama:</span>
                    <span className="font-medium">{selectedBranch.bankAccount.accountName}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>Dibuat:</span>
                  <p>{format(new Date(selectedBranch.createdAt), "dd MMMM yyyy, HH:mm", { locale: id })}</p>
                </div>
                <div>
                  <span>Terakhir Diperbarui:</span>
                  <p>{format(new Date(selectedBranch.updatedAt), "dd MMMM yyyy, HH:mm", { locale: id })}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
