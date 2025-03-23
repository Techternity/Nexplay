
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-40 md:pb-24">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(90,216,255,0.05),transparent_60%)]"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
          <div className="space-y-3 animate-slide-up">
            <div className="inline-block rounded-full px-3 py-1 text-sm bg-primary/10 text-primary font-medium mb-4">
              Revolutionizing Athlete Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              The Professional Network for
              <span className="text-primary ml-2">Indian Athletes</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-6">
              Connect, collaborate, and excel in your sporting career with our comprehensive athlete management platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fade-in [animation-delay:200ms]">
            <Link to="/auth">
              <Button size="lg" className="min-w-[160px] font-medium">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="min-w-[160px] font-medium">
              Learn More
            </Button>
          </div>
          
          <div className="w-full max-w-3xl mx-auto mt-8 relative animate-fade-in [animation-delay:400ms]">
            <div className="aspect-[16/9] overflow-hidden rounded-xl glass-card shadow-xl">
              <div className="bg-gradient-to-b from-primary/5 to-primary/10 w-full h-full flex items-center justify-center">
                <div className="text-foreground/70 text-sm">
                  Platform Preview Coming Soon
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -left-4 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-6 animate-fade-in [animation-delay:600ms]">
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-muted-foreground text-sm">Athletes</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">2k+</p>
              <p className="text-muted-foreground text-sm">Coaches</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-muted-foreground text-sm">Organizations</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">28</p>
              <p className="text-muted-foreground text-sm">Sports</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
