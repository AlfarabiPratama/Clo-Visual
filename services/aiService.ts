
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
      contents: `You are an expert fashion and textile design AI assistant specializing in realistic fabric patterns and garment designs.

Analyze this design request: "${prompt}"

Consider:
- Fabric texture authenticity (cotton weave, jersey knit, batik, etc.)
- Color theory and fashion trends
- Pattern scale and repetition
- Realistic garment draping and fit
- Cultural and seasonal appropriateness

Return a JSON object with:
1. suggestedColor: Professional hex color code that works well for fabric
2. designDescription: Detailed Indonesian description (2-3 sentences) covering fabric type, pattern style, and intended use
3. texturePattern: SINGLE keyword from: jersey-knit, batik-modern, stripes, floral, geometric, plain, denim, cotton`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedColor: { type: Type.STRING },
            designDescription: { type: Type.STRING },
            texturePattern: { type: Type.STRING, description: "A specific pattern keyword for realistic fabric texture" }
          }
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    const data = JSON.parse(response.text || '{}');
    
    // Map pattern keywords to realistic fabric textures
    const patternMap: Record<string, string> = {
      'jersey-knit': 'https://images.unsplash.com/photo-1558769132-cb1aea1f3f69?w=512&h=512&fit=crop',
      'batik-modern': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=512&h=512&fit=crop',
      'stripes': 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop',
      'floral': 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=512&h=512&fit=crop',
      'geometric': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
      'plain': null, // No texture, solid color only
      'denim': 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=512&h=512&fit=crop',
      'cotton': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=512&h=512&fit=crop'
    };
    
    const patternKey = (data.texturePattern || 'plain').toLowerCase();
    const matchedPattern = Object.keys(patternMap).find(key => patternKey.includes(key));
    
    return {
      suggestedColor: data.suggestedColor || "#ffffff",
      designDescription: data.designDescription || "Desain kustom berdasarkan permintaan.",
      texturePattern: matchedPattern ? patternMap[matchedPattern] : null
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
