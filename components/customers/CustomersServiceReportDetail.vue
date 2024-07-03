<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';
  import type { UTableColumn } from '~/types';
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedComplaint: {
      type: [Number, String, null],
      required: true
    },
    selectedServiceReport: {
      type: [Number, String, null],
    }
  })
  const toast = useToast()
  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const loadingOverlay = ref(false)
  const formData = reactive({
    uniqueID: null,
    REPAIRSMADE: null,
    REPAIRDESC: null,
    REPAIRDATE: new Date(),
    REPAIRSBY: null,
    CANO: null,
    COMPLAINTID: props.selectedComplaint,
    Week: null,
    ServiceStatus: 'Closed',
    type: 0,
    FactoryHours: null,
    TravelHours: 0,
    OnsiteHours: 0,
    Miles: null,
    PerDiem: null,
    performs_to_spec: null,
    performsnotext: null,
    Shipping: null,
    DATESHIPPED: null,
    PARTS: null,
    PARTSRECEIVED: null
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
  const warrantyMaterialGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'PARTTYPE',
        label: 'Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'SUBCATEGORY',
        label: 'Sub Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'MODEL',
        label: 'Stock#',
        filterable: true,
      }, {
        key: 'DESCRIPTION',
        label: 'Description',
        filterable: true
      }, {
        key: 'OnHand',
        label: 'Current On Hand',
      }
    ],    
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    warrantyMaterials: [],
    selectedWarrantyMaterial: null,
    isLoading: false
  })
  const selectedWarrantyMaterialGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'Quantity',
        label: 'QTY',
      }, {
        key: 'MODEL',
        label: 'Stock#',
      }, {
        key: 'DESCRIPTION',
        label: 'Description'
      }, {
        key: 'PRIMARYPRICE1',
        label: 'Cost'
      }, {
        key: 'UNIT',
        label: 'Unit'
      }, {
        key: 'Amount',
        label: 'Amount'
      }
    ],
    warrantyMaterials: [],
    selectedWarrantyMaterial: null,
    isLoading: false
  })
  const partGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'PARTTYPE',
        label: 'Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'SUBCATEGORY',
        label: 'Sub Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'MODEL',
        label: 'Stock#',
        filterable: true,
      }, {
        key: 'DESCRIPTION',
        label: 'Description',
        filterable: true
      }, {
        key: 'OnHand',
        label: 'Current On Hand',
      }
    ],    
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    parts: [],
    selectedPart: null,
    isLoading: false
  })
  const selectedPartGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'Quantity',
        label: 'Qty',
      }, {
        key: 'MODEL',
        label: 'Stock#',
      }, {
        key: 'DESCRIPTION',
        label: 'Description'
      }, {
        key: 'PRIMARYPRICE1',
        label: 'Cost'
      }, {
        key: 'UNIT',
        label: 'Unit'
      }, {
        key: 'Amount',
        label: 'Amount'
      }, {
        key: 'Nonconformance',
        label: 'NonConformance'
      }
    ],
    parts: [],
    selectedPart: null,
    isLoading: false
  })
  const warrantyMaterialFilterValues = ref({
    PARTTYPE: null,
    SUBCATEGORY: null,
    MODEL: null,
    DESCRIPTION: null
  })
  const warrantyMaterialInfo = ref({
    shipDate: null,
    shipping:null,
    total: 0
  })
  const partFilterValues = ref({
    PARTTYPE: null,
    SUBCATEGORY: null,
    MODEL: null,
    DESCRIPTION: null
  })
  const selectedStatus = ref('open')
  const statusGroup = ref([
    {value: 'open', label: 'Open'}, 
    {value: 'close', label: 'Closed'}
  ])
  const typeGroup = ref([
    {value: 0, label: 'Factory'}, 
    {value: 1, label: 'Customer'},
    {value: 2, label: 'Field'}
  ])
  const performanceGroup = ref([
    {value: 0, label: 'Yes'}, 
    {value: 1, label: 'No'}
  ])
  const qtyStyle = ref('outline-none')
  const addModalMeta = ref({
    isAddModalOpen: false,
    title: null,
    quantity: 1
  })
  const serviceTechOptions = ref([])

  const getWeekNumber = (date) => {
    date = new Date(date);
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / oneDay);

    const weekNumber = Math.ceil((dayOfYear + 1) / 7);
    return weekNumber
  }
  const editInit = async () => {
    loadingOverlay.value = true
    await useApiFetch('/api/customers/servicereports', {
      method: 'GET',
      params: {
        uniqueID: props.selectedServiceReport
      },
      onResponse({response}) {
        if(response.status === 200) {
          for (const key in response._data.body[0]) {
            if (response._data.body[0][key] !== undefined) {
              formData[key] = response._data.body[0][key]
            }
          }
        }
      }
    })
    let parsedParts = []
    if(formData.PARTS) {
      const tmp = formData.PARTS.split('=')
      for(let i=0; i < tmp.length ; i++) {
        if(tmp[i] !== '' && i % 3 === 0) {
          await useApiFetch('/api/product/parts/', {
            method: 'GET',
            params: {
              UniqueID: tmp[i]
            },
            onResponse({response}) {
              if(response.status === 200) {
                parsedParts.push({...response._data.body[0], Quantity: tmp[i+1], Amount: Number.parseFloat(response._data.body[0].PRIMARYPRICE1 || 0) * Number.parseFloat(tmp[i+1])})
              }
            }
          })
        }
      }
    }
    let parsedPartReceived = []
    if(formData.PARTSRECEIVED) {
      const tmp = formData.PARTSRECEIVED.split('=')
      for(let i=0; i < tmp.length ; i++) {
        if(tmp[i] !== '' && i % 3 === 0) {
          await useApiFetch('/api/product/parts/', {
            method: 'GET',
            params: {
              UniqueID: tmp[i]
            },
            onResponse({response}) {
              if(response.status === 200) {
                parsedPartReceived.push({...response._data.body[0], Quantity: tmp[i+1], Amount: Number.parseFloat(response._data.body[0].PRIMARYPRICE1 || 0) * Number.parseFloat(tmp[i+1]), Nonconformance: 0})
              }
            }
          })
        }
      }
    }
    selectedWarrantyMaterialGridMeta.value.warrantyMaterials = parsedParts
    selectedPartGridMeta.value.parts = parsedPartReceived
    await propertiesInit()
  }
  const propertiesInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: { partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          warrantyMaterialGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'PARTTYPE') column.filterOptions = [null, ...response._data.body]
          })
          partGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'PARTTYPE') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
    await useApiFetch(`/api/tbl/tblEmployee`, { 
      method: 'GET',
      params: {
        ACTIVE: 1,
        orderby: 'payrollnumber'
      },
      onResponse({response}) {
        if(response.status === 200) {
          serviceTechOptions.value = response._data.body.map((item: any) => `#${item.payrollnumber}${item.fname} ${item.lname}`)
          if(serviceTechOptions.value.indexOf(formData.REPAIRSBY) < 0 && formData.REPAIRSBY !== null){
            serviceTechOptions.value.unshift(formData.REPAIRSBY)
          }
          serviceTechOptions.value.unshift(null)
        }
      }
    })
    if(formData.REPAIRDATE && !formData.Week) {
      formData.REPAIRDATE = new Date(formData.REPAIRDATE)
      formData.Week = `${new Date(formData.REPAIRDATE).getFullYear().toString().substring(2)}-${getWeekNumber(formData.REPAIRDATE)}`
    }
    loadingOverlay.value = false
  }
  const warrantyMaterialFetchGridData = async () => {
    await useApiFetch(`/api/product/parts`, {
      method: 'GET',
      params: {...warrantyMaterialFilterValues.value},
      onResponse({ response }) {
        if(response.status === 200) {
          warrantyMaterialGridMeta.value.warrantyMaterials = response._data.body;
        }
      }
    })
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: { partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          warrantyMaterialGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'PARTTYPE') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: { category: warrantyMaterialFilterValues.value.PARTTYPE, partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          warrantyMaterialGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'SUBCATEGORY') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
  }
  const partFetchGridData = async () => {
    await useApiFetch(`/api/product/parts`, {
      method: 'GET',
      params: {...partFilterValues.value},
      onResponse({ response }) {
        if(response.status === 200) {
          partGridMeta.value.parts = response._data.body;
        }
      }
    })
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: { partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          partGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'PARTTYPE') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: { category: partFilterValues.value.PARTTYPE, partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          partGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'SUBCATEGORY') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
  }
  const onWarrantyMaterialFilterChange = (event, name) => {
    if (warrantyMaterialFilterValues.value.hasOwnProperty(name)) {
      warrantyMaterialFilterValues.value[name] = event;
    } else {
      return;
    }
    warrantyMaterialFetchGridData()
  }
  const onPartFilterChange = (event, name) => {
    if (partFilterValues.value.hasOwnProperty(name)) {
      partFilterValues.value[name] = event;
    } else {
      return;
    }
    partFetchGridData()
  }
  const onInvoiceSelect = async (row) => {
    if(JSON.stringify({...invoiceGridMeta.value.selectedInvoice, class:""})=== JSON.stringify({...row, class: ""})) invoiceGridMeta.value.selectedInvoice = null;
    else {
      invoiceGridMeta.value.selectedInvoice = {...row, class:""}
    }
    invoiceGridMeta.value.invoices.forEach((invoice) => {
      if(invoice.UniqueID === row.UniqueID && row.class != 'bg-gray-200') {
        invoice.class = 'bg-gray-200'
      }else{
        delete invoice.class
      }
    })
  }
  const onWarrantyMaterialSelect = async (row) => {
    warrantyMaterialGridMeta.value.selectedWarrantyMaterial = {...row, class:""}
    warrantyMaterialGridMeta.value.warrantyMaterials.forEach((warrantyMaterial) => {
      if(warrantyMaterial.UniqueID === row.UniqueID) {
        warrantyMaterial.class = 'bg-gray-200'
      }else{
        delete warrantyMaterial.class
      } 
    })
  }
  const onWarrantyMaterialDblClick = () => {
    addModalMeta.value.title = 'Warranty'
    addModalMeta.value.quantity = 1
    addModalMeta.value.isAddModalOpen = true
  }
  const onPartSelect = async (row) => {
    partGridMeta.value.selectedPart = {...row, class:""}
    partGridMeta.value.parts.forEach((part) => {
      if(part.UniqueID === row.UniqueID) {
        part.class = 'bg-gray-200'
      }else{
        delete part.class
      } 
    })
  }
  const onPartDblClick = () => {
    addModalMeta.value.title = 'Part'
    addModalMeta.value.quantity = 1
    addModalMeta.value.isAddModalOpen = true
  }
  const onAddWarrantyOrMaterial = () => {
    if(addModalMeta.value.quantity <= 0) {
      qtyStyle.value = 'outline outline-2 outline-[red]'
      return;
    } else qtyStyle.value = 'outline-none'
    if(addModalMeta.value.title === 'Warranty') {
      const index = selectedWarrantyMaterialGridMeta.value.warrantyMaterials.findIndex((value) => value?.UniqueID === warrantyMaterialGridMeta.value.selectedWarrantyMaterial?.UniqueID)
      if(index < 0) {
        if(!warrantyMaterialGridMeta.value.selectedWarrantyMaterial.PRIMARYPRICE1)
          warrantyMaterialGridMeta.value.selectedWarrantyMaterial.PRIMARYPRICE1 = 0
        let amount = Math.round(Number.parseFloat(warrantyMaterialGridMeta.value.selectedWarrantyMaterial.PRIMARYPRICE1) * addModalMeta.value.quantity * 100) /100
        selectedWarrantyMaterialGridMeta.value.warrantyMaterials.push({...warrantyMaterialGridMeta.value.selectedWarrantyMaterial, Quantity: addModalMeta.value.quantity, Amount: amount})
      } 
    } else if(addModalMeta.value.title === 'Part') {
      const index = selectedPartGridMeta.value.parts.findIndex((value) => value?.UniqueID === partGridMeta.value.selectedPart?.UniqueID)
      if(index < 0) {
        if(!partGridMeta.value.selectedPart.PRIMARYPRICE1)
          partGridMeta.value.selectedPart.PRIMARYPRICE1 = 0
        let amount = Math.round(Number.parseFloat(partGridMeta.value.selectedPart.PRIMARYPRICE1) * addModalMeta.value.quantity * 100) /100
        selectedPartGridMeta.value.parts.push({...partGridMeta.value.selectedPart, Quantity: addModalMeta.value.quantity, Amount: amount, Nonconformance: 0})
      }
    } else if(addModalMeta.value.title === 'EditWarranty') {
      selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial.Quantity = addModalMeta.value.quantity
      selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial.Amount = Math.round(Number.parseFloat(selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial.PRIMARYPRICE1) * addModalMeta.value.quantity * 100) /100
      const index = selectedWarrantyMaterialGridMeta.value.warrantyMaterials.findIndex((value) =>  value?.UniqueID === selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial.UniqueID)  
      selectedWarrantyMaterialGridMeta.value.warrantyMaterials[index] = selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial
    } else if(addModalMeta.value.title === 'EditPart') {
      selectedPartGridMeta.value.selectedPart.Quantity = addModalMeta.value.quantity
      selectedPartGridMeta.value.selectedPart.Amount = Math.round(Number.parseFloat(selectedPartGridMeta.value.selectedPart.PRIMARYPRICE1) * addModalMeta.value.quantity * 100) /100
      const index = selectedPartGridMeta.value.parts.findIndex((value) =>  value?.UniqueID === selectedPartGridMeta.value.selectedPart.UniqueID)  
      selectedPartGridMeta.value.parts[index] = selectedPartGridMeta.value.selectedPart
    }
    addModalMeta.value.isAddModalOpen = false
    addModalMeta.value.title = null
  }
  const onSelectedWarrantySelect = (row) => {
    selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial = {...row, class:""}
    selectedWarrantyMaterialGridMeta.value.warrantyMaterials.forEach((item) => {
      if(item.UniqueID === row.UniqueID) {
        item.class = 'bg-gray-200'
      }else{
        delete item.class
      }
    })
  }
  const onSelectedPartSelect = (row) => {
    selectedPartGridMeta.value.selectedPart = {...row, class:""}
    selectedPartGridMeta.value.parts.forEach((item) => {
      if(item.UniqueID === row.UniqueID) {
        item.class = 'bg-gray-200'
      }else{
        delete item.class
      }
    })
  }
  const onSelectedWarrantyDblclick = () => {
    addModalMeta.value.title = 'EditWarranty'
    addModalMeta.value.quantity = selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial.Quantity
    addModalMeta.value.isAddModalOpen = true
  }
  const onSelectedPartDblclick = () => {
    addModalMeta.value.title = 'EditPart'
    addModalMeta.value.quantity = selectedPartGridMeta.value.selectedPart.Quantity
    addModalMeta.value.isAddModalOpen = true
  }
  const onRemoveWarranty = () => {
    if(selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial) {
      selectedWarrantyMaterialGridMeta.value.warrantyMaterials = selectedWarrantyMaterialGridMeta.value.warrantyMaterials.filter((item) => item?.UniqueID !== selectedWarrantyMaterialGridMeta.value.selectedWarrantyMaterial?.UniqueID)
    }
  }
  const onSave = async () => {
    if(!props.selectedServiceReport) {
      await useApiFetch(`/api/customers/servicereports/`, {
        method: 'POST',
        body: {
          ...formData,
          Parts: selectedWarrantyMaterialGridMeta.value.warrantyMaterials,
          PartsReceived: selectedPartGridMeta.value.parts
        },
        onResponse({response}) {
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
    } else {
      await useApiFetch(`/api/customers/servicereports/${props.selectedServiceReport}`, {
        method: 'PUT',
        body: {
          ...formData,
          Parts: selectedWarrantyMaterialGridMeta.value.warrantyMaterials,
          PartsReceived: selectedPartGridMeta.value.parts
        },
        onResponse({response}) {
          toast.add({
              title: "Success",
              description: response._data.message,
              icon: 'i-heroicons-check-circle',
              color: 'green'
            })
        }
      })
    }
    emit('save')
  }
  const validate = (state: any): FormError[] => {
    const errors = []

    return errors
  }
  async function onSubmit(event: FormSubmitEvent<any>) {
    emit('save', event.data)
    emit('close')
  }
  watch(() => formData.REPAIRDATE, () => formData.Week = `${new Date(formData.REPAIRDATE).getFullYear().toString().substring(2)}-${getWeekNumber(formData.REPAIRDATE)}`)
  if(props.selectedServiceReport) 
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
  <UDashboardModal 
    v-model="addModalMeta.isAddModalOpen"
    :ui="{
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'p-0 pt-1' }, 
      body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
      width: 'w-[300px]'
      }"
  >
    <div>
      <div class="flex flex-row space-x-5">
        <div class="flex items-center">Quantity: </div>
        <div class="flex-1 mr-4">
          <UInput type="number" :ui="{base: qtyStyle}" v-model="addModalMeta.quantity" @keypress="(event)=>{if(event.which === 13) onAddWarrantyOrMaterial()}"></UInput>
        </div>
      </div>
      <div class="flex flex-row-reverse mt-2">
        <div class="min-w-[60px]">
          <UButton label="OK" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" type="submit" truncate @click="onAddWarrantyOrMaterial"/>
        </div>
        <div class="min-w-[60px] mr-3">
          <UButton label="Cancel" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="addModalMeta.isAddModalOpen = false"/>
        </div>
      </div>
    </div>
  </UDashboardModal>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    @submit="onSubmit"
  >
    <div class="flex flex-row">
      <div class="basis-2/3 border-[1px] border-slate-600 border-t-0 border-l-0 border-b-0 pb-2">
        <div class="w-full px-3 py-1 bg-slate-400">
          Service Report
        </div>
        <div class="flex flex-row space-x-4 px-2 pr-7 pt-2">
          <div class="basis-2/3 flex flex-col space-y-1">
            <div class="flex flex-row space-x-5">
              <div class="basis-1/2">
                <div class="flex flex-row space-x-2 px-2 pt-1">
                  <div class="font-medium">
                    Report
                  </div>
                  <div>
                    {{ formData.CANO }}
                  </div>
                </div>
              </div>
              <div class="basis-1/2">
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <div class="flex flex-row">
                      <div class="w-[50px] font-medium flex items-center">
                        Date
                      </div>
                      <div class="flex-1">
                        <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.REPAIRDATE && format(formData.REPAIRDATE, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker v-model="formData.REPAIRDATE" is-required @close="close" />
                          </template>
                        </UPopover>
                      </div>
                    </div>
                  </div>
                  <div class="basis-1/2">
                    <div class="flex flex-row">
                      <div class="w-[50px] font-medium flex items-center">
                        Week
                      </div>
                      <div class="flex-1">
                        <UInput v-model="formData.Week"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row space-x-5">
              <div class="basis-1/2 flex items-center w-full border-[1px] border-slate-200 px-3 py-1">
                <div class="flex justify-between w-full">
                  <URadio 
                    v-for="status of statusGroup"
                    :key = 'status.value'
                    v-model="selectedStatus"
                    v-bind="status"
                  />
                </div>
              </div>
              <div class="basis-1/2">
                <div class="flex justify-between">
                  <div class="min-w-[80px] font-medium flex items-center">
                    Service Tech
                  </div>
                  <USelect 
                    v-model="formData.REPAIRSBY"
                    :options="serviceTechOptions"
                  />
                </div>
              </div>
            </div>            
            <div class="flex flex-row space-x-5">
              <div class="basis-1/2 flex items-center w-full border-[1px] border-slate-200 p-3">
                <div class="flex flex-col space-y-1">
                  <div class="flex justify-between w-full">
                    <URadio 
                      v-for="type of typeGroup"
                      :key = 'type.value'
                      v-model="formData.REPAIRDESC"
                      v-bind="type"
                    />
                  </div>
                  <div class="flex flex-row">
                    <div class="w-[90px] font-medium flex items-center">
                      Factory Hrs
                    </div>
                    <div class="flex-1">
                      <UInput v-model="formData.FactoryHours" type="number"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="basis-1/2">
                <div class="flex flex-col space-y-1 border-[1px] border-slate-200 p-1 mt-1">
                  <div class="flex flex-row space-x-3">
                    <div class="basis-1/2">
                      <div class="flex flex-row">
                        <div class="w-[80px] font-medium flex items-center">
                          Travel Hrs
                        </div>
                        <div class="flex-1">
                          <UInput v-model="formData.TravelHours" type="number"/>
                        </div>
                      </div>
                    </div>
                    <div class="basis-1/2">
                      <div class="flex flex-row">
                        <div class="w-[80px] font-medium flex items-center">
                          Miles
                        </div>
                        <div class="flex-1">
                          <UInput v-model="formData.Miles" type="number" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row space-x-3">
                    <div class="basis-1/2">
                      <div class="flex flex-row">
                        <div class="w-[80px] font-medium flex items-center">
                          Onsite Hrs
                        </div>
                        <div class="flex-1">
                          <UInput v-model="formData.OnsiteHours" type="number"/>
                        </div>
                      </div>
                    </div>
                    <div class="basis-1/2">
                      <div class="flex flex-row">
                        <div class="w-[80px] font-medium flex items-center">
                          Per Diem
                        </div>
                        <div class="flex-1">
                          <UInput v-model="formData.PerDiem" type="number"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row space-x-2 pl-3">
              <div class="min-w-[80px] font-medium flex items-center">
                Description
              </div>
              <div class="flex-1">
                <UTextarea 
                  v-model="formData.REPAIRSMADE"
                  :rows="1"
                />
              </div>
            </div>    
          </div>
          <div class="basis-1/3">
            <div class="border-[1px] border-slate-200 p-2 pb-3">
              <UFormGroup
                label="Was device performing per specification?"
              >
                <div class="flex flex-row space-x-5">
                  <URadio 
                    v-for="performance of performanceGroup"
                    :key = 'performance.value'
                    v-model="formData.performs_to_spec"
                    v-bind="performance"
                  />
                </div>
                <UTextarea 
                  v-model="formData.performsnotext"
                  :rows="6"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/3">
        <div class="w-full px-3 py-1 bg-slate-400">
          Invoice
        </div>
        <div class="p-2 pl-7">
          <UTable
            :rows="invoiceGridMeta.invoices"
            :columns="invoiceGridMeta.defaultColumns"
            :ui="{
              wrapper: 'h-[155px] border-2 border-gray-300 dark:border-gray-700',
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
          >
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
          <div class="flex flex-row space-x-2 mt-2">
            <div class="basis-1/3 w-full">
              <UButton icon="i-heroicons-plus-20-solid" label="Look-Up Invoice" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center break-words text-center w-full'}" truncate/>
            </div>
            <div class="basis-1/3 w-full">
              <UButton icon="i-heroicons-plus-20-solid" label="Create Invoice" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center break-words text-center w-full'}" truncate/>
            </div>
            <div class="basis-1/3 w-full">
              <UButton icon="i-heroicons-minus-circle-20-solid" label="Unlink" variant="outline" color="red" :ui="{base: 'w-full', truncate: 'flex justify-center break-words text-center w-full h-full'}" truncate/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="w-full px-3 py-1 bg-slate-400">
          Warranty Material
      </div>
      <div class="flex flex-row space-x-9 p-2">
        <div class="basis-1/2">
          <UTable
            :rows="warrantyMaterialGridMeta.warrantyMaterials"
            :columns="warrantyMaterialGridMeta.defaultColumns"
            :loading="warrantyMaterialGridMeta.isLoading"
            class="w-full"
            :ui="{
              wrapper: 'h-[210px] overflow-y-auto border-2 border-gray-300 dark:border-gray-700',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
              },
              th: { 
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'p-0'
              }, 
              td: {
                base: 'h-[31px]',
                padding: 'py-0'
              }
            }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
            @select="onWarrantyMaterialSelect"
            @dblclick="onWarrantyMaterialDblClick"
          >
            <template v-for="column in warrantyMaterialGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
              <template v-if="!column.filterOptions">
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter 
                    @handle-sorting-button="" 
                    @handle-input-change="onWarrantyMaterialFilterChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                  />
                </div>
              </template>
              <template v-else>
                <div class="px-1 py-1 min-w-[120px]">
                  <CommonSortAndSelectFilter 
                    @handle-sorting-button="" 
                    @handle-select-change="onWarrantyMaterialFilterChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :value="warrantyMaterialFilterValues[column.key]"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                    :filter-options="column.filterOptions"
                  />
                </div>
              </template>
            </template>
            <template #UniqueID-data="{row}">
              <div class="w-[50px]">
                {{ row.UniqueID }}
              </div>
            </template>
            <template #edit-data="{row}">
              <UTooltip text="Detail" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click=""/>
              </UTooltip>
            </template>
            <template #delete-data="{row}">
              <UTooltip text="Delete" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click=""/>
              </UTooltip>
            </template>
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
        </div>
        <div class="basis-1/2">
          <div class="flex flex-row space-x-4 py-1">
            <div class="basis-1/4 flex items-center">
              <div class="flex flex-row space-x-2 ">
                <div class="flex-1 flex items-center">
                  Ship Date
                </div>
                <div class="min-w-[120px] flex items-center">
                  <div class="w-full">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DATESHIPPED && format(formData.DATESHIPPED, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.DATESHIPPED" is-required @close="close" />
                      </template>
                    </UPopover>
                  </div>
                </div>
              </div>
            </div>
            <div class="basis-1/4 flex items-center">
              <div class="flex flex-row space-x-2">
                <div class="flex-1 flex items-center">
                  Shipping
                </div>
                <div class="min-w-[60px]">
                  <UInput v-model="formData.Shipping"/>
                </div>
              </div>
            </div>
            <div class="basis-1/4 flex items-center">
              <div class="flex flex-row w-full">
                <div class="flex-1 flex items-center">
                  Total
                </div>
                <div class="min-w-[80px]">
                  {{ warrantyMaterialInfo.total }}
                </div>
              </div>
            </div>
            <div class="basis-1/4 w-full">
              <UButton label="Remove Part" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="onRemoveWarranty"/>
            </div>
          </div>
          <UTable
            :rows="selectedWarrantyMaterialGridMeta.warrantyMaterials"
            :columns="selectedWarrantyMaterialGridMeta.defaultColumns"
            :loading="selectedWarrantyMaterialGridMeta.isLoading"
            class="w-full"
            :ui="{
              wrapper: 'h-[170px] overflow-y-auto border-2 border-gray-300 dark:border-gray-700',
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
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
            @select="onSelectedWarrantySelect"
            @dblclick="onSelectedWarrantyDblclick"
          >
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="w-full px-3 py-1 bg-slate-400">
          Parts Received
      </div>
      <div class="flex flex-row space-x-3 p-2">
        <div class="basis-1/2">
          <UTable
            :rows="partGridMeta.parts"
            :columns="partGridMeta.defaultColumns"
            :loading="partGridMeta.isLoading"
            class="w-full"
            :ui="{
              wrapper: 'h-[210px] overflow-y-auto border-2 border-gray-300 dark:border-gray-700',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
              },
              th: { 
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'p-0'
              }, 
              td: {
                base: 'h-[31px]',
                padding: 'py-0'
              }
            }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
            @select="onPartSelect"
            @dblclick="onPartDblClick"
          >
            <template v-for="column in partGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
              <template v-if="!column.filterOptions">
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter 
                    @handle-sorting-button="" 
                    @handle-input-change="onPartFilterChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                  />
                </div>
              </template>
              <template v-else>
                <div class="px-1 py-1 min-w-[120px]">
                  <CommonSortAndSelectFilter 
                    @handle-sorting-button="" 
                    @handle-select-change="onPartFilterChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :value="partFilterValues[column.key]"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                    :filter-options="column.filterOptions"
                  />
                </div>
              </template>
            </template>
            <template #UniqueID-data="{row}">
              <div class="w-[50px]">
                {{ row.UniqueID }}
              </div>
            </template>
            <template #edit-data="{row}">
              <UTooltip text="Detail" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click=""/>
              </UTooltip>
            </template>
            <template #delete-data="{row}">
              <UTooltip text="Delete" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click=""/>
              </UTooltip>
            </template>
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
          <div class="italic">
            Parts(Double-Click To Select)
          </div>
        </div>
        <div class="basis-1/2">
          <UTable
            :rows="selectedPartGridMeta.parts"
            :columns="selectedPartGridMeta.defaultColumns"
            :loading="selectedPartGridMeta.isLoading"
            class="w-full"
            :ui="{
              wrapper: 'h-[210px] overflow-y-auto border-2 border-gray-300 dark:border-gray-700',
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
            @select="onSelectedPartSelect"
            @dblclick="onSelectedPartDblclick"
          >
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
          <div class="italic">
            Singleclick to Select Part for Non-Conformamce, Double Click to View
          </div>
        </div>
      </div>
      <div class="flex justify-between px-2">
        <div class="basis-1/6 w-full">
          <UButton icon="i-heroicons-document" label="Save" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate @click="onSave"/>
        </div>
        <div class="basis-1/6 w-full">
          <UButton icon="i-heroicons-magnifying-glass" label="View Order" variant="outline" color="primary" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
        </div>
        <div class="basis-1/6 w-full">
          <UButton icon="i-heroicons-currency-dollar" label="Quickbooks" variant="outline" color="primary" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
        </div>
        <div class="basis-1/6 w-full">
          <UButton icon="i-heroicons-minus-circle" label="Remove Part" variant="outline" color="red" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
        </div>
        <div class="">
          <UButton icon="i-heroicons-document" label="Non-Conformance Create/View" variant="outline" color="green" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
        </div>
        <div class="min-w-[100px]">
          <div class="flex justify-between font-medium">
            <div class="flex items-center">
              Total:  
            </div>
            <div class="flex items-center">
              0.00
            </div>
          </div>
        </div>
      </div>
    </div>

  </UForm>
</template>
