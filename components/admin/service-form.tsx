"use client"

import { useState, type FormEvent } from "react"
import { Car, Crown, Bike } from "lucide-react"

export interface ServiceFormData {
  name: string
  category: string
  price: number
  description: string
  duration: number
  features: string[]
  supports_pickup: boolean
  pickup_fee: number
}

interface ServiceFormProps {
  initialData?: ServiceFormData
  onSubmit: (data: ServiceFormData) => void
  isSubmitting?: boolean
  buttonLabel?: string
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

export function ServiceForm({ initialData, onSubmit, isSubmitting = false, buttonLabel = "Submit" }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialData || initialFormData)
  const [featuresInput, setFeaturesInput] = useState(initialData?.features?.join(", ") || "")
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({})

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const serviceData = {
      ...formData,
      features: featuresInput
        ? featuresInput
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f)
        : [],
    }

    onSubmit(serviceData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Cuci Mobil Premium"
            className={`w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-input"
            } px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            <option value="car-regular">Mobil Regular</option>
            <option value="car-premium">Mobil Premium</option>
            <option value="motorcycle">Motor</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Deskripsi <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi detail layanan..."
          className={`w-full rounded-md border ${
            errors.description ? "border-red-500" : "border-input"
          } px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]`}
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Harga (IDR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
            placeholder="35000"
            className={`w-full rounded-md border ${
              errors.price ? "border-red-500" : "border-input"
            } px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isSubmitting}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Durasi (menit) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
            placeholder="45"
            className={`w-full rounded-md border ${
              errors.duration ? "border-red-500" : "border-input"
            } px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isSubmitting}
          />
          {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Fitur Bonus (pisahkan dengan koma)</label>
        <input
          type="text"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          placeholder="Gratis 1 Minuman, Vacuum Interior"
          className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">Contoh: Gratis 1 Minuman, Vacuum Interior</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="supportsPickup"
            checked={formData.supports_pickup}
            onChange={(e) => setFormData({ ...formData, supports_pickup: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isSubmitting}
          />
          <label htmlFor="supportsPickup" className="text-sm font-medium">
            Mendukung Layanan Pickup
          </label>
        </div>

        {formData.supports_pickup && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Biaya Pickup (IDR)</label>
            <input
              type="number"
              value={formData.pickup_fee}
              onChange={(e) => setFormData({ ...formData, pickup_fee: Number.parseInt(e.target.value) || 0 })}
              placeholder="15000"
              className={`w-full rounded-md border ${
                errors.pickup_fee ? "border-red-500" : "border-input"
              } px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={isSubmitting}
            />
            {errors.pickup_fee && <p className="text-sm text-red-500">{errors.pickup_fee}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
