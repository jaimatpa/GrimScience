import { h } from 'vue'
import ContentSearch from '../content/ContentSearch.vue'

/**
 * @deprecated use `ContentSearch` instead
*/
export default (_: any, context: any) => {
  console.warn('[@nuxt/ui-pro] `DocsSearch` is deprecated, use `ContentSearch` instead.')

  return h(ContentSearch, context.attrs, context.slots)
}
