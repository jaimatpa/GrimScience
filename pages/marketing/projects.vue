<script lang="ts" setup>
import MarketingForm from '~/components/marketing/MarketingForm.vue';
import PartsUsed from '~/components/marketing/PartsUsed.vue';
import type projects from '~/server/api/projects';
import type { UTableColumn } from '~/types';

onMounted(() => {
  init()
})

useSeoMeta({
  title: 'Grimm-Marketing projects'
})

const route = useRoute()
const toast = useToast()

const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
const descIcon = "i-heroicons-bars-arrow-down-20-solid"
const noneIcon = "i-heroicons-arrows-up-down-20-solid"

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[{
    key: 'NUMBER',
    label: 'Project#',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'QUANTITY',
    label: 'Qty.',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'MODEL ',
    label: 'Description',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'PerType',
    label: 'type',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'DATEOPENED',
    label: 'Opened',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'DATECLOSED',
    label: 'Closed',
    sortable: false,
    sortDirection: 'none',
    filterable: false
  },
  {
    key: 'PercentageComplete',
    label: '% Complete',
    sortable: false,
    sortDirection: 'none',
    filterable: false
  },
  {
    key: 'Cost',
    label: 'ProjectCost',
    sortable: false,
    sortDirection: 'none',
    filterable: false
  },
  {
    key: 'delete',
    label: 'Del',
    kind: 'actions'
  }
  ],
  page: 1,
  pageSize: 50,
  numberOfProjects: 0,
  projects: [],
  selectedCustomerId: null,
  sort: {
    column: 'UniqueID',
    direction: 'asc'
  },
  isLoading: false
})
const modalMeta = ref({
  isPartsUsed: false,
  isCustomerModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  modalTitle: "New Customer",
})
const filterValues = ref({
  NUMBER: null,
  QUANTITY: null,
  MODEL: null,
  PerType: null,
  DATEOPENED: null,
  PercentageComplete: null,
  Cost: null,
  selectedOptions: [],



})
const checkboxes = ref({
  Marketing: false,
  Accounting: false,
  Engineering: false,
  Manufacturing: false,
  ShowOpenOnly: false
});
const selectedColumns = ref(gridMeta.value.defaultColumns)
const exportIsLoading = ref(false)

const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))
Object.entries(route.query).forEach(([key, value]) => {
  switch (key.toLowerCase()) {
    case 'page':
      gridMeta.value.page = Number(value);
      break;
    case 'pagesize':
      gridMeta.value.pageSize = Number(value);
      break;
    case 'sortby':
      gridMeta.value.sort.column = value as unknown as string;
      break;
    case 'sortorder':
      gridMeta.value.sort.direction = value as unknown as string;
      break;
  }
})

const init = async () => {
  fetchGridData()


}
const fetchGridData = async () => {
  gridMeta.value.isLoading = true
  await useApiFetch('/api/projects/numbers', {
    method: 'GET',
    params: {
      ...filterValues.value
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfProjects = response._data.body
        console.log("number of projects", response._data.body)
      }
    }
  })
  if (gridMeta.value.numberOfProjects === 0) {
    gridMeta.value.projects = []
    gridMeta.value.numberOfProjects = 0
    gridMeta.value.isLoading = false
    return;
  }
  if (gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfProjects) {
    gridMeta.value.page = Math.ceil(gridMeta.value.numberOfProjects / gridMeta.value.pageSize) | 1
  }
  console.log("filer", filterValues.value)
  // table data is coming
  await useApiFetch('/api/projects/', {
    method: 'GET',
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    }
    ,
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.projects = response._data.body
        console.log("updated for marking", response._data.body)

      }
      gridMeta.value.isLoading = false
    }
  });
}



const selectedOptions = computed(() => {
  return Object.entries(checkboxes.value)
    .filter(([key, value]) => value)
    .map(([key]) => key);
});

