'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function NavbarWrapper() {
  const pathname = usePathname()
  const isOrganizerDashboard = pathname?.startsWith('/organizer')

  if (isOrganizerDashboard) {
    return <div className="h-0" />
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
      <Navbar />
    </div>
  )
} 