import * as unplugin from 'unplugin';
import { Font } from '@capsizecss/unpack';

interface FontaineTransformOptions {
    css?: {
        value?: string;
    };
    fallbacks: string[];
    resolvePath?: (path: string) => string | URL;
    skipFontFaceGeneration?: (fallbackName: string) => boolean;
    /** this should produce an unquoted font family name */
    fallbackName?: (name: string) => string;
    /** @deprecated use fallbackName */
    overrideName?: (name: string) => string;
    sourcemap?: boolean;
}
declare const FontaineTransform: unplugin.UnpluginInstance<FontaineTransformOptions, boolean>;

declare function generateFallbackName(name: string): string;
interface FallbackOptions {
    name: string;
    font: string;
    metrics?: FontFaceMetrics;
    [key: string]: any;
}
type FontFaceMetrics = Pick<Font, 'ascent' | 'descent' | 'lineGap' | 'unitsPerEm' | 'xWidthAvg'>;
declare function generateFontFace(metrics: FontFaceMetrics, fallback: FallbackOptions): string;

declare function getMetricsForFamily(family: string): Promise<FontFaceMetrics | null>;
declare function readMetrics(_source: URL | string): Promise<FontFaceMetrics | null>;

export { FontaineTransform, type FontaineTransformOptions, generateFallbackName, generateFontFace, getMetricsForFamily, readMetrics };
