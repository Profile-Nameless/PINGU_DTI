"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter, useParams } from "next/navigation"

export default function SuccessPage() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mock event data - in a real app, fetch this based on eventId
  const event = {
    id: eventId,
    title: "Tech Innovation Summit 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    ticketNumber: "TIS-2024-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={isMounted ? { opacity: 0, y: 20 } : false}
        animate={isMounted ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for registering for {event.title}. Your ticket has been confirmed.
          </p>

          {/* Ticket Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Ticket Number</span>
                <span className="font-mono font-medium text-gray-900">{event.ticketNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Event</span>
                <span className="text-gray-900">{event.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-gray-900">{event.date}, {event.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-900">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-2 border-orange-500/20 hover:bg-orange-50 hover:border-orange-500/30 text-gray-900"
              onClick={() => {
                // Add to calendar functionality
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              className="border-2 border-orange-500/20 hover:bg-orange-50 hover:border-orange-500/30 text-gray-900"
              onClick={() => {
                // Download ticket functionality
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
          </div>

          {/* Back to Event Link */}
          <div className="mt-8">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => router.push(`/events/${params.id}`)}
            >
              Back to Event Details
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 