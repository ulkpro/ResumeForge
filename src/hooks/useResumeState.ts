import { useState, useMemo, useEffect } from 'react';
import { getResumeData } from '../data';
import type { ResumeData, ResumePoint } from '../utils/parser';

import type { LayoutSettings } from '../types';
import { defaultLayout } from '../types';
import { saveResumeFileLocal } from '../utils/mdWriter';

export function useResumeState() {
    const [data, setData] = useState<ResumeData[]>(getResumeData());

    const [selectedPoints, setSelectedPoints] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        const allData = getResumeData();
        allData.forEach(sec => sec.points.forEach(p => initial[p.id] = true));

        const saved = localStorage.getItem('resume-selected-points');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach(k => { initial[k] = parsed[k]; });
                return initial;
            } catch (e) { /* ignore */ }
        }
        return initial;
    });

    const [layout, setLayout] = useState<LayoutSettings>(() => {
        const saved = localStorage.getItem('resume-layout-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.sectionOrder) {
                    defaultLayout.sectionOrder?.forEach(sec => {
                        if (!parsed.sectionOrder.includes(sec)) {
                            parsed.sectionOrder.push(sec);
                        }
                    });
                } else {
                    parsed.sectionOrder = defaultLayout.sectionOrder;
                }
                return { ...defaultLayout, ...parsed };
            } catch (e) { }
        }
        return defaultLayout;
    });

    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        layoutControls: false // default open so user sees it
    });

    useEffect(() => {
        localStorage.setItem('resume-selected-points', JSON.stringify(selectedPoints));
    }, [selectedPoints]);

    useEffect(() => {
        localStorage.setItem('resume-layout-settings', JSON.stringify(layout));
    }, [layout]);

    const allRoles = useMemo(() => {
        const roles = new Set<string>();
        data.forEach(item => {
            if (item.role) {
                roles.add(item.role);
            }
        });
        return Array.from(roles).sort();
    }, [data]);

    const [targetRole, setTargetRole] = useState<string>(() => {
        return localStorage.getItem('resume-target-role') || '';
    });

    useEffect(() => {
        if (targetRole) {
            localStorage.setItem('resume-target-role', targetRole);
        }
    }, [targetRole]);

    useEffect(() => {
        if (!targetRole && allRoles.length > 0) {
            setTargetRole(allRoles[0]);
        } else if (targetRole && !allRoles.includes(targetRole) && allRoles.length > 0) {
            setTargetRole(allRoles[0]);
        }
    }, [allRoles, targetRole]);

    const handlePointToggle = (pointId: string) => {
        setSelectedPoints(prev => ({ ...prev, [pointId]: !prev[pointId] }));
    };

    const toggleSection = (sectionName: string) => {
        setCollapsedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
    };

    const handleAddPoint = (sectionId: string, text: string, tagsStr: string) => {
        if (!text.trim()) return;
        const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const newPointId = `custom-${Date.now()}`;
        const newPoint: ResumePoint = { id: newPointId, text: text.trim(), tags };

        setData(prev => {
            const newData = prev.map(sec =>
                sec.id === sectionId ? { ...sec, points: [...sec.points, newPoint] } : sec
            );
            const updatedSection = newData.find(s => s.id === sectionId);
            if (updatedSection) saveResumeFileLocal(updatedSection);
            return newData;
        });
        setSelectedPoints(prev => ({ ...prev, [newPointId]: true }));
    };

    const handleEditPoint = (sectionId: string, pointId: string, text: string, tagsStr: string) => {
        if (!text.trim()) return;
        const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

        setData(prev => {
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;
                return {
                    ...sec,
                    points: sec.points.map(p => p.id === pointId ? { ...p, text: text.trim(), tags } : p)
                };
            });
            const updatedSection = newData.find(s => s.id === sectionId);
            if (updatedSection) saveResumeFileLocal(updatedSection);
            return newData;
        });
    };

    const handleDeletePoint = (sectionId: string, pointId: string) => {
        setData(prev => {
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;
                return {
                    ...sec,
                    points: sec.points.filter(p => p.id !== pointId)
                };
            });
            const updatedSection = newData.find(s => s.id === sectionId);
            if (updatedSection) saveResumeFileLocal(updatedSection);
            return newData;
        });
    };

    const handleUpdateCoursework = (sectionId: string, courseworkText: string) => {
        setData(prev => {
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;
                return { ...sec, coursework: courseworkText };
            });
            const updatedSection = newData.find(s => s.id === sectionId);
            if (updatedSection) saveResumeFileLocal(updatedSection);
            return newData;
        });
    };

    const moveSection = (sectionId: string, direction: 'up' | 'down') => {
        setData(prev => {
            const targetSection = prev.find(s => s.id === sectionId);
            if (!targetSection) return prev;

            const sameTypeRoleSections = prev.filter(s => s.type === targetSection.type && s.role === targetSection.role);
            const sortedGroup = [...sameTypeRoleSections].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            const currentIndex = sortedGroup.findIndex(s => s.id === sectionId);

            if (direction === 'up' && currentIndex > 0) {
                const tmp = sortedGroup.map((s, idx) => ({ ...s, order: idx * 10 }));
                tmp[currentIndex].order = (currentIndex - 1) * 10;
                tmp[currentIndex - 1].order = currentIndex * 10;

                saveResumeFileLocal(tmp[currentIndex]);
                saveResumeFileLocal(tmp[currentIndex - 1]);

                return prev.map(s => {
                    const found = tmp.find(t => t.id === s.id);
                    return found ? found : s;
                }).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            } else if (direction === 'down' && currentIndex < sortedGroup.length - 1) {
                const tmp = sortedGroup.map((s, idx) => ({ ...s, order: idx * 10 }));
                tmp[currentIndex].order = (currentIndex + 1) * 10;
                tmp[currentIndex + 1].order = currentIndex * 10;

                saveResumeFileLocal(tmp[currentIndex]);
                saveResumeFileLocal(tmp[currentIndex + 1]);

                return prev.map(s => {
                    const found = tmp.find(t => t.id === s.id);
                    return found ? found : s;
                }).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            }
            return prev;
        });
    };

    const moveSectionCategory = (categoryKey: string, direction: 'up' | 'down') => {
        setLayout(prev => {
            const order = prev.sectionOrder || defaultLayout.sectionOrder || ['experience', 'projects', 'education', 'certifications', 'skills', 'publications'];
            const index = order.indexOf(categoryKey);
            if (index === -1) return prev;
            
            const newOrder = [...order];
            if (direction === 'up' && index > 0) {
                newOrder[index] = newOrder[index - 1];
                newOrder[index - 1] = categoryKey;
            } else if (direction === 'down' && index < newOrder.length - 1) {
                newOrder[index] = newOrder[index + 1];
                newOrder[index + 1] = categoryKey;
            }
            
            return { ...prev, sectionOrder: newOrder };
        });
    };

    const toggleSectionVisibility = (sectionKey: string) => {
        setLayout(prev => {
            const hidden = prev.hiddenSections || [];
            if (hidden.includes(sectionKey)) {
                return { ...prev, hiddenSections: hidden.filter(k => k !== sectionKey) };
            } else {
                return { ...prev, hiddenSections: [...hidden, sectionKey] };
            }
        });
    };

    const movePoint = (sectionId: string, pointId: string, direction: 'up' | 'down') => {
        setData(prev => {
            let changed = false;
            let updatedSection = null;
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;

                const points = [...sec.points];
                const ptIndex = points.findIndex(p => p.id === pointId);

                if (direction === 'up' && ptIndex > 0) {
                    const tmp = points[ptIndex];
                    points[ptIndex] = points[ptIndex - 1];
                    points[ptIndex - 1] = tmp;
                    changed = true;
                } else if (direction === 'down' && ptIndex < points.length - 1) {
                    const tmp = points[ptIndex];
                    points[ptIndex] = points[ptIndex + 1];
                    points[ptIndex + 1] = tmp;
                    changed = true;
                }

                if (changed) {
                    updatedSection = { ...sec, points };
                    return updatedSection;
                }
                return sec;
            });

            if (changed && updatedSection) {
                saveResumeFileLocal(updatedSection);
                return newData;
            }
            return prev;
        });
    };

    const filteredData = useMemo(() => {
        return data.filter(section => {
            return section.role === targetRole;
        });
    }, [data, targetRole]);

    const experienceData = filteredData.filter(d => d.type === 'experience');
    const projectData = filteredData.filter(d => d.type === 'project');
    const educationData = filteredData.filter(d => d.type === 'education');
    const certificationsData = filteredData.filter(d => d.type === 'certifications');
    const skillsData = filteredData.filter(d => d.type === 'skills');
    const publicationsData = filteredData.filter(d => d.type === 'publications');

    return {
        data,
        targetRole,
        setTargetRole,
        allRoles,
        selectedPoints,
        layout,
        setLayout,
        collapsedSections,
        handlePointToggle,
        handleEditPoint,
        handleDeletePoint,
        handleUpdateCoursework,
        toggleSection,
        handleAddPoint,
        moveSection,
        moveSectionCategory,
        movePoint,
        filteredData,
        experienceData,
        projectData,
        educationData,
        certificationsData,
        skillsData,
        publicationsData,
        toggleSectionVisibility
    };
}