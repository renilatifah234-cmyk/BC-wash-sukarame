import { toast } from "@/hooks/use-toast"

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

export class AppError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly isOperational: boolean

  constructor(message: string, status = 500, code = "INTERNAL_ERROR", isOperational = true) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.code = code
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network connection failed") {
    super(message, 0, "NETWORK_ERROR")
    this.name = "NetworkError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

// Error parsing utilities
export function parseApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: "UNKNOWN_ERROR",
    }
  }

  if (typeof error === "string") {
    return {
      message: error,
      status: 500,
      code: "STRING_ERROR",
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      message: String(error.message),
      status: "status" in error ? Number(error.status) : 500,
      code: "code" in error ? String(error.code) : "OBJECT_ERROR",
    }
  }

  return {
    message: "An unexpected error occurred",
    status: 500,
    code: "UNKNOWN_ERROR",
  }
}

// User-friendly error messages
export function getUserFriendlyMessage(error: ApiError): string {
  switch (error.code) {
    case "NETWORK_ERROR":
      return "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi."
    case "VALIDATION_ERROR":
      return error.message || "Data yang dimasukkan tidak valid."
    case "NOT_FOUND":
      return "Data yang dicari tidak ditemukan."
    case "UNAUTHORIZED":
      return "Anda tidak memiliki akses untuk melakukan tindakan ini."
    case "FORBIDDEN":
      return "Akses ditolak. Hubungi administrator jika diperlukan."
    default:
      if (error.status === 500) {
        return "Terjadi kesalahan pada server. Tim kami akan segera memperbaikinya."
      }
      return error.message || "Terjadi kesalahan yang tidak terduga."
  }
}

// Toast error handler
export function showErrorToast(error: unknown, title = "Terjadi Kesalahan") {
  const apiError = parseApiError(error)
  const message = getUserFriendlyMessage(apiError)

  toast({
    title,
    description: message,
    variant: "destructive",
  })

  console.error("[v0] Error shown to user:", apiError)
}

// Success toast helper
export function showSuccessToast(title: string, description?: string) {
  toast({
    title,
    description,
  })
}

// Retry mechanism
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      console.warn(`[v0] Attempt ${attempt} failed:`, lastError.message)

      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}

// Error logging utility
export function logError(error: Error, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "server",
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
    context,
  }

  console.error("[v0] Error logged:", errorInfo)

  // In production, send to error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTrackingService(errorInfo)
  }
}

// Form validation error handler
export function handleFormErrors(errors: Record<string, string[]>) {
  const firstError = Object.values(errors)[0]?.[0]
  if (firstError) {
    showErrorToast(new ValidationError(firstError), "Validasi Gagal")
  }
}

// Network status utilities
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

export function handleOfflineError() {
  if (!isOnline()) {
    showErrorToast(new NetworkError("Anda sedang offline. Periksa koneksi internet Anda."), "Koneksi Terputus")
    return true
  }
  return false
}
