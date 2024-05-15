import { useStorage } from '@vueuse/core'

export const useResizable = (key: string, { min, max, value = 0, storage = 'cookie' }: {
  min?: number,
  max?: number,
  value?: number,
  storage?: 'cookie' | 'local'
}) => {
  const el = ref<HTMLElement | null>(null)

  const width = storage === 'cookie' ? useCookie<number>(key, { default: () => value }) : useStorage<number>(key, () => value)

  const isDragging = ref(false)

  function onMouseMove (e: MouseEvent, x: number) {
    let w = el.value!.offsetWidth + e.clientX - x
    if (min) {
      w = Math.max(w, min)
    }
    if (max) {
      w = Math.min(w, max)
    }

    width.value = w

    return e.clientX
  }

  function onDrag (e: MouseEvent) {
    if (!el.value) return

    let x = e.clientX

    document.onmousemove = (e) => {
      isDragging.value = true
      x = onMouseMove(e, x)
    }

    document.onmouseup = () => {
      isDragging.value = false
      document.onmousemove = document.onmouseup = null
    }
  }

  return {
    el,
    width,
    isDragging,
    onDrag
  }
}
