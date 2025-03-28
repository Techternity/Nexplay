import { Button } from '@/components/ui/button';
import { MapPin, Trophy, Calendar } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  sport: string;
  experience: string;
  stats: {
    connections: number;
    endorsements: number;
    events: number;
  };
  isConnected: boolean;
  onChase?: () => void; // Add onChase prop
}

const ProfileCard = ({
  name,
  title,
  location,
  sport,
  experience,
  stats,
  isConnected,
  onChase,
}: ProfileCardProps) => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          {/* Placeholder for profile picture */}
          const profilePicUrl = ''; // Declare and initialize the profilePicUrl variable
          <img
            src={profilePicUrl || '/default-profile.png'} // Use a default image if profilePicUrl is empty
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{sport}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>{experience}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{stats.connections} connections</span>
        </div>
      </div>

      <div className="flex gap-2">
        {isConnected ? (
          <Button variant="outline" className="flex-1" disabled>
            Chasing
          </Button>
        ) : (
          <Button className="flex-1" onClick={onChase}>
            Chase
          </Button>
        )}
        <Button variant="outline" className="flex-1">
          Message
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;