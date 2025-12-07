"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

export function ServiceSection() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  const features = [
    t.feature1,
    t.feature2,
    t.feature3,
    t.feature4,
    t.feature5,
  ]

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src="/images/service-transparency.webp"
                alt="HACKLAB - We don't hack, we fix"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              {t.serviceSectionTitle}
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-700">
                {t.serviceSectionDescription}
              </p>

              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
