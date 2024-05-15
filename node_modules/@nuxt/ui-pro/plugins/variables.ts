export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const nuxtApp = useNuxtApp()

  const root = computed(() => {
    return `:root {
  --header-height: ${appConfig.ui.variables.header.height};

  ${Object.entries(appConfig.ui.variables.light).map(([key, value]) => `--ui-${key}: ${value};`).join('\n')}
}

.dark {
  ${Object.entries(appConfig.ui.variables.dark).map(([key, value]) => `--ui-${key}: ${value};`).join('\n')}
}`
  })

  // Head
  const headData: any = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: 'nuxt-ui-variables'
    }]
  }

  // SPA mode
  if (process.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style')

    style.innerHTML = root.value
    style.setAttribute('data-nuxt-ui-variables', '')
    document.head.appendChild(style)

    headData.script = [{
      innerHTML: 'document.head.removeChild(document.querySelector(\'[data-nuxt-ui-variables]\'))'
    }]
  }

  useHead(headData)
})
