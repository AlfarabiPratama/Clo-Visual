
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, BatchDesignResult, ColorPaletteResult } from "../types";

// AI Provider Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

// Initialize Gemini
const geminiAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Available AI providers
type AIProvider = 'gemini' | 'openai' | 'deepseek' | 'mock';

// Determine which provider to use (priority: Gemini > OpenAI > DeepSeek > Mock)
const getActiveProvider = (): AIProvider => {
  if (GEMINI_API_KEY && geminiAI) return 'gemini';
  if (OPENAI_API_KEY) return 'openai';
  if (DEEPSEEK_API_KEY) return 'deepseek';
  return 'mock';
};

// Special provider for chat assistant (force DeepSeek)
const getChatProvider = (): AIProvider => {
  if (DEEPSEEK_API_KEY) return 'deepseek';
  if (OPENAI_API_KEY) return 'openai';
  if (GEMINI_API_KEY && geminiAI) return 'gemini';
  return 'mock';
};

// Mock data to use if API key is missing or for rapid prototyping
const MOCK_DESIGN_RESPONSE: AiResponse = {
  suggestedColor: "#FF5733",
  designDescription: "Desain modern dengan sentuhan geometris dan palet warna hangat, cocok untuk gaya streetwear urban.",
  texturePattern: "https://picsum.photos/512/512?random=1" // Placeholder texture
};

// DeepSeek API Call Helper
const callDeepSeekAPI = async (messages: Array<{role: string, content: string}>, responseFormat?: 'json'): Promise<string> => {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {})
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

// OpenAI API Call Helper
const callOpenAI = async (messages: Array<{role: string, content: string}>, responseFormat?: 'json'): Promise<string> => {
  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {})
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

