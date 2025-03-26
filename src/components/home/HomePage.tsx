import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Full-screen background with sports theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/85 to-gray-800/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/athletes-field.png')] bg-cover bg-center bg-no-repeat z-0 animate-slow-zoom"></div>
      </div>
      
      {/* Main content with improved spacing */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 py-10 text-center">
        {/* Redesigned hero section without box */}
        <div className="mb-20 animate-fade-in">
          {/* Beautiful gradient tagline without the box */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-10 mt-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400">
              Elevate Your Athletic Journey
            </span>
            <div className="mt-4">
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 glow-text relative">
                with Nexplay
                <span className="absolute inset-0 nexplay-outline animate-pulse-glow"></span>
              </span>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto animate-fade-in-delay-1">
            Connect with coaches, teammates, and opportunities for your athletic career.
          </p>
        </div>
        
        {/* Main CTA buttons with improved styling */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20 animate-fade-in-delay-2">
          <Link to="/signup" className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-xl rounded-lg transform transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/20 hover:shadow-2xl">
            Join Now
          </Link>
          <Link to="/signin" className="px-12 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-xl rounded-lg transform transition-all hover:scale-105 shadow-xl border-2 border-white/30 hover:border-white/50">
            Sign In
          </Link>
        </div>
        
        {/* Feature highlights in a single row with improved spacing */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6 animate-fade-in-delay-3">
          <div className="flex space-x-8 min-w-max justify-center">
            {[
              { title: "Network", desc: "Connect with athletes & coaches" },
              { title: "Opportunities", desc: "Discover career paths" },
              { title: "Growth", desc: "Track your progress" },
              { title: "Events", desc: "Join competitions" },
              { title: "Health", desc: "Monitor athletic performance" },
              { title: "Recovery", desc: "Injury prevention & guidance" }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-black/40 backdrop-blur-sm p-6 rounded-lg w-[170px] border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105 shadow-lg group"
                style={{ animationDelay: `${(i+3)*100}ms` }}
              >
                <div className="w-10 h-1 bg-blue-500 rounded-full mx-auto mb-4 group-hover:w-16 transition-all duration-300"></div>
                <h3 className="font-bold text-white text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom attribution with improved style */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-sm z-20 animate-fade-in-delay-4">
        The premier platform for athletes
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.3s forwards;
        }
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        }
        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.9s forwards;
        }
        .animate-fade-in-delay-4 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 1.2s forwards;
        }
        
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-slow-zoom {
          animation: slowZoom 15s ease-in-out infinite alternate;
        }
        
        .glow-text {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
        
        .nexplay-outline {
          content: 'nexplay';
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes pulseGlow {
          0% { opacity: 0.2; filter: blur(1px); }
          50% { opacity: 0.5; filter: blur(2px); }
          100% { opacity: 0.2; filter: blur(1px); }
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
