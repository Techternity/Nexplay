
import React, { useState } from 'react';
import { Briefcase, Search, Filter, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';

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

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Performance Analyst",
    company: "Sports Excellence Center",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹8,00,000 - ₹12,00,000 /year",
    postedDate: "2 days ago",
    description: "We are seeking a Performance Analyst to join our team to help athletes reach their peak performance through data-driven insights.",
    responsibilities: [
      "Collect and analyze performance data from athletes",
      "Create reports and visualizations for coaches and athletes",
      "Recommend performance improvements based on data analysis"
    ],
    requirements: [
      "Bachelor's degree in Sports Science, Statistics, or related field",
      "2+ years of experience in sports performance analysis",
      "Proficiency in data analysis tools and software"
    ],
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
    description: "The National Cricket Academy is looking for an Assistant Coach to help develop the next generation of cricket talent in India.",
    responsibilities: [
      "Assist the head coach in training sessions",
      "Develop training programs for young athletes",
      "Provide technical and tactical guidance to players"
    ],
    requirements: [
      "Former professional cricketer preferred",
      "BCCI Level B coaching certification or equivalent",
      "3+ years of coaching experience at a competitive level"
    ],
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
    description: "Join our team of sports medicine professionals to provide high-quality physiotherapy services to elite athletes.",
    responsibilities: [
      "Assess and treat sports injuries",
      "Develop rehabilitation programs",
      "Work with coaches to implement injury prevention strategies"
    ],
    requirements: [
      "Master's degree in Physiotherapy with specialization in Sports",
      "3+ years of experience working with athletes",
      "Knowledge of latest rehabilitation techniques and technologies"
    ],
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
    description: "We are looking for a Strength & Conditioning Coach to help athletes improve their physical capabilities and prevent injuries.",
    responsibilities: [
      "Design and implement strength training programs",
      "Conduct fitness assessments",
      "Work closely with technical coaches and sports science team"
    ],
    requirements: [
      "Bachelor's degree in Exercise Science or related field",
      "NSCA, CSCS, or equivalent certification",
      "2+ years of experience working with competitive athletes"
    ],
    tags: ["S&C", "Training", "Physical Preparation"]
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-7 w-7" />
            <span>Sports Careers</span>
          </h1>
          <Button variant="outline">
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
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Full-time</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Part-time</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Contract</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Internship</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm mb-2">Experience Level</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Entry Level</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Mid Level</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Senior Level</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm mb-2">Sport</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Cricket</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Football</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Hockey</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Basketball</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Tennis</Badge>
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
                            <div className="flex items-center gap-1">
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
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="applied">
            <div className="text-center py-10">
              <p>You haven't applied to any jobs yet.</p>
              <Button variant="outline" className="mt-4">Browse Jobs</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="text-center py-10">
              <p>You don't have any saved jobs.</p>
              <Button variant="outline" className="mt-4">Browse Jobs</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Jobs;
