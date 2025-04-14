"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, MapPin, Clock, Users, Ticket, ArrowLeft, Info, 
  FileText, Award, HelpCircle, Share2, Bookmark, Building2, 
  Mail, Globe, CheckCircle2, Facebook, Twitter, Linkedin, 
  ChevronUp, ChevronDown, Edit, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, X,
  Instagram, Phone, Plus, Trash2
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
import { toast } from "sonner"
import { useAuth } from "@/app/contexts/AuthContext"
import { supabase } from "@/app/utils/supabase"

// Add proper type definitions
interface EventSchedule {
  time: string;
  title: string;
  description: string;
}

interface EventSpeaker {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface EventVenue {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  facilities: string[];
}

interface EventOrganizer {
  id: string;
  name: string;
  logo: string;
  website: string;
  email: string;
  description: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  user_id: string;
}

interface EventData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  price: string;
  category: string;
  status: string;
  coverImage: string;
  gallery: string[];
  rules: string[];
  eligibility: string[];
  schedule: EventSchedule[];
  speakers: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  venue: EventVenue;
  organizer: EventOrganizer;
}

// Mock event data with proper images - this will be used as a template
const mockEventData = {
  id: "",
  title: "New Event",
  subtitle: "Event subtitle",
  date: "",
  time: "",
  location: "",
  attendees: 0,
  capacity: 100,
  price: "₹0",
  category: "General",
  status: "Draft",
  coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop&q=80",
  description: "Event description",
  longDescription: "Detailed event description",
  gallery: [],
  eligibility: [],
  rules: [],
  schedule: [],
  speakers: [],
  venue: {
    name: "",
    address: "",
    coordinates: { lat: 0, lng: 0 },
    images: [],
    facilities: []
  },
  organizer: {
    name: "",
    logo: "",
    website: "",
    email: "",
    description: ""
  }
};

