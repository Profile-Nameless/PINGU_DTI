"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function RegisterPage() {
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
    venue: "Building A",
    image: "/placeholder.svg?height=400&width=800",
    category: "Technology",
    capacity: "250 attendees",
    ticketPrice: "Free"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    // Redirect to payment page
    router.push(`/payment?eventId=${eventId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Event Details */}
          <motion.div
            initial={isMounted ? { opacity: 0, x: -20 } : false}
            animate={isMounted ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-8 space-y-8">
              {/* Event Image */}
              <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-2">
                    {event.category}
                  </span>
                  <h1 className="text-2xl font-bold text-white">{event.title}</h1>
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl p-6 shadow-lg border border-gray-200/50 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span>{event.location}, {event.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span>{event.capacity}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ticket Price</span>
                    <span className="text-xl font-semibold text-gray-900">{event.ticketPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={isMounted ? { opacity: 0, x: 20 } : false}
            animate={isMounted ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register for Event</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        className="text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        className="text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      required
                      className="text-gray-900"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-medium text-gray-700">
                      Organization/Institution
                    </label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Your organization"
                      required
                      className="text-gray-900"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                        Terms and Conditions
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-11"
                >
                  Complete Registration
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 