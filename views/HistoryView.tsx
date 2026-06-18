
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import HistoryItemCard from '../components/HistoryItemCard';
import { HistoryIcon } from '../components/Icons';
import { HistoryItem } from '../types';
import ImageEditorModal from '../components/ImageEditorModal';
import Loader from '../components/Loader';
import { editMenuItemImage } from '../services/geminiService';
import { getImage, saveImage } from '../services/indexedDBService';

const HistoryView: React.FC = () => {
  const { history, updateHistoryItem } = useAppContext();
  const { t } = useLocalization();
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = (item: HistoryItem) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleConfirmEdit = async (itemToEdit: HistoryItem, editPrompt: string) => {
    if (!editPrompt.trim()) return;

    setIsEditing(true);
    setLoadingMessage(t('loader.editing', { prompt: editPrompt }));
    setError(null);
    setEditingItem(null);

    try {
      const originalImageUrl = await getImage(itemToEdit.imageId);
      if (!originalImageUrl) {
        throw new Error("Original image not found in database.");
      }
      
      const newImageUrl = await editMenuItemImage(originalImageUrl, editPrompt);
      await saveImage(itemToEdit.imageId, newImageUrl);

      const updatedItem: HistoryItem = {
        ...itemToEdit,
        prompt: `${itemToEdit.prompt}, edited: ${editPrompt}`,
        timestamp: Date.now(),
      };
      updateHistoryItem(updatedItem);
    } catch (err) {
      console.error(err);
      setError(t('error.editFailed'));
    } finally {
      setIsEditing(false);
      setLoadingMessage('');
    }
  };


  return (
    <>
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-200">
          {t('history.title')}
        </h2>
        <p className="text-md text-gray-400 max-w-2xl mx-auto mt-2">
          {t('history.subtitle')}
        </p>
      </header>
      
      {error && <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}

      {isEditing && <Loader message={loadingMessage} />}

      {history.length === 0 ? (
        <div className="text-center mt-16 text-gray-500">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-600"/>
            <h3 className="text-2xl font-semibold text-gray-400">{t('history.emptyTitle')}</h3>
            <p className="mt-2">{t('history.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map(item => (
            <HistoryItemCard key={item.id} item={item} onEdit={handleStartEdit} />
          ))}
        </div>
      )}
      
      {editingItem && (
        <ImageEditorModal
          item={editingItem}
          onClose={handleCancelEdit}
          onConfirm={(item, prompt) => handleConfirmEdit(item as HistoryItem, prompt)}
        />
      )}
    </>
  );
};

export default HistoryView;
