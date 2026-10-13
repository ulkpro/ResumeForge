import React, { useState } from 'react';
import { LayoutTemplate, BriefcaseBusiness, FolderGit2, GraduationCap, Code2, BookOpen, Award, ArrowUp, ArrowDown, ChevronDown, ChevronRight, Layers } from 'lucide-react';
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
    certificationsData: ResumeData[];
    skillsData: ResumeData[];
    publicationsData: ResumeData[];
    hiddenSections?: string[];
    onToggleVisibility: (key: string) => void;
    selectedPoints: Record<string, boolean>;
    onPointToggle: (id: string) => void;
    onAddPoint: (sectionId: string, text: string, tagsStr: string, group?: string) => void;
    onEditPoint: (sectionId: string, pointId: string, text: string, tagsStr: string, group?: string) => void;
    onUpdateCoursework: (sectionId: string, courseworkText: string) => void;
    onDeletePoint: (sectionId: string, pointId: string) => void;
    onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
    onMoveSectionCategory: (categoryKey: string, direction: 'up' | 'down') => void;
    onMovePoint: (sectionId: string, pointId: string, direction: 'up' | 'down') => void;
    targetRole: string;
    setTargetRole: (role: string) => void;
    allRoles: string[];
    targetGroup: string;
    setTargetGroup: (group: string) => void;
    allGroups: string[];
    sectionOrder?: string[];
    experienceGroupOrder?: string[];
    onMoveExperienceGroup?: (sectionId: string, groupName: string, direction: 'up' | 'down') => void;
}

