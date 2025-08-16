import { createClient } from "./client"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadPaymentProof(file: File, bookingCode: string): Promise<UploadResult> {
  try {
    const supabase = createClient()

    // Generate unique filename with booking code
    const fileExt = file.name.split(".").pop()
    const fileName = `${bookingCode}-${Date.now()}.${fileExt}`
    const filePath = `payment-proofs/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("payment-proofs").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: "Failed to upload file",
    }
  }
}

export async function deletePaymentProof(url: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Extract file path from URL
    const urlParts = url.split("/storage/v1/object/public/payment-proofs/")
    if (urlParts.length < 2) {
      return false
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage.from("payment-proofs").remove([`payment-proofs/${filePath}`])

    if (error) {
      console.error("Delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}

export function getPaymentProofUrl(fileName: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from("payment-proofs").getPublicUrl(`payment-proofs/${fileName}`)

  return data.publicUrl
}

// Validate file before upload
export function validatePaymentProofFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    }
  }

  return { valid: true }
}
