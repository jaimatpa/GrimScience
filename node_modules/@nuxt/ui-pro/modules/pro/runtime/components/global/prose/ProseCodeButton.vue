<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const config = {
  icon: {
    copy: 'i-heroicons-clipboard-document',
    copied: 'i-heroicons-clipboard-document-check'
  }
}

const { ui } = useUI('content.prose.code.button', undefined, config, undefined, true)
const clipboard = useCopyToClipboard({ timeout: 2000 })
const icon = ref(ui.value.icon.copy)

// Methods

function copy () {
  clipboard.copy(props.code, { title: 'Copied to clipboard!' })

  icon.value = ui.value.icon.copied

  setTimeout(() => {
    icon.value = ui.value.icon.copy
  }, 2000)
}
</script>

<template>
  <UButton
    :icon="icon"
    color="gray"
    variant="link"
    size="xs"
    aria-label="Copy code to clipboard"
    tabindex="-1"
    @click="copy"
  />
</template>
