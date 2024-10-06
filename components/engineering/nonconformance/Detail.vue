<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import type { UTableColumn } from '~/types';
import { format } from 'date-fns'

const emit = defineEmits(['close', 'link'])
const props = defineProps({
  selectedNonConformance: {
    type: [Number, String, null],
  },
})
const toast = useToast()
const loadingOverlay = ref(false)
const formData = reactive({
  uniqueID: null,
  SERIAL: null,
  STATUS: null,
  TAGASSIGNEDTO: null,
  TAGLOCATION: null,
  PARTS: null,
  DISPOSITION: null,
  Justification: null,
  OpenClosed: null,
})
const tagEntryFormData = ref({
  poNum: 0,
  on: 0,
  serviceReportNum: 0,
  jobNum: 0,
  investigationNum: 0
})
const nonConformanceGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'uniqueID',
      label: 'Number',
      filterable: true
    }, {
      key: 'STATUS',
      label: 'Status',
      filterable: true,
      filterOptions: []
    }, {
      key: 'TAGASSIGNEDTO',
      label: 'Assigned To',
      filterable: true,
      filterOptions: []
    }, {
      key: 'TAGLOCATION',
      label: 'Location',
      filterable: true,
      filterOptions: []
    }, {
      key: 'PARTS',
      label: 'Description',
      filterable: true
    }, {
      key: 'COMPLAINTNUMBER',
      label: 'SO#',
      filterable: true
    }, {
      key: 'SERVICEREPORT',
      label: 'Service Report#',
      filterable: true
    }, {
      key: 'JobNum',
      label: 'Job#',
      filterable: true
    }, {
      key: 'InvestigationNum',
      label: 'Inv#',
      filterable: true
    }
  ],
  nonConformances: [],
  selectedNonConformance: null,
  isLoading: false
})
const tagEntriesGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'DateTime',
      label: 'Date',
      filterable: true
    }, {
      key: 'ReceivedQty',
      label: 'Qty',
      filterable: true
    }, {
      key: 'ByEmployee',
      label: 'By',
      filterable: true,
      filterOptions: []
    }, {
      key: 'Status',
      label: 'Status',
      filterable: true,
      filterOptions: []
    }, {
      key: 'AssignedtoEmploye',
      label: 'Assigned To',
      filterable: true,
      filterOptions: []
    }, {
      key: 'Location',
      label: 'Location',
      filterable: true,
      filterOptions: []
    }
  ],
  tagEntries: [],
  selectedTagEntry: null,
  isLoading: false
})
const filterValues = ref({
  uniqueID: null,
  STATUS: null,
  TAGASSIGNEDTO: null,
  TAGLOCATION: null,
  PARTS: null,
  COMPLAINTNUMBER: null,
  SERVICEREPORT: null,
  JobNum: null,
  InvestigationNum: null,
  OpenClosed: null
})
const checkStatusGroup = ref([
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
]);

