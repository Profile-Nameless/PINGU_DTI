"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"
import { addEventToCalendar } from "@/app/utils/calendar"

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEventToCalendar(event)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event to Calendar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={event.startDate}
                onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={event.endDate}
                onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 