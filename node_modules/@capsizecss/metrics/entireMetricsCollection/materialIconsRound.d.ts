declare module '@capsizecss/metrics/materialIconsRound' {
  interface MaterialIconsRoundMetrics {
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
  export const fontMetrics: MaterialIconsRoundMetrics;
  export default fontMetrics;
}
