<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';   
  import type { UTableColumn } from '~/types';
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedCustomer: {
      type: [Number, String, null],
      required: true
    },
  })
  const toast = useToast()
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
  const serialGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      {
        key: 'serial',
        label: 'Serial',
      }
    ],
    serials: [],
    selectedSerial: null,
    isLoading: false
  })
  const complaintGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      {
        key: 'COMPLAINTDATE',
        label: 'Date'
      }, {
        key: 'COMPLAINTNUMBER',
        label: '#'
      }
    ],
    complaints: [],
    selectedComplaint: null,
    isLoading: false
  })
  const invoiceGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      {
        key: 'orderdate',
        label: 'Date'
      }, {
        key: 'invoicenumber',
        label: 'Invoice#'
      }, {
        key: 'terms',
        label: 'Terms'
      }
    ],
    invoices: [],
    selectedInvoice: null,
    isLoading: false
  })
  const serviceReportGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      {
        key: 'REPAIRDATE',
        label: 'Date'
      }, {
        key: 'REPAIRDESC',
        label: 'Type'
      }, {
        key: 'REPAIRSBY',
        label: 'By'
      }
    ],
    serviceReports: [],
    selectedServiceReport: null,
    isLoading: false
  })
  const investigationGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      {
        key: 'DIAGDATE',
        label: 'Date',
      }, {
        key: 'PROBLEMDIAG',
        label: 'Description'
      }
    ],
    investigations: [],
    selectedInvestigation: null,
    isLoading: false
  })
  const serviceOrderInfo = ref({
    COMPLAINTNUMBER: null,
    COMPLAINTDATE: null,
    RECBY: null,
    RECBYOptions: [],
    SERIALNO: null,
    COMPLAINT: null,
    PRODUCTDESC: null
  })
  const typeOfServiceInfo = ref({
    reason: null, 
    failure: null,
    reasonOptions: []
  })
  const modalMeta = ref({
    isServiceReportModalOpen: false,
    isInventoryTransactionModalOpen: false,
    isInvoiceModalOpen: false,
    isInvoiceListModalOpen: false,
  })
  const selectedServiceReportID = ref(null)
  const date = ref(new Date())
  const statusGroup = ref([
    {value: 'open', label: 'Open'}, 
    {value: 'close', label: 'Close'}
  ])
  const selectedStatus = ref('open')
  const riskStatusGroup = ref([
    {value: 'no', label: 'No'}, 
    {value: 'yes', label: 'Yes'}
  ])
  const selectedRiskStatus = ref('no')
  const receivedDate = ref(null)
  const nc = ref(null)
  const accessories = ref(null)

  const editInit = async () => {
    loadingOverlay.value = true
    await propertiesInit()
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
    await fetchSerialList();
    loadingOverlay.value = false
  }
  const fetchSerialList = async () => {
    await useApiFetch(`/api/invoices/serials/`, {
      method: 'GET',
      params: {
        customerid: props.selectedCustomer
      },
      onResponse({ response }) {
        if(response.status === 200) {
          serialGridMeta.value.serials = response._data.body
        }
      }
    })
  }
  const fetchComplaintList = async () => {
    await useApiFetch(`/api/service/complaints/`, {
      method: 'GET',
      params: {
        SERIALNO: serialGridMeta.value.selectedSerial.serial
      },
      onResponse({ response }) {
        if(response.status === 200) {
          complaintGridMeta.value.complaints = response._data.body
        }
      }
    })
  }
  const fetchInvoiceList = async () => {
    await useApiFetch(`/api/invoices/serviceorderinvoices/`, {
      method: 'GET',
      params: {
        COMPLAINTID: complaintGridMeta.value?.selectedComplaint?.uniqueID
      },
      onResponse({ response }) {
        if(response.status === 200) {
          invoiceGridMeta.value.invoices = response._data.body
        }
      }
    })
  }
  const fetchServiceReportList = async () => {
    await useApiFetch(`/api/service/servicereports/`, {
      method: 'GET',
      params: {
        COMPLAINTID: complaintGridMeta.value.selectedComplaint.uniqueID
      },
      onResponse({ response }) {
        if(response.status === 200) {
          serviceReportGridMeta.value.serviceReports = response._data.body
          serviceReportGridMeta.value.serviceReports.forEach((item) => {
            let type;
            switch(item.REPAIRDESC) {
              case 0:
                type = 'Field Service'
                break;
              case 1:
                type = 'Factory Service'
                break
              case 2:
                type = 'Customer'
                break
              default: 
                type = null
            }
            item.REPAIRDESC = type
          })
        }
      }
    })
  }
  const fetchInvestigationList = async () => {
    await useApiFetch(`/api/invoices/serviceorderinvoices/`, {
      method: 'GET',
      params: {
        COMPLAINTID: complaintGridMeta.value?.selectedComplaint?.uniqueID
      },
      onResponse({ response }) {
        if(response.status === 200) {
          invoiceGridMeta.value.invoices = response._data.body
        }
      }
    })
  }
  const linkInvoice = async (orderID) => {
    await useApiFetch(`/api/invoices/${orderID}`, {
      method: 'PUT',
      body: {
        complaintID: complaintGridMeta.value.selectedComplaint?.uniqueID
      }
    })
  }
  const unlinkInvoice = async (orderID) => {
    await useApiFetch(`/api/invoices/${orderID}`, {
      method: 'PUT',
      body: {
        complaintID: null
      }
    })
  }
  const onSerialSelect = async (row) => {
    if(JSON.stringify({...serialGridMeta.value.selectedSerial, class:""}) !== JSON.stringify({...row, class: ""})) {
      serialGridMeta.value.selectedSerial = {...row, class:""}
      serialGridMeta.value.serials.forEach((serial) => {
        if(serial.UniqueID === row.UniqueID) {
          serial.class = 'bg-gray-200'
        }else{
          delete serial.class
        }
      })
      invoiceGridMeta.value.invoices = []
      invoiceGridMeta.value.selectedInvoice = null
      serviceReportGridMeta.value.serviceReports = []
      serviceReportGridMeta.value.selectedServiceReport = null    
      serviceOrderInfo.value.SERIALNO = null
      serviceOrderInfo.value.COMPLAINTNUMBER = null
      serviceOrderInfo.value.COMPLAINTDATE = null
      serviceOrderInfo.value.COMPLAINT = null
      serviceOrderInfo.value.PRODUCTDESC = null
      serviceOrderInfo.value.RECBY = null
      typeOfServiceInfo.value.reason = null
      typeOfServiceInfo.value.failure = null
      if(serialGridMeta.value.selectedSerial) {
        await fetchComplaintList()
        let tmpRECBYOptions = complaintGridMeta.value.complaints.map((item: any) => item.RECBY)
        tmpRECBYOptions = tmpRECBYOptions.filter(item => item !== '' && item !== null)
        let uniqueItemSet = new Set()
        let filteredRECBYOptions = tmpRECBYOptions.filter(item => {
          if(!uniqueItemSet.has(item)) {
            uniqueItemSet.add(item)
            return true
          }
          return false
        })
        serviceOrderInfo.value.RECBYOptions = filteredRECBYOptions
        serviceOrderInfo.value.RECBYOptions.unshift(null)
        let tmpReasonOptions = complaintGridMeta.value.complaints.map((item: any) => item.ValidComplaintReason)
        tmpReasonOptions = tmpReasonOptions.filter(item => item !== '' && item !== null)
        let uniqueReasonSet = new Set()
        let filteredReasonOptions = tmpReasonOptions.filter(item => {
          if(!uniqueReasonSet.has(item)) {
            uniqueReasonSet.add(item)
            return true
          }
          return false
        })
        typeOfServiceInfo.value.reasonOptions = filteredReasonOptions
        typeOfServiceInfo.value.reasonOptions.unshift(null)
      }
    }
  }
  const onComplaintSelect = async (row) => {
    complaintGridMeta.value.selectedComplaint = {...row, class:""}
    complaintGridMeta.value.complaints.forEach((complaint) => {
      if(complaint.uniqueID === row.uniqueID) {
        complaint.class = 'bg-gray-200'
      }else{
        delete complaint.class
      }
    })
    if(complaintGridMeta.value.selectedComplaint) {
      serviceOrderInfo.value.SERIALNO = complaintGridMeta.value.selectedComplaint.SERIALNO
      serviceOrderInfo.value.COMPLAINTNUMBER = complaintGridMeta.value.selectedComplaint.COMPLAINTNUMBER
      serviceOrderInfo.value.COMPLAINTDATE = complaintGridMeta.value.selectedComplaint.COMPLAINTDATE
      serviceOrderInfo.value.COMPLAINT = complaintGridMeta.value.selectedComplaint.COMPLAINT
      serviceOrderInfo.value.PRODUCTDESC = complaintGridMeta.value.selectedComplaint.PRODUCTDESC
      serviceOrderInfo.value.RECBY = complaintGridMeta.value.selectedComplaint.RECBY
      typeOfServiceInfo.value.reason = complaintGridMeta.value.selectedComplaint.ValidComplaintReason
      typeOfServiceInfo.value.failure = complaintGridMeta.value.selectedComplaint.FAILINVEST
      await fetchInvoiceList()
      await fetchServiceReportList()
    } else {
      serviceOrderInfo.value.SERIALNO = null
      serviceOrderInfo.value.COMPLAINTNUMBER = null
      serviceOrderInfo.value.COMPLAINTDATE = null
      serviceOrderInfo.value.COMPLAINT = null
      serviceOrderInfo.value.PRODUCTDESC = null
      serviceOrderInfo.value.RECBY = null
      invoiceGridMeta.value.invoices = []
      serviceReportGridMeta.value.serviceReports = []
    }
  }
  const onInvoiceSelect = async (row) => {
    invoiceGridMeta.value.selectedInvoice = {...row, class:""}
    invoiceGridMeta.value.invoices.forEach((invoice) => {
      if(invoice.UniqueID === row.UniqueID) {
        invoice.class = 'bg-gray-200'
      }else{
        delete invoice.class
      }
    })
  }
  const onInvoiceDblClick = () => {
    modalMeta.value.isInvoiceModalOpen = true
  }
  const onServiceReportSelect = async (row) => {
    serviceReportGridMeta.value.selectedServiceReport = {...row, class:""}
    serviceReportGridMeta.value.serviceReports.forEach((serviceReport) => {
      if(serviceReport.uniqueID === row.uniqueID) {
        serviceReport.class = 'bg-gray-200'
      }else{
        delete serviceReport.class
      }
    })
  }
  const onServiceReportDblClick = () => {
    selectedServiceReportID.value = serviceReportGridMeta.value.selectedServiceReport?.uniqueID
    modalMeta.value.isServiceReportModalOpen = true
  }
  const onServiceReportBtnClick = async () => {
    if(!complaintGridMeta.value.selectedComplaint) {
      toast.add({
        description: 'You must save this complaint first before you can continue',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow'
      })
      return;
    }
    selectedServiceReportID.value = null
    modalMeta.value.isServiceReportModalOpen = true
  }
  const onServiceReportSave = async () => {
    modalMeta.value.isServiceReportModalOpen = false
    fetchServiceReportList()
  }
  const onViewInventoryTransactioBtnClick = () => {
    modalMeta.value.isInventoryTransactionModalOpen = true
  }
  const onNewInvoiceBtnClick = () => {
    if(complaintGridMeta.value.selectedComplaint) {
      modalMeta.value.isInvoiceModalOpen = true
    } else {
      toast.add({
        description: 'Please select order first',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow'
      })
    }
  }
  const onLinkBtnClick = () => {
    if(complaintGridMeta.value.selectedComplaint) {
      modalMeta.value.isInvoiceListModalOpen = true
    } else {
      toast.add({
        description: 'Please select order first',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow'
      })
    }
  }
  const onUnlinkBtnClick = () => {
    if(invoiceGridMeta.value.selectedInvoice) {
      unlinkInvoice(invoiceGridMeta.value.selectedInvoice?.UniqueID)
      fetchInvoiceList()
    } else {
      toast.add({
        description: 'Please select invoice first',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow'
      })
    }
  }
  const onNewInvoiceModalClose = () => {
    modalMeta.value.isInvoiceModalOpen = false
  }
  const onInvoiceLinkModalClose = () => {
    modalMeta.value.isInvoiceListModalOpen = false
  }
  const onNewInvoiceSave = async () => {
    fetchInvoiceList()
  } 
  const onInvoiceLink = async (selectedInvoiceID) => {
    await linkInvoice(selectedInvoiceID)
    fetchInvoiceList()
  }
  const validate = (state: any): FormError[] => {
    const errors = []

    return errors
  }
  async function onSubmit(event: FormSubmitEvent<any>) {
    emit('save', event.data)
    emit('close')
  }
  if(props.selectedCustomer) 
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
    <div class="w-full px-3 py-1 bg-slate-400">
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
            <div class="font-bold border-b-[1px] border-black">
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
            <div class="font-bold border-b-[1px] border-black">
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
                :columns="serialGridMeta.defaultColumns"
                :rows="serialGridMeta.serials"
                class="w-full"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: { 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'px-2 py-0'
                  }, 
                  td: {
                    base: 'h-[31px]',
                    padding: 'px-2 py-0'
                  }
                }"
                @select="onSerialSelect"
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
                :rows="complaintGridMeta.complaints"
                :columns="complaintGridMeta.defaultColumns"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: { 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'px-2 py-0'
                  }, 
                  td: {
                    base: 'h-[31px]',
                    padding: 'px-2 py-0'
                  }
                }"
                @select="onComplaintSelect"
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
                    :rows="invoiceGridMeta.invoices"
                    :columns="invoiceGridMeta.defaultColumns"
                    :ui="{
                      wrapper: 'h-[100px] border-2 border-gray-300 dark:border-gray-700',
                      divide: 'divide-gray-200 dark:divide-gray-800',
                      tr: {
                        active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                      },
                      th: { 
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'px-2 py-0'
                      }, 
                      td: {
                        base: 'h-[31px]',
                        padding: 'px-2 py-0'
                      }
                    }"
                    @select="onInvoiceSelect"
                    @dblclick="onInvoiceDblClick"
                  >
                  <template #empty-state>
                    <div></div>
                  </template>
                  </UTable>
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 mt-1">
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="New" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="onNewInvoiceBtnClick"/>
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="Link" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="onLinkBtnClick"/>
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-minus-circle-20-solid" label="Unlink" variant="outline" color="red" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="onUnlinkBtnClick"/>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="mt-2">
          <div class="pl-3 bg-slate-400">
            Service Reports
          </div>
          <div class="flex flex-col p-3 bg-slate-200 space-x-4">
            <div class="flex flex-row">
              <div class="basis-3/5 px-2">
                <UTable
                  :rows="serviceReportGridMeta.serviceReports"
                  :columns="serviceReportGridMeta.defaultColumns"
                  :ui="{
                    wrapper: 'h-24 border-2 border-gray-300 dark:border-gray-700 bg-white dark:text-gray dark:bg-[#111827]',
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: { 
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'px-2 py-0'
                    }, 
                    td: {
                      base: 'h-[31px]',
                      padding: 'px-2 py-0'
                    }
                  }"
                  @select="onServiceReportSelect"
                  @dblclick="onServiceReportDblClick"
                >
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
                <div class="flex justify-between mt-1">
                  <div class="italic flex items-center">
                    Doubleclick to view
                  </div>
                  <div>
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
              <div class="basis-2/5 space-y-3 px-2">
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
              </div>
            </div>
            <div class="flex flex-row mt-2">
              <div class="basis-3/5 px-2">
                <div class="w-full">
                  <UButton 
                    icon="i-heroicons-check-badge-20-solid"
                    label="View Inventory Transaction"
                    variant="outline"
                    :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
                    @click="onViewInventoryTransactioBtnClick"
                  />
                </div>
              </div>
              <div class="basis-2/5 px-2">
                <div class="w-full">
                  <UButton 
                    icon="i-heroicons-plus-20-solid"
                    label="Create Service Report"
                    variant="outline"
                    color="green"
                    :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
                    @click="onServiceReportBtnClick"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2 border-[1px] border-slate-600 border-l-0 border-b-0 border-t-0">
        <div class="w-full bg-slate-400 px-3 py-1">
          Service Order
        </div>
        <div class="flex flex-row px-3 py-2">
          <div class="basis-5/12">
            <div>{{ serviceOrderInfo.COMPLAINTNUMBER?`# ${serviceOrderInfo.COMPLAINTNUMBER}`:'' }}</div>
            <div>{{ serviceOrderInfo.PRODUCTDESC }}</div>
            <div>{{ serviceOrderInfo.SERIALNO?`Serial ${serviceOrderInfo.SERIALNO}`: '' }}</div>
          </div>
          <div class="basis-4/12">
            <div class="flex flex-row">
              <div class="flex items-center w-[35px] font-medium">Date</div>
              <div class="flex-1 px-4">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="serviceOrderInfo.COMPLAINTDATE && format(serviceOrderInfo.COMPLAINTDATE, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="date" is-required @close="close" />
                  </template>
                </UPopover>
              </div>
            </div>
            <div class="flex flex-row mt-3">
              <div class="flex items-center w-[35px] font-medium">By</div>
              <div class="flex-1 px-4">
                <USelect
                  v-model="serviceOrderInfo.RECBY"
                  :options="serviceOrderInfo.RECBYOptions"
                />
              </div>
            </div>
          </div>
          <div class="basis-3/12">
            <div class="flex flex-row space-x-5">
              <URadio 
                v-for="status of statusGroup"
                :key = 'status.value'
                v-model="selectedStatus"
                v-bind="status"
              />
            </div>
            <div class="mt-6 flex items-center">
              Warranty Period
            </div>
          </div>
        </div>
        <div class="px-3 py-0">
          <UFormGroup
            label="Desicripton"
            name="description"
          >
            <UTextarea
              :model-value="serviceOrderInfo.COMPLAINT"
            />
          </UFormGroup>
        </div>
        <div class="px-3 py-0 mt-1">
          <div class="flex flex-row border border-gray rounded-md py-1">
            <div class="basis-5/12 flex items-center ml-2">
              Death, Serious Injury, or Risk of Either?
            </div>
            <div class="basis-3/12 flex flex-row space-x-5 items-center">
              <URadio 
                v-for="riskStatus of riskStatusGroup"
                :key = 'riskStatus.value'
                v-model="selectedRiskStatus"
                v-bind="riskStatus"
              />
            </div>
            <div class="basis-4/12 flex flex-row space-x-5 justify-center">
              <UButton 
                label="VIEW#1"
              />
              <UButton 
                label="VIEW#2"
              />
            </div>
          </div>
        </div>
        <div class="px-3 py-0 mt-1">
          <div class="flex flex-row space-x-3 border border-gray rounded-md px-2 py-1">
            <div class="basis-3/12">
              <UFormGroup
                label="Received"
                name="received"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="receivedDate" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-2/12">
              <UFormGroup
                label="NC#"
                name="nc"
              >
                <UInput 
                  v-model="nc"
                />
              </UFormGroup>
            </div>
            <div class="basis-5/12">
              <UFormGroup
                label="Accessories Received"
                name="accessories received"
              >
                <UInput 
                  v-model="accessories"
                />
              </UFormGroup>
            </div>
            <div class="basis-2/12 flex items-end">
              <UButton 
                icon="i-heroicons-plus-20-solid"
                label="Receive"
                :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate
              />
            </div>
          </div>
          <div class="flex flex-row space-x-3 px-4 mt-2">
            <div class="basis-1/4">
              <UButton icon="i-heroicons-document-text-20-solid" label="Save" color="green" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye-20-solid" label="Preview Order" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye-20-solid" label="Preview Label" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/4">
              <UButton icon="i-f7-rays" label="Clear Form" color="red" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-1">
          Type of Services
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-1/2">
            <UFormGroup
              label="Select"
              name="select"
            >
              <USelect 
                v-model="typeOfServiceInfo.reason"
                :options="typeOfServiceInfo.reasonOptions"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup
              label="Failure Comment"
              name="failure"
            >
              <UInput 
                v-model="typeOfServiceInfo.failure"
              />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full p-3 border border-gray">
            <UFormGroup
              label="Investigation Required"
              name="investigation"
            >
              <UTable
                :rows="investigationGridMeta.investigations"
                :columns="investigationGridMeta.defaultColumns"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: { 
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'px-2 py-0'
                  }, 
                  td: {
                    base: 'h-[31px]',
                    padding: 'py-0'
                  }
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
            <div class="flex flex-row space-x-4 justify-end mt-2">
              <div class="w-[120px]">
                <UButton icon="i-heroicons-plus-20-solid" variant="outline" label="Add" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
              </div>
              <div class="w-[120px]">
                <UButton icon="i-heroicons-minus-circle-20-solid" variant="outline" color="red" label="Remove" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UForm>
  <!-- Service Report Modal -->
  <UDashboardModal
    v-model="modalMeta.isServiceReportModalOpen"
    title="Service Report"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl', 
    }"
  >
    <ServiceReportDetail :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID" :selected-service-report="selectedServiceReportID" @save="onServiceReportSave"/>
  </UDashboardModal>
  <!-- Inventory Transaction Modal -->
  <UDashboardModal
    v-model="modalMeta.isInventoryTransactionModalOpen"
    title="Inventory Transactions"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl',
    }"
  >
    <InventoryTransactions />
  </UDashboardModal>
  <!-- New Invoice Modal -->
  <UDashboardModal
    v-model="modalMeta.isInvoiceModalOpen"
    title="Invoivce"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl', 
    }"
  >
    <InvoiceDetail :selected-customer="props.selectedCustomer" :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID" @save="onNewInvoiceSave" @close="onNewInvoiceModalClose"/>
  </UDashboardModal>
  <UDashboardModal
    v-model="modalMeta.isInvoiceListModalOpen"
    title="Invoice List"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl', 
      height: 'h-[900px] sm:h-[900px]',
    }"
  >
    <InvoiceList selected-customer="props.selectedCustomer" @close="onInvoiceLinkModalClose" @link="onInvoiceLink"/>
  </UDashboardModal>
</template>
