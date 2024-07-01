<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';   
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedService: {
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
    key: 'category',
    label: 'Category',
  }, {
    key: 'sub',
    label: 'Sub'
  }, {
    key: 'stock#',
    label: 'Stock #'
  }, {
    key: 'description',
    label: 'Description'
  },
  ])
  const investigationColumns2 = ref([{
    key: 'qty',
    label: 'Qty',
  }, {
    key: 'stock',
    label: 'Stock #'
  }, {
    key: 'description',
    label: 'Description'
  },
  ])
  const loadingOverlay = ref(false)
  const formData = reactive({
    customerID: props.selectedService,
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
    HIREDATE: new Date()
  })
  const serials = ref([])
  const date = ref(new Date())
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
    // loadingOverlay.value = true
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
    // await propertiesInit()
    loadingOverlay.value = false
  }

  const propertiesInit = async () => {
    // loadingOverlay.value = true
    // await useApiFetch(`/api/tbl/tblCustomers/${props.selectedService}`, {
    //   method: 'GET',
    //   onResponse({ response }) {
    //     if(response.status === 200) {
    //       loadingOverlay.value = false
    //       for (const key in response._data.body) {
    //         if (response._data.body[key]) {
    //           formData[key] = response._data.body[key]
    //         }
    //       }
    //     }
    //   }
    // })
    // await useApiFetch(`/api/customers/serials/${props.selectedService}`, {
    //   method: 'GET',
    //   onResponse({ response }) {
    //     if(response.status === 200) {
    //       loadingOverlay.value = false
    //       serials.value = response._data.body
    //     }
    //   }
    // })
    
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
    <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
      Customer Information
    </div>

    <div class="!my-0 flex flex-row space-x-8 p-3">
      <div class="basis-1/2">
        <div class="flex justify-between">
          <div>
            Customer# {{ formData.number }}
          </div>
          <div>
            <UCheckbox name="fix" label="Fix Serial Record Mode" />
          </div>
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
      <div class="basis-1/2">
        <div class="flex flex-row space-x-1">
          <div class="basis-1/6">
            <UFormGroup
              label="Select Serial"
              name="serial"
            >
              <UTable
                :columns="serialColumns"
                :rows="serials"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup
              label="View Orders"
              name="orders"
            >
              <UTable
                :columns="orderColumns"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
          </div>
          <div class="basis-1/2">
            <div class="flex flex-col">
              <div>
                <UFormGroup
                  label="View Invoice"
                  name="invoice"
                >
                  <UTable
                    :columns="invoiceColumns"
                    :ui="{
                      wrapper: 'h-[100px] border-2 border-gray-300 dark:border-gray-700',
                      th:{ 
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-1' 
                      }
                    }"
                  >
                  <template #empty-state>
                    <div></div>
                  </template>
                  </UTable>
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 mt-1">
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="New" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="Link" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-minus-circle-20-solid" label="Unlink" variant="outline" color="red" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="mt-2">
          <div class="pl-3 bg-slate-400">
            Service Reports
          </div>
          <div class="flex flex-row p-3 bg-slate-200 space-x-4">
            <div class="basis-3/5">
              <UTable
                :columns="reportColumns"
                :ui="{
                  wrapper: 'h-24 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
              <div class="flex flex-row space-x-3 mt-3">
                <div class="basis-1/2">
                  <UButton 
                    icon="i-heroicons-plus-20-solid"
                    label="Create Service Report"
                    variant="outline"
                    color="green"
                    :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
                  />
                </div>
                <div class="basis-1/2">
                  <UButton 
                    icon="i-f7-rays"
                    label="Clear Selection"
                    variant="outline"
                    color="red"
                    :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
                  />
                </div>
              </div>
            </div>
            <div class="basis-2/5 space-y-1">
              <div>
                <UCheckbox name="warranty" label="Warranty Service" />
              </div>
              <div>
                This Warranty Cost: $0.00
              </div>
              <div>
                Total Serial Warranty: $2984.30
              </div>
              <div>
                Ship Date: 4/1/2007
              </div>
              <div>
                <div class="">
                  <UButton 
                    icon="i-heroicons-check-badge-20-solid"
                    label="View Inventory Transaction"
                    variant="outline"
                    :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-1">
          Warrenty Material
        </div>
        <div class="flex flex-row space-x-5 px-5 pt-5">
          <div class="w-1/2">
            <UFormGroup
              label="Select"
              name="select"
            >
              <USelect 
                v-model="service"
                :options="serviceList"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Select"
              name="select"
            >
              <USelect 
                v-model="service"
                :options="serviceList"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Input"
              name="failure"
            >
              <UInput 
                v-model="failure"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Input"
              name="failure"
            >
              <UInput 
                v-model="failure"
              />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full">
            <UFormGroup
              label=""
              name="investigation"
            >
              <UTable
                :columns="investigationColumns"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
              <span class="italic text-xs">Parts (Double Click to select)</span>
            </UFormGroup>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-4">
        </div>
        <div class="flex flex-row space-x-5 px-5 pt-10">
            <UButton 
                label="Remove Part"
                variant="solid"
                :ui="{base: 'w-fit', truncate: 'flex justify-center w-full'}" truncate
            />
        </div>
        
        <div class="flex flex-col space-x-5 p-5">

          <div class="w-full">
            <UFormGroup
              label=""
              name="investigation"
            >
              <UTable
                :columns="investigationColumns2"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>

              <div class="pt-2 flex justify-between">
                <UFormGroup label="Start Date" name="HIREDATE" class="flex items-center gap-x-2">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid"
                            :label="format(formData.HIREDATE, 'dd/MM/yyyy')" variant="outline"
                            :ui="{ base: 'w-fit', truncate: 'flex justify-center w-full' }" truncate />
                            <template #panel="{ close }">
                                    <CommonDatePicker v-model="formData.HIREDATE" is-required @close="close" />
                            </template>
                    </UPopover>
                </UFormGroup>


                <UFormGroup label="Shipping" name="AnnualSalary" class="flex items-center gap-x-2">
                    <UInput  placeholder="" />
                </UFormGroup>

                <div class="flex font-semibold items-center gap-x-2">
                    <span>Total</span>
                    <span>0.00</span>
                </div>
              </div>
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-1">
          Parts Received
        </div>
        <div class="flex flex-row space-x-5 px-5 pt-5">
          <div class="w-1/2">
            <UFormGroup
              label="Select"
              name="select"
            >
              <USelect 
                v-model="service"
                :options="serviceList"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Select"
              name="select"
            >
              <USelect 
                v-model="service"
                :options="serviceList"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Input"
              name="failure"
            >
              <UInput 
                v-model="failure"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Input"
              name="failure"
            >
              <UInput 
                v-model="failure"
              />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full">
            <UFormGroup
              label=""
              name="investigation"
            >
              <UTable
                :columns="investigationColumns"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
              <span class="italic text-xs">Parts (Double Click to select)</span>
            </UFormGroup>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-4">
        </div>
        <div class="flex flex-row space-x-5 px-5 pt-16 mt-3"></div>
        
        <div class="flex flex-col space-x-5 p-5">

          <div class="w-full">
            <UFormGroup
              label=""
              name="investigation"
            >
              <UTable
                :columns="investigationColumns2"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1' 
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
              <span class="italic text-xs">Singleclick to Select Part for Non-Confirmation(Double Click to view)</span>
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
