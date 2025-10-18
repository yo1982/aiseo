
import React, { useState } from 'react';
import Card from './Card';
import Spinner from './Spinner';
import { analyzeContent } from '../services/geminiService';
import type { ContentAnalysisResult } from '../types';

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [result, setResult] = useState<ContentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (content.trim().length < 50) {
      setError('Please enter at least 50 characters of content to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analyzeContent(content);
      setResult(analysisResult);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Analyze On-Page SEO">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your article text here..."
          className="w-full h-48 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isLoading}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !content.trim()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Content'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Card>

      {isLoading && <Spinner />}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Suggestions">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary">SEO Title</h4>
                <p className="text-sm text-text-secondary bg-gray-100 p-2 rounded">{result.seoTitle}</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Meta Description</h4>
                <p className="text-sm text-text-secondary bg-gray-100 p-2 rounded">{result.metaDescription}</p>
              </div>
            </div>
          </Card>
          <Card title="Analysis">
             <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary">Readability</h4>
                <p className="text-sm text-text-secondary"><span className="font-bold">{result.readability.score}:</span> {result.readability.feedback}</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Content Structure</h4>
                <p className="text-sm text-text-secondary">{result.structureAnalysis.feedback}</p>
              </div>
             </div>
          </Card>
          <Card title="Keyword Usage" className="lg:col-span-2">
             <div className="flex flex-wrap gap-4">
                <div>
                    <h4 className="font-semibold text-text-primary">Primary Keyword</h4>
                    <span className="mt-1 inline-block bg-primary text-white px-3 py-1 text-sm font-semibold rounded-full">{result.keywordAnalysis.primaryKeyword}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-text-primary">Secondary Keywords</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                    {result.keywordAnalysis.secondaryKeywords.map((kw, i) => (
                        <span key={i} className="bg-gray-200 text-text-secondary px-3 py-1 text-sm font-semibold rounded-full">{kw}</span>
                    ))}
                    </div>
                </div>
             </div>
          </Card>
           <Card title="Actionable Recommendations" className="lg:col-span-2">
            <ul className="space-y-2 list-disc list-inside">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-text-secondary">{rec}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentAnalyzer;
