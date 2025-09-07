"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type StatusKey = "pending" | "confirmed" | "picked-up" | "in-progress" | "completed" | "cancelled"

const defaultTemplates: Record<StatusKey, string> = {
  pending:
    "Halo {customerName},\n\nTerima kasih telah melakukan booking.\n📌 Kode: {bookingCode}\n🛠 Layanan: {service}\n📅 Jadwal: {date} {time}\n🏢 Cabang: {branch}\n\nStatus: Menunggu konfirmasi dan verifikasi pembayaran.",
  confirmed:
    "Halo {customerName},\n\nBooking Anda sudah dikonfirmasi.\n📌 Kode: {bookingCode}\n🛠 Layanan: {service}\n📅 Jadwal: {date} {time}\n🏢 Cabang: {branch}\n\nSampai jumpa tepat waktu!",
  "in-progress":
    "Halo {customerName},\n\nKendaraan Anda sedang dalam proses pengerjaan.\n📌 Kode: {bookingCode}\n🛠 Layanan: {service}",
  "picked-up":
    "Halo {customerName},\n\nKendaraan Anda sedang dijemput oleh tim kami.\n📌 Kode: {bookingCode}\n🛠 Layanan: {service}",
  completed:
    "Halo {customerName},\n\nLayanan telah selesai. Terima kasih!\n📌 Kode: {bookingCode}\n🛠 Layanan: {service}",
  cancelled:
    "Halo {customerName},\n\nBooking Anda dibatalkan. Jika ini tidak sesuai, hubungi admin.\n📌 Kode: {bookingCode}",
}

const storageKey = (k: StatusKey) => `notif_template_${k}`

export function NotificationTemplates() {
  const [templates, setTemplates] = useState<Record<StatusKey, string>>({ ...defaultTemplates })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loaded: any = {}
    ;(Object.keys(defaultTemplates) as StatusKey[]).forEach((k) => {
      const v = typeof window !== "undefined" ? localStorage.getItem(storageKey(k)) : null
      loaded[k] = v || defaultTemplates[k]
    })
    setTemplates(loaded)
  }, [])

  const save = () => {
    ;(Object.keys(templates) as StatusKey[]).forEach((k) => {
      localStorage.setItem(storageKey(k), templates[k])
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const resetOne = (k: StatusKey) => {
    setTemplates((p) => ({ ...p, [k]: defaultTemplates[k] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Template Notifikasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Gunakan placeholder: {"{customerName}"}, {"{bookingCode}"}, {"{service}"}, {"{date}"}, {"{time}"}, {"{branch}"}
        </div>
        {(Object.keys(templates) as StatusKey[]).map((k) => (
          <div key={k} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize">{k.replace("-", " ")}</Label>
              <Button type="button" variant="ghost" onClick={() => resetOne(k)}>Reset</Button>
            </div>
            <Textarea
              rows={4}
              value={templates[k]}
              onChange={(e) => setTemplates((p) => ({ ...p, [k]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button type="button" onClick={save}>Simpan Template</Button>
          {saved && <span className="text-sm text-green-600">Tersimpan</span>}
        </div>
      </CardContent>
    </Card>
  )
}
