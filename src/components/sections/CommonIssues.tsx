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
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {t.commonIssuesTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {issues.map((issue, index) => (
            <Link key={index} href="/pricelist">
              <Card className="h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer bg-white border border-gray-200">
                <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="relative bg-gray-50 p-4 rounded-full">
                    <issue.icon className="w-8 h-8 text-[#0c5373]" />
                  </div>
                  <h3 className="font-semibold text-[#0c5373] text-sm md:text-base">
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
