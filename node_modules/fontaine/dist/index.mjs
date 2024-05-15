import { createUnplugin } from 'unplugin';
import { createRegExp, charIn, exactly, whitespace, charNotIn, anyOf } from 'magic-regexp';
import MagicString from 'magic-string';
import { parseURL } from 'ufo';
import { isAbsolute, join } from 'pathe';
import { fileURLToPath } from 'node:url';
import { fromFile, fromUrl } from '@capsizecss/unpack';
import { fontFamilyToCamelCase } from '@capsizecss/metrics';

function toPercentage(value, fractionDigits = 4) {
  const percentage = value * 100;
  return `${+percentage.toFixed(fractionDigits)}%`;
}
function toCSS(properties, indent = 2) {
  return Object.entries(properties).map(([key, value]) => `${" ".repeat(indent)}${key}: ${value};`).join("\n");
}
const QUOTES_RE = createRegExp(
  charIn(`"'`).at.lineStart().or(charIn(`"'`).at.lineEnd()),
  ["g"]
);
const FAMILY_RE = createRegExp(
  exactly("font-family:").and(whitespace.optionally()).and(charNotIn(";}").times.any().as("fontFamily"))
);
const SOURCE_RE = createRegExp(
  exactly("src:").and(whitespace.optionally()).and(charNotIn(";}").times.any().as("src")),
  ["g"]
);
const URL_RE = createRegExp(
  exactly("url(").and(charNotIn(")").times.any().as("url")).and(")"),
  ["g"]
);
const withoutQuotes = (str) => str.trim().replace(QUOTES_RE, "");
function* parseFontFace(css) {
  const fontFamily = css.match(FAMILY_RE)?.groups.fontFamily;
  const family = withoutQuotes(fontFamily?.split(",")[0] || "");
  for (const match of css.matchAll(SOURCE_RE)) {
    const sources = match.groups.src?.split(",");
    for (const entry of sources || []) {
      for (const url of entry.matchAll(URL_RE)) {
        const source = withoutQuotes(url.groups?.url || "");
        if (source)
          yield { family, source };
      }
    }
  }
  yield { family: "", source: "" };
}
function generateFallbackName(name) {
  const firstFamily = withoutQuotes(name.split(",").shift());
  return `${firstFamily} fallback`;
}
function generateFontFace(metrics, fallback) {
  const {
    name: fallbackName,
    font: fallbackFontName,
    metrics: fallbackMetrics,
    ...properties
  } = fallback;
  const preferredFontXAvgRatio = metrics.xWidthAvg / metrics.unitsPerEm;
  const fallbackFontXAvgRatio = fallbackMetrics ? fallbackMetrics.xWidthAvg / fallbackMetrics.unitsPerEm : 1;
  const sizeAdjust = fallbackMetrics && preferredFontXAvgRatio && fallbackFontXAvgRatio ? preferredFontXAvgRatio / fallbackFontXAvgRatio : 1;
  const adjustedEmSquare = metrics.unitsPerEm * sizeAdjust;
  const ascentOverride = metrics.ascent / adjustedEmSquare;
  const descentOverride = Math.abs(metrics.descent) / adjustedEmSquare;
  const lineGapOverride = metrics.lineGap / adjustedEmSquare;
  const declaration = {
    "font-family": JSON.stringify(fallbackName),
    "src": `local(${JSON.stringify(fallbackFontName)})`,
    "size-adjust": toPercentage(sizeAdjust),
    "ascent-override": toPercentage(ascentOverride),
    "descent-override": toPercentage(descentOverride),
    "line-gap-override": toPercentage(lineGapOverride),
    ...properties
  };
  return `@font-face {
${toCSS(declaration)}
}
`;
}

