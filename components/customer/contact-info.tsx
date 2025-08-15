import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock } from "lucide-react"
import { branches } from "@/lib/dummy-data"
import Link from "next/link"

export function ContactInfo() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Lokasi & Kontak</h2>
          <p className="text-lg text-muted-foreground">
            Kunjungi cabang terdekat atau hubungi kami untuk informasi lebih lanjut
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {branches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {branch.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{branch.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">{branch.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">
                    {branch.operatingHours.open} - {branch.operatingHours.close} WIB
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/booking">Mulai Booking Sekarang</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
