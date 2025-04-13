"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  PanelsTopLeft,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/contexts/AuthContext"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, userMetadata, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const displayName = userMetadata?.full_name || user?.email || 'User'
  const displayInitial = displayName[0].toUpperCase()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Check if we're on a specific event page
  const isEventDetailPage = pathname?.match(/^\/organizer\/events\/\d+$/)

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

  const links = [
    {
      label: "Dashboard",
      href: "/organizer",
      icon: <PanelsTopLeft className="h-5 w-5 shrink-0 text-orange-500" />,
    },
    {
      label: "Events",
      href: "/organizer/events",
      icon: <Calendar className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Registrations",
      href: "/organizer/registrations",
      icon: <Users className="h-5 w-5 shrink-0 text-purple-600" />,
    },
    {
      label: "Analytics",
      href: "/organizer/analytics",
      icon: <BarChart3 className="h-5 w-5 shrink-0 text-orange-500" />,
    },
    {
      label: "Reports",
      href: "/organizer/reports",
      icon: <TrendingUp className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Settings",
      href: "/organizer/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-purple-600" />,
    },
  ]

  return (
    <div className="fixed inset-0 bg-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="flex h-full">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen}>
          <SidebarBody className="flex flex-col h-full">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <div className="mb-6">
                <Link href="/" className="flex items-center gap-2 mb-4 px-3">
                  <span className={cn(
                    "font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-200",
                    isSidebarOpen ? "text-3xl" : "text-2xl"
                  )}>
                    {isSidebarOpen ? "PingU" : "P"}
                  </span>
                </Link>
                <div className="space-y-1">
                  {links.map((link) => (
                    <SidebarLink 
                      key={link.href} 
                      link={link} 
                      className={cn(
                        pathname === link.href && "bg-gray-100 font-medium"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                    {displayInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Organizer
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-9 justify-start text-gray-600 hover:text-red-500 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Sign Out</span>
                  </div>
                </Button>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-hidden pl-8 pt-3 pb-3 pr-0 bg-white">
          <div className="bg-gray-100 rounded-l-xl border border-gray-200 p-3 h-[calc(100vh-1.5rem)] mr-0 w-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 