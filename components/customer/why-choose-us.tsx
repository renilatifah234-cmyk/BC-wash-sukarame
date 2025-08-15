import { Shield, Clock, Users, Award } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Kualitas Terjamin",
      description: "Menggunakan produk pembersih berkualitas tinggi dan aman untuk kendaraan Anda",
    },
    {
      icon: Clock,
      title: "Pelayanan Cepat",
      description: "Proses cuci yang efisien dengan waktu tunggu minimal",
    },
    {
      icon: Users,
      title: "Tenaga Ahli",
      description: "Dikerjakan oleh tenaga profesional yang berpengalaman",
    },
    {
      icon: Award,
      title: "Harga Terjangkau",
      description: "Tarif kompetitif dengan kualitas layanan premium",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Mengapa Memilih BC Wash?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Komitmen kami untuk memberikan layanan terbaik dengan standar kualitas tinggi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
