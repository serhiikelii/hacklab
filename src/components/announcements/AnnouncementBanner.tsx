'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import type { Announcement } from '@/types/pricelist';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

/**
 * AnnouncementBanner - Promotional banner carousel
 *
 * Features:
 * - Automatic rotation every 5 seconds
 * - Multilingual support (RU/EN/CZ)
 * - Type-based styling (promo/warning/info/sale)
 * - Optional links and discount integration
 *
 * Placement: Between navbar and hero section
 */
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

  // Get default colors by announcement type
  const getDefaultColors = (type: string): { bg: string; text: string } => {
    switch (type) {
      case 'promo':
        return { bg: '#10b981', text: '#ffffff' }; // Green
      case 'warning':
        return { bg: '#f97316', text: '#ffffff' }; // Orange
      case 'info':
        return { bg: '#3b82f6', text: '#ffffff' }; // Blue
      case 'sale':
        return { bg: '#ef4444', text: '#ffffff' }; // Red
      default:
        return { bg: '#6b7280', text: '#ffffff' }; // Gray
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={announcements.length > 1}
        pagination={announcements.length > 1 ? { clickable: true } : false}
        className="announcement-swiper"
      >
        {announcements.map((announcement) => {
          const defaultColors = getDefaultColors(announcement.type);
          const backgroundColor = announcement.background_color || defaultColors.bg;
          const textColor = announcement.text_color || defaultColors.text;

          const title = getLocalizedText(announcement, 'title');
          const message = getLocalizedText(announcement, 'message');
          const linkText = getLocalizedText(announcement, 'link_text');

          return (
            <SwiperSlide key={announcement.id}>
              <div
                className="py-3 px-4 text-center"
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              >
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  {/* Icon */}
                  {announcement.icon && (
                    <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">
                      {announcement.icon}
                    </span>
                  )}

                  {/* Content wrapper */}
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    {/* Title */}
                    <p className="font-medium text-sm sm:text-base">
                      {title}
                    </p>

                    {/* Message */}
                    {message && (
                      <span className="text-xs sm:text-sm opacity-90">
                        {message}
                      </span>
                    )}

                    {/* Link */}
                    {announcement.link_url && linkText && (
                      <Link
                        href={announcement.link_url}
                        className="underline hover:no-underline text-xs sm:text-sm font-medium transition-all"
                        style={{ color: textColor }}
                      >
                        {linkText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom pagination styles */}
      <style jsx global>{`
        .announcement-swiper .swiper-pagination {
          bottom: 4px;
        }
        .announcement-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.6;
          width: 6px;
          height: 6px;
        }
        .announcement-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: rgba(255, 255, 255, 1);
        }
      `}</style>
    </div>
  );
}
