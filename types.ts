export interface KeywordSuggestion {
  keyword: string;
  category: string;
  volume: 'Low' | 'Medium' | 'High';
  competition: 'Low' | 'Medium' | 'High';
}

export interface ContentAnalysisResult {
  seoTitle: string;
  metaDescription: string;
  keywordAnalysis: {
    primaryKeyword: string;
    secondaryKeywords: string[];
  };
  readability: {
    score: string;
    feedback: string;
  };
  structureAnalysis: {
    feedback: string;
  };
  recommendations: string[];
}

export interface SiteAuditResult {
  overallScore: number;
  technicalSeo: {
    feedback: string;
    issues: {
      title: string;
      description: string;
      priority: 'High' | 'Medium' | 'Low';
    }[];
  };
  siteSpeed: {
    feedback: string;
    recommendations: string[];
  };
  backlinkProfile: {
    feedback: string;
    recommendations: string[];
  };
  topRecommendations: {
    title: string;
    description: string;
  }[];
}
