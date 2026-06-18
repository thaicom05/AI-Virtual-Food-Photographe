
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { HistoryItem, MenuDesign, MenuPage } from '../types';
import { deleteImage } from '../services/indexedDBService';

type View = 'generator' | 'history' | 'menu-builder';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  history: HistoryItem[];
  addItemsToHistory: (items: HistoryItem[]) => void;
  updateHistoryItem: (updatedItem: HistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  menu: MenuDesign;
  updateMenu: (newMenu: Partial<MenuDesign>) => void;
  addItemToMenuPage: (item: HistoryItem, pageId: string) => void;
  updateItemOnMenuPage: (item: HistoryItem, pageId: string) => void;
  removeItemFromMenuPage: (itemId: string, pageId: string) => void;
  addMenuPage: () => void;
  removeMenuPage: (pageId: string) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMenu: MenuDesign = {
  paperSize: 'A4-Portrait',
  layoutType: 'image-desc-price',
  theme: 'Cafe',
  pages: [{ id: 'page-1', items: [] }],
  advancedLayout: false,
  gridCols: 2,
  gridRows: 3,
  gap: 4,
};

const MAX_HISTORY_ITEMS = 20;

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    const loaded = JSON.parse(item);
    if (Array.isArray(defaultValue)) {
      return (Array.isArray(loaded) ? loaded : defaultValue) as unknown as T;
    }
    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return { ...defaultValue, ...loaded };
    }
    return loaded as T;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('generator');
  const [history, setHistory] = useState<HistoryItem[]>(() => loadFromLocalStorage('promptHistory', []));
  const [menu, setMenu] = useState<MenuDesign>(() => loadFromLocalStorage('menuDesign', initialMenu));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('menuDesign', JSON.stringify(menu));
    } catch (error) {
        console.error('Failed to save menu to localStorage:', error);
    }
  }, [menu]);

  // Ensure currentPageIndex is valid when menu.pages changes
  useEffect(() => {
    if (currentPageIndex >= menu.pages.length) {
      setCurrentPageIndex(Math.max(0, menu.pages.length - 1));
    }
  }, [menu.pages, currentPageIndex]);

  const addItemsToHistory = (items: HistoryItem[]) => {
    setHistory(prev => [...items, ...prev].slice(0, MAX_HISTORY_ITEMS));
  };

  const updateHistoryItem = (updatedItem: HistoryItem) => {
    setHistory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    deleteImage(id).catch(err => console.error(`Failed to delete image ${id} from DB`, err));
  };

  const updateMenu = (newMenu: Partial<MenuDesign>) => {
    setMenu(prev => ({ ...prev, ...newMenu }));
  };

  const addItemToMenuPage = (item: HistoryItem, pageId: string) => {
    setMenu(prevMenu => {
      const newPages = prevMenu.pages.map(page => {
        if (page.id === pageId) {
          if (page.items.some(i => i.id === item.id)) return page;
          return { ...page, items: [...page.items, item] };
        }
        return page;
      });
      return { ...prevMenu, pages: newPages };
    });
  };

  const updateItemOnMenuPage = (updatedItem: HistoryItem, pageId: string) => {
    setMenu(prevMenu => ({
        ...prevMenu,
        pages: prevMenu.pages.map(p => 
            p.id === pageId ? { ...p, items: p.items.map(item => item.id === updatedItem.id ? updatedItem : item) } : p
        )
    }));
  };
  
  const removeItemFromMenuPage = (itemId: string, pageId: string) => {
      setMenu(prevMenu => ({
          ...prevMenu,
          pages: prevMenu.pages.map(p => 
              p.id === pageId ? { ...p, items: p.items.filter(item => item.id !== itemId) } : p
          )
      }));
  };

  const addMenuPage = () => {
    const newPage: MenuPage = { id: `page-${Date.now()}`, items: [] };
    setMenu(prev => {
        const newPages = [...prev.pages, newPage];
        setCurrentPageIndex(newPages.length - 1);
        return { ...prev, pages: newPages };
    });
  };

  const removeMenuPage = (pageId: string) => {
    if (menu.pages.length <= 1) return; // Prevent deleting the last page
    setMenu(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== pageId)
    }));
  };


  return (
    <AppContext.Provider value={{ 
      view, setView, 
      history, addItemsToHistory, deleteHistoryItem, updateHistoryItem,
      menu, updateMenu, addItemToMenuPage, removeItemFromMenuPage, updateItemOnMenuPage,
      addMenuPage, removeMenuPage, currentPageIndex, setCurrentPageIndex
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
