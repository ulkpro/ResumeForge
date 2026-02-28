interface TagFiltersProps {
    allTags: string[];
    selectedTags: string[];
    onToggle: (tag: string) => void;
    onClear: () => void;
}

export function TagFilters({ allTags, selectedTags, onToggle, onClear }: TagFiltersProps) {
    return (
        <div className="mb-8 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
            <h2 className="text-sm uppercase tracking-wider font-bold text-sky-800 mb-3">Filter by Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => onToggle(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm
              ${selectedTags.includes(tag)
                                ? 'bg-sky-500 text-white border border-sky-600 shadow-sky-200 scale-105'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'}`
                        }
                    >
                        {tag}
                    </button>
                ))}
                {selectedTags.length > 0 && (
                    <button
                        onClick={onClear}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors underline"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
