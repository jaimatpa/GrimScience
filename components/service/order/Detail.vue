<script setup lang="ts">
import type { FormError, FormSubmitEvent, FormErrorEvent } from '#ui/types'
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
  formAction: {
    type: [Number, String, null],
    required: false
  },
  selectedComplaint: {
    type: [Number, String, null],
    required: true
  },
  selectedOrder: {
    type: [Number, String, null],
    required: true
  },
  selectedSerial: {
    type: [Number, String, null],
    required: true
  },
})

const complaintUniquueId = ref(props.selectedOrder)
const toast = useToast()
const loadingOverlay = ref(false)
const warnMsg = ref({
  setSerReportCount: null,
  warnMsgModalOpen: false,
})
const showOnSaveAlertModal = ref(false)
const formSubmitData = ref(null);

const formValidationErrors = ref([])
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
      key: 'DESCRIPTION',
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
  PRODUCTDESC: null,
  NONCONFORMANCE: null,
  OPENCASE: "0",
  INJURYREPORTNO: null,
  uniqueID: null,
  ValidComplaintReason: null,
  FAILINVEST: null,
  CLOSEDOUTBY: null,
  MODELNO: null
})
const WARRANTYUNTIL = ref(null)
const typeOfServiceInfo = ref({
  // reason: null, 
  // failure: null,
  reasonOptions: []
})
const modalMeta = ref({
  isServiceReportModalOpen: false,
  isInventoryTransactionModalOpen: false,
  isInvoiceModalOpen: false,
  isInvoiceListModalOpen: false,
  isInvestigationModalOpen: false,
  isNonConformanceModalOpen: false,
  isInjuryReport1ModalOpen: false,
  isInjuryReport2ModalOpen: false,
})
const selectedServiceReportID = ref(null)
const date = ref(null)
const initialComplaint = ref(null)
const statusGroup = ref([
  { value: '0', label: 'Open' },
  { value: '1', label: 'Close' }
])
const OPENCASE = ref(null)
const riskStatusGroup = ref([
  { value: '0', label: 'No' },
  { value: '1', label: 'Yes' }
])
const INJURYREPORTNO = ref(null)
const receivedDate = ref(null)
const nc = ref(null)
const accessories = ref(null)

const editInit = async () => {
  loadingOverlay.value = true
  await propertiesInit()
}

