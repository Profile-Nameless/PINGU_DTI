'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function NavbarWrapper() {
  const pathname = usePathname()
  
  // Don't show navbar on create-event page
  if (pathname === '/create-event') {
    return null
  }
  
  return <Navbar />
} 