const editInit = async () => {
  loadingOverlay.value = true
  await propertiesInit()
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await fetchNonConformances();
  loadingOverlay.value = false
}
const fetchNonConformances = async () => {
  await useApiFetch(`/api/engineering/nonconformances`, {
    method: 'GET',
    params: {
      ...filterValues.value
    },
    onResponse({ response }) {
      if (response.status === 200) {
        nonConformanceGridMeta.value.nonConformances = response._data.body
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
  await fetchNonConformances()
}
const onNonConformanceSelect = async (row) => {
  nonConformanceGridMeta.value.selectedNonConformance = { ...row, class: "" }
  nonConformanceGridMeta.value.nonConformances.forEach((nonConformance) => {
    if (nonConformance.uniqueID === row.uniqueID) {
      nonConformance.class = 'bg-gray-200'
    } else {
      delete nonConformance.class
    }
  })
}
const onNonConformanceDblclick = () => {
  emit('link', nonConformanceGridMeta.value.selectedNonConformance?.uniqueID)
  emit('close')
}
const validate = (state: any): FormError[] => {
  const errors = []

  return errors
}
async function onSubmit(event: FormSubmitEvent<any>) {
  emit('close')
}
watch(() => filterValues.value.OpenClosed, () => { fetchNonConformances() })
if (props.selectedNonConformance)
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
      <div class="w-full px-3 py-1 gmsBlueTitlebar flex flex-row justify-between items-center">
        <div>Part Lookup</div>
        <div class="flex space-x-2 items-center">
          <div class="bg-gms-gray-100">
            <UCheckbox v-model="filterValues.OpenClosed" label="Open" />
          </div>
          <UButton icon="i-heroicons-eye" label="Summary" variant="outline" />
        </div>
      </div>


      <div class="w-full px-4 py-2">
        <UTable :rows="nonConformanceGridMeta.nonConformances" :columns="nonConformanceGridMeta.defaultColumns"
          :loading="nonConformanceGridMeta.isLoading" class="w-full" :ui="{
            wrapper: 'overflow-auto h-48 border border-gray-400 dark:border-gray-700',
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
              padding: 'py-0'
            }
          }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
          @select="onNonConformanceSelect" @dblclick="onNonConformanceDblclick">
          <template v-for="column in nonConformanceGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="!column.filterOptions">
              <template v-if="column.key === 'SERVICEREPORT' || 'TAGASSIGNEDTO'">
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                    :filterable="column.filterable" :filter-key="column.key" />
                </div>
              </template>
              <template v-else>
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                    :filterable="column.filterable" :filter-key="column.key" />
                </div>
              </template>
            </template>
            <template v-else>
              <div class="px-1 py-1">
                <CommonSortAndSelectFilter @handle-select-change="handleFilterChange" :label="column.label"
                  :filterable="column.filterable" :filter-key="column.key" :filter-options="column.filterOptions" />
              </div>
            </template>
          </template>
        </UTable>
      </div>

      <div class="w-full px-3 py-1 gmsBlueTitlebar">
        <h2>Non Conformance</h2>
      </div>

      <div class="flex flex-col space-y-3 px-4 py-2 pb-4">
        <div class="flex flex-row space-x-2 items-end">
          <div class="basis-1/6">
            <UFormGroup label="NonConformance#">
              <UInput v-model="formData.uniqueID" />
            </UFormGroup>
          </div>
          <div class="basis-1/6">
            <UFormGroup label="Serial/Part#">
              <UInput v-model="formData.SERIAL" />
            </UFormGroup>
          </div>
          <div class="basis-1/12">
            <UButton label="Find" block />
          </div>
          <div class="basis-1/12">
            <UButton label="Find Part" block/>
          </div>
          <div class="basis-3/6">
            <UFormGroup label="Description">
              <UInput v-model="formData.PARTS" />
            </UFormGroup>
          </div>
          </div>


          <div class="flex flex-row space-x-2 items-justify">
            <div class="basis-5/12">
              <UFormGroup label="Disposition Determination (Per Tag)">
                <UTextarea v-model:model-value="formData.DISPOSITION" :rows="3" />
              </UFormGroup>
            </div>
            <div class="basis-5/12">
              <UFormGroup label="Justification (Per Tag)">
                <UTextarea v-model:model-value="formData.Justification" :rows="3" />
              </UFormGroup>
            </div>
            <div class="basis-2/12 flex flex-col justify-between">
              <div class="flex gap-5">
                <URadio v-for="status of checkStatusGroup" :key="status.value" v-model="formData.OpenClosed"
                  v-bind="status" class="pb-3" />
              </div>
              <div>
                <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline"
                  block />
              </div>
            </div>
          </div>
        </div>


        <div class="w-full px-3 py-1 gmsBlueTitlebar">
          <h2>Tag Entries</h2>
        </div>
        <div class="flex flex-row space-x-3 px-4 py-2">
          <div class="basis-8/12">
            <UTable :rows="tagEntriesGridMeta.tagEntries" :columns="tagEntriesGridMeta.defaultColumns"
              :loading="tagEntriesGridMeta.isLoading" class="w-full" :ui="{
                wrapper: 'overflow-auto h-[308px] border border-gray-400 dark:border-gray-700',
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
                  padding: 'py-0'
                }
              }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
              <template v-for="column in tagEntriesGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                <template v-if="!column.filterOptions">
                  <div class="px-1 py-1">
                    <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                      :filterable="column.filterable" :filter-key="column.key" />
                  </div>
                </template>
                <template v-else>
                  <div class="px-1 py-1">
                    <CommonSortAndSelectFilter @handle-select-change="handleFilterChange" :label="column.label"
                      :filterable="column.filterable" :filter-key="column.key" :filter-options="column.filterOptions" />
                  </div>
                </template>
              </template>
            </UTable>
          </div>
          
          <div class="basis-4/12 flex flex-col space-y-2">
            <div class="flex flex-row space-x-2">
              <div class="basis-3/4">
                <UFormGroup label="PO#">
                  <UInput v-model="tagEntryFormData.poNum" />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup label="PO#">
                  <UInput v-model="tagEntryFormData.on" />
                </UFormGroup>
              </div>
            </div>

            <div class="flex flex-row space-x-2 pb-2">
              <div class="basis-1/2">
                <UFormGroup label="SO#/SR#">
                  <UInput v-model="tagEntryFormData.serviceReportNum" />
                </UFormGroup>
              </div>
              <div class="basis-1/2 flex flex-col space-y-1">
                <UFormGroup label="Job#">
                  <UInput v-model="tagEntryFormData.jobNum" />
                </UFormGroup>

                <UFormGroup label="Investigation">
                  <UInput v-model="tagEntryFormData.investigationNum" />
                </UFormGroup>
              </div>
            </div>

            <div class="flex flex-col space-y-2">
              <div class="w-full">
                <UButton icon="i-heroicons-plus" label="Receive/Add" variant="outline" color="green"
                  block truncate />
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2">
                  <UButton icon="i-heroicons-minus-circle" label="Delete" variant="outline" color="red"
                    block />
                </div>
                <div class="basis-1/2">
                  <UButton icon="i-f7-rays" label="Clear" variant="outline" color="red"
                  block />
                </div>
              </div>
              <div class="flex flex-row space-x-2">
                <div class="basis-1/2">
                  <UButton icon="i-heroicons-plus" label="View Non-Conformance" variant="outline" color="green"
                  block />
                </div>
                <div class="basis-1/2">
                  <UButton icon="i-heroicons-plus" label="Print Label" variant="outline" color="green"
                  block />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  </UForm>
  <UDashboardModal title="Select serial" :ui="{
    width: 'w-[1440px] sm:max-w-9xl',
  }" v-model="isSerialModal">
    <MaterialsSerialsSerialList @select="v => { formData.SERIAL = v.MODEL; isSerialModal = false }" />
  </UDashboardModal>
  <UDashboardModal :ui="{
    width: 'w-[1440px] sm:max-w-9xl',
  }" title="Select Part" v-model="isPartModal">
    <UDashboardModal :ui="{
      width: 'w-[1440px] sm:max-w-9xl',
    }" title="Select Part" v-model="isPartModal">
      <MaterialsPartsPartList :is-page="false" @close="isPartModal = false" @select="desc => formData.PARTS = desc" />
    </UDashboardModal>
  </UDashboardModal>
</template>
