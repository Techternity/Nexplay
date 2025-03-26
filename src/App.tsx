// App.tsx
import Navbar from "@/components/layout/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Network from "@/pages/Network";
import Jobs from "@/pages/Jobs";
import Events from "@/pages/Events";
import Feed from "@/pages/Feed";
import Analyst from "@/pages/Analyst";
import Profile from "@/pages/Profile";
import HomePage from "@/components/home/HomePage";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-500 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-500 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/analyst" element={<ProtectedRoute><Analyst /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;