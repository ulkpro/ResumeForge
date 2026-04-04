import type { LayoutSettings } from '../../types';
import type { ResumeData } from '../../utils/parser';
import { personalDetails } from '../../config';

interface ResumePreviewProps {
    data: ResumeData[];
    selectedPoints: Record<string, boolean>;
    layout: LayoutSettings;
}

export function ResumePreview({ data, selectedPoints, layout }: ResumePreviewProps) {
    const getPageDimensions = () => {
        if (layout.pageSize === 'A4') {
            return { width: '210mm', minHeight: '296mm' };
        }
        return { width: '8.5in', minHeight: '10.9in' };
    };

    return (
        <div
            id="resume-preview-container"
            className=" shadow-[0_8px_30px_rgb(0,0,0,0.06)] resume-preview shrink-0 leading-snug"
            style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                width: getPageDimensions().width,
                minHeight: getPageDimensions().minHeight,
                paddingLeft: Math.max(0, layout.paddingLeftRight) + 'mm',
                paddingRight: Math.max(0, layout.paddingLeftRight) + 'mm',
                paddingTop: Math.max(0, layout.paddingTopBottom) + 'mm',
                paddingBottom: Math.max(0, layout.paddingTopBottom) + 'mm',
                fontSize: '11pt',
                fontFamily: layout.fontFamily || "'LMRoman10', 'Latin Modern Roman', serif"
            }}
        >
            <style>{`
                .gap-major > *:not(:first-child) { margin-top: ${Math.min(0, layout.gapMajorSections ?? 16)}px; }
                .gap-subs > *:not(:first-child) { margin-top: ${Math.min(0, layout.gapSubsections ?? 14)}px; }
                .gap-points > *:not(:first-child) { margin-top: ${Math.min(0, layout.gapPoints ?? 4)}px; }
            `}</style>
            <div style={{
                marginLeft: Math.min(0, layout.paddingLeftRight) + 'mm',
                marginRight: Math.min(0, layout.paddingLeftRight) + 'mm',
                marginTop: Math.min(0, layout.paddingTopBottom) + 'mm',
                marginBottom: Math.min(0, layout.paddingTopBottom) + 'mm',
            }}>
            <div className="text-center" style={{ marginBottom: (layout.gapHeaderToFirstSection ?? 24) + 'px' }}>
                <h1 className="font-bold tracking-tight" style={{ fontSize: (layout.fontSizeName || 25) + 'pt', marginBottom: (layout.gapNameAuth ?? 4) + 'px' }}>{personalDetails.name}</h1>
                
                {(personalDetails.workAuthorization || personalDetails.location) && (
                    <div className="flex justify-center items-center" style={{ fontSize: (layout.fontSizeContact || 10) + 'pt', marginBottom: (layout.gapAuthContact ?? 4) + 'px' }}>
                        {personalDetails.workAuthorization && <span>Work Authorization: {personalDetails.workAuthorization}</span>}
                        {personalDetails.workAuthorization && personalDetails.location && <span className="mx-2">|</span>}
                        {personalDetails.location && <span>Location: {personalDetails.location}</span>}
                    </div>
                )}

                <p className="flex justify-center flex-wrap gap-2 items-center" style={{ fontSize: (layout.fontSizeContact || 10) + 'pt' }}>
                    {(() => {
                        const items = [];
                        if (personalDetails.email) items.push(<a href={`mailto:${personalDetails.email}`} className="hover:underline text-black no-underline" style={{ color: '#000' }}>{personalDetails.email}</a>);
                        if (personalDetails.phone) items.push(<span>{personalDetails.phone}</span>);
                        if (personalDetails.github) items.push(<a href={`https://${personalDetails.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black no-underline" style={{ color: '#000' }}>{personalDetails.github}</a>);
                        if (personalDetails.linkedin) items.push(<a href={`https://${personalDetails.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black no-underline" style={{ color: '#000' }}>{personalDetails.linkedin}</a>);
                        if (personalDetails.website) items.push(<a href={`https://${personalDetails.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black no-underline" style={{ color: '#000' }}>{personalDetails.website}</a>);
                        
                        return items.map((item, i) => (
                            <span key={i} className="flex gap-2 items-center">
                                {item}
                                {i < items.length - 1 && <span>•</span>}
                            </span>
                        ));
                    })()}
                </p>
            </div>

            <div className="flex flex-col gap-major" style={{ gap: Math.max(0, layout.gapMajorSections ?? 16) + 'px' }}>
                {(layout.sectionOrder || ['experience', 'projects', 'education', 'skills', 'publications']).map(sectionKey => {
                    if (layout.hiddenSections?.includes(sectionKey)) return null;

                    if (sectionKey === 'education') {
                        return data.filter(d => d.type === 'education' && (d.points.some(p => selectedPoints[p.id]) || d.points.length === 0)).length > 0 ? (
                            <div key="education-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Education</h2>

                                <div className="flex flex-col gap-subs" style={{ gap: Math.max(0, layout.gapSubsections) + 'px' }}>
                                    {data.filter(d => d.type === 'education').map(edu => {
                                        const activePoints = edu.points.filter(p => selectedPoints[p.id]);
                                        if (activePoints.length === 0 && edu.points.length > 0) return null;
                                        return (
                                            <div key={edu.id}>
                                                <div className="flex justify-between font-bold leading-snug" style={{ fontSize: (layout.fontSizeOrgName || 11) + 'pt' }}>
                                                    <span>{edu.institution}</span>
                                                    <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>{edu.location}</span>
                                                </div>
                                                <div className="flex justify-between leading-snug" style={{ fontSize: (layout.fontSizeRoleDesc || 10) + 'pt' }}>
                                                    <span>
                                                        <span className="italic">{edu.degree}</span>
                                                        {edu.gpa && <span>, GPA: {edu.gpa}</span>}
                                                    </span>
                                                    <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>
                                                        {edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                                                    </span>
                                                </div>
                                                {edu.coursework && selectedPoints[`${edu.id}-coursework`] !== false && (
                                                    <div className="leading-snug" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt', marginTop: (layout.gapCoursework ?? 2) + 'px' }}>
                                                        <span className="font-semibold select-none">Relevant Coursework: </span>
                                                        <span>{edu.coursework}</span>
                                                    </div>
                                                )}
                                                {activePoints.length > 0 && (
                                                    <div className="flex flex-col gap-points" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt', gap: Math.max(0, layout.gapPoints) + 'px' }}>
                                                        {activePoints.map(p => (
                                                            <div key={p.id} className="leading-snug">
                                                                {p.text}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null;
                    }

                    if (sectionKey === 'experience') {
                        return data.filter(d => d.type === 'experience' && d.points.some(p => selectedPoints[p.id])).length > 0 ? (
                            <div key="experience-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Experience</h2>
                                <div className="flex flex-col gap-subs" style={{ gap: Math.max(0, layout.gapSubsections) + 'px' }}>
                                    {data.filter(d => d.type === 'experience').map(exp => {
                                        const activePoints = exp.points.filter(p => selectedPoints[p.id]);
                                        if (activePoints.length === 0) return null;
                                        return (
                                            <div key={exp.id}>
                                                <div className="flex justify-between font-bold leading-snug" style={{ fontSize: (layout.fontSizeOrgName || 11) + 'pt' }}>
                                                    <span>{exp.company}</span>
                                                    <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>{exp.location}</span>
                                                </div>
                                                <div className="flex justify-between leading-snug mb-1" style={{ fontSize: (layout.fontSizeRoleDesc || 10) + 'pt' }}>
                                                    <span className="italic">{exp.designation}</span>
                                                    <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>
                                                        {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-points" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt', gap: Math.max(0, layout.gapPoints) + 'px' }}>
                                                    {activePoints.map(p => (
                                                        <div key={p.id} className="flex gap-2 pl-1">
                                                            <span className="select-none inline-block flex-shrink-0">•</span>
                                                            <span>{p.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null;
                    }

                    if (sectionKey === 'projects') {
                        return data.filter(d => d.type === 'project' && d.points.some(p => selectedPoints[p.id])).length > 0 ? (
                            <div key="projects-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Projects</h2>
                                <div className="flex flex-col gap-subs" style={{ gap: Math.max(0, layout.gapSubsections) + 'px' }}>
                                    {data.filter(d => d.type === 'project').map(proj => {
                                        const activePoints = proj.points.filter(p => selectedPoints[p.id]);
                                        if (activePoints.length === 0) return null;
                                        return (
                                            <div key={proj.id}>
                                                <div className="flex justify-between font-bold leading-snug mb-1" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt' }}>
                                                    <span className="flex items-center gap-1.5">
                                                        {proj.project_name}
                                                        {proj.url && (
                                                            <span className="font-normal pt-0.5" style={{ fontSize: '9pt', color: '#0369a1' }}>
                                                                | <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline no-underline" style={{ color: '#0369a1' }}>{proj.url}</a>
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-points" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt', gap: Math.max(0, layout.gapPoints) + 'px' }}>
                                                    {activePoints.map(p => (
                                                        <div key={p.id} className="flex gap-2 pl-1">
                                                            <span className="select-none inline-block flex-shrink-0">•</span>
                                                            <span>{p.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null;
                    }

                    if (sectionKey === 'certifications') {
                        const certsData = data.filter(d => d.type === 'certifications');
                        if (certsData.length === 0) return null;

                        return (
                            <div key="certifications-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Certifications</h2>
                                <div className="flex flex-col gap-subs" style={{ gap: Math.max(0, layout.gapSubsections) + 'px' }}>
                                    {certsData.map(cert => (
                                        <div key={cert.id} className="flex justify-between font-bold leading-snug" style={{ fontSize: (layout.fontSizeOrgName || 11) + 'pt' }}>
                                            <span className="flex items-center gap-1.5">
                                                {cert.project_name || cert.certification || cert.company}
                                            </span>
                                            <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>
                                                {cert.publicationDate || cert.startDate || cert.endDate}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    if (sectionKey === 'skills') {
                        return data.filter(d => d.type === 'skills').length > 0 ? (
                            <div key="skills-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Technical Skills</h2>

                                <div className="flex flex-col gap-points" style={{ gap: Math.max(0, layout.gapPoints) + 'px' }}>
                                    {data.filter(d => d.type === 'skills').map(skill => {
                                        const categoryTitle = skill.category || 'Skills';
                                        const rawText = skill.points.map(p => p.text).join(', ');
                                        const individualSkills = rawText.split(',').map(s => s.trim()).filter(s => s);
                                        // Only include skills that haven't been explicitly deselected
                                        const activeSkills = individualSkills.filter((s) =>
                                            selectedPoints[`${skill.id}-skill-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`] !== false
                                        );
                                        if (activeSkills.length === 0) return null;
                                        return (
                                            <div key={skill.id} className="leading-snug" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt' }}>
                                                <span className="font-bold">{categoryTitle}: </span>
                                                <span>{activeSkills.join(', ')}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null;
                    }

                    if (sectionKey === 'publications') {
                        return data.filter(d => d.type === 'publications' && d.points.some(p => selectedPoints[p.id])).length > 0 ? (
                            <div key="publications-section" className="resume-section">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2"
                                    style={{ fontSize: (layout.fontSizeSectionTitle || 12) + 'pt', paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                                >Publications</h2>
                                <div className="flex flex-col gap-subs" style={{ gap: Math.max(0, layout.gapSubsections) + 'px' }}>
                                    {data.filter(d => d.type === 'publications').map(pub => {
                                        const activePoints = pub.points.filter(p => selectedPoints[p.id]);
                                        if (activePoints.length === 0) return null;
                                        return (
                                            <div key={pub.id}>
                                                <div className="flex justify-between font-bold leading-snug" style={{ fontSize: (layout.fontSizeOrgName || 11) + 'pt' }}>
                                                    <span>{pub.project_name || pub.company}</span>
                                                    <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>
                                                        {pub.publicationDate || pub.startDate || pub.endDate}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between leading-snug" style={{ fontSize: (layout.fontSizeRoleDesc || 10) + 'pt' }}>
                                                    <span className="italic">{pub.publisher}</span>
                                                    {pub.url && (
                                                        <span className="font-normal" style={{ fontSize: (layout.fontSizeLocDate || 11) + 'pt' }}>
                                                            <a href={pub.url.startsWith('http') ? pub.url : `https://${pub.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline no-underline" style={{ color: '#0369a1' }}>
                                                                {pub.url.replace(/^https?:\/\//, '')}
                                                            </a>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-points" style={{ fontSize: (layout.fontSizeBullet || 10) + 'pt', gap: Math.max(0, layout.gapPoints) + 'px' }}>
                                                    {activePoints.map(p => (
                                                        <div key={p.id} className="flex gap-2 pl-1">
                                                            <span className="select-none inline-block flex-shrink-0">•</span>
                                                            <span>{p.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null;
                    }

                    return null;
                })}
            </div>
            </div>
        </div>
    );
}
