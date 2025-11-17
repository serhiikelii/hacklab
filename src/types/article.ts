import { Locale } from '@/lib/i18n'

export type LocalizedString = {
  ru: string
  en: string
  cz: string
}

export interface Article {
  id: string
  slug: string
  title: LocalizedString
  excerpt: LocalizedString
  content: LocalizedString
  image: string
  publishedAt: string
}
