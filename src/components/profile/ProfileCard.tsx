
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, User, Award, Plus, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileStats {
  connections: number;
  endorsements: number;
  events: number;
}

interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  sport: string;
  experience: string;
  avatar?: string;
  banner?: string;
  achievements?: string[];
  stats: ProfileStats;
  isConnected?: boolean;
  isCurrentUser?: boolean;
}

export const ProfileCard = ({
  name,
  title,
  location,
  sport,
  experience,
  avatar,
  banner,
  achievements = [],
  stats,
  isConnected = false,
  isCurrentUser = false,
}: ProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConnect = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div 
      className="glass-card rounded-xl shadow-sm overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Image */}
      <div 
        className={cn(
          "h-40 w-full bg-gradient-to-r from-primary/20 to-primary/10 relative overflow-hidden transition-all duration-500",
          isHovered && "from-primary/30 to-primary/15"
        )}
      >
        {banner && (
          <img 
            src={banner} 
            alt="Profile banner" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Avatar */}
      <div className="relative px-6">
        <div className="absolute -top-12 left-6 rounded-full border-4 border-background bg-background shadow-sm overflow-hidden">
          <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12" />
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-6 pt-16">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-muted-foreground">{title}</p>
          
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="font-normal">
              {sport}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{experience}</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between py-3 border-t border-border/60">
          <div className="text-center">
            <p className="font-semibold">{stats.connections}</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{stats.endorsements}</p>
            <p className="text-xs text-muted-foreground">Endorsements</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{stats.events}</p>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {isCurrentUser ? (
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant={isConnected ? "outline" : "default"} 
                className="flex-1"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isConnected ? 'Connected' : 'Connect'}
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="flex items-center mb-2">
              <Award className="h-4 w-4 mr-1 text-primary" />
              <h4 className="text-sm font-semibold">Achievements</h4>
            </div>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
