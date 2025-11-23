'use client'

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceCategoryGrid } from "@/components/pricelist";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/queries";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getTranslations } from "@/lib/i18n";

/**
 * Главная страница прайс-листа
 * Отображает 4 категории устройств: iPhone, iPad, Mac, Watch
 * Данные загружаются из Supabase
 */
export default function PricelistPage() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

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
                {t.home}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{t.pricelist}</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-b from-white to-gray-50 border-b">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              {t.pricelistTitle}
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
              {t.pricelistContentTitle}
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                {t.pricelistIntro}
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                {t.pricelistWhyUs}
              </h3>

              <p>
                {t.pricelistWhyUsText1}
              </p>

              <p>
                {t.pricelistWhyUsText2}
              </p>

              <p>
                {t.pricelistWhyUsText3}
              </p>

              <p className="font-semibold text-gray-900 mt-6">
                {t.pricelistFooter}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
