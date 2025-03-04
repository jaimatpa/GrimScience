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
      //       color: {
      //         primary: {
      //             outline:
      // 'text-primary-600'
      //         }
      //       },
      variant: {
        outline: 'bg-slate-50 hover:bg-{color}-100 dark:bg-{color}-800'

      }
    },

    formGroup: {
      label: {
        base: 'text-black'
      }
    },

    input: {
      color: {
        white: {
          outline: 'ring-black text-black'
        }
      },
      icon: {
        base: 'black',
        color: 'text-black'
      }
    },

    inputMenu: {
      option: {
        icon: {
          base: 'black',
          color: 'text-black'
        }
      },

      formGroup: {
        wrapper: 'flex flex-col-reverse',
        label: {
          wrapper: 'mt-1',
        },
      }
    },

    select: {
      color: {
        white: {
          outline: 'ring-black'
        }
      },
      icon: {
        base: 'text-black'
      }
    },

    table: {
      divide: 'divide-gray-200 dark:divide-gray-800',
      wrapper: 'bg-white',
      sortButton: {
        color: 'black'
      },
      th: {
        color: 'text-black bg-gms-gray-100'
      },
      td: {
        color: 'text-black'
      },
    },

    textarea: {
      color: {
        white: {
          outline: 'ring-black'
        }
      }
    },

    modal: {
      background: 'bg-gms-gray-100',
      overlay: {
        background: 'bg-black/50'
      },
    },

    radio: {
      border: 'border border-black'
    },

    checkbox: {
      border: 'border border-black dark:border-gray-200'
    },

    toggle: {
      inactive: 'bg-gms-gray-300'
    },

    
    dashboard: {
      modal: {
        title: 'text-lg text-white',
        header: {
          base: 'gms-modalHeader',
        },
        body: {
          base: 'gms-modalForm',
        },
        width: 'sm:max-w-9xl',
      },
    },


  }
})
