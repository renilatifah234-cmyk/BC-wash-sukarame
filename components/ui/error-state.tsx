"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  showRetry?: boolean
  variant?: "default" | "network" | "not-found" | "unauthorized"
  className?: string
}

export function ErrorState({
  title,
  message,
  error,
  onRetry,
  showRetry = true,
  variant = "default",
  className,
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (variant) {
      case "network":
        return {
          icon: WifiOff,
          defaultTitle: "Koneksi Bermasalah",
          defaultMessage: "Periksa koneksi internet Anda dan coba lagi.",
          color: "text-orange-600",
        }
      case "not-found":
        return {
          icon: AlertTriangle,
          defaultTitle: "Data Tidak Ditemukan",
          defaultMessage: "Data yang Anda cari tidak tersedia.",
          color: "text-blue-600",
        }
      case "unauthorized":
        return {
          icon: AlertTriangle,
          defaultTitle: "Akses Ditolak",
          defaultMessage: "Anda tidak memiliki izin untuk mengakses data ini.",
          color: "text-red-600",
        }
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: "Terjadi Kesalahan",
          defaultMessage: "Terjadi kesalahan yang tidak terduga.",
          color: "text-red-600",
        }
    }
  }

  const config = getErrorConfig()
  const IconComponent = config.icon

  const displayTitle = title || config.defaultTitle
  const displayMessage = message || config.defaultMessage
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center ${config.color}`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{displayTitle}</h3>
            <p className="text-muted-foreground">{displayMessage}</p>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-4 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Komponen error spesifik
export function NetworkErrorState({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return <ErrorState variant="network" onRetry={onRetry} className={className} />
}

export function NotFoundErrorState({
  resource = "Data",
  onRetry,
  className,
}: {
  resource?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <ErrorState
      variant="not-found"
      title={`${resource} Tidak Ditemukan`}
      message={`${resource} yang Anda cari tidak tersedia atau telah dihapus.`}
      onRetry={onRetry}
      showRetry={!!onRetry}
      className={className}
    />
  )
}

export function UnauthorizedErrorState({ className }: { className?: string }) {
  return <ErrorState variant="unauthorized" showRetry={false} className={className} />
}
