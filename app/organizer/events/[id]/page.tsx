'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit, Trash2, Download, ChevronRight, BarChart2, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function EventDetails() {
  const params = useParams();
  const eventId = params?.id as string;

  // Mock event data
  const event = {
    id: eventId,
    title: "Tech Conference 2025",
    date: "2025-04-15",
    time: "10:00 AM - 5:00 PM",
    location: "Main Auditorium",
    status: "active",
    registrations: 156,
    capacity: 200,
    description: "Annual technology conference featuring industry leaders and innovative workshops."
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
      {/* Enhanced Header with better visibility */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/organizer">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-medium px-4 py-2 shadow-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge variant={event.status === 'active' ? 'default' : 'secondary'} className="ml-2">
              {event.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 bg-white hover:bg-green-50 border-green-300 text-green-700 font-medium px-4 py-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Link href={`/dashboard/events/preview/${eventId}`}>
              <Button 
                variant="outline" 
                className="gap-2 bg-white hover:bg-purple-50 border-purple-300 text-purple-700 font-medium px-4 py-2 shadow-sm"
              >
                <Eye className="w-4 h-4" />
                Preview & Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 font-medium px-4 py-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900">{event.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{event.registrations}/{event.capacity} registrations</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">{event.description}</p>
      </div>

      {/* Overview Cards with enhanced UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{event.registrations}</h3>
                <div className="mt-2">
                  <Progress value={(event.registrations / event.capacity) * 100} className="h-1.5" />
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-green-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">0</h3>
                <p className="text-xs text-gray-500 mt-1">0% of registrations</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-yellow-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waitlist</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">25</h3>
                <p className="text-xs text-gray-500 mt-1">12.5% of capacity</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border-t-4 border-t-purple-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent opacity-50 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">₹15,000</h3>
                <p className="text-xs text-gray-500 mt-1">₹75 per registration</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart2 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Section with enhanced UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Registration Trend</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            Registration trend chart will be displayed here
          </div>
        </Card>

        {/* Demographics */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Demographics</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            Demographics chart will be displayed here
          </div>
        </Card>

        {/* Recent Registrations */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Registrations</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {i}
                  </div>
                  <div>
                    <p className="font-medium">Student {i}</p>
                    <p className="text-sm text-gray-500">Computer Science • 3rd Year</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500">2 hours ago</p>
                  <Badge variant="outline" className="mt-1">Registered</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Event Timeline */}
        <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Event Timeline</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              Edit Timeline
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', title: 'Registration Opens', status: 'upcoming' },
              { time: '10:00 AM', title: 'Opening Ceremony', status: 'upcoming' },
              { time: '11:00 AM', title: 'Keynote Speech', status: 'upcoming' },
              { time: '12:00 PM', title: 'Lunch Break', status: 'upcoming' },
            ].map((item, i) => (
              <div key={i} className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-24 text-sm font-medium text-gray-700">{item.time}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
