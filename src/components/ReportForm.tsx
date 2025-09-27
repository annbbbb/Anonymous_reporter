import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Send, MapPin, Camera, X } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
import { createReport } from "@/services/reportService";
import { CreateReportData } from "@/types/report";
import { mockLocations } from "@/data/locations";
import { analyzeReportContent, determinePriority, generateImprovementSuggestions } from "@/services/aiService";

// Image compression function
const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original file
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const reportCategories = [
  { value: "workplace", label: "Workplace Issues", description: "Harassment, discrimination, safety violations, ethical concerns" },
  { value: "financial", label: "Financial Misconduct", description: "Fraud, embezzlement, accounting irregularities, corruption" },
  { value: "environmental", label: "Environmental Issues", description: "Pollution, waste mismanagement, safety hazards" },
  { value: "legal", label: "Legal Violations", description: "Regulatory non-compliance, illegal activities" },
  { value: "safety", label: "Safety Concerns", description: "Health risks, security breaches, dangerous conditions" },
  { value: "other", label: "Other Issues", description: "Any other concerns that need to be reported" }
];

export const ReportForm = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [attachedPhotos, setAttachedPhotos] = useState<File[]>([]);
  const [sendToAuthorities, setSendToAuthorities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isImage) {
        toast({
          title: "Invalid File Type",
          description: "Please select only image files (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: "Please select images smaller than 5MB",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setAttachedPhotos(prev => [...prev, ...validFiles].slice(0, 2)); // Max 2 photos
  };

  const removePhoto = (index: number) => {
    setAttachedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // AI Analysis function
  const analyzeDescription = async (text: string) => {
    if (text.length < 20) {
      setAiAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeReportContent(text);
      const priority = determinePriority(analysis);
      const suggestions = generateImprovementSuggestions(analysis);
      
      setAiAnalysis({
        ...analysis,
        priority,
        suggestions
      });
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Debounced analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (description.length > 20) {
        analyzeDescription(description);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const errors = [];
    
    if (!category) {
      errors.push("Select a problem category");
    }
    
    if (!description.trim() || description.length < 20) {
      errors.push("Description must be at least 20 characters");
    }
    
    if (!postalCode.trim()) {
      errors.push("Select incident location");
    }

    if (errors.length > 0) {
      toast({
        title: "Missing Information",
        description: errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find selected location details
      const selectedLocation = mockLocations.find(loc => 
        loc.postalCode === postalCode || 
        loc.address === postalCode ||
        loc.name === postalCode
      );

      const reportData: CreateReportData = {
        category,
        description,
        location: {
          postalCode,
          name: selectedLocation?.name,
          address: selectedLocation?.address,
          coordinates: selectedLocation?.coordinates,
        },
        photos: attachedPhotos,
        sendToAuthorities,
      };

      const newReport = await createReport(reportData);
      
      if (sendToAuthorities) {
        toast({
          title: "✅ Report Sent to Authorities",
          description: "Your anonymous report has been sent to local authorities and relevant agencies. Redirecting to view all reports...",
        });
      } else {
        toast({
          title: "✅ Report Submitted Successfully",
          description: "Your anonymous report has been securely processed and submitted. Redirecting to view all reports...",
        });
      }
      
      // Reset form
      setCategory("");
      setDescription("");
      setPostalCode("");
      setAttachedPhotos([]);
      setSendToAuthorities(false);
      setAiAnalysis(null);
      
      // Redirect to reports page after 2 seconds
      setTimeout(() => {
        window.location.href = '/reports';
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Błąd wysyłania",
        description: "Wystąpił błąd podczas wysyłania raportu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            Submit Your Anonymous Report
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simply describe the situation in your own words. Our AI will help structure your report professionally.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 shadow-strong border-0 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Anonymous Reporting Form</h3>
                <p className="text-muted-foreground">
                  All submissions are encrypted and processed without storing any identifying information.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-lg font-semibold">
                  What type of issue are you reporting?
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="py-4">
                        <div>
                          <div className="font-semibold">{cat.label}</div>
                          <div className="text-sm text-muted-foreground">{cat.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Incident Location
                </label>
                <LocationSearch
                  value={postalCode}
                  onChange={setPostalCode}
                  placeholder="Search for incident location..."
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Search and select the location where the incident occurred. This helps route your report to the appropriate authorities.
                </p>
              </div>

              {/* Photo Attachment */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Attach Photos (Optional)
                </label>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Upload Incident Photos</p>
                      <p className="text-sm text-muted-foreground">
                        Click to select images or drag and drop (Max 2 photos, 5MB each)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Photo Preview */}
                {attachedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {attachedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Incident photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-lg font-semibold">
                  Describe the situation in detail
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible about the situation, including dates, locations, people involved (if any), and any other relevant information. Remember, this is completely anonymous and secure."
                  className="min-h-[200px] text-lg leading-relaxed resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum 20 characters. Your report will be processed by AI to ensure professionalism while maintaining your anonymity.
                </p>
                
                {/* AI Analysis Panel */}
                {isAnalyzing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="loading-spin w-4 h-4"></div>
                      <span className="text-sm text-blue-700">AI is analyzing your report...</span>
                    </div>
                  </div>
                )}
                
                {aiAnalysis && !isAnalyzing && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🤖</span>
                      </div>
                      <h4 className="font-semibold text-blue-900">AI Analysis</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Suggested Category</div>
                        <div className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                          {reportCategories.find(cat => cat.value === aiAnalysis.suggestedCategory)?.label || aiAnalysis.suggestedCategory}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Priority Level</div>
                        <div className={`text-sm px-2 py-1 rounded priority-${aiAnalysis.priority}`}>
                          {aiAnalysis.priority.toUpperCase()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Urgency</div>
                        <div className="text-sm text-blue-800">
                          {aiAnalysis.urgency.toUpperCase()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Confidence</div>
                        <div className="text-sm text-blue-800">
                          {Math.round(aiAnalysis.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">AI Suggestions</div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Send to Authorities Option */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="send-to-authorities"
                      checked={sendToAuthorities}
                      onChange={(e) => setSendToAuthorities(e.target.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="send-to-authorities" className="text-lg font-semibold cursor-pointer">
                      Send Report to Authorities (Optional)
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check this box to automatically forward your anonymous report to relevant local authorities, 
                      law enforcement, or regulatory agencies based on the incident type and location.
                    </p>
                    {!sendToAuthorities && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Note: Reports are always stored securely. This option enables direct notification to authorities.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  disabled={isSubmitting || !category || description.length < 20 || !postalCode.trim()}
                  className="flex-1 h-14 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Anonymous Report
                    </>
                  )}
                </Button>
              </div>

              {/* Security Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Security Notice:</strong> This form uses end-to-end encryption and zero-knowledge architecture. 
                    No personal information is collected or stored. Your IP address is not logged, and all data is processed anonymously.
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};