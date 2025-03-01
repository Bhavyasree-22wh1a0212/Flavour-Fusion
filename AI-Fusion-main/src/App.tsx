import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeDisplay from './components/RecipeDisplay';
import JokeDisplay from './components/JokeDisplay';
import ApiKeyForm from './components/ApiKeyForm';
import { generateRecipe, isApiConfigured, setApiConfig } from './services/recipeService';
import { Recipe, ApiConfig } from './types';
import { UtensilsCrossed } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  
  // Check for saved API configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('flavourFusionApiConfig');
    if (savedConfig) {
      try {
        const config: ApiConfig = JSON.parse(savedConfig);
        setApiConfig(config);
        setIsApiReady(true);
      } catch (error) {
        console.error('Error loading saved API configuration:', error);
        localStorage.removeItem('flavourFusionApiConfig');
      }
    } else {
      // Auto-configure with the provided API key
      const config: ApiConfig = {
        apiKey: 'AIzaSyDxVz-RqOyCuGO3Opj_f0hQNWpIMHk3-k4',
        provider: 'google'
      };
      setApiConfig(config);
      localStorage.setItem('flavourFusionApiConfig', JSON.stringify(config));
      setIsApiReady(true);
    }
  }, []);
  
  const handleSubmit = async (topic: string, wordCount: number) => {
    setIsLoading(true);
    try {
      const generatedRecipe = await generateRecipe(topic, wordCount);
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Failed to generate recipe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiConfigured = () => {
    setIsApiReady(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <UtensilsCrossed className="h-10 w-10 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Flavour Fusion</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-powered recipe generation for food bloggers and cooking enthusiasts.
            Simply enter a topic and desired word count to create unique recipe content.
          </p>
        </header>
        
        <div className="flex flex-col items-center space-y-8">
          {isApiReady ? (
            <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <ApiKeyForm onConfigured={handleApiConfigured} />
          )}
          
          <JokeDisplay isVisible={isLoading} />
          
          {recipe && <RecipeDisplay recipe={recipe} />}
        </div>
      </div>
      
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 Flavour Fusion - AI-Driven Recipe Blogging</p>
      </footer>
    </div>
  );
}

export default App;