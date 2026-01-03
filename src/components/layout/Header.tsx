"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Menu, DollarSign, Info } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/contexts/LocaleContext"
import { Locale, getTranslations } from "@/lib/i18n"
import { SocialLinks } from "./SocialLinks"

type LanguageConfig = {
  locale: Locale;
  label: string;
}

const languages: LanguageConfig[] = [
  { locale: "cz", label: "CZ" },
  { locale: "en", label: "EN" },
  { locale: "ru", label: "RU" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale } = useLocale()
  const t = getTranslations(locale)

  const menuItems = [
    {
      icon: DollarSign,
      label: t.pricelistMenu,
      href: "/pricelist",
    },
    {
      icon: Info,
      label: t.aboutMenu,
      href: "/#services",
    },
    {
      icon: Phone,
      label: t.contactsMenu,
      href: "/kontakt",
    },
  ]

  const closeSheet = () => setOpen(false)

  return (
    <header className="bg-secondary text-white py-5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="text-4xl font-bold hover:opacity-90 transition-opacity duration-250">
            <span className="text-white">HACK</span>
            <span className="text-red-600">LAB</span>
          </Link>

          {/* Center: Navigation Menu (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-16">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.href === "/pricelist" ? "pricelist-link" : undefined}
                className="text-lg text-white hover:text-white/80 hover:underline transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Language Switcher (Desktop only) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher - Simple inline */}
            <div className="flex items-center gap-2 text-white text-base font-medium">
              {languages.map((lang, index) => (
                <div key={lang.locale} className="flex items-center gap-2">
                  <button
                    onClick={() => setLocale(lang.locale)}
                    className={`transition-colors duration-200 ${
                      locale === lang.locale
                        ? 'font-bold text-teal-400'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="text-white/40">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[230px]">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-6">
                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSheet}
                      data-testid={item.href === "/pricelist" ? "pricelist-link" : undefined}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-250"
                    >
                      <item.icon className="w-5 h-5 text-gray-700" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Mobile Phone */}
                <Link
                  href="tel:+420721042342"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-250"
                >
                  <Phone className="w-5 h-5 text-gray-700" />
                  <span className="font-medium">+420 721 042 342</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Mobile Language Selector - Compact */}
                <div className="px-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">{t.languageLabel}</p>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.locale}
                        onClick={() => {
                          setLocale(lang.locale)
                          closeSheet()
                        }}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-250 ${
                          locale === lang.locale
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Mobile Social Links */}
                <div className="px-3 pb-6 flex flex-col items-center">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Social Media</p>
                  <SocialLinks variant="mobile" className="justify-center gap-6" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
