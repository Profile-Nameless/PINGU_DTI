export interface Event {
  id: number
  title: string
  date: string
  location: string
  image: string
  category: string
  featured?: boolean
}

// Shared events data structure
export const events: Event[] = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    date: "March 15, 2024",
    location: "Main Auditorium",
    image: "/placeholder.svg?height=200&width=300&text=Tech+Summit",
    category: "Technology",
    featured: true,
  },
  {
    id: 2,
    title: "Annual Career Fair",
    date: "March 20, 2024",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=300&text=Career+Fair",
    category: "Career",
    featured: true,
  },
  {
    id: 3,
    title: "Freshman Welcome Week",
    date: "March 10, 2024",
    location: "Various Locations",
    image: "/placeholder.svg?height=200&width=300&text=Welcome+Week",
    category: "Social",
  },
  {
    id: 4,
    title: "Spring Concert",
    date: "March 18, 2024",
    location: "Performing Arts Center",
    image: "/placeholder.svg?height=200&width=300&text=Spring+Concert",
    category: "Music",
  },
  {
    id: 5,
    title: "Alumni Networking Night",
    date: "March 22, 2024",
    location: "Business School",
    image: "/placeholder.svg?height=200&width=300&text=Networking+Night",
    category: "Networking",
  },
  {
    id: 6,
    title: "Research Symposium",
    date: "April 5, 2024",
    location: "Science Building",
    image: "/placeholder.svg?height=200&width=300&text=Research+Symposium",
    category: "Academic",
    featured: true,
  },
  {
    id: 7,
    title: "Hackathon 2024",
    date: "April 12, 2024",
    location: "Engineering Building",
    image: "/placeholder.svg?height=200&width=300&text=Hackathon",
    category: "Technology",
    featured: true,
  },
  {
    id: 8,
    title: "International Food Festival",
    date: "April 20, 2024",
    location: "Campus Green",
    image: "/placeholder.svg?height=200&width=300&text=Food+Festival",
    category: "Cultural",
  },
]

// Helper functions to filter events
export const getPopularEvents = (): Event[] => {
  return events.filter((event) => event.featured)
}

export const getCollegeEvents = (): Event[] => {
  // For this example, we'll return events that aren't featured
  // In a real app, you might filter by college ID or other criteria
  return events.filter((event) => !event.featured)
}

