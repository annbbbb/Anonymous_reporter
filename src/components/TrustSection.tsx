import { Shield, Eye, Zap, Clock, Building, CheckCircle } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    label: "256-bit AES",
    title: "Military-Grade Encryption",
    description: "End-to-end encryption ensures your reports are secure from submission to resolution."
  },
  {
    icon: Eye,
    label: "Anonymous",
    title: "Zero Knowledge Architecture", 
    description: "We cannot see who you are, even if we wanted to. Complete anonymity by design."
  },
  {
    icon: Zap,
    label: "Smart AI",
    title: "AI-Powered Processing",
    description: "Advanced AI helps structure your natural language into professional reports."
  },
  {
    icon: Clock,
    label: "Always On", 
    title: "24/7 Secure Processing",
    description: "Reports are processed immediately and routed to appropriate channels automatically."
  },
  {
    icon: Building,
    label: "Enterprise",
    title: "Trusted by Organizations",
    description: "Used by companies, institutions, and agencies worldwide for ethical reporting."
  },
  {
    icon: CheckCircle,
    label: "Compliant",
    title: "Global Compliance",
    description: "Meets international standards for whistleblower protection and data privacy."
  }
];

export const TrustSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            Why Trust Anonymous Reporter?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with privacy-first technology and industry-leading security standards 
            to protect your identity and ensure your voice is heard.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:shadow-soft transition-all duration-300 hover:border-primary/20"
            >
              {/* Icon with Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {feature.label}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-primary">
              Over 50,000 anonymous reports processed securely
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};