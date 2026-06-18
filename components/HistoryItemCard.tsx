
import React from 'react';
import { HistoryItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { AddToMenuIcon, DeleteIcon, DownloadIcon, EditIcon } from './Icons';
import { getImage } from '../services/indexedDBService';
import ImageWithLoader from './ImageWithLoader';

interface HistoryItemCardProps {
  item: HistoryItem;
  onEdit: (item: HistoryItem) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onEdit }) => {
  const { deleteHistoryItem, addItemToMenuPage, menu, setView, currentPageIndex } = useAppContext();
  const { t } = useLocalization();

  const handleAddToMenu = () => {
    const currentPageId = menu.pages[currentPageIndex]?.id;
    if (currentPageId) {
      addItemToMenuPage(item, currentPageId);
      setView('menu-builder');
    } else if (menu.pages.length > 0) {
      // Fallback to first page if index is somehow invalid
      addItemToMenuPage(item, menu.pages[0].id);
      setView('menu-builder');
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('history.confirmDelete'))) {
      deleteHistoryItem(item.id);
    }
  };
  
  const handleDownload = async () => {
    const imageUrl = await getImage(item.imageId);
    if (!imageUrl) {
      alert("Image data not found!");
      return;
    }
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${item.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg flex flex-col group">
      <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white truncate" title={item.name}>{item.name}</h3>
        <p className="text-sm text-gray-400 mt-1 flex-grow truncate" title={item.prompt}>
          {item.prompt}
        </p>
        <div className="text-xs text-gray-500 mt-2">
            {new Date(item.timestamp).toLocaleString()}
        </div>
      </div>
       <div className="p-2 bg-gray-800 border-t border-gray-700 flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleAddToMenu} title={t('history.addToMenu')} className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-indigo-400 transition-colors">
                <AddToMenuIcon className="w-5 h-5"/>
            </button>
            <button onClick={() => onEdit(item)} title={t('menuItem.editButton')} className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-yellow-400 transition-colors">
                <EditIcon className="w-5 h-5"/>
            </button>
            <button onClick={handleDownload} title={t('history.download')} className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-green-400 transition-colors">
                <DownloadIcon className="w-5 h-5"/>
            </button>
            <button onClick={handleDelete} title={t('history.delete')} className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-red-500 transition-colors">
                <DeleteIcon className="w-5 h-5"/>
            </button>
        </div>
    </div>
  );
};

export default HistoryItemCard;
