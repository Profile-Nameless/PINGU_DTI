"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, X, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { supabase } from "../utils/supabase"
import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMounted, setIsMounted] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, userMetadata, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isOrganizerDashboard = pathname?.startsWith('/organizer')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5)

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching events:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`relative px-3 py-2 transition-colors hover:text-orange-500 ${
          isActive 
            ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-orange-500 after:to-purple-600" 
            : "text-gray-600"
        }`}
      >
        {children}
      </Link>
    )
  }

  // Debug user metadata
  useEffect(() => {
    if (user) {
      console.log("User authenticated:", user.id)
      console.log("User metadata:", userMetadata)
    }
  }, [user, userMetadata])

  if (isOrganizerDashboard) {
    return null
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/50"
        initial={false}
        animate={false}
        transition={{ duration: 0.5 }}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">PingU</span>
                </h1>
              </Link>
              <div className="hidden lg:flex items-center gap-6">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/about">About</NavLink>
                <a 
                  href="https://calendar.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative px-3 py-2 transition-colors hover:text-orange-500 text-gray-600"
                >
                  Schedule
                </a>
                <NavLink href="/contact">Contact us</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-sm text-white border-none">
                    {userMetadata?.role === "organizer" && (
                      <DropdownMenuItem onClick={() => router.push('/organizer')}>
                        Organizer Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => router.push('/auth')}
                  className="bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get started
                </Button>
              )}
            </div>
          </div>
        </nav>
      </motion.header>

      <CommandDialog open={showSearch} onOpenChange={setShowSearch}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search events..." 
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isSearching ? "Searching..." : "No results found."}
            </CommandEmpty>
            <CommandGroup heading="Events">
              {searchResults.map((event) => (
                <CommandItem
                  key={event.id}
                  onSelect={() => {
                    router.push(`/events/${event.id}`)
                    setShowSearch(false)
                  }}
                  className="flex flex-col items-start py-3 px-4 cursor-pointer hover:bg-gray-100"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} • {event.category}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
} 