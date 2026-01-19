/**
 * Image Verification using Hugging Face CLIP model
 * CLIP (Contrastive Language-Image Pre-training) by OpenAI
 * Free tier: ~30,000 requests/month
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32';

// Keywords for different challenge categories (Russian + English for better matching)
export const CHALLENGE_KEYWORDS: Record<string, string[]> = {
  // Light challenges
  'луч света': ['light ray', 'sunbeam', 'light beam', 'sunlight through', 'ray of light', 'sun rays', 'light streaming'],
  'закат': ['sunset', 'golden hour', 'evening sky', 'orange sky', 'sun setting'],
  'рассвет': ['sunrise', 'dawn', 'morning light', 'early morning sky'],
  'тень': ['shadow', 'silhouette', 'dark shadow', 'shadows'],
  'силуэт': ['silhouette', 'dark figure', 'outline against light'],

  // Nature
  'цветок': ['flower', 'blossom', 'petal', 'bloom', 'floral'],
  'дерево': ['tree', 'trunk', 'branches', 'leaves', 'forest'],
  'вода': ['water', 'lake', 'river', 'ocean', 'pond', 'reflection in water'],
  'облака': ['clouds', 'sky', 'cloudy sky', 'cloud formation'],
  'капля': ['water drop', 'droplet', 'dew', 'rain drop'],

  // Urban
  'архитектура': ['architecture', 'building', 'facade', 'structure'],
  'граффити': ['graffiti', 'street art', 'mural', 'wall art'],
  'улица': ['street', 'road', 'urban', 'city street'],
  'ночной город': ['night city', 'city lights', 'urban night', 'neon lights'],

  // Abstract
  'отражение': ['reflection', 'mirror', 'reflected', 'glass reflection'],
  'текстура': ['texture', 'pattern', 'surface', 'material'],
  'симметрия': ['symmetry', 'symmetric', 'balanced', 'mirror image'],
  'минимализм': ['minimalist', 'simple', 'minimal', 'clean composition'],
  'контраст': ['contrast', 'light and dark', 'black and white'],

  // Objects
  'кофе': ['coffee', 'cup of coffee', 'coffee mug', 'latte'],
  'книга': ['book', 'reading', 'pages', 'literature'],
  'еда': ['food', 'meal', 'dish', 'cuisine'],
};

export interface VerificationResult {
  isValid: boolean;
  confidence: number;
  matchedKeyword: string | null;
  allScores: { label: string; score: number }[];
  message: string;
}

/**
 * Convert image file to base64
 */
async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Call Hugging Face CLIP API
 */
async function queryHuggingFace(
  imageBase64: string,
  candidateLabels: string[],
  apiKey?: string
): Promise<{ label: string; score: number }[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      inputs: {
        image: imageBase64,
      },
      parameters: {
        candidate_labels: candidateLabels,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  return response.json();
}

/**
 * Extract keywords from challenge title/description
 */
export function extractKeywords(challengeText: string): string[] {
  const text = challengeText.toLowerCase();
  const keywords: string[] = [];

  // Check against known keywords
  for (const [russian, english] of Object.entries(CHALLENGE_KEYWORDS)) {
    if (text.includes(russian)) {
      keywords.push(...english);
    }
  }

  // If no matches, create generic keywords from the text
  if (keywords.length === 0) {
    // Extract nouns (simple heuristic)
    const words = text.split(/\s+/).filter(w => w.length > 3);
    keywords.push(...words.slice(0, 5));
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Verify if an image matches a challenge
 */
export async function verifyImage(
  imageFile: File,
  challengeTitle: string,
  challengeDescription?: string,
  hfApiKey?: string
): Promise<VerificationResult> {
  try {
    // Get keywords for this challenge
    const fullText = `${challengeTitle} ${challengeDescription || ''}`;
    const keywords = extractKeywords(fullText);

    if (keywords.length === 0) {
      return {
        isValid: true,
        confidence: 0.5,
        matchedKeyword: null,
        allScores: [],
        message: 'Не удалось определить ключевые слова. Фото принято.',
      };
    }

    // Add some negative labels for better discrimination
    const negativeLabels = ['random object', 'unrelated image', 'blank photo'];
    const allLabels = [...keywords.slice(0, 8), ...negativeLabels]; // CLIP works best with fewer labels

    // Convert image to base64
    const imageBase64 = await imageToBase64(imageFile);

    // Query Hugging Face
    const scores = await queryHuggingFace(imageBase64, allLabels, hfApiKey);

    // Find best matching keyword (excluding negatives)
    const positiveScores = scores.filter(s => !negativeLabels.includes(s.label));
    const bestMatch = positiveScores.reduce((a, b) => a.score > b.score ? a : b, { label: '', score: 0 });

    // Calculate confidence threshold
    const threshold = 0.15; // 15% is good for CLIP with multiple labels
    const highConfidence = 0.25;

    let isValid = false;
    let message = '';

    if (bestMatch.score >= highConfidence) {
      isValid = true;
      message = `Отлично! Фото соответствует заданию (${Math.round(bestMatch.score * 100)}% уверенность)`;
    } else if (bestMatch.score >= threshold) {
      isValid = true;
      message = `Фото принято (${Math.round(bestMatch.score * 100)}% соответствие)`;
    } else {
      isValid = false;
      message = `Фото не соответствует заданию. Попробуйте сфотографировать: ${keywords.slice(0, 3).join(', ')}`;
    }

    return {
      isValid,
      confidence: bestMatch.score,
      matchedKeyword: bestMatch.label,
      allScores: scores,
      message,
    };
  } catch (error) {
    console.error('Image verification error:', error);

    // On error, accept the image (don't block users due to API issues)
    return {
      isValid: true,
      confidence: 0,
      matchedKeyword: null,
      allScores: [],
      message: 'Верификация недоступна. Фото принято.',
    };
  }
}

/**
 * Quick check if Hugging Face API is available
 */
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const response = await fetch(HF_API_URL, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
