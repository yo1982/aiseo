
import React, { useState } from 'react';
import Card from './Card';
import Spinner from './Spinner';
import { getKeywordSuggestions } from '../services/geminiService';
import type { KeywordSuggestion } from '../types';

const KeywordResearch: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await getKeywordSuggestions(topic);
      setSuggestions(result);
    } catch (e) {
      setError('An error occurred while fetching suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBadgeColor = (value: 'Low' | 'Medium' | 'High') => {
    switch(value) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Find Keyword Ideas">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or primary keyword (e.g., 'sustainable gardening')"
            className="flex-grow w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Generating...' : 'Get Ideas'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Card>

      {isLoading && <Spinner />}

      {suggestions.length > 0 && (
        <Card title="Keyword Suggestions">
            <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Keyword</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Volume</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Competition</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suggestions.map((s, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{s.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{s.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(s.volume)}`}>
                        {s.volume}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(s.competition)}`}>
                        {s.competition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KeywordResearch;
