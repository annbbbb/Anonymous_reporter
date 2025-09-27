export interface Report {
  id: string;
  category: string;
  description: string;
  location: {
    postalCode: string;
    name?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos: string[]; // Base64 encoded images
  sendToAuthorities: boolean;
  status: ReportStatus;
  priority: ReportPriority;
  aiAnalysis?: AIAnalysis;
  aiSuggestedCategory?: string;
  aiUrgencyScore?: number;
  aiConfidenceScore?: number;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          category: string;
          description: string;
          location: any; // JSONB
          photos: string[];
          send_to_authorities: boolean;
          status: ReportStatus;
          priority: ReportPriority;
          ai_analysis?: any; // JSONB
          ai_suggested_category?: string;
          ai_urgency_score?: number;
          ai_confidence_score?: number;
          created_at: string;
          updated_at: string;
          ip_address?: string;
          user_agent?: string;
        };
        Insert: {
          id?: string;
          category: string;
          description: string;
          location: any; // JSONB
          photos?: string[];
          send_to_authorities?: boolean;
          status?: ReportStatus;
          priority?: ReportPriority;
          ai_analysis?: any; // JSONB
          ai_suggested_category?: string;
          ai_urgency_score?: number;
          ai_confidence_score?: number;
          created_at?: string;
          updated_at?: string;
          ip_address?: string;
          user_agent?: string;
        };
        Update: {
          id?: string;
          category?: string;
          description?: string;
          location?: any; // JSONB
          photos?: string[];
          send_to_authorities?: boolean;
          status?: ReportStatus;
          priority?: ReportPriority;
          ai_analysis?: any; // JSONB
          ai_suggested_category?: string;
          ai_urgency_score?: number;
          ai_confidence_score?: number;
          created_at?: string;
          updated_at?: string;
          ip_address?: string;
          user_agent?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          postal_code: string;
          voivodeship: string;
          county: string;
          coordinates?: any; // JSONB
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          address: string;
          postal_code: string;
          voivodeship: string;
          county: string;
          coordinates?: any; // JSONB
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          postal_code?: string;
          voivodeship?: string;
          county?: string;
          coordinates?: any; // JSONB
          created_at?: string;
        };
      };
    };
  };
}

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  suggestedCategory: string;
  keyEntities: string[];
  riskScore: number;
  confidence: number;
}

export interface ReportCategory {
  value: string;
  label: string;
  description: string;
}

export interface CreateReportData {
  category: string;
  description: string;
  location: {
    postalCode: string;
    name?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos: File[];
  sendToAuthorities: boolean;
}

export interface ReportFilters {
  category?: string;
  status?: ReportStatus;
  priority?: ReportPriority;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
