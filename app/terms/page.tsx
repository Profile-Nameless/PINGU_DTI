"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Scale, User, Calendar, Shield, CreditCard, Copyright, AlertTriangle, Bell, Mail, Users, FileText, Globe, Lock, HelpCircle } from "lucide-react"

export default function TermsOfService() {
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
            <Scale className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          
          <div className="space-y-8 text-gray-600">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">By accessing and using PingU, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform. These terms apply to all users, including event organizers, attendees, and visitors.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">2. User Accounts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Account Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Be at least 18 years old</li>
                    <li>Provide accurate information</li>
                    <li>Maintain account security</li>
                    <li>Accept responsibility for activities</li>
                    <li>Keep contact information updated</li>
                    <li>Use valid university email</li>
                    <li>Complete profile verification</li>
                    <li>Maintain active status</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use strong passwords</li>
                    <li>Enable two-factor authentication</li>
                    <li>Report security concerns</li>
                    <li>Regular security checks</li>
                    <li>Secure login practices</li>
                    <li>Monitor account activity</li>
                    <li>Protect personal information</li>
                    <li>Logout from shared devices</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">3. Event Creation and Management</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Organizer Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate event details</li>
                    <li>Comply with local laws</li>
                    <li>Maintain safety standards</li>
                    <li>Handle attendee data properly</li>
                    <li>Communicate changes promptly</li>
                    <li>Manage capacity limits</li>
                    <li>Handle emergencies appropriately</li>
                    <li>Provide accessibility accommodations</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Event Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Clear event descriptions</li>
                    <li>Accurate pricing information</li>
                    <li>Proper categorization</li>
                    <li>Appropriate content</li>
                    <li>Timely updates</li>
                    <li>Age restrictions</li>
                    <li>Dress code requirements</li>
                    <li>Special instructions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">4. Community Guidelines</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Behavior Standards</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respectful communication</li>
                    <li>Inclusive environment</li>
                    <li>No discrimination</li>
                    <li>Professional conduct</li>
                    <li>Cultural sensitivity</li>
                    <li>Constructive feedback</li>
                    <li>Supportive community</li>
                    <li>Positive engagement</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Content Standards</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Original content</li>
                    <li>Appropriate language</li>
                    <li>No harmful content</li>
                    <li>Respectful imagery</li>
                    <li>Factual information</li>
                    <li>Proper attribution</li>
                    <li>No spam</li>
                    <li>Quality standards</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">5. User Conduct</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Prohibited Activities</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>False or misleading information</li>
                    <li>Spam or fraudulent activities</li>
                    <li>Offensive or inappropriate content</li>
                    <li>Unauthorized access attempts</li>
                    <li>Harassment or abuse</li>
                    <li>Data manipulation</li>
                    <li>Impersonation</li>
                    <li>Illegal activities</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Account Consequences</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Warning notifications</li>
                    <li>Temporary suspension</li>
                    <li>Permanent account termination</li>
                    <li>Legal action if necessary</li>
                    <li>Appeal process</li>
                    <li>Content removal</li>
                    <li>Access restrictions</li>
                    <li>Reporting system</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">6. Payment & Refund Policy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Terms</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Secure payment processing</li>
                    <li>Multiple payment methods</li>
                    <li>Clear pricing display</li>
                    <li>Transaction records</li>
                    <li>Payment verification</li>
                    <li>Currency handling</li>
                    <li>Tax compliance</li>
                    <li>Payment disputes</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Refund Conditions</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Event cancellation refunds</li>
                    <li>Attendee cancellation policy</li>
                    <li>Processing timeframes</li>
                    <li>Refund eligibility</li>
                    <li>Payment method restrictions</li>
                    <li>Partial refunds</li>
                    <li>Refund disputes</li>
                    <li>Service fees</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Copyright className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">7. Intellectual Property</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Platform Content</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>PingU's proprietary content</li>
                    <li>User-generated content rights</li>
                    <li>Copyright protection</li>
                    <li>Trademark usage</li>
                    <li>Content licensing</li>
                    <li>Brand guidelines</li>
                    <li>Logo usage</li>
                    <li>Content restrictions</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">User Content</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Content ownership</li>
                    <li>Usage rights</li>
                    <li>Content removal</li>
                    <li>Attribution requirements</li>
                    <li>Modification rights</li>
                    <li>Content licensing</li>
                    <li>Copyright notices</li>
                    <li>Fair use guidelines</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">8. International Usage</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Global Compliance</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Local regulations</li>
                    <li>Cross-border events</li>
                    <li>Currency conversion</li>
                    <li>Language requirements</li>
                    <li>Time zone handling</li>
                    <li>Regional restrictions</li>
                    <li>International laws</li>
                    <li>Cultural considerations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Platform Liability</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Service availability</li>
                    <li>Data accuracy</li>
                    <li>Third-party actions</li>
                    <li>Technical issues</li>
                    <li>Force majeure events</li>
                    <li>Data breaches</li>
                    <li>Service interruptions</li>
                    <li>System failures</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">User Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal data protection</li>
                    <li>Account security</li>
                    <li>Content verification</li>
                    <li>Event participation</li>
                    <li>Third-party interactions</li>
                    <li>Risk assessment</li>
                    <li>Insurance requirements</li>
                    <li>Emergency preparedness</li>
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
                    <li>Data protection laws</li>
                    <li>Consumer rights</li>
                    <li>Event regulations</li>
                    <li>Tax compliance</li>
                    <li>Health and safety</li>
                    <li>Accessibility standards</li>
                    <li>Environmental laws</li>
                    <li>Labor regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">11. Changes to Terms</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Modification Process</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Notification of changes</li>
                    <li>Review period</li>
                    <li>Acceptance requirements</li>
                    <li>Effective date</li>
                    <li>Continued usage implications</li>
                    <li>User feedback</li>
                    <li>Transition period</li>
                    <li>Legacy terms</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">12. Support & Resolution</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Support Services</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Technical support</li>
                    <li>Account assistance</li>
                    <li>Event guidance</li>
                    <li>Payment support</li>
                    <li>Content moderation</li>
                    <li>Dispute resolution</li>
                    <li>Emergency contacts</li>
                    <li>Feedback channels</li>
                  </ul>
                </div>
              </div>
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