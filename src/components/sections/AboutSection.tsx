"use client"

import { Check } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

export function AboutSection() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  const whyChooseFeatures = [
    t.whyFeature1,
    t.whyFeature2,
    t.whyFeature3,
    t.whyFeature4,
    t.whyFeature5,
  ]

  const repairServices = [
    t.repairService1,
    t.repairService2,
    t.repairService3,
    t.repairService4,
    t.repairService5,
    t.repairService6,
    t.repairService7,
  ]

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t.aboutTitle}
        </h1>

        {/* Introduction paragraphs */}
        <p className="text-gray-700 leading-relaxed mb-4">
          {t.aboutIntro1}
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.aboutIntro2}
        </p>

        {/* Section: Why choose HackLab */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {t.whyChooseTitle}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.whyChooseIntro}
        </p>

        <ul className="space-y-2 mb-4 ml-6">
          {whyChooseFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700 leading-relaxed">
              <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.whyChooseOutro}
        </p>

        {/* Section: What we repair */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {t.whatWeRepairTitle}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.whatWeRepairIntro}
        </p>

        <ul className="space-y-2 mb-4 ml-6">
          {repairServices.map((service, index) => (
            <li key={index} className="text-gray-700 leading-relaxed">{service}</li>
          ))}
        </ul>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.whatWeRepairOutro}
        </p>

        {/* Section: Professional diagnostics and service */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {t.diagnosticsTitle}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.diagnosticsText1}
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.diagnosticsText2}
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.diagnosticsText3}
        </p>

        {/* Section: Courier delivery */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {t.courierTitle}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.courierText}
        </p>

        {/* Final section */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          {t.weFixTitle}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.weFixText1}
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          {t.weFixText2}
        </p>

        <p className="text-gray-700 leading-relaxed">
          {t.weFixText3}
        </p>
      </div>
    </section>
  )
}
