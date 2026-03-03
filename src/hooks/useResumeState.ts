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
                return { ...defaultLayout, ...JSON.parse(saved) };
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

    const filteredData = useMemo(() => {
        return data.filter(section => {
            return section.role === targetRole;
        });
    }, [data, targetRole]);

    const experienceData = filteredData.filter(d => d.type === 'experience');
    const projectData = filteredData.filter(d => d.type === 'project');
    const educationData = filteredData.filter(d => d.type === 'education');
    const skillsData = filteredData.filter(d => d.type === 'skills');

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
        toggleSection,
        handleAddPoint,
        filteredData,
        experienceData,
        projectData,
        educationData,
        skillsData
    };
}