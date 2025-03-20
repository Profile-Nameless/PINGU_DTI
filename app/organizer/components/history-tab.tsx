'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function HistoryTab() {
  const historyEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "2024-12-15",
      registrations: 320,
      status: "completed"
    },
    {
      id: 2,
      title: "Winter Fest",
      date: "2024-11-30",
      registrations: 450,
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Event History</h1>
        <div className="w-64">
          <Label htmlFor="search" className="sr-only">Search events</Label>
          <Input 
            id="search"
            placeholder="Search events..."
            type="search"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {historyEvents.map((event) => (
          <Link href={`/organizer/events/${event.id}`} key={event.id}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-500 mb-2">{event.date}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Registrations</p>
                      <p className="text-lg font-semibold">{event.registrations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {/* Add an arrow or icon here */}
                  →
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
