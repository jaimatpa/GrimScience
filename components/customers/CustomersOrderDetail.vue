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
  
  const productColumns = ref([{
    key: 'PRODUCTLINE',
    label: 'Product Line',
  }, {
    key: 'UniqueID',
    label: 'Number'
  }, {
    key: 'DESCRIPTION',
    label: 'Description'
  }, {
    key: 'PRIMARYPRICE1',
    label: 'Price'
  }])
  const orderColumns = ref([{
    key: 'quantity',
    label: 'Quantity',
  }, {
    key: 'PRODUCTLINE',
    label: 'Product Line',
  }, {
    key: 'UniqueID',
    label: 'Number'
  }, {
    key: 'DESCRIPTION',
    label: 'Description'
  }, {
    key: 'PRIMARYPRICE1',
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
    customerid: null,
    orderdate: new Date(),
    orderid: null,
    shippingmethod: null,
    datepromised: '',
    specialinstructions1: '',
    specialinstructions2: '',
    invoicenumber: null,
    referredby: '',
    referphone1: '',
    referphone2: '',
    referphone3: '',
    terms: '',
    checknoorcreditcardinfo: '',
    purchaseordernumber: '',
    fob: '',
    source: null,
    sourcedescription: null,
    po: null,
    soldby: null,
    serial: null,
    method: null,
    package: null,
    Notes: null,
    zone: null,
    installationdate: new Date(),
    installationBy: null,
    invoicedate: new Date(),
    shipdate: new Date(),
    backOrder: null,
    subtotal: 0.0,
    total: 0.0,
    lessdiscount: 0.0,
    lessdown: 0.0,
    tax: 0.0,
    cod: 0.0,
    exempt: null,
    checking: null, 
    shipping: 0.0,
    authorization: null,
    TrackingNumbers: null,
    quotenumber: 0,
    weekstodelivery: '',
    laborcost: 0.0,
    materialcost: 0.0,
    warranty: '',
    acceptancedate: new Date(),
    expirationdate: new Date(),
    QuoteInvoiceNumber: null,
    Backorder: null,
    MDET: null,
    MDET1: null,
    Quote: null,
    QuoteOrderNumber: null,
    status: 'Open',
    estimatedbooking: null,
    estimatedship: null,
    complaintID: null,
    InstallationBy: null
  })
  const orderMeta = reactive({
    productLine: null,
    model: null,
    category: null,
    subcategory: null,
    stock: null,
  })
  const sourceCodes = ref([])
  const sourceOptions = ref([])
  const sourcedescriptionOptions = ref([])
  const soldByOptions = ref([])
  const productLineOptions = ref([])
  const categoryOptions = ref([])
  const subCategoryOptions = ref([])
  const methodOptions = ref([])
  const packageOptions = ref([])
  const fobOptions = ref([])
  const productList = ref([])
  const selectedProduct = ref({})
  const selectedProducts = ref([])
  const orderList = ref([])
  const selectedOrder = ref({})
  const selectedOrders = ref([])
  const qty = ref(null)
  const itemsTotal = ref(0)
  const quoteDate = ref(new Date())

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
              customerData[key] = response._data.body[key]
            }
          }
        }
      }
    })
    await useApiFetch(`/api/customers/lastorderid`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          formData.customerid = response._data.body + 1
          loadingOverlay.value = false
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
            sourcedescriptionOptions.value = []
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
    await useApiFetch(`/api/shipping/methods`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data?.body?.length){
            methodOptions.value = response._data?.body
            methodOptions.value.unshift(null)
          }else methodOptions.value = [];
        }
      }
    })
    loadingOverlay.value = false
  }
  const fetchProductList = async () => {
    await useApiFetch(`/api/product/productinfos`, {
      method: 'GET',
      params: {
        productline: orderMeta.productLine,
        category: orderMeta.category,
        subcategory: orderMeta.subcategory,
        model: orderMeta.model,
        stock: orderMeta.stock
      },
      onResponse({ response }) {
        if(response.status === 200) {
          productList.value = response._data.body
        }
      }
    })
  }
  const onSourceItemChange = async (optionStr) => {
    sourcedescriptionOptions.value = sourceCodes.value
      .filter(item=>item.source === optionStr && item.source != "" && item.source != null)
      .map(item=>item.description);
    sourcedescriptionOptions.value.unshift(null)
  }
  const onProductLineChange= async () => {
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: {
        productline: orderMeta.productLine
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
        productline: orderMeta.productLine,
        category: orderMeta.category
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
    fetchProductList()
  }
  const onCategoryChange = async () => {
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: {
        productline: orderMeta.productLine,
        category: orderMeta.category
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
    fetchProductList()
  }
  const onProductSelect = (row) => {
    selectedProduct.value = row
    const productListIndex = productList.value.findIndex((product) => product.UniqueID === row.UniqueID)
    // Double Select
    // const index = selectedProducts.value.findIndex((product) => product.UniqueID === row.UniqueID)
    // if(index === -1) {
    //   selectedProducts.value.push(row)
    //   const updatedProduct = {...productList.value[productListIndex], class: 'bg-gray-200'}
    //   productList.value.splice(productListIndex, 1, updatedProduct)
    // } else {
    //   let updatedProduct = {}
    //   Object.keys(productList.value[productListIndex]).forEach(key => {
    //     if (key !== 'class') {
    //       updatedProduct[key] = productList.value[productListIndex][key]
    //     }
    //   });
    //   selectedProducts.value.splice(index, 1)
    //   productList.value.splice(productListIndex, 1, updatedProduct)
    // }

    // let updatedProduct = {};
    // productList.value.forEach((product, index) => {
    //   console.log(product, index, (product.UniqueID === row.UniqueID), product.hasOwnProperty('class'))
    //   if((product.UniqueID === row.UniqueID) && !product.class) {
    //     updatedProduct = {...product, class: 'bg-gray-50'}
    //     productList.value[index] = updatedProduct
    //   } else {
    //     Object.keys(product).forEach(key => {
    //       if (key !== 'class') {
    //         updatedProduct[key] = product[key]
    //       }
    //     });
    //     productList.value[index] = updatedProduct
    //   }
    // })
  }
  const onOrderSelect = (row) => {
    selectedOrder.value = row
    const index = selectedOrders.value.findIndex((order) => order.UniqueID === row.UniqueID)
    const orderListIndex = orderList.value.findIndex((order) => order.UniqueID === row.UniqueID)
    if(index === -1) {
      selectedOrders.value.push(row)
      const updatedOrder = {...orderList.value[orderListIndex], class: 'bg-gray-200'}
      orderList.value.splice(orderListIndex, 1, updatedOrder)
    } else {
      let updatedOrder = {}
      Object.keys(orderList.value[orderListIndex]).forEach(key => {
        if (key !== 'class') {
          updatedOrder[key] = orderList.value[orderListIndex][key]
        }
      });
      selectedOrders.value.splice(index, 1)
      orderList.value.splice(orderListIndex, 1, updatedOrder)
    }
  }
  const handleAddBtnClick =  () => {
    // if(selectedProducts.value.length && qty.value) {
    //   selectedProducts.value.forEach((product) => {
    //     const newOrder = {
    //       quantity: qty.value,
    //       ...product,
    //     }
    //     selectedOrders.value.push(newOrder)
    //     orderList.value.push(newOrder)
    //   })
    //   itemsTotal.value = 0.0
    //   orderList.value.forEach((order) => {
    //     itemsTotal.value += (order?.quantity??0 as number) * (order?.PRIMARYPRICE1??0 as number)
    //   }) 
    // }
    if(selectedProduct.value && qty.value) {
        const newOrder = {
          quantity: qty.value,
          ...selectedProduct.value,
        }
        selectedOrders.value.push(newOrder)
        orderList.value.push(newOrder)
    }
  }
  const onCalculateInvoiceValues = () => {
    itemsTotal.value = 0.0
    orderList.value.forEach((order) => {
      itemsTotal.value += (order?.quantity??0 as number) * (order?.PRIMARYPRICE1??0 as number)
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
      <div class="basis-4/6 border-[1px] border-slate-600 border-t-0 border-l-0 border-b-0">
        <div class="!my-0 flex flex-row">
          <div class="basis-2/5">
            <div class="w-full bg-slate-400 px-3 py-1">
              Order Information
            </div>
            <div class="flex flex-col p-3 pr-6 space-y-2">
              <div class="flex flex-row">
                 <div class="basis-1/2">
                  <UFormGroup
                    label="Order#"
                    name="orderID"
                  >
                    <div class="flex items-center min-h-[32px]">
                      {{ formData.customerid }}
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

              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Source
                </div>
                <div class="flex-1 pl-4">
                  <USelect
                    v-model="formData.source"
                    :options="sourceOptions"
                    @change="onSourceItemChange"
                  />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Source Description
                </div>
                <div class="flex-1 pl-4">
                  <USelect
                    v-model="formData.sourcedescription"
                    :options="sourcedescriptionOptions"
                  />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  PO#
                </div>
                <div class="flex-1 pl-4">
                  <UInput
                    v-model="formData.po"
                  />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Sold By
                </div>
                <div class="flex-1 pl-4">
                  <USelect
                    v-model="formData.soldby"
                    :options="soldByOptions"
                  />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Quote#
                </div>
                <div class="flex-1 pl-4">
                  <UInputMenu
                    v-model="customerData.sourcedescription"
                    v-model:query="customerData.sourcedescription"
                    :options="[]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="basis-3/5 border-[1px] border-slate-600 border-b-0 border-r-0 border-t-0">
            <div class="w-full bg-slate-400 px-3 py-1">
              Customer Informaton
            </div>
            <div class="flex flex-col py-3 px-6 space-y-2">
              <div>
                Customer# {{ customerData.number?customerData.number:'' }}
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-1/2">
                  <div class="font-bold border-b-[1px] border-black">
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
                  <div class="font-bold border-b-[1px] border-black">
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
        <div class="w-full px-3 py-1 bg-slate-400">
          Items Ordered
        </div>
        <div class="w-full p-3 pr-8">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row justify-between">
              <div class="flex flex-1 flex-row space-x-3">
                <div class="basis-1/5">
                  <UFormGroup
                    label="Product Line"
                    name="productLine"
                  >
                    <USelect
                      v-model="orderMeta.productLine"
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
                      v-model="orderMeta.model"
                    />
                  </UFormGroup>
                </div>
                <div class="basis-1/5">
                  <UFormGroup
                    label="Category"
                    name="category"
                  >
                    <USelect
                      v-model="orderMeta.category"
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
                      v-model="orderMeta.subcategory"
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
                      v-model="orderMeta.stock"
                    />
                  </UFormGroup>
                </div>
  
              </div>
              <div class="flex pl-10">
                <div class="flex justify-between items-center space-x-3">
                  <div>
                    Show Only Available  Inventory
                  </div>
                  <div>
                    <UCheckbox name="fix"/>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <UTable 
                :columns="productColumns"
                :rows="productList" 
                :ui="{
                  wrapper: 'h-32 border-[1px] border-gray-400 dark:border-gray-700',
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
                  checkbox: {padding: 'p-1 w-[10px]'}
                }"
                @select="onProductSelect"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex flex-row items-end">
              <div class="flex-1">
                <div class="flex flex-row space-x-6 items-center pt-4">
                  <div class="flex flex-row space-x-3">
                    <div class="flex items-center">Qty:</div>
                    <div class="w-[80px]">
                      <UInput
                        v-model="qty"
                      /> 
                    </div>
                  </div>
                  <div class="flex flex-row space-x-3">
                    <div class="flex items-center">Serial:</div>
                    <div class="min-w-[150px]">
                      <USelect
                        v-model="formData.serial"
                        :options="[]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-row space-x-3 ml-4">
                <UButton label="Add" :ui="{base: 'min-w-[125px] justify-center'}" @click="handleAddBtnClick"/>
                <UButton label="Remove" :ui="{base: 'min-w-[125px] justify-center '}"/>
                <UButton label="Update Price" :ui="{base: 'min-w-[125px] justify-center '}"/>
              </div>
            </div>
            <div>
              <UTable 
                :columns="orderColumns"
                :rows="orderList" 
                :ui="{
                  wrapper: 'h-32 border-[1px] border-gray-400 dark:border-gray-700',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th:{ 
                    padding: 'p-1', 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]'
                  },
                  td: {
                    padding: 'p-1'
                  },
                  checkbox: {padding: 'p-1 w-[10px]'}
                }"
                @select="onOrderSelect"
              >
               <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex flex-row justify-between items-end pt-4">
              <div class="flex-1">              
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
            </div>
          </div>
        </div>
        <div class="w-full p-3 border-[1px] border-slate-600 border-l-0 border-b-0 border-r-0 mt-4">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <div class="flex flex-row space-x-3">
                <div class="basis-7/12 flex flex-row space-x-3">
                  <div class="basis-1/5">
                    <UFormGroup
                      label="Zone"
                      name="zone"
                    >
                      <UInput
                        v-model="formData.zone"
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-4/5">
                    <UFormGroup
                      label="Select Package"
                      name="package"
                    >
                      <USelect
                        v-model="formData.package"
                        v-model:query="formData.package"
                        :options="[]"
                      />
                    </UFormGroup>
                  </div>
                </div>
                <div class="basis-5/12 w-full">
                  <UFormGroup
                    label="Method"
                    name="method"
                  >
                    <USelect
                      v-model="formData.method"
                      v-model:query="formData.method"
                      :options="methodOptions"
                    />
                  </UFormGroup>
                </div>
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-7/12 flex items-end justify-end">
                  <div class="">
                    <UButton label="Calculate" :ui="{base: 'justify-center'}"/>
                  </div>
                </div>
                <div class="basis-5/12">
                  <UFormGroup
                    label="FOB"
                    name="fob"
                  >
                    <USelect
                      v-model="formData.fob"
                      v-model:query="formData.fob"
                      :options="[]"
                    />
                  </UFormGroup>
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
        <div class="w-full px-3 py-1 bg-slate-400">
          Order Information
        </div>
        <div class="flex flex-col space-y-4 w-full p-3 pl-8">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup
                  label="Invoice#"
                  name="invoice"
                >
                  <div class="flex items-center min-h-[32px]">
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
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.invoicedate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                    <template #panel="{ close }">
                      <DatePicker v-model="formData.invoicedate" is-required @close="close" />
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
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.shipdate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                    <template #panel="{ close }">
                      <DatePicker v-model="formData.shipdate" is-required @close="close" />
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
                  <USelect
                    v-model="customerData.market"
                    v-model:query="customerData.market"
                    :options="[]"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <div class="flex flex-row space-x-1">
                  <div class="flex-1">
                    <UFormGroup
                      label="Back Order"
                      name="backOrder"
                    >
                      <USelect
                        v-model="formData.backOrder"
                        v-model:query="formData.backOrder"
                        :options="[]"
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
                    v-model="itemsTotal"
                    disabled
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
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
                    :ui="{
                      base: 'text-right'
                    }"
                  />
                </div>
              </div>
            </div>
          </UFormGroup>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup 
                label="Terms"
              >
                <UInputMenu
                  v-model="formData.terms"
                  v-model:query="formData.terms"
                  :options="[]"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup 
                label="Check #"
              >
                <UInput
                  v-model="formData.checking"
                />
              </UFormGroup>
            </div>
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
                      v-model="formData.checknoorcreditcardinfo"
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
        <div class="w-full px-3 py-1 bg-slate-400">
          Printing Options
        </div>
        <div class="flex flex-col space-y-3 w-full p-3 pl-6">
          <div class="flex flex-row space-x-4">
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Invoice" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Receipt" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
          <div class="flex flex-row space-x-4">
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Back Order" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Label" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-arrow-path-rounded-square" label="Transfer to Quickbooks" color="purple" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
