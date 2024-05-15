import { h } from 'vue'
import ContentSearchButton from '../content/ContentSearchButton.vue'

/**
 * @deprecated use `ContentSearchButton` instead
*/
export default (_: any, context: any) => {
  console.warn('[@nuxt/ui-pro] `DocsSearchButton` is deprecated, use `ContentSearchButton` instead.')

  return h(ContentSearchButton, context.attrs, context.slots)
}
