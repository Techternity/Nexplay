
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProfileCard from '@/components/profile/ProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Users, CheckCircle, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock athletes data
const athletes = [
  {
    id: 1,
    name: "P.V. Sindhu",
    title: "Professional Badminton Player",
    location: "Hyderabad, India",
    sport: "Badminton",
    experience: "12+ years experience",
    stats: {
      connections: 3240,
      endorsements: 312,
      events: 65
    },
    isConnected: false
  },
  {
    id: 2,
    name: "Neeraj Chopra",
    title: "Olympic Gold Medalist - Javelin Throw",
    location: "Panipat, India",
    sport: "Athletics",
    experience: "8+ years experience",
    stats: {
      connections: 2150,
      endorsements: 280,
      events: 42
    },
    isConnected: true
  },
  {
    id: 3,
    name: "Mary Kom",
    title: "Professional Boxer",
    location: "Manipur, India",
    sport: "Boxing",
    experience: "20+ years experience",
    stats: {
      connections: 4670,
      endorsements: 522,
      events: 89
    },
    isConnected: false
  },
  {
    id: 4,
    name: "Sunil Chhetri",
    title: "Football Team Captain",
    location: "Bangalore, India",
    sport: "Football",
    experience: "15+ years experience",
    stats: {
      connections: 3890,
      endorsements: 456,
      events: 76
    },
    isConnected: false
  }
];

// Mock coaches data
const coaches = [
  {
    id: 5,
    name: "Pullela Gopichand",
    title: "Chief National Coach - Badminton",
    location: "Hyderabad, India",
    sport: "Badminton",
    experience: "25+ years experience",
    stats: {
      connections: 5280,
      endorsements: 623,
      events: 112
    },
    isConnected: true
  },
  {
    id: 6,
    name: "Jaspal Rana",
    title: "Shooting Coach",
    location: "Delhi, India",
    sport: "Shooting",
    experience: "18+ years experience",
    stats: {
      connections: 2980,
      endorsements: 346,
      events: 58
    },
    isConnected: false
  }
];

// Mock connection requests
const connectionRequests = [
  {
    id: 7,
    name: "Sania Mirza",
    title: "Professional Tennis Player",
    location: "Hyderabad, India",
    sport: "Tennis",
    experience: "20+ years experience",
    stats: {
      connections: 4120,
      endorsements: 492,
      events: 87
    }
  },
  {
    id: 8,
    name: "Bajrang Punia",
    title: "Olympic Medalist - Wrestling",
    location: "Haryana, India",
    sport: "Wrestling",
    experience: "15+ years experience",
    stats: {
      connections: 3450,
      endorsements: 387,
      events: 62
    }
  }
];

const Network = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState(athletes);
  const [filteredCoaches, setFilteredCoaches] = useState(coaches);
  const [pendingRequests, setPendingRequests] = useState(connectionRequests);
  
  // Filter athletes and coaches based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAthletes(athletes);
      setFilteredCoaches(coaches);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    setFilteredAthletes(
      athletes.filter(athlete => 
        athlete.name.toLowerCase().includes(query) || 
        athlete.sport.toLowerCase().includes(query) ||
        athlete.location.toLowerCase().includes(query)
      )
    );
    
    setFilteredCoaches(
      coaches.filter(coach => 
        coach.name.toLowerCase().includes(query) || 
        coach.sport.toLowerCase().includes(query) ||
        coach.location.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);
  
  // Handle accept/reject connection requests
  const handleAcceptRequest = (id: number) => {
    setPendingRequests(prev => prev.filter(request => request.id !== id));
  };
  
  const handleRejectRequest = (id: number) => {
    setPendingRequests(prev => prev.filter(request => request.id !== id));
  };
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Network</h1>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, sport, or location" 
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="people" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mb-8">
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="requests" className="relative">
                Requests
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="people" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Athletes you may know
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredAthletes.map((athlete) => (
                  <div key={athlete.id} className="animate-fade-in [animation-delay:100ms]">
                    <ProfileCard 
                      name={athlete.name}
                      title={athlete.title}
                      location={athlete.location}
                      sport={athlete.sport}
                      experience={athlete.experience}
                      stats={athlete.stats}
                      isConnected={athlete.isConnected}
                    />
                  </div>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Coaches and trainers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.map((coach) => (
                  <div key={coach.id} className="animate-fade-in [animation-delay:200ms]">
                    <ProfileCard 
                      name={coach.name}
                      title={coach.title}
                      location={coach.location}
                      sport={coach.sport}
                      experience={coach.experience}
                      stats={coach.stats}
                      isConnected={coach.isConnected}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="connections" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Your connections</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...athletes, ...coaches]
                  .filter(person => person.isConnected)
                  .map((person) => (
                    <div key={person.id} className="animate-fade-in [animation-delay:100ms]">
                      <ProfileCard 
                        name={person.name}
                        title={person.title}
                        location={person.location}
                        sport={person.sport}
                        experience={person.experience}
                        stats={person.stats}
                        isConnected={true}
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Pending connection requests</h2>
              
              {pendingRequests.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">You have no pending connection requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="glass-card rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in [animation-delay:100ms]">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{request.sport} • {request.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button 
                          variant="outline" 
                          className="flex-1 md:flex-initial"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Ignore
                        </Button>
                        <Button 
                          className="flex-1 md:flex-initial"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Network;
