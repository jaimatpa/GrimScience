declare module '@capsizecss/metrics/notoNaskhArabic' {
  interface NotoNaskhArabicMetrics {
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
  export const fontMetrics: NotoNaskhArabicMetrics;
  export default fontMetrics;
}