const propertiesInit = async () => {
  // loadingOverlay.value = true
  await useApiFetch(`/api/tbl/tblCustomers/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        for (const key in response._data.body) {
          if (response._data.body[key]) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
    onResponseError() {
      loadingOverlay.value = false
      toast.add({
        title: 'Error',
        description: 'Fail to get customer information',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red'
      })
    }
  })
  await fetchSerialList();
  await fetchEmployess();
  // loadingOverlay.value = false
}
const fetchEmployess = async () => {
  await useApiFetch(`/api/tbl/tblEmployee?ACTIVE=1`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        const employees = response._data?.body;

        if (employees?.length) {
          const formattedEmployees = employees.map(employee =>
            `#${employee.payrollnumber || 'n/a'} ${employee.fname || ''} ${employee.lname || ''}`
          );

          serviceOrderInfo.value.RECBYOptions = formattedEmployees
          return formattedEmployees;
        }
      }
    }
  })
}
const fetchSerialList = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/invoices/serials/`, {
    method: 'GET',
    params: {
      customerid: props.selectedCustomer
    },
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        serialGridMeta.value.serials = response._data.body
      }
    },
    onResponseError() {
      loadingOverlay.value = false
    }
  })
}
const fetchComplaintList = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/service/complaints/`, {
    method: 'GET',
    params: {
      SERIALNO: serialGridMeta.value.selectedSerial.serial
    },
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        complaintGridMeta.value.complaints = response._data.body
      }
    },
    onResponseError() {
      loadingOverlay.value = false
    }
  })
}
const fetchInvoiceList = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/invoices/serviceorderinvoices/`, {
    method: 'GET',
    params: {
      COMPLAINTID: complaintGridMeta.value?.selectedComplaint?.uniqueID
    },
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        invoiceGridMeta.value.invoices = response._data.body
      }
    },
    onResponseError() {
      loadingOverlay.value = false
    }
  })
}
const fetchServiceReportList = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/service/servicereports/`, {
    method: 'GET',
    params: {
      COMPLAINTID: complaintGridMeta.value.selectedComplaint.uniqueID
    },
    onResponse({ response }) {
      let openCount = 0;
      if (response.status === 200) {
        loadingOverlay.value = false
        serviceReportGridMeta.value.serviceReports = response._data.body

        serviceReportGridMeta.value.serviceReports.forEach((item) => {

          if (item.ServiceStatus === 'open') {
            openCount++;
          }
          let type;
          switch (item.REPAIRDESC) {
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
      warnMsg.value.setSerReportCount = openCount;
    },
    onResponseError() {
      loadingOverlay.value = false
    }
  })
}
const fetchInvestigationList = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/engineering/investigationcomplaints`, {
    method: 'GET',
    params: {
      ComplaintID: complaintGridMeta.value?.selectedComplaint?.uniqueID
    },
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        investigationGridMeta.value.investigations = response._data.body
      }
    },
    onResponseError() {
      loadingOverlay.value = false
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
const linkNonConformance = async (nonConformanceID) => {

}
const onSerialSelect = async (row) => {
  if (JSON.stringify({ ...serialGridMeta.value.selectedSerial, class: "" }) !== JSON.stringify({ ...row, class: "" })) {
    serialGridMeta.value.selectedSerial = { ...row, class: "" }
    serialGridMeta.value.serials.forEach((serial) => {
      if (serial.UniqueID === row.UniqueID) {
        serial.class = 'bg-gray-200'
      } else {
        delete serial.class
      }
    })
    invoiceGridMeta.value.invoices = []
    invoiceGridMeta.value.selectedInvoice = null
    serviceReportGridMeta.value.serviceReports = []
    serviceReportGridMeta.value.selectedServiceReport = null
    serviceOrderInfo.value.SERIALNO = serialGridMeta.value.selectedSerial.serial
    // serviceOrderInfo.value.COMPLAINTNUMBER = null
    // serviceOrderInfo.value.COMPLAINTDATE = null
    // serviceOrderInfo.value.COMPLAINT = null
    // serviceOrderInfo.value.PRODUCTDESC = null
    // serviceOrderInfo.value.RECBY = null
    serviceOrderInfo.value.ValidComplaintReason = null
    serviceOrderInfo.value.FAILINVEST = null
    if (serialGridMeta.value.selectedSerial) {
      await fetchComplaintList()
      let tmpRECBYOptions = complaintGridMeta.value.complaints.map((item: any) => item.RECBY)
      tmpRECBYOptions = tmpRECBYOptions.filter(item => item !== '' && item !== null)
      let uniqueItemSet = new Set()
      let filteredRECBYOptions = tmpRECBYOptions.filter(item => {
        if (!uniqueItemSet.has(item)) {
          uniqueItemSet.add(item)
          return true
        }
        return false
      })
      serviceOrderInfo.value.PRODUCTDESC = complaintGridMeta.value.complaints[0].PRODUCTDESC
      serviceOrderInfo.value.RECBYOptions = filteredRECBYOptions
      serviceOrderInfo.value.RECBYOptions.unshift(null)
      let tmpReasonOptions = complaintGridMeta.value.complaints.map((item: any) => item.ValidComplaintReason)
      tmpReasonOptions = tmpReasonOptions.filter(item => item !== '' && item !== null)
      let uniqueReasonSet = new Set()
      let filteredReasonOptions = tmpReasonOptions.filter(item => {
        if (!uniqueReasonSet.has(item)) {
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
  complaintGridMeta.value.selectedComplaint = { ...row, class: "" }
  complaintGridMeta.value.complaints.forEach((complaint) => {
    if (complaint.uniqueID === row.uniqueID) {
      complaint.class = 'bg-gray-200'
    } else {
      delete complaint.class
    }
  })
  if (complaintGridMeta.value.selectedComplaint) {
    complaintUniquueId.value = complaintGridMeta.value.selectedComplaint.uniqueID
    serviceOrderInfo.value.SERIALNO = complaintGridMeta.value.selectedComplaint.SERIALNO
    serviceOrderInfo.value.COMPLAINTNUMBER = complaintGridMeta.value.selectedComplaint.COMPLAINTNUMBER
    serviceOrderInfo.value.COMPLAINTDATE = complaintGridMeta.value.selectedComplaint.COMPLAINTDATE
    serviceOrderInfo.value.COMPLAINT = complaintGridMeta.value.selectedComplaint.COMPLAINT
    serviceOrderInfo.value.PRODUCTDESC = complaintGridMeta.value.selectedComplaint.PRODUCTDESC
    serviceOrderInfo.value.RECBY = complaintGridMeta.value.selectedComplaint.RECBY
    serviceOrderInfo.value.ValidComplaintReason = complaintGridMeta.value.selectedComplaint.ValidComplaintReason
    serviceOrderInfo.value.FAILINVEST = complaintGridMeta.value.selectedComplaint.FAILINVEST
    serviceOrderInfo.value.OPENCASE = complaintGridMeta.value.selectedComplaint.OPENCASE
    serviceOrderInfo.value.INJURYREPORTNO = complaintGridMeta.value.selectedComplaint.INJURYREPORTNO
    serviceOrderInfo.value.CLOSEDOUTBY = complaintGridMeta.value.selectedComplaint.ClosedOutBy
    WARRANTYUNTIL.value = complaintGridMeta.value.selectedComplaint.WARRANTYUNTIL
    await fetchInvoiceList()
    await fetchServiceReportList()
    await fetchInvestigationList()
  } else {
    serviceOrderInfo.value.SERIALNO = null
    serviceOrderInfo.value.COMPLAINTNUMBER = null
    serviceOrderInfo.value.COMPLAINTDATE = null
    serviceOrderInfo.value.COMPLAINT = null
    serviceOrderInfo.value.PRODUCTDESC = null
    serviceOrderInfo.value.RECBY = null
    serviceOrderInfo.value.OPENCASE = null
    serviceOrderInfo.value.INJURYREPORTNO = null
    serviceOrderInfo.value.CLOSEDOUTBY = null
    WARRANTYUNTIL.value = null
    invoiceGridMeta.value.invoices = []
    serviceReportGridMeta.value.serviceReports = []
  }
}
const onInvoiceSelect = async (row) => {
  invoiceGridMeta.value.selectedInvoice = { ...row, class: "" }
  invoiceGridMeta.value.invoices.forEach((invoice) => {
    if (invoice.UniqueID === row.UniqueID) {
      invoice.class = 'bg-gray-200'
    } else {
      delete invoice.class
    }
  })
}
const onInvoiceDblClick = () => {
  modalMeta.value.isInvoiceModalOpen = true
}
const onServiceReportSelect = async (row) => {
  serviceReportGridMeta.value.selectedServiceReport = { ...row, class: "" }
  serviceReportGridMeta.value.serviceReports.forEach((serviceReport) => {
    if (serviceReport.uniqueID === row.uniqueID) {
      serviceReport.class = 'bg-gray-200'
    } else {
      delete serviceReport.class
    }
  })
}
const onServiceReportDblClick = () => {
  selectedServiceReportID.value = serviceReportGridMeta.value.selectedServiceReport?.uniqueID
  modalMeta.value.isServiceReportModalOpen = true
}
const onInvestigationSelect = async (row) => {
  investigationGridMeta.value.selectedInvestigation = { ...row, class: "" }
  investigationGridMeta.value.investigations.forEach((investigation) => {
    if (investigation.uniqueid === row.uniqueid) {
      investigation.class = 'bg-gray-200'
    } else {
      delete investigation.class
    }
  })
}
const onInvestigationDblClick = () => {
  modalMeta.value.isInvestigationModalOpen = true
}
const onServiceReportBtnClick = async () => {
  if (!complaintGridMeta.value.selectedComplaint) {
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
const onServiceReportClose = async () => {
  modalMeta.value.isServiceReportModalOpen = false
}
const onServiceReportSave = async () => {
  modalMeta.value.isServiceReportModalOpen = false
  fetchServiceReportList()
}
const onViewInventoryTransactioBtnClick = () => {
  modalMeta.value.isInventoryTransactionModalOpen = true
}
const onNewInvoiceBtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint) {
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
  if (complaintGridMeta.value.selectedComplaint) {
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
  if (invoiceGridMeta.value.selectedInvoice) {
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
const onView1BtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint) {
    modalMeta.value.isInjuryReport1ModalOpen = true
  } else {
    toast.add({
      description: 'Please select order first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
  }
}
const onView2BtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint) {
    modalMeta.value.isInjuryReport2ModalOpen = true
  } else {
    toast.add({
      description: 'Please select order first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
  }
}
const onInvestigationAddBtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint) {
    modalMeta.value.isInvestigationModalOpen = true
  } else {
    toast.add({
      description: 'Please select order first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
  }
}
const onInvestigationRemoveBtnClick = async () => {
  if (investigationGridMeta.value.selectedInvestigation) {
    await useApiFetch(`/api/engineering/investigationcomplaints/${investigationGridMeta.value.selectedInvestigation?.uniqueid ?? 0}`, {
      method: 'DELETE',
      onResponse({ response }) {
        if (response.status === 200) {
          fetchInvestigationList()
        }
      }
    })
  } else {
    toast.add({
      description: 'Please select investigation first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
  }
}
const onReceiveBtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint) {
    modalMeta.value.isNonConformanceModalOpen = true
  } else {
    toast.add({
      description: 'Please select order first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow'
    })
  }
}
const onPreviewOrderViewBtnClick = () => {
  if (complaintGridMeta.value.selectedComplaint?.uniqueID) {
    window.open(`/api/service/orders/exportcomplaints/${complaintGridMeta.value.selectedComplaint?.uniqueID}`)
  } else {
    toast.add({
      description: 'Please select order first',
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
const onInvestigationModalClose = () => {
  modalMeta.value.isInvestigationModalOpen = false
}
const onNonConformanceLink = async (selectedNonConformanceID) => {
  if (!serviceOrderInfo.value.NONCONFORMANCE) {
    serviceOrderInfo.value.NONCONFORMANCE = selectedNonConformanceID
  } else {
    serviceOrderInfo.value.NONCONFORMANCE += ` & ${selectedNonConformanceID}`
  }
}
const onNonConformanceModalClose = () => {
  modalMeta.value.isNonConformanceModalOpen = false
}
const onInjuryReport1ModalClose = () => {
  modalMeta.value.isInjuryReport1ModalOpen = false
}
const onInjuryReport2ModalClose = () => {
  modalMeta.value.isInjuryReport2ModalOpen = false
}
const onInvestigationAdd = async (selelctedInvestigationID) => {
  await useApiFetch('/api/engineering/investigationcomplaints/', {
    method: 'POST',
    body: {
      investigationID: selelctedInvestigationID,
      ComplaintID: complaintGridMeta.value.selectedComplaint?.uniqueID ?? 0
    },
    onResponse({ response }) {
      if (response.status === 200) {
        fetchInvestigationList()
      }
    }
  })
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.COMPLAINTDATE) errors.push({ path: 'complaintDate', message: 'Required' })
  if (state.INJURYREPORTNO === null) errors.push({ path: 'injuryReportNo', message: 'Required' })
  if (state.OPENCASE === null) errors.push({ path: 'openCase', message: 'Required' })
  if (!state.SERIALNO) errors.push({ path: 'serial', message: 'Required' })
  formValidationErrors.value = errors
  return errors
}
async function onSubmit(event: FormSubmitEvent<any>) {
  const { RECBYOptions, ...data } = event.data

  if (warnMsg.value.setSerReportCount > 0 && data.OPENCASE == '1') {
    warnMsg.value.warnMsgModalOpen = true
    return true;
  }
  warnMsg.value.warnMsgModalOpen = false

  if (data.OPENCASE == '1') {
    formSubmitData.value = data; // Store the form data
    showOnSaveAlertModal.value = true;
  } else {
    submitForm(data); // Proceed with form submission
  }
}

const confirmSave = () => {
  submitForm(formSubmitData.value);
  showOnSaveAlertModal.value = false;
};

const submitForm = async (data: any) => {
  const method = props.formAction == 'add' ? "POST" : "PUT";
  if (method == 'POST') {
    data.CustomerID = props.selectedCustomer;
  }
  const url = `/api/service/orders/${complaintUniquueId.value}`;

  await useApiFetch(url, {
    method: method,
    body: data,
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
        emit('close')
      }
    },
  });
};

watch(() => serialGridMeta.value.serials, () => {
  if (serialGridMeta.value.serials.length > 0) {
    const uniqueIDFound = serialGridMeta.value?.serials.find(serial => serial?.serial === props.selectedSerial)
    if (uniqueIDFound) onSerialSelect({ UniqueID: uniqueIDFound.UniqueID, class: "bg-gray-200", serial: props.selectedSerial })
  }
})
watch(() => complaintGridMeta.value.complaints, () => {
  if (complaintGridMeta.value.complaints.length > 0) {
    const uniqueIDFound = complaintGridMeta.value?.complaints.find(complaint => complaint?.COMPLAINTNUMBER === props.selectedComplaint)
    if (uniqueIDFound) onComplaintSelect(uniqueIDFound)
  }
})

if (props.selectedCustomer) {
  editInit()
}
else {
  propertiesInit()
}
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="serviceOrderInfo" @submit="onSubmit">
    <div class="w-full px-3 py-1 gmsPurpleTitlebar">
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
                {{ formData.fname ? formData.fname : '' }} {{ formData.lname ? formData.lname : '' }}
              </div>
              <div>
                {{ formData.company1 ? formData.company1 : '' }}
              </div>
              <div>
                {{ formData.company2 ? formData.company2 : '' }}
              </div>
              <div>
                {{ formData.address ? formData.address : '' }}
              </div>
              <div>
                {{ formData.city ? formData.city : '' }} {{ formData.state ? `, ${formData.state}` : '' }} {{ formData.zip ? `,
                ${formData.zip}`:'' }}
              </div>
              <div class="flex flex-row">
                <div class="basis-1/2">
                  {{ formData.homephone ? `H: ${formData.homephone}` : '' }}
                </div>
                <div class="basis-1/2">
                  {{ formData.workphone ? `W: ${formData.workphone}` : '' }}
                </div>
              </div>
              <div>
                {{ formData.cellphone ? `C: ${formData.cellphone}` : '' }}
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
                {{ formData.billcompany1 ? formData.billcompany1 : '' }}
              </div>
              <div>
                {{ formData.billcompany2 ? formData.billcompany2 : '' }}
              </div>
              <div>
                {{ formData.billaddress ? formData.billaddress : '' }}
              </div>
              <div>
                {{ formData.billcity ? formData.billcity : '' }} {{ formData.billstate ? `, ${formData.billstate}` : '' }}
                {{ formData.billzip ? `, ${formData.billzip}` : '' }}
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
            <UFormGroup label="Select Serial" name="serial">
              <UTable :columns="serialGridMeta.defaultColumns" :rows="serialGridMeta.serials"
                :class="formValidationErrors?.find(e => e.path === 'serial') ? 'border-red-500 w-full' : 'w-full'" :ui="{
                  wrapper: 'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
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
                }" @select="onSerialSelect">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="View Orders" name="orders">
              <UTable :rows="complaintGridMeta.complaints" :columns="complaintGridMeta.defaultColumns" :ui="{
                wrapper: 'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
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
              }" @select="onComplaintSelect">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
          </div>
          <div class="basis-1/2">
            <div class="flex flex-col">
              <div>
                <UFormGroup label="View Invoice" name="invoice">
                  <UTable :rows="invoiceGridMeta.invoices" :columns="invoiceGridMeta.defaultColumns" :ui="{
                    wrapper: 'h-[100px] border border-gray-400 dark:border-gray-700 gms-ModalFormText',
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
                  }" @select="onInvoiceSelect" @dblclick="onInvoiceDblClick">
                    <template #empty-state>
                      <div></div>
                    </template>
                  </UTable>
                </UFormGroup>
              </div>
              <div class="flex flex-row space-x-1 mt-1">
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="New" variant="outline" color="green"
                    :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                    @click="onNewInvoiceBtnClick" />
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="Link" variant="outline" color="green"
                    :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate @click="onLinkBtnClick" />
                </div>
                <div class="basis-1/3 w-full">
                  <UButton icon="i-heroicons-minus-circle-20-solid" label="Unlink" variant="outline" color="red"
                    :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate @click="onUnlinkBtnClick" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="mt-2">
          <div class="pl-3 gmsPurpleTitlebar">
            Service Reports
          </div>
          <div class="flex flex-col p-3 bg-gray-300 space-x-4">
            <div class="flex flex-row">
              <div class="basis-3/5 px-2">
                <UTable :rows="serviceReportGridMeta.serviceReports" :columns="serviceReportGridMeta.defaultColumns"
                  :ui="{
                    wrapper: 'h-24 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
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
                  }" @select="onServiceReportSelect" @dblclick="onServiceReportDblClick">
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
                <div class="flex justify-between mt-1">
                  <div class="italic flex items-center">
                    Doubleclick to view
                  </div>
                  <div>
                    <UButton icon="i-f7-rays" label="Clear Selection" variant="outline" color="red"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
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
                  <UButton icon="i-heroicons-check-badge-20-solid" label="View Inventory Transaction" variant="outline"
                    :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                    @click="onViewInventoryTransactioBtnClick" />
                </div>
              </div>
              <div class="basis-2/5 px-2">
                <div class="w-full">
                  <UButton icon="i-heroicons-plus-20-solid" label="Create Service Report" variant="outline"
                    color="green" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                    @click="onServiceReportBtnClick" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2 border-[1px] border-slate-600 border-l-0 border-b-0 border-t-0">
        <div class="w-full bg-slate-400 px-3 py-1 gmsPurpleTitlebar">
          Service Order
        </div>
        <div class="flex flex-row px-3 py-2">
          <div class="basis-5/12 leading-6">
            <div class="font-bold">{{ serviceOrderInfo?.COMPLAINTNUMBER ? `# ${serviceOrderInfo.COMPLAINTNUMBER}` : '' }}
            </div>
            <div>{{ serviceOrderInfo?.PRODUCTDESC }}</div>
            <div>{{ serviceOrderInfo?.SERIALNO ? `Serial ${serviceOrderInfo.SERIALNO}` : '' }}</div>
          </div>
          <UFormGroup name="modelNo" class="hidden">
            <UInput v-model="serviceOrderInfo.MODELNO" />
          </UFormGroup>
          <div class="basis-4/12">
            <div class="flex flex-row">
              <div class="flex items-center w-[35px] font-medium">Date</div>
              <div class="flex-1 px-4">
                <UFormGroup name="complaintDate">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="serviceOrderInfo.COMPLAINTDATE && format(serviceOrderInfo.COMPLAINTDATE, 'MM/dd/yyyy')"
                      variant="outline"
                      :class="formValidationErrors?.find(e => e.path === 'complaintDate') ? 'ring-red-500' : ''"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="serviceOrderInfo.COMPLAINTDATE" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row mt-3">
              <div class="flex items-center w-[35px] font-medium">By</div>
              <div class="flex-1 px-4">
                <USelect v-model="serviceOrderInfo.RECBY" :options="serviceOrderInfo.RECBYOptions" />
              </div>
            </div>
          </div>
          <div class="basis-3/12">
            <UFormGroup name="openCase">
              <div class="flex flex-row space-x-5">
                <URadio v-for="status of statusGroup" :key='status.value' v-model="serviceOrderInfo.OPENCASE"
                  v-bind="status" />
              </div>
            </UFormGroup>
            <div class="mt-6 flex items-center">
              Warranty Period: {{ WARRANTYUNTIL }}
            </div>
          </div>
        </div>
        <div class="px-3 py-0">
          <UFormGroup label="Description" name="description">
            <UTextarea v-model="serviceOrderInfo.COMPLAINT" />
          </UFormGroup>
        </div>
        <div class="px-3 py-0 mt-1">
          <div class="flex flex-row border border-gray-500 rounded-md py-1">
            <div class="basis-5/12 flex items-center ml-2">
              Death, Serious Injury, or Risk of Either?
            </div>
            <UFormGroup name="injuryReportNo" class="basis-3/12 flex flex-row items-center">
              <div class="flex flex-row space-x-5 items-center">
                <URadio v-for="riskStatus of riskStatusGroup" :key='riskStatus.value'
                  v-model="serviceOrderInfo.INJURYREPORTNO" v-bind="riskStatus" />
              </div>
            </UFormGroup>
            <div class="basis-4/12 flex flex-row space-x-5 justify-center">
              <UButton label="VIEW#1" color="gms-purple" @click="onView1BtnClick" />
              <UButton label="VIEW#2" color="gms-purple" @click="onView2BtnClick" />
            </div>
          </div>
        </div>
        <div class="px-3 py-0 mt-1">
          <div class="flex flex-col border border-gray-500 rounded-md px-2 py-1">
            <span class="text-sm font-semibold">Product Returned</span>
            <div class="flex flex-row space-x-3">
              <div class="basis-3/12">
                <UFormGroup label="Received" name="received">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="date && format(date, 'd MMM, yyy')"
                      variant="outline" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="receivedDate" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-2/12">
                <UFormGroup label="NC#" name="nc">
                  <UInput v-model="serviceOrderInfo.NONCONFORMANCE" />
                </UFormGroup>
              </div>
              <div class="basis-4/12">
                <UFormGroup label="Accessories Received" name="accessories received">
                  <UInput v-model="accessories" />
                </UFormGroup>
              </div>
              <div class="basis-3/12 flex items-end">
                <UButton color="green" variant="outline" icon="i-heroicons-plus-20-solid" label="Receive"
                  :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate @click="onReceiveBtnClick" />
              </div>
            </div>

          </div>
          <div class="flex flex-row space-x-3 mt-2">
            <div class="basis-1/4">
              <UButton type="submit" icon="i-heroicons-document-text-20-solid" label="Save" color="green"
                variant="outline" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye-20-solid" label="Preview Order" variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                @click="onPreviewOrderViewBtnClick" />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye-20-solid" label="Preview Label" variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-f7-rays" label="Clear Form" color="red" variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full gmsPurpleTitlebar px-3 py-1">
          Type of Services
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-1/2">
            <UFormGroup label="Select" name="select">
              <USelect v-model="serviceOrderInfo.ValidComplaintReason"
                :options="['', 'Warranty', 'Quote', 'Billable', 'Complaint', 'Installation', 'Checkup', 'Info Only']" />
              <!-- :options="typeOfServiceInfo.reasonOptions" -->
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup label="Failure Comment" name="failure">
              <UInput v-model="serviceOrderInfo.FAILINVEST" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full p-3 border border-gray-500">
            <UFormGroup label="Investigation Required" name="investigation">
              <UTable :rows="investigationGridMeta.investigations" :columns="investigationGridMeta.defaultColumns" :ui="{
                wrapper: 'h-32 border-2 border-gray-400 dark:border-gray-700 gms-ModalFormText',
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
              }" @select="onInvestigationSelect" @dblclick="onInvestigationDblClick">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </UFormGroup>
            <div class="flex flex-row space-x-4 justify-end mt-2">
              <div class="w-[120px]">
                <UButton icon="i-heroicons-plus-20-solid" variant="outline" color="green" label="Add"
                  :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                  @click="onInvestigationAddBtnClick" />
              </div>
              <div class="w-[120px]">
                <UButton icon="i-heroicons-minus-circle-20-solid" variant="outline" color="red" label="Remove"
                  :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
                  @click="onInvestigationRemoveBtnClick" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="serviceOrderInfo.OPENCASE === '1' && serviceOrderInfo.CLOSEDOUTBY" class="w-full text-center">
          {{ serviceOrderInfo.CLOSEDOUTBY }}
        </div>
      </div>
    </div>
  </UForm>
  <!-- Service Report Modal -->
  <UDashboardModal v-model="modalMeta.isServiceReportModalOpen" title="Service Report" :ui="{
    title: 'text-lg text-white',
    header: { base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader' },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <ServiceReportDetail :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID"
      :selected-service-report="selectedServiceReportID" @save="onServiceReportSave" @close="onServiceReportClose" />
  </UDashboardModal>
  <!-- Inventory Transaction Modal -->
  <UDashboardModal
    v-model="modalMeta.isInventoryTransactionModalOpen"
    title="Inventory Transactions"
      :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
      }"
  >
    <MaterialsTransactionsInventoryTransactions />
  </UDashboardModal>
  <!-- New Invoice Modal -->
  <UDashboardModal
    v-model="modalMeta.isInvoiceModalOpen"
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
    <InvoiceDetail :selected-customer="props.selectedCustomer" :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID" @save="onNewInvoiceSave" @close="onNewInvoiceModalClose"/>
  </UDashboardModal>
  <!-- Link Invoice Modal -->
  <UDashboardModal
    v-model="modalMeta.isInvoiceListModalOpen"
    title="Sales"
    :ui="{
      title: 'text-lg text-white',
      header: { base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader' }, 
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[900px] sm:max-w-9xl'
    }"
  >
    <InvoiceList :selected-customer="props.selectedCustomer" @close="onInvoiceLinkModalClose" @link="onInvoiceLink"/>
  </UDashboardModal>
  <!-- Investigation Modal -->
  <UDashboardModal v-model="modalMeta.isInvestigationModalOpen" title="Root Cause Investigation" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl'
  }">
    <EngineeringInvestigationDetail
      :selected-investigation="investigationGridMeta.selectedInvestigation?.investigationID ?? null"
      @close="onInvestigationModalClose" @link="onInvestigationAdd" />
  </UDashboardModal>
  <!-- Non conformance Modal -->
  <UDashboardModal v-model="modalMeta.isNonConformanceModalOpen" title="Non Conformance" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl'
  }">
    <EngineeringNonconformanceDetail @link="onNonConformanceLink" @close="onNonConformanceModalClose" />
  </UDashboardModal>
  <!-- Injury Report1 Modal -->
  <UDashboardModal v-model="modalMeta.isInjuryReport1ModalOpen" title="Patient Injury Report" :ui="{
    title: 'text-lg text-white',
    header: { base: 'flex flex-row min-h-[0] items-center bg-gms-teal mt-0 gms-modalHeader' },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[900px] sm:max-w-9xl'
  }">
    <ServiceOrderInjuryReport :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID"
      @close="onInjuryReport1ModalClose" />
  </UDashboardModal>
  <!-- Injury Report2 Modal -->
  <UDashboardModal v-model="modalMeta.isInjuryReport2ModalOpen" title="Patient Injury Report#2" :ui="{
    title: 'text-lg text-white',
    header: { base: 'flex flex-row min-h-[0] items-center bg-gms-teal mt-0 gms-modalHeader' },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[900px] sm:max-w-9xl'
  }">
    <ServiceOrderInjuryReport2 :selected-complaint="complaintGridMeta.selectedComplaint?.uniqueID"
      @close="onInjuryReport2ModalClose" />
  </UDashboardModal>

  <UDashboardModal v-model="warnMsg.warnMsgModalOpen"
    description="You cannot close a service order that has open service reports. Please close any open service reports prior to closing this order."
    :ui="{
      description: { base: 'text-lg' }, // Increase description text size
      footer: { base: 'flex  justify-end pr-6' } // Center footer content
    }">
    <template #footer>
      <UButton label="ok" variant="outline" color="red" :ui="{ base: 'w-24', truncate: 'flex justify-center w-full' }"
        truncate @click="warnMsg.warnMsgModalOpen = false" />
    </template>
  </UDashboardModal>


  <!-- Service Order On Save Modal -->
  <UDashboardModal v-model="showOnSaveAlertModal"
    description="The System will now relieve inventory and close this complaint. Are you sure you wish to continue?"
    :ui="{
      description: { base: 'text-lg' }, // Increase description text size
      footer: { base: 'flex  justify-end pr-6' } // Center footer content
    }">
    <template #footer>
      <UButton label="Yes" variant="outline" color="green" :ui="{ base: 'w-24', truncate: 'flex justify-center w-full' }"
        truncate @click="confirmSave" />
      <UButton label="No" variant="outline" color="red" :ui="{ base: 'w-24', truncate: 'flex justify-center w-full' }"
        truncate @click="showOnSaveAlertModal = false" />
      <UButton label="Cancel" variant="outline" color="black"
        :ui="{ base: 'w-24', truncate: 'flex justify-center w-full' }" truncate @click="showOnSaveAlertModal = false" />
    </template>
  </UDashboardModal>

</template>
