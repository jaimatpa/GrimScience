import { defaultWindow, watchThrottled, unrefElement } from '@vueuse/core'
import type { MaybeElementRef, MouseInElementOptions } from '@vueuse/core'

export function useSharedMouseInElement (
  target?: MaybeElementRef,
  options: MouseInElementOptions = {}
) {
  const { x, y } = useSharedMouse(options)

  const targetRef = ref(target ?? window?.document.body)
  const elementX = ref(0)
  const elementY = ref(0)

  if (defaultWindow) {
    watchThrottled(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef)
        if (!el) { return }

        const { left, top } = el.getBoundingClientRect()

        const eX = x.value - (left + defaultWindow!.scrollX)
        const eY = y.value - (top + defaultWindow!.scrollY)

        // We don't update the value when the mouse to too far away
        if (Math.abs(eX) > 1500 || Math.abs(eY) > 1500 || defaultWindow!.screen.width <= 800) {
          return
        }

        elementX.value = eX
        elementY.value = eY
      },
      { immediate: true, throttle: 50 }
    )
  }

  return {
    x,
    y,
    elementX,
    elementY
  }
}
