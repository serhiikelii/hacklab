'use client';

import { Service, ServicePrice } from '@/types/pricelist';

export interface ServiceRowProps {
  service: Service;
  price?: ServicePrice;
  onReserve?: () => void;
}

/**
 * ServiceRow - строка услуги с ценой
 *
 * Отображает отдельную услугу ремонта с:
 * - Названием услуги
 * - Ценой (или статусом "бесплатно"/"по запросу")
 * - Длительностью ремонта (если доступна)
 *
 * @example
 * ```tsx
 * <ServiceRow
 *   service={batteryReplacementService}
 *   price={priceForModel}
 * />
 * ```
 */
export function ServiceRow({ service, price }: ServiceRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      {/* Service Info */}
      <div className="flex-1 mb-4 sm:mb-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
          {service.name_ru || service.name_en}
        </h3>

        {service.description_ru && (
          <p className="text-sm text-gray-600 mb-2">{service.description_ru}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {/* Duration */}
          {price?.duration && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(price.duration)}
            </span>
          )}

          {/* Warranty */}
          {price?.warranty_months && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {price.warranty_months} мес. гарантия
            </span>
          )}

          {/* Note */}
          {(price?.note_ru || price?.note_en || price?.note_cz) && (
            <span className="text-gray-400 italic">
              {price.note_ru || price.note_en || price.note_cz}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <PriceDisplay service={service} price={price} />
      </div>
    </div>
  );
}

/**
 * PriceDisplay - отображение цены услуги
 */
interface PriceDisplayProps {
  service: Service;
  price?: ServicePrice;
}

function PriceDisplay({ service, price }: PriceDisplayProps) {
  // Если нет данных о цене
  if (!price) {
    return (
      <div className="text-gray-400 text-sm">
        Уточняйте
      </div>
    );
  }

  // Бесплатно
  if (service.price_type === 'free') {
    return (
      <div className="text-green-600 font-bold text-lg">
        БЕСПЛАТНО
      </div>
    );
  }

  // По запросу
  if (service.price_type === 'on_request') {
    return (
      <div className="text-gray-700 font-semibold text-base">
        По запросу
      </div>
    );
  }

  // От (цена)
  if (service.price_type === 'from' && price.price !== undefined && price.price !== null) {
    return (
      <div>
        <div className="text-xs text-gray-500 mb-0.5">от</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(price.price)} {price.currency}
        </div>
      </div>
    );
  }

  // Фиксированная цена
  if (service.price_type === 'fixed' && price.price !== undefined && price.price !== null) {
    return (
      <div className="text-2xl font-bold text-gray-900">
        {formatPrice(price.price)} {price.currency}
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-gray-400 text-sm">
      Уточняйте
    </div>
  );
}

// ========== Helper Functions ==========

/**
 * Форматировать длительность в читаемый вид
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
}

/**
 * Форматировать цену с разделителями тысяч
 */
function formatPrice(price: number): string {
  return price.toLocaleString('cs-CZ');
}
