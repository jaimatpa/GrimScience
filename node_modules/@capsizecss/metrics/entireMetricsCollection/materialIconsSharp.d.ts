declare module '@capsizecss/metrics/materialIconsSharp' {
  interface MaterialIconsSharpMetrics {
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
  export const fontMetrics: MaterialIconsSharpMetrics;
  export default fontMetrics;
}
