"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  Shield,
  Globe,
  Palette,
  User,
  CreditCard,
  Save,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: "profile",
    title: "Profile Settings",
    description: "Manage your organizer profile information",
    icon: User,
    color: "text-blue-500",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure your notification preferences",
    icon: Bell,
    color: "text-purple-500",
  },
  {
    id: "security",
    title: "Security",
    description: "Manage your account security settings",
    icon: Shield,
    color: "text-green-500",
  },
  {
    id: "payment",
    title: "Payment Settings",
    description: "Configure your payment and billing preferences",
    icon: CreditCard,
    color: "text-orange-500",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    // Profile Settings
    organizerName: "",
    organizerBio: "",
    contactEmail: user?.email || "",
    language: "en",
    timezone: "UTC",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    marketingEmails: false,

    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",

    // Payment Settings
    defaultCurrency: "USD",
    autoPayouts: true,
    payoutThreshold: "100",
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizerName">Organizer Name</Label>
              <Input
                id="organizerName"
                value={settings.organizerName}
                onChange={(e) => handleSettingChange("organizerName", e.target.value)}
                placeholder="Enter your organizer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizerBio">Bio</Label>
              <textarea
                id="organizerBio"
                className="w-full min-h-[100px] p-2 rounded-md border border-gray-200"
                value={settings.organizerBio}
                onChange={(e) => handleSettingChange("organizerBio", e.target.value)}
                placeholder="Tell us about yourself or your organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange("language", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email updates about your events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Reminders</Label>
                <p className="text-sm text-gray-500">Get reminded about upcoming events</p>
              </div>
              <Switch
                checked={settings.eventReminders}
                onCheckedChange={(checked) => handleSettingChange("eventReminders", checked)}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeout duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => handleSettingChange("defaultCurrency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Payouts</Label>
                <p className="text-sm text-gray-500">Automatically process payouts when threshold is reached</p>
              </div>
              <Switch
                checked={settings.autoPayouts}
                onCheckedChange={(checked) => handleSettingChange("autoPayouts", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutThreshold">Payout Threshold ($)</Label>
              <Input
                id="payoutThreshold"
                type="number"
                value={settings.payoutThreshold}
                onChange={(e) => handleSettingChange("payoutThreshold", e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your organizer account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="p-4 md:col-span-1">
          <nav className="space-y-2">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : section.color}`} />
                  <span>{section.title}</span>
                </motion.button>
              );
            })}
          </nav>
        </Card>

        {/* Settings Content */}
        <Card className="p-6 md:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {renderSettingsContent()}
              
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
} 