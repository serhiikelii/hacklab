import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/articles"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    return {
      title: "Статья не найдена | MojService",
    }
  }

  return {
    title: `${article.title} | MojService`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
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
                    <Link href="/" className="hover:text-gray-900 transition-colors">
                      Главная
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/articles" className="hover:text-gray-900 transition-colors">
                      Статьи
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900 font-medium truncate max-w-xs">
                    {article.title}
                  </li>
                </ol>
              </nav>

              <Button asChild variant="ghost" className="mb-6">
                <Link href="/articles">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Все статьи
                </Link>
              </Button>

              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  {article.title}
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
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-gray-700 mb-8 font-medium border-l-4 border-gray-700 pl-6 py-2 bg-gray-50">
                  {article.excerpt}
                </div>

                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              <div className="mt-12 pt-8 border-t">
                <Button asChild size="lg">
                  <Link href="/articles">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Вернуться к статьям
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
