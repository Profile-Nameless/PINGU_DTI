"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import AutoScrollCarousel from "./components/AutoScrollCarousel"
import CategorySection from "./components/CategorySection"
import { getPopularEvents, getEventsFromCollege, DisplayEvent, getRandomEvents } from "./utils/events"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [popularEvents, setPopularEvents] = useState<DisplayEvent[]>([])
  const [collegeEvents, setCollegeEvents] = useState<DisplayEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    setIsLoaded(true)
    
    // Fetch events from Supabase
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        // Get 5 popular events based on our comprehensive popularity algorithm
        const popular = await getPopularEvents(5)
        setPopularEvents(popular)
        
        // Get 5 events from organizers at the specified college
        // For testing, we'll use a hardcoded college name
        try {
          const college = await getEventsFromCollege('Test College', 5)
          setCollegeEvents(college)
        } catch (collegeError) {
          console.error("Error fetching college events:", collegeError)
          // If there's an error with college events, just use random events
          const random = await getRandomEvents(5)
          setCollegeEvents(random)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={isMounted ? { opacity: 0, y: 20 } : false}
              animate={isMounted ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PingU
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                Your campus events one ping away. Discover, connect, and never miss out on what matters.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-500/20 text-gray-700 hover:bg-orange-50 hover:border-orange-500/30 hover:text-black transition-all duration-300"
                >
                  <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                  Add to calendar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Carousels */}
      {isLoaded && !isLoading && (
        <div className="space-y-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AutoScrollCarousel events={popularEvents} title="Most Popular Events" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AutoScrollCarousel events={collegeEvents} title="Events at Your College" />
          </motion.div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      )}

      {/* Categories Section */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-16"
        >
          <CategorySection />
        </motion.div>
      )}
    </div>
  )
}
