<script setup lang="ts">
const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'scroll-mt-[calc(48px+24px+var(--header-height))] lg:scroll-mt-[calc(24px+var(--header-height))]',
  icon: {
    wrapper: '-ml-6 pr-2 py-1 inline-flex opacity-0 group-hover:lg:opacity-100 transition-opacity absolute',
    base: 'w-4 h-4 text-primary',
    name: appConfig.ui.icons.hash
  }
}))

defineProps({
  id: {
    type: String,
    required: true
  }
})

const { ui } = useUI('content.prose.h4', undefined, config, undefined, true)
</script>

<template>
  <h4 :id="id" :class="ui.wrapper">
    <NuxtLink :href="`#${id}`" class="group">
      <div :class="ui.icon.wrapper">
        <UIcon :name="ui.icon.name" :class="ui.icon.base" />
      </div>

      <slot />
    </NuxtLink>
  </h4>
</template>
