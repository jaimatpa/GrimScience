// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/gmsStyles.css'],
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],

  runtimeConfig: {
    public: {
      AUTHORIZE_API_LOGIN_KEY: process.env.AUTHORIZE_API_LOGIN_KEY,
      AUTHORIZE_TRANSACTION_KEY: process.env.AUTHORIZE_TRANSACTION_KEY,
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'nuxt-file-storage'
  ],

  fileStorage: {
    // enter the absolute path to the location of your storage
    mount: 'public',

  },

  app: {
    head: {
      bodyAttrs: {
        style: 'font-family: "Arial", sans-serif;'
      }
      // style: 'font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;',
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
    '/login': {ssr: false},
    '/customers/:id': {ssr: false}, 
    'service/serviceordersorders/:id': {ssr: false}
  },

  compatibilityDate: '2024-07-14'
})
