import { LayoutTemplate, BriefcaseBusiness, FolderGit2, GraduationCap, Code2, Settings2 } from 'lucide-react';
import { LayoutControls } from './LayoutControls';
import { TagFilters } from './TagFilters';
import { SectionHeader } from '../common/SectionHeader';
import { CheckboxItem } from '../common/CheckboxItem';
import { AddPointForm } from '../common/AddPointForm';
import type { ResumeData } from '../../utils/parser';
import type { LayoutSettings } from '../../types';

interface SidebarProps {
    layout: LayoutSettings;
    setLayout: React.Dispatch<React.SetStateAction<LayoutSettings>>;
    allTags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    onClearTags: () => void;
    collapsedSections: Record<string, boolean>;
    onToggleSection: (section: string) => void;
    experienceData: ResumeData[];
    projectData: ResumeData[];
    educationData: ResumeData[];
    skillsData: ResumeData[];
    selectedPoints: Record<string, boolean>;
    onPointToggle: (id: string) => void;
    onAddPoint: (sectionId: string, text: string, tagsStr: string) => void;
}

export function Sidebar({
    layout, setLayout, allTags, selectedTags, onTagToggle, onClearTags,
    collapsedSections, onToggleSection, experienceData, projectData, educationData, skillsData,
    selectedPoints, onPointToggle, onAddPoint
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
                            const rawText = item.points[0]?.text || '';
                            const individualSkills = rawText.split(',').map(s => s.trim()).filter(s => s);
                            return (
                                <div key={item.id}>
                                    <h3 className="font-semibold text-slate-700 mb-2 text-[13px] tracking-wide">{categoryTitle}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {individualSkills.map((skill, idx) => {
                                            const skillId = `${item.id}-skill-${idx}`;
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
                    <div key={item.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                            {item.company || item.project_name || item.institution || item.category}
                            {(item.designation || item.degree) && <span className="text-sky-600 font-normal">- {item.designation || item.degree}</span>}
                        </h3>
                        <div className="space-y-1">
                            {item.points.map(point => <CheckboxItem key={point.id} point={point} isSelected={!!selectedPoints[point.id]} onToggle={onPointToggle} />)}
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
                <SectionHeader icon={Settings2} title="Layout & Spacing" sectionKey="layoutControls" isCollapsed={!!collapsedSections['layoutControls']} onToggle={onToggleSection} />
                {!collapsedSections['layoutControls'] && <LayoutControls layout={layout} setLayout={setLayout} />}
            </div>

            <TagFilters allTags={allTags} selectedTags={selectedTags} onToggle={onTagToggle} onClear={() => onClearTags()} />

            <div className="space-y-6 pb-20">
                {renderSection(experienceData, "Experience", "experience", BriefcaseBusiness)}
                {renderSection(projectData, "Projects", "projects", FolderGit2)}
                {renderSection(educationData, "Education", "education", GraduationCap)}
                {/* Render custom Skills section with enable/disable toggles */}
                {renderSkillsSection(skillsData, "Skills", "skills", Code2)}
            </div>
        </div>
    );
}
