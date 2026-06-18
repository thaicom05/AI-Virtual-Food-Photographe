
import React, { useState } from 'react';
import { ImageStyle } from '../types';
import { CameraIcon, SparklesIcon, PaintBrushIcon } from './Icons';
import { useLocalization } from '../contexts/LocalizationContext';

interface MenuInputFormProps {
  onGenerate: (menuText: string, style: ImageStyle) => void;
  isLoading: boolean;
}

const MenuInputForm: React.FC<MenuInputFormProps> = ({ onGenerate, isLoading }) => {
  const { t } = useLocalization();
  const [menuText, setMenuText] = useState('');
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.BRIGHT_MODERN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(menuText, style);
  };

  const styleOptions = Object.values(ImageStyle);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl shadow-lg space-y-6">
      <div>
        <label htmlFor="menu-text" className="block text-sm font-medium text-gray-300 mb-2">
          {t('form.label')}
        </label>
        <textarea
          id="menu-text"
          value={menuText}
          onChange={(e) => setMenuText(e.target.value)}
          placeholder={t('form.placeholder')}
          rows={5}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <PaintBrushIcon className="w-5 h-5" /> {t('form.styleLabel')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {styleOptions.map((styleOpt) => (
            <button
              key={styleOpt}
              type="button"
              onClick={() => setStyle(styleOpt)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                style === styleOpt
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              disabled={isLoading}
            >
              {t(`style.${styleOpt}`)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !menuText.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
      >
        {isLoading ? (
          t('form.buttonLoading')
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            {t('form.button')}
          </>
        )}
      </button>
    </form>
  );
};

export default MenuInputForm;
