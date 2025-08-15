"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileImage, X, CheckCircle } from "lucide-react"
import type { BookingData } from "@/app/booking/page"
import { generateBookingCode } from "@/lib/dummy-data"

interface PaymentProofProps {
  onNext: () => void
  onPrev: () => void
  onUpload: (file: File) => void
  bookingData: BookingData
}

export function PaymentProof({ onNext, onPrev, onUpload, bookingData }: PaymentProofProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(bookingData.paymentProof || null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setUploadedFile(file)
      onUpload(file)
    } else {
      alert("Hanya file gambar yang diperbolehkan (JPG, PNG, dll)")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate booking code and proceed
    const bookingCode = generateBookingCode()
    onUpload(uploadedFile)

    setIsProcessing(false)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Upload Bukti Transfer</h1>
        <p className="text-muted-foreground mt-1">Upload foto atau screenshot bukti transfer Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Bukti Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Upload Bukti Transfer</h3>
              <p className="text-muted-foreground mb-4">
                Drag & drop file gambar di sini, atau klik untuk memilih file
              </p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
                Pilih File
              </Button>
              <p className="text-xs text-muted-foreground">Format yang didukung: JPG, PNG, GIF (Maks. 5MB)</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileImage className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">File berhasil diupload!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Bukti transfer Anda akan diverifikasi oleh tim kami</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Tips Upload Bukti Transfer:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pastikan foto jelas dan tidak buram</li>
              <li>• Tampilkan informasi lengkap: jumlah, tanggal, dan tujuan transfer</li>
              <li>• Gunakan format JPG atau PNG untuk kualitas terbaik</li>
              <li>• Ukuran file maksimal 5MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} size="lg" className="px-8 bg-transparent">
          Kembali
        </Button>
        <Button onClick={handleSubmit} disabled={!uploadedFile || isProcessing} size="lg" className="px-8">
          {isProcessing ? "Memproses..." : "Selesaikan Booking"}
        </Button>
      </div>
    </div>
  )
}
