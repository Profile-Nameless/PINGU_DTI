"use client"

import { useState, useEffect, useMemo, useCallback, Suspense, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { supabase } from "./utils/supabase"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { Space_Grotesk } from 'next/font/google'
import { useInView } from 'react-intersection-observer'
import { useAuth } from "./contexts/AuthContext"
import { getPopularEvents, getRandomEvents, getEventsFromCollege, DisplayEvent } from "./utils/events"

// Preload the font to improve LCP
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

// Dynamically import components with loading fallbacks
const AutoScrollCarousel = dynamic(() => import('./components/AutoScrollCarousel'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gradient-to-b from-white via-white to-purple-50 animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: true
})

const CategorySection = dynamic(() => import('./components/CategorySection'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gradient-to-b from-white via-white to-purple-50 animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true
})

// Preload components
if (typeof window !== 'undefined') {
  const preloadComponents = () => {
    import('./components/AutoScrollCarousel')
    import('./components/CategorySection')
  }
  // Preload after initial render
  setTimeout(preloadComponents, 1000)
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [popularEvents, setPopularEvents] = useState<DisplayEvent[]>([])
  const [collegeEvents, setCollegeEvents] = useState<DisplayEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEvents, setShowEvents] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false)
  const { user } = useAuth()

  // Add a ref to track if hero animation has played
  const heroAnimationPlayed = useRef(false)
  // Add a ref to track if events have been loaded
  const eventsLoaded = useRef(false)
  // Add a ref to track mounted state
  const mountedRef = useRef(false)

  // Intersection observer hooks for lazy loading with reduced threshold
  const [eventsRef, eventsInView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '50px 0px'
  })

  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '50px 0px'
  })

  // Memoize the fetch events function
  const fetchEvents = useCallback(async () => {
    try {
      console.log('Starting fetchEvents...');
      setIsLoading(true);
      
      // Get user profile first
      console.log('Fetching user profile...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('college')
          .eq('id', user.id)
          .single();
          
        console.log('User profile:', profile);
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        // Fetch popular events and college events in parallel
        console.log('Fetching popular and college events...');
        const [popularEvents, collegeEvents] = await Promise.all([
          getPopularEvents(8),
          profile?.college ? getEventsFromCollege(profile.college, 8) : Promise.resolve([])
        ]);
        
        console.log('Popular events:', popularEvents);
        console.log('College events:', collegeEvents);
        
        setPopularEvents(popularEvents)
        setCollegeEvents(collegeEvents)
        eventsLoaded.current = true
        setIsLoading(false)
        // Show events section after data is loaded
        setTimeout(() => {
          setShowEvents(true)
          // Show categories section after events are shown
          setTimeout(() => {
            setShowCategories(true)
          }, 1000)
        }, 500)
      } else {
        // If no user, just fetch popular events
        console.log('No user found, fetching only popular events...');
        const popularEvents = await getPopularEvents(8);
        console.log('Popular events (no user):', popularEvents);
        
        setPopularEvents(popularEvents)
        setCollegeEvents([])
        eventsLoaded.current = true
        setIsLoading(false)
        setShowEvents(true)
        setTimeout(() => {
          setShowCategories(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      if (mountedRef.current) {
        const random = await getRandomEvents(8)
        setCollegeEvents(random)
        eventsLoaded.current = true
        setIsLoading(false)
        setShowEvents(true)
        setTimeout(() => {
          setShowCategories(true)
        }, 1000)
      }
    }
  }, [])

  // Handle hero section animation completion
  const onHeroAnimationComplete = useCallback(() => {
    if (!mountedRef.current) return;
    setHeroAnimationComplete(true)
    setIsLoaded(true)
    
    // Add a 0.8 second delay before loading events
    setTimeout(() => {
      if (!eventsLoaded.current) {
        fetchEvents()
      }
    }, 800)
  }, [fetchEvents])

  // Load events on mount with a delay
  useEffect(() => {
    mountedRef.current = true
    setIsMounted(true)
    
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Add a separate effect for intersection observer based loading
  useEffect(() => {
    if (eventsInView && !eventsLoaded.current) {
      // Add a small delay when events come into view
      const timer = setTimeout(() => {
        fetchEvents()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [eventsInView, fetchEvents])

  // Memoize the hero section content
  const heroSection = useMemo(() => (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-800 via-indigo-600 to-purple-800 border-b-4 border-blue-800/30">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800/40 via-indigo-600/40 to-purple-800/40" />
      
      <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={isMounted && !heroAnimationPlayed.current ? { opacity: 0, y: 20 } : false}
              animate={isMounted && !heroAnimationPlayed.current ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <h1 className={`${spaceGrotesk.className} text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent overflow-hidden drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]`}>
                  <motion.span
                    initial={!heroAnimationPlayed.current ? { width: "0%" } : { width: "100%" }}
                    animate={!heroAnimationPlayed.current ? { width: "100%" } : { width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block"
                  >
                  PingU
                  </motion.span>
                </h1>
                <motion.div 
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-full"
                  initial={!heroAnimationPlayed.current ? { width: 0, opacity: 0 } : { width: "6rem", opacity: 1 }}
                  animate={!heroAnimationPlayed.current ? { width: "6rem", opacity: 1 } : { width: "6rem", opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (!heroAnimationPlayed.current) {
                      heroAnimationPlayed.current = true
                      // After underline animation, consider hero animation phase 1 complete
                      setTimeout(onHeroAnimationComplete, 2000) // Wait for typewriter to finish
                    }
                  }}
                />
              </div>
            
              <div className="space-y-4">
                <div className="flex justify-center my-6 text-2xl md:text-3xl lg:text-4xl font-medium">
                  <TypewriterEffectSmooth
                    words={[
                      { text: "Your", className: "text-white/90" },
                      { text: "campus", className: "text-white/90" },
                      { text: "events", className: "text-white/90" },
                      { text: "one", className: "text-white/90" },
                      { text: "ping", className: "text-purple-300" },
                      { text: "away.", className: "text-white/90" },
                    ]}
                    className="text-2xl md:text-3xl lg:text-4xl font-medium"
                    cursorClassName="text-white"
                  />
                </div>
                
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                  Discover, connect, and never miss out on what matters.
                </p>

                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
                  initial={!heroAnimationPlayed.current ? { opacity: 0 } : { opacity: 1 }}
                  animate={!heroAnimationPlayed.current ? { opacity: 1 } : { opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.5 }}
                >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 border-white/10"
                >
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-purple-400 hover:bg-indigo-600/30 hover:border-white/40 hover:text-white transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-purple-400">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="font-medium">Join Community</span>
                </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  ), [isMounted])

  // Memoize the events section content with proper loading states
  const eventsSection = useMemo(() => (
    <div className="space-y-16 py-16 bg-gradient-to-b from-white via-white to-purple-50 min-h-[400px]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showEvents ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="min-h-[200px]"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <AutoScrollCarousel events={popularEvents} title="Most Popular Events" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <AutoScrollCarousel events={collegeEvents} title="Events at Your College" />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  ), [isLoading, popularEvents, collegeEvents, showEvents])

  // Memoize the categories section with lazy loading
  const categoriesSection = useMemo(() => (
    <div className="py-16 bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showCategories ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-purple-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-purple-200 rounded"></div>
                    <div className="h-4 bg-purple-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-bold text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">Browse by Category</h2>
                  <Link href="/events">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 group border-2 border-purple-300/30"
                    >
                      Browse All Events
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <CategorySection />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  ), [isLoading, showCategories])

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-white to-purple-100">
      <div className="relative w-full">
        {heroSection}
        {eventsSection}
        {categoriesSection}
      </div>
    </main>
  )
}
