'use client';

import { Service, ServicePrice } from '@/types/pricelist';
import { useLocale } from '@/contexts/LocaleContext';
import { getTranslations, getServiceName, getServiceDescription } from '@/lib/i18n';

export interface ServiceRowProps {
  service: Service;
  price?: ServicePrice;
  onReserve?: () => void;
}

/**
 * ServiceRow - service row with price
 *
 * Displays individual repair service with:
 * - Service name
 * - Price (or status "free"/"on request")
 * - Repair duration (if available)
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
  const { locale } = useLocale();
  const t = getTranslations(locale);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      {/* Service Info */}
      <div className="flex-1 mb-4 sm:mb-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
          {getServiceName(service, locale)}
        </h3>

        {getServiceDescription(service, locale) && (
          <p className="text-sm text-gray-600 mb-2">{getServiceDescription(service, locale)}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {/* Duration */}
          {price?.duration && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(price.duration, t)}
            </span>
          )}

          {/* Warranty */}
          {price?.warranty_months && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {price.warranty_months} {t.months} {t.warranty.toLowerCase()}
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
        <PriceDisplay service={service} price={price} t={t} />
      </div>
    </div>
  );
}

/**
 * PriceDisplay - service price display component
 */
interface PriceDisplayProps {
  service: Service;
  price?: ServicePrice;
  t: ReturnType<typeof getTranslations>;
}

function PriceDisplay({ service, price, t }: PriceDisplayProps) {
  // No price data available
  if (!price) {
    return (
      <div className="text-gray-400 text-sm">
        {t.clarify}
      </div>
    );
  }

  // Free service
  if (service.price_type === 'free') {
    return (
      <div className="text-green-600 font-bold text-lg">
        {t.free}
      </div>
    );
  }

  // On request pricing
  if (service.price_type === 'on_request') {
    return (
      <div className="text-gray-700 font-semibold text-base">
        {t.onRequest}
      </div>
    );
  }

  // Starting from (price)
  if (service.price_type === 'from' && price.price !== undefined && price.price !== null) {
    return (
      <div>
        <div className="text-xs text-gray-500 mb-0.5">{t.from}</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(price.price)} {price.currency}
        </div>
      </div>
    );
  }

  // Fixed price
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
      {t.clarify}
    </div>
  );
}

// ========== Helper Functions ==========

/**
 * Format duration in readable format
 */
function formatDuration(minutes: number, t: ReturnType<typeof getTranslations>): string {
  if (minutes < 60) {
    return `${minutes} ${t.minutes}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${t.hours}`;
  }

  return `${hours} ${t.hours} ${remainingMinutes} ${t.minutes}`;
}

/**
 * Format price with thousand separators
 */
function formatPrice(price: number): string {
  return price.toLocaleString('cs-CZ');
}