export default function CreateEvent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [eventData, setEventData] = useState<EventData>({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    longDescription: "",
    date: "",
    time: "",
    location: "",
    attendees: 0,
    capacity: 0,
    price: "",
    category: "",
    status: "draft",
    coverImage: "",
    gallery: [],
    eligibility: [],
    rules: [],
    schedule: [],
    speakers: [],
    venue: {
      name: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
      images: [],
      facilities: []
    },
    organizer: {
      id: "",
      name: "",
      logo: "",
      website: "",
      email: "",
    description: "",
      user_id: ""
    }
  })
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    rules: false,
    eligibility: false,
    schedule: false,
    venue: false
  })
  const [organizerData, setOrganizerData] = useState<EventOrganizer | null>(null)
  const { user } = useAuth()

  // Fetch organizer data
  useEffect(() => {
    const fetchOrganizerData = async () => {
      if (!user?.id) return;

      try {
        const { data: organizerData, error: organizerError } = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (organizerError) {
          console.error('Error fetching organizer:', organizerError);
          return;
        }

        if (organizerData) {
          setOrganizerData(organizerData);
          // Update eventData with organizer info
          setEventData(prev => ({
            ...prev,
            organizer: {
              id: organizerData.id,
              name: organizerData.name,
              logo: organizerData.logo,
              website: organizerData.website,
              email: organizerData.email,
              description: organizerData.description,
              phone: organizerData.phone,
              linkedin: organizerData.linkedin,
              twitter: organizerData.twitter,
              instagram: organizerData.instagram,
              user_id: organizerData.user_id
            }
          }));
        }
      } catch (error) {
        console.error('Error in fetchOrganizerData:', error);
      }
    };

    fetchOrganizerData();
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  const expandVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  }

  const shareMenuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: keyof EventData, field: string, value: any) => {
    setEventData(prev => {
      if (typeof prev[parent] === 'object' && prev[parent] !== null) {
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleArrayInputChange = (field: keyof EventData, index: number, value: any) => {
    setEventData(prev => {
      const fieldValue = prev[field];
      if (!Array.isArray(fieldValue)) return prev;

      const newArray = [...fieldValue];
      if (typeof newArray[index] === 'object') {
        newArray[index] = { ...newArray[index], ...value };
      } else {
        newArray[index] = value;
      }
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleScheduleChange = (index: number, field: keyof EventSchedule, value: string) => {
    setEventData(prev => {
      const newSchedule = [...prev.schedule];
      if (!newSchedule[index]) {
        newSchedule[index] = { time: '', title: '', description: '' };
      }
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value
      };
      return {
        ...prev,
        schedule: newSchedule
      };
    });
  };

  // Handle array item changes
  const handleAddArrayItem = (field: keyof EventData, template: any) => {
    setEventData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), template]
    }));
  };

  // Remove item from array
  const handleRemoveArrayItem = (field: keyof EventData, index: number) => {
    setEventData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      // First get the organizer record
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (organizerError) {
        throw organizerError
      }

      if (!organizerData) {
        throw new Error('No organizer record found')
      }

      // Prepare event data for insertion
      const eventToInsert = {
        title: eventData.title,
        subtitle: eventData.subtitle,
        description: eventData.description,
        long_description: eventData.longDescription,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        capacity: eventData.capacity,
        price: eventData.price,
        category: eventData.category,
        status: eventData.status,
        cover_image: eventData.coverImage,
        gallery: eventData.gallery,
        rules: eventData.rules,
        eligibility: eventData.eligibility,
        schedule: eventData.schedule,
        speakers: eventData.speakers,
        venue: {
          name: eventData.venue.name,
          address: eventData.venue.address,
          coordinates: eventData.venue.coordinates,
          images: eventData.venue.images,
          facilities: eventData.venue.facilities
        },
        organizer_id: organizerData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert the event
      const { data: insertedEvent, error: insertError } = await supabase
        .from('events')
        .insert([eventToInsert])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      toast.success("Event created successfully!")
      router.push("/organizer/events")
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create event')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Add this after the handleInputChange function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const files = Array.from(e.target.files)
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${type}/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('event-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
        setUploadProgress((prev) => Math.min(prev + (100 / files.length), 100))
      }

      // Update event data based on upload type
      if (type === 'cover') {
        setEventData(prev => ({
          ...prev,
          coverImage: uploadedUrls[0]
        }))
      } else {
        setEventData(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...uploadedUrls]
        }))
      }

      toast.success(`${type === 'cover' ? 'Cover image' : 'Gallery images'} uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 gap-2"
              onClick={() => router.push('/organizer/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Cover Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 z-10"></div>
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Upload cover image</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="space-y-2">
                  <Input 
                    value={eventData.title} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-3xl font-bold bg-white/90"
                    placeholder="Event Title"
                  />
                  <Input 
                    value={eventData.subtitle} 
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="text-lg bg-white/90"
                    placeholder="Event Subtitle"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <Card className="p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Event Gallery</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Add Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Gallery Images</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="gallery-images">Gallery Images</Label>
                        <Input 
                          id="gallery-images" 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={(e) => handleImageUpload(e, 'gallery')}
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventData.gallery.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className="relative h-48 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newGallery = [...eventData.gallery]
                        newGallery.splice(index, 1)
                        setEventData(prev => ({
                          ...prev,
                          gallery: newGallery
                        }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {eventData.gallery.length === 0 && (
                  <div className="col-span-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images uploaded yet</p>
                      <p className="text-sm text-gray-400">Click "Add Images" to upload</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Event Info & Organizer */}
              <div className="lg:col-span-1 space-y-6">
                {/* Event Quick Info */}
                <Card className="p-6 shadow-md border-2 border-blue-100 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-100">
                        <Calendar className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="event-date" className="text-sm text-gray-500">Date</Label>
                        <Input 
                          id="event-date" 
                          value={eventData.date} 
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          placeholder="Event Date"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="event-time" className="text-sm text-gray-500">Time</Label>
                        <Input 
                          id="event-time" 
                          value={eventData.time} 
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          placeholder="Event Time"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <MapPin className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="event-location" className="text-sm text-gray-500">Location</Label>
                        <Input 
                          id="event-location" 
                          value={eventData.location} 
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Event Location"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="event-capacity" className="text-sm text-gray-500">Capacity</Label>
                        <Input 
                          id="event-capacity" 
                          type="number"
                          value={eventData.capacity} 
                          onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                          placeholder="Event Capacity"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Venue Card */}
                <Card className="p-6 shadow-md border-2 border-purple-100 bg-white overflow-hidden">
                  <h3 className="font-semibold text-gray-900 mb-4">Venue</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="venue-name" className="text-sm text-gray-500">Venue Name</Label>
                      <Input 
                        id="venue-name" 
                        value={eventData.venue.name} 
                        onChange={(e) => handleNestedInputChange('venue', 'name', e.target.value)}
                        placeholder="Venue Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue-address" className="text-sm text-gray-500">Address</Label>
                      <Input 
                        id="venue-address" 
                        value={eventData.venue.address} 
                        onChange={(e) => handleNestedInputChange('venue', 'address', e.target.value)}
                        placeholder="Venue Address"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Facilities</Label>
                      <div className="space-y-2">
                        {eventData.venue.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={facility} 
                              onChange={(e) => {
                                const newFacilities = [...eventData.venue.facilities]
                                newFacilities[index] = e.target.value
                                handleNestedInputChange('venue', 'facilities', newFacilities)
                              }}
                              placeholder="Facility"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const newFacilities = eventData.venue.facilities.filter((_, i) => i !== index)
                                handleNestedInputChange('venue', 'facilities', newFacilities)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newFacilities = [...eventData.venue.facilities, ""]
                            handleNestedInputChange('venue', 'facilities', newFacilities)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Facility
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Organizer Card */}
                <Card className="p-6 shadow-md border-2 border-orange-100 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={organizerData?.logo || "https://via.placeholder.com/150?text=Logo"}
                          alt={organizerData?.name || "Organizer"}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Organized by</h3>
                        <h4 className="text-gray-700">{organizerData?.name || "Loading..."}</h4>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{organizerData?.email || "Loading..."}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{organizerData?.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{organizerData?.website || "Not provided"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {organizerData?.linkedin && (
                        <a href={organizerData.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {organizerData?.twitter && (
                        <a href={organizerData.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {organizerData?.instagram && (
                        <a href={organizerData.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{organizerData?.description || "Loading..."}</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Registration Card */}
                <Card className="p-6 shadow-md border-2 border-green-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start mb-6">
            <div>
                      <h3 className="text-xl font-bold text-gray-900">Registration</h3>
                      <p className="text-gray-600">Configure registration settings</p>
                    </div>
                    <Badge className="px-3 py-1 bg-green-100 text-green-700">
                      {eventData.status}
                    </Badge>
                  </div>
                  
                  {/* Ticket Information */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-orange-500" />
                        <span className="font-medium text-gray-900">Event Ticket</span>
                      </div>
                      <Input 
                        value={eventData.price} 
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-32 text-right font-bold"
                        placeholder="Price"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-green-50 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
                          <p className="text-sm font-medium text-gray-900">Refund Policy</p>
                          <Input 
                            placeholder="Refund policy details"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-blue-50 mt-0.5">
                          <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div>
                          <p className="text-sm font-medium text-gray-900">Ticket Includes</p>
                          <Input 
                            placeholder="What's included with the ticket"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-purple-50 mt-0.5">
                          <Info className="h-4 w-4 text-purple-500" />
            </div>
            <div>
                          <p className="text-sm font-medium text-gray-900">Important Note</p>
                          <Input 
                            placeholder="Important information for attendees"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 mb-6 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="details" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                    >
                      <Info className="h-4 w-4 text-blue-500" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="eligibility" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Eligibility
                    </TabsTrigger>
                    <TabsTrigger 
                      value="schedule" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                    >
                      <Calendar className="h-4 w-4 text-purple-500" />
                      Schedule
                    </TabsTrigger>
                    <TabsTrigger 
                      value="speakers" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                    >
                      <Users className="h-4 w-4 text-orange-500" />
                      Speakers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rules" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                    >
                      <FileText className="h-4 w-4 text-pink-500" />
                      Rules
                    </TabsTrigger>
                  </TabsList>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="details" className="mt-0">
                        <Card className="p-6 shadow-sm border-2 border-blue-100">
                          <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="event-description" className="text-sm text-gray-500">Short Description</Label>
              <Textarea
                                id="event-description" 
                value={eventData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Brief description of the event"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="event-long-description" className="text-sm text-gray-500">Detailed Description</Label>
                              <Textarea 
                                id="event-long-description" 
                                value={eventData.longDescription} 
                                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                                placeholder="Detailed description of the event"
                                rows={6}
                              />
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="eligibility" className="mt-0">
                        <Card className="p-6 shadow-sm border-2 border-green-100">
                          <h3 className="text-xl font-semibold mb-4">Eligibility Criteria</h3>
                          <div className="space-y-3">
                            {eventData.eligibility.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input 
                                  value={item} 
                                  onChange={(e) => {
                                    const newEligibility = [...eventData.eligibility]
                                    newEligibility[index] = e.target.value
                                    handleInputChange('eligibility', newEligibility)
                                  }}
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
                              onClick={() => handleAddArrayItem('eligibility', '')}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Eligibility Criteria
                            </Button>
                          </div>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="schedule" className="mt-0">
                        <Card className="p-6 shadow-sm border-2 border-purple-100">
                          <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
                          <div className="space-y-4">
                            {eventData.schedule.map((item, index) => (
                              <div key={index} className="grid grid-cols-3 gap-2">
                                <Input 
                                  value={item.time}
                                  onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                                  placeholder="Time"
                                />
                                <Input 
                                  value={item.title}
                                  onChange={(e) => handleScheduleChange(index, 'title', e.target.value)}
                                  placeholder="Title"
                                  className="col-span-2"
                                />
                                <Textarea 
                                  value={item.description}
                                  onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                                  placeholder="Description"
                                  className="col-span-3"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveArrayItem('schedule', index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => handleAddArrayItem('schedule', { time: '', title: '', description: '' })}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Schedule Item
                            </Button>
                          </div>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="speakers" className="mt-0">
                        <Card className="p-6 shadow-sm border-2 border-orange-100">
                          <h3 className="text-xl font-semibold mb-4">Featured Speakers</h3>
                          <div className="space-y-6">
                            {eventData.speakers?.map((speaker, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-medium">Speaker {index + 1}</h4>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveArrayItem('speakers', index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`speaker-name-${index}`} className="text-sm text-gray-500">Name</Label>
                                    <Input 
                                      id={`speaker-name-${index}`}
                                      value={speaker.name} 
                                      onChange={(e) => handleArrayInputChange('speakers', index, { name: e.target.value })}
                                      placeholder="Speaker Name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`speaker-role-${index}`} className="text-sm text-gray-500">Role</Label>
                                    <Input 
                                      id={`speaker-role-${index}`}
                                      value={speaker.role} 
                                      onChange={(e) => handleArrayInputChange('speakers', index, { role: e.target.value })}
                                      placeholder="Speaker Role"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label htmlFor={`speaker-bio-${index}`} className="text-sm text-gray-500">Bio</Label>
                                    <Textarea 
                                      id={`speaker-bio-${index}`}
                                      value={speaker.bio} 
                                      onChange={(e) => handleArrayInputChange('speakers', index, { bio: e.target.value })}
                                      placeholder="Speaker Bio"
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => handleAddArrayItem('speakers', { name: '', role: '', bio: '' })}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Speaker
                            </Button>
                          </div>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="rules" className="mt-0">
                        <Card className="p-6 shadow-sm border-2 border-pink-100">
                          <h3 className="text-xl font-semibold mb-4">Event Rules & Guidelines</h3>
                          <div className="space-y-3">
                            {eventData.rules.map((rule, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input 
                                  value={rule} 
                                  onChange={(e) => {
                                    const newRules = [...eventData.rules]
                                    newRules[index] = e.target.value
                                    handleInputChange('rules', newRules)
                                  }}
                                  placeholder="Event rule"
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
                              onClick={() => handleAddArrayItem('rules', '')}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Rule
                            </Button>
                          </div>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => {
                      handleInputChange('status', 'draft');
                      handleSubmit(new Event('submit'));
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    onClick={() => {
                      handleInputChange('status', 'published');
                      handleSubmit(new Event('submit'));
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Publishing...
                      </div>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Publish Event
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


