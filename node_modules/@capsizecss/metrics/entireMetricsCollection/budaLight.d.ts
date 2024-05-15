declare module '@capsizecss/metrics/budaLight' {
  interface BudaLightMetrics {
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
  export const fontMetrics: BudaLightMetrics;
  export default fontMetrics;
}
