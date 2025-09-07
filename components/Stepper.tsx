"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  currentStep: number
  onStepChange?: (step: number) => void
}

const steps = [
  { label: "Pilih Layanan" },
  { label: "Waktu & Lokasi" },
  { label: "Data Diri" },
  { label: "Pembayaran" },
  { label: "Verifikasi" },
]

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 justify-between sm:justify-between min-w-max sm:min-w-0 py-2">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1
          const completed = stepNumber < currentStep
          const active = stepNumber === currentStep
          const clickable = completed
          return (
            <button
              key={step.label}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepChange?.(stepNumber)}
              className="flex flex-col items-center text-xs flex-shrink-0"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                  completed || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {completed ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <span className={cn("whitespace-nowrap", !active && !completed && "text-muted-foreground")}>{
                step.label
              }</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
