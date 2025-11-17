import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { articles } from "@/data/articles"
import { useLocale } from "@/contexts/LocaleContext"
import { getTranslations, getLocalizedString } from "@/lib/i18n"

export function ArticlesSection() {
  const { locale } = useLocale()
  const t = getTranslations(locale)
  const latestArticles = articles.slice(0, 3)

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.articlesTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.articlesDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-primary-md transition-all duration-350 cursor-pointer border-gray-100">
                <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                  <Image
                    src={article.image}
                    alt={getLocalizedString(article.title, locale)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-350"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-black transition-colors duration-250 line-clamp-2">
                    {getLocalizedString(article.title, locale)}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {getLocalizedString(article.excerpt, locale)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="group bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white shadow-none">
            <Link href="/articles">
              {t.viewAllArticles}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
