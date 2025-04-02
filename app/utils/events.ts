import { supabase } from './supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  registrations: number;
  capacity: number;
  coverImage: string;
  category: string;
  price: number;
  eligibility: string[] | null;
  rules: string[] | null;
  schedule: any;
  venue: any;
  organizer: string;
  interested: number;
  created_at: string;
  updated_at: string;
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
}

// Function to convert database event to display event
export const convertToDisplayEvent = async (event: Event): Promise<DisplayEvent> => {
  try {
    // Get organizer name
    let organizerName = 'Unknown Organizer';
    
    if (event.organizer) {
      try {
        organizerName = await getOrganizerNameById(event.organizer);
      } catch (error) {
        console.error('Error getting organizer name:', error);
      }
    }
    
    return {
      id: event.id,
      title: event.title,
      date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: event.time,
      location: event.location,
      venue: typeof event.venue === 'object' && event.venue.name ? event.venue.name : 'Venue TBA',
      image: event.coverImage || '/placeholder.svg?height=300&width=400',
      category: event.category,
      organizer: organizerName,
      attendees: event.registrations
    };
  } catch (error) {
    console.error('Error in convertToDisplayEvent:', error);
    // Return a minimal display event with available data
    return {
      id: event.id || 'unknown',
      title: event.title || 'Unknown Event',
      date: 'Date TBA',
      time: event.time || 'Time TBA',
      location: event.location || 'Location TBA',
      venue: 'Venue TBA',
      image: '/placeholder.svg?height=300&width=400',
      category: event.category || 'Uncategorized',
      organizer: 'Unknown Organizer',
      attendees: event.registrations || 0
    };
  }
};

// Function to get random events
export const getRandomEvents = async (count: number): Promise<DisplayEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    // Shuffle the events array
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    
    // Take the first 'count' events
    const selectedEvents = shuffled.slice(0, count);
    
    // Convert to display format
    const displayEvents = await Promise.all(selectedEvents.map(convertToDisplayEvent));
    return displayEvents;
  } catch (error) {
    console.error('Error in getRandomEvents:', error);
    return [];
  }
};

// Function to get popular events based on registration count
export async function getPopularEvents(count: number = 8): Promise<DisplayEvent[]> {
  try {
    // Fetch events with registrations and interested data
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .limit(100); // Fetch a larger pool to calculate popularity

    if (error) throw error;

    // Calculate popularity score for each event
    const eventsWithScore = events.map(event => {
      const registrations = event.registrations || 0;
      const interested = event.interested || 0;
      const capacity = event.capacity || 1; // Avoid division by zero
      
      // Calculate different popularity metrics
      
      // 1. Registration ratio (how many seats are filled)
      const registrationRatio = registrations / capacity;
      
      // 2. Interest ratio (how many people are interested vs capacity)
      const interestRatio = interested / capacity;
      
      // 3. Engagement ratio (total engagement vs capacity)
      const totalEngagement = registrations + interested;
      const engagementRatio = totalEngagement / capacity;
      
      // 4. Conversion rate (how many interested people actually registered)
      const conversionRate = interested > 0 ? registrations / interested : 0;
      
      // Calculate weighted popularity score
      // Weights can be adjusted based on what factors you consider most important
      const popularityScore = 
        (registrationRatio * 0.4) +      // 40% weight on registration ratio
        (interestRatio * 0.3) +          // 30% weight on interest ratio
        (engagementRatio * 0.2) +        // 20% weight on total engagement
        (conversionRate * 0.1);          // 10% weight on conversion rate

      return {
        ...event,
        popularityScore
      };
    });

    // Sort by popularity score and take top 'count' events
    const popularEvents = eventsWithScore
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, count);

    // Convert to display format
    const displayEvents = await Promise.all(popularEvents.map(convertToDisplayEvent));
    return displayEvents;
  } catch (error) {
    console.error('Error fetching popular events:', error);
    return [];
  }
}

// Function to get events from a specific college
export const getEventsFromCollege = async (college: string, count: number): Promise<DisplayEvent[]> => {
  try {
    console.log('Fetching events for college:', college);
    
    if (!college) {
      console.log('No college name provided, returning random events');
      return getRandomEvents(count);
    }
    
    // Find all organizers at the specified college
    const { data: collegeOrganizers, error: organizersError } = await supabase
      .from('profile')
      .select('id')
      .eq('college', college);

    if (organizersError) {
      console.error('Error finding college organizers:', organizersError);
      console.error('Error details:', {
        code: organizersError.code,
        message: organizersError.message,
        details: organizersError.details,
        hint: organizersError.hint
      });
      return getRandomEvents(count);
    }

    if (!collegeOrganizers || collegeOrganizers.length === 0) {
      console.log(`No organizers found for college: ${college}`);
      return getRandomEvents(count);
    }

    // Get all organizer IDs
    const organizerIds = collegeOrganizers.map(org => org.id);
    console.log('Found organizer IDs:', organizerIds);

    // Fetch events from all organizers at the college
    let allEvents: any[] = [];
    
    for (const organizerId of organizerIds) {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer', organizerId);
        
      if (eventsError) {
        console.error(`Error fetching events for organizer ${organizerId}:`, eventsError);
        continue;
      }
      
      if (events && events.length > 0) {
        allEvents = [...allEvents, ...events];
      }
    }

    // If no events found, try to find any events
    if (allEvents.length === 0) {
      console.log(`No events found for college: ${college}, fetching random events instead`);
      return getRandomEvents(count);
    }

    // Shuffle and limit to count
    const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
    const selectedEvents = shuffled.slice(0, count);

    console.log(`Returning ${selectedEvents.length} events from ${allEvents.length} total events at college: ${college}`);

    // Convert to display format
    const displayEvents = await Promise.all(selectedEvents.map(convertToDisplayEvent));
    return displayEvents;
  } catch (error) {
    console.error('Error in getEventsFromCollege:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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
      .select('*')
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

    if (!data) {
      console.log(`No event found with ID: ${id}`);
      return null;
    }

    console.log(`Successfully fetched event: ${data.title}`);
    return data;
  } catch (error) {
    console.error('Error in getEventById:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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
      .from('profile')
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