// Watch for changes in selectedOptions and update filterValues
watch(selectedOptions, (newSelectedOptions) => {
  filterValues.value.selectedOptions = newSelectedOptions;
  fetchGridData(); // Trigger fetchGridData whenever filterValues changes
});

const onCreate = () => {
  gridMeta.value.selectedCustomerId = null
  modalMeta.value.modalTitle = "New Customer";
  modalMeta.value.isCustomerModalOpen = true
}
const onEdit = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.isCustomerModalOpen = true
}
const onOrderDetail = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID
  modalMeta.value.isOrderDetailModalOpen = true
}
const onQuoteDetail = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID
  modalMeta.value.isQuoteDetailModalOpen = true
}
const onServiceOrderDetail = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID
  modalMeta.value.isServiceOrderDetailModalOpen = true
}
const onSiteVisitDetail = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID
  modalMeta.value.isSiteVisitModalOpen = true
}
const onAdd = () => {
  modalMeta.value.isPartsUsed = true

}
const onDelete = async (row: any) => {

  await useApiFetch(`/api/jobs/${row?.UniqueID}`, {
    method: 'DELETE',
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-trash-solid',
          color: 'green'
        })
        fetchGridData()
      }
    }
  })
}
const handleModalClose = () => {
  modalMeta.value.isCustomerModalOpen = false
}
const handleModalSave = async () => {
  handleModalClose()
  fetchGridData()
}
const handlePageChange = async () => {
  fetchGridData()
}
const handleFilterChange = () => {
  gridMeta.value.page = 1
  fetchGridData()
}
const handleSortingButton = async (btnName: string) => {
  gridMeta.value.page = 1
  for (const column of columns.value) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case 'none':
            column.sortDirection = 'asc';
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = 'asc';
            break;
          case 'asc':
            column.sortDirection = 'desc';
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = 'desc';
            break;
          default:
            column.sortDirection = 'none';
            gridMeta.value.sort.column = 'UniqueID';
            gridMeta.value.sort.direction = 'asc';
            break;
        }
      } else {
        column.sortDirection = 'none';
      }
    }
  }
  fetchGridData()
}
const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchGridData()
}
const excelExport = async () => {
  exportIsLoading.value = true
  const params = {
    sortBy: gridMeta.value.sort.column,
    sortOrder: gridMeta.value.sort.direction,
    ...filterValues.value,
  }
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      if (value !== null)
        return `${key}=${value}`
    })
    .join("&")
  location.href = `/api/customers/exportlist?${paramsString}`
  exportIsLoading.value = false
}
const onSelect = async (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID;
}
const onDblClick = async () => {
  if (gridMeta.value.selectedCustomerId) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isCustomerModalOpen = true
  }
}
const onAdded = () => {
  modalMeta.value.isCustomerModalOpen = true
  modalMeta.value.modalTitle = "New Project";

}
</script>

