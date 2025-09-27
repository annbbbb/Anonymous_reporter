import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Supabase Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

// For demo purposes, use mock Supabase if environment variables are missing
let supabase: any

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('❌ Missing Supabase environment variables - running in demo mode')
  console.log('📝 To use real Supabase, create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  console.log('🔧 Demo mode: Will show 10 sample reports across all categories')
  
  // Create a mock Supabase client for demo purposes
  const mockReports = [
    // Safety Reports
    {
      id: 'demo-safety-1',
      category: 'safety',
      description: 'Dangerous construction site without proper barriers and safety equipment. Workers are at risk of falling from height.',
      location: { postalCode: '00-001', name: 'Warsaw Construction Site', address: 'Marszałkowska 1, Warsaw' },
      photos: [],
      send_to_authorities: true,
      status: 'pending',
      priority: 'high',
      ai_analysis: { sentiment: 'negative', urgency: 'high', suggestedCategory: 'safety', keyEntities: ['construction', 'safety', 'workers'], riskScore: 85, confidence: 0.9 },
      ai_suggested_category: 'safety',
      ai_urgency_score: 85,
      ai_confidence_score: 0.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    {
      id: 'demo-safety-2',
      category: 'safety',
      description: 'Broken elevator in residential building. Residents, especially elderly, cannot access their apartments safely.',
      location: { postalCode: '30-001', name: 'Krakow Residential Building', address: 'Rynek Główny 5, Krakow' },
      photos: [],
      send_to_authorities: true,
      status: 'in_review',
      priority: 'critical',
      ai_analysis: { sentiment: 'negative', urgency: 'critical', suggestedCategory: 'safety', keyEntities: ['elevator', 'residents', 'elderly'], riskScore: 95, confidence: 0.95 },
      ai_suggested_category: 'safety',
      ai_urgency_score: 95,
      ai_confidence_score: 0.95,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    
    // Financial Reports
    {
      id: 'demo-financial-1',
      category: 'financial',
      description: 'Suspicious financial transactions in local government office. Unusual spending patterns and missing receipts.',
      location: { postalCode: '50-001', name: 'Wroclaw City Hall', address: 'Rynek 14, Wroclaw' },
      photos: [],
      send_to_authorities: true,
      status: 'pending',
      priority: 'high',
      ai_analysis: { sentiment: 'negative', urgency: 'high', suggestedCategory: 'financial', keyEntities: ['transactions', 'government', 'spending'], riskScore: 80, confidence: 0.85 },
      ai_suggested_category: 'financial',
      ai_urgency_score: 80,
      ai_confidence_score: 0.85,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    {
      id: 'demo-financial-2',
      category: 'financial',
      description: 'Employee embezzlement case in private company. Missing funds and falsified accounting records.',
      location: { postalCode: '80-001', name: 'Gdansk Business Center', address: 'Długi Targ 1, Gdansk' },
      photos: [],
      send_to_authorities: true,
      status: 'resolved',
      priority: 'critical',
      ai_analysis: { sentiment: 'negative', urgency: 'critical', suggestedCategory: 'financial', keyEntities: ['embezzlement', 'funds', 'accounting'], riskScore: 90, confidence: 0.9 },
      ai_suggested_category: 'financial',
      ai_urgency_score: 90,
      ai_confidence_score: 0.9,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    
    // Environmental Reports
    {
      id: 'demo-environmental-1',
      category: 'environmental',
      description: 'Illegal waste dumping in the forest. Large amounts of construction waste and chemicals found.',
      location: { postalCode: '30-001', name: 'Krakow Forest', address: 'Las Wolski, Krakow' },
      photos: [],
      send_to_authorities: false,
      status: 'in_review',
      priority: 'medium',
      ai_analysis: { sentiment: 'negative', urgency: 'medium', suggestedCategory: 'environmental', keyEntities: ['waste', 'forest', 'chemicals'], riskScore: 60, confidence: 0.8 },
      ai_suggested_category: 'environmental',
      ai_urgency_score: 60,
      ai_confidence_score: 0.8,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    {
      id: 'demo-environmental-2',
      category: 'environmental',
      description: 'Factory releasing toxic fumes into the air. Residents complaining about respiratory problems.',
      location: { postalCode: '40-001', name: 'Katowice Industrial Zone', address: 'ul. Przemysłowa 10, Katowice' },
      photos: [],
      send_to_authorities: true,
      status: 'pending',
      priority: 'high',
      ai_analysis: { sentiment: 'negative', urgency: 'high', suggestedCategory: 'environmental', keyEntities: ['factory', 'fumes', 'residents'], riskScore: 75, confidence: 0.85 },
      ai_suggested_category: 'environmental',
      ai_urgency_score: 75,
      ai_confidence_score: 0.85,
      created_at: new Date(Date.now() - 43200000).toISOString(),
      updated_at: new Date(Date.now() - 43200000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    
    // Legal Reports
    {
      id: 'demo-legal-1',
      category: 'legal',
      description: 'Corruption in local court system. Judges accepting bribes for favorable rulings.',
      location: { postalCode: '00-001', name: 'Warsaw District Court', address: 'al. Jerozolimskie 1, Warsaw' },
      photos: [],
      send_to_authorities: true,
      status: 'pending',
      priority: 'critical',
      ai_analysis: { sentiment: 'negative', urgency: 'critical', suggestedCategory: 'legal', keyEntities: ['corruption', 'judges', 'bribes'], riskScore: 95, confidence: 0.9 },
      ai_suggested_category: 'legal',
      ai_urgency_score: 95,
      ai_confidence_score: 0.9,
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    
    // Workplace Reports
    {
      id: 'demo-workplace-1',
      category: 'workplace',
      description: 'Workplace harassment and discrimination. Manager creating hostile work environment.',
      location: { postalCode: '50-001', name: 'Wroclaw Office Building', address: 'ul. Świdnicka 1, Wroclaw' },
      photos: [],
      send_to_authorities: false,
      status: 'in_review',
      priority: 'high',
      ai_analysis: { sentiment: 'negative', urgency: 'high', suggestedCategory: 'workplace', keyEntities: ['harassment', 'discrimination', 'manager'], riskScore: 80, confidence: 0.85 },
      ai_suggested_category: 'workplace',
      ai_urgency_score: 80,
      ai_confidence_score: 0.85,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    {
      id: 'demo-workplace-2',
      category: 'workplace',
      description: 'Unsafe working conditions in factory. No proper safety equipment provided to workers.',
      location: { postalCode: '80-001', name: 'Gdansk Factory', address: 'ul. Przemysłowa 5, Gdansk' },
      photos: [],
      send_to_authorities: true,
      status: 'resolved',
      priority: 'medium',
      ai_analysis: { sentiment: 'negative', urgency: 'medium', suggestedCategory: 'workplace', keyEntities: ['unsafe', 'factory', 'equipment'], riskScore: 65, confidence: 0.8 },
      ai_suggested_category: 'workplace',
      ai_urgency_score: 65,
      ai_confidence_score: 0.8,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    },
    
    // Other Reports
    {
      id: 'demo-other-1',
      category: 'other',
      description: 'Noise pollution from construction work during night hours. Residents cannot sleep properly.',
      location: { postalCode: '30-001', name: 'Krakow Residential Area', address: 'ul. Floriańska 10, Krakow' },
      photos: [],
      send_to_authorities: false,
      status: 'pending',
      priority: 'low',
      ai_analysis: { sentiment: 'negative', urgency: 'low', suggestedCategory: 'other', keyEntities: ['noise', 'construction', 'residents'], riskScore: 40, confidence: 0.7 },
      ai_suggested_category: 'other',
      ai_urgency_score: 40,
      ai_confidence_score: 0.7,
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date(Date.now() - 10800000).toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Demo Browser'
    }
  ];

  supabase = {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => Promise.resolve({ data: [data], error: null }),
        single: () => Promise.resolve({ data: data, error: null }),
      }),
      select: (columns: string = '*') => {
        const selectResult = {
          eq: (column: string, value: any) => ({
            eq: (column2: string, value2: any) => ({
              order: (column: string, options: any) => Promise.resolve({ data: mockReports, error: null }),
            }),
            order: (column: string, options: any) => Promise.resolve({ data: mockReports, error: null }),
            single: () => {
              // Handle getReportById - find report by id
              const foundReport = mockReports.find(r => r.id === value);
              if (foundReport) {
                return Promise.resolve({ data: foundReport, error: null });
              } else {
                return Promise.resolve({ data: null, error: { message: 'Report not found' } });
              }
            },
          }),
          order: (column: string, options: any) => {
            // Handle different select patterns
            if (columns === 'status') {
              return Promise.resolve({ 
                data: mockReports.map(r => ({ status: r.status })), 
                error: null 
              });
            }
            return Promise.resolve({ data: mockReports, error: null });
          },
        };
        
        // Make it thenable for direct calls without order
        selectResult.then = (resolve: any) => {
          if (columns === 'status') {
            resolve({ 
              data: mockReports.map(r => ({ status: r.status })), 
              error: null 
            });
          } else {
            resolve({ data: mockReports, error: null });
          }
        };
        
        return selectResult;
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          // Handle updateReportStatus - find and update report
          const reportIndex = mockReports.findIndex(r => r.id === value);
          if (reportIndex !== -1) {
            mockReports[reportIndex] = { ...mockReports[reportIndex], ...data };
            return Promise.resolve({ data: mockReports[reportIndex], error: null });
          } else {
            return Promise.resolve({ data: null, error: { message: 'Report not found' } });
          }
        },
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    }
  }
} else {
  console.log('✅ Supabase configured - using real database')
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Anonymous reporting doesn't need persistent sessions
      autoRefreshToken: false,
    }
  })
}

export { supabase }
