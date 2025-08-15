"use client"

import { useState } from "react"
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
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Car, Bike, Crown, Clock, MapPin, DollarSign } from "lucide-react"
import { services, formatCurrency, type Service } from "@/lib/dummy-data"

interface ServiceFormData {
  name: string
  category: Service["category"]
  price: number
  description: string
  duration: number
  features: string[]
  supportsPickup: boolean
  pickupFee: number
}

const initialFormData: ServiceFormData = {
  name: "",
  category: "car-regular",
  price: 0,
  description: "",
  duration: 30,
  features: [],
  supportsPickup: false,
  pickupFee: 0,
}

export function ServiceManagement() {
  const [serviceList, setServiceList] = useState<Service[]>(services)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [featuresInput, setFeaturesInput] = useState("")
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({})

  const getCategoryName = (category: Service["category"]) => {
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

  const getCategoryColor = (category: Service["category"]) => {
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

  const getCategoryIcon = (category: Service["category"]) => {
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
    if (formData.supportsPickup && formData.pickupFee < 0) {
      newErrors.pickupFee = "Biaya pickup tidak boleh negatif"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setFeaturesInput("")
    setErrors({})
  }

  const handleCreateService = () => {
    if (!validateForm()) return

    const newService: Service = {
      id: `service-${Date.now()}`,
      ...formData,
      features: featuresInput
        ? featuresInput
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f)
        : undefined,
    }

    setServiceList([...serviceList, newService])
    setIsCreateDialogOpen(false)
    resetForm()
    toast({
      title: "Layanan Berhasil Ditambahkan",
      description: `Layanan "${newService.name}" telah ditambahkan ke sistem.`,
    })
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
      supportsPickup: service.supportsPickup || false,
      pickupFee: service.pickupFee || 0,
    })
    setFeaturesInput(service.features?.join(", ") || "")
    setIsEditDialogOpen(true)
  }

  const handleUpdateService = () => {
    if (!validateForm() || !editingService) return

    const updatedService: Service = {
      ...editingService,
      ...formData,
      features: featuresInput
        ? featuresInput
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f)
        : undefined,
    }

    setServiceList(serviceList.map((s) => (s.id === editingService.id ? updatedService : s)))
    setIsEditDialogOpen(false)
    setEditingService(null)
    resetForm()
    toast({
      title: "Layanan Berhasil Diperbarui",
      description: `Layanan "${updatedService.name}" telah diperbarui.`,
    })
  }

  const handleDeleteService = (service: Service) => {
    setServiceList(serviceList.filter((s) => s.id !== service.id))
    toast({
      title: "Layanan Berhasil Dihapus",
      description: `Layanan "${service.name}" telah dihapus dari sistem.`,
      variant: "destructive",
    })
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
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.category}
            onValueChange={(value: Service["category"]) => setFormData({ ...formData, category: value })}
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
        />
        <p className="text-sm text-muted-foreground">Contoh: Gratis 1 Minuman, Vacuum Interior</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="supportsPickup"
            checked={formData.supportsPickup}
            onCheckedChange={(checked) => setFormData({ ...formData, supportsPickup: checked })}
          />
          <Label htmlFor="supportsPickup">Mendukung Layanan Pickup</Label>
        </div>

        {formData.supportsPickup && (
          <div className="space-y-2">
            <Label htmlFor="pickupFee">Biaya Pickup (IDR)</Label>
            <Input
              id="pickupFee"
              type="number"
              value={formData.pickupFee}
              onChange={(e) => setFormData({ ...formData, pickupFee: Number.parseInt(e.target.value) || 0 })}
              placeholder="15000"
              className={errors.pickupFee ? "border-red-500" : ""}
            />
            {errors.pickupFee && <p className="text-sm text-red-500">{errors.pickupFee}</p>}
          </div>
        )}
      </div>
    </div>
  )

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
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateService}>Tambah Layanan</Button>
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
                          {service.supportsPickup ? (
                            <span className="text-green-600">Ya ({formatCurrency(service.pickupFee || 0)})</span>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateService}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
