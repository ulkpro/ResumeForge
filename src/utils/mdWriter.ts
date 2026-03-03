import type { ResumeData } from './parser';

export async function saveResumeFileLocal(data: ResumeData) {
    if (!import.meta.env.DEV) {
        console.warn("Cannot save .md files when not in local dev environment.");
        return;
    }

    if (!data.filePath) {
        console.error("No filePath associated with this resume data.");
        return;
    }

    // Reconstruct frontmatter
    let md = '---\n';
    if (data.company) md += `company: "${data.company}"\n`;
    if (data.designation) md += `designation: "${data.designation}"\n`;
    if (data.location) md += `location: "${data.location}"\n`;
    if (data.startDate) md += `startDate: "${data.startDate}"\n`;
    if (data.endDate) md += `endDate: "${data.endDate}"\n`;
    if (data.project_name) md += `project_name: "${data.project_name}"\n`;
    if (data.url) md += `url: "${data.url}"\n`;
    if (data.institution) md += `institution: "${data.institution}"\n`;
    if (data.degree) md += `degree: "${data.degree}"\n`;
    if (data.gpa) md += `gpa: "${data.gpa}"\n`;
    if (data.category) md += `category: "${data.category}"\n`;
    if (data.role && data.role !== 'base') md += `role: "${data.role}"\n`;
    md += '---\n\n';

    // Reconstruct points
    data.points.forEach(point => {
        let line = `- ${point.text}`;
        if (point.tags && point.tags.length > 0) {
            line += ` [${point.tags.join(', ')}]`;
        }
        md += line + '\n';
    });

    try {
        const res = await fetch('/api/save-md', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filePath: data.filePath,
                content: md
            })
        });
        const result = await res.json();
        if (!result.success) {
            console.error("Failed to save MD:", result.error);
        }
    } catch (err) {
        console.error("Error saving file locally:", err);
    }
}
