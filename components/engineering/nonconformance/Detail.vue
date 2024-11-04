<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import type { FormError, FormSubmitEvent } from '#ui/types'
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
});

const createTagEntriesFormData = ref({
  UniqueID: null,
  NonConformanceID: null,
  DateTime: null,
  Quantity: null,
  ReceivedQty: null,
  ByEmployee: null,
  AssignedtoEmploye: null,
  Location: null,
  Status: null,
  Justification: null,
  DISPOSITION: null,
})
const isPartModal = ref(false)
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
      filterOptions: [
        "",
        "Quarantined",
        "Rework",
        "Scrap",
        "Rejected",
        "Inspected",
        "Return to Stock",
        "Repairable",
        "Inspected/Use As Is"
      ]
    }, {
      key: 'TAGASSIGNEDTO',
      label: 'Assigned To',
      filterable: true,
      filterOptions: []
    }, {
      key: 'TAGLOCATION',
      label: 'Locastion',
      filterable: true,
      filterOptions: [
        "",
        "#35 Service",
        "#62 Electronics",
        "#Materials"
      ]
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
      filterOptions: [
        "",
        "Quarantined",
        "Rework",
        "Scrap",
        "Rejected",
        "Inspected",
        "Return to Stock",
        "Repairable",
        "Inspected/Use As Is"
      ]
    }, {
      key: 'AssignedtoEmploye',
      label: 'Assigned To',
      filterable: true,
      filterOptions: []
    }, {
      key: 'Location',
      label: 'Location',
      filterable: true,
      filterOptions: [
        "",
        "#35 Service",
        "#62 Electronics",
        "#Materials"
      ]
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
const isSerialModal = ref(false)
const editInit = async () => {
  loadingOverlay.value = true
  await propertiesInit()
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await fetchNonConformances();

  
  await useApiFetch(`/api/engineering/nonconformances/filters`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.body;

        const employees = filters.employees;
        nonConformanceGridMeta.value.defaultColumns.find(column => column.key === 'TAGASSIGNEDTO').filterOptions = employees.map(emp => ({
          label: emp,
          value: emp
        }));
        tagEntriesGridMeta.value.defaultColumns.find(column => column.key === 'ByEmployee').filterOptions = employees.map(emp => ({
          label: emp,
          value: emp
        }));
        tagEntriesGridMeta.value.defaultColumns.find(column => column.key === 'AssignedtoEmploye').filterOptions = employees.map(emp => ({
          label: emp,
          value: emp
        }));
      }
    }
  })
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
};
const fetchNonConformanceTags = async (uid) => {
  loadingOverlay.value = true;

  await useApiFetch(`/api/engineering/nonconformances/tag?id=${uid}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        tagEntriesGridMeta.value.tagEntries = response._data.body;
        Object.keys(createTagEntriesFormData.value).forEach(k => {
          if (k in response._data.body) {
            createTagEntriesFormData.value[k] = response._data.body[k];
          }
        });
        //  Object.keys(createTagEntriesFormData.value).forEach(k => {
        //   if (k in response._data.body) {
        //     createTagEntriesFormData.value[k] = response._data.body[k];
        //   }
        // });
      }
    }
  })
  createTagEntriesFormData.value.NonConformanceID = uid;
  createTagEntriesFormData.value.DateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  loadingOverlay.value = false;
};
const fetchNonConformanceDetails = async (uid) => {
  await useApiFetch(`/api/engineering/nonconformances/?uniqueID=${uid}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        Object.keys(response._data.body[0]).forEach(key => {
          formData[key] = response._data.body[0][key];
        });
      }

    }
  })
};

const handleSaveNonConformance = async () => {
  await useApiFetch(`/api/engineering/nonconformances/`, {
    method: 'POST',
    body: formData,
    onResponse({ response }) {
      console.log(response)
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
      }
      else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'red'
        })
      }

    }
  })
};

const handleSaveNonConformanceTags = async () => {
  await useApiFetch(`/api/engineering/nonconformances/tag`, {
    method: 'POST',
    body: createTagEntriesFormData.value,
    onResponse({ response }) {
      console.log(response)
      if (response.status === 200) {
        fetchNonConformanceTags(createTagEntriesFormData.value.UniqueID)
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
      }
      else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'red'
        })
      }

    }
  })
};


const deleteNonConformanceTag = async () => {
  await useApiFetch(`/api/engineering/nonconformances/tag?id=${tagEntriesGridMeta.value.selectedTagEntry.UniqueID}`, {
    method: 'DELETE',
    onResponse({ response }) {
      console.log(response)
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
        fetchNonConformanceTags(nonConformanceGridMeta.value.selectedNonConformance.uniqueID)
      }
      else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'red'
        })
      }

    }
  })
};


const handleFilterChange = async (event, name) => {
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  await fetchNonConformances()
}

