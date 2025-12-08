import SignOutButton from '@/app/admin/SignOutButton'

interface AdminHeaderProps {
  userEmail: string
  userRole: string
}

export function AdminHeader({ userEmail, userRole }: AdminHeaderProps) {
  return (
    <nav className="bg-[#0f172a] shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-white">HACK</span>
              <span className="text-red-600">LAB</span>
              <span className="text-gray-400 ml-2 text-lg">Admin Panel</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              {userEmail} <span className="text-gray-400">({userRole})</span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
