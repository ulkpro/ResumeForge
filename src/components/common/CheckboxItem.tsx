import { useState } from 'react';
import type { ResumePoint } from '../../utils/parser';
import { Pencil, Trash2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';

interface CheckboxItemProps {
    point: ResumePoint;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onEdit?: (id: string, text: string, tagsStr: string, group?: string) => void;
    onDelete?: (id: string) => void;
    onMove?: (id: string, direction: 'up' | 'down') => void;
    availableGroups?: string[];
}

export function CheckboxItem({
    point,
    isSelected,
    onToggle,
    onEdit,
    onDelete,
    onMove,
    availableGroups = ['General', 'AWS', 'Completablefuture', 'Kafka', 'Spring Boot', 'Database & Cache', 'Other']
}: CheckboxItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editVal, setEditVal] = useState(point.text);
    const [tagsVal, setTagsVal] = useState(point.tags.join(', '));
    const [groupVal, setGroupVal] = useState(point.group || 'General');
    const [isCustomGroup, setIsCustomGroup] = useState(false);
    const [customGroupText, setCustomGroupText] = useState('');

    const handleSave = () => {
        if (onEdit) {
            const finalGroup = isCustomGroup ? customGroupText.trim() : groupVal;
            onEdit(point.id, editVal, tagsVal, finalGroup || 'Other');
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-2 p-3 bg-sky-50 rounded-lg border border-sky-200 shadow-sm mt-1 mb-2">
                <textarea
                    className="w-full text-sm p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    rows={2}
                    value={editVal}
                    placeholder="Point text..."
                    onChange={e => setEditVal(e.target.value)}
                />

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Sub-Group:</span>
                    {!isCustomGroup ? (
                        <div className="flex gap-1.5 flex-1">
                            <select
                                value={groupVal}
                                onChange={e => {
                                    if (e.target.value === '__NEW__') {
                                        setIsCustomGroup(true);
                                    } else {
                                        setGroupVal(e.target.value);
                                    }
                                }}
                                className="text-xs p-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-sky-400 font-medium text-slate-700 flex-1"
                            >
                                {availableGroups.filter(g => g !== 'Other').map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                                {!availableGroups.includes(groupVal) && groupVal && groupVal !== 'Other' && (
                                    <option value={groupVal}>{groupVal}</option>
                                )}
                                <option value="Other">Other (ungrouped)</option>
                                <option value="__NEW__">+ Add Custom Group...</option>
                            </select>
                        </div>
                    ) : (
                        <div className="flex gap-1.5 flex-1">
                            <input
                                type="text"
                                placeholder="Type new group name..."
                                value={customGroupText}
                                onChange={e => setCustomGroupText(e.target.value)}
                                className="text-xs p-1.5 border border-slate-300 rounded-md bg-white flex-1 focus:ring-2 focus:ring-sky-400 font-medium text-slate-700"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setIsCustomGroup(false)}
                                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-200 rounded"
                            >
                                Pick Existing
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    className="w-full text-xs p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    value={tagsVal}
                    placeholder="Tags (comma separated)... Java, React, SQL"
                    onChange={e => setTagsVal(e.target.value)}
                />
                <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
                        <X size={14} /> Cancel
                    </button>
                    <button onClick={handleSave} className="px-3 py-1.5 text-xs bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-1 border border-sky-600 rounded-md shadow-sm transition-colors">
                        <Check size={14} /> Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 group p-2 hover:bg-sky-50 transition-colors rounded-lg border border-transparent hover:border-sky-100 relative">
            <label className="flex items-start gap-3 cursor-pointer flex-1">
                <div className="relative flex items-start pt-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(point.id)}
                        className="peer appearance-none w-5 h-5 border-2 border-sky-300 rounded-md checked:bg-sky-500 checked:border-sky-500 transition-all cursor-pointer focus:ring-2 focus:ring-sky-200"
                    />
                    <svg
                        className="absolute w-5 h-5 left-0 top-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity stroke-2 px-1 py-1"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-sm flex-1 mr-12">
                    <span className="text-slate-700 leading-snug">{point.text}</span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {point.group && point.group !== 'Other' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full select-none shadow-2xs">
                                {point.group}
                            </span>
                        )}
                        {point.tags.map((t: string, i: number) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full select-none shadow-2xs">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </label>

            {/* Action Buttons visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 absolute top-2 right-2 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-100 rounded-md transition-colors"
                    title="Edit point and group"
                >
                    <Pencil size={14} />
                </button>
                {onDelete && (
                    <button
                        onClick={() => onDelete(point.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete point"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
                {onMove && (
                    <div className="flex flex-col ml-1 border-l border-slate-200 pl-1">
                        <button onClick={(e) => { e.preventDefault(); onMove(point.id, 'up'); }} className="p-0.5 text-slate-400 hover:text-sky-600 rounded" title="Move up within group"><ArrowUp size={12} /></button>
                        <button onClick={(e) => { e.preventDefault(); onMove(point.id, 'down'); }} className="p-0.5 text-slate-400 hover:text-sky-600 rounded" title="Move down within group"><ArrowDown size={12} /></button>
                    </div>
                )}
            </div>
        </div>
    );
}
