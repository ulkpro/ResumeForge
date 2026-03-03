import { useState } from 'react';
import type { ResumePoint } from '../../utils/parser';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface CheckboxItemProps {
    point: ResumePoint;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onEdit?: (id: string, text: string, tagsStr: string) => void;
    onDelete?: (id: string) => void;
}

export function CheckboxItem({ point, isSelected, onToggle, onEdit, onDelete }: CheckboxItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editVal, setEditVal] = useState(point.text);
    const [tagsVal, setTagsVal] = useState(point.tags.join(', '));

    const handleSave = () => {
        if (onEdit) {
            onEdit(point.id, editVal, tagsVal);
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
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {point.tags.map((t: string, i: number) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full select-none shadow-sm">
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
                    title="Edit point"
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
            </div>
        </div>
    );
}
