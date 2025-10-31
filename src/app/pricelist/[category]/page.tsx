import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceModelGrid } from "@/components/pricelist";
import { getModelsForCategory } from "@/lib/queries";
import type { DeviceCategory } from "@/types/pricelist";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Страница категории устройств
 * Отображает все модели для выбранной категории (например, все iPhone)
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const models = await getModelsForCategory(category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <DeviceModelGrid
          category={category as DeviceCategory}
          models={models}
        />
      </main>
      <Footer />
    </>
  );
}

/**
 * Генерация статических путей для всех категорий
 * Next.js 15 ISR: pre-render все 4 категории
 */
export async function generateStaticParams() {
  return [
    { category: 'iphone' },
    { category: 'ipad' },
    { category: 'mac' },
    { category: 'watch' },
  ];
}
