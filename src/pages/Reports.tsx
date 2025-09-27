import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
  Download,
  FileDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllReports, filterReports, getReportStats, ReportFilters } from "@/services/reportService";
import { Report, ReportStatus, ReportPriority } from "@/types/report";
import { useNavigate } from "react-router-dom";
import { NotificationSystem } from "@/components/NotificationSystem";
import { exportReportsToPDF, exportReportsToCSV } from "@/services/exportService";

const statusConfig = {
  pending: { label: "Pending", color: "status-pending", icon: Clock },
  in_review: { label: "In Review", color: "status-in-review", icon: AlertCircle },
  resolved: { label: "Resolved", color: "status-resolved", icon: CheckCircle },
  rejected: { label: "Rejected", color: "status-rejected", icon: XCircle },
};

const priorityConfig = {
  low: { label: "Low", color: "priority-low", icon: "🟢" },
  medium: { label: "Medium", color: "priority-medium", icon: "🟡" },
  high: { label: "High", color: "priority-high", icon: "🟠" },
  critical: { label: "Critical", color: "priority-critical", icon: "🔴" },
};

const categoryLabels = {
  workplace: "Workplace Issues",
  financial: "Financial Misconduct", 
  environmental: "Environmental Issues",
  legal: "Legal Violations",
  safety: "Safety Concerns",
  other: "Other Issues"
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState<ReportFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCharts, setShowCharts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters, searchTerm]);

  const loadReports = async () => {
    setLoading(true);
    try {
      console.log('Loading reports...');
      const [allReports, reportStats] = await Promise.all([
        getAllReports(),
        getReportStats()
      ]);
      console.log('Loaded reports:', allReports);
      console.log('Report stats:', reportStats);
      setReports(allReports);
      setStats(reportStats);
    } catch (error) {
      console.error('Error loading reports:', error);
      // Show error to user
      alert('Błąd ładowania zgłoszeń: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      console.log('Applying filters:', { filters, searchTerm });
      
      // Filter locally instead of using Supabase filterReports
      let filtered = [...reports];
      
      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(report => 
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Category filter
      if (filters.category) {
        filtered = filtered.filter(report => report.category === filters.category);
      }
      
      // Status filter
      if (filters.status) {
        filtered = filtered.filter(report => report.status === filters.status);
      }
      
      // Priority filter
      if (filters.priority) {
        filtered = filtered.filter(report => report.priority === filters.priority);
      }
      
      console.log('Filtered results:', filtered.length);
      setFilteredReports(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    console.log('Filter change:', { key, value });
    const newFilters = {
      ...filters,
      [key]: value === "" || value === "all" ? undefined : value,
    };
    console.log('New filters:', newFilters);
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
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

  const getStatusConfig = (status: ReportStatus) => {
    return statusConfig[status];
  };

  // Generate chart data
  const getChartData = () => {
    const categoryData = Object.entries(categoryLabels).map(([key, label]) => ({
      name: label,
      value: reports.filter(r => r.category === key).length
    }));

    const priorityData = Object.entries(priorityConfig).map(([key, config]) => ({
      name: config.label,
      value: reports.filter(r => r.priority === key).length,
      color: key === 'critical' ? '#ef4444' : key === 'high' ? '#f97316' : key === 'medium' ? '#eab308' : '#22c55e'
    }));

    const statusData = Object.entries(statusConfig).map(([key, config]) => ({
      name: config.label,
      value: reports.filter(r => r.status === key).length
    }));

    return { categoryData, priorityData, statusData };
  };

  const { categoryData, priorityData, statusData } = getChartData();

  // Export functions
  const handleExportPDF = () => {
    try {
      exportReportsToPDF(filteredReports, `reports-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleExportCSV = () => {
    try {
      exportReportsToCSV(filteredReports, `reports-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reports Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and review anonymous reports
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <NotificationSystem reports={reports} />
              <Button 
                onClick={loadReports} 
                variant="outline"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spin w-4 h-4 mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Refresh Data
              </Button>
              <Button 
                onClick={() => setShowCharts(!showCharts)} 
                variant={showCharts ? "default" : "outline"}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showCharts ? 'Hide Charts' : 'Show Charts'}
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Submit New Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value as ReportStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange('priority', value as ReportPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  {Object.entries(priorityConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        {showCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Chart */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Reports by Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Priority Chart */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Reports by Priority</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Status Chart */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Reports by Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}


        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {reports.length === 0 
                  ? "No reports have been submitted yet. Make sure you've run the sample data script!" 
                  : "No reports match your current filters."
                }
              </p>
              {reports.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Run the FIXED-sample-data.sql script in Supabase to add sample reports.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            filteredReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              const StatusIcon = statusConfig.icon;
              const priorityInfo = priorityConfig[report.priority as keyof typeof priorityConfig];
              
              return (
                <Card key={report.id} className="p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className={priorityInfo.color}>
                          <span className="mr-1">{priorityInfo.icon}</span>
                          {priorityInfo.label}
                        </Badge>
                        <Badge variant="secondary">
                          {categoryLabels[report.category as keyof typeof categoryLabels] || report.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {report.description.substring(0, 100)}
                        {report.description.length > 100 && "..."}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {report.location.name || report.location.postalCode}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(report.createdAt)}
                        </div>
                        {report.photos.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>{report.photos.length} photo(s)</span>
                          </div>
                        )}
                        {report.sendToAuthorities && (
                          <Badge variant="outline" className="text-xs">
                            Sent to Authorities
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
