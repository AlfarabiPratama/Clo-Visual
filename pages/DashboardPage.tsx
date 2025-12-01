import React, { useState } from 'react';
import { Link, useNavigate } from '../components/Navbar';
import { Plus, Clock, MoreVertical, Search } from 'lucide-react';
import { Project, GarmentType } from '../types';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Oversize Summer Tee',
    garmentType: 'T-Shirt',
    lastEdited: '2 jam yang lalu',
    thumbnailUrl: 'https://d2kchovjbwl1tk.cloudfront.net/vendor/240/product/14736B_1699072781215.jpg',
    description: 'Koleksi musim panas untuk target pasar remaja.'
  },
  {
    id: '2',
    name: 'Gamis Minimalis Raya',
    garmentType: 'Dress',
    lastEdited: '1 hari yang lalu',
    thumbnailUrl: 'https://picsum.photos/seed/gamis/300/200',
    description: 'Konsep warna earth tone.'
  },
  {
    id: '3',
    name: 'Batik Hari Raya',
    garmentType: 'T-Shirt', // Using T-shirt as base for prototype
    lastEdited: '3 hari yang lalu',
    thumbnailUrl: 'https://cdn-brilio-net.akamaized.net/real/2024/04/05/2249921/potret-lucu-desain-baju.jpg',
    description: 'Motif parang modifikasi.'
  }
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedType, setSelectedType] = useState<string>(GarmentType.TSHIRT);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    
    // In a real app, this would perform an API call.
    // For prototype, we just navigate to designer with state.
    navigate('/designer', { 
      state: { 
        isNew: true, 
        name: newProjectName, 
        type: selectedType 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Proyek Desain</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Kelola dan lanjutkan karya kreatif Anda.</p>
          </div>
          <div className="mt-3 sm:mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-xs sm:text-sm"
                placeholder="Cari proyek..."
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1.5 sm:mr-2" />
              Buat Desain Baru
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="h-36 sm:h-44 md:h-48 w-full bg-gray-200 relative">
                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold text-gray-700">
                  {project.garmentType}
                </div>
              </div>
              <div className="px-3 py-3 sm:px-4 sm:py-4 md:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 truncate">{project.name}</h3>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">{project.description}</p>
                <div className="mt-3 sm:mt-4 flex items-center justify-between">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Clock className="flex-shrink-0 mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    {project.lastEdited}
                  </div>
                  <Link 
                    to="/designer" 
                    state={{ isNew: false, project: project }}
                    className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-500"
                  >
                    Buka Editor &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            onClick={(e) => {
              // Close modal when clicking on backdrop
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal content */}
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
              <form onSubmit={handleCreateProject}>
                <div className="bg-white px-4 pt-4 pb-3 sm:p-6 sm:pb-4">
                  <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">Mulai Proyek Baru</h3>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Proyek</label>
                    <input 
                      type="text" 
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Contoh: Koleksi Lebaran 2024" 
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis Pakaian (Base Model)</label>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-xs sm:text-sm"
                    >
                      <option value={GarmentType.TSHIRT}>T-Shirt (Default)</option>
                      <option value={GarmentType.HOODIE}>Hoodie</option>
                      <option value={GarmentType.DRESS}>Dress</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 sm:px-4 py-2 bg-slate-600 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none sm:ml-0 sm:w-auto">
                    Buat Proyek
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-2 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 sm:px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-0 sm:w-auto">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;