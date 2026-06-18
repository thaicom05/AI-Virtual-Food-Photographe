import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { SettingsIcon } from './Icons';

const ApiKeySelector: React.FC = () => {
  const { t } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('custom_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    if (trimmedKey) {
      localStorage.setItem('custom_gemini_api_key', trimmedKey);
      setIsSaved(true);
      setIsOpen(false);
      // Reload page or let service pick it up dynamically
      window.location.reload();
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    localStorage.removeItem('custom_gemini_api_key');
    setApiKey('');
    setIsSaved(false);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
          isSaved
            ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300 hover:bg-emerald-900/50'
            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700'
        }`}
        title={isSaved ? 'Custom Gemini API Key Saved' : 'Gemini API Settings'}
      >
        <SettingsIcon className="w-4 h-4 animate-pulse-slow" />
        <span className="hidden sm:inline">
          {isSaved ? 'API: Custom' : 'API: Default'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsOpen(false)}
          />
          {/* Popover Card */}
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
            <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2 mb-2">
              <SettingsIcon className="w-4 h-4 text-indigo-400" />
              <span>Gemini API Configuration</span>
            </h3>
            
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              If the shared default key hits a quota rate limit (Error 429), you can enter your own free Gemini API key to continue uninterrupted.
            </p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-gray-950 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-1.5 px-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                {isSaved && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-950/40 border border-red-800 hover:bg-red-900/50 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Use Default
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiKeySelector;
