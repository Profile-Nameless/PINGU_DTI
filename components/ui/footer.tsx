"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">PingU</h3>
            <p className="text-blue-100 text-sm">
              Your one-stop platform for discovering and managing college events. Connect, engage, and never miss out on campus activities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Organizer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@pingu.com" className="text-blue-100 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-blue-100">
              <p>Email: contact@pingu.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-100">
              © {new Date().getFullYear()} PingU. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-blue-100 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-blue-100 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-blue-100 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 