<script lang="ts" setup>
  import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })
  
  useSeoMeta({
    title: 'Grimm-Customers'
  })

  const route = useRoute()
  const toast = useToast()

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'DATE',
        label: 'Date',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'CUSTOMER',
        label: 'Customer',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'VENDOR',
        label: 'Vendor',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'NAME',
        label: 'Name',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'FOR',
        label: 'For',
        sortable: true,
        sortDirection: 'none',
        filterable: true, 
        filterOptions: []
      }, {
        key: 'TAKENBY',
        label: 'Taken By',
        sortable: true,
        sortDirection: 'none',
        filterable: true, 
        filterOptions: []
      }, {
        key: 'actions',
        label: 'Actions',
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfMessages: 0, 
    messages: [],
    selectedMessageId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isCustomerModalOpen: false,
    modalTitle: "New Message",
    modalDescription: "Add a new message to your database"
  })
  const filterValues = ref({
    date: null,
    customer: null,
    vendor: null,
    name: null,
    for: null,
    takenby: null
  })
  const selectedColumns = ref(gridMeta.value.defaultColumns)
  const exportIsLoading = ref(false)

  const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))
  Object.entries(route.query).forEach(([key, value]) => {
    switch(key.toLowerCase()) {
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
    await useApiFetch('/api/customers/messages/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.numberOfMessages = response._data.body
        }
      }
    })
    if(gridMeta.value.numberOfMessages === 0){
      gridMeta.value.messages = []
      gridMeta.value.numberOfMessages = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfMessages) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfMessages / gridMeta.value.pageSize) | 1
    }
    await useApiFetch('/api/customers/messages', {
      method: 'GET',
      params: {
        page: gridMeta.value.page,
        pageSize: gridMeta.value.pageSize, 
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value,
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.messages = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }
  const onCreate = () => {
    gridMeta.value.selectedMessageId = null
    modalMeta.value.modalTitle = "New Message";
    modalMeta.value.modalDescription = "Add a new message to your database"
    modalMeta.value.isCustomerModalOpen = true
  }
  const onEdit = (row) => {    
    gridMeta.value.selectedMessageId = row?.UniqueID
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.modalDescription = "Edit message"
    modalMeta.value.isCustomerModalOpen = true
  }
  const onDelete = async (row: any) => {
    await useApiFetch(`/api/customers/messages/${row?.UniqueID}`, {
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
    for(const column of columns.value) {
      if(column.sortable) {
        if (column.key === btnName) {
          switch(column.sortDirection) {
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
        if(value !== null)
        return `${key}=${value}`
      })
      .join("&") 
    location.href = `/api/customers/exportlist?${paramsString}`
    exportIsLoading.value = false
  }
  const onSelect = async (row) => {
    gridMeta.value.selectedMessageId = row?.UniqueID;
  }
  const onDblClick = async () =>{
    if(gridMeta.value.selectedMessageId){
      modalMeta.value.modalTitle = "Edit";
      modalMeta.value.modalDescription = "Edit message"
      // modalMeta.value.isCustomerModalOpen = true
    }
  }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsPurpleHeader"
        title="Customer Messages"
      >
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsPurpleTitlebar">
    <h2>Lookup</h2>
      </div>

      <UDashboardToolbar class="gmsPurpleToolbar">
        <template #right>
          <UButton color="green" variant="outline"
            label="New message"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>
      <UTable
        :rows="gridMeta.messages"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800', 
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
          }, 
          td: {
            padding: 'py-1'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        @select="onSelect"
        @dblclick="onDblClick"
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.filterOptions">
            <CommonSortAndSelectFilter 
              @handle-sorting-button="handleSortingButton" 
              @handle-input-change="handleFilterInputChange"
              :label="column.label"
              :sortable="column.sortable"
              :sort-key="column.key" 
              :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
              :filterable="column.filterable"
              :filter-key="column.key"
            />
          </template>
          <template v-else>
            <CommonSortAndInputFilter 
              @handle-sorting-button="handleSortingButton" 
              @handle-input-change="handleFilterInputChange"
              :label="column.label"
              :sortable="column.sortable"
              :sort-key="column.key" 
              :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
              :filterable="column.filterable"
              :filter-key="column.key"
            />
          </template>
        </template>
        <template #actions-data="{row}">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-20-solid" @click="onEdit(row)"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-trash-20-solid" class="ml-2" @click="onDelete(row)"/>
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfMessages | 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Modal -->
  <UDashboardModal
    v-model="modalMeta.isCustomerModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-7xl'
    }"
  >
    <CustomersMessageForm @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedMessageId" :is-modal="true"/>
  </UDashboardModal>
</template>
<style scoped>
</style>