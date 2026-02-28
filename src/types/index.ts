export interface LayoutSettings {
    pageSize: 'A4' | 'LETTER';
    paddingTopBottom: number;
    paddingLeftRight: number;
    gapPoints: number;
    gapSectionToSub: number;
    gapSubsections: number;
}

export const defaultLayout: LayoutSettings = {
    pageSize: 'A4',
    paddingTopBottom: 12,
    paddingLeftRight: 12,
    gapPoints: 4,
    gapSectionToSub: 10,
    gapSubsections: 14,
};
