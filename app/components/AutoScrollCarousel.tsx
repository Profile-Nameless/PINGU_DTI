"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { DisplayEvent } from "../utils/events"

interface AutoScrollCarouselProps {
  events: DisplayEvent[]
  title: string
}

export default function AutoScrollCarousel({ events, title }: AutoScrollCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsPerPage = 3 // Number of cards visible at once

  const totalPages = Math.ceil(events.length / cardsPerPage)

  const scrollToPage = (pageIndex: number) => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth
      const containerWidth = containerRef.current.clientWidth
      const scrollPosition = (scrollWidth - containerWidth) * (pageIndex / (totalPages - 1))
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setCurrentPage(pageIndex)
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth)
      const pageIndex = Math.round(scrollPercentage * (totalPages - 1))
      setCurrentPage(pageIndex)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">
        {title}
      </h2>
      <div className="relative">
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="group w-[300px] flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/events/${event.id}`}>
                <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-10" />
                  <div className="relative h-48">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow-sm mb-2">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-200">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5 text-purple-500" />
                        {event.time}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1.5 text-pink-500" />
                      <span className="line-clamp-1">{event.location} • {event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {event.attendees} attending
                      </span>
                      <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-500">
                        View Event
                        <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentPage === index 
                  ? 'bg-blue-500 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 