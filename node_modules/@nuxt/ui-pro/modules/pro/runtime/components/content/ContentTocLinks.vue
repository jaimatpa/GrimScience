<template>
  <ul v-if="links?.length" :class="ui.wrapper" v-bind="attrs">
    <li v-for="link in links" :key="link.text" :class="[ui.wrapper, link.depth === 3 && ui.depth]">
      <a
        :href="`#${link.id}`"
        :class="[ui.base, activeHeadings.includes(link.id) ? ui.active : ui.inactive]"
        @click.prevent="scrollToHeading(link.id)"
      >
        {{ link.text }}
      </a>

      <UContentTocLinks v-if="link.children" :links="link.children" :ui="ui" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { TocLink } from '@nuxt/content/dist/runtime/types'

const config = {
  wrapper: 'space-y-1',
  base: 'block text-sm/6 truncate',
  active: 'text-primary',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
  depth: 'ml-3'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  links: {
    type: Array as PropType<TocLink[]>,
    default: () => []
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config>>,
    default: () => ({})
  }
})

const emit = defineEmits(['move'])

const router = useRouter()
const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()
const { ui, attrs } = useUI('content.toc.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)

nuxtApp.hooks.hookOnce('page:finish', () => {
  updateHeadings([
    ...document.querySelectorAll('h2'),
    ...document.querySelectorAll('h3')
  ])
})

const scrollToHeading = (id: string) => {
  const encodedId = encodeURIComponent(id)
  router.push(`#${encodedId}`)
  emit('move', id)
}
</script>
