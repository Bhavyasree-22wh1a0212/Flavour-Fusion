import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { ApiConfig } from '../types';
import { setApiConfig } from '../services/recipeService';

interface ApiKeyFormProps {
  onConfigured: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'google' | 'openai'>('google');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [showCustomEndpoint, setShowCustomEndpoint] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    setIsConfiguring(true);

    try {
      const config: ApiConfig = {
        apiKey: apiKey.trim(),
        provider: provider,
      };

      if (showCustomEndpoint && customEndpoint.trim()) {
        config.endpoint = customEndpoint.trim();
      }

      setApiConfig(config);

      localStorage.setItem('flavourFusionApiConfig', JSON.stringify(config));

      onConfigured();
    } catch (error) {
      console.error('Error configuring API:', error);
      alert('Failed to configure API. Please try again.');
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Key className="h-8 w-8 text-orange-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">API Configuration</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'google' | 'openai')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isConfiguring}
          >
            <option value="google">Google AI (Gemini)</option>
            <option value="openai">OpenAI (ChatGPT)</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={isConfiguring}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="customEndpoint"
              checked={showCustomEndpoint}
              onChange={(e) => setShowCustomEndpoint(e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              disabled={isConfiguring}
            />
            <label htmlFor="customEndpoint" className="ml-2 block text-sm text-gray-700">
              Use custom endpoint
            </label>
          </div>
        </div>

        {showCustomEndpoint && (
          <div className="mb-6">
            <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Endpoint URL
            </label>
            <input
              type="url"
              id="endpoint"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder={provider === 'google'
                ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
                : 'https://api.openai.com/v1/chat/completions'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isConfiguring}
            />
          </div>
        )}

        <div className="mb-2 text-xs text-gray-500">
          <p>Your API key is stored locally in your browser and is never sent to our servers.</p>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isConfiguring
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 transition-colors'
            }`}
          disabled={isConfiguring}
        >
          {isConfiguring ? 'Configuring...' : 'Configure API'}
        </button>
      </form>
    </div>
  );
};

export default ApiKeyForm;
