import { VirtualCode } from '@volar/language-core';
import type { Sfc, VueLanguagePlugin } from '../types';
export declare function computedFiles(plugins: ReturnType<VueLanguagePlugin>[], fileName: string, sfc: Sfc): () => VirtualCode[];
export declare function resolveCommonLanguageId(lang: string): string;
