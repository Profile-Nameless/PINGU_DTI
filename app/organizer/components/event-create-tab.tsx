'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function EventCreateTab() {
  const [eventData, setEventData] = useState({
    title: 'Event Title',
    date: '',
    location: '',
    description: '',
    scale: 100,
    rotate: 0,
    backgroundImage: 0,
    fontStyle: 0
  });

  const backgroundOptions = [
    'linear-gradient(to right, #00c6ff, #0072ff)',
    'linear-gradient(to right, #ff6b6b, #556270)',
    'linear-gradient(to right, #f857a6, #ff5858)',
    'linear-gradient(to right, #4facfe, #00f2fe)',
    'linear-gradient(to right, #43e97b, #38f9d7)',
  ];

  const fontOptions = [
    'font-sans',
    'font-serif',
    'font-mono',
    'font-display',
    'font-heading',
    'font-body'
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={eventData.location}
                  onChange={(e) => setEventData({...eventData, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description"
                  className="w-full min-h-[100px] p-2 border rounded"
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="flex gap-8">
            {/* Preview Card */}
            <Card className="w-[400px] shrink-0">
              <div className="relative aspect-[1.6] flex items-center justify-center overflow-hidden rounded-lg"
                   style={{
                     transform: `scale(${eventData.scale}%) rotate(${eventData.rotate}deg)`,
                     background: backgroundOptions[eventData.backgroundImage],
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                   }}>
                <div className={`text-center ${fontOptions[eventData.fontStyle]} text-white p-6 w-full`}>
                  <h3 className="text-2xl font-bold mb-2">{eventData.title || 'Event Title'}</h3>
                  <p className="mb-1">{eventData.date || 'Date TBD'}</p>
                  <p>{eventData.location || 'Location TBD'}</p>
                </div>
              </div>
            </Card>

            {/* Customization Controls */}
            <div className="flex-1 space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Image placement</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Scale</Label>
                    <Slider
                      defaultValue={[100]}
                      onValueChange={([value]) => setEventData({...eventData, scale: value})}
                      min={50}
                      max={150}
                      step={1}
                      className="my-2"
                    />
                  </div>
                  <div>
                    <Label>Rotate</Label>
                    <Slider
                      defaultValue={[0]}
                      onValueChange={([value]) => setEventData({...eventData, rotate: value})}
                      min={0}
                      max={360}
                      step={1}
                      className="my-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Background</h3>
                <div className="grid grid-cols-5 gap-2">
                  {backgroundOptions.map((bg, index) => (
                    <button
                      key={index}
                      className={`w-16 h-16 rounded-lg border-2 ${
                        eventData.backgroundImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                      style={{ background: bg }}
                      onClick={() => setEventData({...eventData, backgroundImage: index})}
                    />
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Font Settings</h3>
                <div className="grid grid-cols-3 gap-2">
                  {fontOptions.map((font, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        eventData.fontStyle === index ? 'border-primary' : 'border-gray-200'
                      } ${font}`}
                      onClick={() => setEventData({...eventData, fontStyle: index})}
                    >
                      Aa
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
