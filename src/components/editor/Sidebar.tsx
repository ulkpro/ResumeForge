import React, { useState } from 'react';
import { LayoutTemplate, BriefcaseBusiness, FolderGit2, GraduationCap, Code2, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
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
    publicationsData: ResumeData[];
    hiddenSections?: string[];
    onToggleVisibility: (key: string) => void;
    selectedPoints: Record<string, boolean>;
    onPointToggle: (id: string) => void;
    onAddPoint: (sectionId: string, text: string, tagsStr: string) => void;
    onEditPoint: (sectionId: string, pointId: string, text: string, tagsStr: string) => void;
    onDeletePoint: (sectionId: string, pointId: string) => void;
    onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
    onMoveSectionCategory: (categoryKey: string, direction: 'up' | 'down') => void;
    onMovePoint: (sectionId: string, pointId: string, direction: 'up' | 'down') => void;
    targetRole: string;
    setTargetRole: (role: string) => void;
    allRoles: string[];
    sectionOrder?: string[];
}

export function Sidebar({
    collapsedSections, onToggleSection, experienceData, projectData, educationData, skillsData, publicationsData,
    hiddenSections, onToggleVisibility,
    selectedPoints, onPointToggle, onAddPoint, onEditPoint, onDeletePoint,
    onMoveSection, onMoveSectionCategory, onMovePoint,
    targetRole, setTargetRole, allRoles, sectionOrder = ['experience', 'projects', 'education', 'skills', 'publications']
}: SidebarProps) {

    const [draggedSkill, setDraggedSkill] = useState<{ itemId: string, index: number } | null>(null);
    const [editingSkill, setEditingSkill] = useState<{ itemId: string, index: number } | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleSaveSkill = (item: ResumeData, individualSkills: string[], index: number, newValue: string) => {
        const newSkills = [...individualSkills];
        if (newValue.trim()) {
            newSkills[index] = newValue.trim();
        } else {
            newSkills.splice(index, 1);
        }
        
        const firstPoint = item.points[0];
        if (!firstPoint) return;
        
        const newText = newSkills.filter(Boolean).join(', ');
        onEditPoint(item.id, firstPoint.id, newText, firstPoint.tags?.join(', ') || '');
        setEditingSkill(null);
    };

    const handleDropSkill = (e: React.DragEvent<HTMLElement>, item: ResumeData, individualSkills: string[], dropIndex: number) => {
        e.preventDefault();
        if (!draggedSkill) return;
        if (draggedSkill.itemId !== item.id) return;
        if (draggedSkill.index === dropIndex) return;

        const newSkills = [...individualSkills];
        const [moved] = newSkills.splice(draggedSkill.index, 1);
        newSkills.splice(dropIndex, 0, moved);

        const firstPoint = item.points[0];
        if (!firstPoint) return;

        const newText = newSkills.filter(Boolean).join(', ');
        onEditPoint(item.id, firstPoint.id, newText, firstPoint.tags?.join(', ') || '');
        setDraggedSkill(null);
    };

    // Helper to render the Skills section with toggle pill buttons
    const renderSkillsSection = (data: ResumeData[], title: string, sectionKey: string, icon: any, onMoveUp?: () => void, onMoveDown?: () => void) => {
        if (data.length === 0) return null;
        return (
            <div key={sectionKey}>
                <SectionHeader icon={icon} title={title} sectionKey={sectionKey} isCollapsed={!!collapsedSections[sectionKey]} isVisible={!hiddenSections?.includes(sectionKey)} onToggle={onToggleSection} onToggleVisibility={onToggleVisibility} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
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
                                        {individualSkills.map((skill, index) => {
                                            const skillId = `${item.id}-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                            const isSelected = selectedPoints[skillId] !== false;
                                            const isEditing = editingSkill?.itemId === item.id && editingSkill?.index === index;
                                            const isDragged = draggedSkill?.itemId === item.id && draggedSkill?.index === index;

                                            if (isEditing) {
                                                return (
                                                    <input
                                                        key={skillId}
                                                        autoFocus
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveSkill(item, individualSkills, index, editValue)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveSkill(item, individualSkills, index, editValue);
                                                            if (e.key === 'Escape') setEditingSkill(null);
                                                        }}
                                                        className="px-3 py-1 text-xs font-medium border border-sky-400 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-200 w-24 bg-white shadow-inner"
                                                    />
                                                );
                                            }

                                            return (
                                                <button
                                                    key={skillId}
                                                    type="button"
                                                    onClick={() => onPointToggle(skillId)}
                                                    onDoubleClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingSkill({ itemId: item.id, index });
                                                        setEditValue(skill);
                                                    }}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.effectAllowed = 'move';
                                                        setDraggedSkill({ itemId: item.id, index });
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.dataTransfer.dropEffect = 'move';
                                                    }}
                                                    onDrop={(e) => handleDropSkill(e, item, individualSkills, index)}
                                                    onDragEnd={() => setDraggedSkill(null)}
                                                    title="Click to toggle, double-click to edit, drag to reorder"
                                                    className={`
                                                        px-3 py-1.5 rounded-full text-xs font-medium
                                                        transition-all duration-200 cursor-pointer select-none
                                                        border
                                                        ${isDragged ? 'opacity-40 border-dashed border-sky-400' : ''}
                                                        ${isSelected && !isDragged
                                                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200 hover:bg-sky-600'
                                                            : !isDragged ? 'bg-slate-100 text-slate-400 border-slate-200 line-through hover:bg-slate-200 hover:text-slate-500' : ''
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


    const renderSection = (data: ResumeData[], title: string, sectionKey: string, icon: any, onMoveUp?: () => void, onMoveDown?: () => void) => {
        if (data.length === 0) return null;
        return (
            <div key={sectionKey}>
                <SectionHeader icon={icon} title={title} sectionKey={sectionKey} isCollapsed={!!collapsedSections[sectionKey]} isVisible={!hiddenSections?.includes(sectionKey)} onToggle={onToggleSection} onToggleVisibility={onToggleVisibility} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
                {!collapsedSections[sectionKey] && data.map(item => (
                    <div 
                        key={item.id} 
                        className="mb-6 ml-2 pl-2 border-l-2 border-slate-100 relative group/section focus:outline-none focus:border-sky-400 focus:bg-sky-50/50 rounded-r-lg transition-colors"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.target !== e.currentTarget) return;
                            if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                onMoveSection(item.id, 'up');
                            } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                onMoveSection(item.id, 'down');
                            }
                        }}
                    >
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
                {sectionOrder.map((sectionKey, index) => {
                    const canMoveUp = index > 0;
                    const canMoveDown = index < sectionOrder.length - 1;
                    const onMoveUp = canMoveUp ? () => onMoveSectionCategory(sectionKey, 'up') : undefined;
                    const onMoveDown = canMoveDown ? () => onMoveSectionCategory(sectionKey, 'down') : undefined;

                    if (sectionKey === 'experience') return renderSection(experienceData, "Experience", "experience", BriefcaseBusiness, onMoveUp, onMoveDown);
                    if (sectionKey === 'projects') return renderSection(projectData, "Projects", "projects", FolderGit2, onMoveUp, onMoveDown);
                    if (sectionKey === 'education') return renderSection(educationData, "Education", "education", GraduationCap, onMoveUp, onMoveDown);
                    if (sectionKey === 'skills') return renderSkillsSection(skillsData, "Skills", "skills", Code2, onMoveUp, onMoveDown);
                    if (sectionKey === 'publications') return renderSection(publicationsData, "Publications", "publications", BookOpen, onMoveUp, onMoveDown);
                    
                    return null;
                })}
            </div>
        </div >
    );
}
