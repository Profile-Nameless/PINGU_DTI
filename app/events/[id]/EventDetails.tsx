"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, MapPin, Clock, Users, Ticket, ArrowLeft, Info, 
  FileText, Award, HelpCircle, Share2, Bookmark, Building2, 
  Mail, Globe, CheckCircle2, Facebook, Twitter, Linkedin, 
  ChevronUp, ChevronDown, Edit, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, X,
  Instagram, Phone
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
import { supabase } from "@/app/utils/supabase"

interface EventDetailsProps {
  id: string
  fromDashboard?: boolean
  mode?: string
}

// Add proper type definitions
interface EventSchedule {
  time: string;
  title: string;
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
  name: string;
  logo: string;
  website: string;
  email: string;
  description: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

interface Event {
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
  speakers: EventSpeaker[];
  venue: EventVenue;
  organizer: EventOrganizer;
  organizer_id?: string;
}

// Add cache for event data with expiration
const eventCache = new Map();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

// Mock event data with proper images - this will be used for data that can't be fetched
const mockEventData = {
  id: "",
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
};

// Mock speakers data
const mockSpeakers = [
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
];

// Add mock ticket data
const mockTicketData = {
  price: "₹500",
  refundPolicy: "Full refund available up to 48 hours before the event",
  ticketIncludes: [
    "Access to all sessions",
    "Event materials",
    "Networking opportunities",
    "Lunch and refreshments"
  ],
  importantNotes: [
    "Please bring a valid ID for check-in",
    "Digital tickets will be sent to your email",
    "No outside food allowed",
    "Parking available at venue"
  ]
};

// Memoize the ImageWithBlur component
const ImageWithBlur = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const preloadImage = () => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        setIsLoading(false);
        setImgSrc(src);
      };
      img.onerror = () => {
        setImgSrc('/placeholder.svg?height=300&width=400');
        setIsLoading(false);
      };
    };

    preloadImage();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={1200}
        height={600}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={true}
        loading="eager"
        quality={75}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

