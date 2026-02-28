import type { ResumePoint } from '../../utils/parser';

interface CheckboxItemProps {
    point: ResumePoint;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

export function CheckboxItem({ point, isSelected, onToggle }: CheckboxItemProps) {
    return (
        <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-sky-50 transition-colors rounded-lg border border-transparent hover:border-sky-100">
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
            <div className="text-sm flex-1">
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
    );
}
