"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Cookie, Shield, Settings, Eye, Trash2, Bell, Mail, Database, Key, BellRing, Globe, FileText, HelpCircle } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Cookie className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
          </div>
          
          <div className="space-y-8 text-gray-600">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">This Cookie Policy explains how PingU uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">2. What Are Cookies</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Definition</h3>
                  <p className="mb-4">Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                  <h3 className="font-medium text-gray-900 mb-2">Types of Cookies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Session cookies (temporary)</li>
                    <li>Persistent cookies (remain until expiry)</li>
                    <li>First-party cookies (set by us)</li>
                    <li>Third-party cookies (set by partners)</li>
                    <li>Essential cookies (required for functionality)</li>
                    <li>Analytics cookies (help us understand usage)</li>
                    <li>Marketing cookies (track preferences)</li>
                    <li>Preference cookies (remember your settings)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">3. How We Use Cookies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Essential Functions</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>User authentication</li>
                    <li>Session management</li>
                    <li>Security features</li>
                    <li>Basic functionality</li>
                    <li>Load balancing</li>
                    <li>Error handling</li>
                    <li>Form submissions</li>
                    <li>Shopping cart</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Enhanced Experience</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personalization</li>
                    <li>Language preferences</li>
                    <li>Theme settings</li>
                    <li>Location services</li>
                    <li>Performance optimization</li>
                    <li>Feature preferences</li>
                    <li>User preferences</li>
                    <li>Accessibility settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">4. Cookie Categories</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Authentication cookies</li>
                    <li>Security cookies</li>
                    <li>Session cookies</li>
                    <li>Load balancing cookies</li>
                    <li>User interface customization</li>
                    <li>Basic functionality</li>
                    <li>Error handling</li>
                    <li>Form submission</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics</li>
                    <li>User behavior tracking</li>
                    <li>Performance metrics</li>
                    <li>Usage statistics</li>
                    <li>Error tracking</li>
                    <li>Feature usage</li>
                    <li>User flow analysis</li>
                    <li>Conversion tracking</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Marketing Cookies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Advertising preferences</li>
                    <li>Campaign tracking</li>
                    <li>Social media integration</li>
                    <li>Retargeting</li>
                    <li>Affiliate tracking</li>
                    <li>Email marketing</li>
                    <li>Promotional content</li>
                    <li>User engagement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">5. Cookie Management</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Browser Settings</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Chrome settings</li>
                    <li>Firefox settings</li>
                    <li>Safari settings</li>
                    <li>Edge settings</li>
                    <li>Cookie blocking</li>
                    <li>Private browsing</li>
                    <li>Cookie deletion</li>
                    <li>Site-specific settings</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Platform Controls</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cookie consent banner</li>
                    <li>Preference center</li>
                    <li>Category management</li>
                    <li>Third-party controls</li>
                    <li>Analytics opt-out</li>
                    <li>Marketing preferences</li>
                    <li>Cookie deletion</li>
                    <li>Settings persistence</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">6. Third-Party Cookies</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Service Providers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analytics services</li>
                    <li>Advertising networks</li>
                    <li>Social media platforms</li>
                    <li>Payment processors</li>
                    <li>Content delivery networks</li>
                    <li>Security services</li>
                    <li>Performance monitoring</li>
                    <li>Customer support tools</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">7. Cookie Duration</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Types of Duration</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Session cookies (temporary)</li>
                    <li>Persistent cookies (fixed term)</li>
                    <li>Permanent cookies (until deleted)</li>
                    <li>First-party cookies</li>
                    <li>Third-party cookies</li>
                    <li>Essential cookies</li>
                    <li>Preference cookies</li>
                    <li>Analytics cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">8. Updates to Policy</h2>
              </div>
              <p className="leading-relaxed">We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">9. Contact Information</h2>
              </div>
              <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:support@pingu.com" className="text-orange-500 hover:text-orange-600 font-medium">support@pingu.com</a></p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="mt-4 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-lg">
                BY USING PINGU, YOU AGREE TO OUR USE OF COOKIES AS DESCRIBED IN THIS POLICY.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 