import html2pdf from 'html2pdf.js';
import type { LayoutSettings } from '../types';

export const handleExportPDF = async (layout: LayoutSettings) => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;

    // Fix for html2canvas infinite loop bug with modern CSS properties
    // like text-wrap and large box-shadows.
    const fixStyle = document.createElement('style');
    fixStyle.innerHTML = `* { text-wrap: initial !important; box-shadow: none !important; }`;
    document.head.appendChild(fixStyle);

    // Use format based on page size. The CSS padding serves as the margin, so html2pdf margins can be 0.
    const opt: any = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 4, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: layout.pageSize.toLowerCase(), orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (err) {
        console.error("PDF generation error:", err);
        alert("There was an error generating the PDF. Check console.");
    } finally {
        document.head.removeChild(fixStyle);
    }
};
