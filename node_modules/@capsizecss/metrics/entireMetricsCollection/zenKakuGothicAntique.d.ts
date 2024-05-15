declare module '@capsizecss/metrics/zenKakuGothicAntique' {
  interface ZenKakuGothicAntiqueMetrics {
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
  export const fontMetrics: ZenKakuGothicAntiqueMetrics;
  export default fontMetrics;
}
