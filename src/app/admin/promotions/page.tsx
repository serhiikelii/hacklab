import Link from 'next/link'
import { getAdminUser } from '../actions'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function PromotionsPage() {
  const adminUser = await getAdminUser()

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Promotions', href: '/admin/promotions' },
  ]

  return (
    <AdminLayout
      userEmail={adminUser.email}
      userRole={adminUser.role}
      breadcrumbs={breadcrumbs}
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Promotions Management
        </h2>

        {/* Promotions Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Discounts Card */}
          <Link href="/admin/promotions/discounts">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-600 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Discounts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage Service Discounts
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Announcements Card */}
          <Link href="/admin/promotions/announcements">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-600 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Announcements
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage Promo Banners
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
