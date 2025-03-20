"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Users, Ticket, Star, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Upcoming Events",
    value: "8",
    change: "+12%",
    icon: Calendar,
    color: "bg-blue-500"
  },
  {
    title: "Total Attendees",
    value: "1,248",
    change: "+24%",
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Ticket Sales",
    value: "$12,426",
    change: "+18%",
    icon: Ticket,
    color: "bg-purple-500"
  },
  {
    title: "Avg. Satisfaction",
    value: "4.8/5",
    change: "+3%",
    icon: Star,
    color: "bg-yellow-500"
  }
]

const upcomingEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "May 15, 2024",
    time: "10:00 AM",
    location: "Central Park, New York",
    status: "Published",
    progress: 75,
    ticketsSold: "752/1000"
  },
  {
    id: 2,
    title: "Theater Workshop",
    date: "May 22, 2024",
    time: "2:00 PM",
    location: "Downtown Theater",
    status: "Draft",
    progress: 45,
    ticketsSold: "15/50"
  },
  {
    id: 3,
    title: "Tech Conference 2023",
    date: "June 5-7, 2024",
    time: "9:00 AM",
    location: "Convention Center",
    status: "Published",
    progress: 60,
    ticketsSold: "425/500"
  }
]

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border rounded-lg bg-white text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        event.status === 'Published' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Calendar className={`h-6 w-6 ${
                          event.status === 'Published' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'Published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                      <div className="text-sm text-gray-600 mt-1">
                        {event.ticketsSold} tickets sold
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      event.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${event.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
