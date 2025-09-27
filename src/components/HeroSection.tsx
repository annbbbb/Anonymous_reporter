import { Shield, Eye, Lock, Brain, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-20">
      <div className="container mx-auto text-center text-white">
        {/* Shield Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading">
          Report Issues
          <br />
          <span className="text-white/90">Safely & Anonymously</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
          Describe situations in your workplace, community, or environment using natural language. 
          Our AI helps you create professional reports while keeping your identity completely protected.
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-white/90">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Completely Anonymous</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Brain className="w-5 h-5" />
            <span className="font-medium">AI-Powered Protection</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg"
            className="text-lg px-8 py-4 h-auto"
            onClick={() => {
              const formSection = document.getElementById('report-form');
              formSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Your Anonymous Report
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-4 h-auto bg-white/10 hover:bg-white/20 border-white/30 text-white"
            onClick={() => navigate('/reports')}
          >
            <FileText className="w-5 h-5 mr-2" />
            View Reports
          </Button>
          
          <a href="tel:911" className="inline-block">
            <Button 
              variant="destructive" 
              size="lg"
              className="text-lg px-8 py-4 h-auto bg-red-600 hover:bg-red-700 border border-red-500 shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency Call 911
            </Button>
          </a>
        </div>
        
        <p className="text-sm text-white/60 mt-4 max-w-2xl mx-auto">
          For immediate emergencies requiring police, fire, or medical response, call 911 directly. 
          Use the report form above for non-emergency incidents that need documentation.
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};