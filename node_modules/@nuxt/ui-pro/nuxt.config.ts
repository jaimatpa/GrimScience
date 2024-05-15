import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '#ui-pro': resolve('./') },
  components: [
    { path: '#ui-pro/components', prefix: 'U', pathPrefix: false }
  ],
  css: [
    '#ui-pro/assets/css/main.css',
    '#ui-pro/assets/css/scrollbars.css'
  ],
  vite: {
    optimizeDeps: {
      include: ['vue3-smooth-dnd']
    }
  }
})
