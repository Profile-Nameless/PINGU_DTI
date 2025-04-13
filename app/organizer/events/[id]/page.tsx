'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit, Trash2, Download, ChevronRight, BarChart2, CheckCircle, AlertCircle, Eye, TrendingUp, PieChart, UserPlus, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getEventById, Event } from '@/app/utils/events';
import { supabase } from '@/app/utils/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function EventDetails() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demographicsView, setDemographicsView] = useState<'mixed' | 'field' | 'year'>('mixed');

  // Mock event data as fallback
  const mockEvent = {
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
      ],
      year: [
        { name: '1st Year', value: 25 },
        { name: '2nd Year', value: 35 },
        { name: '3rd Year', value: 30 },
        { name: '4th Year', value: 10 },
      ],
      mixed: [
        { name: 'Computer Science', value: 40 },
        { name: 'Electronics', value: 30 },
        { name: 'Mechanical', value: 20 },
        { name: '1st Year', value: 25 },
        { name: '2nd Year', value: 35 },
        { name: '3rd Year', value: 30 },
        { name: '4th Year', value: 10 },
      ]
    }
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

  // Fetch event data from backend
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      try {
        const eventData = await getEventById(eventId);
        
        if (eventData) {
          setEvent(eventData);
        } else {
          console.log('No event found, using mock data');
          setEvent(mockEvent as any);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
        setEvent(mockEvent as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Use event data from backend or fallback to mock data
  const displayEvent = event || mockEvent;

  // Get the current demographics data based on the selected view
  const getCurrentDemographicsData = () => {
    switch (demographicsView) {
      case 'field':
        return analyticsData.demographics.department;
      case 'year':
        return analyticsData.demographics.year;
      case 'mixed':
      default:
        return analyticsData.demographics.mixed;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Enhanced Header with better visibility */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-purple-100/20 -z-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-transparent rounded-bl-full -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/organizer">
              <Button 
                variant="outline" 
                className="bg-white/80 hover:bg-blue-50 border-blue-300 text-blue-700 font-medium px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge variant={displayEvent.status === 'active' ? 'default' : 'secondary'} className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-500">
              {displayEvent.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 bg-white/80 hover:bg-green-50 border-green-300 text-green-700 font-medium px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Link href={`/dashboard/events/preview/${eventId}`}>
              <Button 
                variant="outline" 
                className="gap-2 bg-white/80 hover:bg-purple-50 border-purple-300 text-purple-700 font-medium px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <Eye className="w-4 h-4" />
                Preview & Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 font-medium px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mt-6 mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{displayEvent.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{displayEvent.date}</span>
          </div>
          <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{displayEvent.time}</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span>{displayEvent.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{displayEvent.registrations}/{displayEvent.capacity} registrations</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">{displayEvent.description}</p>
      </motion.div>

      {/* Overview Cards with enhanced UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500 overflow-hidden relative group bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-transparent opacity-70 rounded-bl-full -z-10 group-hover:opacity-90 transition-opacity"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{displayEvent.registrations}</h3>
                <div className="mt-2">
                  <Progress value={(displayEvent.registrations / displayEvent.capacity) * 100} className="h-2 bg-blue-100" />
                </div>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-green-500 overflow-hidden relative group bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-transparent opacity-70 rounded-bl-full -z-10 group-hover:opacity-90 transition-opacity"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">0</h3>
                <p className="text-xs text-gray-500 mt-1">0% of registrations</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-yellow-500 overflow-hidden relative group bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-transparent opacity-70 rounded-bl-full -z-10 group-hover:opacity-90 transition-opacity"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waitlist</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">25</h3>
                <p className="text-xs text-gray-500 mt-1">12.5% of capacity</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 group-hover:from-yellow-200 group-hover:to-amber-200 transition-colors">
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
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500 overflow-hidden relative group bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-transparent opacity-70 rounded-bl-full -z-10 group-hover:opacity-90 transition-opacity"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">₹15,000</h3>
                <p className="text-xs text-gray-500 mt-1">₹75 per registration</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Section with enhanced UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Registration Trend</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="h-[300px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-lg p-4 border border-blue-100/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.dailyRegistrations}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="url(#colorGradient)" 
                    strokeWidth={2} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                  <PieChart className="w-5 h-5 text-indigo-500" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Demographics</h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={demographicsView === 'field' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-full ${demographicsView === 'field' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
                  onClick={() => setDemographicsView('field')}
                >
                  Field
                </Button>
                <Button 
                  variant={demographicsView === 'year' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-full ${demographicsView === 'year' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
                  onClick={() => setDemographicsView('year')}
                >
                  Year
                </Button>
                <Button 
                  variant={demographicsView === 'mixed' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-full ${demographicsView === 'mixed' ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
                  onClick={() => setDemographicsView('mixed')}
                >
                  Mixed
                </Button>
              </div>
            </div>
            <div className="h-[300px] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-4 border border-indigo-100/50">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={getCurrentDemographicsData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCurrentDemographicsData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-transparent rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                  <UserPlus className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Recent Registrations</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 px-3 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600 font-medium">
                      {i}
                    </div>
                    <div>
                      <p className="font-medium">Student {i}</p>
                      <p className="text-sm text-gray-500">Computer Science • 3rd Year</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-500">2 hours ago</p>
                    <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">Registered</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Event Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Event Timeline</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full">
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
                <div key={i} className="flex items-start p-3 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 rounded-md transition-colors">
                  <div className="w-24 text-sm font-medium text-gray-700">{item.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <Badge variant="outline" className="mt-1 text-xs bg-purple-50 text-purple-700 border-purple-200">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
