
import type { ModuleOptions, ModuleHooks } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['tailwindcss']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['tailwindcss']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['tailwindcss']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['tailwindcss']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
}


export type { ModuleHooks, ModuleOptions, default } from './module.js'
