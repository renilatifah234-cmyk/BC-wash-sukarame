"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Car, Bike, Crown, Clock, MapPin, DollarSign } from "lucide-react"
import { apiClient, type Service } from "@/lib/api-client"
import { ErrorState } from "@/components/ui/error-state"
import { showErrorToast, showSuccessToast } from "@/lib/error-utils"
import { formatCurrency } from "@/lib/utils"

interface ServiceFormData {
  name: string
  category: string
  price: number
  description: string
  duration: number
  features: string[]
  supports_pickup: boolean
  pickup_fee: number
}

const initialFormData: ServiceFormData = {
  name: "",
  category: "car-regular",
  price: 0,
  description: "",
  duration: 30,
  features: [],
  supports_pickup: false,
  pickup_fee: 0,
}

export function ServiceManagement() {
  const [serviceList, setServiceList] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [featuresInput, setFeaturesInput] = useState("")
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const { services } = await apiClient.getServices()
      setServiceList(services)
    } catch (err) {
      console.error("[v0] Error fetching services:", err)
      const errorMessage = "Gagal memuat data layanan"
      setError(errorMessage)
      showErrorToast(err, "Gagal Memuat Layanan")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "car-regular":
        return "Mobil Regular"
      case "car-premium":
        return "Mobil Premium"
      case "motorcycle":
        return "Motor"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "car-regular":
        return "bg-blue-100 text-blue-800"
      case "car-premium":
        return "bg-purple-100 text-purple-800"
      case "motorcycle":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "car-regular":
        return Car
      case "car-premium":
        return Crown
      case "motorcycle":
        return Bike
      default:
        return Car
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama layanan wajib diisi"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi layanan wajib diisi"
    }
    if (formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0"
    }
    if (formData.duration <= 0) {
      newErrors.duration = "Durasi harus lebih dari 0"
    }
    if (formData.supports_pickup && formData.pickup_fee < 0) {
      newErrors.pickup_fee = "Biaya pickup tidak boleh negatif"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setFeaturesInput("")
    setErrors({})
  }

  const handleCreateService = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const serviceData = {
        ...formData,
        features: featuresInput
          ? featuresInput
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f)
          : [],
      }

      const { service: newService } = await apiClient.createService(serviceData)
      setServiceList([...serviceList, newService])
      setIsCreateDialogOpen(false)
      resetForm()
      showSuccessToast("Layanan Berhasil Ditambahkan", `Layanan "${newService.name}" telah ditambahkan ke sistem.`)
    } catch (err) {
      console.error("[v0] Error creating service:", err)
      showErrorToast(err, "Gagal Menambahkan Layanan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      duration: service.duration,
      features: service.features || [],
      supports_pickup: service.supports_pickup || false,
      pickup_fee: service.pickup_fee || 0,
    })
    setFeaturesInput(service.features?.join(", ") || "")
    setIsEditDialogOpen(true)
  }

  const handleUpdateService = async () => {
    if (!validateForm() || !editingService) return

    setIsSubmitting(true)
    try {
      const serviceData = {
        ...formData,
        features: featuresInput
          ? featuresInput
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f)
          : [],
      }

      const { service: updatedService } = await apiClient.updateService(editingService.id, serviceData)
      setServiceList(serviceList.map((s) => (s.id === editingService.id ? updatedService : s)))
      setIsEditDialogOpen(false)
      setEditingService(null)
      resetForm()
      showSuccessToast("Layanan Berhasil Diperbarui", `Layanan "${updatedService.name}" telah diperbarui.`)
    } catch (err) {
      console.error("[v0] Error updating service:", err)
      showErrorToast(err, "Gagal Memperbarui Layanan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteService = async (service: Service) => {
    try {
      await apiClient.deleteService(service.id)
      setServiceList(serviceList.filter((s) => s.id !== service.id))
      showSuccessToast("Layanan Berhasil Dihapus", `Layanan "${service.name}" telah dihapus dari sistem.`)
    } catch (err) {
      console.error("[v0] Error deleting service:", err)
      showErrorToast(err, "Gagal Menghapus Layanan")
    }
  }

  const ServiceForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Layanan *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Cuci Mobil Premium"
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.category}
            onValueChange={(value: string) => setFormData({ ...formData, category: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car-regular">Mobil Regular</SelectItem>
              <SelectItem value="car-premium">Mobil Premium</SelectItem>
              <SelectItem value="motorcycle">Motor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi detail layanan..."
          className={errors.description ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Harga (IDR) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
            placeholder="35000"
            className={errors.price ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Durasi (menit) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
            placeholder="45"
            className={errors.duration ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Fitur Bonus (pisahkan dengan koma)</Label>
        <Input
          id="features"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          placeholder="Gratis 1 Minuman, Vacuum Interior"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">Contoh: Gratis 1 Minuman, Vacuum Interior</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="supportsPickup"
            checked={formData.supports_pickup}
            onCheckedChange={(checked) => setFormData({ ...formData, supports_pickup: checked })}
            disabled={isSubmitting}
          />
          <Label htmlFor="supportsPickup">Mendukung Layanan Pickup</Label>
        </div>

        {formData.supports_pickup && (
          <div className="space-y-2">
            <Label htmlFor="pickupFee">Biaya Pickup (IDR)</Label>
            <Input
              id="pickupFee"
              type="number"
              value={formData.pickup_fee}
              onChange={(e) => setFormData({ ...formData, pickup_fee: Number.parseInt(e.target.value) || 0 })}
              placeholder="15000"
              className={errors.pickup_fee ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.pickup_fee && <p className="text-sm text-red-500">{errors.pickup_fee}</p>}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Kelola Layanan</h1>
            <p className="text-muted-foreground mt-1">Memuat data layanan...</p>
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
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Kelola Layanan</h1>
            <p className="text-muted-foreground mt-1">Kelola semua layanan yang tersedia di seluruh cabang</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ErrorState title="Gagal Memuat Layanan" message={error} onRetry={fetchServices} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Kelola Layanan</h1>
          <p className="text-muted-foreground mt-1">Kelola semua layanan yang tersedia di seluruh cabang</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Layanan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Layanan Baru</DialogTitle>
              <DialogDescription>
                Tambahkan layanan baru yang akan tersedia di seluruh cabang BC Wash.
              </DialogDescription>
            </DialogHeader>
            <ServiceForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button onClick={handleCreateService} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  "Tambah Layanan"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Daftar Layanan
            </CardTitle>
            <CardDescription>Total {serviceList.length} layanan tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada layanan yang tersedia. Tambahkan layanan pertama Anda.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceList.map((service) => {
                    const IconComponent = getCategoryIcon(service.category)
                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                            {service.features && service.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {service.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(service.category)}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {getCategoryName(service.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            {formatCurrency(service.price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {service.duration} menit
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {service.supports_pickup ? (
                              <span className="text-green-600">Ya ({formatCurrency(service.pickup_fee || 0)})</span>
                            ) : (
                              <span className="text-muted-foreground">Tidak</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus layanan "{service.name}"? Tindakan ini tidak dapat
                                    dibatalkan dan akan mempengaruhi semua cabang.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteService(service)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Layanan</DialogTitle>
            <DialogDescription>Perbarui informasi layanan. Perubahan akan berlaku di seluruh cabang.</DialogDescription>
          </DialogHeader>
          <ServiceForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleUpdateService} disabled={isSubmitting}>
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
    </div>
  )
}
