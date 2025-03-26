// Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '@/firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="fixed top-0 left-0 right-0 h-16 bg-background"></div>;
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-8",
        isScrolled 
          ? "py-3 bg-gray-900/90 backdrop-blur-md border-b border-gray-800" 
          : location.pathname === "/" 
            ? "py-4 bg-transparent" 
            : "py-4 bg-gray-900/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Updated logo section */}
        <Link to="/" className="flex items-center">
          <img 
            src="/images/nexplay_w.png" 
            alt="NextPlay Logo" 
            className="h-10 md:h-12 transition-transform hover:scale-105"
          />
        </Link>
        
        {/* Updated nav items styling */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Home
          </Link>
          <Link 
            to="/network" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/network') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Network
          </Link>
          <Link 
            to="/jobs" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/jobs') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Jobs
          </Link>
          <Link 
            to="/events" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/events') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Events
          </Link>
          <Link 
            to="/feed" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/feed') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Feed
          </Link>
          <Link 
            to="/analyst" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive('/analyst') 
                ? "text-white bg-blue-600/20 border-b-2 border-blue-500" 
                : "text-gray-300 hover:text-white hover:bg-gray-800/50"
            )}
          >
            Analyst
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
              </Button>
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("text-muted-foreground hover:text-foreground", isActive('/profile') && "text-foreground bg-accent")}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="default" onClick={handleLogout} className="ml-4">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/signin">
              <Button variant="default" className="ml-4">
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-gray-800/50"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-gray-900/95 backdrop-blur-sm z-40 animate-fade-in">
          <div className="p-6 flex flex-col space-y-6">
            <Link to="/" className={cn("text-lg font-medium", isActive('/') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/network" className={cn("text-lg font-medium", isActive('/network') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Network
            </Link>
            <Link to="/jobs" className={cn("text-lg font-medium", isActive('/jobs') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Jobs
            </Link>
            <Link to="/events" className={cn("text-lg font-medium", isActive('/events') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Events
            </Link>
            <Link to="/feed" className={cn("text-lg font-medium", isActive('/feed') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Feed
            </Link>
            <Link to="/analyst" className={cn("text-lg font-medium", isActive('/analyst') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Analyst
            </Link>
            <Link to="/profile" className={cn("text-lg font-medium", isActive('/profile') ? "text-blue-400" : "text-gray-300")} onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </Link>
            <div className="pt-4">
              {user ? (
                <Button className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;