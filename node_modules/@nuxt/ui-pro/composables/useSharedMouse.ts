import { createSharedComposable, useMouse } from '@vueuse/core'

export const useSharedMouse = createSharedComposable(useMouse)
