import { getAdminUser } from '@/app/admin/actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAnnouncements } from './actions'
import { AnnouncementForm } from './AnnouncementForm'
import { AnnouncementsList } from './AnnouncementsList'

export default async function AnnouncementsPage() {
  const adminUser = await getAdminUser()
  const announcements = await getAnnouncements()

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Promotions', href: '/admin/promotions' },
    { label: 'Announcements', href: '/admin/promotions/announcements' },
  ]

  return (
    <AdminLayout
      userEmail={adminUser.email}
      userRole={adminUser.role}
      breadcrumbs={breadcrumbs}
    >
      <div>
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Announcements Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage promotional banners for the homepage
            </p>
          </div>
        </div>

        {/* Add Announcement Form */}
        <div className="mb-8">
          <AnnouncementForm key={`add-announcement-${announcements.length}`} />
        </div>

        {/* Announcements List */}
        <AnnouncementsList announcements={announcements} />
      </div>
    </AdminLayout>
  )
}
