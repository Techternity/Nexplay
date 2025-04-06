import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Users, CheckCircle, X, User, MapPin, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import MessageModal from '@/pages/MessageModal';

// Define the User Profile type
interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  profilePicUrl?: string;
  coverPhotoUrl: string;
  location: string;
  favoriteSports: string;
  playingExperience: string;
  chasers: string[];
  chasing: string[];
  chaseRequests: { fromUserId: string; fromUserName: string; timestamp: string }[];
}

const Network = () => {
  const [user, loading] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<
    { fromUserId: string; fromUserName: string; timestamp: string }[]
  >([]);
  const [chasers, setChasers] = useState<UserProfile[]>([]);
  const [error, setError] = useState('');
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();

  // State to store profile photos for all users
  const [profilePhotos, setProfilePhotos] = useState<{ [userId: string]: string | null }>({});

  // Function to get profile photo from localStorage
  const getProfilePhoto = (userId: string, profilePicUrl?: string): string | null => {
    if (profilePicUrl) {
      console.log(`Using profilePicUrl from Firestore for userId ${userId}: ${profilePicUrl}`);
      return profilePicUrl;
    }

    if (!userId) {
      console.error('userId is undefined or invalid');
      return null;
    }

    const possibleKeys = [
      `profilePhoto_${userId}`,
      `userPhoto_${userId}`,
      `photo_${userId}`,
      `profile_${userId}`,
    ];

    console.log('Possible keys:', possibleKeys);

    for (const key of possibleKeys) {
      const photo = localStorage.getItem(key);
      console.log(`Checking key in localStorage: ${key}`);
      console.log(`Profile photo value: ${photo}`);
      if (photo && typeof photo === 'string') {
        console.log(`Found profile photo for userId ${userId} with key ${key} in localStorage`);
        return photo;
      }
    }

    console.log(`No profile photo found for userId ${userId}`);
    return null;
  };

  // Fetch all users and the current user's data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList: UserProfile[] = userSnapshot.docs.map((doc) => {
          const data = doc.data();
          const userProfile = {
            id: doc.id,
            name: data.name || 'Anonymous',
            tagline: data.tagline || '',
            profilePicUrl: data.profilePicUrl || '',
            coverPhotoUrl: data.coverPhotoUrl || '',
            location: data.location || '',
            favoriteSports: data.favoriteSports || '',
            playingExperience: data.playingExperience || '',
            chasers: data.chasers || [],
            chasing: data.chasing || [],
            chaseRequests: data.chaseRequests || [],
          };
          console.log(`Fetched user: ${userProfile.name}, userId: ${userProfile.id}`);
          return userProfile;
        });

        const otherUsers = userList.filter((u) => u.id !== user.uid);
        setAllUsers(otherUsers);
        setFilteredUsers(otherUsers);

        const currentUserRef = doc(db, 'users', user.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        if (currentUserSnap.exists()) {
          const currentUserData = currentUserSnap.data();
          setPendingRequests(currentUserData.chaseRequests || []);

          const chasingIds = currentUserData.chasing || [];
          const chasingUsers = userList.filter((u) => chasingIds.includes(u.id));
          setChasers(chasingUsers);

          const sent = otherUsers
            .filter((u) =>
              (u.chaseRequests || []).some((req: any) => req.fromUserId === user.uid)
            )
            .map((u) => u.id);
          setSentRequests(sent);
        }

        // Load profile photos for all users
        const photos: { [userId: string]: string | null } = {};
        userList.forEach((u) => {
          photos[u.id] = getProfilePhoto(u.id, u.profilePicUrl);
        });
        setProfilePhotos(photos);
      } catch (err) {
        console.error('Error fetching network data:', err);
        setError('Failed to load network data');
      }
    };

    if (!loading && user) {
      fetchData();
    }
  }, [user, loading]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.favoriteSports.toLowerCase().includes(query) ||
          u.location.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, allUsers]);

  // Handle sending a chase request
  const handleChaseRequest = async (targetUserId: string, targetUserName: string) => {
    if (!user) {
      setError('Please sign in to chase users');
      return;
    }

    try {
      const targetUserRef = doc(db, 'users', targetUserId);
      const currentUserRef = doc(db, 'users', user.uid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (!currentUserSnap.exists()) {
        setError('Current user data not found');
        return;
      }

      const currentUserData = currentUserSnap.data();
      const senderName = currentUserData.name || 'Anonymous';

      const targetUserSnap = await getDoc(targetUserRef);
      if (!targetUserSnap.exists()) {
        setError('Target user does not exist');
        return;
      }

      const targetUserData = targetUserSnap.data();
      const existingRequest = (targetUserData?.chaseRequests || []).find(
        (req: any) => req.fromUserId === user.uid
      );
      const alreadyChasing = (targetUserData?.chasers || []).includes(user.uid);

      if (existingRequest || alreadyChasing) {
        setError('You have already sent a chase request or are already chasing this user');
        return;
      }

      await updateDoc(targetUserRef, {
        chaseRequests: arrayUnion({
          fromUserId: user.uid,
          fromUserName: senderName,
          timestamp: new Date().toISOString(),
        }),
      });

      setSentRequests((prev) => [...prev, targetUserId]);
      setError('');
      alert('Chase request sent!');
    } catch (err) {
      console.error('Error sending chase request:', err);
      setError('Failed to send chase request');
    }
  };

  // Handle accepting a chase request
  const handleAcceptRequest = async (fromUserId: string) => {
    if (!user) return;

    try {
      const currentUserRef = doc(db, 'users', user.uid);
      const fromUserRef = doc(db, 'users', fromUserId);

      const updatedRequests = pendingRequests.filter((req) => req.fromUserId !== fromUserId);
      await updateDoc(currentUserRef, {
        chaseRequests: updatedRequests,
        chasers: arrayUnion(fromUserId),
      });

      await updateDoc(fromUserRef, {
        chasing: arrayUnion(user.uid),
      });

      setPendingRequests(updatedRequests);
      setSentRequests((prev) => prev.filter((id) => id !== fromUserId));

      const fromUserSnap = await getDoc(fromUserRef);
      if (fromUserSnap.exists()) {
        const fromUserData = fromUserSnap.data();
        const newChaser: UserProfile = {
          id: fromUserId,
          name: fromUserData.name || 'Anonymous',
          tagline: fromUserData.tagline || '',
          profilePicUrl: fromUserData.profilePicUrl || '',
          coverPhotoUrl: fromUserData.coverPhotoUrl || '',
          location: fromUserData.location || '',
          favoriteSports: fromUserData.favoriteSports || '',
          playingExperience: fromUserData.playingExperience || '',
          chasers: fromUserData.chasers || [],
          chasing: fromUserData.chasing || [],
          chaseRequests: fromUserData.chaseRequests || [],
        };
        setChasers((prev) => [...prev, newChaser]);
      }
    } catch (err) {
      console.error('Error accepting chase request:', err);
      setError('Failed to accept chase request');
    }
  };

  // Handle rejecting a chase request
  const handleRejectRequest = async (fromUserId: string) => {
    if (!user) return;

    try {
      const currentUserRef = doc(db, 'users', user.uid);

      const updatedRequests = pendingRequests.filter((req) => req.fromUserId !== fromUserId);
      await updateDoc(currentUserRef, {
        chaseRequests: updatedRequests,
      });

      setPendingRequests(updatedRequests);
      setSentRequests((prev) => prev.filter((id) => id !== fromUserId));
    } catch (err) {
      console.error('Error rejecting chase request:', err);
      setError('Failed to reject chase request');
    }
  };

  // Handle unchasing a user
  const handleUnchase = async (targetUserId: string) => {
    if (!user) return;

    try {
      const currentUserRef = doc(db, 'users', user.uid);
      const targetUserRef = doc(db, 'users', targetUserId);

      await updateDoc(currentUserRef, {
        chasing: arrayRemove(targetUserId),
      });

      await updateDoc(targetUserRef, {
        chasers: arrayRemove(user.uid),
      });

      setChasers((prev) => prev.filter((u) => u.id !== targetUserId));
    } catch (err) {
      console.error('Error unchasing user:', err);
      setError('Failed to unchase user');
    }
  };

  // Handle opening the message modal
  const handleOpenMessageModal = (recipientId: string, recipientName: string) => {
    setSelectedRecipient({ id: recipientId, name: recipientName });
    setIsMessageModalOpen(true);
  };

  // Handle closing the message modal
  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedRecipient(null);
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center text-gray-600 pt-24">
          Please sign in to view your network.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Network</h1>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, sport, or location"
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <Tabs defaultValue="people" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mb-8">
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="chasers">My Chasers</TabsTrigger>
              <TabsTrigger value="requests" className="relative">
                Requests
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="people" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                People you may know
              </h2>

              {filteredUsers.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((person) => {
                    const isConnected = person.chasers?.includes(user.uid) || false;
                    const isInvited = sentRequests.includes(person.id);
                    const buttonText = isConnected ? 'Chasing' : isInvited ? 'Invited' : 'Chase';
                    const profilePhoto = profilePhotos[person.id];

                    return (
                      <div key={person.id} className="animate-fade-in [animation-delay:100ms]">
                        <div className="glass-card rounded-xl p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Navigating to profile page for user: ${person.name}, userId: ${person.id}`);
                                navigate(`/profile/${person.id}`);
                              }}
                            >
                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt={person.name}
                                  className="h-full w-full rounded-full object-cover"
                                  onError={(e) => {
                                    console.error(`Failed to load image for ${person.name}`);
                                    e.currentTarget.src = '/default-profile.png';
                                  }}
                                />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{person.name}</h3>
                              <p className="text-sm text-muted-foreground">{person.tagline}</p>
                              <p className="text-xs text-muted-foreground mt-1">{person.favoriteSports}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{person.location || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              <span>{person.playingExperience || 'No experience listed'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{(person.chasers?.length || 0) + (person.chasing?.length || 0)} connections</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {isConnected ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleUnchase(person.id)}
                              >
                                Chasing
                              </Button>
                            ) : (
                              <Button
                                className={cn(
                                  'flex-1',
                                  isInvited ? 'bg-gray-400' : 'bg-blue-500 text-white'
                                )}
                                onClick={() => handleChaseRequest(person.id, person.name)}
                                disabled={isInvited}
                              >
                                {buttonText}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleOpenMessageModal(person.id, person.name)}
                            >
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="chasers" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">My Chasers</h2>

              {chasers.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">You are not chasing anyone yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chasers.map((person) => {
                    const isConnected = true;
                    const isInvited = sentRequests.includes(person.id);
                    const buttonText = isConnected ? 'Chasing' : isInvited ? 'Invited' : 'Chase';
                    const profilePhoto = profilePhotos[person.id];

                    return (
                      <div key={person.id} className="animate-fade-in [animation-delay:100ms]">
                        <div className="glass-card rounded-xl p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Navigating to profile page for user: ${person.name}, userId: ${person.id}`);
                                navigate(`/profile/${person.id}`);
                              }}
                            >
                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt={person.name}
                                  className="h-full w-full rounded-full object-cover"
                                  onError={(e) => {
                                    console.error(`Failed to load image for ${person.name}`);
                                    e.currentTarget.src = '/default-profile.png';
                                  }}
                                />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{person.name}</h3>
                              <p className="text-sm text-muted-foreground">{person.tagline}</p>
                              <p className="text-xs text-muted-foreground mt-1">{person.favoriteSports}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{person.location || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              <span>{person.playingExperience || 'No experience listed'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{(person.chasers?.length || 0) + (person.chasing?.length || 0)} connections</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {isConnected ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleUnchase(person.id)}
                              >
                                Chasing
                              </Button>
                            ) : (
                              <Button
                                className={cn(
                                  'flex-1',
                                  isInvited ? 'bg-gray-400' : 'bg-blue-500 text-white'
                                )}
                                onClick={() => handleChaseRequest(person.id, person.name)}
                                disabled={isInvited}
                              >
                                {buttonText}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleOpenMessageModal(person.id, person.name)}
                            >
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Pending chase requests</h2>

              {pendingRequests.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">No pending chase requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in [animation-delay:100ms]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{request.fromUserName}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested on {new Date(request.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          className="flex-1 md:flex-initial"
                          onClick={() => handleRejectRequest(request.fromUserId)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Ignore
                        </Button>
                        <Button
                          className="flex-1 md:flex-initial"
                          onClick={() => handleAcceptRequest(request.fromUserId)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Message Modal */}
      {selectedRecipient && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          recipientId={selectedRecipient.id}
          recipientName={selectedRecipient.name}
        />
      )}
    </div>
  );
};

export default Network;