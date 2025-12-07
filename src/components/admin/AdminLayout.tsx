import { ReactNode } from 'react'
import { AdminHeader } from './AdminHeader'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'

interface AdminLayoutProps {
  children: ReactNode
  userEmail: string
  userRole: string
  breadcrumbs?: BreadcrumbItem[]
}

export function AdminLayout({
  children,
  userEmail,
  userRole,
  breadcrumbs = [],
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader userEmail={userEmail} userRole={userRole} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        {children}
      </div>
    </div>
  )
}
