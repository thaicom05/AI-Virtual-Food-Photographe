
import React, { useState } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { SparklesIcon } from './Icons';
import { useLocalization } from '../contexts/LocalizationContext';
import ImageWithLoader from './ImageWithLoader';

interface ImageEditorModalProps {
  item: MenuItemType;
  onClose: () => void;
  onConfirm: (item: MenuItemType, editPrompt: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ item, onClose, onConfirm }) => {
  const { t } = useLocalization();
  const [editPrompt, setEditPrompt] = useState('');

  const handleConfirm = () => {
    if (editPrompt.trim()) {
      onConfirm(item, editPrompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{t('modal.title', { name: item.name })}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-full md:w-1/2 h-auto object-cover rounded-lg" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('modal.label')}
                </label>
                <textarea
                  id="edit-prompt"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder={t('modal.placeholder')}
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  {t('modal.cancel')}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!editPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="w-5 h-5"/>
                  {t('modal.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
