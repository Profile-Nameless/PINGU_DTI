import Layout from "../../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EventDetail({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the event details based on the ID
  const event = {
    id: params.id,
    name: "Freshman Orientation",
    date: "2023-08-25",
    location: "Main Auditorium",
    description:
      "Welcome event for all incoming freshmen. Learn about campus resources, meet fellow students, and get ready for an exciting academic year!",
    attendees: 150,
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Link href={`/events/${event.id}/edit`}>
          <Button>Edit Event</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Date</h3>
              <p>{event.date}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{event.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Attendees</h3>
              <p>{event.attendees}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

