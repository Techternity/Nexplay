
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, Send, Image, Video, Award, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';

// Post interface
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
}

// Mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Mithali Raj",
      role: "Cricket Player | Former Captain, Indian Women's Cricket Team",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
    },
    content: "Excited to announce that I'll be conducting a special batting masterclass for young female cricketers next month in Bangalore! Stay tuned for registration details. #CricketMasterclass #WomenInSports",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80",
    timestamp: "2 hours ago",
    likes: 348,
    comments: 42,
    shares: 18,
    tags: ["Cricket", "Training", "WomenInSports"]
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Neeraj Chopra",
      role: "Javelin Thrower | Olympic Gold Medalist",
      avatar: "https://images.unsplash.com/photo-1608681299041-cc19878f79f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    },
    content: "Just wrapped up an intense training session today. Preparing for the upcoming World Championships. The journey continues! 💪 #RoadToWorldChampionships #TrainingDay",
    video: "https://player.vimeo.com/external/414874259.sd.mp4?s=2ec9e41f16192e2c13b7c94a7e0fae70a5b5b4c1&profile_id=164&oauth2_token_id=57447761",
    timestamp: "6 hours ago",
    likes: 1245,
    comments: 189,
    shares: 76,
    tags: ["Athletics", "JavelinThrow", "Training"]
  },
  {
    id: "3",
    author: {
      id: "u3",
      name: "Dr. Rajat Sharma",
      role: "Sports Physiotherapist | Head of Rehabilitation, Sports Excellence Centre",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1634&q=80"
    },
    content: "I'll be hosting a webinar on 'Injury Prevention Strategies for Cricket Fast Bowlers' this Saturday at 6 PM IST. Free registration link in comments. #SportsPhysio #InjuryPrevention #CricketScience",
    timestamp: "1 day ago",
    likes: 215,
    comments: 32,
    shares: 45,
    tags: ["SportsScience", "Physiotherapy", "Cricket"]
  },
  {
    id: "4",
    author: {
      id: "u4",
      name: "Pullela Gopichand",
      role: "Chief National Coach | Badminton Association of India",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    },
    content: "Proud of our junior shuttlers who have just returned with 3 gold medals from the Asian Junior Championships! The future of Indian badminton looks bright. #FutureChamptions #IndianBadminton",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    timestamp: "2 days ago",
    likes: 876,
    comments: 64,
    shares: 37,
    tags: ["Badminton", "JuniorChamps", "Sports"]
  }
];

const Feed = () => {
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      console.log("Post submitted:", postContent);
      setPostContent("");
      // Here you would typically add the new post to your posts state
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Create post card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
                </Avatar>
                <div>
                  <div className="font-medium">Update your status</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <Textarea 
                placeholder="What's on your mind? Share updates, news, or insights..." 
                className="resize-none"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <Award className="h-4 w-4 mr-2" />
                  Achievement
                </Button>
              </div>
              <Button 
                size="sm" 
                disabled={!postContent.trim()}
                onClick={handlePostSubmit}
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </CardFooter>
          </Card>
          
          {/* Feed filters */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Posts feed */}
          <div className="space-y-6">
            {mockPosts.map(post => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <img src={post.author.avatar} alt={post.author.name} />
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">{post.author.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">{post.timestamp}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-4">{post.content}</p>
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                  {post.image && (
                    <div className="rounded-md overflow-hidden mb-4">
                      <img src={post.image} alt="Post attachment" className="w-full" />
                    </div>
                  )}
                  {post.video && (
                    <div className="rounded-md overflow-hidden mb-4">
                      <video 
                        src={post.video} 
                        controls 
                        className="w-full"
                        poster="https://images.unsplash.com/photo-1519766304817-4f37bda74b38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Share2 className="h-4 w-4 mr-1" /> {post.shares}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
