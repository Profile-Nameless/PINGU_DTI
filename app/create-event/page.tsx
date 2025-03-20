"use client"

import type React from "react"

import { useState } from "react"
import Layout from "../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Submitting event data:", eventData)
    // Reset form or redirect
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" name="name" value={eventData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={eventData.date} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={eventData.location} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <Button type="submit">Create Event</Button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  )
}