const metricCache = {};
function filterRequiredMetrics({
  ascent,
  descent,
  lineGap,
  unitsPerEm,
  xWidthAvg
}) {
  return {
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xWidthAvg
  };
}
async function getMetricsForFamily(family) {
  family = withoutQuotes(family);
  if (family in metricCache)
    return metricCache[family];
  try {
    const name = fontFamilyToCamelCase(family);
    const { entireMetricsCollection } = await import('@capsizecss/metrics/entireMetricsCollection');
    const metrics = entireMetricsCollection[name];
    const filteredMetrics = filterRequiredMetrics(metrics);
    metricCache[family] = filteredMetrics;
    return filteredMetrics;
  } catch {
    metricCache[family] = null;
    return null;
  }
}
async function readMetrics(_source) {
  const source = typeof _source !== "string" && "href" in _source ? _source.href : _source;
  if (source in metricCache)
    return Promise.resolve(metricCache[source]);
  const { protocol } = parseURL(source);
  if (!protocol)
    return null;
  const metrics = protocol === "file:" ? await fromFile(fileURLToPath(source)) : await fromUrl(source);
  const filteredMetrics = filterRequiredMetrics(metrics);
  metricCache[source] = filteredMetrics;
  return filteredMetrics;
}

const supportedExtensions = ["woff2", "woff", "ttf"];
const FONT_FACE_RE = createRegExp(
  exactly("@font-face").and(whitespace.times.any()).and("{").and(charNotIn("}").times.any()).and("}"),
  ["g"]
);
const FONT_FAMILY_RE = createRegExp(
  charNotIn(";}").times.any().as("family").after(exactly("font-family:").and(whitespace.times.any())).before(charIn(";}").or(exactly("").at.lineEnd())),
  ["g"]
);
const CSS_RE = createRegExp(
  exactly(".").and(anyOf("sass", "css", "scss")).at.lineEnd()
);
const FontaineTransform = createUnplugin(
  (options) => {
    const cssContext = options.css = options.css || {};
    cssContext.value = "";
    const resolvePath = options.resolvePath || ((id) => id);
    const fallbackName = options.fallbackName || options.overrideName || generateFallbackName;
    const skipFontFaceGeneration = options.skipFontFaceGeneration || (() => false);
    function readMetricsFromId(path, importer) {
      const resolvedPath = isAbsolute(importer) && path.startsWith(".") ? join(importer, path) : resolvePath(path);
      return readMetrics(resolvedPath);
    }
    return {
      name: "fontaine-transform",
      enforce: "pre",
      transformInclude(id) {
        const { pathname } = parseURL(id);
        return CSS_RE.test(pathname) || CSS_RE.test(id);
      },
      async transform(code, id) {
        const s = new MagicString(code);
        const faceRanges = [];
        for (const match of code.matchAll(FONT_FACE_RE)) {
          const matchContent = match[0];
          if (match.index === void 0 || !matchContent)
            continue;
          faceRanges.push([match.index, match.index + matchContent.length]);
          for (const { family, source } of parseFontFace(matchContent)) {
            if (!family)
              continue;
            if (!supportedExtensions.some((e) => source?.endsWith(e)))
              continue;
            if (skipFontFaceGeneration(fallbackName(family)))
              continue;
            const metrics = await getMetricsForFamily(family) || source && await readMetricsFromId(source, id).catch(() => null);
            if (!metrics)
              continue;
            for (let i = options.fallbacks.length - 1; i >= 0; i--) {
              const fallback = options.fallbacks[i];
              const fallbackMetrics = await getMetricsForFamily(fallback);
              if (!fallbackMetrics)
                continue;
              const fontFace = generateFontFace(metrics, {
                name: fallbackName(family),
                font: fallback,
                metrics: fallbackMetrics
              });
              cssContext.value += fontFace;
              s.appendLeft(match.index, fontFace);
            }
          }
        }
        for (const match of code.matchAll(FONT_FAMILY_RE)) {
          const { index, 0: matchContent } = match;
          if (index === void 0 || !matchContent)
            continue;
          if (faceRanges.some(([start, end]) => index > start && index < end))
            continue;
          const families = matchContent.split(",").map((f) => f.trim()).filter((f) => !f.startsWith("var("));
          if (!families.length || families[0] === "inherit")
            continue;
          s.overwrite(
            index,
            index + matchContent.length,
            ` ${[
              families[0],
              `"${generateFallbackName(families[0])}"`,
              ...families.slice(1)
            ].join(", ")}`
          );
        }
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: options.sourcemap ? s.generateMap({ source: id, includeContent: true }) : void 0
          };
        }
      }
    };
  }
);

export { FontaineTransform, generateFallbackName, generateFontFace, getMetricsForFamily, readMetrics };
