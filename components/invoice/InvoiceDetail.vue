<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import { format } from 'date-fns'
import { vMaska } from 'maska/vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedCustomer: {
    type: [Number, String, null],
    required: true
  },
  selectedOrder: {
    type: [Number, String, null]
  },
  selectedComplaint: {
    type: [Number, String, null]
  }
})

const toast = useToast()
const config = useRuntimeConfig()

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
  key: 'bpid',
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
  customerid: props.selectedCustomer,
  orderdate: new Date(),
  orderid: props?.selectedOrder ?? null,
  shippingmethod: null,
  datepromised: '',
  specialinstructions1: '',
  specialinstructions2: '',
  invoicenumber: props?.selectedOrder ?? null,
  referredby: null,
  referphone1: null,
  referphone2: null,
  referphone3: null,
  terms: '',
  checknoorcreditcardinfo: '',
  purchaseordernumber: '',
  fob: '',
  source: null,
  sourcedescription: null,
  soldby: null,
  serial: null,
  Notes: null,
  zone: null,
  package: null,
  invoicedate: new Date(),
  shipdate: null,
  subtotal: 0.0,
  total: 0.0,
  lessdiscount: '0.0',
  lessdown: '0.0',
  tax: '0.0',
  cod: '0.0',
  exempt: null,
  checking: null,
  shipping: '0.0',
  authorization: null,
  TrackingNumbers: null,
  quotenumber: 0,
  weekstodelivery: '',
  laborcost: null,
  materialcost: null,
  warranty: '',
  acceptancedate: null,
  expirationdate: null,
  QuoteInvoiceNumber: null,
  Backorder: null,
  MDET: null,
  MDET1: null,
  Quote: null,
  QuoteOrderNumber: null,
  status: 'Open',
  estimatedbooking: null,
  estimatedship: null,
  complaintID: props.selectedComplaint ?? null,
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
const methodOptions = ref(["UPS Ground", "UPS 2nd Day", "UPS Next Day", "Priority Mail",
  "USPS Mail", "Field Service", "Deliver", "Pick Up", "Freight", "On-Site"])
const fobOptions = ref([null, 'Marietta, OH', 'PAW PAW, MI'])
const installationByOptions = ref([])
const backOrderOptions = ref([null, "Yes", "No"])
const termOptions = ref(["Prepaid", "Check", "Money Order", "Visa", "Master Card",
  "Discover", "American Express", "Net 30", "50% Down Net 30", "COD",
  "Capped Rental", "Loan/Gift", "Warranty", "Warranty Replacement"])
