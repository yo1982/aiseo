import { GoogleGenAI, Type } from "@google/genai";
import type { ContentAnalysisResult, KeywordSuggestion, SiteAuditResult } from '../types';

// Fix: Aligned with @google/genai coding guidelines by removing the `as string` cast.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getKeywordSuggestions = async (topic: string): Promise<KeywordSuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as an expert SEO strategist. Generate a list of 20 related keywords for the topic "${topic}". Include long-tail keywords, LSI keywords, and question-based keywords. Categorize them and provide an estimated monthly search volume (Low, Medium, High) and competition (Low, Medium, High).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              category: { type: Type.STRING },
              volume: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            },
            required: ['keyword', 'category', 'volume', 'competition'],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching keyword suggestions:", error);
    throw new Error("Failed to generate keyword suggestions from Gemini API.");
  }
};

export const analyzeContent = async (content: string): Promise<ContentAnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert SEO copywriter and technical SEO analyst. Analyze the following content and provide a comprehensive SEO analysis.
            Content: """${content}"""
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        seoTitle: {
                            type: Type.STRING,
                            description: "A compelling, keyword-rich title under 60 characters."
                        },
                        metaDescription: {
                            type: Type.STRING,
                            description: "An engaging meta description under 160 characters."
                        },
                        keywordAnalysis: {
                            type: Type.OBJECT,
                            properties: {
                                primaryKeyword: { type: Type.STRING },
                                secondaryKeywords: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                },
                            }
                        },
                        readability: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.STRING, description: "e.g., 'Good', 'Needs Improvement'" },
                                feedback: { type: Type.STRING, description: "A brief explanation of the readability." }
                            }
                        },
                        structureAnalysis: {
                            type: Type.OBJECT,
                            properties: {
                                feedback: { type: Type.STRING, description: "Analysis of headings (H1, H2, etc.)." }
                            }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 3-5 concrete steps to improve on-page SEO."
                        }
                    },
                    required: ['seoTitle', 'metaDescription', 'keywordAnalysis', 'readability', 'structureAnalysis', 'recommendations']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error analyzing content:", error);
        throw new Error("Failed to analyze content with Gemini API.");
    }
}

export const auditSite = async (url: string): Promise<SiteAuditResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Using a more powerful model for complex analysis
            contents: `As an expert SEO auditor, perform a comprehensive analysis of the website at the URL: "${url}".
            Based on your extensive knowledge of this website and general SEO best practices, generate a simulated audit report. You cannot access the URL directly, so base your analysis on publicly available information and common issues for sites of its type.
            Provide an overall score out of 100.
            Identify key technical SEO issues.
            Analyze potential site speed and performance bottlenecks.
            Assess the likely strength of its backlink profile.
            Provide a list of the most critical, actionable recommendations.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: {
                            type: Type.INTEGER,
                            description: "An overall SEO health score from 0 to 100."
                        },
                        technicalSeo: {
                            type: Type.OBJECT,
                            properties: {
                                feedback: { type: Type.STRING, description: "General feedback on the site's technical SEO health." },
                                issues: {
                                    type: Type.ARRAY,
                                    description: "A list of potential technical SEO issues.",
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            description: { type: Type.STRING },
                                            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                                        },
                                        required: ['title', 'description', 'priority']
                                    }
                                }
                            }
                        },
                        siteSpeed: {
                            type: Type.OBJECT,
                            properties: {
                                feedback: { type: Type.STRING, description: "General feedback on site speed and performance." },
                                recommendations: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Specific recommendations to improve site speed."
                                }
                            }
                        },
                        backlinkProfile: {
                            type: Type.OBJECT,
                            properties: {
                                feedback: { type: Type.STRING, description: "An analysis of the likely backlink profile quality." },
                                recommendations: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Recommendations for improving the backlink profile."
                                }
                            }
                        },
                        topRecommendations: {
                            type: Type.ARRAY,
                            description: "The top 3-5 most critical, actionable recommendations overall.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                },
                                required: ['title', 'description']
                            }
                        }
                    },
                    required: ['overallScore', 'technicalSeo', 'siteSpeed', 'backlinkProfile', 'topRecommendations']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error performing site audit:", error);
        throw new Error("Failed to perform site audit with Gemini API.");
    }
}
