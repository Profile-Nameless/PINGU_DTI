import type React from "react"
import Link from "next/link"
import { Calendar, Users, PlusCircle, Home } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-accent">PingU</h1>
        </div>
        <nav className="mt-6">
          <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-white hover:text-black">
            <Home className="inline-block w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link href="/events" className="block px-4 py-2 text-gray-600 hover:bg-white hover:text-black">
            <Calendar className="inline-block w-5 h-5 mr-2" />
            Events
          </Link>
          <Link href="/create-event" className="block px-4 py-2 text-gray-600 hover:bg-white hover:text-black">
            <PlusCircle className="inline-block w-5 h-5 mr-2" />
            Create Event
          </Link>
          <Link href="/registrations" className="block px-4 py-2 text-gray-600 hover:bg-white hover:text-black">
            <Users className="inline-block w-5 h-5 mr-2" />
            Registrations
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

