<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';


const people = [{
  name: 'Lindsay Walton',

}, {
  name: 'Lindsay Walton',

}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}]

const InventoryTransactions = [{
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',
}, {
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',

}, {
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',
}, {
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',
}, {
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',
}, {
  id: '5645',
  date: 5 / 5 / 12,
  Qty: '2',
}]

const orders = [{
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',
}, {
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',

}, {
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',
}, {
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',
}, {
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',
}, {
  po: 'PO54654',
  date: 5 / 5 / 12,
  ordered: '2',
  recieved: '54',
  Price: '',
  vender: 'dfkalsdf',
}]





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
      if (response.status === 200) {
        loadingOverlay.value = false
        customerExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
    onResponseError({ }) {
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
      if (response.status === 200) {
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
      if (response.status === 200) {
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
      if (response.status === 200) {
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
      if (response.status === 200) {
        professions.value = response._data.body;
      }
    },
    onResponseError() {
      professions.value = []
    }
  })
  await useApiFetch('/api/common/usstates', {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
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
  if (customersFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (props.selectedCustomer === null) { // Create Customer
    await useApiFetch('/api/customers', {
      method: 'POST',
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

if (props.selectedCustomer !== null)
  editInit()
else
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound :name="'Customer not found'" :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'" />
  </template>
  <template v-else>
    <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
      <div class="flex flex-row">
        <div class="basis-1/2 border-r-[3px] border-black">
          <div class="w-full px-3 py-1 gmsBlueTitlebar flex flex-row justify-between">
            <div>Part Lookup</div>
            <div class="bg-gms-gray-100">
              <UCheckbox label="Show ETL Critical Components" />
            </div>
          </div>
          <div class="w-full p-3 border-b-[3px] border-black">


            <div class="flex flex-col space-y-2">
              <div>
                <UTable :rows="orders" class="w-full" :ui="{
                  wrapper: 'h-[115px] overflow-y-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white',
                    padding: 'py-0'
                  },
                  td: {
                    base: 'h-[22px]',
                    padding: 'py-0'
                  }
                }" />
              </div>

              <div class="flex flex-row justify-between">
                <div>
                  <UButton color="green" variant="outline" label="Export Window to Excel"
                    icon="i-heroicons-document-text" />
                </div>

                <div>
                  <UFormGroup label="Quantity">
                    <div class="text-center text-bold">
                      0
                    </div>
                  </UFormGroup>
                </div>

                <div>
                  <UButton color="green" variant="outline" label="Export All Inventory"
                    icon="i-heroicons-arrow-right-start-on-rectangle" />
                </div>

              </div>

            </div>
          </div>


          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Part Information
          </div>
          <div class="flex flex-col p-3 space-y-2 border-b-[3px] border-black">
            <div class="flex flex-row justify-between">

              <div>
                <UCheckbox label="Job Subassembly" />
              </div>

              <div>
                <UCheckbox label="ETL Critical Component" />
              </div>

              <div>
                <UCheckbox label="Selling Price Override" />
              </div>

              <div>
                <UCheckbox label="Ignore Manufacturing Cost" />
              </div>

            </div>

            <div class="flex flex-row space-x-2">

              <div class="">
                <UFormGroup label="Category" name="fname">
                  <UInputMenu v-model="formData.fname" />
                </UFormGroup>
              </div>

              <div class="">
                <UFormGroup label="Sub Category">
                  <UInputMenu v-model="formData.lname" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="Stock Number" name="title">
                  <UInput v-model="formData.title" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="Inspection" name="position">
                  <UInputMenu v-model="formData.position" />
                </UFormGroup>
              </div>
            </div>

            <div class="flex flex-row space-x-2">
              <div class="basis-2/12">
                <UFormGroup label="Order Unit" name="market">
                  <UInputMenu v-model="formData.market" v-model:query="formData.market" :options="markets" />
                </UFormGroup>
              </div>
              <div class="basis-1/12">
                <UFormGroup label="Multiple" name="number">
                  <UInput v-model="formData.number" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-2/12">
                <UFormGroup label="Inventory Unit" name="profession">
                  <UInputMenu v-model="formData.source" v-model:query="formData.source" :options="professions" />
                </UFormGroup>
              </div>
              <div class="basis-3/12">
                <UFormGroup label="Account#" name="Account">
                  <UInputMenu v-model="formData.ParadynamixCatagory" v-model:query="formData.ParadynamixCatagory"
                    :options="categories" />
                </UFormGroup>
              </div>
              <div class="basis-4/12">
                <UFormGroup label="Description" name="Description">
                  <UInput v-model="formData.SourceConfrence" v-model:query="formData.SourceConfrence" />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="basis-2/12">
                <UFormGroup label="Order Cost" name="Order Cost">
                  <UInputMenu v-model="formData.market" v-model:query="formData.market" :options="markets" />
                </UFormGroup>
              </div>
              <div class="basis-2/12">
                <UFormGroup label="Inventory Cost" name="Inventory Cost">
                  <UInput v-model="formData.number" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-2/12">
                <UFormGroup label="Selling Price" name="Selling Price">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="basis-6/12">
                <UFormGroup label="Specification" name="Account">
                  <UInput />
                </UFormGroup>
              </div>

            </div>
            <div class="flex flex-row space-x-5">
              <div class="">
                <UFormGroup label="Drawing/Manual" name="Drawing/Mannul">
                  <UInput type="file" size="sm" icon="i-heroicons-folder" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="PDS" name="PDS">
                  <UInput type="file" size="sm" icon="i-heroicons-folder" />

                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="SDS" name="SDS">
                  <UInput type="file" size="sm" icon="i-heroicons-folder" />

                </UFormGroup>
              </div>


            </div>
          </div>


          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Primary Vendor
          </div>
          <div class="w-full p-3 flex flex-row space-x-3 border-b-[3px] border-black">

            <div class="basis-6/12 flex flex-col space-y-2">
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Manufacturer">
                  <UButton block label="Manufacturer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>

              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Dealer">
                  <UButton block label="Dealer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput />
                </UFormGroup>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput />
                </UFormGroup>
              </div>
            </div>

            <div class="basis-4/12 flex flex-col space-y-2">
              <div class="flex flex-row justify-around ms-6">
                <div>Qty</div>
                <div>Price</div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="mt-2">Min</div>
                <div class="flex flex-col space-y-2">
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                </div>
              </div>

            </div>

            <div class="basis-2/12">
              <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                <UInput />
              </UFormGroup>
            </div>








          </div>

          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Alternate Vendor
          </div>
          <div class="w-full p-3 flex flex-row space-x-3">

            <div class="basis-6/12 flex flex-col space-y-2">
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Manufacturer">
                  <UButton block label="Manufacturer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>

              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Dealer">
                  <UButton block label="Dealer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput />
                </UFormGroup>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput />
                </UFormGroup>
              </div>
            </div>

            <div class="basis-4/12 flex flex-col space-y-2">
              <div class="flex flex-row justify-around ms-6">
                <div>Qty</div>
                <div>Price</div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="mt-2">Min</div>
                <div class="flex flex-col space-y-2">
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                </div>
              </div>

            </div>

            <div class="basis-2/12">
              <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                <UInput />
              </UFormGroup>
            </div>








          </div>



        </div>

        <div class="basis-1/2">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Inventory
          </div>
          <div class="w-full flex flex-row p-3 space-x-3 border-b-[3px] border-black">
            <div class="basis-3/12">
              <div class="flex flex-col space-y-2">


                <div>
                  <UTable :rows="people" :ui="{
                    wrapper: 'h-[115px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'py-0 px-1'
                    },
                    checkbox: { padding: 'p-1 w-[10px]' }
                  }" />
                </div>

                <div>
                  <div class="space-y-2 mt-2">
                    <div class="flex items-center space-x-2">
                      <label>On Order</label>
                      <UInput class="flex-1 sm-field" />
                    </div>

                    <div class="flex items-center space-x-2">
                      <label>On Hand</label>
                      <UInput class="flex-1 sm-field" />
                    </div>

                    <div class="flex items-center space-x-2">
                      <label>Required</label>
                      <UInput class="flex-1 sm-field" />
                    </div>

                    <div class="flex items-center space-x-2">
                      <label>Available</label>
                      <UInput class="flex-1 sm-field" />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label>Minimum</label>
                      <UInput class="flex-1 sm-field" />
                    </div>
                  </div>
                </div>

                <div>
                  <UTable :rows="people" :ui="{
                    wrapper: 'h-[126px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'py-0 px-1'
                    },
                    checkbox: { padding: 'p-1 w-[10px]' }
                  }" />
                </div>

              </div>
            </div>


            <div class="w-5/12">
              <div class="flex flex-col space-y-2">

                <div>
                  <UTable :rows="orders" :ui="{
                    wrapper: 'h-[264px] overflow-y-auto border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'p-1'
                    },
                    checkbox: { padding: 'p-1 w-[10px]' }
                  }" />
                </div>

                <div class="flex flex-row space-x-3">
                  <div class="w-2/5">
                    <UTable :rows="people" :ui="{
                      wrapper: 'border-[1px] border-gray-400 dark:border-gray-700',
                      tr: {
                        active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                      },
                      th: {
                        padding: 'p-1',
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      },
                      td: {
                        padding: 'py-0 px-1'
                      },
                      checkbox: { padding: 'p-1 w-[10px]' }
                    }" />
                  </div>
                  <div class="w-3/5 h-full">
                    <UFormGroup label="Comments" name="Comments" class="">
                      <UTextarea :rows="6" />
                    </UFormGroup>
                  </div>

                </div>

              </div>

            </div>


            <div class="basis-4/12 flex flex-col space-y-2">
              <div>
                <UFormGroup label="Inventory Transations">
                  <UTable :rows="InventoryTransactions" :ui="{
                    wrapper: 'h-[364px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'p-1'
                    },
                    checkbox: { padding: 'p-1 w-[10px]' }
                  }" />
                </UFormGroup>
              </div>
              <div class="w-full">
                <UButton icon="i-heroicons-check-badge" label="View Inventory Transations" variant="outline"
                  :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" />
              </div>
            </div>

          </div>


          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Revision History
          </div>
          <div class="w-full flex flex-row p-3 space-x-3 border-b-[3px] border-black">
            <div class="basis-2/5 flex flex-col space-y-2">
              <div>
                <UButton label="Show Rev's" color="gms-blue" />
              </div>

              <div>
                <UTable :rows="people" :ui="{
                  wrapper: 'h-[115px] border-[1px] border-gray-400 dark:border-gray-700',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: {
                    padding: 'p-1',
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  },
                  td: {
                    padding: 'py-0 px-1'
                  },
                  checkbox: { padding: 'p-1 w-[10px]' }
                }" />
              </div>
            </div>


            <div class="basis-3/5 flex flex-col space-y-2">
              <div class="">
                <UFormGroup label="Revised By">
                  <UInputMenu v-model="formData.lname" disabled />
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-2">

                <div class="basis-1/4">
                  <UButton label="Add" color="gms-blue" block />
                </div>
                <div class="basis-1/4">
                  <UButton label="Modify" color="gms-blue" block />
                </div>
                <div class="basis-1/4">
                  <UButton label="Revision" color="gms-blue" block />
                </div>
                <div class="basis-1/4">
                  <UButton label="DELETE" color="BLACK" variant="outline" block />
                </div>
              </div>

              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/3">
                    <UButton label="Obsolete" color="red" variant="outline" icon="i-heroicons-minus-circle" block />
                  </div>
                  <div class="basis-1/3">
                    <UButton label="Active" variant="outline" icon="i-heroicons-check-badge" block />
                  </div>
                  <div class="basis-1/3">
                    <UButton label="Print Label" variant="outline" icon="i-heroicons-tag" block />
                  </div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/3">
                    <UButton label="Clear Form" color="red" variant="outline" icon="i-f7-rays" block />
                  </div>

                  <div class="basis-1/3"></div>
                  <div class="basis-1/3"></div>

                </div>

              </div>
            </div>
          </div>


          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Alternate Vendor
          </div>
          <div class="w-full p-3 flex flex-row space-x-3">

            <div class="basis-6/12 flex flex-col space-y-2">
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Manufacturer">
                  <UButton block label="Manufacturer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>

              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup name="Dealer">
                  <UButton block label="Dealer" color="gms-blue" />
                  <UInput />
                </UFormGroup>

                <UFormGroup label="Part Number" name="Part Number">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 items-end">
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput />
                </UFormGroup>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput />
                </UFormGroup>
              </div>
            </div>

            <div class="basis-4/12 flex flex-col space-y-2">
              <div class="flex flex-row justify-around ms-6">
                <div>Qty</div>
                <div>Price</div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="mt-2">Min</div>
                <div class="flex flex-col space-y-2">
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-row space-x-2">
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                    <UFormGroup>
                      <UInput />
                    </UFormGroup>
                  </div>
                </div>
              </div>

            </div>

            <div class="basis-2/12">
              <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                <UInput />
              </UFormGroup>
            </div>




          </div>
        </div>
      </div>















    </UForm>
  </template>
</template>
