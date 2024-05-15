<template>
  <UCard :class="[ui.wrapper, highlight && ui.highlight, scale && ui.scale]" v-bind="attrs" :ui="ui">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <div :class="ui.left">
      <div :class="ui.inner">
        <p v-if="title || $slots.title" :class="ui.title">
          <slot name="title">
            {{ title }}
          </slot>
        </p>

        <UBadge v-if="badge" v-bind="{ variant: 'subtle', ...badge }" />
      </div>

      <p v-if="description || $slots.description" :class="ui.description">
        <slot name="description">
          {{ description }}
        </slot>
      </p>

      <template v-if="orientation === 'horizontal'">
        <UDivider :class="ui.divider" />

        <div v-if="features?.length || $slots.features" class="flex-1">
          <slot name="features">
            <ul v-if="features?.length" :class="ui.features.horizontal">
              <li v-for="(offer, index) of features" :key="index" :class="ui.features.item.base">
                <UIcon :name="ui.features.item.icon.name" :class="ui.features.item.icon.base" />

                <span :class="ui.features.item.label">{{ offer }}</span>
              </li>
            </ul>
          </slot>
        </div>
      </template>
    </div>

    <template v-if="orientation === 'vertical'">
      <div :class="ui.amount.base">
        <p v-if="discount && price" :class="ui.amount.discount">
          {{ price }}
        </p>
        <p :class="ui.amount.price">
          {{ discount || price || '&nbsp;' }}
        </p>
        <p v-if="cycle" :class="ui.amount.cycle">
          {{ cycle }}
        </p>
      </div>

      <div v-if="features?.length || $slots.features" :class="align === 'top' && 'order-last'" class="flex-1">
        <slot name="features">
          <ul v-if="features?.length" :class="ui.features.vertical">
            <li v-for="(offer, index) of features" :key="index" :class="ui.features.item.base">
              <UIcon :name="ui.features.item.icon.name" :class="ui.features.item.icon.base" />

              <span :class="ui.features.item.label">{{ offer }}</span>
            </li>
          </ul>
        </slot>
      </div>
    </template>

    <div :class="ui.right">
      <div v-if="orientation === 'horizontal'" :class="[ui.amount.base, align === 'top' && 'order-last']">
        <p v-if="discount && price" :class="ui.amount.discount">
          {{ price }}
        </p>
        <p :class="ui.amount.price">
          {{ discount || price || '&nbsp;' }}
        </p>
        <p v-if="cycle" :class="ui.amount.cycle">
          {{ cycle }}
        </p>
      </div>

      <UButton v-if="button" v-bind="{ block: true, size: 'lg', ...button }" @click="button?.click" />

      <slot v-if="orientation === 'horizontal'" name="bottom" />
    </div>

    <slot v-if="orientation === 'vertical'" name="bottom" />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import type { Badge, Button } from '#ui/types'
import { card as cardConfig } from '#ui/ui.config'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  description: {
    type: String,
    default: undefined
  },
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
  },
  align: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'bottom'
  },
  highlight: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Boolean,
    default: false
  },
  features: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  badge: {
    type: Object as PropType<Badge>,
    default: undefined
  },
  button: {
    type: Object as PropType<Button & { click?: Function }>,
    default: undefined
  },
  price: {
    type: String,
    default: undefined
  },
  discount: {
    type: String,
    default: undefined
  },
  cycle: {
    type: String,
    default: undefined
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value & typeof cardConfig>>,
    default: () => ({})
  }
})

const appConfig = useAppConfig()

const config = computed(() => {
  const base = twJoin(
    'flex-1 gap-6 lg:gap-x-8 xl:gap-x-10 flex flex-col',
    props.orientation === 'horizontal' ? 'lg:grid lg:grid-cols-10' : ''
  )

  const left: string = props.orientation === 'horizontal' ? 'lg:col-span-7' : ''
  const right: string = props.orientation === 'horizontal' ? 'flex flex-col lg:items-center justify-center gap-y-6 lg:col-span-3 border-t lg:border-l lg:border-t-0 border-gray-200 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-8 xl:pl-10' : ''

  return {
    wrapper: 'relative flex flex-col self-stretch w-full',
    highlight: 'ring-2 ring-primary dark:ring-primary',
    scale: 'lg:scale-[1.1] lg:z-10',
    rounded: 'rounded-xl',
    header: {
      padding: 'p-6 lg:px-8 xl:px-10'
    },
    body: {
      base,
      padding: 'p-6 lg:p-8 xl:p-10'
    },
    footer: {
      padding: 'p-6 lg:px-8 xl:px-10'
    },
    inner: 'flex items-center gap-3',
    title: 'text-2xl text-gray-900 dark:text-white sm:text-3xl font-semibold truncate',
    description: 'text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2',
    amount: {
      base: 'flex flex-row items-baseline gap-x-1',
      discount: 'text-gray-500 dark:text-gray-400 line-through text-xl sm:text-2xl font-medium',
      price: 'text-gray-900 dark:text-white text-2xl sm:text-4xl font-semibold',
      cycle: 'text-gray-500 dark:text-gray-400 text-sm/6 font-medium truncate'
    },
    features: {
      vertical: 'space-y-3 text-sm',
      horizontal: 'grid lg:grid-cols-2 text-sm gap-3',
      item: {
        base: 'flex items-center gap-x-3 min-w-0',
        label: 'text-gray-600 dark:text-gray-400 truncate',
        icon: {
          base: 'w-5 h-5 flex-shrink-0 text-primary',
          name: appConfig.ui.icons.check
        }
      }
    },
    divider: 'my-6 lg:my-8',
    left,
    right
  }
})

const { ui, attrs } = useUI('pricing.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
