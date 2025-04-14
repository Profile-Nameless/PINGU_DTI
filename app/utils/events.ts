import { supabase } from './supabase';

export interface Event {
  id: string;
  organizer_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  event_details: {
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    venue: string;
    cover_image: string;
    gallery: string[];
    category: string;
    current_registrations: number;
    capacity: number;
    price: number;
    eligibility: string[];
    rules: string[];
    schedule: string[];
  }[];
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
      location: event.location || 'Location TBA',
      venue: 'Venue TBA',
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
    console.log('Starting getRandomEvents with count:', count);
    const cacheKey = `random_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached random events:', cachedData.data);
      return cachedData.data;
    }

    // Fetch events with event details in a single query
    console.log('Fetching random events...');
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
          eligibility,
          rules,
          schedule
        )
      `)
      .order('created_at', { ascending: false })
      .limit(count);
    
    if (error) {
      console.error('Error fetching random events:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No random events found');
      return [];
    }
    
    console.log('Found random events data:', data);
    
    // Convert to display format
    console.log('Converting random events to display format...');
    const displayEvents = await Promise.all(
      (data as Event[]).map(async (event) => {
        const eventDetail = event.event_details[0];
        const organizerName = await getOrganizerNameById(event.organizer_id);
        
        return convertToDisplayEvent({
          id: event.id,
          title: eventDetail.title,
          description: eventDetail.description,
          date: eventDetail.date,
          time: eventDetail.start_time,
          location: eventDetail.location,
          venue: eventDetail.venue,
          coverImage: eventDetail.cover_image,
          category: eventDetail.category,
          registrations: eventDetail.current_registrations,
          capacity: eventDetail.capacity,
          price: eventDetail.price,
          eligibility: eventDetail.eligibility,
          rules: eventDetail.rules,
          schedule: eventDetail.schedule,
          organizer_id: event.organizer_id,
          status: event.status,
          created_at: event.created_at,
          updated_at: event.updated_at,
          interested: 0
        }, organizerName);
      })
    );
    
    console.log('Converted random display events:', displayEvents);
    
    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });
    
    return displayEvents;
  } catch (error) {
    console.error('Error in getRandomEvents:', error);
    return [];
  }
};

