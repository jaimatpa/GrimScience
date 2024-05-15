declare module '@capsizecss/metrics/libreBarcodeEAN13Text' {
  interface LibreBarcodeEAN13TextMetrics {
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
  export const fontMetrics: LibreBarcodeEAN13TextMetrics;
  export default fontMetrics;
}
