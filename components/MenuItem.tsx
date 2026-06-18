
import React, { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { EditIcon, DownloadIcon } from './Icons';
import { useLocalization } from '../contexts/LocalizationContext';
import ImageWithLoader from './ImageWithLoader';
import { getImage } from '../services/indexedDBService';

interface MenuItemProps {
  item: MenuItemType;
  onPriceChange: (id: string, newPrice: number) => void;
  onEditImage: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onPriceChange, onEditImage }) => {
  const { t } = useLocalization();
  const [price, setPrice] = useState(item.price);
  
  useEffect(() => {
      setPrice(item.price);
  }, [item.price]);

  const handlePriceBlur = () => {
    const newPrice = Number(price);
    if (!isNaN(newPrice) && newPrice !== item.price) {
      onPriceChange(item.id, newPrice);
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
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20 flex flex-col">
      <div className="relative group">
        <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button 
            onClick={() => onEditImage(item)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
            title={t('menuItem.editButton')}
          >
            <EditIcon className="w-5 h-5"/>
          </button>
           <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
            title={t('menuItem.downloadButton')}
          >
            <DownloadIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-white">{item.name}</h3>
        <p className="text-gray-400 mt-2 flex-grow">"{item.description}"</p>
        <div className="mt-4 flex justify-between items-center">
          <label htmlFor={`price-${item.id}`} className="text-lg font-semibold text-indigo-400">
            {t('menuItem.priceLabel')}
          </label>
          <div className="flex items-center gap-2">
            <input
              id={`price-${item.id}`}
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              onBlur={handlePriceBlur}
              className="w-24 bg-gray-700 text-white font-bold text-lg rounded-md p-2 text-right border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-lg font-semibold text-gray-300">{t('currency.unit')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
