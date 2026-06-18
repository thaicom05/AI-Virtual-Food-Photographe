
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { SparklesIcon, HistoryIcon, BookOpenIcon } from './Icons';

const Sidebar: React.FC = () => {
  const { view, setView } = useAppContext();
  const { t } = useLocalization();

  const navItems = [
    { id: 'generator', label: t('sidebar.generator'), icon: SparklesIcon },
    { id: 'history', label: t('sidebar.history'), icon: HistoryIcon },
    { id: 'menu-builder', label: t('sidebar.menuBuilder'), icon: BookOpenIcon },
  ];

  return (
    <aside className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 flex flex-col">
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-colors ${
              view === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <footer className="mt-auto text-center text-gray-500 text-xs">
          <p>{t('footer')}</p>
      </footer>
    </aside>
  );
};

export default Sidebar;
