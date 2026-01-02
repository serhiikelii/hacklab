'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import type { Announcement } from '@/types/pricelist';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

/**
 * AnnouncementBanner - Modern promotional banner carousel
 *
 * Features:
 * - Automatic rotation every 5 seconds
 * - Multilingual support (RU/EN/CZ)
 * - Variant-based styling system (promo/warning/info/sale/success)
 * - Gradient and subtle theme support
 * - Smooth animations and transitions
 * - Enhanced accessibility (WCAG AA+)
 *
 * Placement: Between navbar and hero section
 * Height: 2x increased (py-6) with modern effects
 */

// Variant-based styling system (Design Tokens)
const bannerVariants = {
  promo: {
    solid: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
    gradient: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white',
    subtle: 'bg-emerald-50 text-emerald-900 border-t border-b border-emerald-200',
  },
  sale: {
    solid: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    gradient: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white',
    subtle: 'bg-red-50 text-red-900 border-t border-b border-red-200',
  },
  warning: {
    solid: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    gradient: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white',
    subtle: 'bg-orange-50 text-orange-900 border-t border-b border-orange-200',
  },
  info: {
    solid: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    gradient: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white',
    subtle: 'bg-blue-50 text-blue-900 border-t border-b border-blue-200',
  },
} as const;

type BannerVariant = keyof typeof bannerVariants;
type BannerTheme = keyof typeof bannerVariants[BannerVariant];

function getBannerClasses(type: string, theme: BannerTheme = 'solid'): string {
  const variant = (type as BannerVariant) in bannerVariants ? type as BannerVariant : 'info';
  return bannerVariants[variant][theme];
}

export function AnnouncementBanner() {
  const { locale } = useLocale();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active announcements on mount
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/announcements/active');

        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }

        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  // Don't render if loading, error, or no announcements
  if (isLoading || error || announcements.length === 0) {
    return null;
  }

  // Get localized text
  const getLocalizedText = (announcement: Announcement, field: 'title' | 'message' | 'link_text'): string => {
    const key = `${field}_${locale}` as keyof Announcement;
    return (announcement[key] as string) || '';
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={announcements.length > 1}
        pagination={announcements.length > 1 ? { clickable: true } : false}
        className="announcement-swiper"
        speed={800}
      >
        {announcements.map((announcement) => {
          const title = getLocalizedText(announcement, 'title');
          const message = getLocalizedText(announcement, 'message');
          const linkText = getLocalizedText(announcement, 'link_text');

          // Use variant-based styling instead of custom colors
          const bannerClasses = getBannerClasses(announcement.type, 'gradient');

          return (
            <SwiperSlide key={announcement.id}>
              <div
                className={cn(
                  'py-6 px-4 text-center transition-all duration-500',
                  'hover:shadow-lg',
                  bannerClasses
                )}
                role="banner"
                aria-label={title}
              >
                <div className="container mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    {/* Content wrapper */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-wrap justify-center max-w-4xl">
                      {/* Title */}
                      <h2 className="font-semibold text-base sm:text-lg md:text-xl leading-tight">
                        {title}
                      </h2>

                      {/* Message */}
                      {message && (
                        <p className="text-sm sm:text-base opacity-95 leading-relaxed">
                          {message}
                        </p>
                      )}

                      {/* Link */}
                      {announcement.link_url && linkText && (
                        <Link
                          href={announcement.link_url}
                          className={cn(
                            'inline-flex items-center gap-1 px-4 py-1.5 rounded-full',
                            'text-sm sm:text-base font-medium',
                            'bg-white/20 hover:bg-white/30 backdrop-blur-sm',
                            'transition-all duration-300 hover:scale-105',
                            'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
                            'active:scale-95'
                          )}
                          aria-label={`${linkText} - ${title}`}
                        >
                          {linkText}
                          <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Enhanced pagination styles */}
      <style jsx global>{`
        .announcement-swiper {
          --swiper-theme-color: rgba(255, 255, 255, 0.9);
        }

        .announcement-swiper .swiper-pagination {
          bottom: 8px;
        }

        .announcement-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 0.6;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .announcement-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: rgba(255, 255, 255, 1);
          width: 24px;
          border-radius: 4px;
        }

        /* Fade transition */
        .announcement-swiper .swiper-slide {
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .announcement-swiper .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