const productList = ref([])
const selectedProduct = ref(null)
const orderList = ref([])
const selectedOrder = ref(null)
const qty = ref(1)
const itemsTotal = ref(0)
const qtyStyle = ref('outline-none')
const lessdiscountStyle = ref('outline-none')
const lessdownStyle = ref('outline-none')
const taxStyle = ref('outline-none')
const mdetStyle = ref('outline-none')
const codStyle = ref('outline-none')
const shippingStyle = ref('outline-none')
const checkingStyle = ref('outline-none')
const checknoStyle = ref('outline-none')
const cardnumberStyle = ref('outline-none')
const expirationmonthStyle = ref('outline-none')
const expirationyearStyle = ref('outline-none')
const ccvStyle = ref('outline-none')
const creditCardMeta = ref({
  cardnumber: '',
  expirationmonth: null,
  expirationyear: null,
  ccv: null,
  amount: 0
})
const modalMeta = ref({
  isUpdatePriceModalOpen: false,
  isInventoryTransactionModalOpen: false,
  isCreditCardInfoInputModalOpen: false,
  isCreditCardAmountInputModalOpen: false
})
const updatedPrice = ref(null)
const mdetChecked = ref(false)
const processCreditCardSuccess = ref(false)

  const editInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/invoices/${props.selectedOrder}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          for (const key in response._data.body) {
            if (response._data.body[key] !== undefined && response._data.body[key] !== ' ') {
              formData[key] = response._data.body[key]
            }
          }
        }
      }
    })
    await useApiFetch(`/api/tbl/tblSourceCodes?source=${formData.source}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          sourcedescriptionOptions.value = response._data.body.map((item) => item.description)
        }
      }
    })
    await useApiFetch(`/api/invoices/detail/`, {
      method: 'GET',
      params: {
        orderid: props.selectedOrder
      },
      onResponse({ response }) {
        if(response.status === 200) {
          for (let i = 0; i < response._data.body.length; i++) {
            let item = response._data.body[i];
            const newOrder = {
              UniqueID: item.UniqueID,
              bpid: item.bpid,
              quantity: item.quantity,
              DESCRIPTION: item.name,
              PRIMARYPRICE1: item.price,
              serial: item.serial
            }
            orderList.value.push(newOrder)
          }
        }
      }
    })
    await propertiesInit()
  }
  const propertiesInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/customers/${props.selectedCustomer ? props.selectedCustomer : formData.customerid}`, {
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
    !props.selectedOrder &&
    await useApiFetch(`/api/invoices/lastorderid`, {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          formData.orderid = response._data.body + 1
          formData.invoicenumber = response._data.body + 1
        }
      }
    })
  loadingOverlay.value = false
  await useApiFetch(`/api/tbl/tblSourceCodes`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          sourceCodes.value = response._data.body;
          sourceOptions.value = sourceCodes.value.map((item) => item.source).sort();
          sourceOptions.value = sourceOptions.value.filter((item, index) => sourceOptions.value.indexOf(item) === index && item != "" && item != null);
          sourceOptions.value.unshift(null);
        } else {
          sourceOptions.value = []
          sourcedescriptionOptions.value = []
        }
      }
    }
  })
  await useApiFetch(`/api/tbl/tblEmployee?ACTIVE=1`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          soldByOptions.value = response._data.body.map(item => `#${item.payrollnumber || 'n/a'} ${item.fname || ''} ${item.lname || ''}`);
          soldByOptions.value.unshift(null);
          installationByOptions.value = response._data.body.filter(item => [1, 65, 62, 18, 44].includes(item.UniqueID))
          installationByOptions.value = installationByOptions.value.map(item => `#${item.payrollnumber || 'n/a'} ${item.fname || ''} ${item.lname || ''}`).sort()
          installationByOptions.value.unshift(null)
        } else soldByOptions.value = [];
      }
    }
  })
  await useApiFetch(`/api/materials/productlines`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          productLineOptions.value = response._data?.body
          productLineOptions.value.unshift(null)
        } else productLineOptions.value = [];
      }
    }
  })
  loadingOverlay.value = false
}
const fetchProductList = async () => {
  await useApiFetch(`/api/materials/products`, {
    method: 'GET',
    params: {
      productline: orderMeta.productLine,
      category: orderMeta.category,
      subcategory: orderMeta.subcategory,
      model: orderMeta.model,
      stock: orderMeta.stock
    },
    onResponse({ response }) {
      if (response.status === 200) {
        productList.value = response._data.body
      }
    }
  })
}
const onSourceItemChange = async (optionStr) => {
  sourcedescriptionOptions.value = sourceCodes.value
    .filter(item => item.source === optionStr && item.source != "" && item.source != null)
    .map(item => item.description);
  sourcedescriptionOptions.value.unshift(null)
}
const onProductLineChange = async () => {
  await useApiFetch(`/api/materials/categories`, {
    method: 'GET',
    params: {
      productline: orderMeta.productLine
    },
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          categoryOptions.value = response._data?.body
          categoryOptions.value.unshift(null)
        } else categoryOptions.value = [];
      }
    }
  })
  await useApiFetch(`/api/materials/subcategories`, {
    method: 'GET',
    params: {
      productline: orderMeta.productLine,
      category: orderMeta.category
    },
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          subCategoryOptions.value = response._data?.body
          subCategoryOptions.value.unshift(null)
        } else subCategoryOptions.value = [];
      }
    }
  })
  fetchProductList()
}
const onCategoryChange = async () => {
  await useApiFetch(`/api/materials/subcategories`, {
    method: 'GET',
    params: {
      productline: orderMeta.productLine,
      category: orderMeta.category
    },
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data?.body?.length) {
          subCategoryOptions.value = response._data?.body
          subCategoryOptions.value.unshift(null)
        } else subCategoryOptions.value = [];
      }
    }
  })
  fetchProductList()
}
const onProductSelect = (row) => {
  if (JSON.stringify({ ...selectedProduct.value, class: "" }) === JSON.stringify({ ...row, class: "" })) selectedProduct.value = null;
  else {
    selectedProduct.value = { ...row, class: "" }
  }

  productList.value.forEach((product) => {
    if (product.UniqueID === row.UniqueID && row.class != 'bg-gray-200') {
      product.class = 'bg-gray-200'
    } else {
      delete product.class
    }
  })
}
const onOrderSelect = (row) => {
  if (selectedOrder.value == row) selectedOrder.value = null;
  else selectedOrder.value = row

  orderList.value.forEach((order) => {
    if (order.UniqueID === row.UniqueID && order.created === row.created && row.class != 'bg-gray-200') {
      order.class = 'bg-gray-200'
    } else {
      delete order.class
    }
  })
}
const handleAddBtnClick = () => {
  if (qty.value < 1 || !Number.isInteger(qty.value)) {
    qtyStyle.value = 'outline outline-2 outline-[red]'
    return;
  } else qtyStyle.value = 'outline-none'
  if (selectedProduct.value && qty.value) {
    const newOrder = {
      ...selectedProduct.value,
      UniqueID: null,
      bpid: selectedProduct.value.UniqueID,
      quantity: qty.value,
      created: new Date().getTime()
    }
    orderList.value.push(newOrder)
  }
  onCalculateInvoiceValues()
}
const handleRemoveBtnClick = async () => {
  if (selectedOrder.value) {
    const index = orderList.value.findIndex((order) => order.UniqueID === selectedOrder.value.UniqueID && order.created === selectedOrder.value.created)
    if (index > -1) {
      orderList.value.splice(index, 1)
      if (selectedOrder?.value?.UniqueID ?? null !== null) {
        await useApiFetch(`/api/invoices/detail/${selectedOrder.value.UniqueID}`, {
          method: 'DELETE',
          onResponse() {
          },
          onResponseError() {
          }
        })
      }
      selectedOrder.value = null
    }
  }
  onCalculateInvoiceValues()
}
const handleUpdateBtnClick = () => {
  if (selectedOrder.value) {
    modalMeta.value.isUpdatePriceModalOpen = true
    updatedPrice.value = selectedOrder.value.PRIMARYPRICE1
  }
  onCalculateInvoiceValues()
}
const handleReceiveChecksBtnClick = () => {
  modalMeta.value.isInventoryTransactionModalOpen = true
}
const onUpdatePrice = () => {
  selectedOrder.value.PRIMARYPRICE1 = updatedPrice.value
  const index = orderList.value.findIndex((item) => item.UniqueID === selectedOrder.value.UniqueID && item.created === selectedOrder.value.created)
  orderList.value.splice(index, 1, { ...orderList.value[index], PRIMARYPRICE1: updatedPrice.value })
  onCalculateInvoiceValues()
  modalMeta.value.isUpdatePriceModalOpen = false
}
const onCalculateInvoiceValues = () => {
  let flag = 1;
  if (!orderList.value.length) flag = 0;
  if (Number(formData.lessdiscount) < 0) {
    flag = 0
    lessdiscountStyle.value = 'outline outline-2 outline-[red]'
  } else lessdiscountStyle.value = 'outline-none'
  if (Number(formData.lessdown) < 0) {
    console.log(Number(formData.lessdown))
    flag = 0
    lessdownStyle.value = 'outline outline-2 outline-[red]'
  } else lessdownStyle.value = 'outline-none'
  if (Number(formData.tax) < 0) {
    flag = 0
    taxStyle.value = 'outline outline-2 outline-[red]'
  } else taxStyle.value = 'outline-none'
  if (Number(formData.MDET) < 0) {
    flag = 0
    mdetStyle.value = 'outline outline-2 outline-[red]'
  } else mdetStyle.value = 'outline-none'
  if (Number(formData.cod) < 0) {
    flag = 0
    codStyle.value = 'outline outline-2 outline-[red]'
  } else codStyle.value = 'outline-none'
  if (Number(formData.shipping) < 0) {
    flag = 0
    shippingStyle.value = 'outline outline-2 outline-[red]'
  } else shippingStyle.value = 'outline-none'

  formData.lessdiscount = Number(formData.lessdiscount).toFixed(2)
  formData.lessdown = Number(formData.lessdown).toFixed(2)
  formData.tax = Number(formData.tax).toFixed(2)
  formData.MDET = Number(formData.MDET).toFixed(2)
  formData.cod = Number(formData.cod).toFixed(2)
  formData.shipping = Number(formData.shipping).toFixed(2)
  itemsTotal.value = 0.0
  orderList.value.forEach((order) => {
    itemsTotal.value += (order?.quantity ?? 0 as number) * (order?.PRIMARYPRICE1 ?? 0 as number)
  })

  formData.subtotal = Number(itemsTotal.value) - Number(formData.lessdiscount) - Number(formData.lessdown) + Number(formData.shipping)
  formData.total = Number(formData.subtotal) + (mdetChecked.value ? Number(formData.MDET) : 0)
  itemsTotal.value = Math.round(itemsTotal.value * 100) / 100;
  formData.subtotal = Math.round(formData.subtotal * 100) / 100;
  formData.total = Math.round(formData.total * 100) / 100;
}
const onProcessCreditCardBtnClick = () => {
  creditCardMeta.value.amount = formData.total
  modalMeta.value.isCreditCardInfoInputModalOpen = true
}
const onProcessCreditCard = async () => {
  if (creditCardMeta.value.cardnumber.length === 19) {
    cardnumberStyle.value = 'outline-none'
  } else {
    cardnumberStyle.value = 'outline outline-2 outline-[red]'
    return
  }
  if (creditCardMeta.value.expirationmonth < 1 || creditCardMeta.value.expirationmonth > 13) {
    expirationmonthStyle.value = 'outline outline-2 outline-[red]'
    return
  } else expirationmonthStyle.value = 'outline-none'
  if (creditCardMeta.value.expirationyear < 1) {
    expirationyearStyle.value = 'outline outline-2 outline-[red]'
    return
  } else expirationyearStyle.value = 'outline-none'
  if (creditCardMeta.value.ccv < 0 || !creditCardMeta.value.ccv) {
    ccvStyle.value = 'outline outline-2 outline-[red]'
    return
  } else ccvStyle.value = 'outline-none'
  await useChargeCreditCard(
    {
      cardInfo: {
        cardnumber: creditCardMeta.value.cardnumber.replaceAll(' ', ''),
        expirationyear: creditCardMeta.value.expirationyear,
        expirationmonth: creditCardMeta.value.expirationmonth,
        amount: creditCardMeta.value.amount
      },
      orderInfo: {
        ...formData,
        lineItems: orderList.value
      },
      customerInfo: {
        ...customerData
      }
    },
    {
      onResponse({ response }) {
        if (response._data.messages.resultCode === 'Ok') {
          toast.add({
            title: 'Success',
            description: response._data?.transactionResponse?.messages[0]?.description ?? '',
            icon: 'i-heroicons-shopping-cart',
            color: 'green'
          })
          processCreditCardSuccess.value = true
        } else {
          toast.add({
            title: 'Fail',
            description: response._data?.transactionResponse?.errors[0]?.errorText ?? response._data?.messages?.message[0]?.text,
            icon: 'i-heroicons-exclamation-triangle',
            color: 'red'
          })
        }
        modalMeta.value.isCreditCardInfoInputModalOpen = false
        creditCardMeta.value.cardnumber = ''
        creditCardMeta.value.expirationmonth = ''
        creditCardMeta.value.expirationyear = ''
        creditCardMeta.value.ccv = ''
        creditCardMeta.value.amount = 0
      }
    }
  )
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
  if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
async function onSubmit(event: FormSubmitEvent<any>) {
  if (!props.selectedOrder) { // Create Order
    await useApiFetch('/api/invoices', {
      method: 'POST',
      body: {
        ...formData,
        terms: processCreditCardSuccess.value ? formData.terms : null,
        lessdiscount: Number(formData.lessdiscount),
        lessdown: Number(formData.lessdown),
        tax: Number(formData.tax),
        cod: Number(formData.cod),
        shipping: Number(formData.shipping),
        MDET: formData.MDET ? Number(formData.MDET) : null,
        orderDetail: orderList.value
      },
      onResponse({ response }) {
        if (response.status === 201) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-shopping-cart',
            color: 'green'
          })
          emit('save')
          emit('close')
        }
      }
    })
  } else {  // Update Order
    await useApiFetch(`/api/invoices/${props.selectedOrder}`, {
      method: 'PUT',
      body: {
        ...formData,
        terms: processCreditCardSuccess.value ? formData.terms : null,
        lessdiscount: Number(formData.lessdiscount),
        lessdown: Number(formData.lessdown),
        tax: Number(formData.tax),
        cod: Number(formData.cod),
        shipping: Number(formData.shipping),
        MDET: formData.MDET ? Number(formData.MDET) : null,
        orderDetail: orderList.value
      },
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-shopping-cart',
            color: 'green'
          })
          emit('save')
          emit('close')
        }
      }
    })
  }
}
if (props.selectedOrder) {
  editInit()
}
else
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="formData" @submit="onSubmit">
    <div class="flex flex-row">
      <div class="basis-4/6 border-r-[3px] border-black">
        <div class="!my-0 flex flex-row">
          <div class="basis-2/5">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Order Information
            </div>
            <div class="flex flex-col p-3 space-y-2">
              <div class="flex flex-row">
                <div class="basis-1/2">
                  <UFormGroup label="Order#" name="orderID">
                    <div class="flex items-center min-h-[32px]">
                      {{ formData.orderid }}
                    </div>
                  </UFormGroup>
                </div>
                <div class="basis-1/2">
                  <UFormGroup label="Quote Date(Invoice Date)" name="quoteDate">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid"
                        :label="formData.orderdate && format(formData.orderdate, 'MM/dd/yyyy')" variant="outline"
                        :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.orderdate" is-required @close="close" />
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
                  <USelect v-model="formData.source" :options="sourceOptions" @change="onSourceItemChange" />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Source Description
                </div>
                <div class="flex-1 pl-4">
                  <USelect v-model="formData.sourcedescription" :options="sourcedescriptionOptions" />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  PO#
                </div>
                <div class="flex-1 pl-4">
                  <UInput v-model="formData.purchaseordernumber" />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Sold By
                </div>
                <div class="flex-1 pl-4">
                  <USelect v-model="formData.soldby" :options="soldByOptions" />
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="font-medium min-w-[137px]">
                  Quote#
                </div>
                <div class="flex-1 pl-4">
                  <UInputMenu v-model="formData.Quote" v-model:query="formData.Quote" :options="[]" />
                </div>
              </div>
            </div>
          </div>
          <div class="basis-3/5 border-[1px] border-slate-600 border-b-0 border-r-0 border-t-0">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Customer Informaton
            </div>
            <div class="flex flex-col p-3 space-y-2">
              <div>
                Customer# {{ customerData.number ? customerData.number : '' }}
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-1/2">
                  <div class="font-bold border-b-[1px] border-black">
                    Shipping Information
                  </div>
                  <div class="flex flex-col mt-4 space-y-3">
                    <div>
                      {{ customerData.fname ? customerData.fname : '' }} {{ customerData.lname ? customerData.lname : '' }}
                    </div>
                    <div>
                      {{ customerData.company1 ? customerData.company1 : '' }}
                    </div>
                    <div>
                      {{ customerData.company2 ? customerData.company2 : '' }}
                    </div>
                    <div>
                      {{ customerData.address ? customerData.address : '' }}
                    </div>
                    <div>
                      {{ customerData.city ? customerData.city : '' }} {{ customerData.state ? `, ${customerData.state}` : '' }}
                      {{
                        customerData.zip ? `, ${customerData.zip}`:'' }}
                    </div>
                    <div class="flex flex-row">
                      <div class="basis-1/2">
                        {{ customerData.homephone ? `H: ${customerData.homephone}` : '' }}
                      </div>
                      <div class="basis-1/2">
                        {{ customerData.workphone ? `W: ${customerData.workphone}` : '' }}
                      </div>
                    </div>
                    <div>
                      {{ customerData.cellphone ? `C: ${customerData.cellphone}` : '' }}
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
                      {{ customerData.billcompany1 ? customerData.billcompany1 : '' }}
                    </div>
                    <div>
                      {{ customerData.billcompany2 ? customerData.billcompany2 : '' }}
                    </div>
                    <div>
                      {{ customerData.billaddress ? customerData.billaddress : '' }}
                    </div>
                    <div>
                      {{ customerData.billcity ? customerData.billcity : '' }} {{ customerData.billstate ? `,
                      ${customerData.billstate}`:'' }} {{ customerData.billzip ? `, ${customerData.billzip}` : '' }}
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
        <div class="w-full px-3 py-1 gmsPurpleTitlebar">
          Items Ordered
        </div>
        <div class="w-full p-3">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row justify-end">
              <div class="flex space-x-3">
                <div>
                  Show Only Available
                </div>
                <div>
                  <UCheckbox name="fix" />
                </div>
              </div>
            </div>
            <div class="flex flex-1 flex-row space-x-3">
              <div class="basis-1/5">
                <UFormGroup label="Product Line" name="productLine">
                  <USelect v-model="orderMeta.productLine" :options="productLineOptions"
                    @change="onProductLineChange" />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup label="Model#" name="model">
                  <UInput v-model="orderMeta.model" />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup label="Category" name="category">
                  <USelect v-model="orderMeta.category" :options="categoryOptions" @change="onCategoryChange" />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup label="Sub-Category" name="subCategory">
                  <USelect v-model="orderMeta.subcategory" :options="subCategoryOptions" />
                </UFormGroup>
              </div>
              <div class="basis-1/5">
                <UFormGroup label="Stock#" name="stock">
                  <UInput v-model="orderMeta.stock" />
                </UFormGroup>
              </div>

            </div>

            <div>
              <UTable :columns="productColumns" :rows="productList" :ui="{
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
                checkbox: { padding: 'p-1 w-[10px]' }
              }" @select="onProductSelect">
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
                      <UInput v-model="qty" type="number" :ui="{
                        base: qtyStyle
                      }" />
                    </div>
                  </div>
                  <div class="flex flex-row space-x-3">
                    <div class="flex items-center">Serial:</div>
                    <div class="min-w-[150px]">
                      <UInputMenu v-model="formData.serial" :options="[]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div>
              <UTable :columns="orderColumns" :rows="orderList" :ui="{
                wrapper: 'h-32 border-[1px] border-gray-400 dark:border-gray-700',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                },
                th: {
                  padding: 'p-1',
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]'
                },
                td: {
                  padding: 'p-1'
                },
                checkbox: { padding: 'p-1 w-[10px]' }
              }" @select="onOrderSelect">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex flex-row justify-between space-x-4">
              <div class="basis-2/3 border border-gray-400 dark:border-gray-700 py-1 px-3">
                <UFormGroup label="Special Instrutions(40 Characters MAX Each Line)" name="stock">
                  <div class="flex flex-row space-x-2 w-full">
                    <div class="basis-1/2">
                      <UInput v-model="formData.specialinstructions1" />
                    </div>
                    <div class="basis-1/2">
                      <UInput v-model="formData.specialinstructions2" />
                    </div>
                  </div>
                </UFormGroup>
              </div>
              <div class="flex flex-col space-y-2 basis-1/3">
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2 w-full">
                    <UButton label="Add" color="gms-purple" class="w-full flex justify-center items-center"
                      @click="handleAddBtnClick" />
                  </div>
                  <div class="basis-1/2 w-full">
                    <UButton label="Remove" color="gms-purple" class="w-full flex justify-center items-center"
                      @click="handleRemoveBtnClick" />
                  </div>

                </div>
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UButton label="Update Price" color="gms-purple" class="w-full flex justify-center items-center"
                      @click="handleUpdateBtnClick" />
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="w-full p-3 border-t-[3px] border-black pb-3">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2 space-y-1">
              <div class="flex flex-row space-x-3">
                <div class="basis-7/12 flex flex-row space-x-3">
                  <div class="basis-1/5">
                    <UFormGroup label="Zone" name="zone">
                      <UInput v-model="formData.zone" />
                    </UFormGroup>
                  </div>
                  <div class="basis-4/5">
                    <UFormGroup label="Select Package" name="package">
                      <USelect v-model="formData.package" v-model:query="formData.package" :options="[]" />
                    </UFormGroup>
                  </div>
                </div>
                <div class="basis-5/12 w-full">
                  <UFormGroup label="Method" name="method">
                    <USelect v-model="formData.shippingmethod" v-model:query="formData.shippingmethod"
                      :options="methodOptions" />
                  </UFormGroup>
                </div>
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-7/12 flex items-end justify-end">
                  <div class="">
                    <UButton label="Calculate" color="gms-purple" :ui="{ base: 'justify-center' }" />
                  </div>
                </div>
                <div class="basis-5/12">
                  <UFormGroup label="FOB" name="fob">
                    <USelect v-model="formData.fob" v-model:query="formData.fob" :options="fobOptions" />
                  </UFormGroup>
                </div>
              </div>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Notes" name="notes">
                <UTextarea :rows="4" v-model="formData.Notes" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-2/6 w-full">
        <div class="w-full px-3 py-1 gmsPurpleTitlebar">
          Order Information
        </div>
        <div class="flex flex-col space-y-4 w-full p-3">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup label="Invoice#" name="invoice">
                  <div class="flex items-center min-h-[32px]">
                    {{ formData.invoicenumber }}
                  </div>
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Invoice Date" name="invoiceDate">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="formData.invoicedate && format(formData.invoicedate, 'MM/dd/yyyy')" variant="outline"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="formData.invoicedate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup label="Installation Date" name="installationDate">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="formData.acceptancedate && format(formData.acceptancedate, 'MM/dd/yyyy')"
                      variant="outline" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="formData.acceptancedate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Date Shipped" name="shippedDate">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="formData.shipdate && format(formData.shipdate, 'MM/dd/yyyy')" variant="outline"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="formData.shipdate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2 w-full">
              <div class="basis-1/2">
                <UFormGroup label="Installation By" name="installationBy">
                  <USelect v-model="formData.InstallationBy" v-model:query="formData.InstallationBy"
                    :options="installationByOptions" />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <div class="flex flex-row space-x-1">
                  <div class="flex-1">
                    <UFormGroup label="Back Order?" name="backOrder">
                      <USelect v-model="formData.Backorder" v-model:query="formData.Backorder"
                        :options="backOrderOptions" />
                    </UFormGroup>
                  </div>
                  <div class="flex items-end">
                    <UButton label="Ship" color="gms-purple" :ui="{ base: 'justify-center' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UFormGroup class="border border-gray-400 dark:border-gray-700 p-3">
            <div class="font-bold pb-2">Order Total</div>
            <div class="flex flex-col space-y-2">
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Items Total
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="itemsTotal" disabled type="number" :ui="{
                    base: 'text-right'
                  }" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Less Discount
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.lessdiscount" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: lessdiscountStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Less Down
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.lessdown" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: lessdownStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  <div class="flex flex-row space-x-1 w-full">
                    <div class="flex-auto">
                      Sales Tax
                    </div>
                    <div class="flex-auto">
                      <div class="flex flex-row items-center space-x-1">
                        <div>
                          <UCheckbox name="tax" />
                        </div>
                        <div>
                          (Exempt)
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                  </div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.tax" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: taxStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  <div class="flex flex-row space-x-1 w-full">
                    <div class="flex-auto">
                      MDET 2.3 %
                    </div>
                    <div class="flex-auto">
                      <div class="flex flex-row items-center space-x-1">
                        <div>
                          <UCheckbox name="mdet" v-model:model-value="mdetChecked" @change="onCalculateInvoiceValues" />
                        </div>
                        <div>
                          (Apply)
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                  </div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.MDET" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: mdetStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  COD
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.cod" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: codStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Shipping
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.shipping" v-maska="{
                    mask: '0.99',
                    tokens: {
                      0: { pattern: /[0-9]/, multiple: true },
                      9: { pattern: /[0-9]/, optional: true },
                    }
                  }" :ui="{
                      base: shippingStyle + ' text-right'
                    }" @change="onCalculateInvoiceValues" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Subtotal
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.subtotal" disabled type="number" :ui="{
                    base: 'text-right'
                  }" />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2 flex items-end">
                  Total
                  <div class="flex-1 ms-1" style="border-bottom: 2px dotted black;"></div>
                </div>
                <div class="basis-1/2">
                  <UInput v-model="formData.total" disabled type="number" :ui="{
                    base: 'text-right'
                  }" />
                </div>
              </div>
            </div>
          </UFormGroup>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup label="Terms">
                <USelect v-model="formData.terms" v-model:query="formData.terms" :options="termOptions" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Check#">
                <UInput v-model="formData.checking" v-maska="'####'" :ui="{
                  base: checkingStyle
                }" @change="() => {
                    if (formData.checking < 4) {
                      checkingStyle = 'outline outline-2 outline-[red]'
                    } else {
                      checkingStyle = 'outline-none'
                    }
                  }" />
              </UFormGroup>
            </div>
          </div>
          <UFormGroup class="border border-gray-400 dark:border-gray-700 p-3">
            <div class="font-bold pb-2">Credit Card</div>
            <div class="flex flex-row space-x-2 w-full items-center">
              <div class="basis-1/2 w-full flex justify-center">
                <UButton label="Process Credit Card" color="gms-purple" :ui="{ base: 'justify-center w-full' }"
                  @click="onProcessCreditCardBtnClick" />
              </div>
              <div class="basis-1/2">
                <div class="flex justify-between items-center">
                  <div class="basis-1/2">
                    Last 4 Digits
                  </div>
                  <div class="basis-1/2">
                    <UInput v-model="formData.checknoorcreditcardinfo" v-maska="'####'" :ui="{
                      base: checknoStyle
                    }" @change="() => {
                        if (formData.checknoorcreditcardinfo.length < 4) {
                          checknoStyle = 'outline outline-2 outline-[red]'
                        } else checknoStyle = 'outline-none'
                      }" />
                  </div>
                </div>
              </div>
            </div>
          </UFormGroup>
          <div class="flex flex-row space-x-3 w-full">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-check-badge" label="Receive Checks" variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                @click="handleReceiveChecksBtnClick" />
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate @click="onSubmit" />
            </div>
          </div>
        </div>
        <div class="w-full px-3 py-1 gmsPurpleTitlebar">
          Printing Options
        </div>
        <div class="flex flex-col space-y-2 w-full p-3">
          <div class="flex flex-row space-x-4">
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Invoice" variant="outline"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Receipt" variant="outline"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
          </div>
          <div class="flex flex-row space-x-4">
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Back Order" variant="outline"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/2">
              <UButton icon="i-heroicons-eye" label="Preview Label" variant="outline"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
          </div>
          <div class="w-full">
            <UButton icon="i-heroicons-arrow-path-rounded-square" label="Transfer to Quickbooks" color="purple"
              variant="outline" :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
        </div>
      </div>
    </div>
  </UForm>
  <!-- Update Price Modal -->
  <UDashboardModal v-model="modalMeta.isUpdatePriceModalOpen" :ui="{
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'p-0 pt-1' },
    body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
    width: 'w-[300px]'
  }">
    <div>
      <div class="flex flex-row space-x-5">
        <div class="flex items-center">Price: </div>
        <div class="flex-1 mr-4">
          <UInput type="number" v-model="updatedPrice"></UInput>
        </div>
      </div>
      <div class="flex flex-row-reverse mt-2">
        <div class="min-w-[60px]">
          <UButton label="OK" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="onUpdatePrice" />
        </div>
        <div class="min-w-[60px] mr-3">
          <UButton label="Cancel" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="modalMeta.isUpdatePriceModalOpen = false" />
        </div>
      </div>
    </div>
  </UDashboardModal>
  <!-- InventoryTransaction Modal -->
  <UDashboardModal v-model="modalMeta.isInventoryTransactionModalOpen" title="Inventory Transactions" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
  }">
    <MaterialsTransactionsInventoryTransactions :selected-order="props.selectedOrder" />
  </UDashboardModal>
  <!-- Credit Card Info Input Modal -->
  <UDashboardModal v-model="modalMeta.isCreditCardInfoInputModalOpen" title="Payment Details" :ui="{
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'p-0 pt-1' },
    body: { base: 'gap-y-1', padding: 'py-0 sm:pt-2' },
    width: 'w-[450px]'
  }">
    <div>
      <div>
        <UFormGroup label="Amount">
          <UInput type="number" v-model="creditCardMeta.amount" disabled />
        </UFormGroup>
      </div>
      <div class="mt-2">
        <UFormGroup label="Card Number">
          <div class="w-full">
            <UInput v-model="creditCardMeta.cardnumber" placeholder="1234 5678 9012 3456" type="text" :maxlength="19"
              v-maska="'#### #### #### ####'" :ui="{ base: cardnumberStyle }" autofocus @change="() => {
                if (creditCardMeta.cardnumber.length === 19) {
                  cardnumberStyle = 'outline-none'
                } else {
                  cardnumberStyle = 'outline outline-2 outline-[red]'
                  return
                }
              }" />
          </div>
        </UFormGroup>
      </div>
      <div class="mt-2 flex justify-between">
        <UFormGroup label="Expiration Date">
          <div class="flex flex-row space-x-2">
            <div class="w-[100px]">
              <UInput v-model="creditCardMeta.expirationmonth" placeholder="MM" type="number" v-maska="'##'" :max="12"
                :min="1" :ui="{
                  base: expirationmonthStyle
                }" @change="() => {
                  if (creditCardMeta.expirationmonth < 1 || creditCardMeta.expirationmonth > 13) {
                    expirationmonthStyle = 'outline outline-2 outline-[red]'
                    return
                  } else expirationmonthStyle = 'outline-none'
                }" />
            </div>
            <div class="w-[100px]">
              <UInput v-model="creditCardMeta.expirationyear" placeholder="YYYY" type="number" v-maska="'####'" :ui="{
                base: expirationyearStyle
              }" @change="() => {
                  if (creditCardMeta.expirationyear < 1) {
                    expirationyearStyle = 'outline outline-2 outline-[red]'
                    return
                  } else expirationyearStyle = 'outline-none'
                }" />
            </div>
          </div>
        </UFormGroup>
        <UFormGroup label="CV Code">
          <div class="w-[100px]">
            <UInput v-model="creditCardMeta.ccv" placeholder="123" :ui="{
              base: ccvStyle
            }" />
          </div>
        </UFormGroup>
      </div>
      <div class="flex flex-row-reverse mt-2">
        <div class="min-w-[60px]">
          <UButton label="OK" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="onProcessCreditCard" />
        </div>
        <div class="min-w-[60px] mr-3">
          <UButton label="Cancel" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="modalMeta.isCreditCardInfoInputModalOpen = false" />
        </div>
      </div>
    </div>
  </UDashboardModal>
</template>
