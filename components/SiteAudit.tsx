import React, { useState } from 'react';
import Card from './Card';
import Spinner from './Spinner';
import { auditSite } from '../services/geminiService';
import type { SiteAuditResult } from '../types';

// Helper component for displaying the score
const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-green-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };
    const circumference = 2 * Math.PI * 52;
    // Set initial offset to full circumference to start animation from 0
    const [offset, setOffset] = useState(circumference);

    React.useEffect(() => {
      // Animate the circle drawing
      const finalOffset = circumference - (score / 100) * circumference;
      setOffset(finalOffset);
    }, [score, circumference]);

    return (
        <div className="relative flex items-center justify-center h-48 w-48">
            <svg className="transform -rotate-90" width="192" height="192" viewBox="0 0 120 120">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`${getScoreColor(score)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
            </svg>
            <span className={`absolute text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
    );
};


// Helper component for issue priority
const PriorityBadge: React.FC<{ priority: 'High' | 'Medium' | 'Low' }> = ({ priority }) => {
    const colorMap = {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[priority]}`}>
            {priority} Priority
        </span>
    );
};

const SiteAudit: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [result, setResult] = useState<SiteAuditResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAudit = async () => {
        if (!url.trim() || !url.includes('.')) {
            setError('Please enter a valid website URL.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const auditResult = await auditSite(url);
            setResult(auditResult);
        } catch (e) {
            setError('An error occurred during the audit. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card title="Perform a Technical SEO Audit">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter website URL (e.g., https://example.com)"
                        className="flex-grow w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAudit}
                        disabled={isLoading}
                        className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Auditing...' : 'Start Audit'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </Card>

            {isLoading && <Spinner />}

            {result && (
                <div className="space-y-8 animate-fade-in">
                    <Card title="Audit Summary">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <ScoreCircle score={result.overallScore} />
                                <p className="text-center mt-2 font-semibold text-text-secondary">Overall Score</p>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-text-primary mb-2">Top Recommendations</h3>
                                <ul className="space-y-3">
                                    {result.topRecommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="h-6 w-6 text-secondary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <div>
                                                <h4 className="font-semibold">{rec.title}</h4>
                                                <p className="text-sm text-text-secondary">{rec.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Technical SEO">
                            <p className="text-sm text-text-secondary mb-4">{result.technicalSeo.feedback}</p>
                            <div className="space-y-4">
                                {result.technicalSeo.issues.map((issue, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-semibold">{issue.title}</h4>
                                            <PriorityBadge priority={issue.priority} />
                                        </div>
                                        <p className="text-sm text-text-secondary">{issue.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card title="Site Speed & Performance">
                            <p className="text-sm text-text-secondary mb-4">{result.siteSpeed.feedback}</p>
                            <ul className="space-y-2 list-disc list-inside text-sm text-text-secondary">
                                {result.siteSpeed.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                     <Card title="Backlink Profile Analysis">
                        <p className="text-sm text-text-secondary mb-4">{result.backlinkProfile.feedback}</p>
                         <ul className="space-y-2 list-disc list-inside text-sm text-text-secondary">
                            {result.backlinkProfile.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SiteAudit;
