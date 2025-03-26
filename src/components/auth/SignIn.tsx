// components/auth/SignIn.tsx
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

// Array of sports-related quotes
const sportsQuotes = [
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The more difficult the victory, the greater the happiness in winning.", author: "Pelé" },
  { text: "It's not whether you get knocked down; it's whether you get up.", author: "Vince Lombardi" },
  { text: "The only way to prove you're a good sport is to lose.", author: "Ernie Banks" },
  { text: "Never say never because limits, like fears, are often just an illusion.", author: "Michael Jordan" },
];

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev === sportsQuotes.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("SignIn: User authenticated successfully", userCredential.user);
      navigate("/home");
    } catch (err) {
      console.error("SignIn: Authentication failed", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Side (Left) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 animate-slideDown">Welcome Back</h1>
            <p className="text-gray-600 mt-2 animate-slideDown animation-delay-100">Please sign in to your account</p>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2 group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-150">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all duration-300"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2 group transform transition-all duration-300 hover:translate-x-1 animate-fadeInUp animation-delay-200">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all duration-300"
                required
                disabled={loading}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}
            
            <div className="animate-fadeInUp animation-delay-250">
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                text-white shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary
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
                    Signing In...
                  </span>
                ) : "Sign In"}
              </button>
            </div>
            
            <div className="flex items-center justify-between animate-fadeInUp animation-delay-300">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-all duration-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300">
                Forgot password?
              </a>
            </div>
          </form>
          
          <p className="mt-8 text-center text-gray-600 animate-fadeInUp animation-delay-350">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:text-primary/80 transition-all duration-300 hover:underline">
              Sign Up
            </Link>
          </p>
          
          <div className="mt-8 animate-fadeInUp animation-delay-400">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </span>
              </button>
              <button
                type="button"
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Side (Right) */}
      <div className="w-full md:w-1/2 bg-gray-800 relative hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')" }}
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
                <p className="text-white/80 mt-2 tracking-wider">Connect. Play. Excel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;