declare module '@capsizecss/metrics/concertOne' {
  interface ConcertOneMetrics {
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
  export const fontMetrics: ConcertOneMetrics;
  export default fontMetrics;
}
