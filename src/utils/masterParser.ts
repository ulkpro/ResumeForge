import type { ResumeData, ResumePoint } from './parser';

interface CompanySection {
    rawName: string;
    company: string;
    designation: string;
    location: string;
    startDate: string;
    endDate: string;
    lines: string[];
}

export function parseMasterExperience(rawContent: string, filePath: string = 'resume-points/master-experience.md'): ResumeData[] {
    const results: ResumeData[] = [];
    if (!rawContent || !rawContent.trim()) return results;

    const lines = rawContent.split('\n');
    let currentCompany: CompanySection | null = null;
    const companySections: CompanySection[] = [];

    // Helper to detect company heading: any top-level header (# Company Name)
    const isCompanyHeader = (line: string) => {
        const trimmed = line.trim();
        return trimmed.startsWith('# ');
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (isCompanyHeader(line)) {
            if (currentCompany) {
                companySections.push(currentCompany);
            }
            const rawTitle = line.replace(/^#+\s*/, '').trim();

            currentCompany = {
                rawName: rawTitle,
                company: rawTitle,
                designation: 'Software Engineer',
                location: 'City, State',
                startDate: 'Jan 2020',
                endDate: 'Present',
                lines: []
            };
        } else {
            if (!currentCompany) {
                currentCompany = {
                    rawName: 'Company 1',
                    company: 'Company 1',
                    designation: 'Software Engineer',
                    location: 'City, State',
                    startDate: 'Jan 2020',
                    endDate: 'Present',
                    lines: []
                };
            }
            currentCompany.lines.push(line);
        }
    }

    if (currentCompany) {
        companySections.push(currentCompany);
    }

    // Now process each company section
    companySections.forEach((sec, compIdx) => {
        const compLines = sec.lines;
        let currentGroup = 'General';
        const groupPointCounts: Record<string, number> = {};
        const points: ResumePoint[] = [];

        const compSlug = sec.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || `comp${compIdx + 1}`;

        for (let j = 0; j < compLines.length; j++) {
            const rawLine = compLines[j].trim();
            if (!rawLine) continue;

            // Check metadata lines like Designation: ..., Location: ..., Dates: ...
            const metaMatch = rawLine.match(/^(company|designation|role|location|dates?|startdate|enddate):\s*(.+)$/i);
            if (metaMatch) {
                const key = metaMatch[1].toLowerCase();
                let val = metaMatch[2].trim();
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);

                if (key === 'company') sec.company = val;
                else if (key === 'designation' || key === 'role') sec.designation = val;
                else if (key === 'location') sec.location = val;
                else if (key === 'startdate') sec.startDate = val;
                else if (key === 'enddate') sec.endDate = val;
                else if (key.startsWith('date')) {
                    const dateParts = val.split(/[–—-]/);
                    if (dateParts.length >= 2) {
                        sec.startDate = dateParts[0].trim();
                        sec.endDate = dateParts[1].trim();
                    } else {
                        sec.startDate = val;
                    }
                }
                continue;
            }

            // Check group header: ## GroupName or ### GroupName
            const grpMatch = rawLine.match(/^#{2,4}\s+(.+)$/);
            if (grpMatch) {
                currentGroup = grpMatch[1].trim();
                continue;
            }

            // Check point: 1. Text or - Text or * Text
            const ptMatch = rawLine.match(/^(\d+\.|\*|-)\s+(.+)$/);
            if (ptMatch) {
                const rawPointText = ptMatch[2].trim();

                // Extract tags like [tag1, tag2]
                const tagMatch = rawPointText.match(/\[(.*?)\]$/);
                const rawTags = tagMatch ? tagMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean) : [];
                const text = tagMatch ? rawPointText.substring(0, tagMatch.index).trim() : rawPointText;

                let group = currentGroup;
                const cleanTags: string[] = [];
                rawTags.forEach((t: string) => {
                    const m = t.match(/^group:\s*(.+)$/i);
                    if (m) {
                        group = m[1].trim();
                    } else {
                        cleanTags.push(t);
                    }
                });

                if (!groupPointCounts[group]) {
                    groupPointCounts[group] = 0;
                }
                groupPointCounts[group]++;
                const indexInGroup = groupPointCounts[group];

                const groupSlug = group.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const pointId = `master-${compSlug}-${groupSlug}-${indexInGroup}`;

                points.push({
                    id: pointId,
                    text,
                    tags: cleanTags,
                    group,
                    indexInGroup
                });
            }
        }

        const dataId = `master-experience-${compSlug}`;
        results.push({
            id: dataId,
            filePath,
            type: 'experience',
            company: sec.company,
            designation: sec.designation,
            location: sec.location,
            startDate: sec.startDate,
            endDate: sec.endDate,
            role: 'all',
            group: 'all',
            order: compIdx + 1,
            points
        });
    });

    return results;
}
