"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceForm, type ServiceFormData } from "./service-form"
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
import { Plus, Edit, Trash2, Car, Bike, Crown, Clock, MapPin, DollarSign, Star } from "lucide-react"
import { apiClient, type Service } from "@/lib/api-client"
import { ErrorState } from "@/components/ui/error-state"
import { showErrorToast, showSuccessToast } from "@/lib/error-utils"
import { formatCurrency } from "@/lib/utils"

export function ServiceManagement() {
  const [serviceList, setServiceList] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
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

  const handleCreateService = async (data: ServiceFormData) => {
    setIsSubmitting(true)
    try {
      const { service: newService } = await apiClient.createService(data)
      setServiceList([...serviceList, newService])
      setIsCreateDialogOpen(false)
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
    setIsEditDialogOpen(true)
  }

  const handleUpdateService = async (data: ServiceFormData) => {
    if (!editingService) return

    setIsSubmitting(true)
    try {
      const { service: updatedService } = await apiClient.updateService(editingService.id, data)
      setServiceList(serviceList.map((s) => (s.id === editingService.id ? updatedService : s)))
      setIsEditDialogOpen(false)
      setEditingService(null)
      showSuccessToast("Layanan Berhasil Diperbarui", `Layanan "${updatedService.name}" telah diperbarui.`)
    } catch (err) {
      console.error("[v0] Error updating service:", err)
      showErrorToast(err, "Gagal Memperbarui Layanan")
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleDeleteService = async (service: Service) => {
  //   try {
  //     await apiClient.deleteService(service.id)
  //     setServiceList(serviceList.filter((s) => s.id !== service.id))
  //     showSuccessToast("Layanan Berhasil Dihapus", `Layanan "${service.name}" telah dihapus dari sistem.`)
  //   } catch (err) {
  //     console.error("[v0] Error deleting service:", err)
  //     showErrorToast(err, "Gagal Menghapus Layanan")
  //   }
  // }

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
            {/* <Button onClick={resetForm}> */}
            <Button>
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
            <ServiceForm 
              onSubmit={handleCreateService}
              isSubmitting={isSubmitting}
              buttonLabel={isSubmitting ? "Menambahkan..." : "Tambah Layanan"}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                Batal
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
            <CardDescription>Total {serviceList.filter(service => service.is_active).length} layanan aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceList.filter(service => service.is_active).length === 0 ? (
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
                    <TableHead>Poin</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceList.filter(service => service.is_active).map((service) => {
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
                            <Star className="w-3 h-3 text-yellow-500" />
                            {service.loyalty_points_reward ?? 0}
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
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {service.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Aktif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Non-Aktif
                              </Badge>
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
          <ServiceForm 
            onSubmit={handleUpdateService}
            isSubmitting={isSubmitting}
            buttonLabel={isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            initialData={editingService ? {
              name: editingService.name,
              category: editingService.category,
              price: editingService.price,
              description: editingService.description,
              duration: editingService.duration,
              features: editingService.features || [],
              supports_pickup: editingService.supports_pickup || false,
              pickup_fee: editingService.pickup_fee || 0,
              is_active: editingService.is_active,
              loyalty_points_reward: editingService.loyalty_points_reward ?? 0,
            } : undefined}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
