import { useState, useMemo, useEffect } from 'react';
import { getResumeData } from '../data';
import type { ResumeData, ResumePoint } from '../utils/parser';

import type { LayoutSettings } from '../types';
import { defaultLayout } from '../types';
import { saveResumeFileLocal } from '../utils/mdWriter';

export const DEFAULT_EXPERIENCE_GROUPS = [
    'General',
    'AWS',
    'Completablefuture',
    'Kafka',
    'Spring Boot',
    'Database & Cache',
    'CI/CD & DevOps',
    'Architecture & Leadership'
];

export const sortPointsByGroup = (points: ResumePoint[], groupOrder: string[]): ResumePoint[] => {
    return [...points].sort((a, b) => {
        const gA = a.group || 'Other';
        const gB = b.group || 'Other';
        if (gA === gB) return 0;
        if (gA === 'Other') return 1;
        if (gB === 'Other') return -1;
        const idxA = groupOrder.indexOf(gA);
        const idxB = groupOrder.indexOf(gB);
        const posA = idxA === -1 ? 999 : idxA;
        const posB = idxB === -1 ? 999 : idxB;
        if (posA !== posB) return posA - posB;
        return gA.localeCompare(gB);
    });
};

export function useResumeState() {
    const [data, setData] = useState<ResumeData[]>(() => {
        const raw = getResumeData();
        const savedOrder = localStorage.getItem('resume-experience-group-order');
        let order = DEFAULT_EXPERIENCE_GROUPS;
        if (savedOrder) {
            try { order = JSON.parse(savedOrder); } catch (e) {}
        }
        return raw.map(sec => {
            if (sec.type === 'experience') {
                return { ...sec, points: sortPointsByGroup(sec.points, order) };
            }
            return sec;
        });
    });

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

    const allGroups = useMemo(() => {
        const groups = new Set<string>();
        data.forEach(item => {
            if (item.group) {
                groups.add(item.group);
            }
        });
        return Array.from(groups).sort();
    }, [data]);

    const [targetGroup, setTargetGroup] = useState<string>(() => {
        return localStorage.getItem('resume-target-group') || '';
    });

    useEffect(() => {
        if (targetGroup) {
            localStorage.setItem('resume-target-group', targetGroup);
        }
    }, [targetGroup]);

    useEffect(() => {
        if (!targetGroup && allGroups.length > 0) {
            setTargetGroup(allGroups[0]);
        } else if (targetGroup && !allGroups.includes(targetGroup) && allGroups.length > 0) {
            setTargetGroup(allGroups[0]);
        }
    }, [allGroups, targetGroup]);

    const allRoles = useMemo(() => {
        const roles = new Set<string>();
        data.forEach(item => {
            if (item.role && item.group === targetGroup) {
                roles.add(item.role);
            }
        });
        return Array.from(roles).sort();
    }, [data, targetGroup]);

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

    const [experienceGroupOrder, setExperienceGroupOrder] = useState<string[]>(() => {
        const saved = localStorage.getItem('resume-experience-group-order');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) { }
        }
        return DEFAULT_EXPERIENCE_GROUPS;
    });

    const handleAddPoint = (sectionId: string, text: string, tagsStr: string, group?: string) => {
        if (!text.trim()) return;
        const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const newPointId = `custom-${Date.now()}`;
        const newPoint: ResumePoint = { id: newPointId, text: text.trim(), tags, group: group || 'General' };

        setData(prev => {
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;
                const points = [...sec.points, newPoint];
                const finalPoints = sec.type === 'experience'
                    ? sortPointsByGroup(points, experienceGroupOrder)
                    : points;
                return { ...sec, points: finalPoints };
            });
            const updatedSection = newData.find(s => s.id === sectionId);
            if (updatedSection) saveResumeFileLocal(updatedSection);
            return newData;
        });
        setSelectedPoints(prev => ({ ...prev, [newPointId]: true }));
    };

    const handleEditPoint = (sectionId: string, pointId: string, text: string, tagsStr: string, group?: string) => {
        if (!text.trim()) return;
        const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

        setData(prev => {
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;
                const updatedPoints = sec.points.map(p =>
                    p.id === pointId ? { ...p, text: text.trim(), tags, group: group || p.group || 'Other' } : p
                );
                const finalPoints = sec.type === 'experience'
                    ? sortPointsByGroup(updatedPoints, experienceGroupOrder)
                    : updatedPoints;
                return {
                    ...sec,
                    points: finalPoints
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
            let updatedSection: any = null;
            const newData = prev.map(sec => {
                if (sec.id !== sectionId) return sec;

                const points = [...sec.points];
                const ptIndex = points.findIndex(p => p.id === pointId);
                if (ptIndex === -1) return sec;

                const currentPt = points[ptIndex];
                const currentGrp = currentPt.group || 'Other';

                if (direction === 'up') {
                    let swapIdx = ptIndex - 1;
                    while (swapIdx >= 0 && (points[swapIdx].group || 'Other') !== currentGrp) {
                        swapIdx--;
                    }
                    if (swapIdx >= 0) {
                        const tmp = points[ptIndex];
                        points[ptIndex] = points[swapIdx];
                        points[swapIdx] = tmp;
                        changed = true;
                    }
                } else if (direction === 'down') {
                    let swapIdx = ptIndex + 1;
                    while (swapIdx < points.length && (points[swapIdx].group || 'Other') !== currentGrp) {
                        swapIdx++;
                    }
                    if (swapIdx < points.length) {
                        const tmp = points[ptIndex];
                        points[ptIndex] = points[swapIdx];
                        points[swapIdx] = tmp;
                        changed = true;
                    }
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

    const moveExperienceGroup = (sectionId: string, groupName: string, direction: 'up' | 'down') => {
        setData(prevData => {
            const sec = prevData.find(s => s.id === sectionId);
            if (!sec) return prevData;

            // Get unique non-Other groups in this section
            const uniqueGroups = Array.from(new Set(sec.points.map(p => p.group || 'Other'))).filter(g => g !== 'Other');

            let currentOrder = [...experienceGroupOrder];
            uniqueGroups.forEach(g => {
                if (!currentOrder.includes(g)) currentOrder.push(g);
            });

            // Sort present groups according to currentOrder
            uniqueGroups.sort((a, b) => {
                const idxA = currentOrder.indexOf(a);
                const idxB = currentOrder.indexOf(b);
                return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            });

            const currIdx = uniqueGroups.indexOf(groupName);
            if (currIdx === -1) return prevData;

            let swapWithGroup = '';
            if (direction === 'up' && currIdx > 0) {
                swapWithGroup = uniqueGroups[currIdx - 1];
            } else if (direction === 'down' && currIdx < uniqueGroups.length - 1) {
                swapWithGroup = uniqueGroups[currIdx + 1];
            }

            if (!swapWithGroup) return prevData;

            // In currentOrder, swap the relative positions of groupName and swapWithGroup
            const idx1 = currentOrder.indexOf(groupName);
            const idx2 = currentOrder.indexOf(swapWithGroup);
            if (idx1 !== -1 && idx2 !== -1) {
                const tmp = currentOrder[idx1];
                currentOrder[idx1] = currentOrder[idx2];
                currentOrder[idx2] = tmp;
            }

            setExperienceGroupOrder(currentOrder);
            localStorage.setItem('resume-experience-group-order', JSON.stringify(currentOrder));

            // Reorder points in this section
            const sortedPoints = sortPointsByGroup(sec.points, currentOrder);
            const updatedSection = { ...sec, points: sortedPoints };
            saveResumeFileLocal(updatedSection);

            return prevData.map(s => s.id === sectionId ? updatedSection : s);
        });
    };

    const filteredData = useMemo(() => {
        return data.filter(section => {
            return section.role === targetRole && section.group === targetGroup;
        });
    }, [data, targetRole, targetGroup]);

    const experienceData = filteredData.filter(d => d.type === 'experience');
    const projectData = filteredData.filter(d => d.type === 'project');
    const educationData = filteredData.filter(d => d.type === 'education');
    const certificationsData = filteredData.filter(d => d.type === 'certifications');
    const skillsData = filteredData.filter(d => d.type === 'skills');
    const publicationsData = filteredData.filter(d => d.type === 'publications');

    const loadSavedSubmission = (submission: {
        targetGroup?: string;
        targetRole?: string;
        selectedPoints?: Record<string, boolean>;
        layout?: LayoutSettings;
    }) => {
        if (submission.targetGroup) setTargetGroup(submission.targetGroup);
        if (submission.targetRole) setTargetRole(submission.targetRole);
        if (submission.selectedPoints) setSelectedPoints(submission.selectedPoints);
        if (submission.layout) setLayout(submission.layout);
    };

    return {
        data,
        targetGroup,
        setTargetGroup,
        allGroups,
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
        experienceGroupOrder,
        moveExperienceGroup,
        filteredData,
        experienceData,
        projectData,
        educationData,
        certificationsData,
        skillsData,
        publicationsData,
        toggleSectionVisibility,
        loadSavedSubmission
    };
}