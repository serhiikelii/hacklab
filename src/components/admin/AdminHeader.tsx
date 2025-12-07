import SignOutButton from '@/app/admin/SignOutButton'

interface AdminHeaderProps {
  userEmail: string
  userRole: string
}

export function AdminHeader({ userEmail, userRole }: AdminHeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">MojService Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {userEmail} <span className="text-gray-500">({userRole})</span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
