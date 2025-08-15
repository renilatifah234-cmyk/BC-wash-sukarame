import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepsProps {
  currentStep: number
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const steps = [
    { number: 1, title: "Pilih Layanan", description: "Pilih jenis layanan" },
    { number: 2, title: "Waktu & Lokasi", description: "Pilih cabang dan waktu" },
    { number: 3, title: "Data Diri", description: "Isi informasi kontak" },
    { number: 4, title: "Pembayaran", description: "Info rekening transfer" },
    { number: 5, title: "Bukti Transfer", description: "Upload bukti bayar" },
    { number: 6, title: "Konfirmasi", description: "Booking berhasil" },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  currentStep > step.number ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
