
import React from 'react';
import { useLocalization } from './contexts/LocalizationContext';
import { useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import GeneratorView from './views/GeneratorView';
import HistoryView from './views/HistoryView';
import MenuBuilderView from './views/MenuBuilderView';
import { CameraIcon } from './components/Icons';
import ApiKeySelector from './components/ApiKeySelector';

const App: React.FC = () => {
  const { t, locale, setLocale } = useLocalization();
  const { view } = useAppContext();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'th' : 'en');
  };

  const renderView = () => {
    switch (view) {
      case 'history':
        return <HistoryView />;
      case 'menu-builder':
        return <MenuBuilderView />;
      case 'generator':
      default:
        return <GeneratorView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <CameraIcon className="w-8 h-8 text-indigo-400"/>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                    {t('header.title')}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <ApiKeySelector />
                <button
                    onClick={toggleLocale}
                    className="bg-gray-800/50 border border-gray-700 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {t('langToggle')}
                </button>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
