import dfs from './dfs'
export default postorder

function postorder (g, vs) {
  return dfs(g, vs, 'post')
}
