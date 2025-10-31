import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export function Footer() {
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
              HackLab предоставляет эксклюзивный сервис и ремонт продуктов;
              а именно iPhone, iPad, MacBook, Apple Watch и Apple TV.
            </p>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h4 className="font-bold mb-4">Также посетите</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition text-sm">
                  Статьи
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="text-gray-400 hover:text-white transition text-sm">
                  Прайс-лист
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-400 hover:text-white transition text-sm">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Hours */}
          <div>
            <h4 className="font-bold mb-4">Часы работы</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Понедельник: 09:00 - 19:00</p>
              <p>Вторник: 09:00 - 19:00</p>
              <p>Среда: 09:00 - 19:00</p>
              <p>Четверг: 09:00 - 19:00</p>
              <p>Пятница: 09:00 - 19:00</p>
              <p>Суббота: 10:30 - 17:30</p>
              <p>Воскресенье: закрыто</p>
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-bold mb-4">Свяжитесь с нами:</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Seifertova 83<br />
                Praha 3 - Žižkov<br />
                130 00
              </p>
              <Link
                href="tel:+420607855558"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                <Phone className="w-4 h-4" />
                607 855 558
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
            Copyright © 2025 <Link href="/" className="text-white hover:text-gray-300">HackLab</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
