'use strict';

const unplugin = require('unplugin');
const magicRegexp = require('magic-regexp');
const MagicString = require('magic-string');
const ufo = require('ufo');
const pathe = require('pathe');
const node_url = require('node:url');
const unpack = require('@capsizecss/unpack');
const metrics = require('@capsizecss/metrics');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const MagicString__default = /*#__PURE__*/_interopDefaultCompat(MagicString);

function toPercentage(value, fractionDigits = 4) {
  const percentage = value * 100;
  return `${+percentage.toFixed(fractionDigits)}%`;
}
function toCSS(properties, indent = 2) {
  return Object.entries(properties).map(([key, value]) => `${" ".repeat(indent)}${key}: ${value};`).join("\n");
}
const QUOTES_RE = magicRegexp.createRegExp(
  magicRegexp.charIn(`"'`).at.lineStart().or(magicRegexp.charIn(`"'`).at.lineEnd()),
  ["g"]
);
const FAMILY_RE = magicRegexp.createRegExp(
  magicRegexp.exactly("font-family:").and(magicRegexp.whitespace.optionally()).and(magicRegexp.charNotIn(";}").times.any().as("fontFamily"))
);
const SOURCE_RE = magicRegexp.createRegExp(
  magicRegexp.exactly("src:").and(magicRegexp.whitespace.optionally()).and(magicRegexp.charNotIn(";}").times.any().as("src")),
  ["g"]
);
const URL_RE = magicRegexp.createRegExp(
  magicRegexp.exactly("url(").and(magicRegexp.charNotIn(")").times.any().as("url")).and(")"),
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
    const name = metrics.fontFamilyToCamelCase(family);
    const { entireMetricsCollection } = await import('@capsizecss/metrics/entireMetricsCollection');
    const metrics$1 = entireMetricsCollection[name];
    const filteredMetrics = filterRequiredMetrics(metrics$1);
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
  const { protocol } = ufo.parseURL(source);
  if (!protocol)
    return null;
  const metrics = protocol === "file:" ? await unpack.fromFile(node_url.fileURLToPath(source)) : await unpack.fromUrl(source);
  const filteredMetrics = filterRequiredMetrics(metrics);
  metricCache[source] = filteredMetrics;
  return filteredMetrics;
}

const supportedExtensions = ["woff2", "woff", "ttf"];
const FONT_FACE_RE = magicRegexp.createRegExp(
  magicRegexp.exactly("@font-face").and(magicRegexp.whitespace.times.any()).and("{").and(magicRegexp.charNotIn("}").times.any()).and("}"),
  ["g"]
);
const FONT_FAMILY_RE = magicRegexp.createRegExp(
  magicRegexp.charNotIn(";}").times.any().as("family").after(magicRegexp.exactly("font-family:").and(magicRegexp.whitespace.times.any())).before(magicRegexp.charIn(";}").or(magicRegexp.exactly("").at.lineEnd())),
  ["g"]
);
const CSS_RE = magicRegexp.createRegExp(
  magicRegexp.exactly(".").and(magicRegexp.anyOf("sass", "css", "scss")).at.lineEnd()
);
const FontaineTransform = unplugin.createUnplugin(
  (options) => {
    const cssContext = options.css = options.css || {};
    cssContext.value = "";
    const resolvePath = options.resolvePath || ((id) => id);
    const fallbackName = options.fallbackName || options.overrideName || generateFallbackName;
    const skipFontFaceGeneration = options.skipFontFaceGeneration || (() => false);
    function readMetricsFromId(path, importer) {
      const resolvedPath = pathe.isAbsolute(importer) && path.startsWith(".") ? pathe.join(importer, path) : resolvePath(path);
      return readMetrics(resolvedPath);
    }
    return {
      name: "fontaine-transform",
      enforce: "pre",
      transformInclude(id) {
        const { pathname } = ufo.parseURL(id);
        return CSS_RE.test(pathname) || CSS_RE.test(id);
      },
      async transform(code, id) {
        const s = new MagicString__default(code);
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

exports.FontaineTransform = FontaineTransform;
exports.generateFallbackName = generateFallbackName;
exports.generateFontFace = generateFontFace;
exports.getMetricsForFamily = getMetricsForFamily;
exports.readMetrics = readMetrics;
