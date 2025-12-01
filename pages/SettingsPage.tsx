import React, { useState } from 'react';
import { User, Key, CreditCard, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'profile' | 'account' | 'api' | 'billing';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile states
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || 'User');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  
  // API Keys states
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  
  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [designUpdates, setDesignUpdates] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Pengaturan berhasil disimpan!');
  };

  const tabs = [
    { id: 'profile' as TabType, name: 'Profil', icon: User },
    { id: 'account' as TabType, name: 'Akun', icon: Shield },
    { id: 'api' as TabType, name: 'API Keys', icon: Key },
    { id: 'billing' as TabType, name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="mt-2 text-gray-600">Kelola akun dan preferensi Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-slate-600 text-slate-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Profil</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Profil
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-slate-600 flex items-center justify-center text-white text-2xl font-bold">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Ubah Foto
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Tampilan
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="Nama Anda"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="Ceritakan sedikit tentang Anda..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Keamanan Akun</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferensi</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notifikasi Email</p>
                        <p className="text-sm text-gray-500">Terima update via email</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${emailNotifications ? 'bg-slate-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Update Desain</p>
                        <p className="text-sm text-gray-500">Notifikasi saat desain selesai diproses</p>
                      </div>
                      <button
                        onClick={() => setDesignUpdates(!designUpdates)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${designUpdates ? 'bg-slate-600' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${designUpdates ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">API Keys Kustom</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Gunakan API key Anda sendiri untuk akses unlimited. Kosongkan untuk menggunakan API key sistem (dengan limitasi).
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Gemini API Key
                      </label>
                      <input
                        type="password"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent font-mono text-sm"
                        placeholder="AIza..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Dapatkan di <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">Google AI Studio</a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent font-mono text-sm"
                        placeholder="sk-proj-..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Dapatkan di <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">OpenAI Platform</a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DeepSeek API Key
                      </label>
                      <input
                        type="password"
                        value={deepseekKey}
                        onChange={(e) => setDeepseekKey(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent font-mono text-sm"
                        placeholder="sk-..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Dapatkan di <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">DeepSeek Platform</a>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start">
                      <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Keamanan API Key</p>
                        <p>API key Anda disimpan secara lokal di browser dan tidak pernah dikirim ke server kami. Kami hanya menggunakan API key untuk mengirim request ke provider AI yang Anda pilih.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Paket Saat Ini</h3>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-slate-50 to-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Free Plan</h4>
                        <p className="text-gray-600">10 desain per bulan</p>
                      </div>
                      <div className="text-3xl font-bold text-slate-600">$0</div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-600 mr-2">✓</span>
                        Text-to-Design AI
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-600 mr-2">✓</span>
                        Sketch-to-3D
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-600 mr-2">✓</span>
                        3D Viewer Interaktif
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-600 mr-2">✓</span>
                        Ekspor PNG & 3D
                      </div>
                    </div>

                    <a
                      href="#/pricing"
                      className="block w-full text-center px-6 py-3 bg-slate-600 text-white rounded-md font-medium hover:bg-slate-700 transition-colors"
                    >
                      Upgrade ke Pro
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Riwayat Pembayaran</h3>
                  <p className="text-sm text-gray-500">Belum ada riwayat pembayaran</p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`
                  flex items-center px-6 py-3 rounded-md font-medium text-white transition-colors
                  ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700'}
                `}
              >
                <Save className="h-5 w-5 mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
