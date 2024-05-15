/**
 * Converts the font family name to the correct casing for the relevant metrics import.
 *
 * ---
 * Example usage:
 *
 * ```ts
 * import { fontFamilyToCamelCase } from '@capsizecss/metrics';
 *
 * const familyName = fontFamilyToCamelCase('--apple-system'); // => `appleSystem`
 * const metrics = await import(`@capsizecss/metrics/${familyName}`);
 * ```
 * ---
 */
declare function fontFamilyToCamelCase(str: string): string;

/**
 * Provides the entire metrics collection as a JSON object, keyed by font family name.
 *
 * ## ⚠️ CAUTION: Importing this will result in a **large JSON structure** being pulled into your project! It is not recommended to use this client side.
 *
 * ---
 * Example usage:
 *
 * ```ts
 * import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';
 *
 * const metrics = entireMetricsCollection['arial'];
 * ```
 * ---
 */
declare const entireMetricsCollection: {
    aBeeZee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aDLaMDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aROneSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    abel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    abhayaLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aboreto: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    abrilFatface: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    abyssinicaSIL: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aclonica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    acme: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    actor: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    adamina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    adventPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    agbalumo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    agdasima: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aguafinaScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    akatab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    akayaKanadaka: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    akayaTelivigala: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    akronim: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    akshar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aladin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alatsi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    albertSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aldrich: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alef: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alegreya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alegreyaSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alegreyaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alegreyaSansSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aleo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alexBrush: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alexandria: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alfaSlabOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alice: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alike: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alikeAngular: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alkalami: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alkatra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    allan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    allerta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    allertaStencil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    allison: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    allura: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    almarai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    almendra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    almendraDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    almendraSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alumniSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alumniSansCollegiateOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alumniSansInlineOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    alumniSansPinstripe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amarante: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amaranth: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amaticSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amethysta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amiko: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amiri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amiriQuran: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    amita: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anaheim: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    andadaPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    andika: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekBangla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekDevanagari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekGujarati: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekGurmukhi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekKannada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekLatin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekMalayalam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekOdia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekTamil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anekTelugu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    angkor: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    annieUseYourTelescope: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anonymousPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    antic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anticDidone: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anticSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anton: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    antonio: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anuphan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    anybody: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aoboshiOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    appleSystem: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arapey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arbutus: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arbutusSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    architectsDaughter: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    archivo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    archivoBlack: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    archivoNarrow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    areYouSerious: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arefRuqaa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arefRuqaaInk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arial: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arima: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arimo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arizonia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    armata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arsenal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    artifika: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arvo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    arya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    asap: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    asapCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    asar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    asset: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    assistant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    astloch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    asul: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    athiti: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    atkinsonHyperlegible: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    atma: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    atomicAge: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    aubrey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    audiowide: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    autourOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    average: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    averageSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    averiaGruesaLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    averiaLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    averiaSansLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    averiaSerifLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    azeretMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    b612: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    b612Mono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bIZUDGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bIZUDMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bIZUDPGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bIZUDPMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    babylonica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bacasimeAntique: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    badScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bagelFatOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bahiana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bahianita: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    baiJamjuree: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bakbakOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ballet16pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    baloo2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooBhai2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooBhaijaan2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooBhaina2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooChettan2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooDa2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooPaaji2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooTamma2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooTammudu2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balooThambi2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balsamiqSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    balthazar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bangers: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    barlow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    barlowCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    barlowSemiCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    barriecito: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    barrio: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    basic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    baskervville: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    battambang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    baumans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bayon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    beVietnamPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    beauRivage: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bebasNeue: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    belanosima: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    belgrano: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bellefair: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    belleza: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bellota: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bellotaText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    benchNine: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    benne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bentham: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    berkshireSwash: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    besley: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bethEllen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bevan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bhuTukaExpandedOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersInlineDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersInlineText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersStencilDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersStencilText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigShouldersText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigelowRules: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bigshotOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bilbo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bilboSwashCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bioRhyme: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bioRhymeExpanded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    birthstone: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    birthstoneBounce: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    biryani: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bitter: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blackAndWhitePicture: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blackHanSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blackOpsOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blaka: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blakaHollow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blakaInk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blinkMacSystemFont: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    blinker: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bodoniModa11pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bokor: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bonaNova: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bonbon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bonheurRoyale: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    boogaloo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    borel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bowlbyOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bowlbyOneSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    braahOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    brawler: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    breeSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bricolageGrotesque: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    brunoAce: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    brunoAceSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    brushScriptMT: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    brygada1918: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bubblegumSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bubblerOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    budaLight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    buenard: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungeeHairline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungeeInline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungeeOutline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungeeShade: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    bungeeSpiceRegular: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    butcherman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    butterflyKids: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cabin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cabinCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cabinSketch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caesarDressing: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cagliostro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cairo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cairoPlay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caladea: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    calistoga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    calligraffitti: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cambay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cambo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    candal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cantarell: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cantataOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cantoraOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caprasimo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    capriola: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caramel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carattere: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cardo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carlito: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carme: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carroisGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carroisGothicSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    carterOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    castoro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    castoroTitling: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    catamaran: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caudex: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caveat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    caveatBrush: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cedarvilleCursive: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cevicheOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chakraPetch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    changa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    changaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chango: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    charisSIL: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    charm: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    charmonman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chathura: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chauPhilomeneOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chelaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chelseaMarket: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chenla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cherish: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cherryBombOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cherryCreamSoda: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cherrySwash: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chewy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chicle: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chilanka: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chivo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chivoMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chokokutai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    chonburi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cinzel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cinzelDecorative: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    clickerScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    climateCrisis: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    coda: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    codystar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    coiny: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    combo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comfortaa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comforter: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comforterBrush: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comicNeue: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comingSoon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    comme: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    commissioner: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    concertOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    condiment: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    content: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    contrailOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    convergence: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cookie: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    copse: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    corben: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    corinthia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorantGaramond: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorantInfant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorantSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorantUnicase: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cormorantUpright: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    courgette: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    courierNew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    courierPrime: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cousine: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    coustard: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    coveredByYourGrace: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    craftyGirls: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    creepster: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    creteRound: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    crimsonPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    crimsonText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    croissantOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    crushed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cuprum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cuteFont: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cutive: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    cutiveMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dMMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dMSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dMSerifDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dMSerifText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    daiBannaSIL: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    damion: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dancingScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dangrek: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    darkerGrotesque: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    darumadropOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    davidLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dawningOfANewDay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    daysOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dekko: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    delaGothicOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    deliciousHandrawn: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    delius: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    deliusSwashCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    deliusUnicase: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dellaRespira: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    denkOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    devonshire: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dhurjati: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    didactGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    diphylleia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    diplomata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    diplomataSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    doHyeon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dokdo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    domine: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    donegalOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dongle: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    doppioOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dorsa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dosis: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dotGothic16: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    drSugiyama: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    duruSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dynaPuff: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    dynalight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eBGaramond: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eagleLake: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eastSeaDokdo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eater: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    economica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eczar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eduNSWACTFoundation: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eduQLDBeginner: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eduSABeginner: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eduTASBeginner: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    eduVICWANTBeginner: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    elMessiri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    electrolize: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    elsie: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    elsieSwashCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    emblemaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    emilysCandy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSansCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSansExpanded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSansSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSansSemiCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    encodeSansSemiExpanded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    engagement: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    englebert: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    enriqueta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ephesis: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    epilogue: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ericaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    esteban: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    estonia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    euphoriaScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ewert: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    exo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    exo2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    expletusSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    explora: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fahkwang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    familjenGrotesk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fanwoodText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    farro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    farsan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fascinate: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fascinateInline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fasterOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fasthand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    faunaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    faustina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    federant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    federo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    felipa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fenix: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    festive: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    figtree: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fingerPaint: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    finlandica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    firaCode: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    firaMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    firaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    firaSansCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    firaSansExtraCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fjallaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fjord: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    flamenco: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    flavors: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fleurDeLeah: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    flowBlock: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    flowCircular: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    flowRounded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    foldit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fondamento: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fontdinerSwanky: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    forum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fragmentMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    francoisOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    frankRuhlLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fraunces: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    freckleFace: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    frederickaTheGreat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fredoka: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    freehand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fresca: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    frijole: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fruktur: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fugazOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fuggles: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    fuzzyBubbles: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gFSDidot: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gFSNeohellenic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gabarito: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gabriela: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gaegu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gafata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gajrajOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    galada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    galdeano: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    galindo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gamjaFlower: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gantari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gasoekOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gayathri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gelasio: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gemunuLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    genos: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gentiumBookPlus: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gentiumPlus: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    geo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    geologicaRoman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    georama: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    georgia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    geostar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    geostarFill: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    germaniaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gideonRoman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gidugu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gildaDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    girassol: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    giveYouGlory: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    glassAntiqua: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    glegoo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gloock: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gloriaHallelujah: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    glory: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gluten: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    goblinOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gochiHand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    goldman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    golosText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gorditas: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gothicA1: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gotu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    goudyBookletter1911: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gowunBatang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gowunDodum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    graduate: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grandHotel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grandifloraOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grandstander: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grapeNuts: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gravitasOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    greatVibes: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grechenFuemen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grenze: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    grenzeGotisch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    greyQo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    griffy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gruppo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gudea: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gugi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gulzar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gupter: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gurajada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    gwendolyn: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    habibi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hachiMaruPop: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hahmlet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    halant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hammersmithOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hanalei: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hanaleiFill: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    handjet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    handlee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hankenGrotesk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hanuman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    happyMonkey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    harmattan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    headlandOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    heebo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    helvetica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    helveticaNeue: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hennyPenny: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    heptaSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    herrVonMuellerhoff: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hiMelody: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hinaMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hind: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hindGuntur: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hindMadurai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hindSiliguri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hindVadodara: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    holtwoodOneSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    homemadeApple: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    homenaje: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hubballi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    hurricane: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansArabic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansDevanagari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansHebrew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansJP: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansKR: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansThai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSansThaiLooped: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iBMPlexSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLDWPica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLDWPicaSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLDoublePica: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLDoublePicaSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLEnglish: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLEnglishSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLFrenchCanon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLFrenchCanonSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLGreatPrimer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iMFELLGreatPrimerSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ibarraRealNova: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iceberg: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    iceland: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    imbue10pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    imperialScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    imprima: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inclusiveSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inconsolata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inder: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    indieFlower: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ingridDarling: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inika: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inknutAntiqua: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inriaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inriaSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inspiration: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    instrumentSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    instrumentSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    inter: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    interTight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    irishGrover: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    islandMoments: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    istokWeb: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    italiana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    italianno: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    itim: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jacquesFrancois: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jacquesFrancoisShadow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jaldi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jetBrainsMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jimNightshade: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    joan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jockeyOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jollyLodger: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jomhuria: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jomolhari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    josefinSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    josefinSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jost: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jotiOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jua: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    judson: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    julee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    juliusSansOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    junge: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    jura: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    justAnotherHand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    justMeAgainDownHere: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    k2D: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kablammo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kadwa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kaiseiDecol: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kaiseiHarunoUmi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kaiseiOpti: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kaiseiTokumin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kalam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kameron: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kanit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kantumruyPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    karantina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    karla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    karma: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    katibeh: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kaushanScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kavivanar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kavoon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kayPhoDu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kdamThmorPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    keaniaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kellySlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kenia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    khand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    khmer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    khula: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kings: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kirangHaerang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kiteOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kiwiMaru: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kleeOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    knewave: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    koHo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kodchasan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kohSantepheap: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kolkerBrush: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    konkhmerSleokchher: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kosugi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kosugiMaru: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kottaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    koulen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kranky: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kreon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kristi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kronaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    krub: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kufam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kulimPark: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kumarOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kumarOneOutline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kumbhSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    kurale: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    laBelleAurore: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    labrada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lacquer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    laila: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lakkiReddy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lalezar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lancelot: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    langar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lateef: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lato: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lavishlyYours: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    leagueGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    leagueScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    leagueSpartan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    leckerliOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ledger: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lekton: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lemon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lemonada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexend: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendDeca: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendExa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendGiga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendMega: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendPeta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendTera: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lexendZetta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode128: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode128Text: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode39: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode39Extended: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode39ExtendedText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcode39Text: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBarcodeEAN13Text: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBaskerville: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreBodoni: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreCaslonDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreCaslonText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    libreFranklin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    licorice: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lifeSavers: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lilitaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lilyScriptOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    limelight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lindenHill: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    linefont: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lisuBosa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    literata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    liuJianMaoCao: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    livvic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lobster: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lobsterTwo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    londrinaOutline: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    londrinaShadow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    londrinaSketch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    londrinaSolid: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    longCang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lora: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    loveLight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    loveYaLikeASister: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lovedByTheKing: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    loversQuarrel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lucidaGrande: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    luckiestGuy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lugrasimo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lumanosimo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lunasima: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lusitana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    lustria: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    luxuriousRoman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    luxuriousScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mPLUS1: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mPLUS1Code: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mPLUS1p: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mPLUS2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mPLUSCodeLatin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    maShanZheng: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    macondo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    macondoSwashCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    magra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    maidenOrange: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    maitree: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    majorMonoDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mako: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mali: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mallanna: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mandali: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    manjari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    manrope: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mansalva: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    manuale: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marcellus: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marcellusSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marckScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    margarine: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marhey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    markaziText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    markoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marmelad: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    martel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    martelSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    martianMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    marvel: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mate: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mateSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialIcons: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialIconsOutlined: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialIconsRound: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialIconsSharp: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialIconsTwoTone: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialSymbolsOutlined24pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialSymbolsRounded24pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    materialSymbolsSharp24pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mavenPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mcLaren: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    meaCulpa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    meddon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    medievalSharp: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    medulaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    meeraInimai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    megrim: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    meieScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    meowScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    merienda: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    merriweather: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    merriweatherSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    metal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    metalMania: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    metamorphous: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    metrophobic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    michroma: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    milonga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    miltonian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    miltonianTattoo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mingzat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    miniver: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    miriamLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mirza: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    missFajardose: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mitr: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mochiyPopOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mochiyPopPOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    modak: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    modernAntiqua: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mogra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mohave: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    moiraiOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    molengo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    molle: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monda: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monofett: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monomaniacOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monoton: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monsieurLaDoulaise: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montaga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montaguSlab144pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    monteCarlo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montez: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montserrat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montserratAlternates: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    montserratSubrayada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mooLahLah: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mooli: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    moonDance: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    moul: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    moulpali: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mountainsOfChristmas: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mouseMemoirs: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mrBedfort: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mrDafoe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mrDeHaviland: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mrsSaintDelafield: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mrsSheppards: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    msMadi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mukta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    muktaMahee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    muktaMalar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    muktaVaani: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mulish: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    murecho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    museoModerno: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mySoul: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mynerve: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    mysteryQuest: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nTR: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nabla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nanumBrushScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nanumGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nanumGothicCoding: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nanumMyeongjo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nanumPen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    narnoor: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    neonderthaw: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nerkoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    neucha: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    neuton: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    newRocker: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    newTegomin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    newsCycle: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    newsreader16pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    niconne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    niramit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nixieOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nobile: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nokora: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    norican: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nosifer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notable: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nothingYouCouldDo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    noticiaText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoColorEmoji: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoEmoji: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoKufiArabic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoMusic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoNaskhArabic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoNastaliqUrdu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoRashiHebrew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansAdlam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansAdlamUnjoined: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansAnatolianHieroglyphs: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansArabic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansArmenian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansAvestan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBalinese: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBamum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBassaVah: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBatak: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBengali: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBhaiksuki: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBrahmi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBuginese: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansBuhid: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCanadianAboriginal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCarian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCaucasianAlbanian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansChakma: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCham: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCherokee: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansChorasmian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCoptic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCuneiform: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCypriot: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansCyproMinoan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansDeseret: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansDevanagari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansDuployan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansEgyptianHieroglyphs: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansElbasan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansElymaic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansEthiopic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGeorgian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGlagolitic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGrantha: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGujarati: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGunjalaGondi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansGurmukhi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansHK: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansHanifiRohingya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansHanunoo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansHatran: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansHebrew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansImperialAramaic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansIndicSiyaqNumbers: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansInscriptionalPahlavi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansInscriptionalParthian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansJP: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansJavanese: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKR: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKaithi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKannada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKawi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKayahLi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKharoshthi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKhmer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKhojki: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansKhudawadi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLao: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLaoLooped: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLepcha: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLimbu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLinearA: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLinearB: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLisu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLycian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansLydian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMahajani: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMalayalam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMandaic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansManichaean: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMarchen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMasaramGondi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMath: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMayanNumerals: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMedefaidrin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMeeteiMayek: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMendeKikakui: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMeroitic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMiao: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansModi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMongolian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMultani: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansMyanmar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNKo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNKoUnjoined: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNabataean: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNagMundari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNandinagari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNewTaiLue: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNewa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansNushu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOgham: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOlChiki: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldHungarian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldItalic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldNorthArabian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldPermic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldPersian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldSogdian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldSouthArabian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOldTurkic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOriya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOsage: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansOsmanya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPahawhHmong: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPalmyrene: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPauCinHau: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPhagsPa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPhoenician: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansPsalterPahlavi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansRejang: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansRunic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSamaritan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSaurashtra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSharada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansShavian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSiddham: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSignWriting: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSinhala: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSogdian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSoraSompeng: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSoyombo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSundanese: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSylotiNagri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSymbols: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSymbols2: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSyriac: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansSyriacEastern: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTagalog: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTagbanwa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTaiLe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTaiTham: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTaiViet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTakri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTamil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTamilSupplement: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTangsa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTelugu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansThaana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansThai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansThaiLooped: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTifinagh: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansTirhuta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansUgaritic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansVai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansVithkuqi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansWancho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansWarangCiti: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansYi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSansZanabazarSquare: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifAhom: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifArmenian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifBalinese: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifBengali: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifDevanagari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifDogra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifEthiopic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifGeorgian: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifGrantha: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifGujarati: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifGurmukhi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifHK: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifHebrew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifJP: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifKR: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifKannada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifKhitanSmallScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifKhmer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifKhojki: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifLao: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifMakasar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifMalayalam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifMyanmar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifNPHmong: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifOldUyghur: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifOriya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifOttomanSiyaq: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifSinhala: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifTC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifTamil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifTangut: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifTelugu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifThai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifTibetan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifToto: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifVithkuqi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoSerifYezidi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    notoTraditionalNushu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaCut: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaFlat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaOval: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaRound: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaSlim: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    novaSquare: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    numans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nunito: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nunitoSans12pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    nuosuSIL: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    odibeeSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    odorMeanChey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    offside: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oldStandardTT: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oldenburg: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ole: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oleoScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oleoScriptSwashCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    onest: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ooohBaby: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    openSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oranienbaum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    orbit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    orbitron: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oregano: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    orelegaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    orienta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    originalSurfer: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oswald: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    outfit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    overTheRainbow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    overlock: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    overlockSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    overpass: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    overpassMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ovo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oxanium: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oxygen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    oxygenMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTSansCaption: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTSansNarrow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pTSerifCaption: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pacifico: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    padauk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    padyakkeExpandedOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    palanquin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    palanquinDark: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    paletteMosaic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pangolin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    paprika: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    parisienne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    passeroOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    passionOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    passionsConflict: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pathwayExtreme12pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pathwayGothicOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    patrickHand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    patrickHandSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pattaya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    patuaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pavanam: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    paytoneOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    peddana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    peralta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    permanentMarker: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    petemoss: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    petitFormalScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    petrona: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    philosopher: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    phudu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    piazzolla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    piedra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pinyonScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pirataOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pixelifySans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    plaster: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    play: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    playball: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    playfair: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    playfairDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    playfairDisplaySC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    playpenSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    plusJakartaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    podkova: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    poiretOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pollerOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    poltawskiNowy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    poly: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pompiere: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pontanoSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    poorStory: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    poppins: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    portLligatSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    portLligatSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pottaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pragatiNarrow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    praise: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    prata: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    preahvihear: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pressStart2P: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    pridi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    princessSofia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    prociono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    prompt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    prostoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    prozaLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    publicSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    puppiesPlay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    puritan: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    purplePurse: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    qahiri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quando: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quantico: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quattrocento: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quattrocentoSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    questrial: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quicksand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    quintessential: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    qwigley: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    qwitcherGrypen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rEM: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    racingSansOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    radioCanada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    radley: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rajdhani: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rakkas: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    raleway: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ralewayDots: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ramabhadra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ramaraja: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rambla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rammettoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rampartOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ranchers: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rancho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ranga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rasa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rationale: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    raviPrakash: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    readexPro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    recursive: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redHatDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redHatMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redHatText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redRose: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redacted: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redactedScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    redressed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    reemKufi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    reemKufiFun: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    reemKufiInk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    reenieBeanie: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    reggaeOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    revalia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rhodiumLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ribeye: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ribeyeMarrow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    righteous: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    risque: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    roadRage: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    roboto: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    robotoCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    robotoFlex: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    robotoMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    robotoSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    robotoSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rochester: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rock3D: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rockSalt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rocknRollOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rokkitt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    romanesco: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ropaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rosario: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rosarivo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rougeScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    roundedMplus1c: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rowdies: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rozhaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubik: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubik80sFade: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikBeastly: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikBubbles: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikBurned: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikDirt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikDistressed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikGemstones: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikGlitch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikIso: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikMarkerHatch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikMaze: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikMicrobe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikMonoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikMoonrocks: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikPixels: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikPuddles: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikSprayPaint: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikStorm: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikVinyl: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rubikWetPaint: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ruda: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rufina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rugeBoogie: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ruluko: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rumRaisin: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ruslanDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    russoOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ruthie: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ruwudu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    rye: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sTIXTwoText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sacramento: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sahitya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sail: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    saira: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sairaCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sairaExtraCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sairaSemiCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sairaStencilOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    salsa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sanchez: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sancreek: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sansita: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sansitaSwashed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sarabun: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sarala: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sarina: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sarpanch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sassyFrass: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    satisfy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sawarabiGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sawarabiMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    scada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    scheherazadeNew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    schibstedGrotesk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    schoolbell: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    scopeOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    seaweedScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    secularOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sedgwickAve: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sedgwickAveDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    segoeUI: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sendFlowers: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sevillana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    seymourOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shadowsIntoLight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shadowsIntoLightTwo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shalimar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shantellSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shanti: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    share: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shareTech: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shareTechMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shipporiAntique: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shipporiAntiqueB1: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shipporiMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shipporiMinchoB1: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shizuru: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shojumaru: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shortStack: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    shrikhand: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    siemreap: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sigmar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sigmarOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    signika: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    signikaNegative: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    silkscreen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    simonetta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    singleDay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sintony: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sirinStencil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sixCaps: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    skranji: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    slabo13px: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    slabo27px: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    slackey: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    slacksideOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    smokum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    smooch: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    smoochSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    smythe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sniglet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    snippet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    snowburstOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofadiOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofiaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofiaSansCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofiaSansExtraCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sofiaSansSemiCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    solitreo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    solway: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sometypeMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    songMyung: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sonoMonospace: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sonsieOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sora: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sortsMillGoudy: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sourceCodePro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sourceSans3: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sourceSerif4: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spaceGrotesk: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spaceMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    specialElite: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spectral: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spectralSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spicyRice: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spinnaker: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    spirax: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    splash: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    splineSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    splineSansMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    squadaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    squarePeg: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sreeKrushnadevaraya: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sriracha: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    srisakdi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    staatliches: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stalemate: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stalinistOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stardosStencil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stick: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stickNoBills: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stintUltraCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stintUltraExpanded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stoke: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    strait: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    styleScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    stylish: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sueEllenFrancisco: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    suezOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sulphurPoint: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sumana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sunflowerLight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sunshiney: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    supermercado: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    sura: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    suranna: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    suravaram: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    suwannaphum: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    swankyAndMooMoo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    syncopate: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    syne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    syneMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    syneTactile: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tahoma: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    taiHeritagePro: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tajawal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tangerine: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tapestry: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    taprom: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tauri: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    taviraj: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    teko: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tektur: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    telex: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tenaliRamakrishna: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tenorSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    textMeOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    texturina12pt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    thasadith: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    theGirlNextDoor: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    theNautigal: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tienne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tillana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiltNeon: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiltPrism: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiltWarp: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    timesNewRoman: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    timmana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tinos: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroBangla: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroDevanagariHindi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroDevanagariMarathi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroDevanagariSanskrit: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroGurmukhi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroKannada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroTamil: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tiroTelugu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    titanOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    titilliumWeb: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tomorrow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tourney: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tradeWinds: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trainOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trebuchetMS: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trirong: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trispace: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trocchi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trochut: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    truculenta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    trykker: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tsukimiRounded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    tulpenOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    turretRoad: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    twinkleStar: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ubuntu: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ubuntuCondensed: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ubuntuMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    uchen: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ultra: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unbounded: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    uncialAntiqua: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    underdog: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unicaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unifrakturCook: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unifrakturMaguntia: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unkempt: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unlock: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    unna: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    updock: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    urbanist: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vT323: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vampiroOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    varela: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    varelaRound: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    varta: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vastShadow: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vazirmatn: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    verdana: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vesperLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    viaodaLibre: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vibes: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vibur: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    victorMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vidaloka: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    viga: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vinaSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    voces: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    volkhov: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vollkorn: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vollkornSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    voltaire: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    vujahdayScript: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    waitingForTheSunrise: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wallpoet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    walterTurncoat: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    warnes: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    waterBrush: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    waterfall: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wavefont: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wellfleet: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wendyOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    whisper: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    windSong: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wireOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wixMadeforDisplay: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    wixMadeforText: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    workSans: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    xanhMono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yaldevi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yanoneKaffeesatz: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yantramanav: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yatraOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yellowtail: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yeonSung: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yesevaOne: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yesteryear: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yomogi: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    youngSerif: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yrsa: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ysabeau: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ysabeauInfant: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ysabeauOffice: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    ysabeauSC: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yujiBoku: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yujiHentaiganaAkari: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yujiHentaiganaAkebono: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yujiMai: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yujiSyuku: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    yuseiMagic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zCOOLKuaiLe: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zCOOLQingKeHuangYou: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zCOOLXiaoWei: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenAntique: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenAntiqueSoft: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenDots: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenKakuGothicAntique: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenKakuGothicNew: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenKurenaido: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenLoop: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenMaruGothic: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenOldMincho: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zenTokyoZoo: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zeyada: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zhiMangXing: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zillaSlab: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
    zillaSlabHighlight: {
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
            };
            thai: {
                xWidthAvg: number;
            };
        };
    };
};

export { entireMetricsCollection, fontFamilyToCamelCase };
