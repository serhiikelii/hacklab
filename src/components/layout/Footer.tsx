"use client"

import Link from "next/link"
import { Phone, Mail } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

export function Footer() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">HACK</span>
              <span className="text-red-600">LAB</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footerAbout}
            </p>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h4 className="font-bold mb-4">{t.footerLinksTitle}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition text-sm">
                  {t.footerArticles}
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="text-gray-400 hover:text-white transition text-sm">
                  {t.footerPricelist}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-400 hover:text-white transition text-sm">
                  {t.footerContacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Hours */}
          <div>
            <h4 className="font-bold mb-4">{t.footerHoursTitle}</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>{t.footerMonday}</p>
              <p>{t.footerTuesday}</p>
              <p>{t.footerWednesday}</p>
              <p>{t.footerThursday}</p>
              <p>{t.footerFriday}</p>
              <p>{t.footerSaturday}</p>
              <p>{t.footerSunday}</p>
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-bold mb-4">{t.footerContactTitle}</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Seifertova 83<br />
                Praha 3 - Žižkov<br />
                130 00
              </p>
              <Link
                href="tel:+420721042342"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                <Phone className="w-4 h-4" />
                721 042 342
              </Link>
              <Link
                href="mailto:info@mojservice.cz"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                <Mail className="w-4 h-4" />
                info@mojservice.cz
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {t.footerCopyright} <Link href="/" className="text-white hover:text-gray-300">HackLab</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
