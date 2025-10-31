"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Menu, DollarSign, Info } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    icon: DollarSign,
    label: "Прайс-лист",
    href: "/pricelist",
  },
  {
    icon: Info,
    label: "О нас",
    href: "/#services",
  },
  {
    icon: Phone,
    label: "Контакты",
    href: "/kontakt",
  },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState({ flag: "🇷🇺", code: "RU" })

  const closeSheet = () => setOpen(false)

  const languages = [
    { flag: "🇨🇿", code: "CZ", href: "/cs" },
    { flag: "🇬🇧", code: "EN", href: "/en" },
    { flag: "🇷🇺", code: "RU", href: "/ru" },
  ]

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
                className="text-lg text-white hover:text-white/80 hover:underline transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Phone + Language Dropdown (Desktop only) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Phone */}
            <Link
              href="tel:+420607855558"
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-250"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+420 607 855 558</span>
            </Link>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white text-base font-medium gap-1"
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.code}</span>
                  <span className="ml-1">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} asChild>
                    <Link
                      href={lang.href}
                      className="flex items-center gap-2 cursor-pointer w-full"
                      onClick={() => setCurrentLang({ flag: lang.flag, code: lang.code })}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.code}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSheet}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-250"
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
                  href="tel:+420607855558"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-250"
                >
                  <Phone className="w-5 h-5 text-gray-700" />
                  <span className="font-medium">+420 607 855 558</span>
                </Link>

                {/* Mobile Language Selector */}
                <div className="px-4">
                  <p className="text-sm font-semibold text-gray-500 mb-2">Язык / Language</p>
                  <div className="flex flex-col gap-2">
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={lang.href}
                        onClick={() => {
                          setCurrentLang({ flag: lang.flag, code: lang.code })
                          closeSheet()
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-250"
                      >
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.code}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
