
import React, { useState } from 'react';
import { BarChart2, PieChart, LineChart, Activity, Filter, Download, ChevronDown, BarChart, TrendingUp, Users, Calendar, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import Navbar from '@/components/layout/Navbar';

// Mock performance data
const performanceData = [
  { month: 'Jan', performance: 65, average: 60 },
  { month: 'Feb', performance: 59, average: 60 },
  { month: 'Mar', performance: 80, average: 60 },
  { month: 'Apr', performance: 81, average: 60 },
  { month: 'May', performance: 56, average: 60 },
  { month: 'Jun', performance: 55, average: 60 },
  { month: 'Jul', performance: 60, average: 60 },
  { month: 'Aug', performance: 70, average: 60 },
  { month: 'Sep', performance: 85, average: 60 },
  { month: 'Oct', performance: 90, average: 60 },
  { month: 'Nov', performance: 72, average: 60 },
  { month: 'Dec', performance: 78, average: 60 },
];

// Mock sport distribution data
const sportDistributionData = [
  { name: 'Cricket', value: 45 },
  { name: 'Football', value: 25 },
  { name: 'Badminton', value: 15 },
  { name: 'Hockey', value: 10 },
  { name: 'Other', value: 5 },
];

// Mock athlete progress data
const athleteProgressData = [
  { month: 'Jan', strength: 30, speed: 40, technique: 35, mental: 25 },
  { month: 'Feb', strength: 35, speed: 40, technique: 40, mental: 30 },
  { month: 'Mar', strength: 40, speed: 45, technique: 45, mental: 35 },
  { month: 'Apr', strength: 45, speed: 50, technique: 50, mental: 40 },
  { month: 'May', strength: 50, speed: 55, technique: 55, mental: 45 },
  { month: 'Jun', strength: 55, speed: 60, technique: 60, mental: 50 },
];

// Mock athlete metrics
const athleteMetrics = [
  { name: 'Total Athletes', value: 542, icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Active Programs', value: 38, icon: Activity, change: '+3', changeType: 'positive' },
  { name: 'Average Progress', value: '68%', icon: TrendingUp, change: '+5%', changeType: 'positive' },
  { name: 'Competitions', value: 24, icon: Calendar, change: '-2', changeType: 'negative' },
  { name: 'Achievement Rate', value: '74%', icon: Medal, change: '+8%', changeType: 'positive' },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const Analyst = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart2 className="h-7 w-7" />
            <span>Performance Analytics</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          {athleteMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{metric.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <span className={`text-xs ${metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change}
                    </span>
                  </div>
                  <metric.icon className="h-8 w-8 text-muted-foreground opacity-80" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="performance" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="average" stroke="#82ca9d" strokeDasharray="5 5" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Sport Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="h-full flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height={220}>
                      <RechartsPieChart>
                        <Pie
                          data={sportDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sportDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    
                    <div className="flex justify-center flex-wrap gap-2 mt-4">
                      {sportDistributionData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-xs">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Athlete Progress Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={athleteProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="strength" fill="#8884d8" name="Strength" />
                      <Bar dataKey="speed" fill="#82ca9d" name="Speed" />
                      <Bar dataKey="technique" fill="#ffc658" name="Technique" />
                      <Bar dataKey="mental" fill="#ff8042" name="Mental" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Performance Analysis Dashboard</h3>
              <p className="text-muted-foreground mb-6">This section will contain detailed performance metrics and analysis tools.</p>
              <Button>View Performance Data</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="athletes">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Athlete Management Dashboard</h3>
              <p className="text-muted-foreground mb-6">This section will contain athlete profiles, progress tracking, and management tools.</p>
              <Button>View Athletes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Comparative Analysis Dashboard</h3>
              <p className="text-muted-foreground mb-6">This section will allow comparing athletes, teams, and performance metrics.</p>
              <Button>Start Comparison</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>Utilize AI-powered insights to optimize athlete performance and development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border rounded-lg p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Performance Prediction</h3>
                <p className="text-sm text-muted-foreground">Predict future performance based on historical data and training patterns</p>
                <Button variant="outline" className="mt-4" size="sm">Analyze</Button>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Injury Risk Assessment</h3>
                <p className="text-sm text-muted-foreground">Identify potential injury risks based on workload and recovery patterns</p>
                <Button variant="outline" className="mt-4" size="sm">Assess</Button>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Talent Identification</h3>
                <p className="text-sm text-muted-foreground">Identify potential elite athletes using advanced performance metrics</p>
                <Button variant="outline" className="mt-4" size="sm">Discover</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button>Unlock Advanced Analytics</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Analyst;
