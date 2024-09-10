<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true
  }, 
  isModal: {
    type: [Boolean]
  }
})
const action = ref('add')
const toast = useToast()
const router = useRouter()
const customersFormInstance = getCurrentInstance();

const loadingOverlay = ref(false)
const customerExist = ref(true)
const markets = ref([])
const professions = ref([])
const categories = ref([])
const conferences = ref([])
const usstates = ref([])
const formData = reactive({
  UniqueID: null,
  market: null,
  number: null,
  source: professions[0],
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

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        customerExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    }, 
    onResponseError({}) {
      customerExist.value = false
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/customers/markets', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        markets.value = response._data.body;
      }
    }, 
    onResponseError() {
      markets.value = []
    }
  })
  await useApiFetch('/api/customers/conferences', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        conferences.value = response._data.body;
      }
    }, 
    onResponseError() {
      conferences.value = []
    }
  })
  await useApiFetch('/api/customers/categories', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        categories.value = response._data.body;
      }
    },
    onResponseError() {
      categories.value = []
    }
  })
  await useApiFetch('/api/customers/professions', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        professions.value = response._data.body;
      }
    },
    onResponseError() {
      professions.value = []
    }
  })
  await useApiFetch('/api/common/usstates',  {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        usstates.value = response._data.body;
     
      }
    },
    onResponseError() {
      usstates.value = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
      ];
    }
  })
  loadingOverlay.value = false
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
  if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
const handleClose = async () => {
  if(customersFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if(props.selectedCustomer === null) { // Create Customer
    await useApiFetch('/api/customers', {
      method: 'POST',
      body: event.data, 
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })
  } else { // Update Customer
    await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
      method: 'PUT',
      body: event.data, 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })
  }
  emit('save')
}

  const modalMeta = ref({
      isCustomerModalOpen: false,
      isOrderDetailModalOpen: false,
      isQuoteDetailModalOpen: false,
      isServiceOrderDetailModalOpen: false,
      isSiteVisitModalOpen: false,
      modalTitle: "New Customer",
  })

  const onOrderDetail = () => {
      modalMeta.value.isOrderDetailModalOpen = true
  }
  const onQuoteDetail = () => {
    modalMeta.value.isQuoteDetailModalOpen = true
  }
    const onServiceOrderDetail = () => {
    modalMeta.value.isServiceOrderDetailModalOpen = true
  }
    const onSiteVisitDetail = () => {
    modalMeta.value.isSiteVisitModalOpen = true
  }

if(props.selectedCustomer !== null) 
  editInit()
