// pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const userDocRef = doc(db, "users", user.uid); // Reference to user's document
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setBio(data.bio || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingData(true);
    try {
      const userDocRef = doc(db, "users", user.uid); // Document path: users/{userId}
      await setDoc(userDocRef, { name, bio }, { merge: true }); // Save or update data
      console.log("Profile saved successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    } finally {
      setLoadingData(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
        {user ? (
          <form onSubmit={handleSaveProfile} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loadingData}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loadingData ? "Saving..." : "Save Profile"}
            </button>
          </form>
        ) : (
          <p className="text-center">Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;