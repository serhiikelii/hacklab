import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceModelGrid } from "@/components/pricelist";
import { getModelsForCategory } from "@/lib/queries";
import type { DeviceCategory } from "@/types/pricelist";
import { redirect } from "next/navigation";

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

  // Редиректы для backward compatibility (старые URL)
  if (category === 'mac') {
    redirect('/pricelist/macbook');
  }
  if (category === 'watch') {
    redirect('/pricelist/apple-watch');
  }

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
 * Next.js 15 ISR: pre-render только актуальные категории из БД
 * Редиректы для старых URL (mac, watch) работают динамически на runtime
 */
export async function generateStaticParams() {
  return [
    { category: 'iphone' },
    { category: 'ipad' },
    { category: 'macbook' },
    { category: 'apple-watch' },
  ];
}

/**
 * Enable ISR with 1 hour revalidation
 * Pages will be statically generated at build time and revalidated every hour
 */
export const revalidate = 3600;