export const generateDesignFromText = async (prompt: string): Promise<AiResponse> => {
  const provider = getActiveProvider();
  
  if (provider === 'mock') {
    console.warn("No API Key found. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return MOCK_DESIGN_RESPONSE;
  }

  try {
    // Add timeout wrapper to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI request timeout')), 15000)
    );

    let apiPromise: Promise<any>;

    const designPrompt = `You are a professional fashion textile designer. Create a realistic fabric design based on this request:

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
- "Kaos navy blue dengan pattern batik" → suggestedColor: "#000080", texturePattern: "batik-modern"`;

    if (provider === 'gemini') {
      apiPromise = geminiAI!.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: designPrompt,
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
    } else if (provider === 'openai') {
      // OpenAI provider
      apiPromise = callOpenAI([
        { role: 'system', content: 'You are a professional fashion textile designer. Always return valid JSON responses.' },
        { role: 'user', content: designPrompt }
      ], 'json');
    } else {
      // DeepSeek provider
      apiPromise = callDeepSeekAPI([
        { role: 'system', content: 'You are a professional fashion textile designer. Always return valid JSON responses.' },
        { role: 'user', content: designPrompt }
      ], 'json');
    }

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    
    let data: any;
    if (provider === 'gemini') {
      data = JSON.parse(response.text || '{}');
    } else {
      // OpenAI and DeepSeek return string directly from our helper
      data = JSON.parse(response || '{}');
    }
    
    console.log('[AI Response]', data); // Debug log to see what Gemini returns
    
    // ============================================
    // OPSI B: Deteksi Intent Pattern dari User
    // ============================================
    // Cek apakah user benar-benar minta pattern/motif
    const userPrompt = prompt.toLowerCase();
    const patternKeywords = /motif|pattern|pola|garis|strip|bunga|floral|batik|geometr|texture|tekstur|print|cetakan/i;
    const wantsPattern = patternKeywords.test(userPrompt);
    
    // Kalau user TIDAK menyebut kata-kata pattern, tapi AI kasih pattern, override jadi plain
    if (!wantsPattern && data.texturePattern && data.texturePattern !== 'plain') {
      console.log('[Pattern Override]', 'User tidak request pattern, forcing plain color');
      data.texturePattern = 'plain';
    }
    
    // ============================================
    // OPSI A: Local Textures (CORS-Safe, No External Dependencies)
    // ============================================
    // Semua textures sudah tersedia di public/textures/ (SVG format - scalable & ringan)
    const patternMap: Record<string, string | null> = {
      // Geometric patterns
      'geometric': '/textures/hexagons.svg',
      'geometry': '/textures/hexagons.svg',
      'abstract': '/textures/hexagons.svg',
      
      // Floral patterns
      'floral': '/textures/moroccan-flower-dark.png',
      'flower': '/textures/moroccan-flower-dark.png',
      'bunga': '/textures/moroccan-flower-dark.png',
      
      // Stripes & lines
      'stripes': '/textures/stripes.svg',
      'stripe': '/textures/stripes.svg',
      'garis': '/textures/stripes.svg',
      
      // Fabric textures (jersey, knit)
      'jersey-knit': '/textures/fabric.svg',
      'jersey': '/textures/fabric.svg',
      'knit': '/textures/fabric.svg',
      
      // Cotton weave texture
      'cotton': '/textures/cotton.svg',
      'katun': '/textures/cotton.svg',
      
      // Denim texture
      'denim': '/textures/denim.svg',
      'jeans': '/textures/denim.svg',
      
      // Batik - Traditional Indonesian pattern
      'batik-modern': '/textures/batik.svg',
      'batik': '/textures/batik.svg',
      
      // No texture (solid color only)
      'plain': null,
      'polos': null,
      'solid': null
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
      userWantsPattern: wantsPattern,
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
  const provider = getActiveProvider();
  
  // Note: Image analysis works with Gemini and OpenAI, not DeepSeek
  if (provider === 'mock' || provider === 'deepseek') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      suggestedColor: "#3B82F6",
      designDescription: provider === 'deepseek' 
        ? "Analisis gambar memerlukan Gemini/OpenAI API. Gunakan Text-to-Design untuk hasil optimal."
        : "Dianalisis dari gambar referensi (Mode Demo): Gaya minimalis dengan aksen biru.",
      texturePattern: null
    };
  }

  try {
    if (provider === 'openai') {
      // OpenAI Vision API
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
      const base64Image = await base64Promise;

      const response = await callOpenAI([
        {
          role: 'user',
          content: `Analyze this fashion design image. Extract:
1. Dominant color (hex code)
2. Design style and description (Indonesian, 2-3 sentences)
3. Pattern type (keywords: jersey-knit, batik-modern, stripes, floral, geometric, plain, denim, cotton)

Image: ${base64Image}

Return JSON format with fields: suggestedColor, designDescription, texturePattern`
        }
      ], 'json');

      const data = JSON.parse(response || '{}');
      
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
    }
    // Convert image to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    const base64Image = await base64Promise;

    const response = await geminiAI!.models.generateContent({
      model: 'gemini-2.0-flash',
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
  const provider = getChatProvider(); // Use DeepSeek-first provider for chat
  
  if (provider === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "💡 **Mode Demo Aktif**\n\nSaya bisa membantu Anda dengan:\n• Saran warna dan kombinasi palet\n• Rekomendasi jenis kain untuk berbagai gaya\n• Tips desain untuk target pasar tertentu\n• Tren fashion terkini\n\nGunakan panel 'Text to Design' di sebelah kiri untuk membuat desain! Contoh: \"T-shirt cotton putih dengan geometric pattern hitam\"";
  }

  console.log('[Chat Assistant] Using provider:', provider); // Debug log

  try {
    // Add timeout for chat requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Chat request timeout')), 15000)
    );

    const systemPrompt = `Anda adalah asisten desain fashion untuk Clo Visual - aplikasi desain 3D garment berbasis AI.

IDENTITAS:
- Nama: Asisten Clo Visual
- Bahasa: Bahasa Indonesia (utama), English (jika diminta)
- Expertise: Fashion design, textile, pattern, color theory, garment production

TUGAS ANDA:
1. Membantu designer membuat keputusan desain (warna, pattern, fabric)
2. Memberikan saran praktis untuk produksi garment
3. Menjelaskan tren fashion dan aplikasinya
4. Merekomendasikan kombinasi material dan teknik

GAYA KOMUNIKASI:
- Ramah, profesional, to-the-point
- Gunakan emoji untuk visual appeal (tapi jangan berlebihan)
- Berikan contoh konkret dan actionable
- Jika user bertanya tentang desain, beri saran spesifik (warna hex, jenis kain, dll)

CONTOH RESPONSE BAGUS:
User: "Mau buat hoodie untuk anak muda"
Anda: "🎨 Untuk target anak muda, saya sarankan:\n\n**Warna:** Navy blue (#1e293b) atau black (#0f172a) - timeless & versatile\n**Fabric:** French terry 280gsm - comfortable & durable\n**Style:** Oversized fit dengan kangaroo pocket\n**Detail:** Bisa tambah print graphic minimalis di chest atau back\n\nMau saya buatkan prompt untuk generate texture pattern-nya?"

PENTING: Jawab dalam Bahasa Indonesia kecuali user minta English.`;

    let chatPromise: Promise<any>;
    
    if (provider === 'gemini') {
      chatPromise = geminiAI!.models.generateContent({
        model: 'gemini-2.0-flash',
        systemInstruction: systemPrompt,
        contents: [
          // Convert history to proper format
          ...history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          })),
          // Add new message
          {
            role: 'user',
            parts: [{ text: newMessage }]
          }
        ]
      });
    } else if (provider === 'openai') {
      // OpenAI provider
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: newMessage }
      ];
      chatPromise = callOpenAI(messages);
    } else {
      // DeepSeek provider
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: newMessage }
      ];
      chatPromise = callDeepSeekAPI(messages);
    }

    const response = await Promise.race([chatPromise, timeoutPromise]) as any;
    
    let replyText: string;
    if (provider === 'gemini') {
      replyText = response.text || "Maaf, saya tidak dapat menghasilkan respon saat ini. Silakan coba lagi.";
    } else {
      // OpenAI and DeepSeek return string directly
      replyText = response || "Maaf, saya tidak dapat menghasilkan respon saat ini. Silakan coba lagi.";
    }
    
    console.log('[Chat AI] Response:', replyText.substring(0, 100) + '...');
    return replyText;
    
  } catch (error: any) {
    console.error("Chat Error:", error);
    
    // Specific error messages
    if (error.message === 'Chat request timeout') {
      return "⏱️ Maaf, response terlalu lama. Silakan coba pertanyaan yang lebih spesifik atau coba lagi.";
    }
    
    if (error.message?.includes('API key')) {
      return "🔑 API key tidak valid. Silakan hubungi administrator atau gunakan panel 'Text to Design' untuk membuat desain.";
    }
    
    return "❌ Maaf, saya sedang mengalami gangguan. Silakan coba lagi atau gunakan panel 'Text to Design' untuk membuat desain langsung.";
  }
};

