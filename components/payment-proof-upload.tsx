"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { uploadPaymentProof, validatePaymentProofFile, type UploadResult } from "@/lib/supabase/storage"
import Image from "next/image"

interface PaymentProofUploadProps {
  bookingCode: string
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: string) => void
  existingProofUrl?: string
  disabled?: boolean
}

export default function PaymentProofUpload({
  bookingCode,
  onUploadComplete,
  onUploadError,
  existingProofUrl,
  disabled = false,
}: PaymentProofUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingProofUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validasi file
    const validation = validatePaymentProofFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      onUploadError?.(validation.error || "Invalid file")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const result: UploadResult = await uploadPaymentProof(file, bookingCode)

      if (result.success && result.url) {
        setUploadedUrl(result.url)
        onUploadComplete?.(result.url)
      } else {
        setError(result.error || "Upload failed")
        onUploadError?.(result.error || "Upload failed")
      }
    } catch (err) {
      const errorMessage = "Failed to upload payment proof"
      setError(errorMessage)
      onUploadError?.(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="payment-proof">Bukti Pembayaran</Label>
        <p className="text-sm text-gray-600 mt-1">Upload bukti transfer/pembayaran (JPEG, PNG, WebP, max 5MB)</p>
      </div>

      {/* input file tersembunyi */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* area upload */}
      {!uploadedUrl ? (
        <div
          onClick={triggerFileSelect}
          className={`
            border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
            hover:border-gray-400 transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${uploading ? "opacity-50 cursor-wait" : ""}
          `}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600">
            {uploading ? "Mengupload..." : "Klik untuk memilih file atau drag & drop"}
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">Bukti pembayaran berhasil diupload</span>
              </div>
              {!disabled && (
                <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* pratinjau gambar */}
            <div className="mt-3">
              <Image
                src={uploadedUrl || "/placeholder.svg"}
                alt="Payment proof"
                width={200}
                height={150}
                className="rounded border object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* pesan error */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* tombol upload untuk mobile/opsi lain */}
      {!uploadedUrl && !uploading && (
        <Button onClick={triggerFileSelect} variant="outline" disabled={disabled} className="w-full bg-transparent">
          <Upload className="h-4 w-4 mr-2" />
          Pilih File Bukti Pembayaran
        </Button>
      )}
    </div>
  )
}
