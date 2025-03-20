'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DashboardTab() {
  const mockEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "2025-04-15",
      registrations: 150,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Cultural Fest",
      date: "2025-03-30",
      registrations: 200,
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold">12</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Events</h3>
          <p className="text-3xl font-bold">3</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold">450</p>
        </Card>
      </div>

      {/* Recent Events */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recent Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEvents.map((event) => (
            <Link href={`/organizer/events/${event.id}`} key={event.id}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-500">{event.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Registrations</p>
                    <p className="text-xl font-semibold">{event.registrations}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
