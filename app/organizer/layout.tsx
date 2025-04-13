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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="flex h-full">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen}>
          <SidebarBody className="flex flex-col h-full">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <div className="mb-6">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    PingU
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-600 hover:text-red-500 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sign Out</span>
              </Button>
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 