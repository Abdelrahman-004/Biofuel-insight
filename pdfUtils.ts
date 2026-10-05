import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element #${elementId} not found, falling back to window.print()`);
    window.print();
    return;
  }

  // Save original styles
  const originalStyle = element.getAttribute('style') || '';
  const isDark = document.documentElement.classList.contains('dark');
  
  try {
    const canvas = await html2canvas(element, {
      scale: 1.5, // Optimal resolution that prevents canvas memory limits
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: isDark ? '#0B111A' : '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '1100px';
          clonedElement.style.maxWidth = '1100px';
          clonedElement.style.padding = '30px';
          clonedElement.style.backgroundColor = isDark ? '#0B111A' : '#ffffff';
          clonedElement.style.transform = 'none';
          clonedElement.style.boxShadow = 'none';
        }
        
        // Show print-only elements
        const printOnlyElements = clonedDoc.querySelectorAll('.print-only');
        printOnlyElements.forEach((el: any) => {
          el.style.setProperty('display', 'flex', 'important');
        });
        
        // Hide no-print elements
        const noPrintElements = clonedDoc.querySelectorAll('.no-print');
        noPrintElements.forEach((el: any) => {
          el.style.setProperty('display', 'none', 'important');
        });
      }
    });

    // Revert original styles immediately after capturing
    element.setAttribute('style', originalStyle);

    // Calculate margins and dimensions for A4
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const margin = 8;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const imgHeight = (canvasHeight * availableWidth) / canvasWidth;
    let heightLeft = imgHeight;
    let position = margin;

    // Render first page
    pdf.addImage(imgData, 'JPEG', margin, position, availableWidth, imgHeight);
    heightLeft -= availableHeight;

    // Render additional pages if needed
    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, availableWidth, imgHeight);
      heightLeft -= availableHeight;
    }

    // Download file
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error("PDF generation via html2canvas failed, falling back to window.print()", error);
    element.setAttribute('style', originalStyle);
    // Reliable fallback: Browser native print dialog (Save as PDF)
    window.print();
  }
};
