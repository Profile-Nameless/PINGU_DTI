'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EventDetails({ params }: { params: { id: string } }) {
  // Mock event data
  const event = {
    id: params.id,
    title: "Tech Conference 2025",
    date: "2025-04-15",
    location: "Main Auditorium",
    description: "Annual technology conference featuring the latest innovations",
    registrations: 150,
    status: "upcoming"
  };

  // Mock analytics data
  const analyticsData = {
    dailyRegistrations: [
      { date: '2025-03-10', count: 20 },
      { date: '2025-03-11', count: 35 },
      { date: '2025-03-12', count: 25 },
      { date: '2025-03-13', count: 40 },
      { date: '2025-03-14', count: 30 },
    ],
    demographics: {
      department: [
        { name: 'Computer Science', value: 40 },
        { name: 'Electronics', value: 30 },
        { name: 'Mechanical', value: 20 },
        { name: 'Others', value: 10 },
      ]
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/organizer">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-500">{event.date} • {event.location}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Registrations</h3>
          <p className="text-2xl font-bold mt-2">{event.registrations}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Checked In</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Waitlist</h3>
          <p className="text-2xl font-bold mt-2">25</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold mt-2">₹15,000</p>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Registration Trend</h2>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Registration trend chart will be displayed here
          </div>
        </Card>

        {/* Demographics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demographics</h2>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Demographics chart will be displayed here
          </div>
        </Card>

        {/* Recent Registrations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Student {i}</p>
                  <p className="text-sm text-gray-500">Computer Science • 3rd Year</p>
                </div>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Event Timeline */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Event Timeline</h2>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', title: 'Registration Opens' },
              { time: '10:00 AM', title: 'Opening Ceremony' },
              { time: '11:00 AM', title: 'Keynote Speech' },
              { time: '12:00 PM', title: 'Lunch Break' },
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <div className="w-24 text-sm text-gray-500">{item.time}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
