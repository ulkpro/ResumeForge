import { useState, useMemo, useEffect } from 'react';
import { getResumeData } from '../data';
import type { ResumeData, ResumePoint } from '../utils/parser';

import type { LayoutSettings } from '../types';
import { defaultLayout } from '../types';

export function useResumeState() {
    const [data, setData] = useState<ResumeData[]>(getResumeData());
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        data.forEach(item => {
            item.points.forEach(point => {
                point.tags.forEach(tag => tags.add(tag));
            });
        });
        return Array.from(tags).sort();
    }, [data]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

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
        setData(prev => prev.map(sec =>
            sec.id === sectionId ? { ...sec, points: [...sec.points, newPoint] } : sec
        ));
        setSelectedPoints(prev => ({ ...prev, [newPointId]: true }));
    };

    const filteredData = useMemo(() => {
        return data.map(section => ({
            ...section,
            points: section.points.filter(p => {
                if (selectedTags.length === 0) return true;
                return selectedTags.some(tag => p.tags.includes(tag));
            })
        })).filter(section => section.points.length > 0 || true);
    }, [data, selectedTags]);

    const experienceData = filteredData.filter(d => d.type === 'experience');
    const projectData = filteredData.filter(d => d.type === 'project');
    const educationData = filteredData.filter(d => d.type === 'education');
    const skillsData = filteredData.filter(d => d.type === 'skills');

    return {
        data,
        selectedTags,
        setSelectedTags,
        selectedPoints,
        layout,
        setLayout,
        collapsedSections,
        allTags,
        handleTagToggle,
        handlePointToggle,
        toggleSection,
        handleAddPoint,
        filteredData,
        experienceData,
        projectData,
        educationData,
        skillsData
    };
}