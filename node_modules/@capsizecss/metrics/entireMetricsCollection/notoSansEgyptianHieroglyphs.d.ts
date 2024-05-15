declare module '@capsizecss/metrics/notoSansEgyptianHieroglyphs' {
  interface NotoSansEgyptianHieroglyphsMetrics {
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
  export const fontMetrics: NotoSansEgyptianHieroglyphsMetrics;
  export default fontMetrics;
}
