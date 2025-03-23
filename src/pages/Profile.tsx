
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProfileCard from '@/components/profile/ProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Edit, Plus, PlusCircle, Share2, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock user data
const userData = {
  name: "Virat Kohli",
  title: "Professional Cricketer",
  location: "Delhi, India",
  sport: "Cricket",
  experience: "15+ years experience",
  achievements: [
    "ICC Cricket World Cup Champion",
    "ICC Player of the Year",
    "Arjuna Award Recipient"
  ],
  stats: {
    connections: 5840,
    endorsements: 423,
    events: 87
  },
  isCurrentUser: true
};

const Profile = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="animate-fade-in">
              <ProfileCard 
                name={userData.name}
                title={userData.title}
                location={userData.location}
                sport={userData.sport}
                experience={userData.experience}
                achievements={userData.achievements}
                stats={userData.stats}
                isCurrentUser={userData.isCurrentUser}
              />
            </div>
            
            {/* Right Column - Tabs and Content */}
            <div className="lg:col-span-2 animate-fade-in [animation-delay:100ms]">
              <Tabs defaultValue="posts" className="w-full">
                <div className="border-b">
                  <TabsList className="h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="posts" 
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent",
                        "transition-none"
                      )}
                    >
                      Posts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="about" 
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent",
                        "transition-none"
                      )}
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger 
                      value="achievements" 
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent",
                        "transition-none"
                      )}
                    >
                      Achievements
                    </TabsTrigger>
                    <TabsTrigger 
                      value="stats" 
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent",
                        "transition-none"
                      )}
                    >
                      Stats
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="posts" className="mt-6 space-y-6">
                  {/* Create Post */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <Button variant="outline" className="flex-1 justify-start text-muted-foreground">
                        Share an update or achievement...
                      </Button>
                    </div>
                    <div className="flex mt-4 pt-3 border-t justify-between">
                      <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                        <Calendar className="h-4 w-4 mr-1" />
                        Event
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                        <Award className="h-4 w-4 mr-1" />
                        Achievement
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Media
                      </Button>
                    </div>
                  </div>
                  
                  {/* Sample Post */}
                  <div className="glass-card rounded-xl p-6 hover-scale">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{userData.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Shared an achievement • 2 days ago
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <p>Honored to receive the ICC Player of the Year award. Thank you for all the support!</p>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden bg-accent/50 mb-4">
                      <div className="aspect-[16/9] bg-accent/90 flex items-center justify-center text-muted-foreground">
                        Award Ceremony Image
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        245 congratulations
                      </div>
                      <Button variant="ghost" size="sm">
                        Congratulate
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about" className="mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">About</h3>
                      {userData.isCurrentUser && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="mb-6 text-muted-foreground">
                      Professional cricketer representing India in international cricket. 
                      Right-handed batsman with a passion for excellence and dedication to the sport.
                      Committed to promoting cricket and supporting young talent.
                    </p>
                    
                    {/* Experience Section */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <Briefcase className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="font-medium">Experience</h4>
                      </div>
                      
                      <div className="ml-6 space-y-4">
                        <div>
                          <div className="flex justify-between">
                            <h5 className="font-medium">Captain</h5>
                            <span className="text-sm text-muted-foreground">2017 - Present</span>
                          </div>
                          <p className="text-muted-foreground">Indian Cricket Team</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between">
                            <h5 className="font-medium">Player</h5>
                            <span className="text-sm text-muted-foreground">2008 - 2017</span>
                          </div>
                          <p className="text-muted-foreground">Indian Cricket Team</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Education Section */}
                    <div>
                      <div className="flex items-center mb-3">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="font-medium">Education</h4>
                      </div>
                      
                      <div className="ml-6">
                        <div>
                          <div className="flex justify-between">
                            <h5 className="font-medium">Sports Management</h5>
                            <span className="text-sm text-muted-foreground">2005 - 2008</span>
                          </div>
                          <p className="text-muted-foreground">Delhi University</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Achievements & Awards</h3>
                      {userData.isCurrentUser && (
                        <Button variant="outline" size="sm" className="h-8">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">ICC Player of the Year</h4>
                          <p className="text-sm text-muted-foreground mb-1">International Cricket Council • 2023</p>
                          <p className="text-sm">
                            Awarded for exceptional performance in international cricket across all formats.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">ICC Cricket World Cup Champion</h4>
                          <p className="text-sm text-muted-foreground mb-1">International Cricket Council • 2023</p>
                          <p className="text-sm">
                            Key player in India's World Cup victory, contributing significantly to the team's success.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">Arjuna Award</h4>
                          <p className="text-sm text-muted-foreground mb-1">Government of India • 2018</p>
                          <p className="text-sm">
                            India's second highest sporting honor, awarded for outstanding achievement in sports.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats" className="mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Performance Statistics</h3>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Batting Average</h4>
                        <div className="relative h-8 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: '78%' }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-3 justify-end">
                            <span className="text-sm font-medium">78.4</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Strike Rate</h4>
                        <div className="relative h-8 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: '92%' }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-3 justify-end">
                            <span className="text-sm font-medium">92.7</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Centuries</h4>
                        <div className="relative h-8 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: '71%' }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-3 justify-end">
                            <span className="text-sm font-medium">71</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Win Contribution</h4>
                        <div className="relative h-8 w-full bg-accent rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: '83%' }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-3 justify-end">
                            <span className="text-sm font-medium">83%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
