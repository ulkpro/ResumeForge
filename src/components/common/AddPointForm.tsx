import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddPointFormProps {
    sectionId: string;
    onAdd: (sectionId: string, text: string, tagsStr: string, group?: string) => void;
    availableGroups?: string[];
    defaultGroup?: string;
}

export function AddPointForm({
    sectionId,
    onAdd,
    availableGroups = ['General', 'AWS', 'Completablefuture', 'Kafka', 'Spring Boot', 'Database & Cache', 'Other'],
    defaultGroup = 'General'
}: AddPointFormProps) {
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [group, setGroup] = useState(defaultGroup);
    const [isCustomGroup, setIsCustomGroup] = useState(false);
    const [customGroupText, setCustomGroupText] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="text-xs flex items-center gap-1 text-sky-600 hover:text-sky-800 ml-2 mt-2 font-medium"
            >
                <Plus size={14} /> Add Point
            </button>
        );
    }

    const handleSave = () => {
        if (!text.trim()) return;
        const finalGroup = isCustomGroup ? customGroupText.trim() : group;
        onAdd(sectionId, text, tags, finalGroup || 'General');
        setIsAdding(false);
        setText('');
        setTags('');
        setIsCustomGroup(false);
        setCustomGroupText('');
    };

    return (
        <div className="ml-2 mt-2 p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm space-y-2">
            <input
                type="text"
                placeholder="Bullet point text..."
                className="w-full p-2 text-sm rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
            />

            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Sub-Group:</span>
                {!isCustomGroup ? (
                    <div className="flex gap-1.5 flex-1">
                        <select
                            value={group}
                            onChange={e => {
                                if (e.target.value === '__NEW__') {
                                    setIsCustomGroup(true);
                                } else {
                                    setGroup(e.target.value);
                                }
                            }}
                            className="text-xs p-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-sky-400 font-medium text-slate-700 flex-1"
                        >
                            {availableGroups.filter(g => g !== 'Other').map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
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
                placeholder="Tags (comma separated)... e.g. AWS, S3, Docker"
                className="w-full p-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            <div className="flex gap-2 justify-end pt-1">
                <button
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-xs font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-xs font-medium"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
