"use client"

import React, { useState, useEffect, type Dispatch, type SetStateAction } from "react"
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
  latitude?: number | null
  longitude?: number | null
  createdAt: string
  updatedAt: string
}

interface BranchFormData {
  name: string
  address: string
  phone: string
  manager: string
  staffCount: string
  bankName: string
  accountNumber: string
  accountName: string
  openTime: string
  closeTime: string
  pickupRadius: string
  latitude?: string
  longitude?: string
}

const BranchFormFields = React.memo(function BranchFormFields({
  newBranchData,
  errors,
  isSubmitting,
  setNewBranchData,
}: {
  newBranchData: BranchFormData
  errors: Record<string, string>
  isSubmitting: boolean
  setNewBranchData: Dispatch<SetStateAction<BranchFormData>>
}) {
  return (
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
            onChange={(e) => setNewBranchData((prev) => ({ ...prev, staffCount: e.target.value }))}
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
          onChange={(e) => setNewBranchData((prev) => ({ ...prev, pickupRadius: e.target.value }))}
          className={errors.pickupRadius ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.pickupRadius && <p className="text-sm text-destructive">{errors.pickupRadius}</p>}
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          Koordinat Lokasi (Opsional)
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              value={newBranchData.latitude ?? ""}
              onChange={(e) => setNewBranchData((prev) => ({ ...prev, latitude: e.target.value }))}
              placeholder="-5.397140"
              className={errors.latitude ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              value={newBranchData.longitude ?? ""}
              onChange={(e) => setNewBranchData((prev) => ({ ...prev, longitude: e.target.value }))}
              placeholder="105.266640"
              className={errors.longitude ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
          </div>
        </div>

        {/* Lightweight map preview without API key */}
        {newBranchData.latitude && newBranchData.longitude && (
          <div className="rounded-md overflow-hidden border">
            <iframe
              title="branch-map-preview"
              width="100%"
              height="220"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(newBranchData.latitude)},${encodeURIComponent(newBranchData.longitude)}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
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
})

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newBranchData, setNewBranchData] = useState<BranchFormData>({
    name: "",
    address: "",
    phone: "",
    manager: "",
    staffCount: "1",
    bankName: "",
    accountNumber: "",
    accountName: "",
    openTime: "08:00",
    closeTime: "18:00",
    pickupRadius: "10",
    latitude: "",
    longitude: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchBranches()
  }, [])

  // Normalize API branch payload to UI-friendly shape
  const mapBranch = (branch: any): Branch => {
    return {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager ?? "",
      staffCount: branch.staffCount ?? branch.staff_count ?? 0,
      bankAccount: {
        bank: branch.bankAccount?.bank ?? branch.bank_name ?? "",
        accountNumber: branch.bankAccount?.accountNumber ?? branch.bank_account_number ?? "",
        accountName: branch.bankAccount?.accountName ?? branch.bank_account_name ?? "",
      },
      operatingHours: {
        open:
          branch.operatingHours?.open ?? branch.operating_hours_open ?? "08:00",
        close:
          branch.operatingHours?.close ?? branch.operating_hours_close ?? "18:00",
      },
      pickupCoverageRadius:
        branch.pickupCoverageRadius ?? branch.pickup_coverage_radius ?? 0,
      status: branch.status === "inactive" ? "inactive" : "active",
      latitude: branch.latitude ?? null,
      longitude: branch.longitude ?? null,
      createdAt: branch.createdAt ?? branch.created_at ?? "",
      updatedAt: branch.updatedAt ?? branch.updated_at ?? "",
    }
  }

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const branchData = await apiClient.getBranches()
      const formattedBranches = branchData.branches.map(mapBranch)
      setBranches(formattedBranches)
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
    } else if (!/^\d+$/.test(newBranchData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Nomor telepon hanya boleh angka"
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

    const staffCountNum = parseInt(String(newBranchData.staffCount || "0"), 10)
    if (!Number.isFinite(staffCountNum) || staffCountNum < 1) {
      newErrors.staffCount = "Jumlah staff minimal 1"
    }

    const pickupRadiusNum = parseInt(String(newBranchData.pickupRadius || "0"), 10)
    if (!Number.isFinite(pickupRadiusNum) || pickupRadiusNum < 1 || pickupRadiusNum > 50) {
      newErrors.pickupRadius = "Radius pickup harus antara 1-50 km"
    }

    // Optional: simple numeric check for lat/lng when provided
    if (newBranchData.latitude && isNaN(Number(newBranchData.latitude))) {
      newErrors.latitude = "Latitude harus berupa angka"
    }
    if (newBranchData.longitude && isNaN(Number(newBranchData.longitude))) {
      newErrors.longitude = "Longitude harus berupa angka"
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
      staffCount: "1",
      bankName: "",
      accountNumber: "",
      accountName: "",
      openTime: "08:00",
      closeTime: "18:00",
      pickupRadius: "10",
      latitude: "",
      longitude: "",
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
        staffCount: parseInt(newBranchData.staffCount, 10),
        bankAccount: {
          bank: newBranchData.bankName,
          accountNumber: newBranchData.accountNumber,
          accountName: newBranchData.accountName,
        },
        operatingHours: {
          open: newBranchData.openTime,
          close: newBranchData.closeTime,
        },
        pickupCoverageRadius: parseInt(newBranchData.pickupRadius, 10),
        latitude: newBranchData.latitude ? Number(newBranchData.latitude) : undefined,
        longitude: newBranchData.longitude ? Number(newBranchData.longitude) : undefined,
      }

      const { branch: newBranch } = await apiClient.createBranch(branchData)
      const mapped = mapBranch(newBranch)
      setBranches([...branches, mapped])
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
      staffCount: String(branch.staffCount || 1),
      bankName: branch.bankAccount.bank,
      accountNumber: branch.bankAccount.accountNumber,
      accountName: branch.bankAccount.accountName,
      openTime: branch.operatingHours.open,
      closeTime: branch.operatingHours.close,
      pickupRadius: String(branch.pickupCoverageRadius || 10),
      latitude: branch.latitude != null ? String(branch.latitude) : "",
      longitude: branch.longitude != null ? String(branch.longitude) : "",
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
        staffCount: parseInt(newBranchData.staffCount, 10),
        bankAccount: {
          bank: newBranchData.bankName,
          accountNumber: newBranchData.accountNumber,
          accountName: newBranchData.accountName,
        },
        operatingHours: {
          open: newBranchData.openTime,
          close: newBranchData.closeTime,
        },
        pickupCoverageRadius: parseInt(newBranchData.pickupRadius, 10),
        latitude: newBranchData.latitude ? Number(newBranchData.latitude) : undefined,
        longitude: newBranchData.longitude ? Number(newBranchData.longitude) : undefined,
      }

      const { branch: updatedBranch } = await apiClient.updateBranch(selectedBranch.id, branchData)
      const mapped = mapBranch(updatedBranch)
      setBranches(branches.map((branch) => (branch.id === selectedBranch.id ? mapped : branch)))
      resetForm()
      setSelectedBranch(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Cabang Berhasil Diperbarui",
        description: `Cabang "${mapped.name}" telah diperbarui.`,
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

  const safeFormatDate = (value?: string) => {
    if (!value) return "-"
    const date = new Date(value)
    if (isNaN(date.getTime())) return "-"
    try {
      return format(date, "dd MMMM yyyy, HH:mm", { locale: id })
    } catch {
      return "-"
    }
  }

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
            <BranchFormFields
              newBranchData={newBranchData}
              errors={errors}
              isSubmitting={isSubmitting}
              setNewBranchData={setNewBranchData}
            />
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
                          <p>{safeFormatDate(branch.createdAt)}</p>
                          <p className="text-muted-foreground">
                            {safeFormatDate(branch.updatedAt)}
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
          <BranchFormFields
            newBranchData={newBranchData}
            errors={errors}
            isSubmitting={isSubmitting}
            setNewBranchData={setNewBranchData}
          />
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
                  <p>{safeFormatDate(selectedBranch.createdAt)}</p>
                </div>
                <div>
                  <span>Terakhir Diperbarui:</span>
                  <p>{safeFormatDate(selectedBranch.updatedAt)}</p>
                </div>
              </div>

              {(selectedBranch.latitude != null && selectedBranch.longitude != null) && (
                <div className="space-y-2">
                  <Separator />
                  <h4 className="font-semibold">Lokasi Cabang</h4>
                  <div className="text-sm">Lat: {selectedBranch.latitude}, Lng: {selectedBranch.longitude}</div>
                  <div className="rounded-md overflow-hidden border">
                    <iframe
                      title="branch-map"
                      width="100%"
                      height="220"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(String(selectedBranch.latitude))},${encodeURIComponent(String(selectedBranch.longitude))}&z=15&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <a
                    className="text-primary underline text-sm"
                    href={`https://maps.google.com/?q=${encodeURIComponent(String(selectedBranch.latitude))},${encodeURIComponent(String(selectedBranch.longitude))}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka di Google Maps
                  </a>
                </div>
              )}
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
