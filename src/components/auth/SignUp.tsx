import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// List of Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Array of sports-related quotes
const sportsQuotes = [
  { text: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },
  { text: "Never give up, never give in, and when the upper hand is ours, may we have the ability to handle the win with the dignity with which we absorbed the loss.", author: "Doug Williams" },
  { text: "The difference between the impossible and the possible lies in a person's determination.", author: "Tommy Lasorda" },
  { text: "Do you know what my favorite part of the game is? The opportunity to play.", author: "Mike Singletary" },
  { text: "What makes something special is not just what you have to gain, but what you feel there is to lose.", author: "Andre Agassi" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
];

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev === sportsQuotes.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!name || !gender || !state || !phoneNumber) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Phone number must be a 10-digit number");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data for Firestore
      const userData = {
        name,
        email,
        gender,
        state,
        phoneNumber,
        createdAt: new Date().toISOString()
      };
      console.log("Writing to Firestore: ", { uid: user.uid, data: userData });

      // Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      console.log("SignUp: User registered successfully", user);
      navigate("/home");
    } catch (err: any) {
      console.error("SignUp: Registration failed", err.code, err.message);
      // Map Firebase errors to user-friendly messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please log in or use a different email.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format. Please check your email.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. It should be at least 6 characters.");
          break;
        case "permission-denied":
          setError("Failed to save user data due to permissions. Contact support.");
          break;
        default:
          setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Side (Left) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-md py-6 animate-fadeIn">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 animate-slideDown">Create Account</h1>
            <p className="text-gray-600 mt-2 animate-slideDown animation-delay-100">Join our community of sports enthusiasts</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-100">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="mt-1 py-2 shadow-sm transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-150">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1 py-2 shadow-sm transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-200">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1 py-2 shadow-sm transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-250">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
              <Select onValueChange={setGender} required disabled={loading}>
                <SelectTrigger id="gender" className="mt-1 transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-300">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
              <Select onValueChange={setState} required disabled={loading}>
                <SelectTrigger id="state" className="mt-1 transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((stateName) => (
                    <SelectItem key={stateName} value={stateName}>
                      {stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-350">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
                className="mt-1 py-2 shadow-sm transition-all duration-300 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm animate-pulse">
                {error}
              </p>
            )}

            <div className="animate-fadeInUp animation-delay-400">
              <Button 
                type="submit" 
                className="w-full py-3 text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary 
                relative overflow-hidden group"
                disabled={loading}
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing Up...
                  </span>
                ) : "Sign Up"}
              </Button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-gray-600 animate-fadeInUp animation-delay-450">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline transition-all duration-300 hover:text-primary/80">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      
      {/* Image Side (Right) */}
      <div className="w-full md:w-1/2 bg-gray-800 relative hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center max-w-lg">
              <div className="relative mb-10 transition-opacity duration-1000 animate-fadeIn">
                <div className="absolute -top-5 -left-5 text-5xl text-primary opacity-50">"</div>
                <p className="text-2xl font-light italic mb-5 text-white tracking-wide leading-relaxed animate-slideUp">{sportsQuotes[currentQuote].text}</p>
                <div className="absolute -bottom-5 -right-5 text-5xl text-primary opacity-50">"</div>
                <div className="mt-3 flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-primary/60 mr-3"></div>
                  <p className="text-lg text-white/90 font-medium animate-slideUp animation-delay-150">{sportsQuotes[currentQuote].author}</p>
                  <div className="w-10 h-0.5 bg-primary/60 ml-3"></div>
                </div>
              </div>
              <div className="mt-16 animate-fadeIn animation-delay-300">
                <h2 className="text-4xl font-bold text-white animate-glow animation-duration-5000">NextPlay</h2>
                <p className="text-white/80 mt-2 tracking-wider">Where passion meets performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;