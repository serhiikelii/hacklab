import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServicePriceTable } from "@/components/pricelist";
import { getModelBySlug, getPricesForModel, getServices } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";

interface ModelPageProps {
  params: Promise<{
    category: string;
    model: string;
  }>;
}

/**
 * Страница модели устройства с прайс-листом услуг
 * Отображает все услуги ремонта для конкретной модели
 */
export default async function ModelPage({ params }: ModelPageProps) {
  const { category, model: modelSlug } = await params;

  // Редиректы для backward compatibility (старые URL)
  if (category === 'mac') {
    redirect(`/pricelist/macbook/${modelSlug}`);
  }
  if (category === 'watch') {
    redirect(`/pricelist/apple-watch/${modelSlug}`);
  }

  // Получаем данные модели из Supabase
  const model = await getModelBySlug(modelSlug);

  // Если модель не найдена, показываем 404
  if (!model) {
    notFound();
  }

  // Получаем цены и услуги для модели из Supabase
  const [prices, allServices] = await Promise.all([
    getPricesForModel(model.id),
    getServices(),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Используем компонент ServicePriceTable */}
        <ServicePriceTable
          model={model}
          services={allServices}
          prices={prices}
        />
      </main>
      <Footer />
    </>
  );
}

/**
 * Disable caching - always fetch fresh data
 */
export const revalidate = 0;
