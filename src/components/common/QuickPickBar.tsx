import React, { useState } from 'react';
import { Zap, Check, RotateCcw, CheckCheck } from 'lucide-react';

interface CompanyInfo {
    name: string;
    groups: string[];
}

interface QuickPickBarProps {
    companies?: CompanyInfo[];
    onApply: (command: string) => { selectedIds: string[]; unselectedIds: string[]; summary: string };
    onClearAll: () => void;
    onSelectAll: () => void;
}

export function QuickPickBar({
    companies = [],
    onApply,
    onClearAll,
    onSelectAll
}: QuickPickBarProps) {
    const [command, setCommand] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleExecute = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!command.trim()) return;

        const res = onApply(command);
        setStatusMessage(res.summary);
        setTimeout(() => setStatusMessage(null), 4000);
    };

    const appendPrefix = (prefix: string) => {
        setCommand(prev => {
            const trimmed = prev.trim();
            if (!trimmed) return `${prefix}: `;
            if (trimmed.endsWith(';') || trimmed.endsWith('|')) {
                return `${trimmed} ${prefix}: `;
            }
            return `${trimmed} | ${prefix}: `;
        });
    };

    const firstComp = companies[0]?.name ? companies[0].name.split(/[\s,\-]+/)[0] : 'Company 1';
    const secondComp = companies[1]?.name ? companies[1].name.split(/[\s,\-]+/)[0] : 'Company 2';

    return (
        <div className="mb-4 p-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                    <Zap size={14} className="text-amber-500 fill-amber-500" />
                    <span>Quick Pick Master Experience</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onSelectAll}
                        className="text-[10px] text-sky-700 hover:text-sky-900 hover:bg-sky-100/80 px-2 py-0.5 rounded transition-colors font-medium flex items-center gap-1"
                        title="Select all points in master experience"
                    >
                        <CheckCheck size={11} /> Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="text-[10px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1 font-medium"
                        title="Uncheck all points in master experience"
                    >
                        <RotateCcw size={11} /> Clear All
                    </button>
                </div>
            </div>

            {/* The Unified Input Field */}
            <form onSubmit={handleExecute} className="flex items-center gap-1.5">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder={`${firstComp}: Tech 1, 4; Leadership 2 | ${secondComp}: Tech 1, 3`}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono placeholder:text-slate-400"
                        autoFocus
                    />
                </div>
                <button
                    type="submit"
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                    <Check size={13} /> Apply
                </button>
            </form>

            {/* Dynamic Helper Chips based on loaded companies & groups */}
            {companies.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">Quick tags:</span>
                    {companies.map(comp => {
                        const shortName = comp.name.split(/[\s,\-]+/)[0];
                        return comp.groups.slice(0, 3).map(grp => (
                            <button
                                key={`${shortName}-${grp}`}
                                type="button"
                                onClick={() => appendPrefix(`${shortName}: ${grp}`)}
                                className="text-[10px] px-2 py-0.5 bg-white text-slate-700 hover:text-sky-700 hover:border-sky-300 border border-slate-200 rounded-md font-medium transition-colors shadow-2xs"
                            >
                                + {shortName}: {grp}
                            </button>
                        ));
                    })}
                </div>
            )}

            {statusMessage && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 animate-fadeIn font-medium">
                    <Check size={13} className="text-emerald-600 flex-shrink-0" />
                    <span>{statusMessage}</span>
                </div>
            )}
        </div>
    );
}
