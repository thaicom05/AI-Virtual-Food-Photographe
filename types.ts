
export enum ImageStyle {
  RUSTIC_DARK = 'Rustic/Dark',
  BRIGHT_MODERN = 'Bright/Modern',
  SOCIAL_FLAT_LAY = 'Social Media (Flat Lay)',
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageId: string;
}

export interface ProgressUpdate {
  key: string;
  variables?: Record<string, string | number>;
}

export interface HistoryItem extends MenuItem {
  timestamp: number;
  style: ImageStyle;
  prompt: string;
}

export type PaperSize = 'A4-Portrait' | 'A4-Landscape' | 'A5';
export type MenuTheme = 'Thai' | 'Cafe' | 'Japanese' | 'FineDining' | 'Bakery';
export type PageLayout = '1x1' | '2x2' | '2x3' | '3x3'; // This can be deprecated or moved to advanced
export type MenuLayoutType = 'text-price' | 'image-price' | 'image-desc-price';

export interface MenuPage {
  id: string;
  items: HistoryItem[];
}

export interface MenuDesign {
  paperSize: PaperSize;
  layoutType: MenuLayoutType;
  theme: MenuTheme;
  pages: MenuPage[];
  // Advanced Layout Settings
  advancedLayout?: boolean;
  gridCols?: number;
  gridRows?: number;
  gap?: number;
}
