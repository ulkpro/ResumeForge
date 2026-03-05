export interface ResumePoint {
    id: string;
    text: string;
    tags: string[];
}

export interface ResumeData {
    id: string;
    filePath: string;
    type: 'experience' | 'project' | 'education' | 'skills';
    company?: string;
    designation?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    project_name?: string;
    url?: string;
    institution?: string;
    degree?: string;
    gpa?: string;
    category?: string;
    role: string;
    order?: number;
    points: ResumePoint[];
}

export function parseMarkdown(fileName: string, rawContent: string, filePath: string = ''): ResumeData {
    const parts = rawContent.split('---');
    let frontmatterStr = '';
    let bodyStr = rawContent;

    if (parts.length >= 3 && rawContent.startsWith('---')) {
        frontmatterStr = parts[1];
        bodyStr = parts.slice(2).join('---');
    }

    const frontmatter: Record<string, string> = {};
    frontmatterStr.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim();
            let value = line.slice(colonIdx + 1).trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            frontmatter[key] = value;
        }
    });

    let fileRole = 'base';
    if (filePath) {
        // e.g. ../resume-points/java-backend/experience/abc.md
        const pathParts = filePath.split('/');
        const rpIndex = pathParts.indexOf('resume-points');
        if (rpIndex !== -1 && pathParts.length > rpIndex + 1) {
            fileRole = pathParts[rpIndex + 1];
        }
    }
    const finalRole = (frontmatter['role'] || frontmatter['jobRole'] || frontmatter['job_role'] || fileRole).toLowerCase();

    const points: ResumePoint[] = [];
    const lines = bodyStr.split('\n').filter(line => line.trim().startsWith('-'));

    lines.forEach((line, idx) => {
        const textPart = line.trim().substring(1).trim();
        // Extract tags from the end like [Java, Spring]
        const tagMatch = textPart.match(/\[(.*?)\]$/);
        const tags = tagMatch ? tagMatch[1].split(',').map(t => t.trim()) : [];
        const text = tagMatch ? textPart.substring(0, tagMatch.index).trim() : textPart;

        points.push({
            id: `${fileName}-p${idx}`,
            text,
            tags
        });
    });

    let type: ResumeData['type'] = 'project';
    if (fileName.includes('/experience/') || fileName.includes('(exp)')) type = 'experience';
    if (fileName.includes('/education/') || fileName.includes('(edu)')) type = 'education';
    if (fileName.includes('/skills/') || fileName.includes('(skl)')) type = 'skills';
    if (filePath.includes('/experience/')) type = 'experience';
    if (filePath.includes('/education/')) type = 'education';
    if (filePath.includes('/skills/')) type = 'skills';
    if (filePath.includes('/projects/')) type = 'project';

    return {
        id: fileName,
        filePath,
        type,
        company: frontmatter['company'],
        designation: frontmatter['designation'],
        location: frontmatter['location'],
        startDate: frontmatter['startDate'],
        endDate: frontmatter['endDate'],
        project_name: frontmatter['project_name'],
        url: frontmatter['url'],
        institution: frontmatter['institution'],
        degree: frontmatter['degree'],
        gpa: frontmatter['gpa'],
        category: frontmatter['category'],
        role: finalRole,
        order: frontmatter['order'] ? parseInt(frontmatter['order'], 10) : 99,
        points
    };
}
