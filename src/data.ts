import type { ResumeData } from './utils/parser';
import { parseMarkdown } from './utils/parser';

// Use eager loading to get raw string content
const experienceFiles = import.meta.glob('../resume-points/experience/*.md', { query: '?raw', import: 'default', eager: true });
const projectFiles = import.meta.glob('../resume-points/projects/*.md', { query: '?raw', import: 'default', eager: true });
const educationFiles = import.meta.glob('../resume-points/education/*.md', { query: '?raw', import: 'default', eager: true });
const skillsFiles = import.meta.glob('../resume-points/skills/*.md', { query: '?raw', import: 'default', eager: true });

export const getResumeData = (): ResumeData[] => {
    const data: ResumeData[] = [];

    for (const path in experienceFiles) {
        const rawContent = experienceFiles[path] as string;
        const fileName = path.split('/').pop()?.replace('.md', '') || path;
        data.push(parseMarkdown(fileName + ' (exp)', rawContent));
    }

    for (const path in projectFiles) {
        const rawContent = projectFiles[path] as string;
        const fileName = path.split('/').pop()?.replace('.md', '') || path;
        data.push(parseMarkdown(fileName + ' (proj)', rawContent));
    }

    for (const path in educationFiles) {
        const rawContent = educationFiles[path] as string;
        const fileName = path.split('/').pop()?.replace('.md', '') || path;
        data.push(parseMarkdown(fileName + ' (edu)', rawContent));
    }

    for (const path in skillsFiles) {
        const rawContent = skillsFiles[path] as string;
        const fileName = path.split('/').pop()?.replace('.md', '') || path;
        data.push(parseMarkdown(fileName + ' (skl)', rawContent));
    }

    return data;
};
