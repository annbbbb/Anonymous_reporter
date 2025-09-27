import { AIAnalysis, ReportPriority } from '@/types/report';

// Mock AI analysis function - w prawdziwej aplikacji używałbyś OpenAI API
export const analyzeReportContent = async (description: string): Promise<AIAnalysis> => {
  // Symulacja opóźnienia API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Prosta analiza na podstawie słów kluczowych
  const words = description.toLowerCase().split(/\s+/);
  
  // Wykrywanie pilności na podstawie słów kluczowych
  const urgencyKeywords = {
    critical: ['emergency', 'urgent', 'immediate', 'danger', 'threat', 'crisis', 'emergency', 'pomoc', 'pomocy', 'natychmiast', 'niebezpieczeństwo'],
    high: ['serious', 'important', 'asap', 'soon', 'poważny', 'ważny', 'pilny'],
    medium: ['moderate', 'concern', 'issue', 'problem', 'problem', 'zaniepokojenie'],
    low: ['minor', 'suggestion', 'feedback', 'drobny', 'sugestia']
  };
  
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let urgencyScore = 0;
  
  for (const [level, keywords] of Object.entries(urgencyKeywords)) {
    const matches = keywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    ).length;
    
    if (matches > urgencyScore) {
      urgency = level as any;
      urgencyScore = matches;
    }
  }
  
  // Wykrywanie kategorii na podstawie słów kluczowych
  const categoryKeywords = {
    workplace: ['work', 'job', 'boss', 'manager', 'colleague', 'harassment', 'discrimination', 'praca', 'szef', 'kolega', 'molestowanie'],
    financial: ['money', 'fraud', 'embezzlement', 'corruption', 'bribe', 'pieniądze', 'oszustwo', 'korupcja', 'łapówka'],
    environmental: ['pollution', 'waste', 'environment', 'toxic', 'chemical', 'zanieczyszczenie', 'środowisko', 'toksyczny'],
    legal: ['illegal', 'law', 'regulation', 'violation', 'nielegalny', 'prawo', 'przepis', 'naruszenie'],
    safety: ['safety', 'danger', 'hazard', 'accident', 'injury', 'bezpieczeństwo', 'niebezpieczeństwo', 'wypadek'],
    other: []
  };
  
  let suggestedCategory = 'other';
  let categoryScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    ).length;
    
    if (matches > categoryScore) {
      suggestedCategory = category;
      categoryScore = matches;
    }
  }
  
  // Analiza sentymentu
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'dobry', 'świetny', 'pozytywny'];
  const negativeWords = ['bad', 'terrible', 'awful', 'negative', 'angry', 'frustrated', 'zły', 'okropny', 'negatywny', 'zły'];
  
  const positiveCount = words.filter(word => 
    positiveWords.some(pos => word.includes(pos))
  ).length;
  
  const negativeCount = words.filter(word => 
    negativeWords.some(neg => word.includes(neg))
  ).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
  }
  
  // Wyodrębnianie kluczowych encji (proste)
  const keyEntities = words.filter(word => 
    word.length > 4 && 
    !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'because', 'any', 'these', 'give', 'day', 'may', 'use', 'her', 'man', 'much', 'than', 'its', 'who', 'oil', 'sit', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'has', 'him', 'his', 'how', 'its', 'made', 'many', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)
  ).slice(0, 10);
  
  // Obliczanie score'u ryzyka
  const riskScore = Math.min(100, 
    (urgencyScore * 20) + 
    (negativeCount * 5) + 
    (description.length > 200 ? 10 : 0) +
    (description.includes('!') ? 15 : 0)
  );
  
  // Obliczanie confidence score
  const confidence = Math.min(1.0, 
    (urgencyScore * 0.2) + 
    (categoryScore * 0.3) + 
    (description.length > 100 ? 0.3 : 0.1) +
    (keyEntities.length > 3 ? 0.2 : 0)
  );
  
  return {
    sentiment,
    urgency,
    suggestedCategory,
    keyEntities,
    riskScore,
    confidence
  };
};

// Funkcja do określania priorytetu na podstawie AI analizy
export const determinePriority = (analysis: AIAnalysis): ReportPriority => {
  if (analysis.urgency === 'critical' || analysis.riskScore > 80) {
    return 'critical';
  } else if (analysis.urgency === 'high' || analysis.riskScore > 60) {
    return 'high';
  } else if (analysis.urgency === 'medium' || analysis.riskScore > 40) {
    return 'medium';
  } else {
    return 'low';
  }
};

// Funkcja do generowania sugestii ulepszeń
export const generateImprovementSuggestions = (analysis: AIAnalysis): string[] => {
  const suggestions: string[] = [];
  
  if (analysis.confidence < 0.5) {
    suggestions.push('Consider adding more specific details about the incident');
  }
  
  if (analysis.keyEntities.length < 3) {
    suggestions.push('Include names of people, places, or organizations involved');
  }
  
  if (analysis.sentiment === 'neutral') {
    suggestions.push('Add more emotional context to help understand the severity');
  }
  
  if (analysis.riskScore < 30) {
    suggestions.push('Consider if this is a minor issue that could be resolved locally');
  }
  
  return suggestions;
};
