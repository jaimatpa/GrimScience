<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';   
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedCustomer: {
      type: [Number, String, null],
      required: true
    },
    selectedOrder: {
      type: [Number, String, null]
    }
  })
  const serialColumns = ref([{
    key: 'serial',
    label: 'Serial',
  }])
  const orderColumns = ref([{
    key: 'order',
    label: 'Order'
  }, {
    key: 'UniqueID',
    label: '#'
  }])
  const invoiceColumns = ref([{
    key: 'orderdate',
    label: 'Date',
  }, {
    key: 'invoice', 
    label: 'Invoice#'
  }, {
    key: 'terms',
    label: 'Terms'
  }])
  const reportColumns = ref([{
    key: 'date',
    label: 'Date',
  }, {
    key: 'type', 
    label: 'Type'
  }, {
    key: 'by',
    label: 'By'
  }])
  const investigationColumns = ref([{
    key: 'date',
    label: 'Date',
  }, {
    key: 'description',
    label: 'Description'
  }
  ])
  const quotedColumns = ref([{
    key: 'productline',
    label: 'Product Line',
  }, {
    key: 'number',
    label: 'Number'
  }, {
    key: 'description',
    label: 'Description'
  }, {
    key: 'price',
    label: 'Price'
  }])
  const quotedQuantityColumns = ref([{
    key: 'quantity',
    label: 'Quantity',
  }, {
    key: 'number',
    label: 'Number'
  }, {
    key: 'description',
    label: 'Description'
  }, {
    key: 'price',
    label: 'Price'
  }])
  const loadingOverlay = ref(false)
  const formData = reactive({
    customerID: props.selectedCustomer,
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
  const quoteDate = ref(new Date())
  const estimatedBooking = ref(null)
  const estimatedShip = ref(null)
  const expirationDate = ref(new Date(quoteDate.value.getFullYear(), quoteDate.value.getMonth() + 1, quoteDate.value.getDate()));
  const orderers = ref([])
  const orderer = ref([])
  const statusGroup = ref([
    {value: 'open', label: 'Open'}, 
    {value: 'close', label: 'Close'}
  ])
  const selectedStatus = ref('open')
  const description = ref('Warm Tank fill valve not closing')
  const riskStatusGroup = ref([
    {value: 'no', label: 'No'}, 
    {value: 'yes', label: 'Yes'}
  ])
  const selectedRiskStatus = ref('no')
  const receivedDate = ref(null)
  const nc = ref(null)
  const accessories = ref(null)
  const service = ref(null)
  const serviceList = ref([])
  const failure = ref(null)

  const editInit = async () => {
    loadingOverlay.value = true
    // await useApiFetch(`/api/tbl/tblCustomers/${props.selectedOrder}`, {
    //   method: 'GET',
    //   onResponse({ response }) {
    //     if(response.status === 200) {
    //       loadingOverlay.value = false
    //       for (const key in response._data.body) {
    //         if (response._data.body[key] !== undefined) {
    //           formData[key] = response._data.body[key]
    //         }
    //       }
    //     }
    //   }
    // })
    await propertiesInit()
    loadingOverlay.value = false
  }

  const propertiesInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/tbl/tblCustomers/${props.selectedCustomer}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          loadingOverlay.value = false
          for (const key in response._data.body) {
            if (response._data.body[key]) {
              formData[key] = response._data.body[key]
            }
          }
        }
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

  async function onSubmit(event: FormSubmitEvent<any>) {
    emit('save', event.data)
    emit('close')
  }
  if(props.selectedOrder) 
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    @submit="onSubmit"
  >
    <div class="!my-0 flex flex-row">
      <div class="basis-2/5 border-2 border-slate-600 border-l-0 border-b-0">
        <div class="w-full bg-slate-400 px-3 py-1">
          Quote Information
        </div>
        <div class="flex flex-col p-3 space-y-2">
          <div class="flex flex-row">
             <div class="basis-1/2">
              <UFormGroup
                label="Quote #"
                name="quoteID"
              >
                <div>
                  2229
                </div>
              </UFormGroup>
             </div>
             <div class="basis-1/2">
                <div>
                  <UFormGroup
                    label="Quote Date(Invoice Date)"
                    name="quoteDate"
                  >
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="quoteDate &&format(quoteDate, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="quoteDate" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup
                    label="Expiration Date"
                    name="expirationDate"
                  >
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="expirationDate  && format(expirationDate, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="expirationDate" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
             </div>
          </div>
          <div>
            <UFormGroup
              label="Source"
              name="source"
            >
              <UInputMenu
                v-model="formData.source"
                v-model:query="formData.source"
                :options="[]"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup
              label="Source Description"
              name="sourceDescription"
            >
              <UInputMenu
                v-model="formData.sourcedescription"
                v-model:query="formData.sourcedescription"
                :options="[]"
              />
            </UFormGroup>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup
                label="Estimated Booking"
                name="bookingEst"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="estimatedBooking && format(estimatedBooking, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="estimatedBooking" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>  
            <div class="basis-1/2">
              <UFormGroup
                label="Estimated Ship"
                name="shipEst"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="estimatedShip && format(estimatedShip, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="estimatedShip" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>  
          </div>
        </div>
      </div>
      <div class="basis-3/5 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
        <div class="w-full bg-slate-400 px-3 py-1">
          Customer Informaton
        </div>
        <div class="flex flex-col p-3 space-y-2">
          <div>
            Customer# 3
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <div class="font-bold border-b-2 border-black">
                Shipping Information
              </div>
              <div class="flex flex-col mt-4 space-y-3">
                <div>
                  {{ formData.fname?formData.fname:'' }} {{ formData.lname?formData.lname:'' }}
                </div>
                <div>
                  {{ formData.company1?formData.company1:'' }}
                </div>
                <div>
                  {{ formData.company2?formData.company2:'' }}
                </div>
                <div>
                  {{ formData.address?formData.address:'' }}
                </div>
                <div>
                  {{ formData.city?formData.city:'' }} {{ formData.state?`, ${formData.state}`:'' }} {{ formData.zip?`, ${formData.zip}`:'' }}
                </div>
                <div class="flex flex-row">
                  <div class="basis-1/2">
                    {{ formData.homephone?`H: ${formData.homephone}`:'' }}
                  </div>
                  <div class="basis-1/2">
                    {{ formData.workphone?`W: ${formData.workphone}`:'' }}
                  </div>
                </div>
                <div>
                  {{ formData.cellphone?`C: ${formData.cellphone}`:'' }}
                </div>
              </div>
            </div>
            <div class="basis-1/2">
              <div class="font-bold border-b-2 border-black">
                Billing Information
              </div>
              <div class="flex flex-col mt-4 space-y-3">
                <div>
                  {{ '' }}
                </div>
                <div>
                  {{ formData.billcompany1?formData.billcompany1:'' }}
                </div>
                <div>
                  {{ formData.billcompany2?formData.billcompany2:'' }}
                </div>
                <div>
                  {{ formData.billaddress?formData.billaddress:'' }}
                </div>
                <div>
                  {{ formData.billcity?formData.billcity:'' }}  {{ formData.billstate?`, ${formData.billstate}`:'' }} {{formData.billzip?`,  ${formData.billzip}`:'' }}
                </div>
                <div>
                  {{ formData.billphone ? `P: ${formData.billphone}` : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full p-3 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
      <div class="flex flex-col">
        <div class="w-1/3">
          <UFormGroup
            label="Quote"
            name="quote"
          >
            <UInput 
            />
          </UFormGroup>
        </div>
        <div class="flex flex-row mt-2 space-x-4">
          <div class="basis-1/7 min-w-[200px]">
            <UFormGroup
              label="Status"
              name="status"
            >
              <USelect
                v-model="formData.ParadynamixCatagory"
                :options="[]"
              />
            </UFormGroup>
          </div>
          <div class="basis-6/7 w-full">
            <UFormGroup
              label="Notes"
              name="notes"
            >
              <USelect
                v-model="formData.ParadynamixCatagory"
                :options="[]"
              />
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
      Items Quoted
    </div>
    <div class="w-full p-3">
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between">
          <div class="flex flex-row space-x-3">
            <UFormGroup
              label="Product Line"
              name="productLine"
            >
              <USelect
                v-model="formData.ParadynamixCatagory"
                :options="[]"
              />
            </UFormGroup>
            <UFormGroup
              label="Categories"
              name="categories"
            >
              <UInput
                v-model="formData.ParadynamixCatagory"
              />
            </UFormGroup>          
          </div>
          <div class="flex justify-between items-center space-x-3">
            <div>
              Show Only Available  Inventory
            </div>
            <div>
              <UCheckbox name="fix"/>
            </div>
          </div>
        </div>
        <div>
          <UTable 
            :columns="quotedColumns"
            :rows="[]" 
            :ui="{
              wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
              th:{ 
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'p-1',
               }
            }"
          />
        </div>
        <div class="flex justify-between">
          <div class="flex flex-row space-x-3 items-center">
            <div>Qty</div>
            <UInput
              v-model="formData.ParadynamixCatagory"
            /> 
            <div>Serial</div>      
          </div>
          <div class="flex justify-between items-center space-x-3">
            <div>
              <UButton label="ADD" :ui="{base: 'min-w-[125px] justify-center'}"/>
            </div>
          </div>
        </div>
        <div>
          <UTable 
            :columns="quotedQuantityColumns"
            :rows="[]" 
            :ui="{
              wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
              th:{
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]', 
                padding: 'p-1' 
              }
            }"
          />
        </div>
        <div class="flex justify-between">
          <div>
            <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="flex flex-row space-x-3">
            <UButton icon="i-heroicons-printer" label="Print Folder Label" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
            <UButton icon="i-heroicons-chat-bubble-oval-left-ellipsis" label="Preview Report" color="green" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
            <UButton icon="i-heroicons-minus-circle" label="Remove" color="red" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
