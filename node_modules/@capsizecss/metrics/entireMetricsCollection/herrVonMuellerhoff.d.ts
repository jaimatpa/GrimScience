declare module '@capsizecss/metrics/herrVonMuellerhoff' {
  interface HerrVonMuellerhoffMetrics {
    familyName: string;
    category: string;
    capHeight: number;
    ascent: number;
    descent: number;
    lineGap: number;
    unitsPerEm: number;
    xHeight: number;
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
  export const fontMetrics: HerrVonMuellerhoffMetrics;
  export default fontMetrics;
}
