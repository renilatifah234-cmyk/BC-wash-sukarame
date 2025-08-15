"use client"

import { useState } from "react"
import { BookingSteps } from "@/components/booking/booking-steps"
import { ServiceSelection } from "@/components/booking/service-selection"
import { BranchTimeSelection } from "@/components/booking/branch-time-selection"
import { CustomerInfo } from "@/components/booking/customer-info"
import { PaymentInfo } from "@/components/booking/payment-info"
import { PaymentProof } from "@/components/booking/payment-proof"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { useSearchParams } from "next/navigation"
import type { Service, Branch } from "@/lib/dummy-data"

export interface BookingData {
  service?: Service
  branch?: Branch
  date?: string
  time?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  paymentProof?: File
  bookingCode?: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get("service")

  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({})

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            preselectedServiceId={preselectedService}
            onNext={nextStep}
            onServiceSelect={(service) => updateBookingData({ service })}
            selectedService={bookingData.service}
          />
        )
      case 2:
        return (
          <BranchTimeSelection
            onNext={nextStep}
            onPrev={prevStep}
            onSelect={(branch, date, time) => updateBookingData({ branch, date, time })}
            selectedBranch={bookingData.branch}
            selectedDate={bookingData.date}
            selectedTime={bookingData.time}
          />
        )
      case 3:
        return (
          <CustomerInfo
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={(customerData) => updateBookingData(customerData)}
            initialData={{
              customerName: bookingData.customerName,
              customerPhone: bookingData.customerPhone,
              customerEmail: bookingData.customerEmail,
            }}
          />
        )
      case 4:
        return <PaymentInfo onNext={nextStep} onPrev={prevStep} bookingData={bookingData} />
      case 5:
        return (
          <PaymentProof
            onNext={nextStep}
            onPrev={prevStep}
            onUpload={(file) => updateBookingData({ paymentProof: file })}
            bookingData={bookingData}
          />
        )
      case 6:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={() => {
              setCurrentStep(1)
              setBookingData({})
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <BookingSteps currentStep={currentStep} />
        <div className="mt-8">{renderStep()}</div>
      </div>
    </div>
  )
}
