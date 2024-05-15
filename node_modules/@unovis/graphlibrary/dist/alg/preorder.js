import dfs from './dfs.js';

function preorder (g, vs) {
  return dfs(g, vs, 'pre')
}

export { preorder as default };
//# sourceMappingURL=preorder.js.map
