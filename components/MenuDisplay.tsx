
import React from 'react';
import { MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';
import { useLocalization } from '../contexts/LocalizationContext';

interface MenuDisplayProps {
  items: MenuItemType[];
  onPriceChange: (id: string, newPrice: number) => void;
  onEditImage: (item: MenuItemType) => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ items, onPriceChange, onEditImage }) => {
  const { t } = useLocalization();
  return (
    <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-200">{t('menuDisplay.title')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {items.map((item) => (
                <MenuItem 
                    key={item.id} 
                    item={item} 
                    onPriceChange={onPriceChange} 
                    onEditImage={onEditImage}
                />
            ))}
        </div>
    </div>
  );
};

export default MenuDisplay;
