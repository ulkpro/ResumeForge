import type { LayoutSettings } from '../types';

export const handleExportPDF = async (layout: LayoutSettings) => {
    // Inject dynamic print styling for the correct page size
    const isA4 = layout.pageSize === 'A4';
    const styleId = 'dynamic-print-style';
    
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
        @page {
            size: ${isA4 ? 'A4 portrait' : 'letter portrait'};
            margin: 0;
        }
    `;

    // Trigger native print dialog which can save as text-based PDF
    // A slight delay ensures styles are applied before print dialogue opens
    setTimeout(() => {
        window.print();
    }, 100);
};
