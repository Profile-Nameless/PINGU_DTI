"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  Calendar,
  Mail,
  Phone,
  Building,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual data from your database
const allRegistrations = [
  {
    id: 1,
    eventId: 1,
    eventTitle: "Tech Innovation Summit",
    studentName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    college: "Engineering College",
    department: "Computer Science",
    year: "3rd Year",
    registrationDate: "March 10, 2024",
    status: "Confirmed"
  },
  {
    id: 2,
    eventId: 1,
    eventTitle: "Tech Innovation Summit",
    studentName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 98765 43211",
    college: "Engineering College",
    department: "Electronics",
    year: "2nd Year",
    registrationDate: "March 11, 2024",
    status: "Confirmed"
  },
  {
    id: 3,
    eventId: 2,
    eventTitle: "Career Fair Spring 2024",
    studentName: "Mike Johnson",
    email: "mike.j@example.com",
    phone: "+91 98765 43212",
    college: "Business School",
    department: "Marketing",
    year: "4th Year",
    registrationDate: "March 12, 2024",
    status: "Pending"
  },
  {
    id: 4,
    eventId: 3,
    eventTitle: "Alumni Networking Night",
    studentName: "Sarah Wilson",
    email: "sarah.w@example.com",
    phone: "+91 98765 43213",
    college: "Engineering College",
    department: "Mechanical",
    year: "3rd Year",
    registrationDate: "March 13, 2024",
    status: "Confirmed"
  }
]

const events = [
  { id: 1, title: "Tech Innovation Summit" },
  { id: 2, title: "Career Fair Spring 2024" },
  { id: 3, title: "Alumni Networking Night" },
  { id: 4, title: "Hackathon 2024" },
  { id: 5, title: "Cultural Festival" }
]

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRegistrations = allRegistrations.filter(registration => {
    const matchesSearch = 
      registration.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEvent = eventFilter === "all" || registration.eventId.toString() === eventFilter
    const matchesStatus = statusFilter === "all" || registration.status.toLowerCase() === statusFilter
    return matchesSearch && matchesEvent && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
        <p className="text-gray-600">View and manage event registrations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
        >
          <option value="all">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{registration.studentName}</h3>
                  <p className="text-sm text-gray-600">{registration.eventTitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{registration.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{registration.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{registration.college}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{registration.department} • {registration.year}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Registered on</p>
                  <p className="text-sm font-medium text-gray-900">{registration.registrationDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  registration.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {registration.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 