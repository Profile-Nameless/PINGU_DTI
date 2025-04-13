"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { supabase } from "@/app/utils/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

interface AnalyticsData {
  totalRegistrations: number;
  registrationGrowth: number;
  averageAttendance: number;
  popularEvents: { title: string; registrations: number }[];
  monthlyStats: {
    month: string;
    registrations: number;
    events: number;
  }[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRegistrations: 0,
    registrationGrowth: 0,
    averageAttendance: 0,
    popularEvents: [],
    monthlyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch events and their registrations
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          registrations (
            id,
            created_at
          )
        `)
        .eq('organizer_id', user?.id);

      if (eventsError) throw eventsError;

      // Calculate analytics data
      const now = new Date();
      const timeRangeDate = new Date();
      switch (timeRange) {
        case "7d":
          timeRangeDate.setDate(timeRangeDate.getDate() - 7);
          break;
        case "30d":
          timeRangeDate.setDate(timeRangeDate.getDate() - 30);
          break;
        case "90d":
          timeRangeDate.setDate(timeRangeDate.getDate() - 90);
          break;
      }

      const filteredEvents = events?.filter(event => 
        new Date(event.date) >= timeRangeDate
      ) || [];

      const totalRegistrations = filteredEvents.reduce(
        (sum, event) => sum + (event.registrations?.length || 0),
        0
      );

      // Calculate popular events
      const popularEvents = filteredEvents
        .map(event => ({
          title: event.title,
          registrations: event.registrations?.length || 0,
        }))
        .sort((a, b) => b.registrations - a.registrations)
        .slice(0, 5);

      // Calculate monthly stats
      const monthlyStats = Array.from({ length: 3 }, (_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEvents = filteredEvents.filter(
          event => new Date(event.date).getMonth() === month.getMonth()
        );
        return {
          month: month.toLocaleString('default', { month: 'short' }),
          events: monthEvents.length,
          registrations: monthEvents.reduce(
            (sum, event) => sum + (event.registrations?.length || 0),
            0
          ),
        };
      }).reverse();

      setAnalyticsData({
        totalRegistrations,
        registrationGrowth: 15, // Example growth rate
        averageAttendance: totalRegistrations / (filteredEvents.length || 1),
        popularEvents,
        monthlyStats,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Registrations",
      value: analyticsData.totalRegistrations,
      change: analyticsData.registrationGrowth,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Attendance",
      value: Math.round(analyticsData.averageAttendance),
      change: 5,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your event performance and growth</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{Math.abs(stat.change)}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Popular Events */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Popular Events</h2>
        <div className="space-y-4">
          {analyticsData.popularEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <span className="font-medium text-gray-900">{event.title}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {event.registrations} registrations
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Monthly Stats */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance</h2>
        <div className="space-y-4">
          {analyticsData.monthlyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
            >
              <span className="font-medium text-gray-900">{stat.month}</span>
              <div className="flex items-center gap-8">
                <div className="text-sm">
                  <span className="text-gray-600">Events: </span>
                  <span className="font-medium text-gray-900">{stat.events}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Registrations: </span>
                  <span className="font-medium text-gray-900">{stat.registrations}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  );
} 