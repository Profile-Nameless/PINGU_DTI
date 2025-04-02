"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Lock, Calendar, User } from "lucide-react"
import Image from "next/image"

export default function PaymentPage() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mock event data - in a real app, this would come from an API call using eventId
  const event = {
    id: eventId,
    title: "Tech Innovation Summit 2024",
    price: 49.99,
    date: "March 15, 2024",
    ticketType: "Regular"
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with a real payment gateway
    // For now, we'll just redirect to success page
    router.push(`/events/${eventId}/success`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Payment Form */}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Card Holder Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Card Holder Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="w-full text-gray-900"
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card Number
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full text-gray-900"
                      maxLength={19}
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expiry Date
                      </label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        required
                        className="w-full text-gray-900"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        CVV
                      </label>
                      <Input
                        type="text"
                        placeholder="123"
                        required
                        className="w-full text-gray-900"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
                  >
                    Pay ${event.price}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </p>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-8 border-l">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-base text-gray-700 mt-1">{event.date}</p>
                      <p className="text-base text-gray-700">{event.ticketType} Ticket</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">${event.price}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">${event.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Secure Payment</h4>
                  <div className="flex gap-2">
                    <Image src="/visa.svg" alt="Visa" width={40} height={25} />
                    <Image src="/mastercard.svg" alt="Mastercard" width={40} height={25} />
                    <Image src="/amex.svg" alt="American Express" width={40} height={25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 