else 
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading
      v-model:active="loadingOverlay"
      :is-full-page="true"
      color="#000000"
      backgroundColor="#1B2533"
      loader="dots"
    />
  </div>
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound
      :name="'Customer not found'"
      :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'"
    />
  </template>
  <template v-else>
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="First"
            name="fname"
          >
            <UInput
              v-model="formData.fname"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="MI"
            name="md"
          >
            <UInput
              v-model="formData.mi"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Last"
            name="lname"
          >
            <UInput
              v-model="formData.lname"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Title"
            name="title"
          >
            <UInput
              v-model="formData.title"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Position"
            name="position"
          >
            <UInput
              v-model="formData.position"
            />
          </UFormGroup>
        </div>
      </div>
  
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Market"
            name="market"
          >
            <UInputMenu
              v-model="formData.market"
              v-model:query="formData.market"
              :options="markets"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Number"
            name="number"
          >
            <UInput
              v-model="formData.number"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Profession"
            name="profession"
          >
            <UInputMenu
              v-model="formData.source"
              v-model:query="formData.source"
              :options="professions"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Category"
            name="categories"
          >
            <UInputMenu
              v-model="formData.ParadynamixCatagory"
              v-model:query="formData.ParadynamixCatagory"
              :options="categories"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Conferences"
            name="conferences"
          >
            <UInputMenu
              v-model="formData.SourceConfrence"
              v-model:query="formData.SourceConfrence"
              :options="conferences"
            />
          </UFormGroup>
        </div>
      </div>
  
      <div class="flex flex-row">
        <div class="basis-1/2 text-center underline font-semibold font-lg">
          Shipping Information
        </div>
        <div class="basis-1/2 text-center underline font-semibold font-lg">
          Billing Information
        </div>
      </div>
  
      <div class="flex flex-row space-x-5">
        <div class="basis-1/2 border-r border-black pr-5">
          <!-- Shipping Information -->
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Company 1"
                  name="company1"
                >
                  <UInput
                    v-model="formData.company1"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Company 2"
                  name="company2"
                >
                  <UInput
                    v-model="formData.company2"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Country"
                  name="country"
                >
                  <UInput
                    v-model="formData.country"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Address"
                  name="address"
                >
                  <UInput
                    v-model="formData.address"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="City"
                  name="city"
                >
                  <UInput
                    v-model="formData.city"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="State"
                  name="state"
                >
                  <UInputMenu
                    v-model="formData.state"
                    :options="usstates"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="Zip"
                  name="zip"
                >
                  <UInput
                    v-model="formData.zip"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Fax"
                  name="fax"
                >
                  <UInput
                    v-model="formData.fax"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Homephone"
                  name="homephone"
                >
                  <UInput
                    v-model="formData.homephone"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-6/12">
                <UFormGroup
                  label="Email"
                  name="email"
                >
                  <UInput
                    v-model="formData.email"
                    type="email"
                  />
                </UFormGroup>
              </div>
              <div class="basis-5/12">
                <UFormGroup
                  label="Workphone"
                  name="workphone"
                >
                  <UInput
                    v-model="formData.workphone"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/12">
                <UFormGroup
                  label="Ext"
                  name="ext"
                >
                  <UInput
                    v-model="formData.Extension"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Website"
                  name="website"
                >
                  <UInput
                    v-model="formData.website"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Cellphone"
                  name="cellphone"
                >
                  <UInput
                    v-model="formData.cellphone"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Comment"
                  name="comment"
                >
                  <UTextarea
                    v-model="formData.notes"
                    :rows="3"
                    type="text"
                  />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="basis-1/2"> 
          <!-- Billing Information -->
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Attn"
                  name="attn"
                >
                  <UInput
                    v-model="formData.attn"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Company1"
                  name="billcompany1"
                >
                  <UInput
                    v-model="formData.billcompany1"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Company2"
                  name="billcompany2"
                >
                  <UInput
                    v-model="formData.billcompany2"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Country"
                  name="country"
                >
                  <UInput
                    v-model="formData.billcountry"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Address"
                  name="address"
                >
                  <UInput
                    v-model="formData.billaddress"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="City"
                  name="billcity"
                >
                  <UInput
                    v-model="formData.billcity"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="State"
                  name="billstate"
                >
                  <UInputMenu
                    v-model="formData.billstate"
                    :options="usstates"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="Zip"
                  name="billzip"
                >
                  <UInput
                    v-model="formData.billzip"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Fax"
                  name="billfax"
                >
                  <UInput
                    v-model="formData.billfax"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Phone"
                  name="billphone"
                >
                  <UInput
                    v-model="formData.billphone"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Ext"
                  name="ExtensionBill"
                >
                  <UInput
                    v-model="formData.ExtensionBill"
                  />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="flex justify-start gap-3">
        <UButton 
          color="primary" 
          variant="outline"
          type="submit"
          :icon="selectedCustomer !== null ? 'i-heroicons-pencil-square': 'i-heroicons-plus'"
          :label="selectedCustomer !== null ? 'Modify Customer' : 'Add Customer'"
        />
        <UButton color="red" variant="outline"
          :label="!isModal ? 'Go back': 'Cancel'"
          @click="handleClose"
        />
      </div>
    </UForm>
    <template v-if="selectedCustomer !== null">
      <div class="flex gap-x-4">
        <div>
          <div class="px-4 py-2 gmsPurpleTitlebar mt-4">
            <h2>Serial Record</h2>
          </div>
          <div class="w-[180px] mt-4">
            <UButton label="View Serial Record" color="primary" variant="outline" icon="i-heroicons-eye" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}"/>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="px-4 py-2 gmsPurpleTitlebar mt-4">
            <h2>Create New</h2>
          </div>
          <div class="flex space-x-6 mt-4">
            <div class="w-[120px]">
              <UButton label="Label" color="green" variant="outline" icon="i-heroicons-tag" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}"/>
            </div>
            <div class="w-[120px]">
              <UButton label="Order" color="green" variant="outline" icon="i-heroicons-shopping-cart" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" @click="onOrderDetail()"/>
            </div>
            <div class="w-[120px]">
              <UButton label="Quote" color="green" variant="outline" icon="i-heroicons-currency-dollar" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" @click="onQuoteDetail()"/>
            </div>
            <div class="w-[140px]">
              <UButton label="Service Order" color="green" variant="outline" icon="i-heroicons-chat-bubble-left-ellipsis" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" @click="onServiceOrderDetail()"/>
            </div>
            <div class="w-[120px]">
              <UButton label="Site Visit" color="green" variant="outline" icon="i-heroicons-clipboard-document-list" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" @click="onSiteVisitDetail()"/>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Order Modal -->
    <UDashboardModal
      v-model="modalMeta.isOrderDetailModalOpen"
      title="Invoice"
      :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
      }"
    >
      <InvoiceDetail :selected-customer="selectedCustomer" @close="modalMeta.isOrderDetailModalOpen = false"/>
    </UDashboardModal>      
    <!-- Quote Modal -->
    <UDashboardModal
      v-model="modalMeta.isQuoteDetailModalOpen"
      title="Quote"
      :ui="{
        title: 'text-lg',
        header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'w-[1000px] sm:max-w-7xl'
      }"
    >
      <CustomersQuoteDetail :selected-customer="selectedCustomer"/>
    </UDashboardModal>
    <!-- Service Order Modal -->
    <UDashboardModal
      v-model="modalMeta.isServiceOrderDetailModalOpen"
      title="Service Order"
      :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
      }"
    >
      <ServiceOrderDetail :selected-customer="selectedCustomer" :form-action ="action" :selected-complaint="null" :selected-order="null" :selected-serial="null" />
    </UDashboardModal>
    <!-- Site Visit Modal -->
    <UDashboardModal
      v-model="modalMeta.isSiteVisitModalOpen"
      title="Site Visit"
      :ui="{
        title: 'text-lg',
        header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'w-[1800px] sm:max-w-9xl'
      }"
    >
      <CustomersSiteVisitDetail :selected-customer="selectedCustomer"/>
    </UDashboardModal>
  </template>
</template>
