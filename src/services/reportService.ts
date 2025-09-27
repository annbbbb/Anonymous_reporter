import { Report, CreateReportData, ReportFilters, ReportStatus, Database } from '@/types/report';
import { supabase } from '@/lib/supabase';
import { analyzeReportContent, determinePriority } from './aiService';

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Convert Supabase row to Report interface
const convertSupabaseRowToReport = (row: any): Report => {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    location: row.location,
    photos: row.photos || [],
    sendToAuthorities: row.send_to_authorities,
    status: row.status,
    priority: row.priority || 'medium',
    aiAnalysis: row.ai_analysis,
    aiSuggestedCategory: row.ai_suggested_category,
    aiUrgencyScore: row.ai_urgency_score,
    aiConfidenceScore: row.ai_confidence_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
  };
};

// Get all reports from Supabase
export const getAllReports = async (): Promise<Report[]> => {
  try {
    console.log('Fetching reports from Supabase...');
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { data, error });
    console.log('Data length:', data?.length || 0);

    if (error) {
      console.error('Error loading reports from Supabase:', error);
      return [];
    }

    const reports = data ? data.map(convertSupabaseRowToReport) : [];
    console.log('Converted reports:', reports);
    console.log('Final reports count:', reports.length);
    return reports;
  } catch (error) {
    console.error('Error loading reports from Supabase:', error);
    return [];
  }
};

// Create a new report
export const createReport = async (reportData: CreateReportData): Promise<Report> => {
  try {
    // Convert photos to base64
    const photoPromises = reportData.photos.map(fileToBase64);
    const photos = await Promise.all(photoPromises);
    
    // Get user info for tracking
    const userAgent = navigator.userAgent;
    
    // AI Analysis
    const aiAnalysis = await analyzeReportContent(reportData.description);
    const priority = determinePriority(aiAnalysis);
    
    const { data, error } = await supabase
      .from('reports')
      .insert({
        category: reportData.category,
        description: reportData.description,
        location: reportData.location,
        photos,
        send_to_authorities: reportData.sendToAuthorities,
        status: 'pending',
        priority,
        ai_analysis: aiAnalysis,
        ai_suggested_category: aiAnalysis.suggestedCategory,
        ai_urgency_score: aiAnalysis.riskScore,
        ai_confidence_score: aiAnalysis.confidence,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    }

    return convertSupabaseRowToReport(data);
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Get report by ID
export const getReportById = async (id: string): Promise<Report | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading report from Supabase:', error);
      return null;
    }

    return data ? convertSupabaseRowToReport(data) : null;
  } catch (error) {
    console.error('Error loading report from Supabase:', error);
    return null;
  }
};

// Update report status
export const updateReportStatus = async (id: string, status: ReportStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating report status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating report status:', error);
    return false;
  }
};

// Filter reports
export const filterReports = async (filters: ReportFilters): Promise<Report[]> => {
  try {
    let query = supabase
      .from('reports')
      .select('*');

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(`description.ilike.%${searchTerm}%,location->>postalCode.ilike.%${searchTerm}%,location->>name.ilike.%${searchTerm}%,location->>address.ilike.%${searchTerm}%`);
    }

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error filtering reports from Supabase:', error);
      return [];
    }

    return data ? data.map(convertSupabaseRowToReport) : [];
  } catch (error) {
    console.error('Error filtering reports from Supabase:', error);
    return [];
  }
};

// Get reports statistics
export const getReportStats = async () => {
  try {
    // Use getAllReports to get all data, then calculate stats
    const allReports = await getAllReports();
    
    const stats = {
      total: allReports.length,
      pending: allReports.filter(r => r.status === 'pending').length,
      inReview: allReports.filter(r => r.status === 'in_review').length,
      resolved: allReports.filter(r => r.status === 'resolved').length,
      rejected: allReports.filter(r => r.status === 'rejected').length,
    };
    
    console.log('Calculated stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error loading report stats:', error);
    return {
      total: 0,
      pending: 0,
      inReview: 0,
      resolved: 0,
      rejected: 0,
    };
  }
};

// Delete report (for admin purposes)
export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting report:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
};
