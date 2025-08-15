"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Mail } from "lucide-react"

interface CustomerInfoProps {
  onNext: () => void
  onPrev: () => void
  onSubmit: (data: { customerName: string; customerPhone: string; customerEmail: string }) => void
  initialData?: {
    customerName?: string
    customerPhone?: string
    customerEmail?: string
  }
}

export function CustomerInfo({ onNext, onPrev, onSubmit, initialData }: CustomerInfoProps) {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || "",
    customerPhone: initialData?.customerPhone || "",
    customerEmail: initialData?.customerEmail || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Nama lengkap wajib diisi"
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Nomor telepon wajib diisi"
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.customerPhone.replace(/\s/g, ""))) {
      newErrors.customerPhone = "Format nomor telepon tidak valid"
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Format email tidak valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onNext()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Data Diri</h1>
        <p className="text-muted-foreground mt-1">Lengkapi informasi kontak Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className={errors.customerName ? "border-destructive" : ""}
              />
              {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Nomor Telepon
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="Contoh: 08123456789"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                className={errors.customerPhone ? "border-destructive" : ""}
              />
              {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="contoh@email.com"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                className={errors.customerEmail ? "border-destructive" : ""}
              />
              {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail}</p>}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onPrev} size="lg" className="px-8 bg-transparent">
                Kembali
              </Button>
              <Button type="submit" size="lg" className="px-8">
                Lanjutkan ke Pembayaran
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
