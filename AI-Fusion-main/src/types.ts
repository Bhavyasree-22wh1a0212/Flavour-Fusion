export interface Recipe {
  title: string;
  content: string;
  wordCount: number;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  image: string;
  videos: { title: string; url: string }[];
  difficulty: string;
}

export interface ProgrammerJoke {
  setup: string;
  punchline: string;
}

export interface ApiConfig {
  apiKey: string;
  provider: 'google' | 'openai';
  endpoint?: string;
}