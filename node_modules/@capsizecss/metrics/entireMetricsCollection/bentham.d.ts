declare module '@capsizecss/metrics/bentham' {
  interface BenthamMetrics {
    familyName: string;
    category: string;
    ascent: number;
    descent: number;
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
  export const fontMetrics: BenthamMetrics;
  export default fontMetrics;
}
