import { injectGlobal, css } from '@emotion/css';

const globalStyles = injectGlobal `
  :root {
    --vis-line-cursor: default;
    --vis-line-stroke-dasharray: none;
    --vis-line-stroke-dashoffset: 0;
  }
`;
const root = css `
  label: line-component;
`;
const line = css `
  label: line;
  transition: opacity 200ms;
  cursor: var(--vis-line-cursor);
`;
const linePath = css `
  label: linePath;
  fill: none;
  stroke-dasharray: var(--vis-line-stroke-dasharray);
  stroke-dashoffset: var(--vis-line-stroke-dashoffset);
`;
const lineSelectionHelper = css `
  label: lineSelectionHelper;
  fill: none;
  stroke: rgba(0, 0, 0, 0);
  stroke-width: 8px;
`;
const dim = css `
  opacity: 0.2;
`;

export { dim, globalStyles, line, linePath, lineSelectionHelper, root };
//# sourceMappingURL=style.js.map
