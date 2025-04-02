interface CalendarEvent {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export const addToGoogleCalendar = (event: CalendarEvent) => {
  // Format dates for Google Calendar URL
  const startDate = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // Create the Google Calendar URL
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: event.title,
    details: event.description || '',
    dates: `${startDate}/${endDate}`,
    location: event.location || '',
  });

  // Open Google Calendar in a new tab
  window.open(`${baseUrl}&${params.toString()}`, '_blank');
};

export const addEventToCalendar = (event: CalendarEvent) => {
  // Check if the browser supports the Web Share API
  if (navigator.share) {
    navigator.share({
      title: event.title,
      text: event.description || '',
      url: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description || '')}&dates=${new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(event.location || '')}`,
    }).catch((error) => {
      console.error('Error sharing:', error);
      addToGoogleCalendar(event);
    });
  } else {
    addToGoogleCalendar(event);
  }
}; 