"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Calendar, 
  Users, 
  MapPin, 
  Edit, 
  Eye, 
  Trash2,
  MoreVertical
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function EventsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Mock events data - in a real app, this would come from your API
  const events = [
    {
      id: "1",
      title: "Tech Symposium 2024",
      description: "Join us for the biggest technology event of the year",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Main Auditorium",
      attendees: 500,
      capacity: 600,
      status: "Upcoming",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "2",
      title: "Cultural Festival",
      description: "A celebration of diverse cultures and traditions",
      date: "April 5, 2024",
      time: "11:00 AM - 8:00 PM",
      location: "Central Campus",
      attendees: 1200,
      capacity: 1500,
      status: "Upcoming",
      coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "3",
      title: "Career Fair",
      description: "Connect with top employers and explore job opportunities",
      date: "May 10, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Conference Center",
      attendees: 800,
      capacity: 1000,
      status: "Upcoming",
      coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "4",
      title: "Hackathon 2024",
      description: "48-hour coding challenge with amazing prizes",
      date: "June 1-3, 2024",
      time: "All Day",
      location: "Innovation Hub",
      attendees: 150,
      capacity: 200,
      status: "Upcoming",
      coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop&q=80"
    }
  ]

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error("Please enter an event title")
      return
    }

    setIsCreating(true)
    
    // Simulate API call to create event
    setTimeout(() => {
      setIsCreating(false)
      setIsCreateDialogOpen(false)
      setNewEventTitle("")
      setNewEventDescription("")
      toast.success("Event created successfully!")
    }, 1500)
  }

  const handleDeleteEvent = (eventId: string) => {
    // In a real app, you would call your API to delete the event
    toast.success("Event deleted successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events Dashboard</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Enter the basic details for your new event. You can add more information later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input 
                  id="event-title" 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea 
                  id="event-description" 
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Enter event description"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search events..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image 
                src={event.coverImage} 
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-100 text-green-700">{event.status}</Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{event.attendees}/{event.capacity} attendees</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Link href={`/events/${event.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View Event
                    </Button>
                  </Link>
                  <Link href={`/dashboard/events/edit/${event.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 