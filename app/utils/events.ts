import { supabase } from './supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string | { name: string };
  coverimage: string | null;
  coverImage: string | null;
  gallery?: string[];
  category: string;
  organizer_id: string;
  registrations: number;
  created_at: string;
  updated_at: string;
  status: string;
  capacity: number;
  price: number;
  eligibility: string[] | null;
  rules: string[] | null;
  schedule: any;
  interested: number;
  organizers?: {
    id: string;
    name: string;
    user_id: string;
    profiles?: {
      full_name: string;
      college?: string;
    };
  };
}

export interface DisplayEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  image: string;
  category: string;
  organizer: string;
  attendees: number;
  rawDate: Date;
}

// Cache for events and organizers
const eventCache = new Map<string, any>();
const organizerCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const ORGANIZER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Add cache cleanup function
const cleanupCache = (cache: Map<string, any>, duration: number) => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > duration) {
      cache.delete(key);
    }
  }
};

// Function to convert database event to display event
export const convertToDisplayEvent = async (event: Event, organizerName: string = 'Unknown Organizer'): Promise<DisplayEvent> => {
  try {
    // Clean up old cache entries periodically
    if (Math.random() < 0.1) { // 10% chance to clean up on each conversion
      cleanupCache(eventCache, CACHE_DURATION);
      cleanupCache(organizerCache, ORGANIZER_CACHE_DURATION);
    }

    return {
      id: event.id,
      title: event.title,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      venue: typeof event.venue === 'object' && event.venue.name ? event.venue.name : 'Venue TBA',
      image: event.coverimage || event.coverImage || '/placeholder.svg?height=300&width=400',
      category: event.category,
      organizer: organizerName,
      attendees: event.registrations,
      rawDate: new Date(event.date)
    };
  } catch (error) {
    console.error('Error in convertToDisplayEvent:', error);
    return {
      id: event.id || 'unknown',
      title: event.title || 'Unknown Event',
      date: 'Date TBA',
      time: event.time || 'Time TBA',
      location: event.location || 'Location TBA',
      venue: 'Venue TBA',
      image: '/placeholder.svg?height=300&width=400',
      category: event.category || 'Uncategorized',
      organizer: organizerName,
      attendees: event.registrations || 0,
      rawDate: new Date()
    };
  }
};

// Function to get random events with caching
export const getRandomEvents = async (count: number): Promise<DisplayEvent[]> => {
  try {
    const cacheKey = `random_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    // Fetch events with organizer names in a single query
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizers!inner (
          id,
          name,
          user_id,
          profiles!inner (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(count);
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    // Convert to display format with organizer names
    const displayEvents = await Promise.all(
      data.map((event: any) => {
        const organizerName = event.organizers?.profiles?.full_name || event.organizers?.name || 'Unknown Organizer';
        return convertToDisplayEvent(event, organizerName);
      })
    );
    
    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });
    
    return displayEvents;
  } catch (error) {
    return [];
  }
};

// Function to get popular events with caching
export const getPopularEvents = async (count: number): Promise<DisplayEvent[]> => {
  try {
    const cacheKey = `popular_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    // Fetch events with organizer names in a single query
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizers!inner (
          id,
          name,
          user_id,
          profiles!inner (
            full_name
          )
        )
      `)
      .order('registrations', { ascending: false })
      .limit(count);
    
    if (error || !data || data.length === 0) {
      return getRandomEvents(count);
    }
    
    // Convert to display format with organizer names
    const displayEvents = await Promise.all(
      data.map((event: any) => {
        const organizerName = event.organizers?.profiles?.full_name || event.organizers?.name || 'Unknown Organizer';
        return convertToDisplayEvent(event, organizerName);
      })
    );
    
    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });
    
    return displayEvents;
  } catch (error) {
    return getRandomEvents(count);
  }
};

// Function to get events from a specific college with caching
export const getEventsFromCollege = async (college: string, count: number): Promise<DisplayEvent[]> => {
  try {
    if (!college) {
      return getRandomEvents(count);
    }
    
    const cacheKey = `college_${college}_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
    
    // Fetch events with organizer names in a single query
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
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
      .eq('organizers.profiles.college', college)
      .eq('organizers.profiles.role', 'organizer')
      .order('created_at', { ascending: false })
      .limit(count);
    
    if (error || !data || data.length === 0) {
      return getRandomEvents(count);
    }
    
    // Convert to display format with organizer names
    const displayEvents = await Promise.all(
      data.map((event: any) => {
        const organizerName = event.organizers?.profiles?.full_name || event.organizers?.name || 'Unknown Organizer';
        return convertToDisplayEvent(event, organizerName);
      })
    );
    
    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });
    
    return displayEvents;
  } catch (error) {
    return getRandomEvents(count);
  }
};

// Function to fetch a single event by ID
export async function getEventById(id: string): Promise<Event | null> {
  try {
    if (!id) {
      console.error('No event ID provided');
      return null;
    }

    console.log(`Fetching event with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizers!inner (
          id,
          name,
          user_id,
          profiles!inner (
            full_name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === 'PGRST116') {
        console.log(`No event found with ID: ${id}`);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getEventById:', error);
    return null;
  }
}

// Function to get organizer name by ID
export async function getOrganizerNameById(id: string): Promise<string> {
  try {
    if (!id) {
      console.log('No organizer ID provided');
      return 'Unknown Organizer';
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching organizer name:', error);
      return 'Unknown Organizer';
    }

    if (!data) {
      console.log(`No profile found for organizer ID: ${id}`);
      return 'Unknown Organizer';
    }

    return data.full_name || 'Unknown Organizer';
  } catch (error) {
    console.error('Error in getOrganizerNameById:', error);
    return 'Unknown Organizer';
  }
}

// Function to get events by category
export async function getEventsByCategory(category: string, count: number = 8): Promise<DisplayEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizers!inner (
          id,
          name,
          user_id,
          profiles!inner (
            full_name
          )
        )
      `)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error || !data) {
      return [];
    }

    const displayEvents = await Promise.all(
      data.map((event: Event) => {
        const organizerName = event.organizers?.profiles?.full_name || event.organizers?.name || 'Unknown Organizer';
        return convertToDisplayEvent(event, organizerName);
      })
    );

    return displayEvents;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }
} 