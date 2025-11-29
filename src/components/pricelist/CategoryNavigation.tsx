'use client';

import React from 'react';
import Link from 'next/link';
import { DeviceCategory } from '@/types/pricelist';

interface CategoryNavigationProps {
  currentCategory: DeviceCategory;
}

type CategoryConfig = {
  id: DeviceCategory;
  label: string;
  href: string;
};

const categories: CategoryConfig[] = [
  { id: 'iphone', label: 'iPhone', href: '/pricelist/iphone' },
  { id: 'ipad', label: 'iPad', href: '/pricelist/ipad' },
  { id: 'macbook', label: 'MacBook', href: '/pricelist/macbook' },
  { id: 'apple-watch', label: 'Apple Watch', href: '/pricelist/apple-watch' },
];

/**
 * CategoryNavigation - horizontal navigation for device categories
 * Displayed on model pages, current category is highlighted
 */
export function CategoryNavigation({ currentCategory }: CategoryNavigationProps) {
  return (
    <div className="w-full bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((category) => {
            const isActive = category.id === currentCategory;

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-lg whitespace-nowrap
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-700'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {getCategoryIconSVG(category.id)}
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function to get category icons
function getCategoryIconSVG(categoryId: DeviceCategory): React.ReactElement {
  const icons: Record<DeviceCategory, React.ReactElement> = {
    iphone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    ),
    ipad: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
      />
    ),
    macbook: (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="13"
          rx="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 17h20"
        />
      </>
    ),
    'apple-watch': (
      <>
        <rect
          x="7"
          y="5"
          width="10"
          height="14"
          rx="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5V3.5C9 2.67 9.67 2 10.5 2h3C14.33 2 15 2.67 15 3.5V5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v1.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V19"
        />
      </>
    ),
  };
  return icons[categoryId];
}