<template>
  <UDashboardPage>


    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Projects">
      </UDashboardNavbar>





        <div class="px-4 py-2 gmsBlueTitlebar">
          <h2>Projects List</h2>
        </div>
        <UDashboardToolbar class="bg-gms-gray-100">
          <!-- Left Section: Form Group -->
          <div class="flex items-center space-x-3">
            <UFormGroup label="Number of Search Items To Return" name="zip">
              <UInput />
            </UFormGroup>
          </div>

          <!-- Right Section: Checkboxes -->
          <div class="flex items-center space-x-5 ">
            <div>
              <UCheckbox label="Marketing" v-model="checkboxes.Marketing" />
            </div>
            <div>
              <UCheckbox label="Accounting" v-model="checkboxes.Accounting" />
            </div>
            <div>
              <UCheckbox label="Engineering" v-model="checkboxes.Engineering" />
            </div>
            <div>
              <UCheckbox label="Manufacturing" v-model="checkboxes.Manufacturing" />
            </div>
            <div>
              <UCheckbox label="Show Open Only" v-model="checkboxes.ShowOpenOnly" />
            </div>
            <!-- <div>
              <p>Selected Options: {{ selectedOptions.join(', ') }}</p>
            </div> -->
          </div>
          <div>
            <div class="mr-5">

              <UButton color="green" variant="outline" type="submit" label="New Project" trailing-icon="i-heroicons-plus" @click="onAdded()" />
            </div>
          </div>
  
      </UDashboardToolbar>

      <UTable :rows="gridMeta.projects" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
        divide: 'divide-gray-200 dark:divide-gray-800',
        th: {
          base: 'sticky top-0 z-10',
          padding: 'pb-0',
        },
        td: {
          padding: 'py-1'
        }
      }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" @select="onSelect"
        @dblclick="onDblClick">
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.kind !== 'actions'">
            <div class="">
              <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                @handle-input-change="handleFilterInputChange" :label="column.label" :sortable="column.sortable"
                :sort-key="column.key"
                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                :filterable="column.filterable" :filter-key="column.key" />
            </div>
          </template>
          <template v-else class='bg-slate-400'>
            <div class="flex w-[53px]">
              {{ column.label }}
            </div>
          </template>
        </template>
        <template #label-data="{ row }">
          <UTooltip text="Label" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-tag" @click="" />
          </UTooltip>
        </template>
        <template #order-data="{ row }">
          <UTooltip text="Order" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-shopping-cart" @click="onOrderDetail(row)" />
          </UTooltip>
        </template>
        <template #quote-data="{ row }">
          <UTooltip text="Quote" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-currency-dollar" @click="onQuoteDetail(row)" />
          </UTooltip>
        </template>
        <template #serviceOrder-data="{ row }">
          <UTooltip text="Service Order" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-chat-bubble-left-ellipsis"
              @click="onServiceOrderDetail(row)" />
          </UTooltip>
        </template>
        <template #siteVisit-data="{ row }">
          <UTooltip text="Site Visit" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-clipboard-document-list"
              @click="onSiteVisitDetail(row)" />
          </UTooltip>
        </template>
        <template #edit-data="{ row }">
          <UTooltip text="Edit" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onEdit(row)" />
          </UTooltip>
        </template>
        <template #delete-data="{ row }">
          <UTooltip text="Delete" class="flex ">
            <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onDelete(row)" />
          </UTooltip>
        </template>
      </UTable>
      <!-- <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfProjects | 0"
            v-model="gridMeta.page" @update:model-value="handlePageChange()" />
        </div>
      </div> -->
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Customer Detail Modal -->
  <UDashboardModal v-model="modalMeta.isCustomerModalOpen" :title="modalMeta.modalTitle" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1000px] sm:max-w-9xl'
  }">
    <MarketingForm @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedCustomerId"
      :is-modal="true" />
  </UDashboardModal>
  <!-- Order Modal -->
  <UDashboardModal v-model="modalMeta.isOrderDetailModalOpen" title="Invoice" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
  }">
    <InvoiceDetail :selected-customer="gridMeta.selectedCustomerId" @close="modalMeta.isOrderDetailModalOpen = false" />
  </UDashboardModal>
  <!-- Quote Modal -->
  <UDashboardModal v-model="modalMeta.isQuoteDetailModalOpen" title="Quote" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1000px] sm:max-w-7xl'
  }">
    <CustomersQuoteDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>
  <!-- Service Order Modal -->
  <UDashboardModal v-model="modalMeta.isServiceOrderDetailModalOpen" title="Service Order" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl'
  }">
    <ServiceOrderDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>






  <!-- Site Visit Modal -->
  <UDashboardModal v-model="modalMeta.isSiteVisitModalOpen" title="Site Visit" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl'
  }">
    <CustomersSiteVisitDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>
  <!-- is Part Modal -->
  <UDashboardModal v-model="modalMeta.isPartsUsed" :ui="{
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-10' },
    width: 'w-[1500px] sm:max-w-9xl',
  }">
  </UDashboardModal>
</template>
<style scoped></style>
