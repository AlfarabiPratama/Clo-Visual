
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

// Initialize Gemini
// Note: In a real production app, API keys should not be exposed on the client side directly
// without proper restrictions, or calls should be proxied through a backend.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock data to use if API key is missing or for rapid prototyping
const MOCK_DESIGN_RESPONSE: AiResponse = {
  suggestedColor: "#FF5733",
  designDescription: "Desain modern dengan sentuhan geometris dan palet warna hangat, cocok untuk gaya streetwear urban.",
  texturePattern: "https://picsum.photos/512/512?random=1" // Placeholder texture
};

export const generateDesignFromText = async (prompt: string): Promise<AiResponse> => {
  if (!apiKey || !ai) {
    console.warn("No API Key found. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return MOCK_DESIGN_RESPONSE;
  }

  try {
    // Add timeout wrapper to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI request timeout')), 15000)
    );

    const apiPromise = ai!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional fashion textile designer. Create a realistic fabric design based on this request:

USER REQUEST: "${prompt}"

IMPORTANT INSTRUCTIONS:
1. Extract the EXACT fabric type, color, and pattern mentioned in the user's request
2. If user mentions specific color (e.g., "hitam", "putih", "navy blue"), use that EXACT color
3. If user mentions specific pattern (e.g., "geometric", "batik", "stripes"), use that EXACT pattern
4. The design MUST match what the user explicitly requested

Return JSON with:
- suggestedColor: Hex code matching user's color request (or complementary if not specified)
- designDescription: Indonesian description (2 sentences) explaining the fabric type, color, and pattern that matches user's request
- texturePattern: Choose ONE keyword that BEST MATCHES user's request from these options:
  * "jersey-knit" (for plain t-shirt fabric, cotton jersey)
  * "batik-modern" (for batik patterns, Indonesian traditional)
  * "stripes" (for striped patterns, lines)
  * "floral" (for flower patterns, botanical)
  * "geometric" (for geometric shapes, abstract patterns)
  * "plain" (for solid color only, no pattern)
  * "denim" (for jeans texture, denim fabric)
  * "cotton" (for plain cotton weave texture)

EXAMPLES:
- "T-shirt hitam dengan motif geometric" → suggestedColor: "#000000", texturePattern: "geometric"
- "Hoodie putih polos" → suggestedColor: "#FFFFFF", texturePattern: "plain"
- "Kaos navy blue dengan pattern batik" → suggestedColor: "#000080", texturePattern: "batik-modern"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedColor: { type: Type.STRING },
            designDescription: { type: Type.STRING },
            texturePattern: { type: Type.STRING, description: "MUST be one of: jersey-knit, batik-modern, stripes, floral, geometric, plain, denim, cotton" }
          }
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    const data = JSON.parse(response.text || '{}');
    
    console.log('[AI Response]', data); // Debug log to see what Gemini returns
    
    // Map pattern keywords to realistic fabric textures from Unsplash
    const patternMap: Record<string, string> = {
      'jersey-knit': 'https://images.unsplash.com/photo-1558769132-cb1aea1f3f69?w=512&h=512&fit=crop',
      'jersey': 'https://images.unsplash.com/photo-1558769132-cb1aea1f3f69?w=512&h=512&fit=crop',
      'knit': 'https://images.unsplash.com/photo-1558769132-cb1aea1f3f69?w=512&h=512&fit=crop',
      'batik-modern': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=512&h=512&fit=crop',
      'batik': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=512&h=512&fit=crop',
      'stripes': 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop',
      'stripe': 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop',
      'garis': 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop',
      'floral': 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=512&h=512&fit=crop',
      'flower': 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=512&h=512&fit=crop',
      'bunga': 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=512&h=512&fit=crop',
      'geometric': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
      'geometry': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
      'abstract': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
      'plain': null, // No texture, solid color only
      'polos': null,
      'solid': null,
      'denim': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=512&h=512&fit=crop',
      'jeans': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=512&h=512&fit=crop',
      'cotton': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=512&h=512&fit=crop',
      'katun': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=512&h=512&fit=crop'
    };
    
    // Flexible pattern matching: try exact match first, then substring match
    const patternKey = (data.texturePattern || 'plain').toLowerCase().trim();
    let textureUrl = patternMap[patternKey]; // Exact match
    
    if (textureUrl === undefined) {
      // Substring match
      const foundKey = Object.keys(patternMap).find(key => patternKey.includes(key) || key.includes(patternKey));
      textureUrl = foundKey ? patternMap[foundKey] : null;
    }
    
    console.log('[Pattern Matching]', { 
      aiReturned: patternKey, 
      matchedTexture: textureUrl || 'solid color only' 
    });
    
    return {
      suggestedColor: data.suggestedColor || "#ffffff",
      designDescription: data.designDescription || "Desain kustom berdasarkan permintaan.",
      texturePattern: textureUrl
    };

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    // Return graceful fallback with error hint
    return {
      suggestedColor: "#1f2937",
      designDescription: `Gagal generate AI (${error.message || 'timeout'}). Coba prompt lebih sederhana atau refresh halaman.`,
      texturePattern: null
    };
  }
};

export const generateDesignFromImage = async (imageFile: File): Promise<AiResponse> => {
  if (!apiKey || !ai) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      suggestedColor: "#3B82F6",
      designDescription: "Dianalisis dari gambar referensi (Mode Demo): Gaya minimalis dengan aksen biru.",
      texturePattern: null
    };
  }

  try {
    // Convert image to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    const base64Image = await base64Promise;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: `Analyze this fashion design reference image. Extract:
1. Dominant color (hex code)
2. Design style and description (Indonesian, 2-3 sentences)
3. Pattern type (keywords: jersey-knit, batik-modern, stripes, floral, geometric, plain, denim, cotton)

Return JSON format.` },
            { inlineData: { mimeType: imageFile.type, data: base64Image.split(',')[1] } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedColor: { type: Type.STRING },
            designDescription: { type: Type.STRING },
            texturePattern: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    const patternMap: Record<string, string> = {
      'jersey-knit': 'https://images.unsplash.com/photo-1558769132-cb1aea1f3f69?w=512&h=512&fit=crop',
      'batik-modern': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=512&h=512&fit=crop',
      'stripes': 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop',
      'floral': 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=512&h=512&fit=crop',
      'geometric': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
      'plain': null,
      'denim': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=512&h=512&fit=crop',
      'cotton': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=512&h=512&fit=crop'
    };
    
    const patternKey = (data.texturePattern || 'plain').toLowerCase();
    const matchedPattern = Object.keys(patternMap).find(key => patternKey.includes(key));

    return {
      suggestedColor: data.suggestedColor || "#3B82F6",
      designDescription: data.designDescription || "Dianalisis dari gambar referensi.",
      texturePattern: matchedPattern ? patternMap[matchedPattern] : null
    };
  } catch (error) {
    console.error("Image analysis error:", error);
    return {
      suggestedColor: "#3B82F6",
      designDescription: "Gagal menganalisis gambar. Gunakan prompt teks untuk hasil optimal.",
      texturePattern: null
    };
  }
};

export const chatWithAiAssistant = async (history: {role: string, content: string}[], newMessage: string): Promise<string> => {
  if (!apiKey || !ai) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Halo! Saya adalah asisten desain Clo Vsual (Mode Demo). Saya bisa memberikan saran tentang tren warna, kain, dan gaya untuk proyek fashion Anda.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful fashion design assistant for Clo Vsual. You speak primarily in Indonesian. You help designers, students, and garment factories with ideas.",
      },
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Maaf, saya tidak dapat menghasilkan respon saat ini.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Maaf, saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.";
  }
};
