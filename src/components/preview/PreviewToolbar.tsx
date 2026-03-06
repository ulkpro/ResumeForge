import { useState } from 'react';
import { Download, Settings2 } from 'lucide-react';
import type { LayoutSettings } from '../../types';
import { LayoutControls } from '../editor/LayoutControls';
import { FontControls } from '../editor/FontControls';
import { Type } from 'lucide-react';

interface PreviewToolbarProps {
    onReset: () => void;
    onExportPDF: () => void;
    layout: LayoutSettings;
    setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
}

export function PreviewToolbar({ onReset, onExportPDF, layout, setLayout }: PreviewToolbarProps) {
    const [isLayoutOpen, setIsLayoutOpen] = useState(false);
    const [isFontOpen, setIsFontOpen] = useState(false);

    return (
        <div className="absolute top-6 left-8 right-8 z-20 flex justify-between pointer-events-none">
            {/* Left side: Controls */}
            <div className="flex gap-4 pointer-events-auto">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm"
                >
                    Reset All
                </button>
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsLayoutOpen(!isLayoutOpen);
                            if (!isLayoutOpen) setIsFontOpen(false);
                        }}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm h-full"
                    >
                        <Settings2 size={18} className="stroke-2" />
                        Layout Settings
                    </button>
                    {isLayoutOpen && (
                        <div className="absolute top-full left-0 mt-3 w-80 bg-white z-50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-2">
                            <LayoutControls layout={layout} setLayout={setLayout} />
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            setIsFontOpen(!isFontOpen);
                            if (!isFontOpen) setIsLayoutOpen(false);
                        }}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm h-full"
                    >
                        <Type size={18} className="stroke-2" />
                        Font Settings
                    </button>
                    {isFontOpen && (
                        <div className="absolute top-full left-0 mt-3 w-80 bg-white z-50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 p-2">
                            <FontControls layout={layout} setLayout={setLayout} />
                        </div>
                    )}
                </div>
            </div>

            {/* Right side: Export */}
            <div className="flex gap-4 pointer-events-auto">
                <button
                    onClick={onExportPDF}
                    className="flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl shadow-[0_4px_14px_0_theme(colors.sky.300)] transition-all font-semibold"
                >
                    <Download size={20} className="stroke-2" />
                    <span className="tracking-wide">Export PDF</span>
                </button>
            </div>
        </div>
    );
}
