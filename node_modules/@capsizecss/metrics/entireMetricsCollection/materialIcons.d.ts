declare module '@capsizecss/metrics/materialIcons' {
  interface MaterialIconsMetrics {
    familyName: string;
    category: string;
    ascent: number;
    lineGap: number;
    unitsPerEm: number;
    xWidthAvg: number;
    subsets: {
      latin: {
        xWidthAvg: number;
      },
      thai: {
        xWidthAvg: number;
      }
    }
  }
  export const fontMetrics: MaterialIconsMetrics;
  export default fontMetrics;
}
