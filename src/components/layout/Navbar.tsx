import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth, db } from '@/firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<{ senderId: string; senderName: string }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unread messages in real-time
  useEffect(() => {
    if (!user || loading) return;

    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribeConversations = onSnapshot(conversationsQuery, (snapshot) => {
      const unread: { senderId: string; senderName: string }[] = [];
      const messagePromises: Promise<void>[] = [];

      snapshot.docs.forEach((convDoc) => {
        const conversationId = convDoc.id;
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));

        messagePromises.push(
          new Promise((resolve) => {
            onSnapshot(messagesQuery, async (msgSnapshot) => {
              for (const msgDoc of msgSnapshot.docs) {
                const msgData = msgDoc.data();
                // Assume 'read' field exists; if not, you'll need to add it when sending messages
                if (msgData.senderId !== user.uid && !msgData.read) {
                  // Fetch sender's name (assuming a 'users' collection with uid and displayName)
                  const senderDoc = await getDoc(doc(db, 'users', msgData.senderId));
                  const senderName = senderDoc.exists() ? senderDoc.data().displayName || 'Unknown' : 'Unknown';
                  unread.push({ senderId: msgData.senderId, senderName });
                }
              }
              resolve();
            });
          })
        );
      });

      Promise.all(messagePromises).then(() => {
        setUnreadMessages(unread);
      });
    });

    return () => unsubscribeConversations();
  }, [user, loading]);

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
        <Link to="/" className="flex items-center">
          <img 
            src="/images/nexplay_w.png" 
            alt="NextPlay Logo" 
            className="h-10 md:h-12 transition-transform hover:scale-105"
          />
        </Link>
        
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
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-muted-foreground hover:text-foreground"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadMessages.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                  )}
                </Button>
                {isDropdownOpen && unreadMessages.length > 0 && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-white">New Messages</h3>
                      <ul className="mt-2 space-y-2">
                        {unreadMessages.map((msg, index) => (
                          <li key={index} className="text-gray-300 text-sm">
                            <Link 
                              to={`/messages?recipientId=${msg.senderId}`} 
                              className="hover:text-white"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              New message from {msg.senderName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
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
            {user && (
              <div className="text-lg font-medium text-gray-300">
                Notifications: {unreadMessages.length > 0 ? (
                  unreadMessages.map((msg, index) => (
                    <Link 
                      key={index} 
                      to={`/messages?recipientId=${msg.senderId}`} 
                      className="block text-blue-400 mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      New message from {msg.senderName}
                    </Link>
                  ))
                ) : (
                  <span>No new messages</span>
                )}
              </div>
            )}
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