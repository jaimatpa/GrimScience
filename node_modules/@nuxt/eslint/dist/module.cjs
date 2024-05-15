'use strict';

const kit = require('@nuxt/kit');

const module$1 = kit.defineNuxtModule({
  meta: {
    name: "@nuxt/eslint",
    configKey: "eslint"
  },
  defaults: {
    config: true,
    checker: false
  },
  async setup(options, nuxt) {
    if (options.config) {
      await import('./chunks/index.cjs').then(({ setupConfigGen }) => setupConfigGen(options, nuxt));
    }
    if (options.checker) {
      if (nuxt.options.dev) {
        await import('./chunks/checker.cjs').then(({ setupESLintChecker }) => {
          setupESLintChecker(options, nuxt);
        });
      }
    }
  }
});

module.exports = module$1;
