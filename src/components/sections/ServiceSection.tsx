"use client"

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
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
              <div className="text-8xl">📱</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.serviceSectionTitle}
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-700">
                {t.serviceSectionDescription}
              </p>

              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-gray-700 mt-6">
                {t.bulkDiscountText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
