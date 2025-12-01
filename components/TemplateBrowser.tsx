import React, { useState } from 'react';
import { X, Search, Sparkles, TrendingUp } from 'lucide-react';
import { TEMPLATE_LIBRARY, getPopularTemplates, searchTemplates, DesignTemplate } from '../data/templateLibrary';
import { DesignState } from '../types';

interface TemplateBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DesignTemplate) => void;
}

const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'popular', name: '🔥 Popular', icon: TrendingUp },
    { id: 'casual', name: '👕 Casual' },
    { id: 'streetwear', name: '🎨 Streetwear' },
    { id: 'minimalist', name: '⚪ Minimalist' },
    { id: 'vintage', name: '📻 Vintage' },
    { id: 'sportswear', name: '⚽ Sportswear' },
    { id: 'formal', name: '👔 Formal' },
  ];

  const getFilteredTemplates = () => {
    if (searchQuery) {
      return searchTemplates(searchQuery);
    }
    if (activeCategory === 'popular') {
      return getPopularTemplates(12);
    }
    return TEMPLATE_LIBRARY.filter(t => t.category === activeCategory);
  };

  const templates = getFilteredTemplates();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-600" />
                Template Library
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pilih dari {TEMPLATE_LIBRARY.length}+ design siap pakai untuk mempercepat workflow Anda
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari template berdasarkan nama, style, atau tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-6 py-3 bg-gray-50 border-b overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-slate-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-gray-500">Tidak ada template ditemukan</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-slate-600 hover:text-slate-700 font-medium"
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-slate-500 hover:shadow-lg transition-all"
                >
                  {/* Thumbnail */}
                  <div 
                    className="h-40 flex items-center justify-center text-6xl relative"
                    style={{ 
                      backgroundColor: template.color,
                      backgroundImage: template.textureUrl ? `url(${template.textureUrl})` : 'none',
                      backgroundSize: 'cover'
                    }}
                  >
                    {!template.textureUrl && (
                      <span className="opacity-30">{template.thumbnail}</span>
                    )}
                    
                    {/* Popularity Badge */}
                    {template.popularity >= 85 && (
                      <div className="absolute top-2 right-2 bg-slate-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {template.popularity}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-slate-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {template.garmentType}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {template.fit}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            💡 <strong>Pro Tip:</strong> Klik template untuk langsung apply ke canvas. Anda bisa edit warna, texture, dan fit setelahnya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateBrowser;
