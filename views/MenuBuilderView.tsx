
import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import MenuBuilderPanel from '../components/MenuBuilderPanel';
import MenuPagePreview from '../components/MenuPagePreview';
import Loader from '../components/Loader';
import { BookOpenIcon, DeleteIcon, PlusCircleIcon } from '../components/Icons';

const MenuBuilderView: React.FC = () => {
  const { t } = useLocalization();
  const { menu, currentPageIndex, setCurrentPageIndex, addMenuPage, removeMenuPage } = useAppContext();
  const pagePreviewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!pagePreviewRef.current || menu.pages.length === 0) return;
    setIsExporting(true);

    const originalIndex = currentPageIndex;
    const pdf = new jsPDF({
      orientation: menu.paperSize === 'A4-Landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: menu.paperSize === 'A5' ? 'a5' : 'a4',
    });

    for (let i = 0; i < menu.pages.length; i++) {
      setCurrentPageIndex(i);
      // Wait for React to re-render the correct page
      await new Promise(resolve => setTimeout(resolve, 200));

      const pageElement = pagePreviewRef.current;
      if (pageElement) {
        const canvas = await html2canvas(pageElement, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
    }

    pdf.save(`Menu_${new Date().toISOString().split('T')[0]}.pdf`);
    
    // Restore original state
    setCurrentPageIndex(originalIndex);
    setIsExporting(false);
  };
  
  const handleDeletePage = () => {
    if (menu.pages.length > 1 && window.confirm(`Are you sure you want to delete page ${currentPageIndex + 1}?`)) {
      removeMenuPage(menu.pages[currentPageIndex].id);
    }
  };

  const currentPage = menu.pages[currentPageIndex];

  return (
    <>
      {isExporting && <Loader message="Exporting all pages to PDF..." />}
      <div className="flex flex-col md:flex-row gap-8 h-full">
        <div className="w-full md:w-96 flex-shrink-0">
          <header className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-gray-200 flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8"/>
                {t('menuBuilder.title')}
              </h2>
              <p className="text-md text-gray-400 mt-2">
                {t('menuBuilder.subtitle')}
              </p>
          </header>
          <MenuBuilderPanel onExport={handleExport} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-start gap-4">
          <div className="flex-1 bg-gray-900/50 p-4 rounded-lg flex items-center justify-center overflow-auto border border-gray-800 w-full">
            {currentPage ? (
              <div className="transform scale-90 origin-top">
                <MenuPagePreview ref={pagePreviewRef} page={currentPage} />
              </div>
            ) : (
              <p className="text-gray-500">{t('menuBuilder.noPages')}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700">
             <button
              onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
              disabled={currentPageIndex === 0}
              className="px-4 py-2 rounded-md disabled:opacity-50 enabled:hover:bg-gray-700 transition-colors"
            >
              &larr; Prev
            </button>
             <span className="font-semibold text-gray-300 px-4">
              Page {currentPageIndex + 1} of {menu.pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
              disabled={currentPageIndex >= menu.pages.length - 1}
              className="px-4 py-2 rounded-md disabled:opacity-50 enabled:hover:bg-gray-700 transition-colors"
            >
              Next &rarr;
            </button>
            <div className="w-px h-6 bg-gray-600 mx-2"></div>
             <button onClick={addMenuPage} className="p-2 text-green-400 hover:bg-gray-700 rounded-md transition-colors" title="Add New Page">
                <PlusCircleIcon className="w-6 h-6"/>
            </button>
            <button onClick={handleDeletePage} disabled={menu.pages.length <= 1} className="p-2 text-red-500 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50" title="Delete Current Page">
                <DeleteIcon className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBuilderView;