export function Sidebar({
    collapsedSections, onToggleSection, experienceData, projectData, educationData, certificationsData, skillsData, publicationsData,
    hiddenSections, onToggleVisibility,
    selectedPoints, onPointToggle, onAddPoint, onEditPoint, onUpdateCoursework, onDeletePoint,
    onMoveSection, onMoveSectionCategory, onMovePoint,
    targetGroup, setTargetGroup, allGroups,
    targetRole, setTargetRole, allRoles, sectionOrder = ['experience', 'projects', 'education', 'skills', 'publications'],
    experienceGroupOrder = ['General', 'AWS', 'Completablefuture', 'Kafka', 'Spring Boot', 'Database & Cache', 'Other'],
    onMoveExperienceGroup
}: SidebarProps) {

    const [draggedSkill, setDraggedSkill] = useState<{ itemId: string, index: number } | null>(null);
    const [editingSkill, setEditingSkill] = useState<{ itemId: string, index: number } | null>(null);
    const [editValue, setEditValue] = useState("");
    const [collapsedSubGroups, setCollapsedSubGroups] = useState<Record<string, boolean>>({});

    const toggleSubGroup = (key: string) => {
        setCollapsedSubGroups(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

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

    const CourseworkEditor = ({ item }: { item: ResumeData }) => {
        const [val, setVal] = useState(item.coursework || "");
        const cid = `${item.id}-coursework`;
        const isSelected = selectedPoints[cid] !== false;

        return (
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onPointToggle(cid)}
                    className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600 select-none">Coursework:</span>
                <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onBlur={() => {
                        if (val !== (item.coursework || "")) {
                            onUpdateCoursework(item.id, val);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                    placeholder="E.g. Algorithms, Data Structures..."
                    className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-sky-400 outline-none px-1 text-slate-700 transition-colors"
                />
            </div>
        );
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
                                {item.company || item.project_name || item.institution || item.category || item.certification}
                                {(item.designation || item.degree || item.issuer) && <span className="text-sky-600 font-normal">- {item.designation || item.degree || item.issuer}</span>}
                            </h3>
                            <div className="opacity-0 group-hover/section:opacity-100 flex items-center gap-1 transition-opacity">
                                <button onClick={() => onMoveSection(item.id, 'up')} className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded" title="Move section up"><ArrowUp size={14} /></button>
                                <button onClick={() => onMoveSection(item.id, 'down')} className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded" title="Move section down"><ArrowDown size={14} /></button>
                            </div>
                        </div>
                        {sectionKey !== 'certifications' && (
                            <>
                                {sectionKey === 'experience' ? (
                                    <div className="space-y-2 mt-2">
                                        {(() => {
                                            const groups: Record<string, typeof item.points> = {};
                                            item.points.forEach(point => {
                                                const grp = point.group || 'Other';
                                                if (!groups[grp]) groups[grp] = [];
                                                groups[grp].push(point);
                                            });

                                            const groupNames = Object.keys(groups).sort((a, b) => {
                                                if (a === 'Other') return 1;
                                                if (b === 'Other') return -1;
                                                const idxA = experienceGroupOrder.indexOf(a);
                                                const idxB = experienceGroupOrder.indexOf(b);
                                                const posA = idxA === -1 ? 999 : idxA;
                                                const posB = idxB === -1 ? 999 : idxB;
                                                if (posA !== posB) return posA - posB;
                                                return a.localeCompare(b);
                                            });

                                            const nonOtherCount = groupNames.filter(g => g !== 'Other').length;

                                            return (
                                                <>
                                                    {groupNames.map((groupName, grpIdx) => {
                                                        const subGroupKey = `${item.id}-${groupName}`;
                                                        const isCollapsed = !!collapsedSubGroups[subGroupKey];
                                                        const pts = groups[groupName];
                                                        const selCount = pts.filter(p => selectedPoints[p.id]).length;
                                                        const isOther = groupName === 'Other';
                                                        const canMoveUp = !isOther && grpIdx > 0;
                                                        const canMoveDown = !isOther && grpIdx < nonOtherCount - 1;

                                                        return (
                                                            <div key={subGroupKey} className="rounded-lg border border-slate-200/90 bg-white/80 overflow-hidden shadow-2xs">
                                                                {/* Sub-group Header */}
                                                                <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50/90 border-b border-slate-100 hover:bg-slate-100/60 transition-colors">
                                                                    <div
                                                                        className="flex items-center gap-1.5 cursor-pointer select-none flex-1 min-w-0"
                                                                        onClick={() => toggleSubGroup(subGroupKey)}
                                                                    >
                                                                        <span className="text-slate-400 hover:text-slate-600">
                                                                            {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                                                                        </span>
                                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                                                            groupName === 'General' ? 'bg-blue-100 text-blue-700' :
                                                                            groupName === 'AWS' ? 'bg-amber-100 text-amber-800' :
                                                                            groupName === 'Completablefuture' ? 'bg-purple-100 text-purple-800' :
                                                                            groupName === 'Kafka' ? 'bg-emerald-100 text-emerald-800' :
                                                                            groupName === 'Spring Boot' ? 'bg-teal-100 text-teal-800' :
                                                                            groupName === 'Database & Cache' ? 'bg-indigo-100 text-indigo-800' :
                                                                            groupName === 'Other' ? 'bg-slate-200 text-slate-700' :
                                                                            'bg-sky-100 text-sky-800'
                                                                        }`}>
                                                                            {groupName}
                                                                        </span>
                                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                                            ({selCount}/{pts.length})
                                                                        </span>
                                                                    </div>

                                                                    {!isOther && onMoveExperienceGroup && (
                                                                        <div className="flex items-center gap-0.5">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    onMoveExperienceGroup(item.id, groupName, 'up');
                                                                                }}
                                                                                disabled={!canMoveUp}
                                                                                className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-100/60 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                                                                                title={`Move ${groupName} group up`}
                                                                            >
                                                                                <ArrowUp size={12} />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    onMoveExperienceGroup(item.id, groupName, 'down');
                                                                                }}
                                                                                disabled={!canMoveDown}
                                                                                className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-100/60 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                                                                                title={`Move ${groupName} group down`}
                                                                            >
                                                                                <ArrowDown size={12} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Points in sub-group */}
                                                                {!isCollapsed && (
                                                                    <div className="p-1 space-y-1 bg-white">
                                                                        {pts.map(point => (
                                                                            <CheckboxItem
                                                                                key={point.id}
                                                                                point={point}
                                                                                isSelected={!!selectedPoints[point.id]}
                                                                                onToggle={onPointToggle}
                                                                                onEdit={(id, text, tags, grp) => onEditPoint(item.id, id, text, tags, grp)}
                                                                                onDelete={(id) => onDeletePoint(item.id, id)}
                                                                                onMove={(id, dir) => onMovePoint(item.id, id, dir)}
                                                                                availableGroups={experienceGroupOrder}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    <AddPointForm
                                                        sectionId={item.id}
                                                        onAdd={onAddPoint}
                                                        availableGroups={experienceGroupOrder}
                                                        defaultGroup="General"
                                                    />
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            {[...item.points].map(point => (
                                                <CheckboxItem
                                                    key={point.id}
                                                    point={point}
                                                    isSelected={!!selectedPoints[point.id]}
                                                    onToggle={onPointToggle}
                                                    onEdit={(id, text, tags, grp) => onEditPoint(item.id, id, text, tags, grp)}
                                                    onDelete={(id) => onDeletePoint(item.id, id)}
                                                    onMove={(id, dir) => onMovePoint(item.id, id, dir)}
                                                />
                                            ))}
                                        </div>
                                        <AddPointForm sectionId={item.id} onAdd={onAddPoint} />
                                    </>
                                )}
                            </>
                        )}
                        {sectionKey === 'education' && <CourseworkEditor item={item} />}
                    </div>
                ))}
            </div>
        );
    };

    const groupedRoles = React.useMemo(() => {
        const groups: Record<string, string[]> = {
            'Backend': [],
            'Frontend': [],
            'Fullstack': [],
            'DevOps & Cloud': [],
            'Data Engineering & ML': [],
            'Other': []
        };

        allRoles.forEach(role => {
            const lowerRole = role.toLowerCase();
            if (lowerRole.includes('fullstack') || lowerRole.includes('full-stack') || lowerRole.includes('node') || lowerRole.includes('express')) {
                groups['Fullstack'].push(role);
            } else if (lowerRole.includes('backend') || lowerRole.includes('rails') || lowerRole.includes('csharp') || lowerRole.includes('java') || lowerRole.includes('go') || lowerRole.includes('cpp') || lowerRole.includes('rust') || lowerRole.includes('python')) {
                // Check if it's already caught by fullstack (e.g., fullstack-python), but fullstack is checked first above.
                groups['Backend'].push(role);
            } else if (lowerRole.includes('frontend') || lowerRole.includes('react') || lowerRole.includes('angular') || lowerRole.includes('vue') || lowerRole.includes('ui')) {
                groups['Frontend'].push(role);
            } else if (lowerRole.includes('devops') || lowerRole.includes('cloud') || lowerRole.includes('aws') || lowerRole.includes('azure') || lowerRole.includes('gcp')) {
                groups['DevOps & Cloud'].push(role);
            } else if (lowerRole.includes('data') || lowerRole.includes('ml') || lowerRole.includes('ai') || lowerRole.includes('machine')) {
                groups['Data Engineering & ML'].push(role);
            } else {
                groups['Other'].push(role);
            }
        });

        const finalGroups: Record<string, string[]> = {};
        Object.entries(groups).forEach(([key, roles]) => {
            if (roles.length > 0) {
                finalGroups[key] = roles;
            }
        });

        return finalGroups;
    }, [allRoles]);

    return (
        <div className="w-5/12 p-8 flex flex-col border-r border-sky-200 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] overflow-y-auto z-10 custom-scrollbar">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-sky-500 p-2.5 rounded-xl shadow-lg shadow-sky-200 text-white">
                    <LayoutTemplate size={24} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-sky-950">Resume Builder</h1>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Main Group</label>
                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 appearance-none shadow-sm cursor-pointer hover:bg-slate-100 transition-colors capitalize"
                            value={targetGroup || ''}
                            onChange={(e) => setTargetGroup(e.target.value)}
                        >
                            {allGroups.map(group => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Target Job Role</label>
                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 appearance-none shadow-sm cursor-pointer hover:bg-slate-100 transition-colors capitalize"
                            value={targetRole || ''}
                            onChange={(e) => setTargetRole(e.target.value)}
                        >
                            {Object.entries(groupedRoles).map(([category, roles]) => (
                                <optgroup key={category} label={category}>
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
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
                    if (sectionKey === 'certifications') return renderSection(certificationsData, "Certifications", "certifications", Award, onMoveUp, onMoveDown);
                    if (sectionKey === 'skills') return renderSkillsSection(skillsData, "Skills", "skills", Code2, onMoveUp, onMoveDown);
                    if (sectionKey === 'publications') return renderSection(publicationsData, "Publications", "publications", BookOpen, onMoveUp, onMoveDown);

                    return null;
                })}
            </div>
        </div >
    );
}
