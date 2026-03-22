import { ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    sectionKey: string;
    isCollapsed: boolean;
    isVisible?: boolean;
    onToggle: (key: string) => void;
    onToggleVisibility?: (key: string) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export function SectionHeader({ icon: Icon, title, sectionKey, isCollapsed, isVisible, onToggle, onToggleVisibility, onMoveUp, onMoveDown }: SectionHeaderProps) {
    return (
        <div
            className="flex items-center justify-between mb-4 border-b border-sky-100 pb-2 cursor-pointer hover:bg-sky-50/50 p-2 rounded transition-colors group"
            onClick={() => onToggle(sectionKey)}
        >
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-md group-hover:bg-sky-200 transition-colors">
                    <Icon size={18} />
                </div>
                <h2 className="text-xl font-bold text-sky-900 select-none">{title}</h2>
            </div>
            <div className="flex items-center gap-1">
                <div className="flex items-center mr-3 text-sm text-slate-500 hover:text-slate-800" onClick={e => e.stopPropagation()}>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                            checked={isVisible !== false}
                            onChange={() => onToggleVisibility?.(sectionKey)}
                            title="Toggle visibility in preview"
                        />
                        <span className="select-none text-xs font-semibold">Show</span>
                    </label>
                </div>
                <div className="text-sky-400 group-hover:text-sky-600 mr-2 flex items-center">
                    {onMoveUp && <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1 hover:bg-sky-200 rounded" title="Move category up"><ArrowUp size={16} /></button>}
                    {onMoveDown && <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1 hover:bg-sky-200 rounded" title="Move category down"><ArrowDown size={16} /></button>}
                </div>
                <div className="text-sky-400 group-hover:text-sky-600">
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
        </div>
    );
}
