import EventDetails from "@/app/events/[id]/EventDetails"

interface EventPreviewPageProps {
  params: {
    id: string
  }
}

export default function EventPreviewPage({ params }: EventPreviewPageProps) {
  return <EventDetails 
    id={params.id} 
    fromDashboard={true} 
    mode="preview"
  />
} 