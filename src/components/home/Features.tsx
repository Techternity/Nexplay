
import { Activity, Trophy, Users, Calendar, LineChart, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => (
  <div className={cn(
    "glass-card rounded-xl p-6 transition-all duration-300 hover-scale",
    className
  )}>
    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export const Features = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="features">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(90,216,255,0.05),transparent_60%)]"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All-in-One Athlete Management
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform provides comprehensive tools designed to elevate your sporting career through every stage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in [animation-delay:200ms]">
          <FeatureCard
            title="Performance Tracking"
            description="Monitor and analyze your athletic performance with advanced metrics and visualizations."
            icon={<Activity className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:100ms]"
          />
          
          <FeatureCard
            title="Career Development"
            description="Access resources and guidance to navigate your sporting career path effectively."
            icon={<Trophy className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:200ms]"
          />
          
          <FeatureCard
            title="Networking"
            description="Connect with coaches, scouts, teams, and fellow athletes to expand your opportunities."
            icon={<Users className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:300ms]"
          />
          
          <FeatureCard
            title="Event Management"
            description="Discover, register for, and manage your participation in sporting events across the country."
            icon={<Calendar className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:400ms]"
          />
          
          <FeatureCard
            title="Data Analytics"
            description="Leverage insights from your training and competition data to optimize performance."
            icon={<LineChart className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:500ms]"
          />
          
          <FeatureCard
            title="Recognition & Achievements"
            description="Showcase your accomplishments and gain visibility among sports organizations."
            icon={<Award className="h-6 w-6" />}
            className="animate-fade-in [animation-delay:600ms]"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
