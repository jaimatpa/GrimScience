import { css, injectGlobal } from '@emotion/css';

const root = css `
  label: chord-diagram-component;
`;
const variables = injectGlobal `
  :root {
    --vis-chord-diagram-link-fill-color: #cad5f6;
    --vis-chord-diagram-link-stroke-color: #777777;
    --vis-chord-diagram-link-opacity: 0.5;
    --vis-chord-diagram-link-stroke-opacity: 0.15;
    --vis-chord-diagram-link-highlighted-opacity: 0.9;
    --vis-chord-diagram-link-dimmed-opacity: 0.25;

    --vis-chord-diagram-node-highlighted-opacity: 0.9;
    --vis-chord-diagram-node-dimmed-opacity: 0.25;

    --vis-chord-diagram-label-text-fill-color-bright: #ffffff;
    --vis-chord-diagram-label-text-fill-color-dark: #a5abb2;
    --vis-chord-diagram-label-text-font-size: 1em;

    --vis-dark-chord-diagram-link-fill-color: #575c65;
  }

  body.theme-dark ${`.${root}`} {
    --vis-chord-diagram-link-fill-color: var(--vis-dark-chord-diagram-link-fill-color);
  }
`;
const background = css `
  label: background;
`;
const nodes = css `
  label: nodes;
`;
const links = css `
  label: links;
`;
const labels = css `
  label: labels;
`;
const node = css `
  label: node;
  stroke-width: 0;
  fill: var(--vis-color-main);
  stroke: var(--vis-color-main);
  transition: .1s fill-opacity;
`;
const highlightedNode = css `
  label: highlighted;
  fill-opacity: var(--vis-chord-diagram-node-highlighted-opacity);
  stroke-width: 1.5;
`;
const label = css `
  label: label;
`;
const labelText = css `
  label: label-text;

  dominant-baseline: middle;
  user-select: none;
  font-size: var(--vis-chord-diagram-label-text-font-size);
  
  > textPath {
    dominant-baseline: central;
  }
`;
const labelExit = css `
  label: label-exit;
`;
const link = css `
  label: link;

  fill: var(--vis-chord-diagram-link-fill-color);
  fill-opacity: var(--vis-chord-diagram-link-opacity);
  stroke: var(--vis-chord-diagram-link-stroke-color);
  stroke-opacity:  var(--vis-chord-diagram-link-stroke-opacity);
  transition: .1s fill-opacity;
`;
const highlightedLink = css `
  label: highlighted;
  fill-opacity: var(--vis-chord-diagram-link-highlighted-opacity);
`;
const transparent = css `
  label: transparent;

  ${`.${link}`}:not(${`.${highlightedLink}`}) {
    fill-opacity: var(--vis-chord-diagram-link-dimmed-opacity);
  }

  ${`.${node}`}:not(${`.${highlightedNode}`}) {
    fill-opacity: var(--vis-chord-diagram-node-dimmed-opacity);
  }
`;

export { background, highlightedLink, highlightedNode, label, labelExit, labelText, labels, link, links, node, nodes, root, transparent, variables };
//# sourceMappingURL=style.js.map
