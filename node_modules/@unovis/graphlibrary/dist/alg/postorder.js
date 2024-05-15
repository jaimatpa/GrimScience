import dfs from './dfs.js';

function postorder (g, vs) {
  return dfs(g, vs, 'post')
}

export { postorder as default };
//# sourceMappingURL=postorder.js.map
