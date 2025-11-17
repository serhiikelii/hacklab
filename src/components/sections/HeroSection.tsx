"use client"

import React from 'react';
import Link from "next/link"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations } from "@/lib/i18n"

type CategoryId = 'iphone' | 'mac' | 'ipad' | 'watch';

const categories = [
  {
    id: 'iphone' as CategoryId,
    translationKey: 'repairIphone' as const,
    href: "/pricelist/iphone",
  },
  {
    id: 'mac' as CategoryId,
    translationKey: 'repairMacbook' as const,
    href: "/pricelist/mac",
  },
  {
    id: 'ipad' as CategoryId,
    translationKey: 'repairIpad' as const,
    href: "/pricelist/ipad",
  },
  {
    id: 'watch' as CategoryId,
    translationKey: 'repairAppleWatch' as const,
    href: "/pricelist/watch",
  },
]

export function HeroSection() {
  const { locale } = useLocale()
  const t = getTranslations(locale)
  return (
    <section className="relative mt-16 py-16 md:py-20 lg:py-24 min-h-[500px] md:min-h-[550px] lg:min-h-[600px] bg-cover bg-bottom bg-no-repeat overflow-hidden bg-white" style={{ backgroundImage: 'url(/images/backgrounds/hero-bg.webp)' }}>
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="flex items-center justify-end h-full min-h-[450px] md:min-h-[500px] lg:min-h-[550px]">
          {/* Category Cards - aligned to right without padding */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[380px]">
            <div className="flex flex-col gap-3 md:gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group"
                >
                  <div
                    className="flex items-center gap-3 md:gap-5 bg-gray-200/85 backdrop-blur-sm rounded-xl p-3 md:p-5 hover:bg-gray-300/90 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="text-gray-800 w-8 h-8 md:w-9 md:h-9"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        {getCategoryIconSVG(category.id)}
                      </svg>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {t[category.translationKey]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function to get category icons
function getCategoryIconSVG(categoryId: CategoryId): React.ReactElement {
  const icons: Record<CategoryId, React.ReactElement> = {
    iphone: (
      // Smartphone icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    ),
    ipad: (
      // Tablet icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
      />
    ),
    mac: (
      // Laptop icon
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="13"
          rx="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 17h20"
        />
      </>
    ),
    watch: (
      // Apple Watch icon
      <>
        <rect
          x="7"
          y="5"
          width="10"
          height="14"
          rx="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5V3.5C9 2.67 9.67 2 10.5 2h3C14.33 2 15 2.67 15 3.5V5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v1.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V19"
        />
      </>
    ),
  };
  return icons[categoryId];
}
