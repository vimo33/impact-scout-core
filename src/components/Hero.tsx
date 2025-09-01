import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI Research Platform" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Trusted by Swiss Family Offices
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            AI-Driven Research
            <span className="block text-accent">Intelligence</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Unlock sophisticated market insights and investment opportunities with our proprietary AI platform designed for elite family offices.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="accent" size="xl" className="group">
              Access Platform
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="elegant" size="xl">
              Schedule Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                $2.5B+ AUM
              </h3>
              <p className="text-primary-foreground/70 text-center">
                Assets under management tracked
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                50+ Families
              </h3>
              <p className="text-primary-foreground/70 text-center">
                Swiss family offices served
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                Bank-Grade
              </h3>
              <p className="text-primary-foreground/70 text-center">
                Security & compliance
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 z-5 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary-foreground rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-accent rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;