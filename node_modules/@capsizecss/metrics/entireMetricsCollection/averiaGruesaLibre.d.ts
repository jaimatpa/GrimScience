declare module '@capsizecss/metrics/averiaGruesaLibre' {
  interface AveriaGruesaLibreMetrics {
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
  export const fontMetrics: AveriaGruesaLibreMetrics;
  export default fontMetrics;
}
