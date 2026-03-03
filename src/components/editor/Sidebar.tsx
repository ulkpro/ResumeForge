import { LayoutTemplate, BriefcaseBusiness, FolderGit2, GraduationCap, Code2, ArrowUp, ArrowDown } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { CheckboxItem } from '../common/CheckboxItem';
import { AddPointForm } from '../common/AddPointForm';
import type { ResumeData } from '../../utils/parser';
// import type { LayoutSettings } from '../../types';

interface SidebarProps {
    collapsedSections: Record<string, boolean>;
    onToggleSection: (section: string) => void;
    experienceData: ResumeData[];
    projectData: ResumeData[];
    educationData: ResumeData[];
    skillsData: ResumeData[];
    selectedPoints: Record<string, boolean>;
    onPointToggle: (id: string) => void;
    onAddPoint: (sectionId: string, text: string, tagsStr: string) => void;
    onEditPoint: (sectionId: string, pointId: string, text: string, tagsStr: string) => void;
    onDeletePoint: (sectionId: string, pointId: string) => void;
    onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
    onMovePoint: (sectionId: string, pointId: string, direction: 'up' | 'down') => void;
    targetRole: string;
    setTargetRole: (role: string) => void;
    allRoles: string[];
}

export function Sidebar({
    collapsedSections, onToggleSection, experienceData, projectData, educationData, skillsData,
    selectedPoints, onPointToggle, onAddPoint, onEditPoint, onDeletePoint,
    onMoveSection, onMovePoint,
    targetRole, setTargetRole, allRoles
}: SidebarProps) {

    // Helper to render the Skills section with toggle pill buttons
    const renderSkillsSection = (data: ResumeData[], title: string, sectionKey: string, icon: any) => {
        if (data.length === 0) return null;
        return (
            <div>
                <SectionHeader icon={icon} title={title} sectionKey={sectionKey} isCollapsed={!!collapsedSections[sectionKey]} onToggle={onToggleSection} />
                {!collapsedSections[sectionKey] && (
                    <div className="space-y-5 ml-2 pl-3 border-l-2 border-slate-100">
                        {data.map(item => {
                            const categoryTitle = item.category || 'Skills';
                            const rawText = item.points.map(p => p.text).join(', ');
                            const individualSkills = rawText.split(',').map(s => s.trim()).filter(s => s);
                            return (
                                <div key={item.id}>
                                    <h3 className="font-semibold text-slate-700 mb-2 text-[13px] tracking-wide">{categoryTitle}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {individualSkills.map((skill) => {
                                            const skillId = `${item.id}-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                            const isSelected = selectedPoints[skillId] !== false;
                                            return (
                                                <button
                                                    key={skillId}
                                                    type="button"
                                                    onClick={() => onPointToggle(skillId)}
                                                    className={`
                                                        px-3 py-1.5 rounded-full text-xs font-medium
                                                        transition-all duration-200 cursor-pointer select-none
                                                        border
                                                        ${isSelected
                                                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200 hover:bg-sky-600'
                                                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through hover:bg-slate-200 hover:text-slate-500'
                                                        }
                                                    `}
                                                >
                                                    {skill}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };


    const renderSection = (data: ResumeData[], title: string, sectionKey: string, icon: any) => {
        if (data.length === 0) return null;
        return (
            <div>
                <SectionHeader icon={icon} title={title} sectionKey={sectionKey} isCollapsed={!!collapsedSections[sectionKey]} onToggle={onToggleSection} />
                {!collapsedSections[sectionKey] && data.map(item => (
                    <div key={item.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100 relative group/section">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                {item.company || item.project_name || item.institution || item.category}
                                {(item.designation || item.degree) && <span className="text-sky-600 font-normal">- {item.designation || item.degree}</span>}
                            </h3>
                            <div className="opacity-0 group-hover/section:opacity-100 flex items-center gap-1 transition-opacity">
                                <button onClick={() => onMoveSection(item.id, 'up')} className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded" title="Move section up"><ArrowUp size={14} /></button>
                                <button onClick={() => onMoveSection(item.id, 'down')} className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded" title="Move section down"><ArrowDown size={14} /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {item.points.map(point => (
                                <CheckboxItem
                                    key={point.id}
                                    point={point}
                                    isSelected={!!selectedPoints[point.id]}
                                    onToggle={onPointToggle}
                                    onEdit={(id, text, tags) => onEditPoint(item.id, id, text, tags)}
                                    onDelete={(id) => onDeletePoint(item.id, id)}
                                    onMove={(id, dir) => onMovePoint(item.id, id, dir)}
                                />
                            ))}
                        </div>
                        <AddPointForm sectionId={item.id} onAdd={onAddPoint} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-5/12 p-8 flex flex-col border-r border-sky-200 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] overflow-y-auto z-10 custom-scrollbar">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-sky-500 p-2.5 rounded-xl shadow-lg shadow-sky-200 text-white">
                    <LayoutTemplate size={24} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-sky-950">Resume Builder</h1>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Job Role</label>
                <div className="relative">
                    <select
                        className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 appearance-none shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
                        value={targetRole || ''}
                        onChange={(e) => setTargetRole(e.target.value)}
                    >
                        {allRoles.map(role => (
                            <option key={role} value={role}>{role.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>


            <div className="space-y-6 pb-20">
                {renderSection(experienceData, "Experience", "experience", BriefcaseBusiness)}
                {renderSection(projectData, "Projects", "projects", FolderGit2)}
                {renderSection(educationData, "Education", "education", GraduationCap)}
                {/* Render custom Skills section with enable/disable toggles */}
                {renderSkillsSection(skillsData, "Skills", "skills", Code2)}
            </div>
        </div >
    );
}
