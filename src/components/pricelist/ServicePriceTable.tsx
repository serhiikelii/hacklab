'use client';

import { DeviceModel, Service, ServicePrice, Discount } from '@/types/pricelist';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { getTranslations, getServiceName, formatMessage, getCategoryName } from '@/lib/i18n';
import { useLocale } from '@/contexts/LocaleContext';
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseModelName, formatDuration } from '@/lib/utils';

export interface ServicePriceTableProps {
  model: DeviceModel;
  services: Service[];
  prices: ServicePrice[];
  onReserve?: (service: Service, model: DeviceModel) => void;
}

interface DiscountResponse {
  service_id: string;
  discount: Discount;
  discounted_price?: number;
}


/**
 * ServicePriceTable - strict minimalist service table in iFix style
 *
 * Design:
 * - Two-column layout: service table (left 2/3) + model image (right 1/3)
 * - Strict minimalism without animations
 * - Color scheme: Amber (#f59e0b) + Gray
 * - Info blocks: LIVE Repair, On-site Repair, Warranty
 */
export function ServicePriceTable({
  model,
  services,
  prices,
}: ServicePriceTableProps) {
  // Get current language from context
  const { locale } = useLocale();

  // Get translations for current language
  const t = getTranslations(locale);

  // State for Live Stream dialog
  const [isLiveStreamDialogOpen, setIsLiveStreamDialogOpen] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // State for fallback image on load error
  const [imageError, setImageError] = useState(false);

  // State for discounts
  const [discounts, setDiscounts] = useState<Map<string, DiscountResponse>>(new Map());
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(true);

  // Parse model name for iPad/MacBook
  const { mainName, modelCodes } = parseModelName(model.name, model.category);

  // Create price map for quick access using useMemo to avoid recreation on every render
  const priceMap = useMemo(() => {
    return new Map(prices.map((p) => [p.serviceId, p]));
  }, [prices]);

  // Load active discounts for services
  useEffect(() => {
    async function fetchDiscounts() {
      try {
        setIsLoadingDiscounts(true);

        // Get all service IDs
        const serviceIds = services.map(s => s.id).join(',');
        if (!serviceIds) {
          setIsLoadingDiscounts(false);
          return;
        }

        // Get all prices for current services
        const originalPrices = services
          .map(s => {
            const price = priceMap.get(s.id);
            return price?.price || 0;
          })
          .join(',');

        // Fetch active discounts
        const response = await fetch(
          `/api/discounts/active?service_ids=${serviceIds}&original_prices=${originalPrices}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch discounts');
        }

        const data = await response.json();

        // Convert array to Map for quick lookup
        const discountMap = new Map<string, DiscountResponse>();
        (data.discounts || []).forEach((d: DiscountResponse) => {
          discountMap.set(d.service_id, d);
        });

        setDiscounts(discountMap);
      } catch (err) {
        console.error('Error fetching discounts:', err);
      } finally {
        setIsLoadingDiscounts(false);
      }
    }

    fetchDiscounts();
  }, [services, priceMap]);

  const hasPrices = prices.length > 0;
  const hasServices = services.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900 transition flex items-center gap-1">
          <Home className="w-4 h-4" />
          {t.home}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/pricelist" className="hover:text-gray-900 transition">
          {t.pricelist}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/pricelist/${model.category}`}
          className="hover:text-gray-900 transition"
        >
          {t.repair} {getCategoryName(model.category, locale)}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">
          {model.name}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          {mainName}
        </h1>
        {modelCodes && (
          <p className="text-base md:text-xl font-normal text-gray-600 mt-1">
            {modelCodes}
          </p>
        )}
        <p className="text-lg text-gray-600 mt-6">
          {t.servicePriceTableTitle}
        </p>
      </div>

      {/* Main content: two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {/* Left column - service table (2/3 width) */}
        <div className="lg:col-span-2">
          {/* Service table */}
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
                            {price.duration && (
                              <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{formatDuration(price.duration)}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          {(() => {
                            const discountData = discounts.get(service.id);

                            if (discountData && discountData.discounted_price !== undefined) {
                              // Service has an active discount
                              const originalPrice = price.price;
                              const discountedPrice = discountData.discounted_price;

                              return (
                                <div className="flex flex-col items-end gap-1">
                                  {/* Original price (strikethrough) */}
                                  <div className="text-sm text-gray-400 line-through">
                                    {originalPrice} Kč
                                  </div>

                                  {/* Discounted price (green) */}
                                  <div className="font-semibold text-green-600 text-xl">
                                    {discountedPrice} Kč
                                  </div>
                                </div>
                              );
                            }

                            // No discount - show regular price
                            return (
                              <div className="font-semibold text-gray-900 text-lg">
                                {price.price} Kč
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State - no prices */}
          {!hasPrices && hasServices && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <svg className="mx-auto mb-4 text-gray-400" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.pricesSoonTitle}
                </h2>
                <p className="text-gray-600">
                  {formatMessage(t.pricesSoonDescription, { model: model.name })}
                </p>
              </div>
            </div>
          )}

          {/* Empty State - no services */}
          {!hasServices && (
            <div className="text-center py-16">
              <svg className="mx-auto mb-4 text-gray-400" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
              </svg>
              <p className="text-gray-500 text-lg mb-2">
                {t.servicesUnavailableTitle}
              </p>
              <p className="text-gray-400 text-sm">
                {t.servicesUnavailableDescription}
              </p>
            </div>
          )}
        </div>

        {/* Right column - model image (1/3 width) */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="sticky top-8 w-full max-w-[280px]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
              {/* Image or placeholder - rectangular section */}
              <div className="relative w-full mb-4 flex items-center justify-center h-[260px]">
                {model.image_url && !imageError ? (
                  <div className="relative w-full h-full max-w-[180px] max-h-[260px]">
                    <Image
                      src={model.image_url}
                      alt={model.name}
                      fill
                      className="object-contain"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/device-placeholder.webp"
                      alt="Device placeholder"
                      width={180}
                      height={180}
                      className="opacity-80 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Live Stream section - always visible */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {t.repairLiveTitle}
                </p>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  {t.repairLiveDescription}
                </p>
                <Button
                  onClick={() => setIsLiveStreamDialogOpen(true)}
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                >
                  {t.bookLiveStream}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for Live Stream access */}
      <Dialog open={isLiveStreamDialogOpen} onOpenChange={setIsLiveStreamDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.liveStreamFormTitle}</DialogTitle>
            <DialogDescription>
              {t.liveStreamFormDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t.loginPlaceholder}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsLiveStreamDialogOpen(false);
                setLogin('');
                setPassword('');
              }}
            >
              {t.cancel}
            </Button>
            <Button
              className="bg-primary hover:bg-primary-hover text-white"
              onClick={() => {
                setIsLiveStreamDialogOpen(false);
                setLogin('');
                setPassword('');
              }}
            >
              {t.submitAccess}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

