'use client'

import { Card } from "@/components/ui/card"
import { MapPin, Train, Clock, Star, Phone, Mail } from "lucide-react"
import { MapSection } from "./MapSection"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

export function ContactSection() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left - Contact Info */}
          <Card className="p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t.addressTitle}</h3>
                <p className="text-gray-700">MojService</p>
                <p className="text-gray-700">Budějovická 1667/64</p>
                <p className="text-gray-700">140 00 Praha 4</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t.footerContactTitle}</h3>
                <a
                  href="tel:+420721042342"
                  className="text-gray-700 hover:text-teal-700 transition-colors duration-200 block"
                >
                  +420 721 042 342
                </a>
                <a
                  href="mailto:info@hacklab.com"
                  className="text-gray-700 hover:text-teal-700 transition-colors duration-200 flex items-center gap-2 mt-1"
                >
                  <Mail className="w-4 h-4" />
                  info@hacklab.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Train className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t.transportTitle}</h3>
                <p className="text-gray-700">{t.transportStop}</p>
                <p className="text-gray-700">{t.transportTrams}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t.openingHoursTitle}</h3>
                <p className="text-gray-700">{t.weekdaysHours}</p>
                <p className="text-gray-700">{t.saturdayHours}</p>
                <p className="text-gray-700">{t.sundayHours}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600 font-semibold">5.0</span>
            </div>
          </Card>

          {/* Right - Google Maps */}
          <MapSection />
        </div>
      </div>
    </section>
  )
}
