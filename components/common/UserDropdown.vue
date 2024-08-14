<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()
const loginUserInfo = ref({
  UniqueID: null,
  market: null,
  number: null,
  source: null,
  sourcedescription: null,
  SourceConfrence: null,
  fname: null,
  mi: null,
  lname: null,
  title: null,
  position: null,
  company1: null,
  company2: null,
  country: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  workphone: null,
  homephone: null,
  cellphone: null,
  fax: null,
  email: null,
  website: null,
  notes: null,
  billcompany1: null,
  billcompany2: null,
  billcountry: null,
  billaddress: null,
  billcity: null,
  billstate: null,
  billzip: null,
  billphone: null,
  billfax: null,
  attn: null,
  adddate: null,
  ParadynamixCatagory: null,
  fullname: null,
  Extension: null,
  ExtensionBill: null,
})

const items = computed(() => [
[{
    slot: 'account',
    label: '',
    disabled: true
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog',
    to: '/settings'
  }, {
    label: 'Command menu',
    icon: 'i-heroicons-command-line',
    shortcuts: [metaSymbol.value, 'K'],
    click: () => {
      isDashboardSearchModalOpen.value = true
    }
  }, {
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true
  }], 
  // [{
  //   label: 'Documentation',
  //   icon: 'i-heroicons-book-open',
  //   to: 'https://ui.nuxt.com/pro/getting-started',
  //   target: '_blank'
  // }, {
  //   label: 'GitHub repository',
  //   icon: 'i-simple-icons-github',
  //   to: 'https://github.com/nuxt-ui-pro/dashboard',
  //   target: '_blank'
  // }, {
  //   label: 'Buy Nuxt UI Pro',
  //   icon: 'i-heroicons-credit-card',
  //   to: 'https://ui.nuxt.com/pro/purchase',
  //   target: '_blank'
  // }], 
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => {
      const token = useCookie('token')
      token.value = null
      navigateTo('/login')
    }
  }]
])

const fullname = computed(() => {
  return (loginUserInfo.value.fname ?? '') + ' ' + (loginUserInfo.value.lname ?? '')
})

const init = () => {
  useApiFetch('/api/auth/userInfo', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loginUserInfo.value = response._data.body
      }
    }
  })
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="fullname"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <!-- <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            :alt="fullname"
            size="2xs"
          /> -->
          <UAvatar
            :alt="fullname"
            size="2xs"
          />
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
          Signed in as
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ loginUserInfo.email ?? '' }}
        </p>
        <p class="truncate font-small text-gray-900 dark:text-white">
          Commit ID {COMMIT}
        </p>
      </div>
    </template>

  </UDropdown>
</template>
