import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceCategoryGrid } from "@/components/pricelist";
import { getCategories } from "@/lib/queries";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/**
 * Главная страница прайс-листа
 * Отображает 4 категории устройств: iPhone, iPad, Mac, Watch
 * Данные загружаются из Supabase
 */
export default async function PricelistPage() {
  const categories = await getCategories();
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition flex items-center gap-1">
                <Home className="w-4 h-4" />
                Главная
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Прайс-лист</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-b from-white to-gray-50 border-b">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Ремонт Apple устройств в Праге
            </h1>
          </div>
        </div>

        {/* Category Grid */}
        <div className="container mx-auto px-4 py-12">
          <DeviceCategoryGrid categories={categories} />
        </div>

        {/* Content Section */}
        <div className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ремонт Apple в Праге
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Ваш iPhone, iPad или MacBook перестал включаться, разбился, утонул или просто стал работать нестабильно? Добро пожаловать в сервисный центр HackLab.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Почему именно мы?
              </h3>

              <p>
                Мы выполняем быстрый и профессиональный ремонт всей техники Apple любой сложности. Наши специалисты устранят любые неисправности, точно определят причины поломки и вернут вашему устройству идеальную работу.
                HackLab известен в Праге своей скоростью и качеством обслуживания — срочная замена дисплея, аккумулятора, кнопок или шлейфов занимает от 30 минут.
              </p>

              <p>
                Мы работаем с техникой Apple уже более 10 лет и накопили огромный опыт в восстановлении iPhone, iPad и MacBook. Сотрудничаем только с проверенными поставщиками оригинальных запчастей, что гарантирует надежность и долговечность ремонта.
              </p>

              <p>
                Мы ценим ваше время и понимаем, насколько сложно оставаться без связи. Поэтому, если вы не можете лично привезти устройство в наш сервис, закажите курьера HackLab — мы заберём гаджет, отремонтируем его и вернём обратно в кратчайшие сроки.
              </p>

              <p className="font-semibold text-gray-900 mt-6">
                HackLab — быстро, качественно и с заботой о вашем устройстве.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
