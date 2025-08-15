import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">BC Wash Sukarame</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Layanan cuci mobil dan motor profesional dengan teknologi terdepan di Sukarame
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/booking">Booking Sekarang</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Link href="/services">Lihat Layanan</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <img
                src="/modern-car-wash.png"
                alt="BC Wash Sukarame - Fasilitas cuci mobil modern"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
