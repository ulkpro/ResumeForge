import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    sectionKey: string;
    isCollapsed: boolean;
    onToggle: (key: string) => void;
}

export function SectionHeader({ icon: Icon, title, sectionKey, isCollapsed, onToggle }: SectionHeaderProps) {
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
            <div className="text-sky-400 group-hover:text-sky-600">
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
            </div>
        </div>
    );
}
