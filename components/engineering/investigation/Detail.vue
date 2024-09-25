<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import type { UTableColumn } from '~/types';
import { format } from 'date-fns'

const emit = defineEmits(['close', 'link'])
const props = defineProps({
  selectedInvestigation: {
    type: [Number, String, null],
    required: true
  },
})
const toast = useToast()
const loadingOverlay = ref(false)
const formData = reactive({
  uniqueID: null,
  PRODLLINE: null,
  DIAGDATE: null,
  DESCRIPTION: null,
  PROBELMDESC: null,
  DIAGBY: null,
  PREVENTPROB: null,
  PROBLEMDIAG: null,
  Status: null,
  IMPLEMENTBY: null,
  IMPLEMENTDATE: null
})
const investigationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'uniqueID',
      label: '#',
      filterable: true
    }, {
      key: 'PRODLINE',
      label: 'Product Line',
      filterable: true,
      filterOptions: []
    }, {
      key: 'DIAGDATE',
      label: 'Date',
      filterable: true
    }, {
      key: 'DESCRIPTION',
      label: 'Description',
      filterable: true
    }, {
      key: 'Status',
      label: 'Status',
    }
  ],
  investigations: [],
  selectedInvestigation: null,
  isLoading: false
})
const complaintGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'COMPLAINTDATE',
      label: 'Date',
      filterable: true
    }, {
      key: 'SERIALNO',
      label: 'Serial',
      filterable: true
    }, {
      key: 'COMPLAINTNUMBER',
      label: 'Complaint#',
      filterable: true
    }, {
      key: 'Shipdate',
      label: 'Ship Date',
      filterable: true
    }
  ],
  complaints: [],
  selectedComplaint: null,
  isLoading: false
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
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' }
])
const selectedStatus = ref('open')
const filterValues = ref({
  uniqueID: null,
  PRODLINE: null,
  Status: true,
  DIAGDATE: null,
  DESCRIPTION: null
})

const editInit = async () => {
  loadingOverlay.value = true
  await propertiesInit()
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await fetchInvestigationList();
  loadingOverlay.value = false
}
const fetchInvestigationList = async () => {
  await useApiFetch(`/api/engineering/investigations`, {
    method: 'GET',
    params: {
      ...filterValues.value
    },
    onResponse({ response }) {
      if (response.status === 200) {
        investigationGridMeta.value.investigations = response._data.body
      }
    }
  })
}
const handleFilterChange = async (event, name) => {
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  await fetchInvestigationList()
}
const onInvestigationSelect = async (row) => {
  investigationGridMeta.value.selectedInvestigation = { ...row, class: "" }
  investigationGridMeta.value.investigations.forEach((investigation) => {
    if (investigation.uniqueID === row.uniqueID) {
      investigation.class = 'bg-gray-200'
    } else {
      delete investigation.class
    }
  })
}
const onInvestigationDblclick = () => {
  emit('link', investigationGridMeta.value.selectedInvestigation?.uniqueID)
  emit('close')
}
const validate = (state: any): FormError[] => {
  const errors = []

  return errors
}
async function onSubmit(event: FormSubmitEvent<any>) {
  emit('close')
}
watch(() => filterValues.value.Status, () => { fetchInvestigationList() })
if (props.selectedInvestigation)
  editInit()
