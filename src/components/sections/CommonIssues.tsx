"use client"

import { Card } from "@/components/ui/card"
import { Power, Droplets, Smartphone, WifiOff, BatteryCharging, VolumeX } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

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
    icon: WifiOff,
    translationKey: 'noNetwork' as const,
  },
  {
    icon: BatteryCharging,
    translationKey: 'notCharging' as const,
  },
  {
    icon: VolumeX,
    translationKey: 'speakerNotWorking' as const,
  },
]

export function CommonIssues() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t.commonIssuesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {issues.map((issue, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-lg transition-shadow duration-300 group cursor-default"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gray-100 p-5 rounded-full group-hover:bg-gray-200 transition-colors">
                  <issue.icon className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {t[issue.translationKey]}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
