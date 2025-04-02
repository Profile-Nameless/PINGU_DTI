"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, MapPin, Clock, Users, Ticket, ArrowLeft, Info, 
  FileText, Award, HelpCircle, Share2, Bookmark, Building2, 
  Mail, Globe, CheckCircle2, Facebook, Twitter, Linkedin, 
  ChevronUp, ChevronDown, Edit, Upload, Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getEventById, Event } from "@/app/utils/events"

interface EventDetailsProps {
  id: string
  fromDashboard?: boolean
  mode?: string
}

export default function EventDetails({ id, fromDashboard, mode }: EventDetailsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [event, setEvent] = useState<Event | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Set edit mode if we're in edit mode or preview mode
    if (mode === 'edit' || mode === 'preview') {
      setIsEditMode(true)
    }
    
    // Fetch event data
    const fetchEventData = async () => {
      try {
        setIsLoading(true)
        console.log(`Fetching event data for ID: ${id}`)
        
        if (!id) {
          console.error('No event ID provided')
          setError("Event ID is missing")
          toast.error("Event ID is missing")
          setIsLoading(false)
          return
        }
        
        const eventData = await getEventById(id)
        
        if (eventData) {
          console.log('Event data fetched successfully:', eventData)
          setEvent(eventData)
        } else {
          console.error('Event not found or error fetching event')
          setError("Event not found")
          toast.error("Event not found")
        }
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Failed to load event")
        toast.error("Failed to load event")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEventData()
  }, [id, mode])

  // Initialize edit mode based on props
  useEffect(() => {
    if (fromDashboard || mode === 'preview') {
      setIsEditMode(true)
    }
  }, [fromDashboard, mode])

  const handleBackClick = () => {
    if (fromDashboard) {
      // If we came from the dashboard, go back to the events dashboard
      router.push('/dashboard/events')
    } else {
      // Otherwise use browser history to go back
      window.history.back()
    }
  }

  const handleEditClick = () => {
    if (isEditMode) {
      // If we're in edit mode and clicking the button, save changes
      handleSaveChanges()
    } else {
      // Otherwise, enter edit mode
      setIsEditMode(true)
    }
  }

  const handleSaveChanges = () => {
    // Here you would implement the logic to save changes
    setIsEditMode(false)
    // Show success message
    toast.success("Changes saved successfully!")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate upload progress
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Event not found"}</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button and Edit Button */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={handleBackClick}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {fromDashboard ? "Back to Events Dashboard" : "Back"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {fromDashboard ? "Return to events dashboard" : "Return to previous page"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Show edit button when coming from dashboard or in edit mode */}
          {(fromDashboard || mode === 'preview' || isEditMode) && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Upload Images
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Event Images</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cover-image">Cover Image</Label>
                      <Input 
                        id="cover-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-images">Gallery Images</Label>
                      <Input 
                        id="gallery-images" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="default" 
                className="gap-2"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Edit Event"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Event Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={isMounted ? { opacity: 0, y: 20 } : false}
            animate={isMounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Cover Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 z-10"></div>
              <Image
                src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"} 
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {fromDashboard && isEditMode && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                  <Button variant="outline" className="bg-white/90 hover:bg-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Cover Image
                  </Button>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                {isEditMode ? (
                  <div className="space-y-2">
                    <Input 
                      defaultValue={event.title} 
                      className="text-3xl font-bold bg-white/90"
                    />
                    <Input 
                      defaultValue={event.subtitle || ""} 
                      className="text-lg bg-white/90"
                    />
                  </div>
                ) : (
                  <>
                    <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {event.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {event.title}
                    </h1>
                    <p className="text-white/90 text-lg">
                      {event.subtitle || ""}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Event Info & Organizer */}
              <div className="lg:col-span-1 space-y-6">
                {/* Event Quick Info */}
                <Card className="p-6 shadow-md border-0 bg-white">
                  <div className="space-y-4">
                    {isEditMode ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-orange-100">
                            <Calendar className="h-5 w-5 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="event-date" className="text-sm text-gray-500">Date</Label>
                            <Input id="event-date" defaultValue={event.date} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Clock className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="event-time" className="text-sm text-gray-500">Time</Label>
                            <Input id="event-time" defaultValue={event.time} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-purple-100">
                            <MapPin className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="event-location" className="text-sm text-gray-500">Location</Label>
                            <Input id="event-location" defaultValue={event.location} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-orange-100">
                            <Calendar className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{event.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Clock className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{event.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-purple-100">
                            <MapPin className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{event.location}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Organizer Info */}
                <Card className="p-6 shadow-md border-0 bg-white">
                  <h3 className="text-lg font-semibold mb-4">Organizer</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image 
                        src={event.organizer?.logo || "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=300&h=300&fit=crop&q=80"} 
                        alt={event.organizer?.name || "Organizer"} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.organizer?.name || "Event Organizer"}</h4>
                      <p className="text-sm text-gray-500">{event.organizer?.email || "contact@example.com"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.organizer?.description || "Organizer description goes here."}
                  </p>
                </Card>

                {/* Registration Stats */}
                <Card className="p-6 shadow-md border-0 bg-white">
                  <h3 className="text-lg font-semibold mb-4">Registration</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Attendees</span>
                        <span className="text-sm font-medium">{event.registrations || 0} / {event.capacity || 100}</span>
                      </div>
                      <Progress value={((event.registrations || 0) / (event.capacity || 100)) * 100} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">{event.price || "Free"}</p>
                      </div>
                      <Button className="w-full">Register Now</Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Event Details */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="speakers">Speakers</TabsTrigger>
                    <TabsTrigger value="venue">Venue</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-6">
                    <Card className="p-6 shadow-md border-0 bg-white">
                      <h3 className="text-lg font-semibold mb-4">About This Event</h3>
                      <div className="prose max-w-none">
                        <p>{event.description}</p>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-semibold mb-4">Eligibility</h3>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h3>
                        <ul className="space-y-2">
                          {Array.isArray(event.eligibility) ? (
                            event.eligibility.map((criteria, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{criteria}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-600">No specific eligibility criteria</li>
                          )}
                        </ul>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-semibold mb-4">Rules</h3>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Event Rules</h3>
                        <ul className="space-y-2">
                          {Array.isArray(event.rules) ? (
                            event.rules.map((rule, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{rule}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-600">No specific rules for this event</li>
                          )}
                        </ul>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="mt-6">
                    <Card className="p-6 shadow-md border-0 bg-white">
                      <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
                      <div className="space-y-4">
                        {(event.schedule || []).map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-24 font-medium text-blue-600">{item.time}</div>
                            <div className="flex-1">{item.title}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="speakers" className="mt-6">
                    <Card className="p-6 shadow-md border-0 bg-white">
                      <h3 className="text-lg font-semibold mb-4">Speakers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(event.speakers || []).map((speaker, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden">
                              <Image 
                                src={speaker.image} 
                                alt={speaker.name} 
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{speaker.name}</h4>
                              <p className="text-sm text-gray-500">{speaker.role}</p>
                              <p className="text-sm mt-1">{speaker.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="venue" className="mt-6">
                    <Card className="p-6 shadow-md border-0 bg-white">
                      <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
                      <div className="space-y-4">
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <Image 
                            src={event.venue?.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"} 
                            alt={event.venue?.name || "Venue"} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.venue?.name || "Event Venue"}</h4>
                          <p className="text-sm text-gray-500">{event.venue?.address || "Venue address"}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Facilities</h4>
                          <ul className="grid grid-cols-2 gap-2">
                            {(event.venue?.facilities || []).map((facility, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{facility}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 