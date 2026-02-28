export interface ResumePoint {
    id: string;
    text: string;
    tags: string[];
}

export interface ResumeData {
    id: string;
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
    points: ResumePoint[];
}

export function parseMarkdown(fileName: string, rawContent: string): ResumeData {
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

    const points: ResumePoint[] = [];
    const bulletLines = bodyStr.split('\n').filter(line => line.trim().startsWith('-'));

    bulletLines.forEach((line, idx) => {
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

    return {
        id: fileName,
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
        points
    };
}
