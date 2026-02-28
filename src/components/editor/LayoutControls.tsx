import type { LayoutSettings } from '../../types';

interface LayoutControlsProps {
    layout: LayoutSettings;
    setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
}

export function LayoutControls({ layout, setLayout }: LayoutControlsProps) {
    return (
        <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 flex flex-col gap-4 text-sm font-medium text-slate-700">
            <div className="flex items-center justify-between">
                <span>Page Size</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLayout(s => ({ ...s, pageSize: 'A4' }))}
                        className={`px-3 py-1.5 rounded ${layout.pageSize === 'A4' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}
                    >A4</button>
                    <button
                        onClick={() => setLayout(s => ({ ...s, pageSize: 'LETTER' }))}
                        className={`px-3 py-1.5 rounded ${layout.pageSize === 'LETTER' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}
                    >Letter</button>
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span>Margins (Top & Bottom)</span>
                    <span className="text-sky-600 font-bold">{layout.paddingTopBottom} mm</span>
                </div>
                <input type="range" min="0" max="30" step="1"
                    value={layout.paddingTopBottom}
                    onChange={e => setLayout(s => ({ ...s, paddingTopBottom: Number(e.target.value) }))}
                    className="w-full accent-sky-500" />
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span>Margins (Left & Right)</span>
                    <span className="text-sky-600 font-bold">{layout.paddingLeftRight} mm</span>
                </div>
                <input type="range" min="0" max="30" step="1"
                    value={layout.paddingLeftRight}
                    onChange={e => setLayout(s => ({ ...s, paddingLeftRight: Number(e.target.value) }))}
                    className="w-full accent-sky-500" />
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span>Gap Between Title & First Sub</span>
                    <span className="text-sky-600 font-bold">{layout.gapSectionToSub} px</span>
                </div>
                <input type="range" min="0" max="40" step="1"
                    value={layout.gapSectionToSub}
                    onChange={e => setLayout(s => ({ ...s, gapSectionToSub: Number(e.target.value) }))}
                    className="w-full accent-sky-500" />
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span>Gap Between Subsections</span>
                    <span className="text-sky-600 font-bold">{layout.gapSubsections} px</span>
                </div>
                <input type="range" min="0" max="40" step="1"
                    value={layout.gapSubsections}
                    onChange={e => setLayout(s => ({ ...s, gapSubsections: Number(e.target.value) }))}
                    className="w-full accent-sky-500" />
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span>Gap Between Bullet Points</span>
                    <span className="text-sky-600 font-bold">{layout.gapPoints} px</span>
                </div>
                <input type="range" min="0" max="20" step="1"
                    value={layout.gapPoints}
                    onChange={e => setLayout(s => ({ ...s, gapPoints: Number(e.target.value) }))}
                    className="w-full accent-sky-500" />
            </div>
        </div>
    );
}
