import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isHelpSlideoverOpen = ref(false)
  const isNotificationsSlideoverOpen = ref(false)
  const userInfo = ref({
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

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-i': () => router.push('/inbox'),
    'g-u': () => router.push('/users'),
    'g-s': () => router.push('/settings'),
    '?': () => isHelpSlideoverOpen.value = true,
    'n': () => isNotificationsSlideoverOpen.value = true
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
    isNotificationsSlideoverOpen,
    userInfo
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
