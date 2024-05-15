declare module '@capsizecss/metrics/libreBarcode39ExtendedText' {
  interface LibreBarcode39ExtendedTextMetrics {
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
  export const fontMetrics: LibreBarcode39ExtendedTextMetrics;
  export default fontMetrics;
}
