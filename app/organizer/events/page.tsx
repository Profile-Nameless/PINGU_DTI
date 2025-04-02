"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  BarChart2,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

// Mock data - replace with actual data from your database
const allEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    date: "March 15, 2024",
    time: "10:00 AM",
    location: "Main Auditorium",
    status: "Published",
    registrations: 156,
    capacity: 200,
    description: "Join industry leaders for a day of innovation and networking.",
    category: "Technology",
  },
  {
    id: 2,
    title: "Career Fair Spring 2024",
    date: "March 20, 2024",
    time: "9:00 AM",
    location: "Student Center",
    status: "Draft",
    registrations: 89,
    capacity: 300,
    description: "Connect with top employers and explore career opportunities.",
    category: "Career",
  },
  {
    id: 3,
    title: "Alumni Networking Night",
    date: "March 25, 2024",
    time: "6:00 PM",
    location: "Business School",
    status: "Published",
    registrations: 45,
    capacity: 100,
    description: "Network with successful alumni and expand your professional circle.",
    category: "Networking",
  },
  {
    id: 4,
    title: "Hackathon 2024",
    date: "April 5, 2024",
    time: "9:00 AM",
    location: "Tech Center",
    status: "Published",
    registrations: 120,
    capacity: 150,
    description: "A 48-hour coding challenge with amazing prizes.",
    category: "Technology",
  },
  {
    id: 5,
    title: "Cultural Festival",
    date: "April 15, 2024",
    time: "4:00 PM",
    location: "Campus Green",
    status: "Draft",
    registrations: 0,
    capacity: 500,
    description: "Celebrate diversity with food, music, and performances.",
    category: "Cultural",
  },
]

// Helper function to check if an event is upcoming
const isUpcomingEvent = (eventDate: string) => {
  const today = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime >= today;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Get unique categories for filter
  const categories = ["all", ...new Set(allEvents.map(event => event.category))]

  // Calculate stats
  const totalEvents = allEvents.length;
  const upcomingEvents = allEvents.filter(event => isUpcomingEvent(event.date)).length;
  const totalRegistrations = allEvents.reduce((sum, event) => sum + event.registrations, 0);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header with welcome message and quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">Manage and track all your events</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Events
            </Button>
            <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/organizer/events/new">
                <PlusCircle className="w-4 h-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{totalEvents}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-green-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{upcomingEvents}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-purple-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{totalRegistrations}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Events Section with enhanced UI */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="bg-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500 mb-4">No events match your search criteria</p>
              <Button asChild>
                <Link href="/organizer/events/new">Create your first event</Link>
              </Button>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                      <Badge variant={event.status === 'Published' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="ml-1">
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 min-w-[180px]">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Registrations</p>
                      <p className="font-medium text-gray-900">{event.registrations}/{event.capacity}</p>
                      <Progress value={(event.registrations / event.capacity) * 100} className="h-1.5 mt-1" />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/organizer/events/${event.id}`)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
} 