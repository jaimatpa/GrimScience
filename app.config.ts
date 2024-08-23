export default defineAppConfig({
  ui: {
    primary: 'gms-primary',
    gray: 'cool',
    tooltip: {
      default: {
        openDelay: 500
      }
    },
    notifications: {
      position: 'top-0 bottom-auto'
    },

    button: {
      variant: {
        outline: 'bg-{slate}-50 hover:bg-{color}-100 dark:bg-{color}-800'
        
      }
    }
  }
})
