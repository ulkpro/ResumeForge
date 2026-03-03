import { useState } from 'react';
import { Download, Settings2 } from 'lucide-react';
import type { LayoutSettings } from '../../types';
import { LayoutControls } from '../editor/LayoutControls';

interface PreviewToolbarProps {
    onReset: () => void;
    onExportPDF: () => void;
    layout: LayoutSettings;
    setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
}

export function PreviewToolbar({ onReset, onExportPDF, layout, setLayout }: PreviewToolbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute top-6 right-8 z-20 flex gap-4">
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm"
            >
                Reset All
            </button>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm h-full"
                >
                    <Settings2 size={18} className="stroke-2" />
                    Layout Settings
                </button>
                {isOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 bg-white z-50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-2">
                        <LayoutControls layout={layout} setLayout={setLayout} />
                    </div>
                )}
            </div>
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
