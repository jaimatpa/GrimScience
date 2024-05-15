<template>
  <article :class="ui.wrapper" v-bind="attrs">
    <div v-if="image || $slots.image" :class="ui.image.wrapper">
      <slot name="image">
        <NuxtImg v-bind="typeof image === 'string' ? { src: image, alt: title } : { alt: title, ...image }" :class="ui.image.base" />
      </slot>
    </div>

    <div :class="ui.container">
      <div :class="ui.inner">
        <NuxtLink v-if="to" :aria-label="ariaLabel" v-bind="nuxtLinkBind" class="focus:outline-none" tabindex="-1">
          <span class="absolute inset-0" aria-hidden="true" />
        </NuxtLink>

        <div v-if="badge || $slots.badge" :class="ui.badge.wrapper">
          <slot name="badge">
            <UBadge v-if="badge" v-bind="{ variant: 'subtle', ...badge }" :class="ui.badge.base" />
          </slot>
        </div>

        <h2 v-if="title || $slots.title" :class="ui.title">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <p v-if="description || $slots.description" :class="ui.description">
          <slot name="description">
            {{ description }}
          </slot>
        </p>

        <slot />
      </div>

      <div v-if="authors?.length || date" :class="ui.authors.wrapper">
        <slot name="authors">
          <UAvatarGroup v-if="authors?.length">
            <UAvatar
              v-for="(author, index) in authors"
              :key="index"
              :alt="author.name"
              :class="ui.authors.avatar.base"
              v-bind="{ size: ui.authors.avatar.size, ...author.avatar }"
            >
              <NuxtLink v-if="author.to" v-bind="{ target: '_blank', ...getNuxtLinkProps(author) }" class="focus:outline-none" tabindex="-1">
                <span class="absolute inset-0" aria-hidden="true" />
              </NuxtLink>
            </UAvatar>
          </UAvatarGroup>
        </slot>

        <slot name="date">
          <time v-if="date" :datetime="new Date(date).toISOString()" :class="ui.date">
            {{ date }}
          </time>
        </slot>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { nuxtLinkProps, getNuxtLinkProps } from '#ui/utils'
import { getSlotChildrenText } from '../../lib/slots'
import type { Avatar, Badge } from '#ui/types'
import type { NuxtLinkProps } from '#app'

defineOptions({
  inheritAttrs: false
})

const slots = useSlots()

const props = defineProps({
  ...nuxtLinkProps,
  title: {
    type: String,
    default: undefined
  },
  description: {
    type: String,
    default: undefined
  },
  date: {
    type: [String, Date],
    default: undefined
  },
  image: {
    type: [String, Object] as PropType<Partial<HTMLImageElement> | string>,
    default: undefined
  },
  badge: {
    type: Object as PropType<Badge>,
    default: undefined
  },
  authors: {
    type: Array as PropType<({
      name: string
      avatar: Avatar
    } & NuxtLinkProps)[]>,
    default: undefined
  },
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const config = computed(() => {
  const wrapper = twJoin(
    'relative group flex flex-col w-full gap-y-6',
    props.orientation === 'horizontal' && (!!props.image || !!slots.image) ? 'lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-center' : undefined
  )

  return {
    wrapper,
    image: {
      wrapper: 'ring-1 ring-gray-200 dark:ring-gray-800 relative overflow-hidden aspect-[16/9] w-full rounded-lg pointer-events-none',
      base: 'object-cover object-top w-full h-full transform transition-transform duration-200 group-hover:scale-105'
    },
    container: 'flex flex-col justify-between flex-1',
    inner: 'flex-1',
    badge: {
      wrapper: 'mb-3',
      base: ''
    },
    title: 'text-gray-900 dark:text-white text-xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200',
    description: 'text-base text-gray-500 dark:text-gray-400 mt-1',
    date: 'text-sm text-gray-500 dark:text-gray-400 font-medium pointer-events-none',
    authors: {
      wrapper: 'relative flex items-center gap-x-3 mt-4',
      avatar: {
        base: 'relative ring-1 lg:hover:scale-105 lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform',
        size: 'xs' as const
      }
    }
  }
})

const { ui, attrs } = useUI('blog.post', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const nuxtLinkBind = computed(() => getNuxtLinkProps(props))
const ariaLabel = computed(() => (props.title || (slots.title && getSlotChildrenText(slots.title())) || 'Post link').trim())
</script>
