'use client'

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ContactSection } from "@/components/sections/ContactSection"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

export default function KontaktPage() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <>
      <Header />
      <main>
        <div className="pt-8 pb-4 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
              {t.kontaktPageTitle}
            </h1>
            <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl mx-auto">
              {t.kontaktPageDescription}
            </p>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
