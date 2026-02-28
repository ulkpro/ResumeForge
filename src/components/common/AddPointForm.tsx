import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddPointFormProps {
    sectionId: string;
    onAdd: (sectionId: string, text: string, tagsStr: string) => void;
}

export function AddPointForm({ sectionId, onAdd }: AddPointFormProps) {
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
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

    return (
        <div className="ml-2 mt-2 p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm">
            <input
                type="text"
                placeholder="Bullet point text..."
                className="w-full mb-2 p-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <input
                type="text"
                placeholder="Tags (comma separated)..."
                className="w-full mb-2 p-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        onAdd(sectionId, text, tags);
                        setIsAdding(false);
                        setText('');
                        setTags('');
                    }}
                    className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-xs font-medium"
                >
                    Save
                </button>
                <button
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-xs font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
