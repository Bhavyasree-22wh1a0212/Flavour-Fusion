import { Recipe as RecipeType, ApiConfig } from "../types";

// Hardcoded API Key (FOR TESTING ONLY - REMOVE AFTER USE)
const API_KEY = "AIzaSyDxVz-RqOyCuGO3Opj_f0hQNWpIMHk3-k4";

// API Endpoints
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const UNSPLASH_API_KEY = "qTOe8C8jg6Sq0sgwOtrRNXTTToz0JBjpJ_FukTFPHqs";
const UNSPLASH_ENDPOINT = "https://api.unsplash.com/photos/?client_id=";

// Default API configuration
let apiConfig: ApiConfig = {
  apiKey: API_KEY,
  provider: "google",
};

// Set API configuration
export const setApiConfig = (config: ApiConfig): void => {
  apiConfig = config;
};

// Get API configuration
export const getApiConfig = (): ApiConfig => {
  return apiConfig;
};

// Check if API is configured
export const isApiConfigured = (): boolean => {
  return !!apiConfig.apiKey;
};

// Fetch an image from Unsplash API
const fetchImage = async (query: string): Promise<string> => {
  try {
    const response = await fetch(
      `${UNSPLASH_ENDPOINT}?query=${query}&per_page=1&client_id=${UNSPLASH_API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch image");

    const data = await response.json();
    return data.results[0]?.urls?.regular || "";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};

// Generate a recipe using the Gemini API
export const generateRecipe = async (topic: string, wordCount: number): Promise<RecipeType> => {
  try {
    if (!apiConfig.apiKey) {
      throw new Error("API key not configured");
    }
    return await generateWithGemini(topic, wordCount);
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe. Please try again later.");
  }
};

// Generate recipe with Gemini API, then fetch image
const generateWithGemini = async (topic: string, wordCount: number): Promise<RecipeType> => {
  const prompt = `
    Create a detailed recipe blog post about "${topic}" with approximately ${wordCount} words.
    Include a catchy title, introduction, ingredients list, step-by-step instructions, serving suggestions, storage tips, and optional nutritional info.
    Also, provide two YouTube video links relevant to this recipe.
  `;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  try {
    // Call Gemini API
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts.map((part: any) => part.text).join("\n");

    // Extract video links from the Gemini response
    const videoUrls = generatedText.match(/https?:\/\/www\.youtube\.com\/watch\?v=[\w-]+/g) || [];
    const videos = videoUrls.map((url: any) => ({ title: "Recipe Video", url }));

    // Fetch image
    const imageUrl = await fetchImage(topic);

    return parseGeminiResponse(generatedText, topic, wordCount, imageUrl, videos);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Parse the Gemini response and embed images/videos
const parseGeminiResponse = (
  text: string,
  topic: string,
  requestedWordCount: number,
  imageUrl: string,
  videos: { title: string; url: string }[]
): RecipeType => {
  // Generate embedded HTML for videos
  const videoEmbeds = videos
    .map(
      (video) => `
      <h3>${video.title}</h3>
      <iframe width="560" height="315" src="${video.url.replace(
        "watch?v=",
        "embed/"
      )}" frameborder="0" allowfullscreen></iframe>
    `
    )
    .join("\n");

  return {
    title: `${topic} Recipe`,
    content: `
      <img src="${imageUrl}" alt="${topic}" style="width:100%;height:auto;" />
      <p>${text}</p>
      ${videoEmbeds}
    `,
    wordCount: requestedWordCount,
    ingredients: [],
    steps: [],
    prepTime: "30 minutes",
    cookTime: "45 minutes",
    servings: 4,
    difficulty: "Moderate",
    image: imageUrl,
    videos: videos,
  };
};
