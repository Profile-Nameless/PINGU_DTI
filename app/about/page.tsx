"use client"

import { motion } from "framer-motion"
import { Users, Calendar, Award, Zap, MessageCircle, TrendingUp } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Calendar,
    title: "Event Management",
    description: "Create and manage college events with ease. From workshops to festivals, we've got you covered."
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Connect with fellow students and build lasting relationships through shared experiences."
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "All events are vetted to ensure high-quality experiences for all participants."
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications about event changes, reminders, and important announcements."
  },
  {
    icon: MessageCircle,
    title: "Interactive Platform",
    description: "Engage with event organizers and attendees through our interactive platform."
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Track event performance and gather valuable insights to improve future events."
  }
]

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg"
  },
  {
    name: "Michael Chen",
    role: "Technical Lead",
    image: "/placeholder.svg"
  },
  {
    name: "Emily Rodriguez",
    role: "Event Director",
    image: "/placeholder.svg"
  },
  {
    name: "David Kim",
    role: "Community Manager",
    image: "/placeholder.svg"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming College Events
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              PingU is revolutionizing how college events are organized, discovered, and experienced. 
              We're building a community where every event becomes an unforgettable memory.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]" />
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              To create a vibrant ecosystem where college events flourish, connecting students, 
              organizers, and institutions in meaningful ways that enhance campus life and create 
              lasting memories.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">Join us in revolutionizing college events</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 