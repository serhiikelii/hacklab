'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { Calendar, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/articles"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useLocale } from "@/contexts/LocaleContext"
import { getLocalizedString, getTranslations } from "@/lib/i18n"

export default function ArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const { locale } = useLocale()
  const t = getTranslations(locale)
  const [article, setArticle] = useState(() => articles.find((a) => a.slug === slug))

  useEffect(() => {
    const foundArticle = articles.find((a) => a.slug === slug)
    setArticle(foundArticle)

    if (!foundArticle) {
      notFound()
    }
  }, [slug])

  if (!article) {
    return null
  }

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
      <main className="min-h-screen bg-white">
        <article>
          <div className="bg-gray-50 border-b">
            <div className="container mx-auto px-4 py-8">
              <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {t.home}
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/articles" className="hover:text-gray-900 transition-colors">
                      {t.footerArticles}
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900 font-medium truncate max-w-xs">
                    {getLocalizedString(article.title, locale)}
                  </li>
                </ol>
              </nav>

              <Button asChild variant="ghost" className="mb-6">
                <Link href="/articles">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {t.viewAllArticles}
                </Link>
              </Button>

              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  {getLocalizedString(article.title, locale)}
                </h1>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt={getLocalizedString(article.title, locale)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-gray-700 mb-8 font-medium border-l-4 border-gray-700 pl-6 py-2 bg-gray-50">
                  {getLocalizedString(article.excerpt, locale)}
                </div>

                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: getLocalizedString(article.content, locale) }}
                />
              </div>

              <div className="mt-12 pt-8 border-t">
                <Button asChild size="lg">
                  <Link href="/articles">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {t.backToHome}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
