[![nuxt-ui-pro.png](https://volta.s3.fr-par.scw.cloud/306965274_1682f2a7_dfc5_4c85_9807_6203cd568852_154cf5592c.png)](https://ui.nuxt.com/pro)

# Nuxt UI Pro

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt UI Pro is a collection of Vue components, composables and utils **built on top of Nuxt UI**, oriented on **structure and layout** and designed to be used as **building blocks for your app**.

- [Documentation](https://ui.nuxt.com/pro/getting-started)
- [Pricing](https://ui.nuxt.com/pro/pricing)

## Templates

You can get started with our [minimal starter](https://github.com/nuxt-ui-pro/starter), one of our [official templates](https://ui.nuxt.com/pro/templates) or follow the [Installation](https://ui.nuxt.com/pro/getting-started/installation) guide to install Nuxt UI Pro in your existing project.

- [Landing](https://github.com/nuxt-ui-pro/landing)
- [Docs](https://github.com/nuxt-ui-pro/docs)
- [SaaS](https://github.com/nuxt-ui-pro/saas)
- [Dashboard](https://github.com/nuxt-ui-pro/dashboard)

## Installation

```bash
# npm
npm install @nuxt/ui-pro
# yarn
yarn add @nuxt/ui-pro
# pnpm
pnpm add @nuxt/ui-pro
# bun
bun add @nuxt/ui-pro
```

Note that `@nuxt/ui-pro` will also install [`@nuxt/ui`](https://ui.nuxt.com) as dependency to your project.

Next, add it to your `nuxt.config.ts` in the `extends` property:

```ts
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui']
})
```

Start your development server, you should now be able to use all the components, composables and utils from Nuxt UI Pro 🚀

## License Key

Nuxt UI Pro is free in development, but you need a license to use it in production. You can choose between **Solo** and **Team**, both will give you access to the same features and give you a license key required to build your apps. The main difference is the number of developers that can be invited to the private GitHub repository.

Once you've purchased [Nuxt UI Pro](https://ui.nuxt.com/pro/pricing), you will receive an email with a license key to activate. Visit https://ui.nuxt.com/pro/activate to activate your license with your GitHub username and license key, you will be invited to the private GitHub repository.

Then, use your license key in your `.env` file:

```
# .env
NUXT_UI_PRO_LICENSE=<your-license-key>
```

If you have multiple projects on your machine, you can also add it to your `~/.nuxtrc`:

```
uiPro.license=<your-token>
```

## Showcase

Here are some open-source projects using Nuxt UI Pro:

- [Nuxt.com](https://github.com/nuxt/nuxt.com)
- [Nuxt Image](https://github.com/nuxt/image/tree/main/docs)
- [Vue Email](https://github.com/vue-email/docs)
- [Unhead](https://github.com/unjs/unhead/tree/main/docs)
- [Oku](https://github.com/oku-ui/docs)

## Devtools

When using the [Nuxt Devtools](https://devtools.nuxt.com), you can see the list of components injected by Nuxt UI Pro in the "Components' tab:

![nuxt-ui-pro-devtools](https://github.com/nuxt/ui-pro/assets/904724/4ec2862e-91a0-4ae1-9458-264983d39b6e)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/ui-pro/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@nuxt/ui-pro

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt/ui-pro.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/@nuxt/ui-pro

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

## License

*In progress. You cannot repackage Nuxt UI Pro or copy/paste the components into premium templates, UI libraries or open source projects.*
