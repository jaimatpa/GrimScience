// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/gmsStyles.css'],
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt'
  ],

  app: {
    head: {
      bodyAttrs: {
        style: 'font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;',
      }
    }
  },

  ui: {
    icons: ['heroicons', 'simple-icons', 'f7'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },

  colorMode: {
    preference: 'light',
  },

  devtools: {
    enabled: false
  },

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  routeRules: {
    '/login': { ssr: false },
    '/customers/:id': { ssr: false },
    'service/serviceordersorders/:id': { ssr: false }
  },

})