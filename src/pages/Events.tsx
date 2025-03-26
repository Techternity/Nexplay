import React, { useState, useEffect } from 'react';
import { Calendar, Search, MapPin, Clock, CalendarDays, Users, Ticket, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import Navbar from '@/components/layout/Navbar';
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Events = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<{ [key: string]: string[] }>({});

  const [registerForm, setRegisterForm] = useState({
    name: '', teamName: '', contactNo: '', email: ''
  });

  const [createForm, setCreateForm] = useState({
    title: '', prizeMoney: '', date: '', time: '', location: '', genre: ''
  });

  const GOOGLE_MAPS_API_KEY = 'AIzaSyCyFQ3m8BzUafCUwuXvyaDlBXRmuyA5IsQ';

  const initialEvents = [
    {
      id: "1",
      title: "All-India Tennis Open 2025",
      organizer: "Tennis Federation of India",
      location: "DLTA Complex, New Delhi",
      date: "Nov 1-5, 2025",
      time: "10:00 AM - 6:00 PM",
      description: "Premier tennis tournament featuring top Indian players.",
      attendees: 600,
      image: "https://images.unsplash.com/photo-1554068865-91fbd54a9e71?auto=format&fit=crop&w=2070&q=80",
      tags: ["Tennis", "Tournament", "Professional"],
      price: "₹2,000"
    },
    {
      id: "2",
      title: "Himalayan Cycling Challenge 2025",
      organizer: "Cycling India Association",
      location: "Manali, Himachal Pradesh",
      date: "Nov 15-20, 2025",
      time: "7:00 AM - 5:00 PM",
      description: "Extreme mountain cycling race through the Himalayas.",
      attendees: 250,
      image: "https://images.unsplash.com/photo-1569949382669-8e28431c7194?auto=format&fit=crop&w=2070&q=80",
      tags: ["Cycling", "Endurance", "Adventure"],
      price: "₹3,500"
    },
    {
      id: "3",
      title: "Kolkata Swimming Nationals 2025",
      organizer: "Swimming Federation of India",
      location: "Salt Lake Stadium Pool",
      date: "Dec 5-8, 2025",
      time: "9:00 AM - 4:00 PM",
      description: "National swimming championship with multiple categories.",
      attendees: 400,
      image: "https://images.unsplash.com/photo-1530549384393-b9359f6c4e9e?auto=format&fit=crop&w=2070&q=80",
      tags: ["Swimming", "Championship", "Aquatics"],
      price: "₹1,800"
    }
  ];

  const pastEvents = [
    {
      id: "p1",
      title: "Mumbai Volleyball League",
      date: "Sep 20, 2024",
      location: "Andheri Sports Complex",
      performance: { team: "Beach Blasters", points: 25, opponentPoints: 22, result: "Win" },
      image: "https://images.unsplash.com/photo-1612872087720-48736c15d73b?auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const sampleChecklists = {
    "1": ["Tennis racket", "Sports shoes", "Water bottle", "Arrive 1 hour early"],
    "2": ["Cycling gear", "Helmet", "Energy bars", "Check weather forecast"],
    "3": ["Swimsuit", "Goggles", "Towel", "Warm-up routine"]
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUpcomingEvents([...initialEvents, ...eventsList]);

        if (user) {
          const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));
          const registrationsSnapshot = await getDocs(q);
          const userRegisteredEvents = new Set(registrationsSnapshot.docs.map(doc => doc.data().eventId));
          setRegisteredEvents(userRegisteredEvents);
        }

        setChecklists(sampleChecklists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const filteredEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsRegisterModalOpen(true);
  };

  const handleShowMap = async (location: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setSelectedLocation({ name: location, lat, lng });
        setIsMapModalOpen(true);
      } else {
        console.error(`Geocoding failed: ${data.status}. Error: ${data.error_message || 'Unknown'}`);
        alert(`Unable to load map for ${location}. Error: ${data.error_message || data.status}`);
      }
    } catch (error) {
      console.error("Error fetching map location:", error);
      alert("Failed to load map. Please try again later.");
    }
  };

  const handleShowChecklist = (event: any) => {
    setSelectedEvent(event);
    setIsChecklistModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      await addDoc(collection(db, 'registrations'), {
        eventId: selectedEventId,
        uid: user.uid,
        ...registerForm,
        timestamp: new Date().toISOString()
      });

      setIsRegisterModalOpen(false);
      setIsSuccessOpen(true);
      setRegisteredEvents(prev => new Set(prev).add(selectedEventId!));
      setRegisterForm({ name: '', teamName: '', contactNo: '', email: '' });
      console.log(`Email alert: Registered for event ${selectedEventId} to ${registerForm.email}`);
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const newEvent = {
      ...createForm,
      id: Date.now().toString(),
      attendees: 0,
      image: "https://images.unsplash.com/photo-1552673597-e3e7e9e14423?auto=format&fit=crop&w=2070&q=80",
      tags: [createForm.genre, "New"],
      price: "₹" + (Math.floor(Math.random() * 3000) + 1000).toString(),
      organizer: "Community Event",
      createdBy: user.uid
    };

    try {
      await addDoc(collection(db, 'events'), newEvent);
      setUpcomingEvents(prev => [...prev, newEvent]);
      setIsCreateModalOpen(false);
      setCreateForm({ title: '', prizeMoney: '', date: '', time: '', location: '', genre: '' });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7 text-blue-600" />
            <span>Sports Events</span>
          </h1>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Event
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10 border-gray-300 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="upcoming" className="mb-6">
          <TabsList className="bg-white border-b">
            <TabsTrigger value="upcoming" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-800">{event.title}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">{event.price}</Badge>
                    </div>
                    <div className="text-md font-medium text-gray-600">{event.organizer}</div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col space-y-2 text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h Marie-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                        onClick={() => handleShowMap(event.location)}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-gray-700">{event.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      {event.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {registeredEvents.has(event.id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowChecklist(event)}
                        >
                          <List className="h-4 w-4 mr-2" />
                          Prepare
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleRegister(event.id)}
                          disabled={!user}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          Register
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <Card key={event.id} className="shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{event.title}</CardTitle>
                    <div className="text-gray-600">{event.date}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-600">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                        onClick={() => handleShowMap(event.location)}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <p>Team: {event.performance.team}</p>
                      <p>Score: {event.performance.points} - {event.performance.opponentPoints}</p>
                      <p>
                        Result: <span className={event.performance.result === "Win" ? "text-green-600" : "text-red" +
                        "600"}>
                          {event.performance.result}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Registration Modal */}
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Event Registration</DialogTitle>
              <DialogDescription>Register for the selected sports event.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <Input
                  value={registerForm.teamName}
                  onChange={(e) => setRegisterForm({ ...registerForm, teamName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <Input
                  value={registerForm.contactNo}
                  onChange={(e) => setRegisterForm({ ...registerForm, contactNo: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit Registration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registration Successful</DialogTitle>
              <DialogDescription>Your registration has been completed successfully.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
              <p className="text-green-600">You have successfully registered for the event!</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSuccessOpen(false)} className="bg-blue-600 hover:bg-blue-700">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Event Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Create a new sports event to be added to upcoming events.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prize Money</label>
                <Input
                  value={createForm.prizeMoney}
                  onChange={(e) => setCreateForm({ ...createForm, prizeMoney: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <Input
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <Input
                  value={createForm.time}
                  onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Input
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <Input
                  value={createForm.genre}
                  onChange={(e) => setCreateForm({ ...createForm, genre: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Map Modal */}
        <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Event Location: {selectedLocation?.name}</DialogTitle>
              <DialogDescription>View the location of the event on the map below.</DialogDescription>
            </DialogHeader>
            <div className="h-[400px] w-full">
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                {selectedLocation && (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    zoom={15}
                  >
                    <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                  </GoogleMap>
                )}
              </LoadScript>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsMapModalOpen(false)} className="bg-blue-600 hover:bg-blue-700">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Checklist Modal */}
        <Dialog open={isChecklistModalOpen} onOpenChange={setIsChecklistModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preparation Checklist for {selectedEvent?.title}</DialogTitle>
              <DialogDescription>Items and tips to prepare for the event.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ul className="list-disc pl-5 space-y-2">
                {checklists[selectedEvent?.id]?.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsChecklistModalOpen(false)} className="bg-blue-600 hover:bg-blue-700">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Events;