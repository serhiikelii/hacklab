"use client"

import { Card } from "@/components/ui/card"
import { Power, Droplets, Smartphone, Wifi, Battery, Volume2 } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"
import Link from "next/link"

const issues = [
  {
    icon: Power,
    translationKey: 'notTurningOn' as const,
  },
  {
    icon: Droplets,
    translationKey: 'liquidDamage' as const,
  },
  {
    icon: Smartphone,
    translationKey: 'brokenGlass' as const,
  },
  {
    icon: Volume2,
    translationKey: 'speakerNotWorking' as const,
  },
  {
    icon: Wifi,
    translationKey: 'noNetwork' as const,
  },
  {
    icon: Battery,
    translationKey: 'notCharging' as const,
  },
]

export function CommonIssues() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">
          {t.commonIssuesTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {issues.map((issue, index) => (
            <Link key={index} href="/pricelist">
              <Card className="h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer bg-white border border-gray-200">
                <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="relative bg-cyan-50 p-4 rounded-full group-hover:bg-cyan-100 transition-colors">
                    <issue.icon className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-cyan-700 transition-colors">
                    {t[issue.translationKey]}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
