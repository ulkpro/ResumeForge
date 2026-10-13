import type { ResumeData } from './parser';
import type { LayoutSettings } from '../types';
import { personalDetails } from '../config';

export interface SubmissionParams {
    company: string;
    jobId: string;
    jobName: string;
    notes?: string;
    targetGroup: string;
    targetRole: string;
    data: ResumeData[];
    selectedPoints: Record<string, boolean>;
    layout: LayoutSettings;
}

export function serializeResumeContent({
    company,
    jobId,
    jobName,
    notes,
    targetGroup,
    targetRole,
    data,
    selectedPoints,
    layout
}: SubmissionParams): string {
    const lines: string[] = [];

    // Frontmatter
    lines.push('---');
    lines.push(`company: "${company.replace(/"/g, '\\"')}"`);
    lines.push(`jobId: "${jobId.replace(/"/g, '\\"')}"`);
    lines.push(`jobName: "${jobName.replace(/"/g, '\\"')}"`);
    lines.push(`date: "${new Date().toISOString()}"`);
    lines.push(`targetGroup: "${targetGroup}"`);
    lines.push(`targetRole: "${targetRole}"`);
    if (notes) {
        lines.push(`notes: "${notes.replace(/"/g, '\\"')}"`);
    }
    lines.push('---');
    lines.push('');

    // Header info
    lines.push(`# ${personalDetails.name || 'Resume'}`);
    const contactParts: string[] = [];
    if (personalDetails.workAuthorization) contactParts.push(personalDetails.workAuthorization);
    if (personalDetails.location) contactParts.push(personalDetails.location);
    if (personalDetails.email) contactParts.push(personalDetails.email);
    if (personalDetails.phone) contactParts.push(personalDetails.phone);
    if (personalDetails.linkedin) contactParts.push(personalDetails.linkedin);
    if (personalDetails.github) contactParts.push(personalDetails.github);
    if (personalDetails.website) contactParts.push(personalDetails.website);

    if (contactParts.length > 0) {
        lines.push(contactParts.join(' | '));
    }
    lines.push('');
    lines.push(`> **Application:** ${jobId ? `[${jobId}] ` : ''}${jobName} at **${company}**`);
    lines.push(`> **Role Profile:** ${targetGroup} / ${targetRole}`);
    lines.push('');

    const sectionOrder = layout.sectionOrder || ['experience', 'projects', 'education', 'certifications', 'skills', 'publications'];
    const hidden = layout.hiddenSections || [];

    for (const sectionKey of sectionOrder) {
        if (hidden.includes(sectionKey)) continue;

        if (sectionKey === 'experience') {
            const expList = data.filter(d => d.type === 'experience' && d.points.some(p => selectedPoints[p.id]));
            if (expList.length > 0) {
                lines.push('## Experience');
                lines.push('');
                for (const exp of expList) {
                    const activePoints = exp.points.filter(p => selectedPoints[p.id]);
                    if (activePoints.length === 0) continue;

                    const dateStr = exp.startDate ? `${exp.startDate} ${exp.endDate ? `– ${exp.endDate}` : ''}`.trim() : '';
                    lines.push(`### ${exp.company || ''}${exp.location ? ` — ${exp.location}` : ''}`);
                    lines.push(`**${exp.designation || ''}**${dateStr ? ` | *${dateStr}*` : ''}`);
                    lines.push('');
                    for (const pt of activePoints) {
                        lines.push(`- ${pt.text}`);
                    }
                    lines.push('');
                }
            }
        }

        if (sectionKey === 'projects') {
            const projList = data.filter(d => d.type === 'project' && d.points.some(p => selectedPoints[p.id]));
            if (projList.length > 0) {
                lines.push('## Projects');
                lines.push('');
                for (const proj of projList) {
                    const activePoints = proj.points.filter(p => selectedPoints[p.id]);
                    if (activePoints.length === 0) continue;

                    lines.push(`### ${proj.project_name || 'Project'}${proj.url ? ` (${proj.url})` : ''}`);
                    lines.push('');
                    for (const pt of activePoints) {
                        lines.push(`- ${pt.text}`);
                    }
                    lines.push('');
                }
            }
        }

        if (sectionKey === 'education') {
            const eduList = data.filter(d => d.type === 'education' && (d.points.some(p => selectedPoints[p.id]) || d.points.length === 0 || d.coursework));
            if (eduList.length > 0) {
                lines.push('## Education');
                lines.push('');
                for (const edu of eduList) {
                    const dateStr = edu.startDate ? `${edu.startDate} – ${edu.endDate}` : (edu.endDate || '');
                    lines.push(`### ${edu.institution || ''}${edu.location ? ` — ${edu.location}` : ''}`);
                    const degreeGpa = [edu.degree, edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean).join(', ');
                    lines.push(`*${degreeGpa}*${dateStr ? ` | ${dateStr}` : ''}`);
                    if (edu.coursework && selectedPoints[`${edu.id}-coursework`] !== false) {
                        lines.push(`- **Relevant Coursework:** ${edu.coursework}`);
                    }
                    const activePoints = edu.points.filter(p => selectedPoints[p.id]);
                    for (const pt of activePoints) {
                        lines.push(`- ${pt.text}`);
                    }
                    lines.push('');
                }
            }
        }

        if (sectionKey === 'certifications') {
            const certList = data.filter(d => d.type === 'certifications');
            if (certList.length > 0) {
                lines.push('## Certifications');
                lines.push('');
                for (const cert of certList) {
                    const name = cert.project_name || cert.certification || cert.company || '';
                    const date = cert.publicationDate || cert.startDate || cert.endDate || '';
                    lines.push(`- **${name}**${date ? ` (${date})` : ''}`);
                }
                lines.push('');
            }
        }

        if (sectionKey === 'skills') {
            const skillsList = data.filter(d => d.type === 'skills');
            if (skillsList.length > 0) {
                lines.push('## Technical Skills');
                lines.push('');
                for (const skill of skillsList) {
                    const category = skill.category || 'Skills';
                    const rawText = skill.points.map(p => p.text).join(', ');
                    const individualSkills = rawText.split(',').map(s => s.trim()).filter(Boolean);
                    const activeSkills = individualSkills.filter(s =>
                        selectedPoints[`${skill.id}-skill-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`] !== false
                    );
                    if (activeSkills.length > 0) {
                        lines.push(`- **${category}:** ${activeSkills.join(', ')}`);
                    }
                }
                lines.push('');
            }
        }

        if (sectionKey === 'publications') {
            const pubList = data.filter(d => d.type === 'publications' && d.points.some(p => selectedPoints[p.id]));
            if (pubList.length > 0) {
                lines.push('## Publications');
                lines.push('');
                for (const pub of pubList) {
                    const activePoints = pub.points.filter(p => selectedPoints[p.id]);
                    if (activePoints.length === 0) continue;

                    const date = pub.publicationDate || pub.startDate || pub.endDate || '';
                    lines.push(`### ${pub.project_name || pub.company || ''}${date ? ` (${date})` : ''}`);
                    if (pub.publisher || pub.url) {
                        lines.push(`*${pub.publisher || ''}*${pub.url ? ` [${pub.url}]` : ''}`);
                    }
                    for (const pt of activePoints) {
                        lines.push(`- ${pt.text}`);
                    }
                    lines.push('');
                }
            }
        }
    }

    // Append snapshot comment so the exact state can be reconstructed with 100% precision
    const snapshot = {
        company,
        jobId,
        jobName,
        targetGroup,
        targetRole,
        data,
        selectedPoints,
        layout,
        personalDetails
    };
    lines.push('');
    lines.push('<!-- RESUME_STATE_SNAPSHOT:');
    lines.push(JSON.stringify(snapshot));
    lines.push('-->');

    return lines.join('\n');
}

