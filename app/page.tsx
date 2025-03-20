"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Menu, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AutoScrollCarousel } from "./components/auto-scroll-carousel"
import { CategorySection } from "./components/category-section"
import { usePathname } from "next/navigation"
import type React from "react"

const popularEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    date: "March 15, 2024",
    location: "Main Auditorium",
    image: "/placeholder.svg?height=200&width=300",
    category: "Technology",
  },
  {
    id: 2,
    title: "Annual Career Fair",
    date: "March 20, 2024",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=300",
    category: "Career",
  },
]

const collegeEvents = [
  {
    id: 1,
    title: "Freshman Welcome Week",
    date: "March 10, 2024",
    location: "Various Locations",
    image: "/placeholder.svg?height=200&width=300",
    category: "Social",
  },
  {
    id: 2,
    title: "Spring Concert",
    date: "March 18, 2024",
    location: "Performing Arts Center",
    image: "/placeholder.svg?height=200&width=300",
    category: "Music",
  },
  {
    id: 3,
    title: "Alumni Networking Night",
    date: "March 22, 2024",
    location: "Business School",
    image: "/placeholder.svg?height=200&width=300",
    category: "Networking",
  },
]

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    setIsLoaded(true)
  }, [])

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href
    return (
      <Link href={href} className={`nav-link ${isActive ? "active" : ""}`}>
        {children}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-100"
        initial={isMounted ? { opacity: 0, y: -20 } : false}
        animate={isMounted ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button className="lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-md" />
                <span className="text-2xl font-bold text-accent">PingU</span>
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/schedule">Schedule</NavLink>
                <NavLink href="/speakers">Speakers</NavLink>
                <NavLink href="/ticket">Ticket</NavLink>
                <NavLink href="/contact">Contact us</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Button className="bg-black text-white hover:bg-black/90">Get started</Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={isMounted ? { opacity: 0, y: 20 } : false}
              animate={isMounted ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-accent">
                PingU
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">Your campus events one ping away</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button size="lg" className="bg-black text-white hover:bg-black/90">
                  Explore Events
                </Button>
                <Button variant="outline" size="lg" className="border-black text-black hover:bg-secondary">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to calendar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Carousels */}
      {isLoaded && (
        <>
          <AutoScrollCarousel events={popularEvents} title="Most Popular Events" />
          <div className="section-partition" />
          <AutoScrollCarousel events={collegeEvents} title="Events at Your College" />
          <div className="section-partition" />
        </>
      )}

      {/* Categories Section */}
      {isLoaded && <CategorySection />}
    </div>
  )
}

