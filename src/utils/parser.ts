export interface ResumePoint {
    id: string;
    text: string;
    tags: string[];
    group?: string;
}

export interface ResumeData {
    id: string;
    filePath: string;
    type: 'experience' | 'project' | 'education' | 'skills' | 'publications' | 'certifications';
    company?: string;
    designation?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    project_name?: string;
    publisher?: string;
    publicationDate?: string;
    url?: string;
    institution?: string;
    degree?: string;
    gpa?: string;
    category?: string;
    coursework?: string;
    certification?: string;
    issuer?: string;
    role: string;
    group: string;
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
    let fileGroup = 'dev';
    if (filePath) {
        // e.g. ../resume-points/dev/java-backend/experience/abc.md
        const pathParts = filePath.split('/');
        const rpIndex = pathParts.indexOf('resume-points');
        if (rpIndex !== -1 && pathParts.length > rpIndex + 2) {
            fileGroup = pathParts[rpIndex + 1];
            fileRole = pathParts[rpIndex + 2];
        } else if (rpIndex !== -1 && pathParts.length > rpIndex + 1) {
            fileRole = pathParts[rpIndex + 1];
        }
    }
    const finalRole = (frontmatter['role'] || frontmatter['jobRole'] || frontmatter['job_role'] || fileRole).toLowerCase();
    const finalGroup = (frontmatter['group'] || frontmatter['mainGroup'] || fileGroup).toLowerCase();

    const points: ResumePoint[] = [];
    const lines = bodyStr.split('\n').filter(line => line.trim().startsWith('-'));

    lines.forEach((line, idx) => {
        const textPart = line.trim().substring(1).trim();
        // Extract tags from the end like [Java, Spring]
        const tagMatch = textPart.match(/\[(.*?)\]$/);
        const rawTags = tagMatch ? tagMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];
        const text = tagMatch ? textPart.substring(0, tagMatch.index).trim() : textPart;

        let group = '';
        const cleanTags: string[] = [];
        rawTags.forEach(t => {
            const m = t.match(/^group:\s*(.+)$/i);
            if (m) {
                group = m[1].trim();
            } else {
                cleanTags.push(t);
            }
        });

        // Infer group if not explicitly set
        if (!group) {
            const lowerText = text.toLowerCase();
            const lowerTags = cleanTags.map(t => t.toLowerCase());

            if (lowerTags.includes('completablefuture') || lowerText.includes('completablefuture') || lowerText.includes('completable future')) {
                group = 'Completablefuture';
            } else if (lowerTags.includes('kafka') || lowerText.includes('kafka')) {
                group = 'Kafka';
            } else if (lowerTags.includes('aws') || lowerText.includes('aws ') || lowerText.includes('aws-') || lowerText.includes('s3') || lowerText.includes('eks') || lowerText.includes('ecr') || lowerText.includes('lambda') || lowerText.includes('vpc')) {
                group = 'AWS';
            } else if (lowerTags.includes('spring') || lowerText.includes('spring boot') || lowerText.includes('springboot')) {
                group = 'Spring Boot';
            } else if (lowerTags.includes('sql') || lowerTags.includes('redis') || lowerTags.includes('postgres') || lowerText.includes('redis') || lowerText.includes('postgres') || lowerText.includes('database')) {
                group = 'Database & Cache';
            } else if (lowerTags.includes('general') || lowerText.includes('general')) {
                group = 'General';
            } else {
                group = 'Other';
            }
        }

        points.push({
            id: `${fileName}-p${idx}`,
            text,
            tags: cleanTags,
            group: group || 'Other'
        });
    });

    let type: ResumeData['type'] = 'project';
    if (fileName.includes('/experience/') || fileName.includes('(exp)')) type = 'experience';
    if (fileName.includes('/education/') || fileName.includes('(edu)')) type = 'education';
    if (fileName.includes('/skills/') || fileName.includes('(skl)')) type = 'skills';
    if (fileName.includes('/publications/') || fileName.includes('(pub)')) type = 'publications';
    if (fileName.includes('/certifications/') || fileName.includes('(cert)')) type = 'certifications';
    if (filePath.includes('/experience/')) type = 'experience';
    if (filePath.includes('/education/')) type = 'education';
    if (filePath.includes('/skills/')) type = 'skills';
    if (filePath.includes('/projects/')) type = 'project';
    if (filePath.includes('/publications/')) type = 'publications';
    if (filePath.includes('/certifications/')) type = 'certifications';

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
        publisher: frontmatter['publisher'],
        publicationDate: frontmatter['publicationDate'],
        url: frontmatter['url'],
        institution: frontmatter['institution'],
        degree: frontmatter['degree'],
        gpa: frontmatter['gpa'],
        category: frontmatter['category'],
        coursework: frontmatter['coursework'] || frontmatter['relevantCoursework'] || frontmatter['relevant_coursework'],
        certification: frontmatter['certification'],
        issuer: frontmatter['issuer'],
        role: finalRole,
        group: finalGroup,
        order: frontmatter['order'] ? parseInt(frontmatter['order'], 10) : 99,
        points
    };
}
