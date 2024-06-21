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
  }, {
    key: 'serial',
    label: 'Serial Number'
  }])
  const loadingOverlay = ref(false)
  const customerData = reactive({
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
  const formData = reactive({
    source: null,
    sourceDescription: null,
    po: null,
    soldby: null,
    productLine: null,
    model: null,
    category: null,
    subcategory: null,
    stock: null,
    qty: null,
    serial: null,
    zone: null,
    installationDate: null,
    installationBy: null,
    invoiceDate: new Date(),
    shippedDate: new Date(),
    backOrder: null,
    itemsTotal: 0,
    lessdiscount: 0.0,
    lessdown: 0.0,
    tax: 0.0,
    mdet: null,
    cod: 0.0,
    shipping: 0.0,
    subtotal: 0.0,
    total: 0.0,
    terms: null,
    check: null,
    credit: null,
    newCustomerID: 0
  })
  const sourceCodes = ref([])
  const sourceOptions = ref([])
  const sourceDesriptionOptions = ref([])
  const soldByOptions = ref([])
  const productInfos = ref([])
  const productLineOptions = ref([])
  const categoryOptions = ref([])
  const subCategoryOptions = ref([])
  const quoteDate = ref(new Date())
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
          for (const key in response._data.body) {
            if (response._data.body[key]) {
              formData[key] = response._data.body[key]
            }
          }
        }
      }
    })
    await useApiFetch(`/api/customers/lastorderid`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          loadingOverlay.value = false
          formData.newCustomerID = response._data.body + 1
        }
      }
    })
    await useApiFetch(`/api/tbl/tblSourceCodes`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            sourceCodes.value = response._data.body;
            sourceOptions.value = sourceCodes.value.map((item) => item.source).sort();
            sourceOptions.value = sourceOptions.value.filter((item, index)=>sourceOptions.value.indexOf(item) === index && item != "" && item != null);
            sourceOptions.value.unshift(null);
          }else {
            sourceOptions.value = []
            sourceDesriptionOptions.value = []
          }
        }
      }
    })
    await useApiFetch(`/api/tbl/tblEmployee?ACTIVE=1`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            soldByOptions.value = response._data.body.map(item=>`#${item.payrollnumber||'n/a'} ${item.fname||''} ${item.lname||''}`);
            soldByOptions.value.unshift(null);
          }else soldByOptions.value = [];
        }
      }
    })
    await useApiFetch(`/api/product/productlines`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            productLineOptions.value = response._data?.body
            productLineOptions.value.unshift(null)
          }else productLineOptions.value = [];
        }
      }
    })
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: {
        productline: formData.productLine
      },
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            categoryOptions.value = response._data?.body
            categoryOptions.value.unshift(null)
          }else categoryOptions.value = [];
        }
      }
    })
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: {
        productline: formData.productLine,
        category: formData.category
      },
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            subCategoryOptions.value = response._data?.body
            subCategoryOptions.value.unshift(null)
          }else subCategoryOptions.value = [];
        }
      }
    })
    loadingOverlay.value = false
  }
  const onSourceItemChange = async (optionStr) => {
    sourceDesriptionOptions.value = sourceCodes.value
      .filter(item=>item.source === optionStr && item.source != "" && item.source != null)
      .map(item=>item.description);
  }
  const onProductLineChange= async () => {
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: {
        productline: formData.productLine
      },
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            categoryOptions.value = response._data?.body
            categoryOptions.value.unshift(null)
          }else categoryOptions.value = [];
        }
      }
    })
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: {
        productline: formData.productLine,
        category: formData.category
      },
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            subCategoryOptions.value = response._data?.body
            subCategoryOptions.value.unshift(null)
          }else subCategoryOptions.value = [];
        }
      }
    })
  }
  const onCategoryChange = async () => {
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: {
        productline: formData.productLine,
        category: formData.category
      },
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            subCategoryOptions.value = response._data?.body
            subCategoryOptions.value.unshift(null)
          }else subCategoryOptions.value = [];
        }
      }
    })
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
    <div class="flex flex-row">
      <div class="basis-4/6 border-2 border-slate-600 border-t-0 border-l-0 border-b-0 ">
        <div class="!my-0 flex flex-row">
          <div class="basis-2/5 border-2 border-slate-600 border-l-0 border-b-0">
            <div class="w-full bg-slate-400 px-3 py-1">
              Order Information
            </div>
            <div class="flex flex-col p-3 space-y-2">
              <div class="flex flex-row">
                 <div class="basis-1/2">
                  <UFormGroup
                    label="Order #"
                    name="orderID"
                  >
                    <div class="flex items-center">
                      {{ formData.newCustomerID }}
                    </div>
                  </UFormGroup>
                 </div>
                 <div class="basis-1/2">
                  <UFormGroup
                    label="Quote Date(Invoice Date)"
                    name="quoteDate"
                  >
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(quoteDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                      <template #panel="{ close }">
                        <DatePicker v-model="quoteDate" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                 </div>
              </div>
              <div>
                <UFormGroup
                  label="Source"
                  name="source"
                >
                  <USelect
                    v-model="formData.source"
                    :options="sourceOptions"
                    @change="onSourceItemChange"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup
                  label="Source Description"
                  name="sourceDescription"
                >
                  <USelect
                    v-model="formData.sourceDescription"
                    :options="sourceDesriptionOptions"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup
                  label="PO #"
                  name="po"
                >
                  <UInput
                    v-model="formData.po"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup
                  label="Sold By"
                  name="soldby"
                >
                  <USelect
                    v-model="formData.soldby"
                    :options="soldByOptions"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup
                  label="Quote #"
                  name="po"
                >
                  <UInputMenu
                    v-model="customerData.sourcedescription"
                    v-model:query="customerData.sourcedescription"
                    :options="[]"
                  />
                </UFormGroup>
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
                      {{ customerData.fname?customerData.fname:'' }} {{ customerData.lname?customerData.lname:'' }}
                    </div>
                    <div>
                      {{ customerData.company1?customerData.company1:'' }}
                    </div>
                    <div>
                      {{ customerData.company2?customerData.company2:'' }}
                    </div>
                    <div>
                      {{ customerData.address?customerData.address:'' }}
                    </div>
                    <div>
                      {{ customerData.city?customerData.city:'' }} {{ customerData.state?`, ${customerData.state}`:'' }} {{ customerData.zip?`, ${customerData.zip}`:'' }}
                    </div>
                    <div class="flex flex-row">
                      <div class="basis-1/2">
                        {{ customerData.homephone?`H: ${customerData.homephone}`:'' }}
                      </div>
                      <div class="basis-1/2">
                        {{ customerData.workphone?`W: ${customerData.workphone}`:'' }}
                      </div>
                    </div>
                    <div>
                      {{ customerData.cellphone?`C: ${customerData.cellphone}`:'' }}
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
                      {{ customerData.billcompany1?customerData.billcompany1:'' }}
                    </div>
                    <div>
                      {{ customerData.billcompany2?customerData.billcompany2:'' }}
                    </div>
                    <div>
                      {{ customerData.billaddress?customerData.billaddress:'' }}
                    </div>
                    <div>
                      {{ customerData.billcity?customerData.billcity:'' }}  {{ customerData.billstate?`, ${customerData.billstate}`:'' }} {{customerData.billzip?`,  ${customerData.billzip}`:'' }}
                    </div>
                    <div>
                      {{ customerData.billphone ? `P: ${customerData.billphone}` : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Items Ordered
        </div>
        <div class="w-full p-3">
          <div class="flex flex-col space-y-2">
            <div class="flex justify-end">
              <div class="flex justify-between items-center space-x-3">
                <div>
                  Show Only Available  Inventory
                </div>
                <div>
                  <UCheckbox name="fix"/>
                </div>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/5">
                <UFormGroup
                  label="Product Line"
                  name="productLine"
                >
                  <USelect
                    v-model="formData.productLine"
                    :options="productLineOptions"
                    @change="onProductLineChange"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup
                  label="Model#"
                  name="model"
                >
                  <UInput
                    v-model="customerData.market"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup
                  label="Category"
                  name="category"
                >
                  <USelect
                    v-model="formData.category"
                    :options="categoryOptions"
                    @change="onCategoryChange"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup
                  label="Sub-Category"
                  name="subCategory"
                >
                  <USelect
                    v-model="formData.subcategory"
                    :options="subCategoryOptions"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup
                  label="Stock#"
                  name="stock"
                >
                  <UInput
                    v-model="customerData.market"
                  />
                </UFormGroup>
              </div>
            </div>
            <div>
              <UTable 
                :columns="quotedColumns"
                :rows="[]" 
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    padding: 'p-1',
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  }
                }"
              />
            </div>
            <div class="flex flex-row space-x-3 items-center">
              <div>Qty:</div>
              <UInput
                v-model="customerData.ParadynamixCatagory"
              /> 
              <div class="ml-3">Serial</div>
              <UInput
                v-model="customerData.ParadynamixCatagory"
              />      
            </div>
            <div>
              <UTable 
                :columns="quotedQuantityColumns"
                :rows="[]" 
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  th:{ 
                    padding: 'p-1', 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]'
                  }
                }"
              />
            </div>
            <div class="w-full">
              <UFormGroup
                label="Special Instrutions(40 Characters MAX Each Line)"
                name="stock"
              >
                <div class="flex flex-row space-x-2 w-full">
                  <div class="basis-1/2">
                    <UInput
                      v-model="customerData.ParadynamixCatagory"
                    />   
                  </div>
                  <div class="basis-1/2">
                    <UInput
                      v-model="customerData.ParadynamixCatagory"
                    />   
                  </div>
                </div>
              </UFormGroup>
            </div>
            <div class="flex justify-end">
              <div class="flex flex-row space-x-3">
                <UButton label="Add" :ui="{base: 'min-w-[125px] justify-center'}"/>
                <UButton label="Remove" :ui="{base: 'min-w-[125px] justify-center '}"/>
                <UButton label="Update Price" :ui="{base: 'min-w-[125px] justify-center '}"/>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full p-3 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2">
                  <div class="flex flex-col space-y-1">
                    <UFormGroup
                      label="Method"
                      name="method"
                    >
                      <UInputMenu
                        v-model="customerData.market"
                        v-model:query="customerData.market"
                        :options="[]"
                      />
                    </UFormGroup>
                    <UFormGroup
                      label="FOB"
                      name="fob"
                    >
                      <UInputMenu
                        v-model="customerData.market"
                        v-model:query="customerData.market"
                        :options="[]"
                      />
                    </UFormGroup>
                  </div>
                </div>
                <div class="basis-1/2">
                  <div class="flex flex-col space-y-1">
                    <UFormGroup
                      label="Select Package"
                      name="package"
                    >
                      <UInputMenu
                        v-model="customerData.market"
                        v-model:query="customerData.market"
                        :options="[]"
                      />
                    </UFormGroup>
                    <div class="flex justify-between">
                      <div>
                        <UFormGroup
                          label="Zone"
                          name="zone"
                        >
                          <UInput
                            v-model="formData.zone"
                          />
                        </UFormGroup>
                      </div>
                      <div class="flex items-end">
                        <UButton label="Calculate" :ui="{base: 'justify-center'}"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Notes"
                name="notes"
              >
                <UTextarea
                  :rows="4"
                  v-model="customerData.notes"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-2/6 w-full">
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Order Information
        </div>
        <div class="flex flex-col space-y-4 w-full p-3">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup
                  label="Invoice#"
                  name="invoice"
                >
                  <div class="flex items-centers">
                    2268172
                  </div>
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Invoice Date"
                  name="invoiceDate"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.invoiceDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                    <template #panel="{ close }">
                      <DatePicker v-model="formData.invoiceDate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup
                  label="Installation Date"
                  name="installationDate"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(quoteDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                    <template #panel="{ close }">
                      <DatePicker v-model="quoteDate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Invoice Date"
                  name="invoiceDate"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.shippedDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                    <template #panel="{ close }">
                      <DatePicker v-model="formData.shippedDate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup
                  label="Installation By"
                  name="installationBy"
                >
                  <UInputMenu
                    v-model="customerData.market"
                    v-model:query="customerData.market"
                    :options="[]"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <div class="flex flex-row space-x-1">
                  <UFormGroup
                    label="Back Order"
                    name="backOrder"
                  >
                    <UInputMenu
                      v-model="formData.backOrder"
                      v-model:query="formData.backOrder"
                      :options="[]"
                    />
                  </UFormGroup>
                  <div class="flex items-end">
                    <UButton label="Calculate" :ui="{base: 'justify-center'}"/>
                  </div>
                </div> 
              </div>
            </div>
          </div>
          <UFormGroup
            label="Order Total"
          >
            <div class="flex flex-col space-y-2">
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Items Total
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.itemsTotal"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Less Discount
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.lessdiscount"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Less Down
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.lessdown"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  <div class="flex flex-row space-x-4 w-full">
                    <div class="basis-1/2">
                      Sales Tax
                    </div>
                    <div class="basis-1/2">
                      <div class="flex flex-row items-center space-x-1">
                        <div>
                          <UCheckbox name="tax"/>
                        </div>
                        <div>
                          (Exempt)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.tax"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  <div class="flex flex-row space-x-4 w-full">
                    <div class="basis-1/2">
                      MDET 2.3 %
                    </div>
                    <div class="basis-1/2">
                      <div class="flex flex-row items-center space-x-1">
                        <div>
                          <UCheckbox name="mdet"/>
                        </div>
                        <div>
                          (Apply)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.tax"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  COD
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.cod"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Shipping
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.shipping"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Subtotal
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.subtotal"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-center">
                  Total
                </div>
                <div class="basis-1/2">
                  <UInput
                    v-model="formData.total"
                  />
                </div>
              </div>
            </div>
          </UFormGroup>
          <div class="flex flex-row space-x-3">
            <UFormGroup 
              label="Terms"
            >
              <UInputMenu
                v-model="formData.terms"
                v-model:query="formData.terms"
                :options="[]"
              />
            </UFormGroup>
            <UFormGroup 
              label="Check #"
            >
              <UInput
                v-model="formData.check"
              />
            </UFormGroup>
          </div>
          <UFormGroup
            label="Credit Card"
          >
            <div class="flex flex-row space-x-2 w-full items-center">
              <div class="basis-1/2 w-full flex justify-center">
                <UButton label="Process Credit Card" :ui="{base: 'justify-center w-full'}"/>
              </div>
              <div class="basis-1/2">
                <div class="flex justify-between items-center">
                  <div class="basis-1/2">
                    Last 4 Digitals
                  </div>
                  <div class="basis-1/2">
                    <UInput
                      v-model="formData.credit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </UFormGroup>
          <div class="flex flex-row space-x-3 w-full">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-check-badge" label="Receive Checks" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
        </div>
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Printing Options
        </div>
        <div class="flex flex-col space-y-3 w-full p-3">
          <div class="w-full">
            <UButton icon="i-heroicons-eye" label="Preview Invoice" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-eye" label="Preview Receipt" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-eye" label="Preview Back Order" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-eye" label="Preview Label" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-arrow-path-rounded-square" label="Transfer to Quickbooks" color="purple" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
