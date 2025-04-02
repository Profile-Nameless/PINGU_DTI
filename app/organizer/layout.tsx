"use client"

import { useAuth } from "../contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import {
  Calendar,
  Users,
  BarChart2,
  Layout,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const sideMenuItems = [
  { icon: Layout, label: "Dashboard", href: "/organizer" },
  { icon: Calendar, label: "Events", href: "/organizer/events" },
  { icon: Users, label: "Registrations", href: "/organizer/registrations" },
  { icon: BarChart2, label: "Analytics", href: "/organizer/analytics" },
  { icon: TrendingUp, label: "Reports", href: "/organizer/reports" },
  { icon: Settings, label: "Settings", href: "/organizer/settings" },
]

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userMetadata, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're on a specific event page
  const isEventDetailPage = pathname?.match(/^\/organizer\/events\/\d+$/)

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else if (userMetadata?.role !== "organizer") {
      router.push("/dashboard")
    }
  }, [user, userMetadata, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!user || userMetadata?.role !== "organizer") {
    return null
  }

  // For event detail pages, render without sidebar
  if (isEventDetailPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    )
  }

  // For all other pages, render with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative flex pt-20">
        {/* Side Menu */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 px-4 py-6 min-h-screen sticky top-20">
          <nav className="space-y-1">
            {sideMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-2 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                  pathname === item.href ? 'bg-gray-50 text-gray-900' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <hr className="my-4" />
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-2 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 