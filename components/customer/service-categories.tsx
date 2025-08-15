import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Bike, Crown, Zap } from "lucide-react"
import Link from "next/link"

export function ServiceCategories() {
  const categories = [
    {
      id: "car-regular",
      title: "Cuci Mobil Regular",
      description: "Layanan cuci mobil standar dengan kualitas terbaik",
      icon: Car,
      priceRange: "30.000 - 40.000",
      services: ["Cuci Mobil Kecil Non-Hidrolik", "Cuci Mobil Sedang/Besar Non-Hidrolik", "Cuci Steam Cepat"],
    },
    {
      id: "car-premium",
      title: "Cuci Mobil Premium",
      description: "Layanan premium dengan teknologi hidrolik dan bonus minuman",
      icon: Crown,
      priceRange: "45.000 - 75.000",
      services: ["Cuci Mobil Hidrolik + Gratis Minuman", "Fogging Anti Bakteri", "Penghilang Noda Kaca"],
    },
    {
      id: "motorcycle",
      title: "Cuci Motor",
      description: "Layanan cuci motor steam untuk semua ukuran",
      icon: Bike,
      priceRange: "13.000 - 18.000",
      services: ["Cuci Motor Kecil Steam", "Cuci Motor Sedang Steam", "Cuci Motor Besar Steam"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Pilihan Layanan Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Berbagai paket layanan cuci kendaraan dengan teknologi modern dan harga terjangkau
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Mulai dari</p>
                    <p className="text-2xl font-bold text-primary">IDR {category.priceRange}</p>
                  </div>
                  <div className="space-y-2">
                    {category.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-6">
                    <Link href={`/services?category=${category.id}`}>Pilih Layanan</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