// Memoize the back button component
const BackButton = memo(({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    className="absolute top-4 left-4 z-20 bg-white/90 hover:bg-white text-gray-900 shadow-md"
    size="sm"
  >
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
));

// Memoize the event info card
const EventInfoCard = memo(({ event, isEditMode }: { event: Event, isEditMode: boolean }) => (
  <Card className="p-6 shadow-md border-2 border-blue-100 bg-white">
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
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-green-100">
          <Users className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Attendees</p>
          <div className="flex items-center gap-2">
            <p className="font-medium">{event.attendees}/{event.capacity}</p>
            <Progress value={(event.attendees / event.capacity) * 100} className="w-20 h-1.5" />
          </div>
        </div>
      </div>
    </div>
  </Card>
));

export default function EventDetails({ id, fromDashboard, mode }: EventDetailsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [eventData, setEventData] = useState<any>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [organizerData, setOrganizerData] = useState<any>(null)
  const [isLoadingOrganizer, setIsLoadingOrganizer] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    rules: false,
    eligibility: false,
    schedule: false,
    venue: false
  })

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

  useEffect(() => {
    setIsMounted(true)
    
    // Set edit mode if we're in edit mode or preview mode
    if (mode === 'edit' || mode === 'preview') {
      setIsEditMode(true)
    }

    // Fetch event data
    fetchEventData()
  }, [mode, id])

  // Initialize edit mode based on props
  useEffect(() => {
    if (fromDashboard || mode === 'preview') {
      setIsEditMode(true)
    }
  }, [fromDashboard, mode])

  // Optimize data processing with useMemo
  const processedEventData = useMemo(() => {
    if (!eventData) return null;
    
    const eventDetail = eventData.event_details;
    const organizer = eventData.organizers;
    
    console.log('Event detail price:', eventDetail.price);
    console.log('Event detail price type:', typeof eventDetail.price);
    
    return {
      ...eventData,
      title: eventDetail.title,
      description: eventDetail.description,
      date: eventDetail.date,
      time: eventDetail.start_time,
      location: eventDetail.location,
      venue: eventDetail.venue,
      coverImage: eventDetail.cover_image,
      category: eventDetail.category,
      attendees: eventDetail.current_registrations,
      capacity: eventDetail.capacity,
      price: eventDetail.price !== null && eventDetail.price !== undefined ? 
        (typeof eventDetail.price === 'number' ? `₹${eventDetail.price}` : eventDetail.price) : 
        'Free',
      refundPolicy: eventDetail.refund_policy || mockTicketData.refundPolicy,
      ticketIncludes: mockTicketData.ticketIncludes,
      importantNotes: mockTicketData.importantNotes,
      rules: eventDetail.rules && Object.keys(eventDetail.rules).length > 0 ? (
        typeof eventDetail.rules === 'string' ? JSON.parse(eventDetail.rules) : 
        typeof eventDetail.rules === 'object' ? Object.values(eventDetail.rules) : 
        eventDetail.rules
      ) : mockEventData.rules,
      eligibility: eventDetail.eligibility && Object.keys(eventDetail.eligibility).length > 0 ? (
        typeof eventDetail.eligibility === 'string' ? JSON.parse(eventDetail.eligibility) : 
        typeof eventDetail.eligibility === 'object' ? Object.values(eventDetail.eligibility) : 
        eventDetail.eligibility
      ) : mockEventData.eligibility,
      schedule: eventDetail.schedule && Object.keys(eventDetail.schedule).length > 0 ? (
        typeof eventDetail.schedule === 'string' ? JSON.parse(eventDetail.schedule) : 
        typeof eventDetail.schedule === 'object' ? 
          Object.entries(eventDetail.schedule).map(([time, title]) => ({ time, title: title as string })) : 
        eventDetail.schedule
      ) : mockEventData.schedule,
      gallery: eventDetail.gallery ? (typeof eventDetail.gallery === 'string' ? JSON.parse(eventDetail.gallery) : eventDetail.gallery) : mockEventData.gallery,
      organizer: {
        name: organizer?.profiles?.[0]?.full_name || organizer?.name || 'Unknown Organizer',
        logo: organizer?.logo || mockEventData.organizer.logo,
        website: organizer?.website || mockEventData.organizer.website,
        email: organizer?.email || mockEventData.organizer.email,
        description: organizer?.description || mockEventData.organizer.description,
        phone: organizer?.phone || mockEventData.organizer.phone,
        linkedin: organizer?.linkedin || mockEventData.organizer.linkedin,
        twitter: organizer?.twitter || mockEventData.organizer.twitter,
        instagram: organizer?.instagram || mockEventData.organizer.instagram,
      }
    };
  }, [eventData]);

  // Optimize event object construction with useMemo
  const event = useMemo(() => ({
    ...mockEventData,
    ...(processedEventData ? {
      id: processedEventData.id || mockEventData.id,
      title: processedEventData.title || mockEventData.title,
      subtitle: processedEventData.subtitle || mockEventData.subtitle,
      description: processedEventData.description || mockEventData.description,
      longDescription: processedEventData.description || mockEventData.longDescription,
      date: processedEventData.date || mockEventData.date,
      time: processedEventData.time || mockEventData.time,
      location: processedEventData.location || mockEventData.location,
      attendees: processedEventData.attendees || mockEventData.attendees,
      capacity: processedEventData.capacity || mockEventData.capacity,
      price: processedEventData.price || 'Free',
      refundPolicy: processedEventData.refundPolicy || mockTicketData.refundPolicy,
      ticketIncludes: processedEventData.ticketIncludes || mockTicketData.ticketIncludes,
      importantNotes: processedEventData.importantNotes || mockTicketData.importantNotes,
      category: processedEventData.category || mockEventData.category,
      status: processedEventData.status || mockEventData.status,
      coverImage: processedEventData.coverImage || mockEventData.coverImage,
      gallery: Array.isArray(processedEventData.gallery) && processedEventData.gallery.length > 0 
        ? processedEventData.gallery 
        : mockEventData.gallery,
      rules: processedEventData.rules,
      eligibility: processedEventData.eligibility,
      schedule: processedEventData.schedule,
      speakers: processedEventData.speakers,
      venue: processedEventData.venue,
      organizer: processedEventData.organizer || mockEventData.organizer,
      organizer_id: processedEventData.organizer_id,
    } : {})
  }), [processedEventData]);

  // Add logging for venue data after event is defined
  useEffect(() => {
    console.log('Venue data:', {
      raw: eventData?.venue,
      processed: processedEventData?.venue,
      final: event.venue
    });
  }, [eventData, processedEventData, event]);

  // Optimize organizer data with useMemo
  const organizer = useMemo(() => 
    organizerData ? {
      name: organizerData.name || event.organizer.name,
      logo: organizerData.logo || event.organizer.logo,
      website: organizerData.website || event.organizer.website,
      email: organizerData.email || event.organizer.email,
      description: organizerData.description || event.organizer.description,
      phone: organizerData.phone,
      linkedin: organizerData.linkedin,
      twitter: organizerData.twitter,
      instagram: organizerData.instagram,
    } : event.organizer,
    [organizerData, event.organizer]
  );

  // Optimize fetchEventData with better caching and error handling
  const fetchEventData = async () => {
    try {
      setIsLoadingEvent(true);
      setError(null);
      
      const cacheKey = `event_${id}`;
      const cachedData = eventCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
        console.log('Using cached event data:', cachedData.data);
        setEventData(cachedData.data);
        if (cachedData.data.organizer_id) {
          fetchOrganizerData(cachedData.data.organizer_id);
        }
        setIsLoadingEvent(false);
        return;
      }
      
      console.log('Fetching event with ID:', id);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          organizer_id,
          status,
          created_at,
          updated_at,
          event_details!inner (
            title,
            description,
            date,
            start_time,
            end_time,
            location,
            venue,
            cover_image,
            gallery,
            category,
            current_registrations,
            capacity,
            price,
            refund_policy,
            eligibility,
            rules,
            schedule
          ),
          organizers!inner (
            id,
            name,
            user_id,
            profiles!inner (
              full_name,
              college
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No event data found for ID:', id);
        throw new Error('Event not found');
      }
      
      console.log('Raw event data from database:', data);
      console.log('Event details:', data.event_details);
      console.log('Event price:', data.event_details[0]?.price);
      console.log('Event refund policy:', data.event_details[0]?.refund_policy);
      
      // Process the event data
      const processedData = {
        ...data,
        event_details: data.event_details[0],
        organizers: data.organizers[0]
      };
      
      console.log('Processed event data:', processedData);
      
      // Cache the fetched data with timestamp
      eventCache.set(cacheKey, {
        data: processedData,
        timestamp: now
      });
      
      setEventData(processedData);
      
      if (processedData.organizer_id) {
        fetchOrganizerData(processedData.organizer_id);
      }
    } catch (err: any) {
      console.error('Error in fetchEventData:', err);
      setError(err.message || 'Failed to load event details');
      toast.error('Failed to load event details');
    } finally {
      setIsLoadingEvent(false);
    }
  };

  // Optimize organizer data fetching with caching
  const organizerCache = new Map();
  const ORGANIZER_CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

  const fetchOrganizerData = async (organizerId: string) => {
    try {
      setIsLoadingOrganizer(true);
      
      const cacheKey = `organizer_${organizerId}`;
      const cachedData = organizerCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && now - cachedData.timestamp < ORGANIZER_CACHE_EXPIRATION) {
        setOrganizerData(cachedData.data);
        setIsLoadingOrganizer(false);
        return;
      }
      
      console.log('Attempting to fetch organizer with ID:', organizerId);
      
      // Check if organizerId is valid
      if (!organizerId) {
        console.log('No organizer ID provided, using fallback data');
        return;
      }
      
      // First try to fetch by ID
      console.log('Trying to fetch by ID...');
      const { data: idData, error: idError } = await supabase
        .from('organizers')
        .select('*')
        .eq('id', organizerId)
        .single();
      
      if (!idError && idData) {
        console.log('Successfully found organizer by ID:', idData);
        // Cache the fetched data with timestamp
        organizerCache.set(cacheKey, {
          data: idData,
          timestamp: now
        });
        setOrganizerData(idData);
        return;
      }
      
      console.log('Failed to fetch by ID, error:', idError);
      
      // If that fails, try to fetch by user_id
      console.log('Trying to fetch by user_id...');
      const { data: userData, error: userError } = await supabase
        .from('organizers')
        .select('*')
        .eq('user_id', organizerId)
        .single();
      
      if (!userError && userData) {
        console.log('Successfully found organizer by user_id:', userData);
        // Cache the fetched data with timestamp
        organizerCache.set(cacheKey, {
          data: userData,
          timestamp: now
        });
        setOrganizerData(userData);
        return;
      }
      
      console.log('Failed to fetch by user_id, error:', userError);
      
      // If both queries fail, log the errors and return
      console.log('Both queries failed, using fallback data');
      
    } catch (err: any) {
      // Log the full error object to see what's happening
      console.error('Unexpected error in fetchOrganizerData:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
    } finally {
      setIsLoadingOrganizer(false);
    }
  };

  // Log the current state for debugging
  useEffect(() => {
    console.log('EventDetails state:', {
      fromDashboard,
      mode,
      isEditMode,
      eventData
    })
  }, [fromDashboard, mode, isEditMode, eventData])

  // Use useCallback for event handlers
  const handleBackClick = useCallback(() => {
    if (fromDashboard) {
      router.push('/dashboard/events');
    } else {
      const referrer = document.referrer;
      if (referrer.includes('/events')) {
        router.back();
      } else {
        router.push('/events');
      }
    }
  }, [fromDashboard, router]);

  const handleEditClick = useCallback(() => {
    if (isEditMode) {
      // If we're in edit mode and clicking the button, save changes
      handleSaveChanges()
    } else {
      // Otherwise, enter edit mode
      setIsEditMode(true)
    }
  }, [isEditMode]);

  const handleSaveChanges = useCallback(() => {
    // Here you would implement the logic to save changes
    setIsEditMode(false)
    // Show success message
    toast.success("Changes saved successfully!")
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Here you would implement the actual image upload logic
      // For now, we're just simulating the upload
    }
  }, []);

  const openGallery = useCallback((index: number) => {
    setCurrentImageIndex(index)
    setGalleryOpen(true)
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % event.gallery.length)
  }, [event.gallery.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + event.gallery.length) % event.gallery.length)
  }, [event.gallery.length]);

  // Log the event object to see what category is being used
  useEffect(() => {
    console.log('Event object:', event)
    console.log('Event category:', event.category)
    console.log('Eligibility data:', event.eligibility)
    console.log('Rules data:', event.rules)
    console.log('Schedule data:', event.schedule)
    console.log('Price data:', event.price)
    console.log('Raw eligibility data:', eventData?.eligibility)
    console.log('Raw rules data:', eventData?.rules)
    console.log('Raw schedule data:', eventData?.schedule)
  }, [event, eventData])

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Show loading state
  if (isLoadingEvent) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Failed to Load Event</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleBackClick} className="mt-4">
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
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Cover Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 z-10"></div>
              <ImageWithBlur
                src={event.coverImage} 
                alt={event.title}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Back Button */}
              <BackButton onClick={handleBackClick} />
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
                      defaultValue={event.subtitle} 
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
                      {event.subtitle}
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
                <EventInfoCard event={event} isEditMode={isEditMode} />

                {/* Venue Card */}
                <Card className="p-6 shadow-md border-2 border-purple-100 bg-white overflow-hidden">
                  <h3 className="font-semibold text-gray-900 mb-4">Venue</h3>
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={event.venue?.images?.[0] || mockEventData.venue.images[0]}
                      alt={event.venue?.name || mockEventData.venue.name}
                      fill
                      className="object-cover"
                    />
            </div>
                  <h4 className="font-medium text-gray-800 mb-2">{event.venue?.name || mockEventData.venue.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{event.venue?.address || mockEventData.venue.address}</p>
                  <div className="space-y-2">
                    {(event.venue?.facilities || mockEventData.venue.facilities).map((facility: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{facility}</span>
            </div>
                ))}
          </div>
                </Card>

                {/* Organizer Card */}
                <Card className="p-6 shadow-md border-2 border-orange-100 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                          src={organizer.logo || "https://via.placeholder.com/150?text=Logo"} 
                          alt={organizer.name}
                          width={64}
                          height={64}
                className="object-cover"
              />
            </div>
            <div>
                        <h3 className="font-semibold text-gray-900">Organized by</h3>
                        <h4 className="text-gray-700">{organizer.name}</h4>
            </div>
            </div>
                    <p className="text-gray-600 text-sm">{organizer.description}</p>
                    <div className="flex flex-col gap-2">
                      {organizer.email && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={`mailto:${organizer.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                                <Mail className="h-4 w-4" />
                                <span>{organizer.email}</span>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>Send email to organizer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {organizer.phone && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={`tel:${organizer.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                                <Phone className="h-4 w-4" />
                                <span>{organizer.phone}</span>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>Call organizer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {organizer.website && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                                <Globe className="h-4 w-4" />
                                <span>Visit Website</span>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>Open organizer's website</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        {organizer.linkedin && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={organizer.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>LinkedIn Profile</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {organizer.twitter && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`https://twitter.com/${organizer.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-200 transition-colors">
                                  <Twitter className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Twitter Profile</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {organizer.instagram && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`https://instagram.com/${organizer.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors">
                                  <Instagram className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Instagram Profile</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Share and Save */}
                <div className="flex gap-3">
                  <div className="relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                <Button 
                            variant="outline" 
                            className="flex-1 gap-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                            onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                >
                            <Share2 className="h-4 w-4" />
                            Share
                            <motion.div
                              animate={{ rotate: isShareMenuOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                </Button>
                        </TooltipTrigger>
                        <TooltipContent>Share this event</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AnimatePresence>
                      {isShareMenuOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={shareMenuVariants}
                          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 space-y-1"
                        >
                <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-blue-600">
                                    <Facebook className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share on Facebook</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-blue-400">
                                    <Twitter className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share on Twitter</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-blue-700">
                                    <Linkedin className="h-4 w-4" />
                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share on LinkedIn</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "flex-1 gap-2 border-2",
                            isSaved 
                              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" 
                              : "border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                          )}
                          onClick={() => setIsSaved(!isSaved)}
                        >
                          <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                          {isSaved ? "Saved" : "Save"}
                  </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isSaved ? "Remove from saved" : "Save this event"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Right Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Registration Card */}
                <Card className="p-6 shadow-md border-2 border-green-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start mb-6">
            <div>
                      <h3 className="text-xl font-bold text-gray-900">Register Now</h3>
                      <p className="text-gray-600">Secure your spot at this exciting event</p>
                    </div>
                    <Badge className={cn(
                      "px-3 py-1",
                      event.status === "Upcoming" ? "bg-green-100 text-green-700" : 
                      event.status === "Ongoing" ? "bg-blue-100 text-blue-700" : 
                      event.status === "Completed" ? "bg-gray-100 text-gray-700" : 
                      event.status === "Cancelled" ? "bg-red-100 text-red-700" : 
                      "bg-purple-100 text-purple-700"
                    )}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  {/* Ticket Information */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-orange-500" />
                        <span className="font-medium text-gray-900">Event Ticket</span>
                      </div>
                      <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                        {event.price || mockTicketData.price}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-green-50 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Refund Policy</p>
                          <p className="text-sm text-gray-600">
                            {event.refundPolicy || mockTicketData.refundPolicy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-blue-50 mt-0.5">
                          <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Ticket Includes</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {(event.ticketIncludes && event.ticketIncludes.length > 0 ? event.ticketIncludes : mockTicketData.ticketIncludes).map((item: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-purple-50 mt-0.5">
                          <Info className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Important Notes</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {(event.importantNotes && event.importantNotes.length > 0 ? event.importantNotes : mockTicketData.importantNotes).map((note: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-purple-500">•</span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className={cn(
                      "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 py-6 text-lg relative",
                      isLoading && "opacity-90 cursor-not-allowed"
                    )}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 2000);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Ticket className="mr-2 h-5 w-5" />
                        Get Tickets
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </Card>

                {/* Event Gallery */}
                <Card className="p-6 shadow-md border-2 border-pink-100 bg-white">
                  <h3 className="text-xl font-semibold mb-4">Event Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {event.gallery.map((image: string, index: number) => (
                  <div 
                    key={index}
                        className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
                        onClick={() => openGallery(index)}
                      >
                        <Image
                          src={image}
                          alt={`Event image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    ))}
                    </div>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 mb-6 bg-gray-100 p-1 rounded-lg">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger 
                            value="details" 
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                          >
                            <Info className="h-4 w-4 text-blue-500" />
                            Details
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Event details and information</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger 
                            value="eligibility" 
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Eligibility
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Check eligibility criteria</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger 
                            value="schedule" 
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                          >
                            <Calendar className="h-4 w-4 text-purple-500" />
                            Schedule
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>View event schedule</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger 
                            value="speakers" 
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                          >
                            <Users className="h-4 w-4 text-orange-500" />
                            Speakers
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Meet our speakers</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger 
                            value="rules" 
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 hover:bg-white/50"
                          >
                            <FileText className="h-4 w-4 text-pink-500" />
                            Rules
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Event rules and guidelines</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                          
                          {isEditMode ? (
                            <Textarea 
                              defaultValue={event.longDescription} 
                              className="min-h-[200px] mb-6"
                            />
                          ) : (
                            <p className="text-gray-600 mb-6">
                              {event.longDescription}
                            </p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Award className="h-4 w-4 text-blue-500" />
                                What You'll Learn
                              </h4>
                              <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  Latest trends in technology
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  Practical applications of AI
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  Future of digital transformation
                                </li>
                              </ul>
                  </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-purple-500" />
                                Who Should Attend
                              </h4>
                              <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  Technology professionals
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  Students and researchers
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  Industry enthusiasts
                                </li>
                              </ul>
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
                            {event.eligibility.map((item: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
                                <div className="p-1 rounded-full bg-green-100 mt-0.5">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </div>
                                <p className="text-gray-600">{item}</p>
                              </div>
                            ))}
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
                            {event.schedule.map((item: EventSchedule, index: number) => (
                              <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-md transition-colors">
                                <div className="w-24 text-sm font-medium text-gray-700">{item.time}</div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                </div>
              </div>
                            ))}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(event.speakers && event.speakers.length > 0 ? event.speakers : mockSpeakers).map((speaker: EventSpeaker, index: number) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center group">
                                <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden">
                                  <Image
                                    src={speaker.image}
                                    alt={speaker.name}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                <h4 className="font-medium">{speaker.name}</h4>
                                <p className="text-sm text-gray-500">{speaker.role}</p>
                                <p className="text-sm text-gray-600 mt-2">{speaker.bio}</p>
                              </div>
                            ))}
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
                            {event.rules.map((rule: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
                                <div className="p-1 rounded-full bg-blue-100 mt-0.5">
                                  <FileText className="h-4 w-4 text-blue-500" />
            </div>
                                <p className="text-gray-600">{rule}</p>
                              </div>
                            ))}
                </div>
                        </Card>
                      </TabsContent>
          </motion.div>
                  </AnimatePresence>
                </Tabs>
        </div>
      </div>
          </motion.div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">Event Gallery</DialogTitle>
          <div className="relative h-[85vh] flex items-center justify-center">
            {/* Previous button */}
            <button 
              onClick={prevImage}
              className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            {/* Next button */}
            <button 
              onClick={nextImage}
              className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={event.gallery[currentImageIndex]}
                alt={`Event image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentImageIndex + 1} / {event.gallery.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 