// Function to get popular events with caching
export const getPopularEvents = async (count: number = 8): Promise<DisplayEvent[]> => {
  try {
    console.log('Starting getPopularEvents with count:', count);
    const cacheKey = `popular_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached popular events:', cachedData.data);
      return cachedData.data;
    }

    // Fetch the most registered events (joined with event_details)
    console.log('Fetching top registered events...');
    const { data, error } = await supabase
      .from('event_details')
      .select(`
        *,
        events (
          id,
          organizer_id,
          status,
          created_at,
          updated_at
        )
      `)
      .order('current_registrations', { ascending: false })
      .limit(count);

    if (error || !data || data.length === 0) {
      console.error('Error fetching top registered events:', error);
      return getRandomEvents(count);
    }

    // Convert to display format
    console.log('Converting popular events to display format...');
    const displayEvents = await Promise.all(
      data.map(async (detail: any) => {
        const event = detail.events;
        const organizerName = await getOrganizerNameById(event.organizer_id);

        return convertToDisplayEvent({
          id: event.id,
          title: detail.title,
          description: detail.description,
          date: detail.date,
          time: detail.start_time,
          location: detail.location,
          venue: detail.venue,
          coverImage: detail.cover_image,
          category: detail.category,
          registrations: detail.current_registrations,
          capacity: detail.capacity,
          price: detail.price,
          eligibility: detail.eligibility,
          rules: detail.rules,
          schedule: detail.schedule,
          organizer_id: event.organizer_id,
          status: event.status,
          created_at: event.created_at,
          updated_at: event.updated_at,
          interested: 0
        }, organizerName);
      })
    );

    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });

    return displayEvents;
  } catch (error) {
    console.error('Error in getPopularEvents:', error);
    return getRandomEvents(count);
  }
};

// Function to get events from a specific college with caching
export const getEventsFromCollege = async (college: string, count: number): Promise<DisplayEvent[]> => {
  try {
    if (!college) {
      console.log('No college provided');
      return [];
    }

    console.log('Starting getEventsFromCollege with college:', college);
    const cacheKey = `college_${college}_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached college events:', cachedData.data);
      return cachedData.data;
    }

    // Fetch events directly with a join to profiles
    console.log('Fetching college events...');
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
          eligibility,
          rules,
          schedule
        ),
        organizers!inner (
          id,
          profiles!inner (
            college
          )
        )
      `)
      .eq('organizers.profiles.college', college)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('Error fetching college events:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No events found for college:', college);
      return [];
    }

    console.log('Found events data:', data);

    // Convert events to display format
    console.log('Converting college events to display format...');
    const displayEvents = await Promise.all(
      (data as Event[]).map(async (event) => {
        const eventDetail = event.event_details[0];
        const organizerName = await getOrganizerNameById(event.organizer_id);

        return convertToDisplayEvent({
          id: event.id,
          title: eventDetail.title,
          description: eventDetail.description,
          date: eventDetail.date,
          time: eventDetail.start_time,
          location: eventDetail.location,
          venue: eventDetail.venue,
          coverImage: eventDetail.cover_image,
          category: eventDetail.category,
          registrations: eventDetail.current_registrations,
          capacity: eventDetail.capacity,
          price: eventDetail.price,
          eligibility: eventDetail.eligibility,
          rules: eventDetail.rules,
          schedule: eventDetail.schedule,
          organizer_id: event.organizer_id,
          status: event.status,
          created_at: event.created_at,
          updated_at: event.updated_at,
          interested: 0
        }, organizerName);
      })
    );

    console.log('Converted college display events:', displayEvents);

    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });

    return displayEvents;
  } catch (error) {
    console.error('Error in getEventsFromCollege:', error);
    return [];
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
        id,
        organizer_id,
        status,
        event_details (
          title,
          date,
          start_time,
          venue,
          category,
          registrations,
          capacity
        ),
        organizers (
          id,
          name,
          user_id,
          profiles (
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
      .from('organizers')
      .select('name')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching organizer name:', error);
      return 'Unknown Organizer';
    }

    if (!data) {
      console.log(`No organizer found with ID: ${id}`);
      return 'Unknown Organizer';
    }

    return data.name || 'Unknown Organizer';
  } catch (error) {
    console.error('Error in getOrganizerNameById:', error);
    return 'Unknown Organizer';
  }
}

// Function to get events by category
export async function getEventsByCategory(category: string, count: number = 8): Promise<DisplayEvent[]> {
  try {
    console.log('Starting getEventsByCategory with category:', category);
    const cacheKey = `category_${category.toLowerCase()}_${count}`;
    const cachedData = eventCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached category events:', cachedData.data);
      return cachedData.data;
    }

    // If no category is specified, return random events
    if (!category) {
      console.log('No category specified, returning random events');
      return getRandomEvents(count);
    }

    // Normalize the category to lowercase
    const normalizedCategory = category.toLowerCase();

    // Define related categories
    let categoriesToSearch = [normalizedCategory];
    if (normalizedCategory === 'academic') {
      categoriesToSearch = ['Competition', 'Technology', 'Finance', 'Hackathon'];
    } else if (normalizedCategory === 'entertainment') {
      categoriesToSearch = ['Entertainment', 'Music', 'Cultural', 'Gaming'];
    } else if (normalizedCategory === 'business') {
      categoriesToSearch = ['Business', 'Entrepreneurship', 'Finance'];
    } else if (normalizedCategory === 'Art') {
      categoriesToSearch = ['Art', 'Exhibition', 'Cultural'];
    } else if (normalizedCategory === 'sports') {
      categoriesToSearch = ['Sports', 'Gaming'];
    } else if (normalizedCategory === 'literature') {
      categoriesToSearch = ['Literature', 'Cultural'];
    } else if (normalizedCategory === 'workshops') {
      categoriesToSearch = ['Workshops', 'Workshop'];
    } 
    

    console.log('Searching for categories:', categoriesToSearch);

    // Fetch events with event details in a single query
    console.log('Fetching category events...');
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
          eligibility,
          rules,
          schedule
        )
      `)
      .in('event_details.category', categoriesToSearch)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('Error fetching category events:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No events found for categories:', categoriesToSearch);
      return [];
    }

    console.log('Found category events data:', data);

    // Convert to display format
    console.log('Converting category events to display format...');
    const displayEvents = await Promise.all(
      (data as Event[]).map(async (event) => {
        const eventDetail = event.event_details[0];
        const organizerName = await getOrganizerNameById(event.organizer_id);

        return convertToDisplayEvent({
          id: event.id,
          title: eventDetail.title,
          description: eventDetail.description,
          date: eventDetail.date,
          time: eventDetail.start_time,
          location: eventDetail.location,
          venue: eventDetail.venue,
          coverImage: eventDetail.cover_image,
          category: eventDetail.category,
          registrations: eventDetail.current_registrations,
          capacity: eventDetail.capacity,
          price: eventDetail.price,
          eligibility: eventDetail.eligibility,
          rules: eventDetail.rules,
          schedule: eventDetail.schedule,
          organizer_id: event.organizer_id,
          status: event.status,
          created_at: event.created_at,
          updated_at: event.updated_at,
          interested: 0
        }, organizerName);
      })
    );

    console.log('Converted category display events:', displayEvents);

    // Cache the results
    eventCache.set(cacheKey, {
      data: displayEvents,
      timestamp: Date.now()
    });

    return displayEvents;
  } catch (error) {
    console.error('Error in getEventsByCategory:', error);
    return [];
  }
}
