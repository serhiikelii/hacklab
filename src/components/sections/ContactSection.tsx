import { Card } from "@/components/ui/card"
import { MapPin, Train, Clock, Star } from "lucide-react"
import { MapSection } from "./MapSection"

export function ContactSection() {
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
                <h3 className="font-bold text-gray-900 mb-2">Адрес</h3>
                <p className="text-gray-700">MojService</p>
                <p className="text-gray-700">Seifertova 83</p>
                <p className="text-gray-700">Praha 3 - Žižkov</p>
                <p className="text-gray-700">130 00</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Train className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Транспорт</h3>
                <p className="text-gray-700">Остановка: Lipanská</p>
                <p className="text-gray-700">Трамваи: 5, 9, 15, 26</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Часы работы</h3>
                <p className="text-gray-700">Понедельник - Пятница: 9:00 - 19:00</p>
                <p className="text-gray-700">Суббота: 10:30 - 17:30</p>
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
