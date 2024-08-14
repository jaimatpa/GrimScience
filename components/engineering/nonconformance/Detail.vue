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
        label: 'Locastion',
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
        if(response.status === 200) {
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
    nonConformanceGridMeta.value.selectedNonConformance = {...row, class:""}
    nonConformanceGridMeta.value.nonConformances.forEach((nonConformance) => {
      if(nonConformance.uniqueID === row.uniqueID) {
        nonConformance.class = 'bg-gray-200'
      }else{
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
  watch(() => filterValues.value.OpenClosed, () => {fetchNonConformances()})
  if(props.selectedNonConformance) 
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
    <div class="flex flex-col">
      <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
        <h2 class="flex items-center">Lookup</h2>
        <div class="flex flex-row space-x-5">
          <div class="flex flex-row space-x-3">
            <div class="flex items-center">
              <UCheckbox v-model="filterValues.OpenClosed" label="Open" class="" />
            </div>
            <div class="min-w-[150px]">
              <UButton icon="i-heroicons-eye" label="Summary" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-2">
        <UTable
          :rows="nonConformanceGridMeta.nonConformances"
          :columns="nonConformanceGridMeta.defaultColumns"
          :loading="nonConformanceGridMeta.isLoading"
          class="w-full"
          :ui="{
            wrapper: 'overflow-auto h-60 border-2 border-gray-300 dark:border-gray-700',
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
          @select="onNonConformanceSelect"
          @dblclick="onNonConformanceDblclick"
        >
          <template v-for="column in nonConformanceGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="!column.filterOptions">
              <template v-if="column.key === 'SERVICEREPORT' || 'TAGASSIGNEDTO'">
                <div class="px-1 py-1  min-w-[150px]">
                  <CommonSortAndInputFilter 
                    @handle-input-change="handleFilterChange"
                    :label="column.label"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                  />
                </div>
              </template>
              <template v-else>
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter 
                    @handle-input-change="handleFilterChange"
                    :label="column.label"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                  />
                </div>
              </template>
            </template>
            <template v-else>
              <div class="px-1 py-1">
                <CommonSortAndSelectFilter 
                  @handle-select-change="handleFilterChange"
                  :label="column.label"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                  :filter-options="column.filterOptions"
                />
              </div>
            </template>
          </template>
        </UTable>
      </div>
    </div>
    <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
      <h2>Non Conformance</h2>
    </div>
    <div class="flex flex-col space-y-3 px-4 py-2">
      <div class="flex flex-row space-x-9">
        <UFormGroup label="NonConformance#">
          <UInput v-model="formData.uniqueID"/>
        </UFormGroup>
        <div class="flex flex-row space-x-3">
          <UFormGroup label="Serial/Part#">
            <UInput v-model="formData.SERIAL"/>
          </UFormGroup>
          <div class="flex items-end min-w-[100px]">
            <UButton label="Find" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="flex items-end min-w-[100px]">
            <UButton label="Find Part" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
        </div>
        <div class="flex-1">
          <UFormGroup label="Description">
            <UInput v-model="formData.PARTS"/>
          </UFormGroup>
        </div>
      </div>
      <div class="flex justify-between space-x-3">
        <div class="w-full">
          <UFormGroup label="Disposition Determination(Per Tag)">
            <UTextarea 
              v-model:model-value="formData.DISPOSITION"
              :rows="3"
            />
          </UFormGroup>
        </div>
        <div class="w-full">
          <UFormGroup label="Justification(Per Tag)">
            <UTextarea 
              v-model:model-value="formData.Justification"
              :rows="3"
            />
          </UFormGroup>
        </div>
        <div class="flex flex-col justify-between">
          <div class="flex gap-5">
            <URadio
              v-for="status of checkStatusGroup"
              :key="status.value"
              v-model="formData.OpenClosed"
              v-bind="status"
              class="pb-3"
            />
          </div>
          <div>
            <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
      <h2>Tag Entries</h2>
    </div>
    <div class="flex flex-row space-x-3 px-4 py-2">
      <div class="basis-3/4">
        <UTable
          :rows="tagEntriesGridMeta.tagEntries"
          :columns="tagEntriesGridMeta.defaultColumns"
          :loading="tagEntriesGridMeta.isLoading"
          class="w-full"
          :ui="{
            wrapper: 'overflow-auto h-[300px] border-2 border-gray-300 dark:border-gray-700',
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
        >
          <template v-for="column in tagEntriesGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="!column.filterOptions">
              <div class="px-1 py-1">
                <CommonSortAndInputFilter 
                  @handle-input-change="handleFilterChange"
                  :label="column.label"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                />
              </div>
            </template>
            <template v-else>
              <div class="px-1 py-1">
                <CommonSortAndSelectFilter 
                  @handle-select-change="handleFilterChange"
                  :label="column.label"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                  :filter-options="column.filterOptions"
                />
              </div>
            </template>
          </template>
        </UTable>
      </div>
      <div class="basis-1/4 flex flex-col space-y-2">
        <div class="flex flex-row space-x-2">
           <div class="basis-3/4 w-full">
              <UFormGroup label="PO#">
                <UInput v-model="tagEntryFormData.poNum"/>
              </UFormGroup>
           </div>
           <div class="basis-1/4 w-full">
              <UFormGroup label="PO#">
                <UInput v-model="tagEntryFormData.on"/>
              </UFormGroup>
           </div>
        </div>
        <div class="flex flex-row space-x-2">
          <div class="basis-1/2 w-full">
              <UFormGroup label="SO#/SR#">
                <UInput v-model="tagEntryFormData.serviceReportNum"/>
              </UFormGroup>
           </div>
           <div class="basis-1/2 w-full">
              <UFormGroup label="PJob#">
                <UInput v-model="tagEntryFormData.jobNum"/>
              </UFormGroup>
           </div>
        </div>
        <div class="flex justify-end">
          <div class="basis-1/2">
            <UFormGroup label="Investigation">
              <UInput v-model="tagEntryFormData.investigationNum"/>
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="w-full">
            <UButton icon="i-heroicons-plus" label="Receive/Add" variant="outline" color="green":ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-minus-circle" label="Delete" variant="outline" color="red" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-f7-rays" label="Clear" variant="outline" color="red" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-plus" label="View Non-Conformance" variant="outline" color="green" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-plus" label="Print Label" variant="outline" color="green" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UForm>
</template>