else
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="formData" @submit="onSubmit">

    <div class="flex flex-col">
      <div class="flex justify-end px-3 py-1 gmsBlueHeader">
        <div class="w-1/6">
          <UButton
            color="green"
            variant="outline"
            :loading="exportIsLoading"
            label="Export to Excel"
            trailing-icon="i-heroicons-document-text"
            @click="excelExport"
            block
          />
        </div>
      </div>
      <div class="flex border-b-[3px] border-black">
        <div class="w-2/3 border-r-[3px] border-black">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Lookup
          </div>
          <div class="flex flex-col space-y-2 p-3">
            <div class="flex justify-end">
              <UCheckbox v-model="filterValues.Status" label="Show Open Only" class="" />
            </div>
            <UTable :rows="investigationGridMeta.investigations" :columns="investigationGridMeta.defaultColumns"
              class="w-full" :ui="{
              wrapper: 'h-[225px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white',
                padding: 'p-0'
              },
              td: {
                padding: 'py-0'
              }
              }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
              @select="onInvestigationSelect" @dblclick="onInvestigationDblclick">
              <template v-for="column in investigationGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                <template v-if="column.kind !== 'actions'">
                  <template v-if="column.key === 'PRODLINE'">
                    <div class="min-w-[160px]">
                      <div class="p-1">
                        <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                          :filter-key="column.key" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template v-else class='bg-slate-400'>
                  <div class="flex justify-center text-center w-[53px]">
                    {{ column.label }}
                  </div>
                </template>
              </template>
              <template #empty-state>
                <div></div>
              </template>
            </UTable>
          </div>
        </div>
        <div class="w-1/3">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Complaints
          </div>
          <div class="flex p-3">
            <div class="">
              <UTable :rows="complaintGridMeta.complaints" :columns="complaintGridMeta.defaultColumns" class="w-full"
                :ui="{
              wrapper: 'h-[253px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white',
                padding: 'p-0'
              },
              td: {
                padding: 'py-0'
              }
                }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
                <template v-for="column in complaintGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                  <template v-if="column.key === 'Shipdate'">
                    <div class="min-w-[160px]">
                      <div class="p-1">
                        <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                          :filter-key="column.key" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
          </div>
        </div>
      </div>

      <div class="flex border-b-[3px] border-black">
        <div class="w-2/3  border-r-[3px] border-black">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Investigation
          </div>
          <div class="flex flex-col space-y-2 p-3">
            <div class="flex flex-row space-x-2">
              <div class="basis-1/12">
                <UFormGroup label="Number">
                  <div class="">
                    {{ formData.uniqueID }}
                  </div>
                </UFormGroup>
              </div>
              <div class="basis-3/12">
                <UFormGroup label="Product Line">
                  <USelect v-model="formData.PRODLLINE" :options="[formData.PRODLLINE]" />
                </UFormGroup>
              </div>
              <div class="basis-3/12">
                <UFormGroup label="Date">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="formData.DIAGDATE && format(formData.DIAGDATE, 'MM/dd/yyyy HH:mm:ss')" variant="outline"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="formData.DIAGDATE" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-5/12">
                <UFormGroup label="Description">
                  <UInput v-model="formData.DESCRIPTION" />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="basis-5/6">
                <UFormGroup label="Define Investigations?">
                  <UInput v-model="formData.PROBELMDESC" />
                </UFormGroup>
              </div>
              <div class="basis-1/6">
                <UFormGroup label="Diagnosed By">
                  <USelect v-model="formData.DIAGBY" :options="[formData.DIAGBY]" />
                </UFormGroup>
              </div>
            </div>
            <div class="w-full">
              <UFormGroup label="Investigation(Use the 5 Whys Method at a minium)">
                <UTextarea v-model="formData.PROBELMDESC" :rows="6" />
              </UFormGroup>
            </div>
            <div class="w-full">
              <UFormGroup label="Root Cause">
                <UInput v-model="formData.PROBLEMDIAG" />
              </UFormGroup>
            </div>
            <div class="flex justify-between">
              <div class="flex flex-row gap-5 p-2 border-[1px] border-slate-400">
                <URadio v-for="status of statusGroup" :key='status.value' v-model="selectedStatus" v-bind="status" />
              </div>
              <div class="flex flex-row space-x-2">
                <div class="flex items-center font-medium">
                  Closed By
                </div>
                <div class="flex items-center min-w-[200px]">
                  <div class="w-full">
                    <USelect v-model="formData.IMPLEMENTBY" />
                  </div>
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <div class="flex items-center font-medium">
                  Closed Date
                </div>
                <div class="flex items-center min-w-[200px]">
                  <div class="w-full">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid"
                        :label="serviceOrderInfo.COMPLAINTDATE && format(serviceOrderInfo.COMPLAINTDATE, 'MM/dd/yyyy')"
                        variant="outline" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="date" is-required @close="close" />
                      </template>
                    </UPopover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/3 flex flex-col">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            CAPAS
          </div>
          <div class="flex flex-col p-3 space-y-2">
            <div class="">
              <UTable :rows="complaintGridMeta.complaints" :columns="complaintGridMeta.defaultColumns" class="w-full"
                :ui="{
              wrapper: 'h-[354px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white',
                padding: 'p-0'
              },
              td: {
                padding: 'py-0'
              }
                }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
                <template v-for="column in complaintGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                  <template v-if="column.key === 'Shipdate'">
                    <div class="min-w-[160px]">
                      <div class="p-1">
                        <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                          :filter-key="column.key" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="w-1/2">
                <UButton color="gms-blue" label="Add CAPA" block />
              </div>
              <div class="w-1/2">
                <UButton color="gms-blue" label="Remove CAPA" block />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between p-3">
        <div class="w-2/3">
          <div class="flex flex-row space-x-2">
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye" label="Preview Report" variant="outline"
              block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-plus" label="Add" color="green" variant="outline"
              block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-pencil" label="Modify" variant="outline"
              block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-f7-rays" label="Clear" color="red" variant="outline"
                block />
            </div>
          </div>
        </div>
        <div class="w-1/3 flex justify-end">
          <div class="w-1/2">
            <UButton icon="i-heroicons-cursor-arrow-ripple" label="Select" variant="outline"
              block />
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
