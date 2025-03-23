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
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md border-b" : "py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold flex items-center">
          <span className="text-primary">Sports</span>
          <span className="ml-1">Catalyst</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className={cn("nav-link", isActive('/') && "nav-link-active")}>
            Home
          </Link>
          <Link to="/network" className={cn("nav-link", isActive('/network') && "nav-link-active")}>
            Network
          </Link>
          <Link to="/jobs" className={cn("nav-link", isActive('/jobs') && "nav-link-active")}>
            Jobs
          </Link>
          <Link to="/events" className={cn("nav-link", isActive('/events') && "nav-link-active")}>
            Events
          </Link>
          <Link to="/feed" className={cn("nav-link", isActive('/feed') && "nav-link-active")}>
            Feed
          </Link>
          <Link to="/analyst" className={cn("nav-link", isActive('/analyst') && "nav-link-active")}>
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
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-background z-40 animate-fade-in">
          <div className="p-6 flex flex-col space-y-6">
            <Link to="/" className={cn("text-lg font-medium", isActive('/') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/network" className={cn("text-lg font-medium", isActive('/network') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Network
            </Link>
            <Link to="/jobs" className={cn("text-lg font-medium", isActive('/jobs') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Jobs
            </Link>
            <Link to="/events" className={cn("text-lg font-medium", isActive('/events') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Events
            </Link>
            <Link to="/feed" className={cn("text-lg font-medium", isActive('/feed') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Feed
            </Link>
            <Link to="/analyst" className={cn("text-lg font-medium", isActive('/analyst') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
              Analyst
            </Link>
            <Link to="/profile" className={cn("text-lg font-medium", isActive('/profile') && "text-primary")} onClick={() => setIsMobileMenuOpen(false)}>
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