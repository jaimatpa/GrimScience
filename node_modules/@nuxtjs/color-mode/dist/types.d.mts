
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['colorMode']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['colorMode']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['colorMode']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['colorMode']?: ModuleOptions }
}


export type { ModuleOptions, default } from './module.js'
