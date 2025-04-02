"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export default function UserDashboard() {
  const { user, userMetadata, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else if (userMetadata?.role !== "user") {
      router.push("/organizer")
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

  if (!user || userMetadata?.role !== "user") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userMetadata?.full_name || "User"}!
            </h1>
            <button 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Events */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-orange-900 mb-4">Upcoming Events</h2>
              <p className="text-orange-700">No upcoming events</p>
            </div>

            {/* Registered Events */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Registered Events</h2>
              <p className="text-blue-700">No registered events</p>
            </div>

            {/* Past Events */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">Past Events</h2>
              <p className="text-purple-700">No past events</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Browse Events
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View My Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 