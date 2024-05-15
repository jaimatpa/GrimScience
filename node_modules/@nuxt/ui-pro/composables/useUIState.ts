import { createSharedComposable } from '@vueuse/core'

const _useUIState = () => {
  const route = useRoute()

  const isHeaderDialogOpen = ref(false)
  const isContentSearchModalOpen = ref(false)
  const isDashboardSidebarSlidoverOpen = ref(false)
  const isDashboardSearchModalOpen = ref(false)

  function toggleContentSearch () {
    if (isHeaderDialogOpen.value) {
      isHeaderDialogOpen.value = false

      setTimeout(() => {
        isContentSearchModalOpen.value = !isContentSearchModalOpen.value
      }, 0)

      return
    }

    isContentSearchModalOpen.value = !isContentSearchModalOpen.value
  }

  function toggleDashboardSearch () {
    if (isDashboardSidebarSlidoverOpen.value) {
      isDashboardSidebarSlidoverOpen.value = false

      setTimeout(() => {
        isDashboardSearchModalOpen.value = !isDashboardSearchModalOpen.value
      }, 200)

      return
    }

    isDashboardSearchModalOpen.value = !isDashboardSearchModalOpen.value
  }

  watch(() => route.path, () => {
    isDashboardSidebarSlidoverOpen.value = false
  })

  return {
    isHeaderDialogOpen,
    isContentSearchModalOpen,
    isDashboardSidebarSlidoverOpen,
    isDashboardSearchModalOpen,
    toggleContentSearch,
    toggleDashboardSearch
  }
}

export const useUIState = createSharedComposable(_useUIState)