export interface DeserializedSubmission {
    company: string;
    jobId: string;
    jobName: string;
    targetGroup: string;
    targetRole: string;
    data: ResumeData[];
    selectedPoints: Record<string, boolean>;
    layout: LayoutSettings;
    personalDetails?: typeof personalDetails;
}

export function deserializeResumeSubmission(rawContent: string, defaultLayoutFallback: LayoutSettings): DeserializedSubmission {
    // 1. Try to find embedded snapshot comment
    const match = rawContent.match(/<!--\s*RESUME_STATE_SNAPSHOT:\s*\n([\s\S]*?)\n\s*-->/);
    if (match && match[1]) {
        try {
            const parsed = JSON.parse(match[1]);
            return {
                company: parsed.company || '',
                jobId: parsed.jobId || '',
                jobName: parsed.jobName || '',
                targetGroup: parsed.targetGroup || 'dev',
                targetRole: parsed.targetRole || 'base',
                data: parsed.data || [],
                selectedPoints: parsed.selectedPoints || {},
                layout: parsed.layout || defaultLayoutFallback,
                personalDetails: parsed.personalDetails || personalDetails
            };
        } catch (e) {
            console.warn('Failed to parse RESUME_STATE_SNAPSHOT, falling back to markdown parser', e);
        }
    }

    // 2. Fallback: Parse markdown structure into ResumeData[]
    return parseMarkdownToSubmission(rawContent, defaultLayoutFallback);
}

