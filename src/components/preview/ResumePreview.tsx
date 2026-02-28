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
            return { width: '210mm', minHeight: '297mm' };
        }
        return { width: '8.5in', minHeight: '11in' };
    };

    return (
        <div
            id="resume-preview-container"
            className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] resume-preview shrink-0 text-black leading-snug"
            style={{
                width: getPageDimensions().width,
                minHeight: getPageDimensions().minHeight,
                paddingLeft: layout.paddingLeftRight + 'mm',
                paddingRight: layout.paddingLeftRight + 'mm',
                paddingTop: layout.paddingTopBottom + 'mm',
                paddingBottom: layout.paddingTopBottom + 'mm',
                fontSize: '11pt'
            }}
        >
            <div className="text-center mb-6">
                <h1 className="text-[22pt] font-semibold text-black tracking-tight mb-1">Uditha H.</h1>
                <p className="text-[10pt] text-black flex justify-center flex-wrap gap-2 items-center">
                    <span>firstname.lastname@xyz.org</span>
                    <span>•</span>
                    <span>(999) 999-9999</span>
                    <span>•</span>
                    <span>github.com/username</span>
                    <span>•</span>
                    <span>linkedin.com/in/username</span>
                </p>
            </div>

            <div className="space-y-4">
                {/* Experience Section */}
                {data.filter(d => d.type === 'experience' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5"
                            style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                        >Experience</h2>
                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'experience').map(exp => {
                                const activePoints = exp.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0) return null;
                                return (
                                    <div key={exp.id}>
                                        <div className="flex justify-between font-semibold text-[11pt] text-black leading-snug mb-1">
                                            <span>{exp.designation} <span className="font-normal text-black">| {exp.company}</span></span>
                                            <span className="text-black text-[10pt] font-medium">
                                                {exp.location && <span className="mr-2">{exp.location}</span>}
                                                {exp.startDate} – {exp.endDate}
                                            </span>
                                        </div>
                                        <ul className="list-disc pl-[18px] text-[10pt] text-black flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                                            {activePoints.map(p => <li key={p.id}>{p.text}</li>)}
                                        </ul>
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
                            className="text-[12pt] font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5"
                            style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                        >Projects</h2>
                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'project').map(proj => {
                                const activePoints = proj.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0) return null;
                                return (
                                    <div key={proj.id}>
                                        <div className="flex justify-between font-semibold text-[11pt] text-black leading-snug mb-1">
                                            <span className="flex items-center gap-1.5">
                                                {proj.project_name}
                                                {proj.url && <span className="font-normal text-sky-700 text-[9pt] pt-0.5">| {proj.url}</span>}
                                            </span>
                                        </div>
                                        <ul className="list-disc pl-[18px] text-[10pt] text-black flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                                            {activePoints.map(p => <li key={p.id}>{p.text}</li>)}
                                        </ul>
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
                            className="text-[12pt] font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5"
                            style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                        >Education</h2>

                        <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                            {data.filter(d => d.type === 'education').map(edu => {
                                const activePoints = edu.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0 && edu.points.length > 0) return null;
                                return (
                                    <div key={edu.id}>
                                        <div className="flex justify-between font-semibold text-[11pt] text-black mb-0.5">
                                            <span>{edu.institution}, <span className="font-normal italic text-black">{edu.degree}</span></span>
                                            <span className="text-black text-[10pt]">
                                                {edu.location && <span className="mr-2">{edu.location}</span>}
                                                {edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                                            </span>
                                        </div>
                                        {edu.gpa && <div className="text-[10pt] text-black mb-1">GPA: {edu.gpa}</div>}
                                        {activePoints.length > 0 && (
                                            <ul className="list-disc pl-[18px] text-[10pt] text-black flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                                                {activePoints.map(p => <li key={p.id}>{p.text}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.filter(d => d.type === 'skills' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                    <div className="resume-section">
                        <h2
                            className="text-[12pt] font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5"
                            style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                        >Technical Skills</h2>

                        <div className="flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                            {data.filter(d => d.type === 'skills').map(skill => {
                                const activePoints = skill.points.filter(p => selectedPoints[p.id]);
                                if (activePoints.length === 0) return null;
                                return activePoints.map(p => {
                                    const colonIdx = p.text.indexOf(':');
                                    if (colonIdx !== -1) {
                                        return (
                                            <div key={p.id} className="text-[10pt] text-slate-800 leading-snug">
                                                <span className="font-semibold">{p.text.substring(0, colonIdx + 1)}</span>
                                                <span>{p.text.substring(colonIdx + 1)}</span>
                                            </div>
                                        );
                                    }
                                    return <div key={p.id} className="text-[10pt] text-slate-800">{p.text}</div>;
                                });
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
