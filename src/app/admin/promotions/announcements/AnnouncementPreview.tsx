'use client'

import { useState } from 'react'
import { Megaphone, AlertTriangle, Info, Percent } from 'lucide-react'
import type { AnnouncementType } from './actions'

interface AnnouncementPreviewProps {
  type: AnnouncementType
  titleRu: string
  titleEn: string
  titleCz: string
  messageRu?: string
  messageEn?: string
  messageCz?: string
  backgroundColor?: string
  textColor?: string
  icon?: string
  linkUrl?: string
  linkTextRu?: string
  linkTextEn?: string
  linkTextCz?: string
}

type Language = 'ru' | 'en' | 'cz'

const TYPE_DEFAULTS = {
  promo: { bg: '#4F46E5', icon: Megaphone },
  warning: { bg: '#F59E0B', icon: AlertTriangle },
  info: { bg: '#3B82F6', icon: Info },
  sale: { bg: '#EF4444', icon: Percent },
}

export function AnnouncementPreview({
  type,
  titleRu,
  titleEn,
  titleCz,
  messageRu,
  messageEn,
  messageCz,
  backgroundColor,
  textColor = '#FFFFFF',
  icon,
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

  // Get background color (custom or default)
  const bgColor = backgroundColor || TYPE_DEFAULTS[type].bg

  // Get icon component
  const IconComponent = TYPE_DEFAULTS[type].icon

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
      <div
        className="rounded-lg p-6 shadow-md"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {icon ? (
              <span className="text-3xl">{icon}</span>
            ) : (
              <IconComponent className="w-8 h-8" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2">
              {title || (
                <span style={{ opacity: 0.5 }}>
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
                style={{ color: textColor }}
                onClick={(e) => e.preventDefault()}
              >
                {linkText} →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500 italic">
        Preview shows how the banner will appear on the website
      </p>
    </div>
  )
}