function parseMarkdownToSubmission(rawContent: string, defaultLayoutFallback: LayoutSettings): DeserializedSubmission {
    let company = '';
    let jobId = '';
    let jobName = '';
    let targetGroup = 'dev';
    let targetRole = 'base';
    const parsedPersonalDetails = { ...personalDetails };

    // Parse frontmatter
    let body = rawContent;
    if (rawContent.startsWith('---')) {
        const parts = rawContent.split('---');
        if (parts.length >= 3) {
            const fm = parts[1];
            body = parts.slice(2).join('---');
            const lines = fm.split('\n');
            for (const line of lines) {
                const colon = line.indexOf(':');
                if (colon !== -1) {
                    const k = line.slice(0, colon).trim();
                    let v = line.slice(colon + 1).trim();
                    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
                    if (k === 'company') company = v;
                    if (k === 'jobId') jobId = v;
                    if (k === 'jobName') jobName = v;
                    if (k === 'targetGroup') targetGroup = v;
                    if (k === 'targetRole') targetRole = v;
                }
            }
        }
    }

    const lines = body.split('\n');
    const resumeDataList: ResumeData[] = [];
    const selectedPoints: Record<string, boolean> = {};

    let currentSectionType: ResumeData['type'] | null = null;
    let currentItem: ResumeData | null = null;
    let pointCounter = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Candidate Name header
        if (line.startsWith('# ')) {
            parsedPersonalDetails.name = line.replace('# ', '').trim();
            continue;
        }

        // Section header
        if (line.startsWith('## ')) {
            const heading = line.replace('## ', '').trim().toLowerCase();
            if (heading.includes('experience')) currentSectionType = 'experience';
            else if (heading.includes('project')) currentSectionType = 'project';
            else if (heading.includes('education')) currentSectionType = 'education';
            else if (heading.includes('skill')) currentSectionType = 'skills';
            else if (heading.includes('certif')) currentSectionType = 'certifications';
            else if (heading.includes('publicat')) currentSectionType = 'publications';
            else currentSectionType = null;
            currentItem = null;
            continue;
        }

        // Sub-items
        if (currentSectionType === 'experience') {
            if (line.startsWith('### ')) {
                const titleLine = line.replace('### ', '').trim();
                const [comp, loc] = titleLine.split(' — ');
                currentItem = {
                    id: `exp-${resumeDataList.length}`,
                    filePath: '',
                    type: 'experience',
                    company: comp?.trim(),
                    location: loc?.trim() || '',
                    designation: '',
                    startDate: '',
                    endDate: '',
                    role: targetRole,
                    group: targetGroup,
                    points: []
                };
                resumeDataList.push(currentItem);
                continue;
            }
            if (line.startsWith('**') && currentItem) {
                // **Designation** | *Dates*
                const parts = line.split('|');
                const desigPart = parts[0]?.replace(/\*\*/g, '').trim() || '';
                const datePart = parts[1]?.replace(/[\*_]/g, '').trim() || '';
                currentItem.designation = desigPart;
                if (datePart.includes('–')) {
                    const [s, e] = datePart.split('–');
                    currentItem.startDate = s?.trim();
                    currentItem.endDate = e?.trim();
                } else {
                    currentItem.startDate = datePart;
                }
                continue;
            }
            if (line.startsWith('- ') && currentItem) {
                const ptId = `pt-${++pointCounter}`;
                const text = line.replace(/^- /, '').trim();
                currentItem.points.push({ id: ptId, text, tags: [] });
                selectedPoints[ptId] = true;
                continue;
            }
        }

        if (currentSectionType === 'projects') {
            if (line.startsWith('### ')) {
                const titleLine = line.replace('### ', '').trim();
                const urlMatch = titleLine.match(/\((https?:\/\/[^\)]+)\)/);
                const url = urlMatch ? urlMatch[1] : '';
                const name = titleLine.replace(/\([^\)]+\)/, '').trim();

                currentItem = {
                    id: `proj-${resumeDataList.length}`,
                    filePath: '',
                    type: 'project',
                    project_name: name,
                    url,
                    role: targetRole,
                    group: targetGroup,
                    points: []
                };
                resumeDataList.push(currentItem);
                continue;
            }
            if (line.startsWith('- ') && currentItem) {
                const ptId = `pt-${++pointCounter}`;
                const text = line.replace(/^- /, '').trim();
                currentItem.points.push({ id: ptId, text, tags: [] });
                selectedPoints[ptId] = true;
                continue;
            }
        }

        if (currentSectionType === 'education') {
            if (line.startsWith('### ')) {
                const titleLine = line.replace('### ', '').trim();
                const [inst, loc] = titleLine.split(' — ');
                currentItem = {
                    id: `edu-${resumeDataList.length}`,
                    filePath: '',
                    type: 'education',
                    institution: inst?.trim(),
                    location: loc?.trim() || '',
                    degree: '',
                    gpa: '',
                    startDate: '',
                    endDate: '',
                    role: targetRole,
                    group: targetGroup,
                    points: []
                };
                resumeDataList.push(currentItem);
                continue;
            }
            if (line.startsWith('*') && currentItem) {
                // *Degree, GPA: 3.8* | Dates
                const clean = line.replace(/^\*|\*$/g, '');
                const [degGpa, datePart] = clean.split('|');
                if (degGpa) {
                    const gpaMatch = degGpa.match(/GPA:\s*([\d\.]+)/);
                    if (gpaMatch) {
                        currentItem.gpa = gpaMatch[1];
                        currentItem.degree = degGpa.replace(/,?\s*GPA:\s*[\d\.]+/, '').trim();
                    } else {
                        currentItem.degree = degGpa.trim();
                    }
                }
                if (datePart) {
                    currentItem.endDate = datePart.trim();
                }
                continue;
            }
            if (line.startsWith('- **Relevant Coursework:**') && currentItem) {
                currentItem.coursework = line.replace('- **Relevant Coursework:**', '').trim();
                selectedPoints[`${currentItem.id}-coursework`] = true;
                continue;
            }
            if (line.startsWith('- ') && currentItem) {
                const ptId = `pt-${++pointCounter}`;
                const text = line.replace(/^- /, '').trim();
                currentItem.points.push({ id: ptId, text, tags: [] });
                selectedPoints[ptId] = true;
                continue;
            }
        }

        if (currentSectionType === 'skills') {
            if (line.startsWith('- **') && line.includes('**:')) {
                // - **Category:** skill1, skill2
                const colonIdx = line.indexOf('**:');
                const cat = line.slice(4, colonIdx).trim();
                const skillsStr = line.slice(colonIdx + 3).trim();

                const skillItem: ResumeData = {
                    id: `skill-${resumeDataList.length}`,
                    filePath: '',
                    type: 'skills',
                    category: cat,
                    role: targetRole,
                    group: targetGroup,
                    points: [{ id: `skill-pt-${++pointCounter}`, text: skillsStr, tags: [] }]
                };
                resumeDataList.push(skillItem);
                continue;
            }
        }

        if (currentSectionType === 'certifications') {
            if (line.startsWith('- **')) {
                const match = line.match(/-\s*\*\*(.*?)\*\*(?:\s*\((.*?)\))?/);
                if (match) {
                    const certItem: ResumeData = {
                        id: `cert-${resumeDataList.length}`,
                        filePath: '',
                        type: 'certifications',
                        project_name: match[1]?.trim(),
                        publicationDate: match[2]?.trim(),
                        role: targetRole,
                        group: targetGroup,
                        points: []
                    };
                    resumeDataList.push(certItem);
                }
                continue;
            }
        }

        if (currentSectionType === 'publications') {
            if (line.startsWith('### ')) {
                const titleLine = line.replace('### ', '').trim();
                const match = titleLine.match(/(.*?)(?:\s*\((.*?)\))?$/);
                currentItem = {
                    id: `pub-${resumeDataList.length}`,
                    filePath: '',
                    type: 'publications',
                    project_name: match ? match[1].trim() : titleLine,
                    publicationDate: match && match[2] ? match[2].trim() : '',
                    publisher: '',
                    role: targetRole,
                    group: targetGroup,
                    points: []
                };
                resumeDataList.push(currentItem);
                continue;
            }
            if (line.startsWith('*') && currentItem) {
                // *Publisher* [url]
                const pubMatch = line.match(/\*(.*?)\*(?:\s*\[(.*?)\])?/);
                if (pubMatch) {
                    currentItem.publisher = pubMatch[1];
                    currentItem.url = pubMatch[2];
                }
                continue;
            }
            if (line.startsWith('- ') && currentItem) {
                const ptId = `pt-${++pointCounter}`;
                const text = line.replace(/^- /, '').trim();
                currentItem.points.push({ id: ptId, text, tags: [] });
                selectedPoints[ptId] = true;
                continue;
            }
        }
    }

    return {
        company,
        jobId,
        jobName,
        targetGroup,
        targetRole,
        data: resumeDataList,
        selectedPoints,
        layout: defaultLayoutFallback,
        personalDetails: parsedPersonalDetails
    };
}
