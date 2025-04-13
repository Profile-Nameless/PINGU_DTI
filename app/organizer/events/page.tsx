"use client"

import { useEffect, useState } from "react"
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
  Plus,
  MoreVertical,
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
import { supabase } from "@/app/utils/supabase"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: string
  registrations: number
  capacity: number
  category: string
}

// Update the getStatusColor function to match the dashboard
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'from-blue-500 to-indigo-600'
    case 'ongoing':
      return 'from-green-500 to-emerald-600'
    case 'completed':
      return 'from-purple-500 to-pink-600'
    case 'cancelled':
      return 'from-red-500 to-rose-600'
    case 'published':
      return 'from-green-500 to-emerald-600'
    case 'draft':
      return 'from-blue-500 to-indigo-600'
    default:
      return 'from-gray-500 to-slate-600'
  }
}

// Update the getCategoryColor function to match the dashboard
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'workshop':
      return 'from-orange-500 to-amber-600'
    case 'seminar':
      return 'from-blue-500 to-cyan-600'
    case 'conference':
      return 'from-purple-500 to-violet-600'
    case 'hackathon':
      return 'from-green-500 to-teal-600'
    case 'cultural':
      return 'from-pink-500 to-rose-600'
    case 'technology':
      return 'from-indigo-500 to-blue-600'
    case 'art':
      return 'from-purple-500 to-pink-600'
    case 'music':
      return 'from-pink-500 to-red-600'
    case 'entertainment':
      return 'from-yellow-500 to-orange-600'
    case 'sports':
      return 'from-green-500 to-emerald-600'
    case 'academic':
      return 'from-blue-500 to-indigo-600'
    case 'social':
      return 'from-purple-500 to-indigo-600'
    case 'career':
      return 'from-blue-500 to-teal-600'
    default:
      return 'from-gray-500 to-slate-600'
  }
}

// Update the getProgressColor function to match the dashboard
const getProgressColor = (percentage: number, status: string) => {
  if (status.toLowerCase() === 'completed') return 'bg-gradient-to-r from-gray-400 to-gray-500'
  if (status.toLowerCase() === 'cancelled') return 'bg-gradient-to-r from-red-400 to-red-500'
  if (percentage >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-600'
  if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-indigo-600'
  if (percentage >= 25) return 'bg-gradient-to-r from-yellow-500 to-amber-600'
  return 'bg-gradient-to-r from-red-500 to-rose-600'
}

// Add the getBorderColor function from the dashboard
const getBorderColor = (percentage: number, status: string) => {
  if (status.toLowerCase() === 'completed') return 'rgb(156, 163, 175)' // gray-400
  if (status.toLowerCase() === 'cancelled') return 'rgb(248, 113, 113)' // red-400
  if (percentage >= 75) return 'rgb(34, 197, 94)' // green-500
  if (percentage >= 50) return 'rgb(59, 130, 246)' // blue-500
  if (percentage >= 25) return 'rgb(234, 179, 8)' // yellow-500
  return 'rgb(239, 68, 68)' // red-500
}

// Add the isUpcomingEvent function
const isUpcomingEvent = (eventDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to compare dates only
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(0, 0, 0, 0); // Reset time part to compare dates only
  return eventDateTime >= today;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      console.log('Starting fetchEvents...')
      
      if (!user?.id) {
        console.error('No user ID available')
        setEvents([])
        return
      }
      console.log('User ID:', user.id)

      // First get the organizer record
      console.log('Fetching organizer record...')
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id, name')
        .eq('user_id', user.id)
        .single()

      console.log('Organizer query result:', { organizerData, organizerError })

      if (organizerError) {
        console.error('Error fetching organizer:', organizerError)
        throw organizerError
      }

      if (!organizerData) {
        console.error('No organizer record found for user')
        setEvents([])
        return
      }

      console.log('Found organizer:', organizerData)

      // Then get events for this organizer
      console.log('Fetching events for organizer:', organizerData.id)
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerData.id)
        .order('date', { ascending: true })

      console.log('Events query result:', { 
        eventsCount: eventsData?.length,
        firstEvent: eventsData?.[0],
        error: eventsError 
      })

      if (eventsError) {
        console.error('Error fetching events:', eventsError)
        throw eventsError
      }

      if (!eventsData) {
        console.log('No events found for organizer')
        setEvents([])
        return
      }

      console.log('Successfully fetched events:', eventsData)
      setEvents(eventsData)
    } catch (error) {
      console.error('Error in fetchEvents:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      toast.error('Failed to fetch events. Please try again.')
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      setEvents(events.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  // Get unique categories for filter
  const categories = ["all", ...new Set(events.map(event => event.category))]

  // Calculate stats from real data
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => event.status.toLowerCase() === 'upcoming').length;
  const totalRegistrations = events.reduce((sum, event) => sum + (event.registrations || 0), 0);

  const filteredEvents = events.filter(event => {
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
            <Button asChild className="gap-2 bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600">
              <Link href="/organizer/events/new">
                <Plus className="h-4 w-4 mr-2" />
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{totalEvents}</h3>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50">
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-green-50 to-white border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{upcomingEvents}</h3>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50">
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-purple-50 to-white border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{totalRegistrations}</h3>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-50">
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
            filteredEvents.map((event) => {
              const progressPercentage = (event.registrations / event.capacity) * 100;
              const borderColor = getBorderColor(progressPercentage, event.status);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50/50 transition-all duration-300 group relative overflow-hidden"
                  style={{ borderLeft: `4px solid ${borderColor}` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(event.status)} opacity-5`}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                        <Badge className={`bg-gradient-to-r ${getStatusColor(event.status)} text-white border-0`}>
                          {event.status}
                        </Badge>
                        <Badge className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white border-0`}>
                          {event.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[180px]">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Registrations</p>
                        <p className="font-medium text-gray-900">{event.registrations}/{event.capacity}</p>
                        <div className="h-2 mt-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progressPercentage, event.status)}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
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
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  )
} 