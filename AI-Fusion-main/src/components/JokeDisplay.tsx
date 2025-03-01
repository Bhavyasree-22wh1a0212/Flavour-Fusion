import React, { useState, useEffect } from 'react';
import { ProgrammerJoke } from '../types';
import { getRandomJoke } from '../data/jokes';
import { Lightbulb } from 'lucide-react';

interface JokeDisplayProps {
  isVisible: boolean;
}

const JokeDisplay: React.FC<JokeDisplayProps> = ({ isVisible }) => {
  const [joke, setJoke] = useState<ProgrammerJoke | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setJoke(getRandomJoke());
      setShowPunchline(false);
      
      // Show punchline after 3 seconds
      const timer = setTimeout(() => {
        setShowPunchline(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!isVisible || !joke) return null;
  
  return (
    <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200 mb-6 animate-fade-in">
      <div className="flex items-start">
        <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
        <div>
          <p className="text-gray-700 font-medium">{joke.setup}</p>
          {showPunchline && (
            <p className="text-gray-800 font-bold mt-2 animate-fade-in">{joke.punchline}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JokeDisplay;