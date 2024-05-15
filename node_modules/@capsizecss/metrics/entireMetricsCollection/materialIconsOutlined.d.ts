declare module '@capsizecss/metrics/materialIconsOutlined' {
  interface MaterialIconsOutlinedMetrics {
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
  export const fontMetrics: MaterialIconsOutlinedMetrics;
  export default fontMetrics;
}
