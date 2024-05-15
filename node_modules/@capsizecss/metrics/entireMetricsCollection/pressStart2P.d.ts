declare module '@capsizecss/metrics/pressStart2P' {
  interface PressStart2PMetrics {
    familyName: string;
    category: string;
    capHeight: number;
    ascent: number;
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
  export const fontMetrics: PressStart2PMetrics;
  export default fontMetrics;
}
