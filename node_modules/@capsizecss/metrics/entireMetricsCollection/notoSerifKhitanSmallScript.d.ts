declare module '@capsizecss/metrics/notoSerifKhitanSmallScript' {
  interface NotoSerifKhitanSmallScriptMetrics {
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
  export const fontMetrics: NotoSerifKhitanSmallScriptMetrics;
  export default fontMetrics;
}
