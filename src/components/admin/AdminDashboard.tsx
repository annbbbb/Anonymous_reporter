import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Shield
} from "lucide-react";
import { getAllReports, getReportStats } from "@/services/reportService";
import { Report } from "@/types/report";

interface AdminDashboardProps {
  reports: Report[];
  stats: any;
}

export const AdminDashboard = ({ reports, stats }: AdminDashboardProps) => {
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    // Get 5 most recent reports
    const recent = reports
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentReports(recent);
  }, [reports]);

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of anonymous reports system</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-sm text-muted-foreground">Admin Panel</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Review</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inReview}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Category</h3>
          <div className="space-y-3">
            {['workplace', 'financial', 'environmental', 'safety', 'legal', 'other'].map((category) => {
              const count = reports.filter(r => r.category === category).length;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reports by Priority</h3>
          <div className="space-y-3">
            {['critical', 'high', 'medium', 'low'].map((priority) => {
              const count = reports.filter(r => r.priority === priority).length;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                    <span className="text-sm font-medium capitalize">{priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize">{report.category}</span>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.replace('_', ' ')}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(report.priority)}`} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(report.createdAt).toLocaleDateString()} at {report.location.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
