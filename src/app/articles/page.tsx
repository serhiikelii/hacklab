'use client'

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/articles"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations, getLocalizedString } from "@/lib/i18n"

export default function ArticlesPage() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const localeMap = { ru: "ru-RU", en: "en-US", cz: "cs-CZ" }
    return date.toLocaleDateString(localeMap[locale], {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t.backToHome}
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.articlesPageTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {t.articlesPageDescription}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image}
                      alt={getLocalizedString(article.title, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                    <h2 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-black transition-colors line-clamp-2">
                      {getLocalizedString(article.title, locale)}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {getLocalizedString(article.excerpt, locale)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