// Generate 5 design variations from a single prompt
export const generateBatchDesigns = async (prompt: string): Promise<BatchDesignResult> => {
  const provider = getActiveProvider();
  
  if (provider === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      originalPrompt: prompt,
      variations: [
        {
          id: 1,
          styleName: "Streetwear",
          suggestedColor: "#1a1a1a",
          designDescription: "Bold dan edgy dengan sentuhan urban street culture",
          texturePattern: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop"
        },
        {
          id: 2,
          styleName: "Premium",
          suggestedColor: "#2c3e50",
          designDescription: "Elegant dan sophisticated untuk target market premium",
          texturePattern: null
        },
        {
          id: 3,
          styleName: "Sporty",
          suggestedColor: "#e74c3c",
          designDescription: "Dynamic dan energetic untuk aktivitas olahraga",
          texturePattern: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=512&h=512&fit=crop"
        },
        {
          id: 4,
          styleName: "Casual",
          suggestedColor: "#3498db",
          designDescription: "Comfortable dan versatile untuk daily wear",
          texturePattern: null
        },
        {
          id: 5,
          styleName: "Minimalist",
          suggestedColor: "#ecf0f1",
          designDescription: "Clean dan simple dengan fokus pada kualitas material",
          texturePattern: null
        }
      ]
    };
  }

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Batch generation timeout')), 20000)
    );

    let batchPromise: Promise<any>;
    
    const systemPrompt = `Generate 5 different design variations for a garment based on user prompt.
Each variation should have a distinct style (Streetwear, Premium, Sporty, Casual, Minimalist).
Return JSON array with: styleName, suggestedColor (hex), designDescription (Indonesian, concise), texturePattern (keywords: jersey-knit, batik-modern, stripes, floral, geometric, plain, denim, cotton).
Make each variation unique and appealing.`;

    if (provider === 'gemini') {
      batchPromise = geminiAI!.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser prompt: "${prompt}"` }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              variations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    styleName: { type: Type.STRING },
                    suggestedColor: { type: Type.STRING },
                    designDescription: { type: Type.STRING },
                    texturePattern: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
    } else if (provider === 'openai') {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 5 variations for: "${prompt}"` }
      ];
      batchPromise = callOpenAI(messages, 'json');
    } else {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 5 variations for: "${prompt}"` }
      ];
      batchPromise = callDeepSeekAPI(messages, 'json');
    }

    const response = await Promise.race([batchPromise, timeoutPromise]) as any;
    
    let data: any;
    if (provider === 'gemini') {
      data = JSON.parse(response.text || '{}');
    } else {
      // OpenAI and DeepSeek return string
      data = JSON.parse(response || '{}');
    }

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

    const variations = (data.variations || []).map((v: any, index: number) => {
      const patternKey = (v.texturePattern || 'plain').toLowerCase();
      const matchedPattern = Object.keys(patternMap).find(key => patternKey.includes(key));
      
      return {
        id: index + 1,
        styleName: v.styleName || `Style ${index + 1}`,
        suggestedColor: v.suggestedColor || '#3B82F6',
        designDescription: v.designDescription || 'Variasi desain menarik',
        texturePattern: matchedPattern ? patternMap[matchedPattern] : null
      };
    });

    return {
      originalPrompt: prompt,
      variations: variations.slice(0, 5)
    };
    
  } catch (error: any) {
    console.error("Batch generation error:", error);
    throw error;
  }
};

// Generate harmonious color palette with psychology insights
export const generateColorPalette = async (context: string): Promise<ColorPaletteResult> => {
  const provider = getActiveProvider();
  
  if (provider === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      paletteDescription: "Palet warna musim panas yang fresh dan energetic",
      targetMarket: "Gen Z dan Millennial (18-35 tahun)",
      seasonRecommendation: "Perfect untuk koleksi Spring/Summer 2025",
      colors: [
        { hex: "#3B82F6", name: "Ocean Blue", psychology: "Trust, calm, professional" },
        { hex: "#F59E0B", name: "Sunset Orange", psychology: "Energy, enthusiasm, warmth" },
        { hex: "#10B981", name: "Mint Green", psychology: "Fresh, growth, harmony" },
        { hex: "#EC4899", name: "Coral Pink", psychology: "Playful, youthful, friendly" },
        { hex: "#F3F4F6", name: "Cloud White", psychology: "Clean, minimal, spacious" }
      ]
    };
  }

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Color palette timeout')), 15000)
    );

    let palettePromise: Promise<any>;
    
    const systemPrompt = `Generate a harmonious 5-color palette for fashion design based on context.
Include color psychology and market insights.
Return JSON with: colors (array of {hex, name, psychology}), paletteDescription (Indonesian), targetMarket, seasonRecommendation.
Make it professional and trendy for 2025.`;

    if (provider === 'gemini') {
      palettePromise = geminiAI!.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ parts: [{ text: `${systemPrompt}\n\nContext: "${context}"` }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              paletteDescription: { type: Type.STRING },
              targetMarket: { type: Type.STRING },
              seasonRecommendation: { type: Type.STRING },
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING },
                    name: { type: Type.STRING },
                    psychology: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
    } else if (provider === 'openai') {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate color palette for: "${context}"` }
      ];
      palettePromise = callOpenAI(messages, 'json');
    } else {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate color palette for: "${context}"` }
      ];
      palettePromise = callDeepSeekAPI(messages, 'json');
    }

    const response = await Promise.race([palettePromise, timeoutPromise]) as any;
    
    let data: any;
    if (provider === 'gemini') {
      data = JSON.parse(response.text || '{}');
    } else {
      // OpenAI and DeepSeek return string
      data = JSON.parse(response || '{}');
    }

    return {
      paletteDescription: data.paletteDescription || "Palet warna harmonis",
      targetMarket: data.targetMarket || "Target market umum",
      seasonRecommendation: data.seasonRecommendation || "Cocok untuk berbagai musim",
      colors: (data.colors || []).slice(0, 5).map((c: any) => ({
        hex: c.hex || '#3B82F6',
        name: c.name || 'Color',
        psychology: c.psychology || 'Versatile'
      }))
    };
    
  } catch (error: any) {
    console.error("Color palette error:", error);
    throw error;
  }
};
