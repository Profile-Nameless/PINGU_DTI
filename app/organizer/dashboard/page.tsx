"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/app/utils/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  upcomingEvents: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch events created by the organizer
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Get total registrations
      const { data: registrations, error: registrationsError } = await supabase
        .from('registrations')
        .select('event_id')
        .in('event_id', events?.map(event => event.id) || []);

      if (registrationsError) throw registrationsError;

      // Calculate stats
      const now = new Date();
      const activeEvents = events?.filter(event => new Date(event.date) >= now) || [];
      
      setStats({
        totalEvents: events?.length || 0,
        activeEvents: activeEvents.length,
        totalRegistrations: registrations?.length || 0,
        upcomingEvents: activeEvents.slice(0, 5).length,
      });

      // Set recent events
      setRecentEvents(events?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
          <Link 
            href="/organizer/dashboard/events" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                </div>
              </div>
              <Link
                href={`/organizer/dashboard/events/${event.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View details
              </Link>
            </motion.div>
          ))}

          {recentEvents.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-600">
              No events found. Start by creating your first event!
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 