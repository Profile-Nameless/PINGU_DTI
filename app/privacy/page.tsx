"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, Lock, Eye, Trash2, Bell, Mail, Users, Globe, FileText, HelpCircle, Database, Key, BellRing } from "lucide-react"

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          
          <div className="space-y-8 text-gray-600">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">Thank you for your visit to PingU. We hold your trust in very high esteem and strive to protect your private data. By using PingU, you acknowledge being aware of our Privacy Policy and Terms and Conditions and accepting them. In case you do not accept, please do not use our services. This policy outlines how we collect, use, and protect your personal information.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
              </div>
              <p className="mb-4">While you use PingU, we keep the following data with us, just to make your experience better:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Personal Details</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Name and contact information</li>
                    <li>Email address and phone number</li>
                    <li>University and academic year</li>
                    <li>Profile picture and bio</li>
                    <li>Interests and hobbies</li>
                    <li>Demographic information</li>
                    <li>Social media profiles</li>
                    <li>Emergency contacts</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Event Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Event registrations</li>
                    <li>Attendance history</li>
                    <li>Event preferences</li>
                    <li>Feedback and ratings</li>
                    <li>Payment information</li>
                    <li>Ticket details</li>
                    <li>Event communications</li>
                    <li>Participation status</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Usage Data</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Search history</li>
                    <li>Navigation patterns</li>
                    <li>Time spent on features</li>
                    <li>Interaction with content</li>
                    <li>App performance data</li>
                    <li>Feature preferences</li>
                    <li>Error reports</li>
                    <li>Session information</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Device Details</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Operating system</li>
                    <li>Device identifiers</li>
                    <li>Location data</li>
                    <li>Screen resolution</li>
                    <li>Language settings</li>
                    <li>Time zone</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Primary Uses</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Personalize event recommendations</li>
                    <li>Process event registrations</li>
                    <li>Send important updates</li>
                    <li>Improve user experience</li>
                    <li>Provide customer support</li>
                    <li>Verify user identity</li>
                    <li>Process payments</li>
                    <li>Send event reminders</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Secondary Uses</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Analytics and research</li>
                    <li>Marketing communications</li>
                    <li>Security monitoring</li>
                    <li>Service optimization</li>
                    <li>Legal compliance</li>
                    <li>Trend analysis</li>
                    <li>Feature development</li>
                    <li>Performance tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">4. Data Sharing & Security</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Data Sharing Partners</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-medium">Event Organizers:</span> Your event management registration details</li>
                    <li><span className="font-medium">Service Providers:</span> Third-party analytics, payment processing, and cloud hosting solutions</li>
                    <li><span className="font-medium">Legal Authorities:</span> When required by law for fraud prevention or security</li>
                    <li><span className="font-medium">Marketing Partners:</span> With your consent for promotional purposes</li>
                    <li><span className="font-medium">Payment Processors:</span> For secure transaction processing</li>
                    <li><span className="font-medium">Analytics Services:</span> For platform improvement</li>
                    <li><span className="font-medium">Communication Services:</span> For notifications and updates</li>
                    <li><span className="font-medium">Storage Providers:</span> For data backup and recovery</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Security Measures</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Data backup and recovery procedures</li>
                    <li>Employee training on data protection</li>
                    <li>Firewall protection</li>
                    <li>Intrusion detection systems</li>
                    <li>Secure data centers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">5. User Control & Rights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Your Rights</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request data deletion</li>
                    <li>Export your data</li>
                    <li>Object to data processing</li>
                    <li>Restrict data processing</li>
                    <li>Data portability</li>
                    <li>Right to be forgotten</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Privacy Controls</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Manage notification preferences</li>
                    <li>Control marketing communications</li>
                    <li>Adjust privacy settings</li>
                    <li>Manage third-party access</li>
                    <li>Set data retention preferences</li>
                    <li>Profile visibility settings</li>
                    <li>Activity tracking controls</li>
                    <li>Location sharing preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Retention Periods</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account data: Until account deletion</li>
                    <li>Event data: As per legal requirements</li>
                    <li>Transaction records: 7 years</li>
                    <li>Analytics data: 2 years</li>
                    <li>Communication logs: 1 year</li>
                    <li>Security logs: 2 years</li>
                    <li>Backup data: 30 days</li>
                    <li>Inactive accounts: 2 years</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">7. Data Protection</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Protection Measures</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption protocols</li>
                    <li>Access management</li>
                    <li>Regular backups</li>
                    <li>Security monitoring</li>
                    <li>Incident response</li>
                    <li>Data masking</li>
                    <li>Secure transmission</li>
                    <li>Vulnerability scanning</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <BellRing className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">8. Communication Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Notification Settings</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Email notifications</li>
                    <li>Push notifications</li>
                    <li>SMS alerts</li>
                    <li>Event reminders</li>
                    <li>Marketing updates</li>
                    <li>Security alerts</li>
                    <li>Account updates</li>
                    <li>Newsletter subscriptions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">9. International Data Transfers</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Cross-Border Transfers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Data transfer agreements</li>
                    <li>International standards</li>
                    <li>Regional compliance</li>
                    <li>Transfer mechanisms</li>
                    <li>Data localization</li>
                    <li>Cross-border security</li>
                    <li>International regulations</li>
                    <li>Transfer impact assessments</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">10. Legal Compliance</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Regulatory Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>GDPR compliance</li>
                    <li>CCPA requirements</li>
                    <li>Local data laws</li>
                    <li>Industry standards</li>
                    <li>Privacy frameworks</li>
                    <li>Data protection laws</li>
                    <li>Consumer rights</li>
                    <li>Regulatory reporting</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">11. Support & Assistance</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Privacy Support</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Privacy inquiries</li>
                    <li>Data access requests</li>
                    <li>Complaint handling</li>
                    <li>Privacy training</li>
                    <li>Incident reporting</li>
                    <li>Policy updates</li>
                    <li>User guidance</li>
                    <li>Technical support</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to Policy</h2>
              <p className="leading-relaxed">There might be terms and conditions revisions by PingU into this Privacy Policy or such revisions may also change from time to time. Users will be notified regarding material changes made by email or in-app notification. We encourage you to review this policy periodically.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">13. Contact Information</h2>
              </div>
              <p>If you have an issue or want to have any questions answered just click <a href="mailto:support@pingu.com" className="text-orange-500 hover:text-orange-600 font-medium">support@pingu.com</a></p>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="mt-4 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-lg">
                BY USING PINGU, YOU AGREE TO HAVE HEARD AND READ THE PRIVACY POLICY & TERMS OF SERVICE.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 