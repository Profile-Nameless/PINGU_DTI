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
  BarChart as BarChartIcon,
  TrendingUp,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Clock,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data for graphs
const generateMockData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    registrations: Math.floor(Math.random() * 50) + 10,
    attendance: Math.floor(Math.random() * 40) + 5,
    demographics: {
      'Year 1': Math.floor(Math.random() * 20) + 5,
      'Year 2': Math.floor(Math.random() * 15) + 5,
      'Year 3': Math.floor(Math.random() * 10) + 5,
      'Year 4': Math.floor(Math.random() * 8) + 2,
      'External': Math.floor(Math.random() * 5) + 1,
    }
  }));
};

const mockEventTypes = [
  { name: "Workshops", value: 35 },
  { name: "Seminars", value: 25 },
  { name: "Social", value: 20 },
  { name: "Sports", value: 15 },
  { name: "Other", value: 5 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [data, setData] = useState(generateMockData(7));
  const [viewMode, setViewMode] = useState<"attendance" | "demographics">("attendance");
  const { user } = useAuth();

  useEffect(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    setData(generateMockData(days));
  }, [timeRange]);

  const totalRegistrations = data.reduce((sum, day) => sum + day.registrations, 0);
  const totalAttendance = data.reduce((sum, day) => sum + day.attendance, 0);
  const averageAttendanceRate = Math.round((totalAttendance / totalRegistrations) * 100);

  const statCards = [
    {
      title: "Total Registrations",
      value: totalRegistrations,
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Attendance",
      value: `${averageAttendanceRate}%`,
      change: "+5%",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Event Completion",
      value: "92%",
      change: "+3%",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Duration",
      value: "2.5h",
      change: "+8%",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  // Calculate max values for scaling
  const maxRegistrations = Math.max(...data.map(d => d.registrations));
  const maxAttendance = Math.max(...data.map(d => d.attendance));
  const maxValue = Math.max(maxRegistrations, maxAttendance);

  // Calculate demographic totals
  const demographicTotals = data.reduce((acc, day) => {
    Object.entries(day.demographics).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalParticipants = Object.values(demographicTotals).reduce((a, b) => a + b, 0);
  const demographicPercentages = Object.entries(demographicTotals).map(([key, value]) => ({
    name: key,
    value: Math.round((value / totalParticipants) * 100)
  }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-gray-600 mt-1">Track your event performance and metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-white">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = !stat.change.includes("-");
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                      <Icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {isPositive ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration & Attendance Trends */}
        <Card className="p-6">
          <div className="flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {viewMode === "attendance" ? "Registration & Attendance Trends" : "Demographic Distribution"}
              </h2>
              <div className="flex items-center gap-2">
                <Select value={viewMode} onValueChange={(value: "attendance" | "demographics") => setViewMode(value)}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Registration & Attendance</SelectItem>
                    <SelectItem value="demographics">Demographics</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="text-gray-600">
                  <BarChartIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-[350px] flex items-end justify-between px-6">
                {viewMode === "attendance" ? (
                  <>
                    {data.map((day, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end gap-2 px-2"
                        style={{ height: "calc(100% - 20px)" }}
                      >
                        {/* Registration Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.registrations / maxValue) * 100}%` }}
                          className="w-4 bg-blue-500 rounded-t"
                        />
                        {/* Attendance Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.attendance / maxValue) * 100}%` }}
                          className="w-4 bg-green-500 rounded-t"
                        />
                        <div className="mt-2">
                          <span className="text-xs text-gray-600 block transform -rotate-45 origin-left whitespace-nowrap">
                            {day.date.split("/").slice(0, 2).join("/")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {Object.entries(data[data.length - 1].demographics).map(([key, value], index) => (
                      <div
                        key={key}
                        className="flex-1 flex flex-col items-center justify-end gap-2 px-2"
                        style={{ height: "calc(100% - 20px)" }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / 30) * 100}%` }}
                          className={`w-8 rounded-t ${
                            [
                              "bg-blue-500",
                              "bg-green-500",
                              "bg-purple-500",
                              "bg-orange-500",
                              "bg-gray-500"
                            ][index]
                          }`}
                        />
                        <div className="mt-2 text-center">
                          <span className="text-xs text-gray-600 block whitespace-nowrap">
                            {key}
                          </span>
                          <span className="text-xs font-medium text-gray-900 block">
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              {viewMode === "attendance" ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-sm text-gray-600">Registrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-sm text-gray-600">Attendance</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(data[data.length - 1].demographics).map(([key], index) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor: [
                            "#3B82F6",
                            "#10B981",
                            "#8B5CF6",
                            "#F59E0B",
                            "#6B7280"
                          ][index]
                        }}
                      />
                      <span className="text-sm text-gray-600">{key}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Event Type Distribution */}
        <Card className="p-6">
          <div className="flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Event Type Distribution</h2>
              <Button variant="outline" size="sm" className="text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-[300px] h-[300px]">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-90"
                >
                  {mockEventTypes.map((type, index, array) => {
                    const startAngle = array
                      .slice(0, index)
                      .reduce((sum, curr) => sum + curr.value, 0);
                    const endAngle = startAngle + type.value;
                    
                    const x1 = 50 + 45 * Math.cos((startAngle / 100) * Math.PI * 2);
                    const y1 = 50 + 45 * Math.sin((startAngle / 100) * Math.PI * 2);
                    const x2 = 50 + 45 * Math.cos((endAngle / 100) * Math.PI * 2);
                    const y2 = 50 + 45 * Math.sin((endAngle / 100) * Math.PI * 2);
                    
                    const largeArc = type.value > 50 ? 1 : 0;
                    
                    return (
                      <motion.path
                        key={type.name}
                        d={`
                          M 50 50
                          L ${x1} ${y1}
                          A 45 45 0 ${largeArc} 1 ${x2} ${y2}
                          Z
                        `}
                        fill={[
                          "#3B82F6",
                          "#10B981",
                          "#8B5CF6",
                          "#F59E0B",
                          "#6B7280"
                        ][index]}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="transition-all duration-300 hover:opacity-90"
                      />
                    );
                  })}
                  {/* Center circle for better appearance */}
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="white"
                    className="transition-all duration-300"
                  />
                  {/* Add percentage text in the center for the largest category */}
                  <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-gray-900 transform rotate-90"
                  >
                    {Math.max(...mockEventTypes.map(t => t.value))}%
                  </text>
                  <text
                    x="50"
                    y="60"
                    textAnchor="middle"
                    className="text-sm fill-gray-600 transform rotate-90"
                  >
                    {mockEventTypes.find(t => t.value === Math.max(...mockEventTypes.map(t => t.value)))?.name}
                  </text>
                </svg>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {mockEventTypes.map((type, index) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#6B7280"][index],
                    }}
                  />
                  <span className="text-sm text-gray-600">{type.name} ({type.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  index % 2 === 0 ? "bg-blue-50" : "bg-green-50"
                )}>
                  {index % 2 === 0 ? (
                    <Calendar className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Users className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {index % 2 === 0 ? "New Event Created" : "Registration Spike"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {index % 2 === 0 
                      ? "Tech Workshop 2024" 
                      : "25 new registrations in the last hour"}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {index === 0 ? "Just now" : `${index * 2}h ago`}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
} 