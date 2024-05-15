import dfs from './dfs'
export default preorder

function preorder (g, vs) {
  return dfs(g, vs, 'pre')
}
