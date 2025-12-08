'use client'

import { signOutAction } from './actions'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOutAction()}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#055d68] hover:bg-[#044a52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#055d68]"
    >
      Sign Out
    </button>
  )
}