const handleTagEntriesFormData = async (event, name) => {
  if (createTagEntriesFormData.value.hasOwnProperty(name)) {
    createTagEntriesFormData.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
}
const onNonConformanceSelect = async (row) => {
  console.log(row)
  nonConformanceGridMeta.value.selectedNonConformance = { ...row, class: "" }
  nonConformanceGridMeta.value.nonConformances.forEach((nonConformance) => {
    if (nonConformance.uniqueID === row.uniqueID) {
      nonConformance.class = 'bg-gray-200'
    } else {
      delete nonConformance.class
    }
  });
  tagEntryFormData.value.serviceReportNum = row.COMPLAINTNUMBER
  await fetchNonConformanceTags(row.uniqueID);
  await fetchNonConformanceDetails(row.uniqueID);
}
const onNonConformanceSelectTag = async (row) => {
  tagEntriesGridMeta.value.selectedTagEntry = { ...row, class: "" }
  tagEntriesGridMeta.value.tagEntries.forEach((tag) => {
    if (tag.UniqueID === row.UniqueID) {
      tag.class = 'bg-gray-200'
    } else {
      delete tag.class
    }
  });
}
const handleSerialFind = () => {
  isSerialModal.value = true
}
const onNonConformanceDblclick = () => {
  emit('link', nonConformanceGridMeta.value.selectedNonConformance?.uniqueID)
  emit('close')
}
const validate = (state: any): FormError[] => {
  const errors = []

  return errors
}

const handleSummary = async () => {
  loadingOverlay.value = true
  try {
    const data = await useApiFetch('/api/engineering/nonconformances/generate-summary-pdf', {
      method: 'GET',
    });
    console.log(data)
    if (data) {
      const summaryWindow = window.open('', '_blank')
      summaryWindow.document.write(data)
    } else {
      throw new Error('Failed to generate summary HTML')
    }
  } catch (error) {
    console.error('Error generating summary:', error)
    toast.add({
      title: "Error",
      description: "Failed to generate summary",
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loadingOverlay.value = false
  }
}
const handleNonConformancePDFGeneration = async () => {
  if (!nonConformanceGridMeta.value.selectedNonConformance) {
    toast.add({
      title: "Error",
      description: "No non-conformance selected",
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
    return
  }

  loadingOverlay.value = true

  try {
    const selected = nonConformanceGridMeta.value.selectedNonConformance
    const data = await useApiFetch('/api/engineering/nonconformances/generate-pdf', {
      method: 'POST',
      body: { selected },
      responseType: 'blob'
    })

    if (data) {
      
      const blob = new Blob([data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      
      window.open(url, '_blank')

      
      URL.revokeObjectURL(url)

      toast.add({
        title: "Success",
        description: `Non-Conformance PDF generated successfully`,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    } else {
      throw new Error(`Failed to generate PDF`)
    }
  } catch (error) {
    console.error(`Error generating PDF:`, error)
    toast.add({
      title: "Error",
      description: `Failed to generate PDF`,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loadingOverlay.value = false
  }
}

const handlePrintLabel = async () => {
  if (!nonConformanceGridMeta.value.selectedNonConformance) {
    toast.add({
      title: "Error",
      description: "No non-conformance selected",
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
    return
  }

  try {
    const data = await useApiFetch('/api/engineering/nonconformances/printLabel', {
      method: 'POST',
      body: {
        data: nonConformanceGridMeta.value.selectedNonConformance
      }
    })

    if (data) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(data)
        printWindow.document.close()


        toast.add({
          title: "Success",
          description: "Label prepared for printing",
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
      } else {
        throw new Error('Unable to open new window')
      }
    } else {
      throw new Error('Failed to generate label HTML')
    }
  } catch (error) {
    console.error('Error printing label:', error)
    toast.add({
      title: "Error",
      description: "Failed to prepare label for printing",
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}

const handleClear = () => {
  tagEntryFormData.value = {
    poNum: 0,
    on: 0,
    serviceReportNum: 0,
    jobNum: 0,
    investigationNum: 0
  };
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      formData[key] = null;
    }
  }
  tagEntriesGridMeta.value.tagEntries = []
  tagEntriesGridMeta.value.selectedTagEntry = []
  nonConformanceGridMeta.value.selectedNonConformance = null

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
      <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
        <h2 class="flex items-center">Lookup</h2>
        <div class="flex flex-row space-x-5">
          <div class="flex flex-row space-x-3">
            <div class="flex items-center">
              <UCheckbox v-model="filterValues.OpenClosed" label="Open" class="" />
            </div>
            <div class="min-w-[150px]">
              <UButton icon="i-heroicons-eye" label="Summary" variant="outline"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate
                @click="handleSummary" />
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-2">
        <UTable :rows="nonConformanceGridMeta.nonConformances" :columns="nonConformanceGridMeta.defaultColumns"
          :loading="nonConformanceGridMeta.isLoading" class="w-full" :ui="{
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
          }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
          @select="onNonConformanceSelect" @dblclick="onNonConformanceDblclick">


          <template v-for="column in nonConformanceGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="!column.filterOptions">
              <template v-if="column.key === 'SERVICEREPORT' || 'TAGASSIGNEDTO'">
                <div class="px-1 py-1  min-w-[150px]">
                  <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                    :filterable="column.filterable" :filter-key="column.key" :filterOptions="column.filterOptions" />
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
    </div>
    <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
      <h2>Non Conformance</h2>
    </div>
    <div class="flex flex-col space-y-3 px-4 py-2">
      <div class="flex flex-row space-x-9">
        <UFormGroup label="NonConformance#">
          <UInput v-model="formData.uniqueID" disabled />
        </UFormGroup>
        <div class="flex flex-row space-x-3">
          <UFormGroup label="Serial/Part#">
            <UInput v-model="formData.SERIAL" />
          </UFormGroup>
          <div class="flex items-end min-w-[100px]">
            <UButton label="Find" @click="handleSerialFind"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
          <div class="flex items-end min-w-[100px]">
            <UButton label="Find Part" @click="isPartModal = true"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
        </div>
        <div class="flex-1">
          <UFormGroup label="Description">
            <UInput v-model="formData.PARTS" />
          </UFormGroup>
        </div>
      </div>
      <div class="flex justify-between space-x-3">
        <div class="w-full">
          <UFormGroup label="Disposition Determination(Per Tag)">
            <UTextarea v-model:model-value="formData.DISPOSITION" :rows="3" />
          </UFormGroup>
        </div>
        <div class="w-full">
          <UFormGroup label="Justification(Per Tag)">
            <UTextarea v-model:model-value="formData.Justification" :rows="3" />
          </UFormGroup>
        </div>
        <div class="flex flex-col justify-between">
          <div class="flex gap-5">
            <URadio v-for="status of checkStatusGroup" :key="status.value" v-model="formData.OpenClosed" v-bind="status"
              class="pb-3" />
          </div>
          <div>
            <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline"
              @click="handleSaveNonConformance" :ui="{ base: 'min-w-[200px]', truncate: 'flex justify-center w-full' }"
              truncate />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
      <h2>Tag Entries</h2>
    </div>
    <div class="flex flex-row space-x-3 px-4 py-2">
      <div class="basis-3/4">
        <UTable :rows="tagEntriesGridMeta.tagEntries" :columns="tagEntriesGridMeta.defaultColumns"
          :loading="tagEntriesGridMeta.isLoading" class="w-full" :ui="{
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
          }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
          @select="(row) => onNonConformanceSelectTag(row)">

          <template v-for="column in tagEntriesGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="!column.filterOptions">
              <div class="px-1 py-1">
                <CommonSortAndInputFilter @handle-input-change="handleTagEntriesFormData" :label="column.label"
                  :filterable="column.filterable" :filter-key="column.key" :v-model="['000']" />
              </div>
            </template>
            <template v-else>
              <div class="px-1 py-1">
                <CommonSortAndSelectFilter @handle-select-change="handleTagEntriesFormData" :label="column.label"
                  :filterable="column.filterable" :filter-key="column.key" :filter-options="column.filterOptions" />
              </div>
            </template>
          </template>
        </UTable>
      </div>
      <div class="basis-1/4 flex flex-col space-y-2">
        <div class="flex flex-row space-x-2">
          <div class="basis-3/4 w-full">
            <UFormGroup label="PO#">
              <UInput v-model="tagEntryFormData.poNum" />
            </UFormGroup>
          </div>
          <div class="basis-1/4 w-full">
            <UFormGroup label="PO#">
              <UInput v-model="tagEntryFormData.on" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-row space-x-2">
          <div class="basis-1/2 w-full">
            <UFormGroup label="SO#/SR#">
              <UInput v-model="tagEntryFormData.serviceReportNum" />
            </UFormGroup>
          </div>
          <div class="basis-1/2 w-full">
            <UFormGroup label="PJob#">
              <UInput v-model="tagEntryFormData.jobNum" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="basis-1/2">
            <UFormGroup label="Investigation">
              <UInput v-model="tagEntryFormData.investigationNum" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="w-full">
            <UButton icon="i-heroicons-plus" label="Receive/Add" variant="outline" color="green"
              @click="handleSaveNonConformanceTags"
              :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-minus-circle" label="Delete" variant="outline" color="red"
                @click="deleteNonConformanceTag"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-f7-rays" label="Clear" @click="handleClear" variant="outline" color="red"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-plus" label="View Non-Conformance" variant="outline"
                @click="handleNonConformancePDFGeneration" color="green"
                :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }" truncate />
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-plus" label="Print Label" variant="outline" color="green"
                @click="handlePrintLabel" :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                truncate />
            </div>
          </div>
        </div>
      </div>
    </div>

  </UForm>
  <UDashboardModal title="Select serial" :ui="{
    header: {
      base: 'bg-gms-blue',
    },
    width: 'w-[1250px]',
  }" v-model="isSerialModal">
    <UDashboardPanel grow>
      <MaterialsSerialsSerialList @select="v => { formData.SERIAL = v.MODEL; isSerialModal = false }" />
    </UDashboardPanel>
  </UDashboardModal>

  <UDashboardModal :ui="{
    header: {
      base: 'bg-gms-blue',
    },
    width: 'w-[1250px]',
  }" title="Select Part" v-model="isPartModal">

    <MaterialsPartsPartList :is-page="false" @close="isPartModal = false" @select="desc => formData.PARTS = desc" />
  </UDashboardModal>
</template>
