import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
import React from "react";

// Define the Feed Post data type
interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  imageBase64?: string;
  videoBase64?: string;
  timestamp: any;
  likes: string[];
  congratulates: string[];
  comments: { userId: string; userName: string; text: string; userProfilePic: string }[];
  shares: number;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center text-red-500 py-4">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const Feed = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [newPostVideo, setNewPostVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
  const [userName, setUserName] = useState<string>("User");
  const [showPlusOne, setShowPlusOne] = useState<{ [key: string]: boolean }>({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const userProfilePic = user ? localStorage.getItem(`profilePic_${user.uid}`) || "" : "";

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      try {
        if (user.displayName) {
          setUserName(user.displayName);
          return;
        }
        const storedName = localStorage.getItem(`userName_${user.uid}`);
        if (storedName) {
          setUserName(storedName);
          return;
        }
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const name = userDoc.data().name || "User";
          setUserName(name);
          localStorage.setItem(`userName_${user.uid}`, name);
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
        setUserName("User");
      }
    };

    if (loading) return; // Wait until loading is false
    if (user) {
      fetchUserName();
      fetchPosts();
      fetchFollowing();
    }
  }, [user, loading]);

  useEffect(() => {
    if (newPostImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(newPostImage);
    } else {
      setImagePreview(null);
    }
  }, [newPostImage]);

  useEffect(() => {
    if (newPostVideo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(newPostVideo);
    } else {
      setVideoPreview(null);
    }
  }, [newPostVideo]);

  const fetchPosts = async () => {
    if (!user) {
      console.log("No user is authenticated. Cannot fetch posts.");
      setError("Please sign in to view posts.");
      return;
    }
    console.log("Fetching posts for user:", user.uid);
    try {
      const postsCollection = collection(db, "posts");
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map((doc) => {
        const data = doc.data();
        const postId = doc.id;
        const imageBase64 = localStorage.getItem(`postImage_${postId}`) || "";
        const videoBase64 = localStorage.getItem(`postVideo_${postId}`) || "";
        return {
          id: postId,
          userId: data.userId,
          userName: data.userName,
          userProfilePic: localStorage.getItem(`profilePic_${data.userId}`) || "",
          text: data.text,
          imageBase64: imageBase64 || undefined,
          videoBase64: videoBase64 || undefined,
          timestamp: data.timestamp,
          likes: data.likes || [],
          congratulates: data.congratulates || [],
          comments: (data.comments || []).filter(comment => comment && comment.userName && comment.text),
          shares: data.shares || 0,
        } as FeedPost;
      });
      setPosts(postList.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts: " + err.message);
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const followingList: string[] = userDoc.data().following || [];
        const followingMap: { [key: string]: boolean } = {};
        followingList.forEach((userId: string) => {
          if (userId) {
            followingMap[userId] = true;
          }
        });
        setFollowing(followingMap);
      } else {
        console.log("User document does not exist.");
        setFollowing({});
      }
    } catch (err) {
      console.error("Error fetching following list:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.name === "image") {
        setNewPostImage(file);
      } else if (e.target.name === "video") {
        setNewPostVideo(file);
      }
    }
  };

  const triggerImageInput = () => imageInputRef.current?.click();
  const triggerVideoInput = () => videoInputRef.current?.click();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to post");
      return;
    }
    if (!newPostText.trim() && !newPostImage && !newPostVideo) {
      setError("Please add some text, an image, or a video to post");
      return;
    }

    setPosting(true);
    setError("");

    try {
      const postsCollection = collection(db, "posts");
      const newPostRef = await addDoc(postsCollection, {
        userId: user.uid,
        userName: userName,
        text: newPostText,
        timestamp: serverTimestamp(),
        likes: [],
        congratulates: [],
        comments: [],
        shares: 0,
      });

      const postId = newPostRef.id;

      if (newPostImage && imagePreview) {
        localStorage.setItem(`postImage_${postId}`, imagePreview);
      }
      if (newPostVideo && videoPreview) {
        localStorage.setItem(`postVideo_${postId}`, videoPreview);
      }

      const newPost: FeedPost = {
        id: postId,
        userId: user.uid,
        userName: userName,
        userProfilePic: userProfilePic,
        text: newPostText,
        imageBase64: imagePreview || undefined,
        videoBase64: videoPreview || undefined,
        timestamp: { seconds: Math.floor(Date.now() / 1000) },
        likes: [],
        congratulates: [],
        comments: [],
        shares: 0,
      };
      setPosts([newPost, ...posts]);

      setNewPostText("");
      setNewPostImage(null);
      setNewPostVideo(null);
      setImagePreview(null);
      setVideoPreview(null);
    } catch (err) {
      console.error("Error posting:", err);
      setError("Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      localStorage.removeItem(`postImage_${postId}`);
      localStorage.removeItem(`postVideo_${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const hasLiked = post.likes.includes(user.uid);
      const newLikes = hasLiked
        ? post.likes.filter((id) => id !== user.uid)
        : [...post.likes, user.uid];
      await updateDoc(postRef, { likes: newLikes });
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)));
    }
  };

  const handleCongratulate = async (postId: string) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const hasCongratulated = post.congratulates.includes(user.uid);
      const newCongratulates = hasCongratulated
        ? post.congratulates.filter((id) => id !== user.uid)
        : [...post.congratulates, user.uid];
      await updateDoc(postRef, { congratulates: newCongratulates });
      setPosts(posts.map((p) => (p.id === postId ? { ...p, congratulates: newCongratulates } : p)));
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const newComment = {
        userId: user.uid,
        userName: userName,
        text: commentText[postId],
        userProfilePic: userProfilePic,
      };
      const updatedComments = [...post.comments, newComment];
      await updateDoc(postRef, { comments: updatedComments });
      setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p)));
      setCommentText({ ...commentText, [postId]: "" });
    }
  };

  const handleDeleteComment = async (postId: string, commentIndex: number) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const updatedComments = post.comments.filter((_, index) => index !== commentIndex);
      await updateDoc(postRef, { comments: updatedComments });
      setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p)));
    }
  };

  const handleShare = async (postId: string) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const newShares = post.shares + 1;
      await updateDoc(postRef, { shares: newShares });
      setPosts(posts.map((p) => (p.id === postId ? { ...p, shares: newShares } : p)));
      alert("Post shared! (This is a placeholder for actual sharing functionality)");
    }
  };

  const handleChase = async (postUserId: string, postId: string) => {
    if (!user || postUserId === user.uid) return;
    const userDocRef = doc(db, "users", user.uid);
    const targetUserDocRef = doc(db, "users", postUserId);
    const isFollowing = following[postUserId] || false;

    try {
      if (isFollowing) {
        await updateDoc(userDocRef, {
          following: arrayRemove(postUserId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayRemove(user.uid),
        });
        setFollowing((prev) => ({ ...prev, [postUserId]: false }));
      } else {
        await updateDoc(userDocRef, {
          following: arrayUnion(postUserId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayUnion(user.uid),
        });
        setFollowing((prev) => ({ ...prev, [postUserId]: true }));
        setShowPlusOne((prev) => ({ ...prev, [postId]: true }));
        setTimeout(() => {
          setShowPlusOne((prev) => ({ ...prev, [postId]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!loading && !user) {
    return (
      <div className="text-center text-gray-600 pt-20">
        Please sign in to view the feed. <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4">
          {user ? (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  {userProfilePic ? (
                    <img
                      src={userProfilePic}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Photo
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Start a post..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={triggerImageInput}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Photo
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerVideoInput}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                    Video
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={handlePost}
                  disabled={posting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
              {(imagePreview || videoPreview) && (
                <div className="mt-4 flex space-x-4">
                  {imagePreview && (
                    <div className="max-w-full max-h-64 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Image preview" className="w-full h-auto object-contain" />
                    </div>
                  )}
                  {videoPreview && (
                    <div className="max-w-full max-h-64 rounded-lg overflow-hidden">
                      <video src={videoPreview} className="w-full h-auto object-contain" controls />
                    </div>
                  )}
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            <div className="text-center text-gray-600 mb-6">
              Please sign in to share your sports moments.
            </div>
          )}

          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-center text-gray-600">No posts yet. Be the first to share!</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {post.userProfilePic ? (
                          <img
                            src={post.userProfilePic}
                            alt="User profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Photo
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{post.userName}</h3>
                        <p className="text-sm text-gray-500">
                          {post.timestamp?.seconds
                            ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user && post.userId === user.uid && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                      {user && post.userId !== user.uid && (
                        <button
                          onClick={() => handleChase(post.userId, post.id)}
                          className={`px-3 py-1 rounded-md text-sm font-semibold ${
                            following[post.userId] ? "bg-gray-200 text-gray-600" : "bg-blue-600 text-white"
                          } hover:bg-opacity-80 transition-colors`}
                        >
                          {following[post.userId] ? "Chasing" : "Chase"}
                        </button>
                      )}
                    </div>
                  </div>
                  {showPlusOne[post.id] && (
                    <div className="absolute top-2 right-2 text-green-500 font-bold text-lg animate-bounce">
                      +1
                    </div>
                  )}
                  <p className="text-gray-700 mb-4">{post.text}</p>
                  {post.imageBase64 && (
                    <div className="mb-4">
                      <img
                        src={post.imageBase64}
                        alt="Post image"
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {post.videoBase64 && (
                    <div className="mb-4">
                      <video
                        src={post.videoBase64}
                        className="w-full max-h-96 object-contain rounded-lg"
                        controls
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        Like ({post.likes.length})
                      </button>
                      <button
                        onClick={() => handleCongratulate(post.id)}
                        className="flex items-center text-gray-600 hover:text-green-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 11l7-7 7 7M5 19l7-7 7 7"
                          />
                        </svg>
                        Congratulate ({post.congratulates.length})
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Comment ({post.comments.length})
                      </button>
                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share ({post.shares})
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {comment.userProfilePic ? (
                            <img
                              src={comment.userProfilePic}
                              alt="Commenter profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {comment.userName ? comment.userName[0] : "A"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 bg-gray-100 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">{comment.userName || "Anonymous"}</p>
                            {user && comment.userId === user.uid && (
                              <button
                                onClick={() => handleDeleteComment(post.id, index)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{comment.text || "No comment text"}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {userProfilePic ? (
                          <img
                            src={userProfilePic}
                            alt="User profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {userName?.[0] || "A"}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [post.id]: e.target.value })
                        }
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Feed;