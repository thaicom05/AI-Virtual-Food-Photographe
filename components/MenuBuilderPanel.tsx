
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { PaperSize, MenuTheme, MenuLayoutType, HistoryItem } from '../types';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from './Icons';
import ImageWithLoader from './ImageWithLoader';

interface MenuSettingsPanelProps {
    onExport: () => void;
}

interface CardProps {
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const StepCard: React.FC<CardProps> = ({ title, description, selected, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-left p-4 border rounded-lg transition-all ${
            selected && !disabled
                ? 'bg-indigo-600 border-indigo-500 shadow-lg'
                : 'bg-gray-700 border-gray-600'
        } ${
            disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-600 hover:border-gray-500'
        }`}
    >
        <h4 className={`font-bold ${disabled ? 'text-gray-400' : 'text-white'}`}>{title}</h4>
        <p className={`text-sm ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>{description}</p>
    </button>
);

const MenuBuilderPanel: React.FC<MenuSettingsPanelProps> = ({ onExport }) => {
    const { menu, updateMenu, history, addItemToMenuPage, currentPageIndex } = useAppContext();
    const { t } = useLocalization();
    const { advancedLayout, gridCols, gridRows, gap } = menu;

    const handleAddItemFromHistory = (item: HistoryItem) => {
        const currentPageId = menu.pages[currentPageIndex]?.id;
        if (currentPageId) {
            addItemToMenuPage(item, currentPageId);
        }
    };
    
    const handleAdvancedToggle = () => {
        updateMenu({ advancedLayout: !advancedLayout });
    };

    return (
        <div className="space-y-6">
            {/* Step 1: Layout */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-200">STEP 1: Choose Menu Style</h3>
                <div className="space-y-2">
                    <StepCard
                        title={t('menuBuilder.layout.textPrice.title')}
                        description={t('menuBuilder.layout.textPrice.desc')}
                        selected={menu.layoutType === 'text-price'}
                        onClick={() => updateMenu({ layoutType: 'text-price' })}
                        disabled={advancedLayout}
                    />
                    <StepCard
                        title={t('menuBuilder.layout.imagePrice.title')}
                        description={t('menuBuilder.layout.imagePrice.desc')}
                        selected={menu.layoutType === 'image-price'}
                        onClick={() => updateMenu({ layoutType: 'image-price' })}
                        disabled={advancedLayout}
                    />
                    <StepCard
                        title={t('menuBuilder.layout.imageDescPrice.title')}
                        description={t('menuBuilder.layout.imageDescPrice.desc')}
                        selected={menu.layoutType === 'image-desc-price'}
                        onClick={() => updateMenu({ layoutType: 'image-desc-price' })}
                        disabled={advancedLayout}
                    />
                </div>
            </div>

            {/* Advanced Settings Toggle and Panel */}
            <div className="space-y-3 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <label htmlFor="advanced-toggle" className="flex items-center gap-2 text-md font-semibold text-indigo-400">
                        <SettingsIcon className="w-5 h-5"/>
                        {t('menuBuilder.advancedSettings.title')}
                    </label>
                    <button
                        id="advanced-toggle"
                        onClick={handleAdvancedToggle}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                            advancedLayout ? 'bg-indigo-600' : 'bg-gray-600'
                        }`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            advancedLayout ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>
                {advancedLayout && (
                     <div className="space-y-4 pt-4 border-t border-gray-700/50">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="grid-cols" className="block text-sm font-medium text-gray-300 mb-1">{t('menuBuilder.advancedSettings.gridCols')}</label>
                                <input id="grid-cols" type="number" min="1" max="6" value={gridCols} onChange={(e) => updateMenu({ gridCols: parseInt(e.target.value) || 1 })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"/>
                            </div>
                             <div>
                                <label htmlFor="grid-rows" className="block text-sm font-medium text-gray-300 mb-1">{t('menuBuilder.advancedSettings.gridRows')}</label>
                                <input id="grid-rows" type="number" min="1" max="8" value={gridRows} onChange={(e) => updateMenu({ gridRows: parseInt(e.target.value) || 1 })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"/>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="item-spacing" className="block text-sm font-medium text-gray-300 mb-1">{t('menuBuilder.advancedSettings.itemSpacing')} ({gap})</label>
                             <input id="item-spacing" type="range" min="0" max="16" value={gap} onChange={(e) => updateMenu({ gap: parseInt(e.target.value) })} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                        </div>
                    </div>
                )}
            </div>

            {/* Step 2: Paper & Theme */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-200">STEP 2: Select Size & Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="paper-size" className="block text-sm font-medium text-gray-300 mb-1">{t('menuBuilder.paperSize')}</label>
                        <select id="paper-size" value={menu.paperSize} onChange={(e) => updateMenu({ paperSize: e.target.value as PaperSize })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
                            <option value="A4-Portrait">{t('menuBuilder.portrait')}</option>
                            <option value="A4-Landscape">{t('menuBuilder.landscape')}</option>
                            <option value="A5">{t('menuBuilder.a5')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="menu-theme" className="block text-sm font-medium text-gray-300 mb-1">{t('menuBuilder.theme')}</label>
                        <select id="menu-theme" value={menu.theme} onChange={(e) => updateMenu({ theme: e.target.value as MenuTheme })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
                            <option value="Thai">{t('themes.Thai')}</option>
                            <option value="Cafe">{t('themes.Cafe')}</option>
                            <option value="Japanese">{t('themes.Japanese')}</option>
                            <option value="FineDining">{t('themes.FineDining')}</option>
                            <option value="Bakery">{t('themes.Bakery')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Step 3: Add Items */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-200">STEP 3: Add Items from History</h3>
                 <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg bg-gray-800 p-2 border border-gray-700">
                    {history.length > 0 ? history.map(item => (
                        <button key={item.id} onClick={() => handleAddItemFromHistory(item)} className="w-full flex items-center gap-3 p-2 rounded-md bg-gray-700 hover:bg-indigo-600 transition-colors">
                            <ImageWithLoader imageId={item.imageId} alt={item.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0"/>
                            <span className="text-sm font-medium text-left truncate flex-grow">{item.name}</span>
                            <PlusCircleIcon className="w-6 h-6 text-gray-400 flex-shrink-0"/>
                        </button>
                    )) : (
                        <p className="text-center text-sm text-gray-500 py-4">{t('menuBuilder.noHistory')}</p>
                    )}
                </div>
            </div>

            {/* Step 4: Download */}
             <div className="space-y-3">
                 <h3 className="text-lg font-semibold text-gray-200">STEP 4: Download Your Menu</h3>
                <button onClick={onExport} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all">
                    <DownloadIcon className="w-6 h-6" />
                    {t('menuBuilder.exportPdf')}
                </button>
            </div>
        </div>
    );
};

export default MenuBuilderPanel;
