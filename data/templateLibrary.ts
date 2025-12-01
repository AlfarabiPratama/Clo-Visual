// Template Library - Pre-designed 3D garment templates
// Helps beginner designers and solo workers save time

export interface DesignTemplate {
  id: string;
  name: string;
  category: 'casual' | 'formal' | 'streetwear' | 'sportswear' | 'vintage' | 'minimalist';
  garmentType: 'T-Shirt' | 'Hoodie' | 'Dress';
  thumbnail: string;
  color: string;
  textureUrl: string | null;
  description: string;
  fit: 'Regular' | 'Slim' | 'Oversized';
  tags: string[];
  popularity: number;
}

export const TEMPLATE_LIBRARY: DesignTemplate[] = [
  // CASUAL T-SHIRTS
  {
    id: 'basic-white-tee',
    name: 'Basic White Tee',
    category: 'casual',
    garmentType: 'T-Shirt',
    thumbnail: '🎽',
    color: '#FFFFFF',
    textureUrl: null,
    description: 'Kaos putih polos klasik - sempurna untuk daily wear atau sebagai base design',
    fit: 'Regular',
    tags: ['basic', 'versatile', 'essential'],
    popularity: 95
  },
  {
    id: 'black-essential',
    name: 'Black Essential',
    category: 'minimalist',
    garmentType: 'T-Shirt',
    thumbnail: '⬛',
    color: '#000000',
    textureUrl: null,
    description: 'Kaos hitam minimalis - timeless piece untuk semua style',
    fit: 'Regular',
    tags: ['minimalist', 'timeless', 'versatile'],
    popularity: 92
  },
  {
    id: 'navy-classic',
    name: 'Navy Classic',
    category: 'casual',
    garmentType: 'T-Shirt',
    thumbnail: '🔷',
    color: '#1e3a8a',
    textureUrl: null,
    description: 'Kaos navy blue - professional casual look',
    fit: 'Regular',
    tags: ['professional', 'casual', 'versatile'],
    popularity: 88
  },
  {
    id: 'heather-grey',
    name: 'Heather Grey',
    category: 'casual',
    garmentType: 'T-Shirt',
    thumbnail: '⚪',
    color: '#9ca3af',
    textureUrl: null,
    description: 'Kaos abu-abu melange - comfortable athleisure vibe',
    fit: 'Regular',
    tags: ['athleisure', 'comfortable', 'relaxed'],
    popularity: 85
  },
  
  // STREETWEAR T-SHIRTS
  {
    id: 'oversized-black',
    name: 'Oversized Black',
    category: 'streetwear',
    garmentType: 'T-Shirt',
    thumbnail: '🖤',
    color: '#1a1a1a',
    textureUrl: null,
    description: 'Kaos oversized hitam - perfect untuk streetwear aesthetic',
    fit: 'Oversized',
    tags: ['streetwear', 'oversized', 'urban'],
    popularity: 90
  },
  {
    id: 'ash-grey',
    name: 'Ash Grey',
    category: 'vintage',
    garmentType: 'T-Shirt',
    thumbnail: '⚪',
    color: '#9ca3af',
    textureUrl: null,
    description: 'Kaos ash grey - timeless neutral dengan vintage vibe',
    fit: 'Regular',
    tags: ['neutral', 'vintage', 'timeless'],
    popularity: 82
  },
  
  // NEUTRAL TONES
  {
    id: 'light-grey',
    name: 'Light Grey',
    category: 'casual',
    garmentType: 'T-Shirt',
    thumbnail: '⚪',
    color: '#d1d5db',
    textureUrl: null,
    description: 'Kaos light grey - soft neutral untuk daily wear',
    fit: 'Regular',
    tags: ['neutral', 'versatile', 'modern'],
    popularity: 87
  },
  {
    id: 'warm-beige',
    name: 'Warm Beige',
    category: 'casual',
    garmentType: 'T-Shirt',
    thumbnail: '🤎',
    color: '#d4c5b0',
    textureUrl: null,
    description: 'Kaos warm beige - neutral tone yang sophisticated',
    fit: 'Slim',
    tags: ['neutral', 'sophisticated', 'versatile'],
    popularity: 83
  },
  {
    id: 'charcoal-grey',
    name: 'Charcoal Grey',
    category: 'streetwear',
    garmentType: 'T-Shirt',
    thumbnail: '⬛',
    color: '#4b5563',
    textureUrl: null,
    description: 'Kaos charcoal grey - versatile urban piece',
    fit: 'Regular',
    tags: ['neutral', 'urban', 'versatile'],
    popularity: 78
  },
  {
    id: 'slate-grey',
    name: 'Slate Grey',
    category: 'formal',
    garmentType: 'T-Shirt',
    thumbnail: '⬜',
    color: '#64748b',
    textureUrl: null,
    description: 'Kaos slate grey - sophisticated & professional',
    fit: 'Slim',
    tags: ['neutral', 'sophisticated', 'professional'],
    popularity: 80
  },

  // HOODIES
  {
    id: 'black-hoodie-basic',
    name: 'Black Hoodie Essential',
    category: 'casual',
    garmentType: 'Hoodie',
    thumbnail: '🖤',
    color: '#1a1a1a',
    textureUrl: null,
    description: 'Hoodie hitam polos - everyday essential',
    fit: 'Regular',
    tags: ['hoodie', 'essential', 'comfortable'],
    popularity: 94
  },
  {
    id: 'grey-melange-hoodie',
    name: 'Grey Melange Hoodie',
    category: 'casual',
    garmentType: 'Hoodie',
    thumbnail: '⚪',
    color: '#a8a8a8',
    textureUrl: null,
    description: 'Hoodie grey melange - cozy & stylish',
    fit: 'Regular',
    tags: ['hoodie', 'cozy', 'casual'],
    popularity: 89
  },
  {
    id: 'oversized-hoodie-cream',
    name: 'Oversized Cream Hoodie',
    category: 'streetwear',
    garmentType: 'Hoodie',
    thumbnail: '🤍',
    color: '#f5f5dc',
    textureUrl: null,
    description: 'Hoodie oversized cream - relaxed streetwear',
    fit: 'Oversized',
    tags: ['hoodie', 'oversized', 'streetwear'],
    popularity: 91
  },
  {
    id: 'navy-athletic-hoodie',
    name: 'Navy Athletic Hoodie',
    category: 'sportswear',
    garmentType: 'Hoodie',
    thumbnail: '🔷',
    color: '#1e3a8a',
    textureUrl: null,
    description: 'Hoodie navy athletic - performance & style',
    fit: 'Regular',
    tags: ['hoodie', 'athletic', 'sportswear'],
    popularity: 84
  },
  {
    id: 'stone-grey-hoodie',
    name: 'Stone Grey Hoodie',
    category: 'casual',
    garmentType: 'Hoodie',
    thumbnail: '⚪',
    color: '#78716c',
    textureUrl: null,
    description: 'Hoodie stone grey - neutral casual aesthetic',
    fit: 'Regular',
    tags: ['hoodie', 'neutral', 'casual'],
    popularity: 81
  },

  // DRESSES
  {
    id: 'black-minimalist-dress',
    name: 'Black Minimalist Dress',
    category: 'minimalist',
    garmentType: 'Dress',
    thumbnail: '👗',
    color: '#1a1a1a',
    textureUrl: null,
    description: 'Dress hitam minimalis - elegant & versatile',
    fit: 'Regular',
    tags: ['dress', 'minimalist', 'elegant'],
    popularity: 88
  },
  {
    id: 'white-summer-dress',
    name: 'White Summer Dress',
    category: 'casual',
    garmentType: 'Dress',
    thumbnail: '🤍',
    color: '#FFFFFF',
    textureUrl: null,
    description: 'Dress putih summer - fresh & feminine',
    fit: 'Regular',
    tags: ['dress', 'summer', 'feminine'],
    popularity: 86
  },
  {
    id: 'taupe-dress',
    name: 'Taupe Dress',
    category: 'formal',
    garmentType: 'Dress',
    thumbnail: '👗',
    color: '#a89f91',
    textureUrl: null,
    description: 'Dress taupe - elegant & sophisticated neutral',
    fit: 'Regular',
    tags: ['dress', 'elegant', 'neutral'],
    popularity: 84
  },
  {
    id: 'navy-midi-dress',
    name: 'Navy Midi Dress',
    category: 'formal',
    garmentType: 'Dress',
    thumbnail: '💙',
    color: '#1e3a8a',
    textureUrl: null,
    description: 'Dress navy midi - professional & chic',
    fit: 'Slim',
    tags: ['dress', 'professional', 'chic'],
    popularity: 82
  },
  {
    id: 'greige-dress',
    name: 'Greige Dress',
    category: 'vintage',
    garmentType: 'Dress',
    thumbnail: '👗',
    color: '#a89f8c',
    textureUrl: null,
    description: 'Dress greige (grey+beige) - neutral vintage style',
    fit: 'Regular',
    tags: ['dress', 'neutral', 'vintage'],
    popularity: 79
  }
];

// Helper functions
export const getTemplatesByCategory = (category: string) => {
  return TEMPLATE_LIBRARY.filter(t => t.category === category);
};

export const getTemplatesByGarmentType = (garmentType: string) => {
  return TEMPLATE_LIBRARY.filter(t => t.garmentType === garmentType);
};

export const getPopularTemplates = (limit: number = 6) => {
  return TEMPLATE_LIBRARY
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const searchTemplates = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return TEMPLATE_LIBRARY.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
