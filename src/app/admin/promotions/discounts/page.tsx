import { getAdminUser } from '@/app/admin/actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getDiscounts } from './actions'
import { DiscountDialog } from '@/components/admin/DiscountDialog'
import { DiscountsList } from './DiscountsList'

export default async function DiscountsPage() {
  const adminUser = await getAdminUser()
  const discounts = await getDiscounts()

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Promotions', href: '/admin/promotions' },
    { label: 'Discounts', href: '/admin/promotions/discounts' },
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
              Discounts Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage promotional discounts
            </p>
          </div>
          {/* Add Discount Button */}
          <DiscountDialog key={`add-discount-${discounts.length}`} />
        </div>

        {/* Discounts List */}
        <DiscountsList discounts={discounts} />
      </div>
    </AdminLayout>
  )
}
