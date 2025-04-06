// ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  console.log("ProtectedRoute: Current auth state:", { user, loading, error });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (error) {
    console.error("ProtectedRoute: Authentication error:", error);
    return <Navigate to="/signin" replace />;
  }

  if (!user) {
    console.warn("ProtectedRoute: No user detected, redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  console.log("ProtectedRoute: User is authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;