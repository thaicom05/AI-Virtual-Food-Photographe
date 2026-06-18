
import React, { useState } from 'react';
import { ImageStyle, MenuItem as MenuItemType, HistoryItem } from '../types';
import { generateMenuItems, editMenuItemImage } from '../services/geminiService';
import { getImage, saveImage } from '../services/indexedDBService';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import MenuInputForm from '../components/MenuInputForm';
import MenuDisplay from '../components/MenuDisplay';
import ImageEditorModal from '../components/ImageEditorModal';
import Loader from '../components/Loader';
import { SparklesIcon } from '../components/Icons';

const GeneratorView: React.FC = () => {
  const { t } = useLocalization();
  const { addItemsToHistory, updateHistoryItem } = useAppContext();
  const [generatedItems, setGeneratedItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
  
  const handleError = (err: unknown) => {
    console.error(err);
    setError(t('error.generationFailed'));
  };

  const handleGenerateMenu = async (menuText: string, style: ImageStyle) => {
    if (!menuText.trim()) {
      setError(t('error.emptyMenu'));
      return;
    }
    setIsLoading(true);
    setLoadingMessage(t('loader.analyzing'));
    setError(null);
    setGeneratedItems([]);

    try {
      const itemsWithHistory = await generateMenuItems(menuText, style, (progress) => {
        setLoadingMessage(t(progress.key, progress.variables));
      });
      setGeneratedItems(itemsWithHistory);
      addItemsToHistory(itemsWithHistory);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    const updater = (items: HistoryItem[]) => items.map(item =>
      item.id === id ? { ...item, price: newPrice } : item
    );
    setGeneratedItems(updater);
    // Also update history if the item is there
    updateHistoryItem({ ...generatedItems.find(i => i.id === id)!, price: newPrice });
  };
  
  const handleStartEdit = (item: MenuItemType) => {
    setEditingItem(item as HistoryItem);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleConfirmEdit = async (itemToEdit: MenuItemType, editPrompt: string) => {
     if (!editPrompt.trim()) return;

    setIsLoading(true);
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
        ...(itemToEdit as HistoryItem),
        prompt: `${(itemToEdit as HistoryItem).prompt}, edited: ${editPrompt}`,
        timestamp: Date.now(),
      };

      updateHistoryItem(updatedItem);
      setGeneratedItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));

    } catch (err) {
       console.error(err);
       setError(t('error.editFailed'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <>
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-200">
          {t('generator.title')}
        </h2>
        <p className="text-md text-gray-400 max-w-2xl mx-auto mt-2">
          {t('header.subtitle')}
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto">
        <MenuInputForm onGenerate={handleGenerateMenu} isLoading={isLoading} />
        {error && <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
      </div>

      {isLoading && <Loader message={loadingMessage} />}

      {!isLoading && generatedItems.length > 0 && (
        <MenuDisplay
          items={generatedItems}
          onPriceChange={handlePriceChange}
          onEditImage={handleStartEdit}
        />
      )}
      
      {!isLoading && generatedItems.length === 0 && !error && (
        <div className="text-center mt-16 text-gray-500">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-600"/>
            <h3 className="text-2xl font-semibold text-gray-400">{t('welcome.title')}</h3>
            <p className="mt-2">{t('welcome.subtitle')}</p>
        </div>
      )}
      
      {editingItem && (
        <ImageEditorModal
          item={editingItem}
          onClose={handleCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      )}
    </>
  );
};

export default GeneratorView;
