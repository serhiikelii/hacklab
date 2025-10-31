import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function ArticleNotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <FileQuestion className="w-24 h-24 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Статья не найдена
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              К сожалению, запрошенная статья не существует или была удалена.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/articles">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Все статьи
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">На главную</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
