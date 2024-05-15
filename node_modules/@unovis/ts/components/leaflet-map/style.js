import { injectGlobal, css } from '@emotion/css';
import { getCssVarNames, injectGlobalCssVariables } from '../../utils/style.js';
import css_248z from './leaflet.css.js';

injectGlobal(css_248z);
const cssVarDefaults = {
    '--vis-map-container-background-color': '#dfe5eb',
    /* Undefined by default to allow proper fallback to var(--vis-font-family) */
    '--vis-map-label-font-family': undefined,
    '--vis-map-point-default-fill-color': '#B9BEC3',
    '--vis-map-point-ring-fill-color': '#ffffff',
    '--vis-map-point-default-stroke-color': '#959da3',
    '--vis-map-point-default-stroke-width': '0px',
    '--vis-map-point-default-cursor': 'default',
    '--vis-map-cluster-default-fill-color': '#fff',
    '--vis-map-cluster-default-stroke-color': '#B9BEC3',
    '--vis-map-cluster-default-stroke-width': '1.5px',
    '--vis-map-cluster-donut-fill-color': '#959da3',
    '--vis-map-cluster-inner-label-text-color-dark': '#5b5f6d',
    '--vis-map-cluster-inner-label-text-color-light': '#fff',
    '--vis-map-point-inner-label-text-color-dark': '#5b5f6d',
    '--vis-map-point-inner-label-text-color-light': '#fff',
    '--vis-map-point-bottom-label-text-color': '#5b5f6d',
    '--vis-map-point-bottom-label-font-size': '10px',
    '--vis-map-cluster-expanded-background-fill-color': '#fff',
    /* Dark Theme */
    '--vis-dark-map-container-background-color': '#dfe5eb',
    '--vis-dark-map-point-default-fill-color': '#B9BEC3',
    '--vis-dark-map-point-default-stroke-color': '#959da3',
    '--vis-dark-map-point-ring-fill-color': '#5b5f6d',
    '--vis-dark-map-cluster-default-fill-color': '#5b5f6d',
    '--vis-dark-map-cluster-default-stroke-color': '#B9BEC3',
    '--vis-dark-map-cluster-donut-fill-color': '#959da3',
    '--vis-dark-map-cluster-inner-label-text-color-dark': '#5b5f6d',
    '--vis-dark-map-cluster-inner-label-text-color-light': '#fff',
    '--vis-dark-map-point-inner-label-text-color-dark': '#5b5f6d',
    '--vis-dark-map-point-inner-label-text-color-light': '#fff',
    '--vis-dark-map-point-bottom-label-text-color': '#5b5f6d',
    '--vis-dark-map-cluster-expanded-background-fill-color': '#fff',
};
const root = css `
  label: leaflet-map-component;

  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--vis-map-container-background-color);

  canvas {
    pointer-events: all;
  }
`;
const variables = getCssVarNames(cssVarDefaults);
injectGlobalCssVariables(cssVarDefaults, root);
const background = `${root} canvas`;
const points = css `
  label: g-points;
`;
const point = css `
  label: g-point;
`;
const pointPath = css `
  label: point-path;

  stroke-opacity: 1;
  fill-opacity: 1.0;
  fill: var(${variables.mapPointDefaultFillColor});
  stroke: var(${variables.mapPointDefaultStrokeColor});
  stroke-width: var(${variables.mapPointDefaultStrokeWidth});
  pointer-events: fill !important;
  transition: .2s stroke-width, .3s transform;
  cursor: var(${variables.mapPointDefaultCursor});

  &:hover {
    stroke-width: 2;
    fill-opacity: 1;
    animation: none;
    transform: scale(1.1);
  }
`;
const pointPathRing = css `
  label: point-path-ring;
  fill: var(${variables.mapPointRingFillColor});
`;
const pointPathCluster = css `
  label: point-path-cluster;
  fill-opacity: 0.9;
  stroke: none;
  animation: none;
  fill: var(${variables.mapClusterDefaultFillColor});
  stroke: var(${variables.mapClusterDefaultStrokeColor});
  stroke-width: var(${variables.mapClusterDefaultStrokeWidth});
`;
const pointSelectionRing = css `
  label: point-selection-ring;
  stroke: var(${variables.mapPointDefaultFillColor});
`;
const pointSelection = css `
  label: point-selection;

  opacity: 0;
  transform: scale(1);

  &.active {
    transition: all 400ms cubic-bezier(0.230, 1.000, 0.320, 1.000);
    opacity: 1;
    transform: scale(1.25);
  }
`;
const innerLabel = css `
  label: inner-label;

  text-anchor: middle;
  fill: var(${variables.mapPointInnerLabelTextColorDark});
  font-family: var(${variables.mapLabelFontFamily}, var(--vis-font-family));
  pointer-events: none;
  font-weight: 600;
`;
const innerLabelCluster = css `
  label: inner-label-cluster;
  fill: var(${variables.mapPointInnerLabelTextColorDark});
`;
const bottomLabel = css `
  label: bottom-label;

  text-anchor: middle;
  fill: var(${variables.mapPointBottomLabelTextColor});
  font-family: var(${variables.mapLabelFontFamily}, var(--vis-font-family));
  pointer-events: none;
  font-weight: 600;
`;
const donutCluster = css `
  label: donut-cluster;

  transform: scale(1);
  transition: .3s transform;
  path {
    fill: var(${variables.mapClusterDonutFillColor});
    stroke-width: 0.5;
  }

  &:hover {
    transform: scale(1.1);
  }
`;
const svgOverlay = css `
  label: svg-overlay;
  position: absolute;
  pointer-events: none;
`;
const backgroundRect = css `
  label: background-rect;

  opacity: 0;
`;
const clusterBackground = css `
  label: cluster-background;

  fill: var(${variables.mapClusterExpandedBackgroundFillColor});
  opacity: 0.6;
  visibility: hidden;

  &.active {
    visibility: visible;
  }
`;
const onFeatureHover = css `
  label: feature-hovered;
`;
const mapboxglCanvas = css `
  pointer-events: all;
  cursor: grab;

  &${`.${onFeatureHover}`} {
    cursor: default;
  }
`;
const map = css `
  label: map;
`;

export { background, backgroundRect, bottomLabel, clusterBackground, donutCluster, innerLabel, innerLabelCluster, map, mapboxglCanvas, onFeatureHover, point, pointPath, pointPathCluster, pointPathRing, pointSelection, pointSelectionRing, points, root, svgOverlay, variables };
//# sourceMappingURL=style.js.map
