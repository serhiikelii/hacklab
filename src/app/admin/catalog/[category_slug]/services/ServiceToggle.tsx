'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleServiceActive } from './actions'

interface ServiceToggleProps {
  categoryServiceId: string
  isActive: boolean
  categorySlug: string
}

export function ServiceToggle({
  categoryServiceId,
  isActive,
  categorySlug,
}: ServiceToggleProps) {
  const [loading, setLoading] = useState(false)
  const [localIsActive, setLocalIsActive] = useState(isActive)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)

    // Optimistic UI update
    const newState = !localIsActive
    setLocalIsActive(newState)

    const result = await toggleServiceActive(categoryServiceId, categorySlug)

    if (result.success) {
      router.refresh() // Force re-render with new data
    } else {
      // Revert on error
      setLocalIsActive(!newState)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 ${
        localIsActive ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={localIsActive}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          localIsActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
