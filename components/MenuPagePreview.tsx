
import React, { forwardRef } from 'react';
import { MenuPage, HistoryItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { DeleteIcon, CameraIcon } from './Icons';
import ImageWithLoader from './ImageWithLoader';

interface MenuPagePreviewProps {
  page: MenuPage;
}

const MenuHeader: React.FC<{ theme: string }> = ({ theme }) => {
    const isDarkTheme = theme === 'FineDining';
    return (
        <div className="p-4 flex flex-col items-center border-b-2 border-current/50 mb-4">
            <CameraIcon className={`w-12 h-12 mb-2 ${isDarkTheme ? 'text-yellow-50/80' : 'text-stone-800/80'}`} />
            <h2 
                contentEditable 
                suppressContentEditableWarning 
                className="text-4xl font-bold tracking-widest outline-none focus:bg-current/10 px-2 rounded-md"
            >
                YOUR RESTAURANT
            </h2>
            <p 
                contentEditable 
                suppressContentEditableWarning
                className="text-sm mt-1 opacity-70 outline-none focus:bg-current/10 px-2 rounded-md"
            >
                Restaurant Details & Address
            </p>
        </div>
    );
};

const MenuPagePreview = forwardRef<HTMLDivElement, MenuPagePreviewProps>(({ page }, ref) => {
    const { menu, removeItemFromMenuPage, updateItemOnMenuPage } = useAppContext();
    const { t } = useLocalization();
    const { paperSize, theme, layoutType, advancedLayout, gridCols, gridRows, gap } = menu;
    
    const isLandscape = paperSize === 'A4-Landscape';
    const isA5 = paperSize === 'A5';
    
    const a4Width = 210;
    const a4Height = 297;
    const a5Width = 148;
    const a5Height = 210;

    const getPageDimensions = () => {
        if (isA5) return { w: a5Width, h: a5Height };
        if (isLandscape) return { w: a4Height, h: a4Width };
        return { w: a4Width, h: a4Height };
    };

    const { w, h } = getPageDimensions();
    const scale = 2; // For better display on screen
    const pageWidth = w * scale;
    const pageHeight = h * scale;

    const getStandardGridStyles = (itemCount: number) => {
        switch (layoutType) {
            case 'text-price':
                if (itemCount <= 12) return 'grid-cols-1';
                return 'grid-cols-2';
            case 'image-price':
                if (itemCount <= 4) return 'grid-cols-2';
                if (itemCount <= 6) return 'grid-cols-2';
                if (itemCount <= 9) return 'grid-cols-3';
                return 'grid-cols-3';
            case 'image-desc-price':
            default:
                if (itemCount <= 2) return 'grid-cols-1';
                if (itemCount <= 4) return 'grid-cols-2';
                if (itemCount <= 6) return 'grid-cols-2';
                return 'grid-cols-2';
        }
    };

    const getGridContainerProps = () => {
        if (advancedLayout) {
            return {
                className: 'flex-grow',
                style: {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridCols || 1}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridRows || 1}, minmax(0, 1fr))`,
                    gap: `${(gap || 0) * 4}px`, // 1 unit = 4px (like tailwind)
                }
            };
        } else {
            return {
                className: `grid flex-grow gap-4 ${getStandardGridStyles(page.items.length)}`,
                style: {}
            };
        }
    };
    
    const getThemeStyles = () => {
        switch (theme) {
            case 'Thai': return 'bg-yellow-50 text-red-900 font-[serif]';
            case 'Japanese': return 'bg-white text-gray-800 font-[sans-serif] border-2 border-red-500';
            case 'FineDining': return 'bg-gray-900 text-yellow-50 font-[serif]';
            case 'Bakery': return 'bg-pink-50 text-pink-900 font-[cursive]';
            case 'Cafe':
            default: return 'bg-stone-100 text-stone-800 font-[sans-serif]';
        }
    };

    const handleItemUpdate = (item: HistoryItem, field: keyof HistoryItem, value: string) => {
        const updatedValue = field === 'price' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value;
        const updatedItem = { ...item, [field]: updatedValue };
        updateItemOnMenuPage(updatedItem, page.id);
    };
    
    const renderItem = (item: HistoryItem) => {
        const baseItemClass = "overflow-hidden relative group p-2 flex h-full";
        const editableProps = (field: keyof HistoryItem) => ({
            contentEditable: true,
            suppressContentEditableWarning: true,
            onBlur: (e: React.FocusEvent<HTMLElement>) => handleItemUpdate(item, field, e.currentTarget.textContent || ''),
            className: "outline-none focus:bg-current/10 p-1 rounded-md"
        });

        const priceDisplay = `${item.price} ${t('currency.unit')}`;

        switch (layoutType) {
            case 'text-price':
                return (
                    <div className={`${baseItemClass} flex-row justify-between items-baseline border-b border-dashed border-current/30`}>
                        <h4 {...editableProps('name')} className="font-semibold text-base">{item.name}</h4>
                        <div className="flex-grow border-b border-dotted border-current/50 mx-2 mb-1"></div>
                        <div {...editableProps('price')} className="font-bold text-base">{priceDisplay}</div>
                    </div>
                );
            case 'image-price':
                 return (
                    <div className={`${baseItemClass} flex-col`}>
                        <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-full h-4/6 object-cover rounded-md"/>
                        <div className="flex justify-between items-baseline pt-2">
                             <h4 {...editableProps('name')} className="font-bold text-sm md:text-base">{item.name}</h4>
                             <div {...editableProps('price')} className="font-bold text-right text-sm md:text-base">{priceDisplay}</div>
                        </div>
                    </div>
                );
            case 'image-desc-price':
            default:
                return (
                    <div className={`${baseItemClass} flex-col`}>
                        <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-full h-3/5 object-cover rounded-lg"/>
                        <div className="pt-2 flex-1">
                            <h4 {...editableProps('name')} className="font-bold text-sm md:text-base">{item.name}</h4>
                            <p {...editableProps('description')} className="text-xs md:text-sm opacity-80">{item.description}</p>
                        </div>
                        <div {...editableProps('price')} className="font-bold text-right p-2 text-sm md:text-base">{priceDisplay}</div>
                    </div>
                );
        }
    };

    return (
        <div 
            ref={ref}
            id="pdf-content"
            className={`shadow-2xl p-8 flex flex-col ${getThemeStyles()}`}
            style={{ width: `${pageWidth}px`, height: `${pageHeight}px` }}
        >
            <MenuHeader theme={theme} />
            <div {...getGridContainerProps()}>
                {page.items.map(item => (
                     <div key={item.id} className="relative group">
                        {renderItem(item)}
                        <button 
                            onClick={() => removeItemFromMenuPage(item.id, page.id)}
                            className="absolute -top-1 -right-1 p-1 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            title="Remove"
                            data-html2canvas-ignore="true"
                        >
                            <DeleteIcon className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default MenuPagePreview;
