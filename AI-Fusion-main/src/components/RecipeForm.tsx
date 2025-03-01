import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';

interface RecipeFormProps {
  onSubmit: (topic: string, wordCount: number) => void;
  isLoading: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(500);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && wordCount > 0) {
      onSubmit(topic, wordCount);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Flavour Fusion</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Vegan Chocolate Cake"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-1">
            Word Count: {wordCount}
          </label>
          <input
            type="range"
            id="wordCount"
            min="100"
            max="2000"
            step="100"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100</span>
            <span>2000</span>
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 transition-colors'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Recipe...' : 'Generate Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;