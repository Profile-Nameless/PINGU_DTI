import Image from 'next/image'
import Link from 'next/link'
import { DisplayEvent } from '../utils/events'
import { Calendar, MapPin, Users, Tag } from 'lucide-react'
import { motion } from "framer-motion"

interface EventCardProps {
  event: DisplayEvent
}

export default function EventCard({ event }: EventCardProps) {
  // Helper function to safely get venue name
  const getVenueName = (venue: any): string => {
    if (typeof venue === 'string') return venue;
    if (venue && typeof venue === 'object' && 'name' in venue) return venue.name;
    return 'Venue TBA';
  };

  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.02,
          transition: { 
            type: "spring",
            stiffness: 300,
            damping: 10 
          }
        }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border-x border-b border-gray-300 h-full flex flex-col"
      >
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800"
          >
            {event.category}
          </motion.div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
            <motion.p 
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>{event.date} at {event.time}</span>
            </motion.p>
            <motion.p 
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center"
            >
              <MapPin className="h-4 w-4 mr-2 text-red-500" />
              <span className="line-clamp-1">{event.location}</span>
            </motion.p>
            <motion.p 
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center"
            >
              <Tag className="h-4 w-4 mr-2 text-green-500" />
              <span>{event.organizer}</span>
            </motion.p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center text-sm text-gray-600"
            >
              <Users className="h-4 w-4 mr-1 text-indigo-500" />
              <span>{event.attendees} attending</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Details
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
} 