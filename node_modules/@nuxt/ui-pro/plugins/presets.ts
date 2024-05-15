export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()

  return {
    provide: {
      ui: appConfig.ui.presets
    }
  }
})
