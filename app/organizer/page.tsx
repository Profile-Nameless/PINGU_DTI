"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  BarChart2,
  PlusCircle,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type React from "react"
import { useAuth } from "../contexts/AuthContext"
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
import { supabase } from "@/app/utils/supabase"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

interface EventDetails {
  title: string
  date: string
  start_time: string
  venue: string
  category: string
  current_registrations: number
  capacity: number
}

interface EventWithDetails {
  id: string
  organizer_id: string
  status: string
  event_details: EventDetails[]
}

// Helper function to check if an event is upcoming
const isUpcomingEvent = (eventDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to compare dates only
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(0, 0, 0, 0); // Reset time part to compare dates only
  return eventDateTime >= today;
}

// Cache for organizer events data
const organizerEventsCache = {
  data: null as Event[] | null,
  timestamp: 0,
  expiry: 5 * 60 * 1000 // 5 minutes in milliseconds
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0
  })
  const router = useRouter()
  const { user, userMetadata } = useAuth()
  const mountedRef = useRef(false)
  const dataFetchedRef = useRef(false)
  const organizerIdRef = useRef<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mountedRef.current = true
    
    if (user) {
      // Check if we have cached data that's still valid
      const now = Date.now()
      if (organizerEventsCache.data && (now - organizerEventsCache.timestamp) < organizerEventsCache.expiry) {
        console.log('Using cached organizer events data')
        setEvents(organizerEventsCache.data)
        updateStats(organizerEventsCache.data)
        setIsLoading(false)
        return
      }
      
      fetchEvents()
    }
    
    return () => {
      mountedRef.current = false
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First get the organizer record
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (organizerError) throw organizerError;
      if (!organizerData) throw new Error('No organizer found');

      // Fetch events with their details using an inner join
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          organizer_id,
          status,
          event_details!inner (
            title,
            date,
            start_time,
            venue,
            category,
            current_registrations,
            capacity
          )
        `)
        .eq('organizer_id', organizerData.id);

      if (eventsError) throw eventsError;

      // Process events for display with null checks and sort by date
      const processedEvents: Event[] = events
        .map((event: EventWithDetails) => ({
          id: event.id,
          title: event.event_details?.[0]?.title || 'Untitled Event',
          description: '', // Add description if needed
          date: event.event_details?.[0]?.date || '',
          time: event.event_details?.[0]?.start_time || '',
          location: event.event_details?.[0]?.venue || '',
          status: event.status || 'draft',
          registrations: event.event_details?.[0]?.current_registrations || 0,
          capacity: event.event_details?.[0]?.capacity || 0,
          category: event.event_details?.[0]?.category || 'uncategorized'
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (eventsList: Event[]) => {
    if (!mountedRef.current) return
    
    const totalEvents = eventsList.length
    const upcomingEvents = eventsList.filter(event => 
      isUpcomingEvent(event.date)
    ).length
    const totalRegistrations = eventsList.reduce((sum, event) => sum + event.registrations, 0)
    
    setStats({
      totalEvents,
      upcomingEvents,
      totalRegistrations
    })
  }

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by search query
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter
      
      // Filter by date
      let matchesDate = true
      if (dateFilter === 'upcoming') {
        matchesDate = isUpcomingEvent(event.date)
      } else if (dateFilter === 'past') {
        matchesDate = !isUpcomingEvent(event.date)
      }
      
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [events, searchQuery, statusFilter, dateFilter])

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // First get the organizer record
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (organizerError) {
        throw organizerError
      }

      if (!organizerData) {
        throw new Error('No organizer record found')
      }

      // Verify the event belongs to this organizer
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('organizer_id')
        .eq('id', eventId)
        .single()

      if (eventError) {
        throw eventError
      }

      if (eventData.organizer_id !== organizerData.id) {
        throw new Error('Unauthorized to delete this event')
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      toast.success('Event deleted successfully')
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      // First get the organizer record
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (organizerError) {
        throw organizerError
      }

      if (!organizerData) {
        throw new Error('No organizer record found')
      }

      // Verify the event belongs to this organizer
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('organizer_id')
        .eq('id', eventId)
        .single()

      if (eventError) {
        throw eventError
      }

      if (eventData.organizer_id !== organizerData.id) {
        throw new Error('Unauthorized to update this event')
      }

      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId)

      if (error) throw error

      toast.success('Event status updated successfully')
      fetchEvents()
    } catch (error) {
      console.error('Error updating event status:', error)
      toast.error('Failed to update event status')
    }
  }

  // Calculate stats from real data
  const totalEvents = events.length
  const upcomingEvents = events.filter(event => event.status.toLowerCase() === 'upcoming').length
  const totalRegistrations = events.reduce((sum, event) => sum + (event.registrations || 0), 0)

  // Update stats state whenever events change
  useEffect(() => {
    setStats({
      totalEvents,
      upcomingEvents,
      totalRegistrations
    })
  }, [events])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600'
      case 'ongoing':
        return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 'completed':
        return 'bg-gradient-to-r from-purple-500 to-pink-600'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-600'
      case 'published':
        return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 'draft':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'workshop':
        return 'bg-gradient-to-r from-orange-500 to-amber-600'
      case 'seminar':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600'
      case 'conference':
        return 'bg-gradient-to-r from-purple-500 to-violet-600'
      case 'hackathon':
        return 'bg-gradient-to-r from-green-500 to-teal-600'
      case 'cultural':
        return 'bg-gradient-to-r from-pink-500 to-rose-600'
      case 'technology':
        return 'bg-gradient-to-r from-indigo-500 to-blue-600'
      case 'art':
        return 'bg-gradient-to-r from-purple-500 to-pink-600'
      case 'music':
        return 'bg-gradient-to-r from-pink-500 to-red-600'
      case 'entertainment':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600'
      case 'sports':
        return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 'academic':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600'
      case 'social':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600'
      case 'career':
        return 'bg-gradient-to-r from-blue-500 to-teal-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600'
    }
  }

  const getProgressColor = (percentage: number, status: string) => {
    if (status.toLowerCase() === 'completed') return 'bg-gradient-to-r from-gray-400 to-gray-500'
    if (status.toLowerCase() === 'cancelled') return 'bg-gradient-to-r from-red-400 to-red-500'
    if (percentage >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-600'
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-indigo-600'
    if (percentage >= 25) return 'bg-gradient-to-r from-yellow-500 to-amber-600'
    return 'bg-gradient-to-r from-red-500 to-rose-600'
  }

  const getBorderColor = (percentage: number, status: string) => {
    if (status.toLowerCase() === 'completed') return 'rgb(156, 163, 175)' // gray-400
    if (status.toLowerCase() === 'cancelled') return 'rgb(248, 113, 113)' // red-400
    if (percentage >= 75) return 'rgb(34, 197, 94)' // green-500
    if (percentage >= 50) return 'rgb(59, 130, 246)' // blue-500
    if (percentage >= 25) return 'rgb(234, 179, 8)' // yellow-500
    return 'rgb(239, 68, 68)' // red-500
  }

  // If not authenticated or not an organizer, don't render anything
  if (!user || userMetadata?.role !== "organizer") {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header with welcome message and quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {userMetadata?.full_name}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button asChild className="gap-2">
              <Link href="/create-event">
                <PlusCircle className="w-4 h-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-blue-50 to-white border-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {totalEvents}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-green-50 to-white border-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.upcomingEvents}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-purple-50 to-white border-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {totalRegistrations}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-50">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-orange-50 to-white border-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Attendance</p>
              <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-orange-50">
              <BarChart2 className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent & Important Events */}
        <Card className="lg:col-span-2 overflow-hidden border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recent & Important Events</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="p-4 max-w-[500px] bg-black/50 text-white backdrop-blur-sm border-0">
                      <div className="flex gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-white/90">Progress Colors</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
                              <span className="text-sm text-white/80">≥75% filled</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                              <span className="text-sm text-white/80">≥50% filled</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600" />
                              <span className="text-sm text-white/80">≥25% filled</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
                              <span className="text-sm text-white/80">&lt;25% filled</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-white/90">Event Status Colors</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                              <span className="text-sm text-white/80">Upcoming/Draft</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
                              <span className="text-sm text-white/80">Ongoing/Published</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600" />
                              <span className="text-sm text-white/80">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
                              <span className="text-sm text-white/80">Cancelled</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/organizer/events" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
                <p className="text-gray-500 mb-4">Create your first event to get started</p>
                <Button asChild>
                  <Link href="/create-event">Create Event</Link>
                </Button>
              </div>
            ) : (
              // Show only the 5 most recent or upcoming events
              filteredEvents
                .sort((a, b) => {
                  // Prioritize upcoming events
                  if (a.status.toLowerCase() === 'upcoming' && b.status.toLowerCase() !== 'upcoming') return -1;
                  if (a.status.toLowerCase() !== 'upcoming' && b.status.toLowerCase() === 'upcoming') return 1;
                  // Then sort by date
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                })
                .slice(0, 5)
                .map((event) => {
                  const progressPercentage = (event.registrations / event.capacity) * 100;
                  const borderColor = getBorderColor(progressPercentage, event.status);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 hover:bg-gray-50 transition-colors group"
                      style={{ borderLeft: `4px solid ${borderColor}` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                            <Badge className={`${getStatusColor(event.status)} text-white px-3 py-1 rounded-full shadow-lg`}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span>{event.registrations}/{event.capacity}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/organizer/events/${event.id}`)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
            )}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
            <div className="space-y-3">
              {Array.from(new Set(events.map(e => e.category))).map(category => {
                const count = events.filter(e => e.category === category).length;
                const percentage = (count / totalEvents) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                        <span className="text-sm text-gray-600">{category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {count} events
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getCategoryColor(category)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/create-event">
                  <PlusCircle className="w-4 h-4" />
                  Create New Event
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/organizer/events">
                  <Calendar className="w-4 h-4" />
                  Manage Events
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export Event Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
