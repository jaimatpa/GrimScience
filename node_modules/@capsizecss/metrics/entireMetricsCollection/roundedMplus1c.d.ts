declare module '@capsizecss/metrics/roundedMplus1c' {
  interface RoundedMplus1cMetrics {
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
  export const fontMetrics: RoundedMplus1cMetrics;
  export default fontMetrics;
}
