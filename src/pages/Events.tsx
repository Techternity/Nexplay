
import React, { useState } from 'react';
import { Calendar, Search, Filter, MapPin, Clock, CalendarDays, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';

// Event interface
interface Event {
  id: string;
  title: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  description: string;
  attendees: number;
  image: string;
  tags: string[];
  price: string;
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "National Sports Analytics Conference 2023",
    organizer: "Sports Data Association of India",
    location: "Hyderabad International Convention Centre",
    date: "Oct 15-16, 2023",
    time: "9:00 AM - 5:00 PM",
    description: "A two-day conference featuring expert speakers on sports analytics, performance metrics, and data-driven coaching strategies.",
    attendees: 450,
    image: "https://plus.unsplash.com/premium_photo-1683140552439-c0ffcd70c25e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["Conference", "Analytics", "Networking"],
    price: "₹4,500"
  },
  {
    id: "2",
    title: "Youth Athlete Development Workshop",
    organizer: "Sports Authority of India",
    location: "Jawaharlal Nehru Stadium, New Delhi",
    date: "Nov 5, 2023",
    time: "10:00 AM - 3:00 PM",
    description: "An interactive workshop for coaches and parents on identifying and nurturing young sporting talent across various disciplines.",
    attendees: 200,
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2029&q=80",
    tags: ["Workshop", "Youth Development", "Coaching"],
    price: "₹1,200"
  },
  {
    id: "3",
    title: "Sports Medicine & Rehabilitation Symposium",
    organizer: "Indian Association of Sports Medicine",
    location: "Apollo Hospitals, Chennai",
    date: "Dec 10-11, 2023",
    time: "8:30 AM - 4:30 PM",
    description: "Learn about the latest advancements in sports injury management, rehabilitation protocols, and return-to-play strategies.",
    attendees: 300,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80",
    tags: ["Medical", "Rehabilitation", "Symposium"],
    price: "₹5,000"
  },
  {
    id: "4",
    title: "Cricket Performance Analysis Masterclass",
    organizer: "National Cricket Academy",
    location: "M. Chinnaswamy Stadium, Bangalore",
    date: "Nov 18, 2023",
    time: "9:30 AM - 4:00 PM",
    description: "An in-depth masterclass on cricket performance analysis, featuring expert analysts from international cricket teams.",
    attendees: 150,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2067&q=80",
    tags: ["Cricket", "Analysis", "Masterclass"],
    price: "₹3,500"
  }
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7" />
            <span>Sports Events</span>
          </h1>
          <Button variant="outline">
            + Create Event
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search events by title, organizer, location, or type" 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="upcoming" className="mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge>{event.price}</Badge>
                      </div>
                      <div className="text-md font-medium">{event.organizer}</div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col space-y-2 text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      <p className="line-clamp-2 mt-2">{event.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <Button size="sm">
                        <Ticket className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No events found matching your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attending">
            <div className="text-center py-10">
              <p>You're not attending any upcoming events.</p>
              <Button variant="outline" className="mt-4">Browse Events</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="text-center py-10">
              <p>You haven't attended any events yet.</p>
              <Button variant="outline" className="mt-4">Browse Events</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
