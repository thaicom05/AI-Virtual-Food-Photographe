
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperSize } from '../types';

export const exportToPdf = async (element: HTMLElement, paperSize: PaperSize) => {
  const isLandscape = paperSize === 'A4-Landscape';
  
  // Use a higher scale for better resolution (300 DPI equivalent)
  const scale = 300 / 96; 
  
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true, 
    logging: true,
    backgroundColor: null, // Use element's background
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  const fileName = `Menu_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
