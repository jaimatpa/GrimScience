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

  const headerFilters = ref({
    markets: {
      label: 'Market',
      filter: 'market',
      options: []
    }, 
    professions: {
      label: 'Profession', 
      filter: 'source',
      options: []
    }, 
    categories: {
      label: 'Category', 
      filter: 'ParadynamixCatagory', 
      options: []
    }, 
    conferences: {
      label: 'Conference', 
      filter: 'SourceConfrence',
      options: []
    }, 
    usstates: {
      label: 'State', 
      filter: 'state',
      api: '/api/common/usstates',
      options: []
    }
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'number',
        label: 'Number',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'fname',
        label: 'First',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'lname',
        label: 'Last',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'company1',
        label: 'Company',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'homephone',
        label: 'HomePhone',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'workphone',
        label: 'WorkPhone',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'state',
        label: 'State',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'zip',
        label: 'Zip',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'actions',
        label: 'Actions',
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfCustomers: 0, 
    customers: [],
    selectedCustomerId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isCustomerModalOpen: false,
    modalTitle: "New Customer",
    modalDescription: "Add a new customer to your database"
  })
  const filterValues = ref({
    market: null,
    source: null,
    ParadynamixCatagory: null,
    SourceConfrence: null,
    number: null,
    fname: null,
    lname: null,
    company1: null,
    homephone: null,
    workphone: null,
    state: null,
    zip: null
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
    for(const key in headerFilters.value) {
      const apiURL = headerFilters.value[key]?.api?? `/api/customers/${key}`;
      await useApiFetch(apiURL, {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            headerFilters.value[key].options = [null, ...response._data.body];
          }
        }
      })
    }
  }
  const fetchGridData = async () => {
    gridMeta.value.isLoading = true
    await useApiFetch('/api/customers/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.numberOfCustomers = response._data.body
        }
      }
    })
    if(gridMeta.value.numberOfCustomers === 0){
      gridMeta.value.customers = []
      gridMeta.value.numberOfCustomers = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfCustomers) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfCustomers / gridMeta.value.pageSize) | 1
    }
    await useApiFetch('/api/customers/list', {
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
          gridMeta.value.customers = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }
  const onCreate = () => {
    gridMeta.value.selectedCustomerId = null
    modalMeta.value.modalTitle = "New Customer";
    modalMeta.value.modalDescription = "Add a new customer to your database"
    modalMeta.value.isCustomerModalOpen = true
  }
  const onEdit = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.modalDescription = "Edit customer information"
    modalMeta.value.isCustomerModalOpen = true
  }
  const onDelete = async (row: any) => {
    await useApiFetch(`/api/customers/${row?.UniqueID}`, {
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
    gridMeta.value.selectedCustomerId = row?.UniqueID;
  }
  const onDblClick = async () =>{
    if(gridMeta.value.selectedCustomerId){
      modalMeta.value.modalTitle = "Edit";
      modalMeta.value.modalDescription = "Edit customer information"
      modalMeta.value.isCustomerModalOpen = true
    }
  }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Customer List"
      >
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3">
            <template v-for="[key, value] in Object.entries(headerFilters)" :key="key">
              <div class="basis-1/7 max-w-[200px]">
                <UFormGroup
                  :label="value.label"
                  :name="key"
                >
                  <USelect
                    v-model="filterValues[`${value.filter}`]"
                    :options="value.options"
                    @change="handleFilterChange()"
                  />
                </UFormGroup>
              </div>
            </template>
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup
                label="Zip"
                name="zip"
              >
                <UInput
                  v-model="filterValues.zip"
                  @update:model-value="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup
                label="Quantity"
                name="Quantity"
              >
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfCustomers }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <!-- <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="gridMeta.defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu> -->
          <UButton 
            :loading="exportIsLoading"
            label="Export to Excel" 
            color="gray"
            @click="excelExport"
          >
            <template #trailing>
              <UIcon name="i-heroicons-document-text" class="text-green-500 w-5 h-5" />
            </template>
          </UButton>
          <UButton
            label="New customer"
            color="gray"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>
      
      <!-- New Modal -->
      <UDashboardModal
        v-model="modalMeta.isCustomerModalOpen"
        :title="modalMeta.modalTitle"
        :description="modalMeta.modalDescription"
        :ui="{width: 'w-[1000px] sm:max-w-7xl'}"
      >
        <CustomersForm @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedCustomerId" :is-modal="true"/>
      </UDashboardModal>

      <!-- Old Modal -->
      <!-- <UDashboardModal
        v-model="modalMeta.isCustomerModalOpen"
        :title="modalMeta.modalTitle"
        :description="modalMeta.modalDescription"
        :ui="{width: 'w-[1000px] sm:max-w-7xl', height: 'h-[680px] sm:h-[680px]'}"
      >
        <CustomersFormOld @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedCustomerId"/>
      </UDashboardModal> -->
      <UTable
        :rows="gridMeta.customers"
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
        <template #actions-data="{row}">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-20-solid" @click="onEdit(row)"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-trash-20-solid" class="ml-2" @click="onDelete(row)"/>
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfCustomers | 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style scoped>
</style>