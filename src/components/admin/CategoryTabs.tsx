'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryTabsProps {
  categorySlug: string
}

export function CategoryTabs({ categorySlug }: CategoryTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      name: 'Models',
      href: `/admin/catalog/${categorySlug}/models`,
      current: pathname?.includes('/models'),
    },
    {
      name: 'Service Configuration',
      href: `/admin/catalog/${categorySlug}/services`,
      current: pathname?.includes('/services'),
    },
  ]

  return (
    <div className="mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`
              ${
                tab.current
                  ? 'bg-white text-gray-900 font-bold shadow-[0_-2px_8px_rgba(0,0,0,0.1)] border-l border-r border-t-2 border-gray-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-white hover:text-gray-900 border-l border-r border-t border-gray-200 hover:shadow-sm'
              }
              whitespace-nowrap py-3 px-6 rounded-t-lg font-medium text-sm transition-all relative -mb-px
            `}
          >
            {tab.name}
          </Link>
        ))}
        <div className="flex-1"></div>
      </div>
    </div>
  )
}
