import type { ResumeData } from './parser';

export interface QuickPickResult {
    selectedIds: string[];
    unselectedIds: string[];
    matchedGroups: string[];
    summary: string;
}

/**
 * Parses numbers and ranges from a string segment like "1, 4, 6-8" or "1 4"
 */
function parseNumberList(segment: string): number[] {
    const nums = new Set<number>();
    const tokens = segment.split(/[\s,]+/);

    for (const token of tokens) {
        if (!token.trim()) continue;
        const rangeMatch = token.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 10);
            const end = parseInt(rangeMatch[2], 10);
            const low = Math.min(start, end);
            const high = Math.max(start, end);
            for (let i = low; i <= high; i++) {
                nums.add(i);
            }
        } else {
            const n = parseInt(token, 10);
            if (!isNaN(n) && n > 0) {
                nums.add(n);
            }
        }
    }
    return Array.from(nums).sort((a, b) => a - b);
}

/**
 * Dynamically finds matching ResumeData section for any company query
 */
function findCompanySection(companyQuery: string, sections: ResumeData[]): ResumeData | undefined {
    const q = companyQuery.toLowerCase().trim();
    if (!q) return undefined;

    return sections.find(s => {
        const comp = (s.company || '').toLowerCase();
        const id = s.id.toLowerCase();
        if (comp === q || id === q || comp.includes(q) || q.includes(comp)) return true;

        const firstWord = comp.split(/[\s,\-]+/)[0];
        if (firstWord && firstWord.length >= 2 && (firstWord === q || q.startsWith(firstWord) || firstWord.startsWith(q))) return true;

        const acronym = comp.split(/\s+/).map(w => w[0]).join('').toLowerCase();
        if (acronym && acronym.length >= 2 && acronym === q) return true;

        return false;
    });
}

/**
 * Parses a company's group selections e.g. "Technical: 1, 4; Leadership: 2"
 */
function parseCompanyGroups(text: string, sec: ResumeData): { selected: string[]; unselected: string[]; groups: string[] } {
    const selected: string[] = [];
    const unselected: string[] = [];
    const groups: string[] = [];

    const parts = text.split(/[;|]|\s*,\s*(?=[a-zA-Z])/);

    parts.forEach(part => {
        const trimmed = part.trim();
        if (!trimmed) return;

        const groupPattern = /^([a-zA-Z\s&]+?)(?::|\s(?=\d))\s*([\d\s,\-]+)$/;
        const match = trimmed.match(groupPattern);

        if (match) {
            const rawGroupName = match[1].trim();
            const numbers = parseNumberList(match[2]);
            const lowerGroup = rawGroupName.toLowerCase();

            const allGroups = Array.from(new Set(sec.points.map(p => p.group || 'General')));
            const bestGroup = allGroups.find(g =>
                g.toLowerCase() === lowerGroup ||
                g.toLowerCase().startsWith(lowerGroup) ||
                lowerGroup.startsWith(g.toLowerCase())
            );

            if (bestGroup) {
                groups.push(`${sec.company?.split(' ')[0] || 'Company'}: ${bestGroup}`);
                const groupPoints = sec.points.filter(p => (p.group || 'General') === bestGroup);

                groupPoints.forEach(p => {
                    const idx = p.indexInGroup ?? 0;
                    if (numbers.includes(idx)) {
                        selected.push(p.id);
                    } else {
                        unselected.push(p.id);
                    }
                });
            }
        }
    });

    return { selected, unselected, groups };
}

/**
 * Generic Unified Quick-Pick executor for single input across any companies in the master file.
 */
export function executeQuickPick(
    command: string,
    sections: ResumeData[]
): QuickPickResult {
    const selectedIds: string[] = [];
    const unselectedIds: string[] = [];
    const matchedGroups: string[] = [];

    const cleanCommand = command.trim();
    if (!cleanCommand) {
        return { selectedIds, unselectedIds, matchedGroups, summary: 'Empty command' };
    }

    // Build dynamic company name keywords from available sections
    const companyKeywords: string[] = [];
    sections.forEach(sec => {
        if (sec.company) {
            companyKeywords.push(sec.company.toLowerCase());
            const firstWord = sec.company.split(/[\s,\-]+/)[0].toLowerCase();
            if (firstWord && firstWord.length >= 2 && !companyKeywords.includes(firstWord)) {
                companyKeywords.push(firstWord);
            }
            const acronym = sec.company.split(/\s+/).map(w => w[0]).join('').toLowerCase();
            if (acronym.length >= 2 && !companyKeywords.includes(acronym)) {
                companyKeywords.push(acronym);
            }
        }
    });

    // Detect if input contains company prefixes
    const escapedKeywords = companyKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let hasCompanyPrefix = false;
    if (escapedKeywords.length > 0) {
        const testRegex = new RegExp(`(^|[;|\\s])(?:${escapedKeywords.join('|')})\\s*[:\\-]`, 'i');
        hasCompanyPrefix = testRegex.test(cleanCommand);
    }

    if (hasCompanyPrefix && escapedKeywords.length > 0) {
        const regex = new RegExp(`(?:^|[;|])\\s*(${escapedKeywords.join('|')})\\s*[:\\-]\\s*`, 'gi');
        const matches: { company: string; index: number; length: number }[] = [];

        let m: RegExpExecArray | null;
        while ((m = regex.exec(cleanCommand)) !== null) {
            matches.push({
                company: m[1],
                index: m.index,
                length: m[0].length
            });
        }

        for (let i = 0; i < matches.length; i++) {
            const currentMatch = matches[i];
            const startIndex = currentMatch.index + currentMatch.length;
            const endIndex = i + 1 < matches.length ? matches[i + 1].index : cleanCommand.length;
            const companyText = cleanCommand.substring(startIndex, endIndex).trim();

            const sec = findCompanySection(currentMatch.company, sections);
            if (sec && companyText) {
                const res = parseCompanyGroups(companyText, sec);
                selectedIds.push(...res.selected);
                unselectedIds.push(...res.unselected);
                matchedGroups.push(...res.groups);
            }
        }
    } else {
        // No company prefix specified: apply across all sections
        sections.forEach(sec => {
            const res = parseCompanyGroups(cleanCommand, sec);
            selectedIds.push(...res.selected);
            unselectedIds.push(...res.unselected);
            matchedGroups.push(...res.groups);
        });
    }

    const summary = matchedGroups.length > 0
        ? `Selected ${selectedIds.length} points (${matchedGroups.join('; ')})`
        : 'Format: Company 1: Tech 1, 4 | Company 2: Tech 1, 3';

    return { selectedIds, unselectedIds, matchedGroups, summary };
}
