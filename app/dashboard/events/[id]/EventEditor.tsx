"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, MapPin, Clock, Users, Ticket, ArrowLeft, Info, 
  FileText, Award, HelpCircle, Share2, Bookmark, Building2, 
  Mail, Globe, CheckCircle2, Facebook, Twitter, Linkedin, 
  ChevronUp, ChevronDown, Edit, Upload, Image as ImageIcon,
  Save, X, Plus, Trash2
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
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface EventEditorProps {
  id: string
}

export default function EventEditor({ id }: EventEditorProps) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    location: "",
    attendees: 0,
    capacity: 0,
    price: "",
    category: "",
    status: "",
    coverImage: "",
    description: "",
    longDescription: "",
    gallery: [] as string[],
    eligibility: [] as string[],
    rules: [] as string[],
    schedule: [] as { time: string, title: string }[],
    speakers: [] as { name: string, role: string, image: string, bio: string }[],
    venue: {
      name: "",
      address: "",
      images: [] as string[],
      facilities: [] as string[]
    },
    organizer: {
      name: "",
      logo: "",
      website: "",
      email: "",
      description: ""
    }
  })

  useEffect(() => {
    setIsMounted(true)
    
    // In a real app, you would fetch the event data from your API
    // For now, we'll use the mock data
    setFormData(mockEventData)
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setHasUnsavedChanges(true)
  }

  const handleNestedInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleArrayItemChange = (arrayName: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName as keyof typeof prev] as string[]]
      newArray[index] = value
      return {
        ...prev,
        [arrayName]: newArray
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleAddArrayItem = (arrayName: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName as keyof typeof prev] as string[]), ""]
    }))
    setHasUnsavedChanges(true)
  }

  const handleRemoveArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName as keyof typeof prev] as string[])]
      newArray.splice(index, 1)
      return {
        ...prev,
        [arrayName]: newArray
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleScheduleItemChange = (index: number, field: 'time' | 'title', value: string) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule]
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value
      }
      return {
        ...prev,
        schedule: newSchedule
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleAddScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: "", title: "" }]
    }))
    setHasUnsavedChanges(true)
  }

  const handleRemoveScheduleItem = (index: number) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule]
      newSchedule.splice(index, 1)
      return {
        ...prev,
        schedule: newSchedule
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleSpeakerChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSpeakers = [...prev.speakers]
      newSpeakers[index] = {
        ...newSpeakers[index],
        [field]: value
      }
      return {
        ...prev,
        speakers: newSpeakers
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleAddSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, { name: "", role: "", image: "", bio: "" }]
    }))
    setHasUnsavedChanges(true)
  }

  const handleRemoveSpeaker = (index: number) => {
    setFormData(prev => {
      const newSpeakers = [...prev.speakers]
      newSpeakers.splice(index, 1)
      return {
        ...prev,
        speakers: newSpeakers
      }
    })
    setHasUnsavedChanges(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery' | 'venue' | 'speaker') => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 300)
      
      // In a real app, you would upload the image to your server/cloud storage
      // For now, we'll just use a placeholder URL
      const imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop&q=80"
      
      if (type === 'cover') {
        setFormData(prev => ({
          ...prev,
          coverImage: imageUrl
        }))
      } else if (type === 'gallery') {
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, imageUrl]
        }))
      } else if (type === 'venue') {
        setFormData(prev => ({
          ...prev,
          venue: {
            ...prev.venue,
            images: [...prev.venue.images, imageUrl]
          }
        }))
      }
      
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveChanges = () => {
    setIsSaving(true)
    
    // Simulate API call to save changes
    setTimeout(() => {
      setIsSaving(false)
      setHasUnsavedChanges(false)
      toast.success("Event details saved successfully!")
    }, 1500)
  }

  const handlePreviewClick = () => {
    setIsPreviewMode(true)
    // In a real app, you would navigate to the public event page
    // For now, we'll just show a message
    toast.info("Preview mode activated. In a real app, this would navigate to the public event page.")
  }

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      // Show confirmation dialog
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push('/dashboard/events')
      }
    } else {
      router.push('/dashboard/events')
    }
  }

  // Mock event data - in a real app, this would come from your API
  const mockEventData = {
    id,
    title: "Tech Symposium 2024",
    subtitle: "Join us for the biggest technology event of the year",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    attendees: 500,
    capacity: 600,
    price: "₹500",
    category: "Technology",
    status: "Upcoming",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop&q=80",
    description: "Join us for an exciting day of technology innovation and learning. The Tech Symposium brings together industry experts, students, and professionals to discuss the latest trends in technology.",
    longDescription: "The Tech Symposium 2024 is a premier technology conference that brings together industry leaders, innovators, and enthusiasts for a day of learning, networking, and inspiration. This year's theme focuses on 'The Future of Technology' with keynote speeches from renowned tech leaders, interactive workshops, and panel discussions on emerging technologies.",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&q=80"
    ],
    eligibility: [
      "Open to all college students",
      "Basic knowledge of technology concepts",
      "Laptop required for workshops",
      "Valid student ID required",
      "Registration must be completed 48 hours before the event"
    ],
    organizer: {
      name: "Computer Science Department",
      logo: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=300&h=300&fit=crop&q=80",
      website: "https://csdepartment.edu",
      email: "events@csdepartment.edu",
      description: "The Computer Science Department is dedicated to fostering innovation and learning in technology. We organize various events throughout the year to bring together students, professionals, and industry experts."
    },
    rules: [
      "All attendees must register in advance",
      "Valid ID required for entry",
      "No recording of sessions without permission",
      "Follow venue rules and regulations",
      "Respect all speakers and participants"
    ],
    schedule: [
      { time: "9:00 AM", title: "Registration & Check-in" },
      { time: "10:00 AM", title: "Opening Ceremony" },
      { time: "11:00 AM", title: "Keynote Speech" },
      { time: "12:30 PM", title: "Lunch Break" },
      { time: "2:00 PM", title: "Panel Discussion" },
      { time: "3:30 PM", title: "Workshop Sessions" },
      { time: "4:00 PM", title: "Closing Ceremony" }
    ],
    speakers: [
      { 
        name: "Dr. Sarah Johnson", 
        role: "CTO, Tech Innovations", 
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80",
        bio: "Dr. Johnson has over 15 years of experience in AI and machine learning."
      },
      { 
        name: "Michael Chen", 
        role: "AI Research Lead, Future Labs", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80",
        bio: "Leading researcher in artificial intelligence and neural networks."
      },
      { 
        name: "Priya Patel", 
        role: "Founder, Digital Solutions", 
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&q=80",
        bio: "Serial entrepreneur with multiple successful tech startups."
      }
    ],
    venue: {
      name: "Main Auditorium",
      address: "123 College Street, Tech City",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      images: [
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop&q=80"
      ],
      facilities: [
        "Air Conditioned",
        "Wi-Fi Available",
        "Wheelchair Accessible",
        "Parking Available"
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Back Button and Actions */}
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
                  Back to Dashboard
                </Button>
              </TooltipTrigger>
              <TooltipContent>Return to events dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handlePreviewClick}
            >
              <Eye className="h-4 w-4" />
              Preview Event
            </Button>
            
            <Button 
              variant="default" 
              className="gap-2"
              onClick={handleSaveChanges}
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Event Editor Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={isMounted ? { opacity: 0, y: 20 } : false}
            animate={isMounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Cover Image */}
            <div className="relative h-[300px] rounded-xl overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 z-10"></div>
              <Image 
                src={formData.coverImage} 
                alt={formData.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/90 hover:bg-white">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Cover Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Cover Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cover-image">Cover Image</Label>
                        <Input 
                          id="cover-image" 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'cover')}
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
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                <div className="space-y-2">
                  <Input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-white/90"
                    placeholder="Event Title"
                  />
                  <Input 
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="text-lg bg-white/90"
                    placeholder="Event Subtitle"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Event Info & Organizer */}
              <div className="lg:col-span-1 space-y-6">
                {/* Event Quick Info */}
                <Card className="p-6 shadow-md border-0 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="Event Date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input 
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="Event Time"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Event Location"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attendees">Current Attendees</Label>
                        <Input 
                          id="attendees"
                          name="attendees"
                          type="number"
                          value={formData.attendees}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input 
                          id="capacity"
                          name="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input 
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Event Price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Event Category"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Input 
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        placeholder="Event Status"
                      />
                    </div>
                  </div>
                </Card>

                {/* Venue Card */}
                <Card className="p-6 shadow-md border-0 bg-white overflow-hidden">
                  <h3 className="font-semibold text-gray-900 mb-4">Venue</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue-name">Venue Name</Label>
                      <Input 
                        id="venue-name"
                        value={formData.venue.name}
                        onChange={(e) => handleNestedInputChange('venue', 'name', e.target.value)}
                        placeholder="Venue Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue-address">Address</Label>
                      <Input 
                        id="venue-address"
                        value={formData.venue.address}
                        onChange={(e) => handleNestedInputChange('venue', 'address', e.target.value)}
                        placeholder="Venue Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Venue Images</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.venue.images.map((image, index) => (
                          <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Venue image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                const newImages = [...formData.venue.images]
                                newImages.splice(index, 1)
                                setFormData(prev => ({
                                  ...prev,
                                  venue: {
                                    ...prev.venue,
                                    images: newImages
                                  }
                                }))
                                setHasUnsavedChanges(true)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Venue Image
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload Venue Image</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="venue-image">Venue Image</Label>
                              <Input 
                                id="venue-image" 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, 'venue')}
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
                    </div>
                    <div className="space-y-2">
                      <Label>Facilities</Label>
                      {formData.venue.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={facility}
                            onChange={(e) => handleArrayItemChange('venue.facilities', index, e.target.value)}
                            placeholder="Facility"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveArrayItem('venue.facilities', index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleAddArrayItem('venue.facilities')}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Facility
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Organizer Card */}
                <Card className="p-6 shadow-md border-0 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4">Organizer</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Image 
                          src={formData.organizer.logo} 
                          alt={formData.organizer.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          <Label htmlFor="organizer-name">Organizer Name</Label>
                          <Input 
                            id="organizer-name"
                            value={formData.organizer.name}
                            onChange={(e) => handleNestedInputChange('organizer', 'name', e.target.value)}
                            placeholder="Organizer Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer-logo">Logo URL</Label>
                      <Input 
                        id="organizer-logo"
                        value={formData.organizer.logo}
                        onChange={(e) => handleNestedInputChange('organizer', 'logo', e.target.value)}
                        placeholder="Logo URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer-website">Website</Label>
                      <Input 
                        id="organizer-website"
                        value={formData.organizer.website}
                        onChange={(e) => handleNestedInputChange('organizer', 'website', e.target.value)}
                        placeholder="Website URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer-email">Email</Label>
                      <Input 
                        id="organizer-email"
                        value={formData.organizer.email}
                        onChange={(e) => handleNestedInputChange('organizer', 'email', e.target.value)}
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer-description">Description</Label>
                      <Textarea 
                        id="organizer-description"
                        value={formData.organizer.description}
                        onChange={(e) => handleNestedInputChange('organizer', 'description', e.target.value)}
                        placeholder="Organizer Description"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tabs Section */}
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 mb-6">
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Eligibility
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </TabsTrigger>
                    <TabsTrigger value="speakers" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Speakers
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Rules
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-0">
                    <Card className="p-6 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Short Description</Label>
                          <Textarea 
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Short description of the event"
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longDescription">Long Description</Label>
                          <Textarea 
                            id="longDescription"
                            name="longDescription"
                            value={formData.longDescription}
                            onChange={handleInputChange}
                            placeholder="Detailed description of the event"
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="eligibility" className="mt-0">
                    <Card className="p-6 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">Eligibility Criteria</h3>
                      <div className="space-y-4">
                        {formData.eligibility.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={item}
                              onChange={(e) => handleArrayItemChange('eligibility', index, e.target.value)}
                              placeholder="Eligibility criteria"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveArrayItem('eligibility', index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAddArrayItem('eligibility')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Eligibility Criteria
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="mt-0">
                    <Card className="p-6 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
                      <div className="space-y-4">
                        {formData.schedule.map((item, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2">
                            <Input 
                              value={item.time}
                              onChange={(e) => handleScheduleItemChange(index, 'time', e.target.value)}
                              placeholder="Time"
                            />
                            <Input 
                              value={item.title}
                              onChange={(e) => handleScheduleItemChange(index, 'title', e.target.value)}
                              placeholder="Title"
                              className="col-span-2"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveScheduleItem(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleAddScheduleItem}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Schedule Item
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="speakers" className="mt-0">
                    <Card className="p-6 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">Featured Speakers</h3>
                      <div className="space-y-6">
                        {formData.speakers.map((speaker, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">Speaker {index + 1}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveSpeaker(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`speaker-name-${index}`}>Name</Label>
                                <Input 
                                  id={`speaker-name-${index}`}
                                  value={speaker.name}
                                  onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)}
                                  placeholder="Speaker Name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`speaker-role-${index}`}>Role</Label>
                                <Input 
                                  id={`speaker-role-${index}`}
                                  value={speaker.role}
                                  onChange={(e) => handleSpeakerChange(index, 'role', e.target.value)}
                                  placeholder="Speaker Role"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`speaker-bio-${index}`}>Bio</Label>
                              <Textarea 
                                id={`speaker-bio-${index}`}
                                value={speaker.bio}
                                onChange={(e) => handleSpeakerChange(index, 'bio', e.target.value)}
                                placeholder="Speaker Bio"
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`speaker-image-${index}`}>Image URL</Label>
                              <Input 
                                id={`speaker-image-${index}`}
                                value={speaker.image}
                                onChange={(e) => handleSpeakerChange(index, 'image', e.target.value)}
                                placeholder="Image URL"
                              />
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleAddSpeaker}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Speaker
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="rules" className="mt-0">
                    <Card className="p-6 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">Event Rules & Guidelines</h3>
                      <div className="space-y-4">
                        {formData.rules.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={item}
                              onChange={(e) => handleArrayItemChange('rules', index, e.target.value)}
                              placeholder="Rule or guideline"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveArrayItem('rules', index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAddArrayItem('rules')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Rule
                        </Button>
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