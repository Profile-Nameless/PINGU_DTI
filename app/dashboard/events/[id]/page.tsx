import EventEditor from "./EventEditor"

interface EventEditorPageProps {
  params: {
    id: string
  }
}

export default function EventEditorPage({ params }: EventEditorPageProps) {
  return <EventEditor id={params.id} />
} 