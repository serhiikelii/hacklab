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
// Matte: Opacity 90% | Glossy: Gradient with shadow | Outline: Border only
const bannerVariants = {
  promo: {
    matte: 'bg-cyan-600/90 text-white',
    glossy: 'bg-gradient-to-r from-cyan-400 via-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/50',
    outline: 'bg-white/80 backdrop-blur-sm border-t-2 border-b-2 border-cyan-600 text-cyan-900',
  },
  sale: {
    matte: 'bg-[#28c1ac]/90 text-white',
    glossy: 'bg-gradient-to-r from-[#22a89a] via-[#28c1ac] to-[#2ed4be] text-white shadow-lg shadow-[#28c1ac]/50',
    outline: 'bg-white/80 backdrop-blur-sm border-t-2 border-b-2 border-[#28c1ac] text-[#1a7a6e]',
  },
  warning: {
    matte: 'bg-red-600/90 text-white',
    glossy: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50',
    outline: 'bg-white/80 backdrop-blur-sm border-t-2 border-b-2 border-red-600 text-red-900',
  },
  info: {
    matte: 'bg-blue-600/90 text-white',
    glossy: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50',
    outline: 'bg-white/80 backdrop-blur-sm border-t-2 border-b-2 border-blue-600 text-blue-900',
  },
} as const;

type BannerVariant = keyof typeof bannerVariants;
type BannerTheme = keyof typeof bannerVariants[BannerVariant];

function getBannerClasses(type: string, theme: BannerTheme = 'glossy'): string {
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
    <div className="relative w-full">
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
        className="announcement-swiper w-full"
        speed={800}
      >
        {announcements.map((announcement) => {
          const title = getLocalizedText(announcement, 'title');
          const message = getLocalizedText(announcement, 'message');
          const linkText = getLocalizedText(announcement, 'link_text');

          // Use variant-based styling instead of custom colors
          const bannerClasses = getBannerClasses(announcement.type, announcement.theme);

          return (
            <SwiperSlide key={announcement.id}>
              <div
                className={cn(
                  'min-h-[80px] py-4 sm:py-5 md:py-6 px-4 text-center transition-all duration-500',
                  'hover:shadow-lg w-full',
                  bannerClasses
                )}
                role="banner"
                aria-label={title}
              >
                <div className="container mx-auto max-w-7xl">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    {/* Content wrapper */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-wrap justify-center w-full max-w-5xl">
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
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.8;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1);
        }

        .announcement-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: rgba(255, 255, 255, 1);
          width: 24px;
          border-radius: 4px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.15);
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
