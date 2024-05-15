import { BuiltinLanguage, HighlighterCore } from 'shiki';

export declare const shiki: import('vue').ShallowRef<HighlighterCore | undefined>;
export declare function renderCodeHighlight(code: string, lang?: BuiltinLanguage | 'text'): {
    code: string;
    supported: false | undefined;
} | {
    code: string;
    supported: boolean;
};
