'use client';

import React from 'react';
import Link from 'next/link';
import { DeviceCategory, DeviceModel } from '@/types/pricelist';
import { CategoryNavigation } from './CategoryNavigation';
import { Home, ChevronRight } from 'lucide-react';
import { parseModelName } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { getTranslations, getCategoryName } from '@/lib/i18n';

export interface DeviceModelGridProps {
  category: DeviceCategory;
  models: DeviceModel[];
  onModelSelect?: (model: DeviceModel) => void;
}

/**
 * DeviceModelGrid - сетка моделей устройств для категории
 *
 * Отображает все модели устройств в выбранной категории.
 * Используется на странице категории (/pricelist/iphone).
 * Responsive: 1 колонка (mobile) → 2 колонки (tablet) → 4 колонки (desktop).
 *
 * @example
 * ```tsx
 * <DeviceModelGrid
 *   category="iphone"
 *   models={iphoneModels}
 * />
 * ```
 */
export function DeviceModelGrid({
  category,
  models,
  onModelSelect,
}: DeviceModelGridProps) {
  // Модели уже отсортированы на сервере по полю 'order', затем по 'release_year'
  // Клиентская пересортировка не требуется

  // Получаем текущий язык и переводы
  const { locale } = useLocale();
  const t = getTranslations(locale);

  return (
    <>
      {/* Category Navigation */}
      <CategoryNavigation currentCategory={category} />

      <div className="w-full mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="container max-w-7xl mx-auto mb-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/pricelist" className="hover:text-gray-900 transition">
              {t.pricelist}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {t.repair} {getCategoryName(category, locale)}
            </span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="container max-w-7xl mx-auto mb-8 mt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getCategoryName(category, locale)}
          </h1>
          <p className="text-lg text-gray-600">
            {t.selectModelForPriceList}
          </p>
        </div>

        {/* Models Grid */}
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                category={category}
                onClick={onModelSelect}
              />
            ))}
          </div>

          {/* Empty State */}
          {models.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {t.modelsNotFound}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * ModelCard - карточка модели устройства
 */
interface ModelCardProps {
  model: DeviceModel;
  category: DeviceCategory;
  onClick?: (model: DeviceModel) => void;
}

function ModelCard({ model, category, onClick }: ModelCardProps) {
  const handleClick = () => {
    onClick?.(model);
  };

  const { mainName, modelCodes } = parseModelName(model.name, category);

  return (
    <Link href={`/pricelist/${model.category}/${model.slug}`}>
      <div
        onClick={handleClick}
        className="group relative bg-white rounded-lg shadow-sm
                   transition-all duration-300 ease-out cursor-pointer
                   border border-gray-200
                   hover:shadow-xl hover:scale-[1.02] hover:border-gray-300
                   flex items-center gap-2 p-3"
      >
        {/* Icon Section - Outline Style */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          <svg
            className="w-9 h-9 text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            {getCategoryIconSVG(category)}
          </svg>
        </div>

        {/* Text Section */}
        <div className="flex-1 min-w-0 text-center">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-tight">
            {mainName}
          </h3>
          {modelCodes && (
            <p className="text-xs text-gray-500 mt-0.5 font-normal">
              {modelCodes}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ========== Helper Functions ==========

function getCategoryIconSVG(category: DeviceCategory): React.ReactElement {
  const icons: Record<DeviceCategory, React.ReactElement> = {
    iphone: (
      // Smartphone icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    ),
    ipad: (
      // Tablet icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
      />
    ),
    macbook: (
      // Laptop icon - simple minimal design
      <>
        {/* Screen */}
        <rect
          x="3"
          y="4"
          width="18"
          height="13"
          rx="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Base */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 17h20"
        />
      </>
    ),
    'apple-watch': (
      // Apple Watch icon - simple rectangular smartwatch
      <>
        {/* Watch case - rounded rectangle */}
        <rect
          x="7"
          y="5"
          width="10"
          height="14"
          rx="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top band */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5V3.5C9 2.67 9.67 2 10.5 2h3C14.33 2 15 2.67 15 3.5V5"
        />
        {/* Bottom band */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v1.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V19"
        />
      </>
    ),
  };
  return icons[category];
}
