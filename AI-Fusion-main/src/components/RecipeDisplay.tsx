import React from 'react';
import { Recipe } from '../types';
import { FileText, Copy, Clock, Users, ChefHat } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RecipeDisplayProps {
  recipe: Recipe | null;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  if (!recipe) return null;

  const copyToClipboard = () => {
    const text = `${recipe.title}\n\n${recipe.content}`;
    navigator.clipboard.writeText(text)
      .then(() => alert('Recipe copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Count actual words in the content
  const actualWordCount = recipe.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl animate-fade-in">
      {/* Recipe Image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full rounded-lg mb-4 shadow-md"
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center text-sm text-gray-600 hover:text-orange-500 transition-colors"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-orange-400" />
          <span>Prep: {recipe.prepTime}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-orange-500" />
          <span>Cook: {recipe.cookTime}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-orange-400" />
          <span>Serves: {recipe.servings}</span>
        </div>
        <div className="flex items-center">
          <ChefHat className="h-4 w-4 mr-1 text-orange-500" />
          <span>Difficulty: {recipe.difficulty}</span>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Approximately {actualWordCount} words
      </div>

      {/* Render recipe content as Markdown */}
      <div className="prose max-w-none">
        <ReactMarkdown>{recipe.content}</ReactMarkdown>
      </div>

      {/* Display YouTube videos */}
      {recipe.videos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Recipe Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.videos.map((video, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9">
                <iframe
                  src={video.url.replace("watch?v=", "embed/")}
                  title={video.title}
                  className="w-full h-56 rounded-lg shadow-md"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDisplay;
