import type { ResumeData } from './utils/parser';
import { parseMarkdown } from './utils/parser';

// Use eager loading to get raw string content
const allFiles = import.meta.glob('../resume-points/**/*.md', { query: '?raw', import: 'default', eager: true });

export const getResumeData = (): ResumeData[] => {
    const data: ResumeData[] = [];

    for (const path in allFiles) {
        const rawContent = allFiles[path] as string;
        // Use the absolute relative path as a globally unique ID instead of basename
        // to prevent nodes in different role folders from cloning each other.
        data.push(parseMarkdown(path, rawContent, path));
    }

    data.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

    return data;
};

if (import.meta.hot) {
    import.meta.hot.accept(() => {
        // We explicitly accept hot updates for markdown files to prevent Vite from reloading the entire page.
        // The React app manages its own state for the resume data, so we don't want external HMR to wipe it out while editing.
    });
}
