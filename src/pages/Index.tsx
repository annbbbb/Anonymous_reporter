import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { ReportForm } from "@/components/ReportForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustSection />
      <ReportForm />
    </div>
  );
};

export default Index;