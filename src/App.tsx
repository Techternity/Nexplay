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

function App() {
  const [user,loading] = useAuthState(auth);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Hero />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Hero />
              <Features />
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
    </>
  );
}

export default App;