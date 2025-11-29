'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const categorySlug = params.category_slug as string

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
    <div className="min-h-screen bg-gray-100">
      {/* Header with Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              href="/admin/catalog"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Catalog
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2 capitalize">
              {categorySlug.replace('-', ' ')}
            </h1>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    ${
                      tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  `}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
