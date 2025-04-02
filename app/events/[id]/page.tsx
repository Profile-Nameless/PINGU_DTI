import EventDetails from "./EventDetails"
import { Suspense } from "react"

interface EventPageProps {
  params: {
    id: string
  }
  searchParams: {
    source?: string
    mode?: string
  }
}

// Client component wrapper
function EventDetailsWrapper({ id, fromDashboard, mode }: { 
  id: string; 
  fromDashboard: boolean; 
  mode?: string 
}) {
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">Event ID is missing</p>
        </div>
      </div>
    );
  }
  
  return <EventDetails id={id} fromDashboard={fromDashboard} mode={mode} />;
}

export default function EventPage({ params, searchParams }: EventPageProps) {
  // Extract search params safely
  const source = searchParams?.source || '';
  const mode = searchParams?.mode || '';
  const id = params?.id || '';
  
  return (
    <Suspense fallback={<div>Loading event details...</div>}>
      <EventDetailsWrapper 
        id={id} 
        fromDashboard={source === 'dashboard'} 
        mode={mode}
      />
    </Suspense>
  );
}

