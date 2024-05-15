declare module '@capsizecss/metrics/coiny' {
  interface CoinyMetrics {
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
  export const fontMetrics: CoinyMetrics;
  export default fontMetrics;
}
