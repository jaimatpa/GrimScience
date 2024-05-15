import { h } from 'vue'
import ContentSurround from '../content/ContentSurround.vue'

/**
 * @deprecated use `ContentSurround` instead
*/
export default (_: any, context: any) => {
  console.warn('[@nuxt/ui-pro] `DocsSurround` is deprecated, use `ContentSurround` instead.')

  return h(ContentSurround, context.attrs, context.slots)
}
