import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Calendar,
  MapPin
} from "lucide-react";
import { Report, ReportStatus, ReportPriority } from "@/types/report";
import { updateReportStatus, deleteReport } from "@/services/reportService";

interface AdminReportsProps {
  reports: Report[];
  onReportsChange: () => void;
}

export const AdminReports = ({ reports, onReportsChange }: AdminReportsProps) => {
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
      onReportsChange();
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        onReportsChange();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground">Manage and review anonymous reports</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="workplace">Workplace</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setCategoryFilter("all");
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.replace('_', ' ')}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(report.priority)}`} />
                  <span className="text-sm font-medium capitalize">{report.priority}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm font-medium capitalize">{report.category}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {report.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location.name}
                  </div>
                  {report.sendToAuthorities && (
                    <Badge variant="outline" className="text-xs">
                      Sent to Authorities
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Select
                  value={report.status}
                  onValueChange={(value) => handleStatusChange(report.id, value as ReportStatus)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReport(report.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No reports found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Report Details Modal would go here */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Report Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReport.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <p className="text-sm text-muted-foreground capitalize">{selectedReport.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <p className="text-sm text-muted-foreground capitalize">{selectedReport.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm text-muted-foreground capitalize">{selectedReport.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-sm text-muted-foreground">{selectedReport.location.name}</p>
                  </div>
                </div>

                {selectedReport.aiAnalysis && (
                  <div>
                    <label className="text-sm font-medium">AI Analysis</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>Sentiment:</strong> {selectedReport.aiAnalysis.sentiment}<br/>
                        <strong>Urgency:</strong> {selectedReport.aiAnalysis.urgency}<br/>
                        <strong>Risk Score:</strong> {selectedReport.aiAnalysis.riskScore}/100<br/>
                        <strong>Confidence:</strong> {(selectedReport.aiAnalysis.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
