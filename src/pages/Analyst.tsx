import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, PieChart, LineChart, Activity, Filter, Download, ChevronDown, BarChart, TrendingUp, Users, Calendar, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase'; // Import Firebase config
import vision from '@google-cloud/vision';
import { Translate } from '@google-cloud/translate';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

// Initialize Google Cloud clients
const visionClient = new vision.ImageAnnotatorClient();
const translate = new Translate();

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const Analyst = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [performanceData, setPerformanceData] = useState([]);
  const [sportDistributionData, setSportDistributionData] = useState([]);
  const [athleteProgressData, setAthleteProgressData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const perfSnapshot = await getDocs(collection(db, "performance"));
      setPerformanceData(perfSnapshot.docs.map(doc => doc.data()));

      const sportSnapshot = await getDocs(collection(db, "sport_distribution"));
      setSportDistributionData(sportSnapshot.docs.map(doc => doc.data()));

      const progressSnapshot = await getDocs(collection(db, "athlete_progress"));
      setAthleteProgressData(progressSnapshot.docs.map(doc => doc.data()));
    };
    fetchData();
  }, []);

  // Handle image upload for gear detection
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const [result] = await visionClient.labelDetection(imageUrl);
    const labels = result.labelAnnotations.map(label => label.description).join(", ");
    const [translatedText] = await translate.translate(labels, selectedLanguage);
    setAnalysisResult(translatedText);
  };

  // Handle video upload for performance analysis
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    const storageRef = ref(storage, `videos/${file.name}`);
    await uploadBytes(storageRef, file);
    const videoUrl = await getDownloadURL(storageRef);
    // Video analysis happens in PerformanceAnalyzer component
  };

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

        {/* Existing Athlete Metrics Cards */}
        {/* ... (unchanged) */}

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

          {/* Add Gear Detection Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Gear Detection</CardTitle>
                <CardDescription>Upload an image to identify sports equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="mt-2"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
                {analysisResult && <p className="mt-4">Detected: {analysisResult}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Live Performance Analysis Tab */}
          <TabsContent value="athletes">
            <Card>
              <CardHeader>
                <CardTitle>Live Performance Analysis</CardTitle>
                <CardDescription>Upload a video to analyze player performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Input type="file" accept="video/*" onChange={handleVideoUpload} />
                {videoFile && <PerformanceAnalyzer videoUrl={URL.createObjectURL(videoFile)} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            {/* Existing comparison content */}
          </TabsContent>
        </Tabs>

        {/* Existing Advanced Analytics Card */}
        {/* ... (unchanged) */}
      </div>
    </div>
  );
};

// Performance Analyzer Component
const PerformanceAnalyzer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        results.poseLandmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        });

        const speed = calculateSpeed(results.poseLandmarks);
        savePerformanceData(speed, Date.now());
      }
    });

    if (videoUrl) {
      const videoElement = videoRef.current;
      videoElement.src = videoUrl;
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => pose.close();
  }, [videoUrl]);

  return (
    <div className="mt-4">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
};

// Helper Functions
const calculateSpeed = (landmarks) => {
  const hip = landmarks[23];
  const knee = landmarks[25];
  const distance = Math.abs(hip.y - knee.y);
  return distance * 100;
};

const savePerformanceData = async (speed, timestamp) => {
  await addDoc(collection(db, "player_performance"), {
    speed,
    timestamp,
    date: new Date().toISOString(),
  });
};

export default Analyst;