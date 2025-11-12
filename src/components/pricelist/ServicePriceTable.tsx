'use client';

import { DeviceModel, Service, ServicePrice } from '@/types/pricelist';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { type Locale, getTranslations, getServiceName, formatMessage } from '@/lib/i18n';

export interface ServicePriceTableProps {
  model: DeviceModel;
  services: Service[];
  prices: ServicePrice[];
  locale?: Locale;
  onReserve?: (service: Service, model: DeviceModel) => void;
}

/**
 * ServicePriceTable - строгая минималистичная таблица услуг в стиле iFix
 *
 * Дизайн:
 * - Двухколоночный layout: таблица услуг (левая 2/3) + изображение модели (правая 1/3)
 * - Строгий минимализм без анимаций
 * - Цветовая схема: Amber (#f59e0b) + Gray
 * - Информационные блоки: Ремонт LIVE, Ремонт на месте, Гарантия
 */
export function ServicePriceTable({
  model,
  services,
  prices,
  locale = 'ru',
}: ServicePriceTableProps) {
  // Получаем переводы для текущего языка
  const t = getTranslations(locale);

  // Создаем map цен для быстрого доступа
  const priceMap = new Map(
    prices.map((p) => [p.serviceId, p])
  );

  const hasPrices = prices.length > 0;
  const hasServices = services.length > 0;

  // Helper function to get category name
  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      iphone: 'iPhone',
      ipad: 'iPad',
      macbook: 'MacBook',
      'apple-watch': 'Apple Watch',
    };
    return names[category] || category;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900 transition flex items-center gap-1">
          <Home className="w-4 h-4" />
          Главная
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/pricelist" className="hover:text-gray-900 transition">
          Прайс-лист
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/pricelist/${model.category}`}
          className="hover:text-gray-900 transition"
        >
          Ремонт {getCategoryName(model.category)}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">
          {model.name}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {model.name}
        </h1>
        <p className="text-lg text-gray-600">
          {t.pricelistTitle}
        </p>
      </div>

      {/* Основной контент: двухколоночный layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {/* Левая колонка - таблица услуг (2/3 ширины) */}
        <div className="lg:col-span-2">
          {/* Empty State - нет цен */}
          {!hasPrices && hasServices && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <div className="text-5xl mb-4">⏳</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.pricesSoonTitle}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formatMessage(t.pricesSoonDescription, { model: model.name })}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+420607855558"
                    className="inline-flex items-center justify-center px-6 py-3
                             bg-amber-500 hover:bg-amber-600 text-white font-semibold
                             rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <span className="mr-2">📞</span>
                    {t.call}
                  </a>
                  <a
                    href="https://t.me/mojservice"
                    className="inline-flex items-center justify-center px-6 py-3
                             bg-gray-700 hover:bg-gray-800 text-white font-semibold
                             rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <span className="mr-2">💬</span>
                    {t.writeToTelegram}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Таблица услуг */}
          {hasPrices && hasServices && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t.service}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {t.price}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => {
                    const price = priceMap.get(service.id);
                    if (!price) return null;

                    return (
                      <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {getServiceName(service, locale)}
                            </div>
                            {price.warranty_months && (
                              <div className="text-sm text-gray-500 mt-1">
                                {t.warranty}: {price.warranty_months} {t.months}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="font-semibold text-gray-900 text-lg">
                            {price.price} Kč
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State - нет услуг */}
          {!hasServices && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔧</div>
              <p className="text-gray-500 text-lg mb-2">
                {t.servicesUnavailableTitle}
              </p>
              <p className="text-gray-400 text-sm">
                {t.servicesUnavailableDescription}
              </p>
            </div>
          )}
        </div>

        {/* Правая колонка - изображение модели (1/3 ширины) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {model.image_url ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-square w-full mb-4">
                  <Image
                    src={model.image_url}
                    alt={model.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {t.repairLiveTitle}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {t.repairLiveDescription}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-gray-500 text-sm">
                    {t.imageSoon}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

