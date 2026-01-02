'use client'

import { useState } from 'react'
import type { AnnouncementType, AnnouncementTheme } from './actions'

interface AnnouncementPreviewProps {
  type: AnnouncementType
  theme: AnnouncementTheme
  titleRu: string
  titleEn: string
  titleCz: string
  messageRu?: string
  messageEn?: string
  messageCz?: string
  linkUrl?: string
  linkTextRu?: string
  linkTextEn?: string
  linkTextCz?: string
}

type Language = 'ru' | 'en' | 'cz'

// Variant-based styling system (matching AnnouncementBanner.tsx)
const bannerVariants = {
  promo: {
    solid: 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white',
    gradient: 'bg-gradient-to-r from-cyan-400 via-teal-500 to-cyan-600 text-white',
    subtle: 'bg-cyan-50 text-cyan-900 border border-cyan-200',
  },
  sale: {
    solid: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    gradient: 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-white',
    subtle: 'bg-green-50 text-green-900 border border-green-200',
  },
  warning: {
    solid: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    gradient: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white',
    subtle: 'bg-red-50 text-red-900 border border-red-200',
  },
  info: {
    solid: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    gradient: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white',
    subtle: 'bg-blue-50 text-blue-900 border border-blue-200',
  },
} as const

type BannerVariant = keyof typeof bannerVariants

function getBannerClasses(type: AnnouncementType, theme: AnnouncementTheme = 'gradient'): string {
  const variant = (type as BannerVariant) in bannerVariants ? type as BannerVariant : 'info'
  return bannerVariants[variant][theme]
}

export function AnnouncementPreview({
  type,
  theme,
  titleRu,
  titleEn,
  titleCz,
  messageRu,
  messageEn,
  messageCz,
  linkUrl,
  linkTextRu,
  linkTextEn,
  linkTextCz,
}: AnnouncementPreviewProps) {
  const [language, setLanguage] = useState<Language>('ru')

  // Get content based on language
  const title = language === 'ru' ? titleRu : language === 'en' ? titleEn : titleCz
  const message =
    language === 'ru' ? messageRu : language === 'en' ? messageEn : messageCz
  const linkText =
    language === 'ru' ? linkTextRu : language === 'en' ? linkTextEn : linkTextCz

  // Get banner classes based on type and theme
  const bannerClasses = getBannerClasses(type, theme)

  return (
    <div className="space-y-4">
      {/* Language switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setLanguage('ru')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === 'ru'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          RU
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === 'en'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('cz')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            language === 'cz'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          CZ
        </button>
      </div>

      {/* Banner preview */}
      <div className={`rounded-lg p-6 shadow-md ${bannerClasses}`}>
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-bold mb-2">
            {title || (
              <span className="opacity-50">
                {language === 'ru'
                  ? 'Заголовок баннера'
                  : language === 'en'
                  ? 'Banner title'
                  : 'Název banneru'}
              </span>
            )}
          </h3>

          {/* Message */}
          {message && <p className="text-sm mb-3 opacity-90">{message}</p>}

          {/* Link */}
          {linkUrl && linkText && (
            <a
              href={linkUrl}
              className="inline-flex items-center text-sm font-medium underline hover:no-underline"
              onClick={(e) => e.preventDefault()}
            >
              {linkText} →
            </a>
          )}
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500 italic">
        Preview shows how the banner will appear on the website
      </p>
    </div>
  )
}
