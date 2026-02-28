import { Download } from 'lucide-react';

interface PreviewToolbarProps {
    onReset: () => void;
    onExportPDF: () => void;
}

export function PreviewToolbar({ onReset, onExportPDF }: PreviewToolbarProps) {
    return (
        <div className="absolute top-6 right-8 z-10 flex gap-4">
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm"
            >
                Reset All
            </button>
            <button
                onClick={onExportPDF}
                className="flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl shadow-[0_4px_14px_0_theme(colors.sky.300)] transition-all font-semibold"
            >
                <Download size={20} className="stroke-2" />
                <span className="tracking-wide">Export PDF</span>
            </button>
        </div>
    );
}
