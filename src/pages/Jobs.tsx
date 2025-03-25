import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, MapPin, Calendar, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/layout/Navbar';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  tags: string[];
}

// User profile interface for Skill Match
interface UserProfile {
  skills: string[];
  experienceLevel: string;
  preferredLocation?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCyFQ3m8BzUafCUwuXvyaDlBXRmuyA5IsQ';

// Mock user profile (replace with real user data later)
const mockUserProfile: UserProfile = {
  skills: ["Cricket", "Coaching", "Data Analysis"],
  experienceLevel: "Mid Level",
  preferredLocation: "Bangalore, India"
};

const Jobs = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);

  // Mock initial jobs
  const initialJobs: Job[] = [
    {
      id: "1",
      title: "Performance Analyst",
      company: "Sports Excellence Center",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹8,00,000 - ₹12,00,000 /year",
      postedDate: "2 days ago",
      description: "Help athletes reach peak performance through data-driven insights.",
      responsibilities: ["Collect and analyze performance data", "Create reports", "Recommend improvements"],
      requirements: ["Bachelor's in Sports Science", "2+ years experience", "Data analysis tools"],
      tags: ["Performance Analysis", "Data", "Sports Science"]
    },
    {
      id: "2",
      title: "Assistant Coach - Cricket",
      company: "National Cricket Academy",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹10,00,000 - ₹15,00,000 /year",
      postedDate: "1 week ago",
      description: "Develop the next generation of cricket talent.",
      responsibilities: ["Assist head coach", "Develop training programs", "Provide guidance"],
      requirements: ["Former cricketer preferred", "BCCI Level B", "3+ years coaching"],
      tags: ["Cricket", "Coaching", "Youth Development"]
    },
    {
      id: "3",
      title: "Sports Physiotherapist",
      company: "Elite Athletes Rehabilitation Center",
      location: "Delhi, India",
      type: "Full-time",
      salary: "₹7,00,000 - ₹10,00,000 /year",
      postedDate: "3 days ago",
      description: "Provide physiotherapy services to elite athletes.",
      responsibilities: ["Assess and treat injuries", "Develop rehab programs", "Injury prevention"],
      requirements: ["Master's in Physiotherapy", "3+ years experience", "Rehab techniques"],
      tags: ["Physiotherapy", "Rehabilitation", "Sports Medicine"]
    },
    {
      id: "4",
      title: "Strength & Conditioning Coach",
      company: "High Performance Sports Center",
      location: "Pune, India",
      type: "Full-time",
      salary: "₹6,00,000 - ₹9,00,000 /year",
      postedDate: "5 days ago",
      description: "Improve athletes' physical capabilities and prevent injuries.",
      responsibilities: ["Design training programs", "Conduct assessments", "Collaborate with team"],
      requirements: ["Bachelor's in Exercise Science", "NSCA, CSCS", "2+ years experience"],
      tags: ["S&C", "Training", "Physical Preparation"]
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs([...initialJobs, ...jobsList]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchUserData = async () => {
      if (user) {
        const appliedQuery = query(collection(db, 'job_applications'), where('uid', '==', user.uid));
        const appliedSnapshot = await getDocs(appliedQuery);
        setAppliedJobs(new Set(appliedSnapshot.docs.map(doc => doc.data().jobId)));

        const savedQuery = query(collection(db, 'saved_jobs'), where('uid', '==', user.uid));
        const savedSnapshot = await getDocs(savedQuery);
        setSavedJobs(new Set(savedSnapshot.docs.map(doc => doc.data().jobId)));
      }
    };

    fetchJobs();
    fetchUserData();
  }, [user]);

  // Skill Match Algorithm
  const getSkillMatchScore = (job: Job, profile: UserProfile): number => {
    let score = 0;
    const jobTagsLower = job.tags.map(tag => tag.toLowerCase());
    const userSkillsLower = profile.skills.map(skill => skill.toLowerCase());

    // Skill match
    userSkillsLower.forEach(skill => {
      if (jobTagsLower.includes(skill)) score += 30;
    });

    // Location match
    if (profile.preferredLocation && job.location.toLowerCase().includes(profile.preferredLocation.toLowerCase())) {
      score += 20;
    }

    // Experience match (simplified)
    if (job.requirements.some(req => req.includes(profile.experienceLevel))) {
      score += 20;
    }

    return score;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesJobType = jobTypeFilter.length === 0 || jobTypeFilter.includes(job.type);
    const matchesLocation = locationFilter.length === 0 || locationFilter.includes(job.location);

    return matchesSearch && matchesJobType && matchesLocation;
  });

  const recommendedJobs = [...filteredJobs].sort((a, b) =>
    getSkillMatchScore(b, mockUserProfile) - getSkillMatchScore(a, mockUserProfile)
  );

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
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

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert("Please log in to apply for jobs.");
      return;
    }
    try {
      await addDoc(collection(db, 'job_applications'), {
        jobId,
        uid: user.uid,
        appliedAt: new Date().toISOString()
      });
      setAppliedJobs(prev => new Set(prev).add(jobId));
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      alert("Please log in to save jobs.");
      return;
    }
    try {
      await addDoc(collection(db, 'saved_jobs'), {
        jobId,
        uid: user.uid,
        savedAt: new Date().toISOString()
      });
      setSavedJobs(prev => new Set(prev).add(jobId));
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const toggleFilter = (filterType: 'jobType' | 'location', value: string) => {
    if (filterType === 'jobType') {
      setJobTypeFilter(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else {
      setLocationFilter(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-7 w-7" />
            <span>Sports Careers</span>
          </h1>
          <Button variant="outline" disabled={!user}>
            + Post a Job
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, location, or skills"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="browse" className="mb-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended Jobs</TabsTrigger>
            <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filters
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm mb-2">Job Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Full-time", "Part-time", "Contract", "Internship"].map(type => (
                          <Badge
                            key={type}
                            variant={jobTypeFilter.includes(type) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => toggleFilter('jobType', type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm mb-2">Location</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Mumbai, India", "Bangalore, India", "Delhi, India", "Pune, India"].map(loc => (
                          <Badge
                            key={loc}
                            variant={locationFilter.includes(loc) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => toggleFilter('location', loc)}
                          >
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                      <Card
                        key={job.id}
                        className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'border-primary' : ''}`}
                        onClick={() => handleJobSelect(job)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{job.title}</CardTitle>
                            <span className="text-muted-foreground text-sm">{job.postedDate}</span>
                          </div>
                          <div className="text-lg font-medium">{job.company}</div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
                            <div
                              className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowMap(job.location);
                              }}
                            >
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                          </div>
                          <p className="line-clamp-2">{job.description}</p>
                          {selectedJob?.id === job.id && (
                            <div className="mt-4">
                              <h4 className="font-medium">Responsibilities:</h4>
                              <ul className="list-disc pl-5">
                                {job.responsibilities.map((resp, idx) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                              <h4 className="font-medium mt-2">Requirements:</h4>
                              <ul className="list-disc pl-5">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={appliedJobs.has(job.id) ? "secondary" : "default"}
                              disabled={appliedJobs.has(job.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApply(job.id);
                              }}
                            >
                              {appliedJobs.has(job.id) ? "Applied" : "Apply"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(job.id);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="mt-4">
            <div className="space-y-4">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map(job => (
                  <Card
                    key={job.id}
                    className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'border-primary' : ''}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{job.title}</CardTitle>
                        <span className="text-muted-foreground text-sm">{job.postedDate}</span>
                      </div>
                      <div className="text-lg font-medium">{job.company}</div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
                        <div
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowMap(job.location);
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <p className="line-clamp-2">{job.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={appliedJobs.has(job.id) ? "secondary" : "default"}
                          disabled={appliedJobs.has(job.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job.id);
                          }}
                        >
                          {appliedJobs.has(job.id) ? "Applied" : "Apply"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(job.id);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No recommended jobs found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="mt-4">
            <div className="space-y-4">
              {jobs.filter(job => appliedJobs.has(job.id)).length > 0 ? (
                jobs.filter(job => appliedJobs.has(job.id)).map(job => (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <div className="text-lg font-medium">{job.company}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p>You haven't applied to any jobs yet.</p>
                  <Button variant="outline" className="mt-4">Browse Jobs</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="space-y-4">
              {jobs.filter(job => savedJobs.has(job.id)).length > 0 ? (
                jobs.filter(job => savedJobs.has(job.id)).map(job => (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <div className="text-lg font-medium">{job.company}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p>You don't have any saved jobs.</p>
                  <Button variant="outline" className="mt-4">Browse Jobs</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Map Modal */}
        <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Job Location: {selectedLocation?.name}</DialogTitle>
              <DialogDescription>View the job location on the map below.</DialogDescription>
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
      </div>
    </div>
  );
};

export default Jobs;