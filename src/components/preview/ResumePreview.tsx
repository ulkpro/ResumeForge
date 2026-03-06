import type { LayoutSettings } from '../../types';
import type { ResumeData } from '../../utils/parser';

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
                paddingLeft: layout.paddingLeftRight + 'mm',
                paddingRight: layout.paddingLeftRight + 'mm',
                paddingTop: layout.paddingTopBottom + 'mm',
                paddingBottom: layout.paddingTopBottom + 'mm',
                fontSize: '11pt',
                fontFamily: layout.fontFamily || "'LMRoman10', 'Latin Modern Roman', serif"
            }}
        >
            <div className="text-center" style={{ marginBottom: (layout.gapHeaderToFirstSection ?? 24) + 'px' }}>
                <h1 className="text-[22pt] font-bold tracking-tight mb-1">Uditha H.</h1>
                <p className="text-[10pt] flex justify-center flex-wrap gap-2 items-center">
                    <span><a href="mailto:firstname.lastname@xyz.org" className="hover:underline text-black no-underline" style={{ color: '#000' }}>firstname.lastname@xyz.org</a></span>
                    <span>•</span>
                    <span>(999) 999-9999</span>
                    <span>•</span>
                    <span><a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="hover:underline text-black no-underline" style={{ color: '#000' }}>github.com/username</a></span>
                    <span>•</span>
                    <span><a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" className="hover:underline text-black no-underline" style={{ color: '#000' }}>linkedin.com/in/username</a></span>
                </p>
            </div>

            <div className="flex flex-col" style={{ gap: (layout.gapMajorSections ?? 16) + 'px' }}>
                {/* Experience Section */}
                {data.filter(d => d.type === 'experience' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider border-b-2"
                            style={{ paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                        >Experience</h2>
                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'experience').map(exp => {
                                const activePoints = exp.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0) return null;
                                return (
                                    <div key={exp.id}>
                                        <div className="flex justify-between font-bold text-[11pt] leading-snug">
                                            <span>{exp.designation}</span>
                                            <span className="text-[10pt] font-normal">
                                                {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[10.5pt] leading-snug mb-1">
                                            <span className="font-medium italic">{exp.company}</span>
                                            <span className="text-[10pt] font-normal">{exp.location}</span>
                                        </div>
                                        <div className="text-[10pt] flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
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
                )}

                {/* Projects Section */}
                {data.filter(d => d.type === 'project' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider border-b-2"
                            style={{ paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                        >Projects</h2>
                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'project').map(proj => {
                                const activePoints = proj.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0) return null;
                                return (
                                    <div key={proj.id}>
                                        <div className="flex justify-between font-bold text-[11pt] leading-snug mb-1">
                                            <span className="flex items-center gap-1.5">
                                                {proj.project_name}
                                                {proj.url && (
                                                    <span className="font-normal text-[9pt] pt-0.5" style={{ color: '#0369a1' }}>
                                                        | <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline no-underline" style={{ color: '#0369a1' }}>{proj.url}</a>
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-[10pt] flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
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
                )}

                {/* Education Section */}
                {data.filter(d => d.type === 'education' && (d.points.some(p => selectedPoints[p.id]) || d.points.length === 0)).length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider border-b-2"
                            style={{ paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                        >Education</h2>

                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'education').map(edu => {
                                const activePoints = edu.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0 && edu.points.length > 0) return null;
                                return (
                                    <div key={edu.id}>
                                        <div className="flex justify-between font-bold text-[11pt] mb-0.5">
                                            <span>{edu.institution}, <span className="font-normal italic">{edu.degree}</span></span>
                                            <span className="text-[10pt]">
                                                {edu.location && <span className="mr-2">{edu.location}</span>}
                                                {edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                                            </span>
                                        </div>
                                        {edu.gpa && <div className="text-[10pt] mb-1">GPA: {edu.gpa}</div>}
                                        {activePoints.length > 0 && (
                                            <div className="text-[10pt] flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                                                {activePoints.map(p => (
                                                    <div key={p.id} className="flex gap-2 pl-1">
                                                        <span className="select-none inline-block flex-shrink-0">•</span>
                                                        <span>{p.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.filter(d => d.type === 'skills').length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider border-b-2"
                            style={{ paddingBottom: (layout.gapTitleToLine ?? 4) + 'px', marginBottom: layout.gapSectionToSub + 'px', borderBottomColor: '#000000' }}
                        >Technical Skills</h2>

                        <div className="flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
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
                                    <div key={skill.id} className="text-[10pt] leading-snug">
                                        <span className="font-bold">{categoryTitle}: </span>
                                        <span>{activeSkills.join(', ')}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
