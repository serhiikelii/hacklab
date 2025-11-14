'use client';

import React from 'react';
import Link from 'next/link';
import { DeviceCategory, DEVICE_CATEGORIES, type CategoryInfo } from '@/types/pricelist';
import type { Category } from '@/types/database';

export interface DeviceCategoryGridProps {
  categories?: Category[] | CategoryInfo[];
  onCategorySelect?: (category: DeviceCategory) => void;
}

/**
 * DeviceCategoryGrid - сетка категорий устройств (iPhone, iPad, Mac, Watch)
 *
 * Отображает 4 основные категории устройств с иконками и счетчиками моделей.
 * Используется на главной странице прайс-листа (/pricelist).
 * Поддерживает как данные из Supabase, так и fallback на моковые данные.
 *
 * @example
 * ```tsx
 * <DeviceCategoryGrid categories={dbCategories} />
 * ```
 */
export function DeviceCategoryGrid({
  categories = Object.values(DEVICE_CATEGORIES),
  onCategorySelect,
}: DeviceCategoryGridProps) {
  // Трансформируем данные из БД в формат CategoryInfo
  const transformedCategories = transformCategories(categories);
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">
          Какое устройство нужно отремонтировать? Зная модель вашего устройства, мы точнее определим стоимость и сроки ремонта.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {transformedCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={onCategorySelect}
          />
        ))}
      </div>

      {/* Empty State */}
      {transformedCategories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-gray-500 text-lg mb-2">
            Категории временно недоступны
          </p>
          <p className="text-gray-400 text-sm">
            Попробуйте обновить страницу
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * CategoryCard - карточка категории устройства
 */
interface CategoryCardProps {
  category: CategoryInfo;
  onClick?: (category: DeviceCategory) => void;
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  const handleClick = () => {
    onClick?.(category.id);
  };

  return (
    <Link href={`/pricelist/${category.id}`}>
      <div
        onClick={handleClick}
        className="group relative bg-white rounded-lg shadow-sm
                   transition-all duration-300 ease-out cursor-pointer
                   border border-gray-200
                   hover:shadow-xl hover:scale-[1.02] hover:border-gray-300
                   flex items-center gap-3 p-4"
      >
        {/* Icon Section - Outline Style */}
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            {getCategoryIconSVG(category.id)}
          </svg>
        </div>

        {/* Text Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
            {category.name}
          </h3>
        </div>

        {/* Hover Effect - Subtle Glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}

// ========== Helper Functions ==========

/**
 * Возвращает SVG иконку для категории в outline стиле
 */
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

/**
 * Проверяет, является ли объект категорией из БД
 */
function isDBCategory(category: any): category is Category {
  return 'name_ru' in category && 'name_en' in category;
}

/**
 * Трансформирует категории из БД или возвращает моковые данные
 */
function transformCategories(categories: Category[] | CategoryInfo[]): CategoryInfo[] {
  if (!categories || categories.length === 0) {
    return Object.values(DEVICE_CATEGORIES);
  }

  // Если это уже CategoryInfo, возвращаем как есть
  if (!isDBCategory(categories[0])) {
    return categories as CategoryInfo[];
  }

  // Трансформируем из формата БД
  return (categories as Category[]).map((dbCat) => {
    const fallback = DEVICE_CATEGORIES[dbCat.slug as DeviceCategory];

    return {
      id: dbCat.slug as DeviceCategory,
      name: dbCat.name_ru || dbCat.name_en || fallback?.name || dbCat.slug,
      icon: dbCat.icon || fallback?.icon || '📱',
      description: fallback?.description || `Ремонт ${dbCat.name_ru || dbCat.name_en}`,
      modelCount: fallback?.modelCount || 0,
    };
  });
}

// Re-export stats for convenience
import { PRICELIST_STATS } from '@/types/pricelist';
export { PRICELIST_STATS };
