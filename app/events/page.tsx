import Layout from "../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EventsList() {
  const events = [
    { id: 1, name: "Freshman Orientation", date: "2023-08-25", location: "Main Auditorium" },
    { id: 2, name: "Career Fair", date: "2023-09-15", location: "Student Center" },
    { id: 3, name: "Alumni Networking Night", date: "2023-10-05", location: "Grand Hall" },
    { id: 4, name: "Tech Symposium", date: "2023-11-10", location: "Engineering Building" },
    { id: 5, name: "Winter Concert", date: "2023-12-01", location: "Performing Arts Center" },
  ]

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link href="/create-event">
          <Button className="bg-black text-white hover:bg-black/90">Create New Event</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {event.date} - {event.location}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/events/${event.id}`}>
                    <Button variant="outline" className="border-black text-black hover:bg-secondary">
                      View
                    </Button>
                  </Link>
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="outline" className="border-black text-black hover:bg-secondary">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

