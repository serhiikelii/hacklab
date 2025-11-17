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
    hoverColor: 'group-hover:bg-red-500',
    hoverIconColor: 'group-hover:text-white',
  },
  {
    icon: Droplets,
    translationKey: 'liquidDamage' as const,
    hoverColor: 'group-hover:bg-blue-500',
    hoverIconColor: 'group-hover:text-white',
  },
  {
    icon: Smartphone,
    translationKey: 'brokenGlass' as const,
    hoverColor: 'group-hover:bg-gray-100',
    hoverIconColor: 'group-hover:text-gray-500',
    crackEffect: true,
  },
  {
    icon: Volume2,
    translationKey: 'speakerNotWorking' as const,
    hoverColor: 'group-hover:bg-yellow-500',
    hoverIconColor: 'group-hover:text-white',
    strikethrough: true,
  },
  {
    icon: Wifi,
    translationKey: 'noNetwork' as const,
    hoverColor: 'group-hover:bg-blue-600',
    hoverIconColor: 'group-hover:text-white',
    strikethrough: true,
  },
  {
    icon: Battery,
    translationKey: 'notCharging' as const,
    hoverColor: 'group-hover:bg-gray-100',
    hoverIconColor: 'group-hover:text-gray-500',
    batteryEffect: true,
  },
]

export function CommonIssues() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {issues.map((issue, index) => (
            <Link key={index} href="/pricelist">
              <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
                <div className={`relative bg-gray-100 p-4 rounded-full transition-all duration-300 ${issue.hoverColor}`}>
                  <issue.icon className={`w-8 h-8 text-gray-500 transition-colors duration-300 ${issue.hoverIconColor}`} />

                  {issue.crackEffect && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="20" y1="20" x2="80" y2="20" stroke="#374151" strokeWidth="2" />
                        <line x1="80" y1="20" x2="20" y2="50" stroke="#374151" strokeWidth="2" />
                        <line x1="20" y1="50" x2="80" y2="80" stroke="#374151" strokeWidth="2" />
                      </svg>
                    </div>
                  )}

                  {issue.strikethrough && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="4" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" strokeWidth="4" />
                      </svg>
                    </div>
                  )}

                  {issue.batteryEffect && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="6" y1="6" x2="18" y2="18" className="text-red-600" />
                        <line x1="18" y1="6" x2="6" y2="18" className="text-red-600" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
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
