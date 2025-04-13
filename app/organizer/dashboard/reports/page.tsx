"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  Users,
  Clock,
  Filter,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const reportTypes: ReportType[] = [
  {
    id: "event-summary",
    title: "Event Summary",
    description: "Comprehensive overview of all your events",
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "registration-analytics",
    title: "Registration Analytics",
    description: "Detailed analysis of event registrations",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: "attendance-report",
    title: "Attendance Report",
    description: "Track attendance rates and patterns",
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>("event-summary");
  const [timeRange, setTimeRange] = useState("30d");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generateReport = async (reportType: string) => {
    try {
      setIsGenerating(true);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Call an API endpoint to generate the report
      // 2. Get a download URL or blob
      // 3. Trigger the download
      
      toast.success("Report generated successfully!");
      
      // Simulate download
      const link = document.createElement("a");
      link.href = "#";
      link.download = `${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download event reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedReport(report.id)}
            >
              <Card className={`p-6 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${report.bgColor}`}>
                    <Icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => generateReport(report.id)}
                  disabled={isGenerating}
                >
                  {isGenerating && selectedReport === report.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Generate Report
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {reportTypes[index % reportTypes.length].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
} 