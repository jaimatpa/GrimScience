import { h } from 'vue'
import ContentTocLinks from '../content/ContentTocLinks.vue'

/**
 * @deprecated use `ContentTocLinks` instead
*/
export default (_: any, context: any) => {
  console.warn('[@nuxt/ui-pro] `DocsTocLinks` is deprecated, use `ContentTocLinks` instead.')

  return h(ContentTocLinks, context.attrs, context.slots)
}
