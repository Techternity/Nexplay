import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Define the Sports Profile data type
interface SportsProfileData {
  name: string;
  tagline?: string;
  bio: string;
  profilePic: File | null;
  profilePicBase64: string;
  coverPhotoBase64: string;
  coverPhoto: File | null;
  location: string;
  favoriteSports: string;
  favoriteSportsArray?: string[];
  favoriteTeams: string;
  playingExperience: string;
  sportsAchievements?: string;
  fanInterests?: string;
  sportsGear?: string;
  email?: string;
  instagram?: string;
  twitter?: string;
  following?: string[]; // Added for connections
  followers?: string[]; // Added for connections
  updatedAt?: string;
}

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [step, setStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedProfile, setSavedProfile] = useState<SportsProfileData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [showSportModal, setShowSportModal] = useState(false);
  const [newSport, setNewSport] = useState("");

  const [formData, setFormData] = useState<SportsProfileData>({
    name: "",
    tagline: "",
    bio: "",
    profilePic: null,
    profilePicBase64: "",
    coverPhotoBase64: "",
    coverPhoto: null,
    location: "",
    favoriteSports: "",
    favoriteSportsArray: [],
    favoriteTeams: "",
    playingExperience: "",
    sportsAchievements: "",
    fanInterests: "",
    sportsGear: "",
    email: "",
    instagram: "",
    twitter: "",
    following: [], // Initialize following
    followers: [], // Initialize followers
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (formData.profilePic) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, profilePicBase64: reader.result as string }));
      };
      reader.readAsDataURL(formData.profilePic);
    } else {
      setPreview(formData.profilePicBase64 || null);
    }
  }, [formData.profilePic, formData.profilePicBase64]);

  useEffect(() => {
    if (formData.coverPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, coverPhotoBase64: reader.result as string }));
      };
      reader.readAsDataURL(formData.coverPhoto);
    } else {
      setCoverPreview(formData.coverPhotoBase64 || null);
    }
  }, [formData.coverPhoto, formData.coverPhotoBase64]);

  const processSports = (sportsString: string) => {
    if (!sportsString) return [];
    return sportsString
      .split(",")
      .map((sport) => sport.trim())
      .filter((sport) => sport !== "");
  };

  const fetchProfile = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      const localProfilePic = localStorage.getItem(`profilePic_${user.uid}`) || "";
      const localCoverPhoto = localStorage.getItem(`coverPhoto_${user.uid}`) || "";

      if (docSnap.exists()) {
        const data = docSnap.data() as SportsProfileData;
        setFormData({
          name: data.name || "",
          tagline: data.tagline || "",
          bio: data.bio || "",
          profilePic: null,
          profilePicBase64: localProfilePic,
          coverPhotoBase64: localCoverPhoto,
          coverPhoto: null,
          location: data.location || "",
          favoriteSports: data.favoriteSports || "",
          favoriteSportsArray: data.favoriteSportsArray || [],
          favoriteTeams: data.favoriteTeams || "",
          playingExperience: data.playingExperience || "",
          sportsAchievements: data.sportsAchievements || "",
          fanInterests: data.fanInterests || "",
          sportsGear: data.sportsGear || "",
          email: data.email || user.email || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          following: data.following || [], // Fetch following
          followers: data.followers || [], // Fetch followers
        });
        setSavedProfile({ ...data, profilePicBase64: localProfilePic, coverPhotoBase64: localCoverPhoto });
        setStep(5);
      } else {
        setFormData((prev) => ({
          ...prev,
          profilePicBase64: localProfilePic,
          coverPhotoBase64: localCoverPhoto,
          following: [], // Initialize for new users
          followers: [], // Initialize for new users
        }));
        setStep(1);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.name === "profilePic") {
        setFormData((prev) => ({ ...prev, profilePic: file }));
      } else if (e.target.name === "coverPhoto") {
        setFormData((prev) => ({ ...prev, coverPhoto: file }));
      }
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerCoverPhotoInput = () => coverPhotoRef.current?.click();

  const addSport = () => {
    if (!newSport.trim()) return;
    const sportsArray = formData.favoriteSportsArray || [];
    if (!sportsArray.includes(newSport.trim())) {
      const updatedSports = [...sportsArray, newSport.trim()];
      setFormData((prev) => ({
        ...prev,
        favoriteSportsArray: updatedSports,
        favoriteSports: updatedSports.join(", "),
      }));
    }
    setNewSport("");
    setShowSportModal(false);
  };

  const removeSport = (sportToRemove: string) => {
    const updatedSports = (formData.favoriteSportsArray || []).filter((sport) => sport !== sportToRemove);
    setFormData((prev) => ({
      ...prev,
      favoriteSportsArray: updatedSports,
      favoriteSports: updatedSports.join(", "),
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !formData.name) {
      setError("Name is required");
      return;
    }
    setError("");
    setProgress((step / 4) * 100);
    setStep((prev) => prev + 1);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to save your profile");
      return;
    }

    setSaving(true);
    setLoadingData(true);
    setError("");

    try {
      if (formData.profilePicBase64) {
        localStorage.setItem(`profilePic_${user.uid}`, formData.profilePicBase64);
      }
      if (formData.coverPhotoBase64) {
        localStorage.setItem(`coverPhoto_${user.uid}`, formData.coverPhotoBase64);
      }

      const favoriteSportsArray = processSports(formData.favoriteSports);

      const userDocRef = doc(db, "users", user.uid);
      const updatedProfile: SportsProfileData = {
        name: formData.name,
        tagline: formData.tagline,
        bio: formData.bio,
        profilePic: null,
        profilePicBase64: "",
        coverPhotoBase64: "",
        coverPhoto: null,
        location: formData.location,
        favoriteSports: formData.favoriteSports,
        favoriteSportsArray,
        favoriteTeams: formData.favoriteTeams,
        playingExperience: formData.playingExperience,
        sportsAchievements: formData.sportsAchievements,
        fanInterests: formData.fanInterests,
        sportsGear: formData.sportsGear,
        email: formData.email || user.email,
        instagram: formData.instagram,
        twitter: formData.twitter,
        following: formData.following || [], // Preserve following
        followers: formData.followers || [], // Preserve followers
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, updatedProfile, { merge: true });

      setSavedProfile({
        ...updatedProfile,
        profilePicBase64: formData.profilePicBase64,
        coverPhotoBase64: formData.coverPhotoBase64,
      });
      setFormData((prev) => ({
        ...prev,
        profilePic: null,
        coverPhoto: null,
      }));
      setStep(5);
      console.log("Profile saved successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Failed to save profile: ${err.message}`);
    } finally {
      setLoadingData(false);
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Tell Us About Yourself</h3>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Sports Tagline</label>
              <input
                type="text"
                name="tagline"
                placeholder="e.g., Basketball Fan | Weekend Player"
                value={formData.tagline || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">A quick intro to your sports passion</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                placeholder="Share your love for sports, favorite moments, or goals..."
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Your Sports Photos</h3>
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div
                  className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={triggerFileInput}
                >
                  {preview ? (
                    <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                  >
                    {preview ? "Change Picture" : "Upload Picture"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Show off your sports spirit! (Stored locally)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Cover Photo</label>
              <div
                className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity mb-2"
                onClick={triggerCoverPhotoInput}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm mt-1">Add Sports Cover</span>
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={triggerCoverPhotoInput}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                {coverPreview ? "Change Cover Photo" : "Upload Cover Photo"}
              </button>
              <p className="text-xs text-gray-500 mt-1">A stadium or game moment (Stored locally)</p>
              <input
                ref={coverPhotoRef}
                type="file"
                name="coverPhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Sports Identity</h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">Favorite Sports</label>
                <button
                  type="button"
                  onClick={() => setShowSportModal(true)}
                  className="text-blue-600 text-sm hover:text-blue-800 focus:outline-none"
                >
                  + Add Sport
                </button>
              </div>
              {formData.favoriteSportsArray && formData.favoriteSportsArray.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.favoriteSportsArray.map((sport, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                      {sport}
                      <button
                        type="button"
                        onClick={() => removeSport(sport)}
                        className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No sports added yet. Tell us what you love!</p>
              )}
              <input type="hidden" name="favoriteSports" value={formData.favoriteSports} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Favorite Teams</label>
              <input
                type="text"
                name="favoriteTeams"
                placeholder="e.g., Lakers, Manchester United"
                value={formData.favoriteTeams}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Playing Experience</label>
              <textarea
                name="playingExperience"
                placeholder="e.g., Played soccer in college, weekend basketball player"
                value={formData.playingExperience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">More About Your Sports Life</h3>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Sports Achievements</label>
              <textarea
                name="sportsAchievements"
                placeholder="e.g., Won local tennis tournament 2023"
                value={formData.sportsAchievements || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Fan Interests</label>
              <textarea
                name="fanInterests"
                placeholder="e.g., Love watching Super Bowl, F1 races"
                value={formData.fanInterests || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Sports Gear</label>
              <input
                type="text"
                name="sportsGear"
                placeholder="e.g., Adidas cleats, Spalding basketball"
                value={formData.sportsGear || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Chicago, IL"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  placeholder="username"
                  value={formData.instagram || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Twitter</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">@</span>
                  </div>
                  <input
                    type="text"
                    name="twitter"
                    placeholder="username"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const SportModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${showSportModal ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add a Favorite Sport</h3>
        <input
          type="text"
          value={newSport}
          onChange={(e) => setNewSport(e.target.value)}
          placeholder="e.g., Basketball"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={() => setShowSportModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={addSport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        step < 5 ? (
          // Profile Setup Wizard
          <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Sports Profile</h2>
              <p className="text-gray-600 mb-6">Join the sports community and share your passion!</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <form onSubmit={step === 4 ? handleSaveProfile : handleNext} className="space-y-6">
                {renderStep()}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                      className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loadingData || saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ml-auto"
                  >
                    {saving ? "Saving..." : step === 4 ? "Finish" : "Next"}
                  </button>
                </div>
              </form>
            </div>
            <SportModal />
          </div>
        ) : (
          // Full-Screen Profile View with Fixed Name Overlap
          <div className="w-full min-h-screen bg-gray-100">
            {/* Cover Photo */}
            <div className="relative w-full h-40 bg-gray-200">
              {savedProfile?.coverPhotoBase64 ? (
                <img
                  src={savedProfile.coverPhotoBase64}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Cover Photo
                </div>
              )}
            </div>

            {/* Profile Picture and Name */}
            <div className="relative max-w-5xl mx-auto px-4 pt-4">
              <div className="flex items-end relative">
                <div className="absolute -top-16 w-32 h-32 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                  {savedProfile?.profilePicBase64 ? (
                    <img
                      src={savedProfile.profilePicBase64}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="ml-40 flex items-center flex-1 pt-16">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{savedProfile?.name}</h1>
                    {savedProfile?.tagline && <p className="text-gray-600">{savedProfile.tagline}</p>}
                    <p className="text-gray-500">
                      {(savedProfile?.following?.length || 0) + (savedProfile?.followers?.length || 0)} sports connections
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="md:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Info</h2>
                  {savedProfile?.bio && (
                    <p className="text-gray-600 mb-4">{savedProfile.bio}</p>
                  )}
                  {savedProfile?.location && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">📍 Location:</span> {savedProfile.location}
                    </p>
                  )}
                  {savedProfile?.email && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Email:</span>{" "}
                      <a href={`mailto:${savedProfile.email}`} className="text-blue-500 hover:underline">
                        {savedProfile.email}
                      </a>
                    </p>
                  )}
                  {savedProfile?.instagram && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Instagram:</span>{" "}
                      <a
                        href={`https://instagram.com/${savedProfile.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        @{savedProfile.instagram}
                      </a>
                    </p>
                  )}
                  {savedProfile?.twitter && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Twitter:</span>{" "}
                      <a
                        href={`https://twitter.com/${savedProfile.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        @{savedProfile.twitter}
                      </a>
                    </p>
                  )}
                  {/* Add Connections Info */}
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Following:</span> {savedProfile?.following?.length || 0}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Followers:</span> {savedProfile?.followers?.length || 0}
                  </p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:w-2/3 space-y-6">
                {/* Sports Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Sports Info</h2>
                  {savedProfile?.favoriteSportsArray && savedProfile.favoriteSportsArray.length > 0 && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Favorite Sports:</span>{" "}
                      {savedProfile.favoriteSportsArray.join(", ")}
                    </p>
                  )}
                  {savedProfile?.favoriteTeams && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Favorite Teams:</span> {savedProfile.favoriteTeams}
                    </p>
                  )}
                  {savedProfile?.playingExperience && (
                    <p className="text-gray-600 mb-2 whitespace-pre-wrap">
                      <span className="font-medium">Playing Experience:</span> {savedProfile.playingExperience}
                    </p>
                  )}
                </div>

                {/* Achievements */}
                {savedProfile?.sportsAchievements && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{savedProfile.sportsAchievements}</p>
                  </div>
                )}

                {/* Fan Life */}
                {(savedProfile?.fanInterests || savedProfile?.sportsGear) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Fan Life</h2>
                    {savedProfile?.fanInterests && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Fan Interests:</span> {savedProfile.fanInterests}
                      </p>
                    )}
                    {savedProfile?.sportsGear && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Gear:</span> {savedProfile.sportsGear}
                      </p>
                    )}
                  </div>
                )}

                {/* Last Updated */}
                {savedProfile?.updatedAt && (
                  <p className="text-sm text-gray-400">
                    Last updated: {new Date(savedProfile.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center text-gray-600 pt-20">Please sign in to join the sports community.</div>
      )}
    </div>
  );
};

export default Profile;