import Link from 'next/link'
import { getAdminUser } from './actions'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminDashboard() {
  const adminUser = await getAdminUser()

  return (
    <AdminLayout userEmail={adminUser.email} userRole={adminUser.role}>
      <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Control Panel
          </h2>

          {/* Admin Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Catalog Card */}
            <Link href="/admin/catalog">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Device Catalog
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Models, Services, Prices
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Audit Log Card (Admin and Superadmin only) */}
            {(adminUser.role === 'admin' ||
              adminUser.role === 'superadmin') && (
              <Link href="/admin/audit">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Change History
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            View
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

          </div>
      </div>
    </AdminLayout>
  )
}
