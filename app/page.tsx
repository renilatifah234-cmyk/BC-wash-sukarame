"use client"

import { Hero } from "@/components/customer/hero"
import { ServiceCategories } from "@/components/customer/service-categories"
import { WhyChooseUs } from "@/components/customer/why-choose-us"
import { ContactInfo } from "@/components/customer/contact-info"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ServiceCategories />
      <WhyChooseUs />
      <ContactInfo />
    </div>
  )
}
