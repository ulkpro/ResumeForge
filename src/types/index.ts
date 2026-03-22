export interface LayoutSettings {
    pageSize: 'A4' | 'LETTER';
    paddingTopBottom: number;
    paddingLeftRight: number;
    gapPoints: number;
    gapSectionToSub: number;
    gapSubsections: number;
    gapMajorSections: number;
    gapTitleToLine: number;
    gapHeaderToFirstSection: number;
    fontFamily?: string;
    fontSizeName: number;
    fontSizeContact: number;
    fontSizeSectionTitle: number;
    fontSizeOrgName: number;
    fontSizeLocDate: number;
    fontSizeRoleDesc: number;
    fontSizeBullet: number;
    hiddenSections?: string[];
    sectionOrder?: string[];
}

export const defaultLayout: LayoutSettings = {
    pageSize: 'A4',
    paddingTopBottom: 12,
    paddingLeftRight: 12,
    gapPoints: 4,
    gapSectionToSub: 10,
    gapSubsections: 14,
    gapMajorSections: 16,
    gapTitleToLine: 4,
    gapHeaderToFirstSection: 24,
    fontFamily: "'LMRoman10', 'Latin Modern Roman', serif",
    fontSizeName: 25,
    fontSizeContact: 10,
    fontSizeSectionTitle: 12,
    fontSizeOrgName: 11,
    fontSizeLocDate: 11,
    fontSizeRoleDesc: 10,
    fontSizeBullet: 10,
    hiddenSections: [],
    sectionOrder: ['experience', 'projects', 'education', 'skills', 'publications'],
};
