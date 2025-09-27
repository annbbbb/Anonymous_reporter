import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Shield
} from "lucide-react";
import { getReportById, updateReportStatus } from "@/services/reportService";
import { Report, ReportStatus } from "@/types/report";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
};

const categoryLabels = {
  workplace: "Workplace Issues",
  financial: "Financial Misconduct", 
  environmental: "Environmental Issues",
  legal: "Legal Violations",
  safety: "Safety Concerns",
  other: "Other Issues"
};

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadReport(id);
    }
  }, [id]);

  const loadReport = async (reportId: string) => {
    try {
      const foundReport = await getReportById(reportId);
      setReport(foundReport);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ReportStatus) => {
    if (!report) return;
    
    setUpdating(true);
    try {
      const success = await updateReportStatus(report.id, newStatus);
      if (success) {
        setReport(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The report you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
        </Card>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[report.status];
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/reports')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Report Details</h1>
              <p className="text-muted-foreground">
                Report ID: {report.id}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={currentStatusConfig.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {currentStatusConfig.label}
              </Badge>
              
              <Select 
                value={report.status} 
                onValueChange={handleStatusUpdate}
                disabled={updating}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Description</h2>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {report.description}
                </p>
              </div>
            </Card>

            {/* Photos */}
            {report.photos.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Attached Photos</h2>
                  <Badge variant="secondary">{report.photos.length}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Report photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Report Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="font-medium">
                    {categoryLabels[report.category as keyof typeof categoryLabels] || report.category}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="font-medium">{formatDate(report.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="font-medium">{formatDate(report.updatedAt)}</p>
                </div>
                
                {report.sendToAuthorities && (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Sent to Authorities</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Location Info */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              
              <div className="space-y-3">
                {report.location.name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-medium">{report.location.name}</p>
                  </div>
                )}
                
                {report.location.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="font-medium">{report.location.address}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                  <p className="font-medium">{report.location.postalCode}</p>
                </div>
                
                {report.location.coordinates && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                    <p className="font-mono text-sm">
                      {report.location.coordinates.lat.toFixed(6)}, {report.location.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
