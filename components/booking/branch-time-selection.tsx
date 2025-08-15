"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Clock, Phone } from "lucide-react"
import { branches, type Branch } from "@/lib/dummy-data"
import { format, addDays, isToday, isTomorrow } from "date-fns"
import { id } from "date-fns/locale"

interface BranchTimeSelectionProps {
  onNext: () => void
  onPrev: () => void
  onSelect: (branch: Branch, date: string, time: string) => void
  selectedBranch?: Branch
  selectedDate?: string
  selectedTime?: string
}

export function BranchTimeSelection({
  onNext,
  onPrev,
  onSelect,
  selectedBranch,
  selectedDate,
  selectedTime,
}: BranchTimeSelectionProps) {
  const [branch, setBranch] = useState<Branch | undefined>(selectedBranch)
  const [date, setDate] = useState<Date | undefined>(selectedDate ? new Date(selectedDate) : undefined)
  const [time, setTime] = useState<string | undefined>(selectedTime)

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const handleBranchSelect = (selectedBranch: Branch) => {
    setBranch(selectedBranch)
    if (date && time) {
      onSelect(selectedBranch, format(date, "yyyy-MM-dd"), time)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (branch && selectedDate && time) {
      onSelect(branch, format(selectedDate, "yyyy-MM-dd"), time)
    }
  }

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
    if (branch && date) {
      onSelect(branch, format(date, "yyyy-MM-dd"), selectedTime)
    }
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Hari Ini"
    if (isTomorrow(date)) return "Besok"
    return format(date, "EEEE, dd MMMM yyyy", { locale: id })
  }

  const canProceed = branch && date && time

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Pilih Waktu & Lokasi</h1>
        <p className="text-muted-foreground mt-1">Tentukan cabang dan jadwal kunjungan Anda</p>
      </div>

      {/* Branch Selection */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold">Pilih Cabang</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {branches.map((branchOption) => (
            <Card
              key={branchOption.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                branch?.id === branchOption.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => handleBranchSelect(branchOption)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {branchOption.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{branchOption.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{branchOption.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {branchOption.operatingHours.open} - {branchOption.operatingHours.close} WIB
                  </span>
                </div>
                {branch?.id === branchOption.id && (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Terpilih
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      {branch && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-semibold">Pilih Tanggal</h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="rounded-md border"
              locale={id}
            />
          </div>
          {date && <p className="text-center text-sm text-muted-foreground">Tanggal terpilih: {getDateLabel(date)}</p>}
        </div>
      )}

      {/* Time Selection */}
      {branch && date && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-semibold">Pilih Waktu</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {timeSlots.map((timeSlot) => (
              <Button
                key={timeSlot}
                variant={time === timeSlot ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeSelect(timeSlot)}
                className="text-sm"
              >
                {timeSlot}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} size="lg" className="px-8 bg-transparent">
          Kembali
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="px-8">
          Lanjutkan ke Data Diri
        </Button>
      </div>
    </div>
  )
}
