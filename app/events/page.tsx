"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '../utils/supabase'
import { DisplayEvent } from '../utils/events'
import EventCard from '../components/EventCard'
import { useRouter } from 'next/navigation'
import { Search, Filter, Calendar, Users, Clock } from 'lucide-react'

// Array of placeholder images
const placeholderImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80'
];

// Function to get a random placeholder image
const getRandomPlaceholderImage = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};

// Cache for events data
const eventsCache = {
  data: null as DisplayEvent[] | null,
  timestamp: 0,
  expiry: 5 * 60 * 1000 // 5 minutes in milliseconds
};

export default function BrowseEvents() {
  const [events, setEvents] = useState<DisplayEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'popular' | 'past'>('upcoming')
  const router = useRouter()
  const mountedRef = useRef(false)
  const dataFetchedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    
    // Check if we have cached data that's still valid
    const now = Date.now()
    if (eventsCache.data && (now - eventsCache.timestamp) < eventsCache.expiry) {
      console.log('Using cached events data')
      setEvents(eventsCache.data)
      
      // Extract unique categories from cached data
      const uniqueCategories = Array.from(new Set(eventsCache.data.map(event => event.category)))
      setCategories(uniqueCategories)
      
      setLoading(false)
      return
    }
    
    fetchEvents()
    
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchEvents = async () => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    
    try {
      console.log('Fetching events data...')
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizers!inner (
            id,
            name,
            user_id,
            profiles!inner (
              full_name,
              college
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!mountedRef.current) return

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(event => event.category)))
      setCategories(uniqueCategories)

      // Convert to DisplayEvent format
      const displayEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: new Date(event.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        venue: event.venue,
        location: event.location,
        category: event.category,
        image: event.image || getRandomPlaceholderImage(),
        organizer: event.organizers?.profiles?.full_name || event.organizers?.name || 'Unknown Organizer',
        attendees: event.registrations || 0,
        rawDate: new Date(event.date) // Store raw date for filtering
      }))

      // Update cache
      eventsCache.data = displayEvents
      eventsCache.timestamp = Date.now()

      setEvents(displayEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = !selectedCategory || event.category === selectedCategory
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let matchesTimeFilter = true
      if (timeFilter === 'upcoming') {
        matchesTimeFilter = event.rawDate >= today
      } else if (timeFilter === 'past') {
        matchesTimeFilter = event.rawDate < today
      } else if (timeFilter === 'popular') {
        // Sort by attendees count
        matchesTimeFilter = true // We'll sort by popularity later
      }
      
      return matchesSearch && matchesCategory && matchesTimeFilter
    }).sort((a, b) => {
      if (timeFilter === 'popular') {
        return b.attendees - a.attendees
      }
      return a.rawDate.getTime() - b.rawDate.getTime()
    })
  }, [events, searchTerm, selectedCategory, timeFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-tight uppercase">
            Discover Events
          </h1>
          <p className="text-xl text-blue-100/90 max-w-2xl font-medium">
            Find exciting events happening across colleges and connect with like-minded individuals.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, organizer, location, or category..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gradient-to-r focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    <input
                      type="date"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="">Any</option>
                    <option value="low">Low (0-50)</option>
                    <option value="medium">Medium (51-200)</option>
                    <option value="high">High (201+)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeFilter('upcoming')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                timeFilter === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Upcoming</span>
            </button>
            <button
              onClick={() => setTimeFilter('popular')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                timeFilter === 'popular'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Most Popular</span>
            </button>
            <button
              onClick={() => setTimeFilter('past')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                timeFilter === 'past'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Past</span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setTimeFilter('upcoming');
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

