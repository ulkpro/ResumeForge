import type { LayoutSettings } from '../../types';

interface FontControlsProps {
    layout: LayoutSettings;
    setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
}

export function FontControls({ layout, setLayout }: FontControlsProps) {
    return (
        <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 flex flex-col gap-4 text-sm font-medium text-slate-700 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
                <div className="flex justify-between mb-1">
                    <span>Font Family</span>
                </div>
                <select
                    value={layout.fontFamily || "'LMRoman10', 'Latin Modern Roman', serif"}
                    onChange={e => setLayout(s => ({ ...s, fontFamily: e.target.value }))}
                    className="w-full p-2 mb-4 border border-slate-300 text-slate-700 rounded focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
                >
                    <option value="'LMRoman10', 'Latin Modern Roman', serif">LaTeX (Computer Modern)</option>
                    <option value="'Inter', 'Helvetica', 'Arial', sans-serif">Inter (Sans Serif)</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                </select>
            </div>

            <div>
                <h3 className="font-semibold text-slate-800 mb-3">Font Sizes (pt)</h3>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Name</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeName || 25} pt</span>
                    </div>
                    <input type="range" min="14" max="40" step="1"
                        value={layout.fontSizeName || 25}
                        onChange={e => setLayout(s => ({ ...s, fontSizeName: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Contact Line</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeContact || 10} pt</span>
                    </div>
                    <input type="range" min="7" max="16" step="1"
                        value={layout.fontSizeContact || 10}
                        onChange={e => setLayout(s => ({ ...s, fontSizeContact: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Section Titles</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeSectionTitle || 12} pt</span>
                    </div>
                    <input type="range" min="9" max="20" step="1"
                        value={layout.fontSizeSectionTitle || 12}
                        onChange={e => setLayout(s => ({ ...s, fontSizeSectionTitle: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Org / Institution Names</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeOrgName || 11} pt</span>
                    </div>
                    <input type="range" min="8" max="18" step="1"
                        value={layout.fontSizeOrgName || 11}
                        onChange={e => setLayout(s => ({ ...s, fontSizeOrgName: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Locations and Dates</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeLocDate || 11} pt</span>
                    </div>
                    <input type="range" min="8" max="16" step="1"
                        value={layout.fontSizeLocDate || 11}
                        onChange={e => setLayout(s => ({ ...s, fontSizeLocDate: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span>Role / Degree Descriptions</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeRoleDesc || 10} pt</span>
                    </div>
                    <input type="range" min="7" max="16" step="1"
                        value={layout.fontSizeRoleDesc || 10}
                        onChange={e => setLayout(s => ({ ...s, fontSizeRoleDesc: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>

                <div className="mb-1">
                    <div className="flex justify-between mb-1">
                        <span>Bulleted Points</span>
                        <span className="text-sky-600 font-bold">{layout.fontSizeBullet || 10} pt</span>
                    </div>
                    <input type="range" min="7" max="14" step="1"
                        value={layout.fontSizeBullet || 10}
                        onChange={e => setLayout(s => ({ ...s, fontSizeBullet: Number(e.target.value) }))}
                        className="w-full accent-sky-500" />
                </div>
            </div>
        </div>
    );
}
