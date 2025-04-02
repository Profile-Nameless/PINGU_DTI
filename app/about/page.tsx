"use client"

import { useState, useEffect, useRef } from "react"
import { motion as m } from "framer-motion"
import { domAnimation, LazyMotion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Calendar, Award, Zap, MessageCircle, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const features = [
  {
    title: "Smart Event Discovery",
    description: "AI-powered event recommendations based on your interests and past attendance.",
    icon: Calendar
  },
  {
    title: "Community Building",
    description: "Connect with like-minded students and build lasting relationships.",
    icon: Users
  },
  {
    title: "Recognition System",
    description: "Earn badges and rewards for active participation and organizing events.",
    icon: Award
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications about event changes and updates.",
    icon: Zap
  },
  {
    title: "Interactive Feedback",
    description: "Share your experiences and help improve future events.",
    icon: MessageCircle
  },
  {
    title: "Analytics Dashboard",
    description: "Track event performance and attendee engagement metrics.",
    icon: TrendingUp
  }
]

const teamMembers = [
  {
    name: "Raghav",
    role: "Founder & CEO",
    image: "/team/raghav.jpg"
  },
  {
    name: "Abhinav",
    role: "Head of Design",
    image: "/team/abhinav.jpg"
  },
  {
    name: "Pritam",
    role: "Tech Lead",
    image: "/team/pritam.jpg"
  },
  {
    name: "Ritesh",
    role: "Community Manager",
    image: "/team/ritesh.png"
  }
]

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [missionRef, isMissionInView] = useInView()
  const [featuresRef, isFeaturesInView] = useInView()
  const [teamRef, isTeamInView] = useInView()
  const [ctaRef, isCtaInView] = useInView()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <m.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={mounted ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Transforming College Events
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                PingU is revolutionizing how college events are organized, discovered, and experienced. 
                We're building a community where every event becomes an unforgettable memory.
              </p>
            </m.div>
          </div>
        </section>

        {/* Mission Section */}
        <m.section 
          ref={missionRef}
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To create a vibrant ecosystem where college events flourish, connecting students, 
                organizers, and institutions in meaningful ways that enhance campus life and create 
                lasting memories.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <m.div 
                className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To become the go-to platform for college event management, where every student can discover, 
                  participate in, and create memorable experiences throughout their academic journey.
                </p>
              </m.div>
              <m.div 
                className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Values</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Community-First Approach</li>
                  <li>• Innovation in Event Management</li>
                  <li>• Inclusivity and Accessibility</li>
                  <li>• Quality and Excellence</li>
                </ul>
              </m.div>
            </div>
          </div>
        </m.section>

        {/* Features Grid */}
        <m.section 
          ref={featuresRef}
          className="py-16 bg-white/50"
          initial={{ opacity: 0 }}
          animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-12">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <m.div
                  key={feature.title}
                  className="p-6 rounded-xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg hover:shadow-xl transition-shadow border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </m.div>
              ))}
            </div>
          </div>
        </m.section>

        {/* Team Section */}
        <m.section 
          ref={teamRef}
          className="py-16"
          initial={{ opacity: 0 }}
          animate={isTeamInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <m.div
                  key={member.name}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden group-hover:shadow-xl transition-shadow border-2 border-orange-500/20">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </m.div>
              ))}
            </div>
          </div>
        </m.section>

        {/* Contact CTA */}
        <m.section 
          ref={ctaRef}
          className="py-16 bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600"
          initial={{ opacity: 0, y: 50 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8">Join us in revolutionizing college events</p>
              <Button 
                onClick={() => router.push('/auth')}
                className="bg-white hover:bg-white/90 text-gray-900 font-medium px-8 py-2 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-white/20"
              >
                Get Started
              </Button>
            </div>
          </div>
        </m.section>
      </div>
    </LazyMotion>
  )
}