import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ContactSection } from "@/components/sections/ContactSection"

export const metadata = {
  title: "Контакты - MojService",
  description: "Свяжитесь с нами. Адрес, время работы и как до нас добраться.",
}

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main>
        <div className="pt-8 pb-4 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
              Контакты
            </h1>
            <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl mx-auto">
              Мы находимся в центре Праги. Приезжайте к нам или свяжитесь удобным способом.
            </p>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
