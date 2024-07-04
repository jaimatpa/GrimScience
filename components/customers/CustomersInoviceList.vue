<script lang="ts" setup>
  import type { UTableColumn } from '~/types';
  import { format } from 'date-fns'

  onMounted(() => {
    init()
  })

  const emit = defineEmits(['close', 'link'])
  const props = defineProps({
    selectedCustomer: {
      type: [Number, String, null],
    },
  })
  const route = useRoute()
  const toast = useToast()

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'UniqueID',
        label: 'Invoice#',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'orderdate',
        label: 'Order Date',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'shipdate',
        label: 'Ship Date',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'customerid',
        label: 'Customer#',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'customer',
        label: 'Customer',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'company',
        label: 'Company',
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
        key: 'source',
        label: 'Source',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'sourcedescription',
        label: 'Description',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'edit',
        label: 'Edit',
        kind: 'actions'
      }, {
        key: 'delete',
        label: 'Delete',
        kind: 'actions'
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfOrders: 0, 
    orders: [],
    selectedCustomerId: null,
    selectedOrderId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isOrderDetailModalOpen: false,
    modalTitle: "New Invoice",
    modalDescription: "Add a new invoice to your database"
  })
  const today = new Date()
  const filterValues = ref({
    UniqueID: null,
    orderdate: null,
    shipdate: null,
    customerid: props.selectedCustomer??null,
    customer: null,
    company: null,
    lname: null,
    zip: null,
    source: null,
    sourcedescription: null, 
    // from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
    from: new Date('2006-01-02'),
    to: today,
    serial: null
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
    await useApiFetch('/api/invoices/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value,
        to: new Date(filterValues.value.to.getFullYear(), filterValues.value.to.getMonth(), filterValues.value.to.getDate() + 1)
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.numberOfOrders = response._data.body
        }
      }
    })
    if(gridMeta.value.numberOfOrders === 0){
      gridMeta.value.orders = []
      gridMeta.value.numberOfOrders = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfOrders) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfOrders / gridMeta.value.pageSize)
    }
    await useApiFetch('/api/invoices', {
      method: 'GET',
      params: {
        page: gridMeta.value.page,
        pageSize: gridMeta.value.pageSize, 
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value,
        to: new Date(filterValues.value.to.getFullYear(), filterValues.value.to.getMonth(), filterValues.value.to.getDate() + 1)
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.orders = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }
  const onCreate = () => {
    gridMeta.value.selectedCustomerId = null
    gridMeta.value.selectedOrderId = null
    modalMeta.value.isOrderDetailModalOpen = true
  }
  const onEdit = (row) => {
    gridMeta.value.selectedCustomerId = row?.customerid
    gridMeta.value.selectedOrderId = row?.UniqueID
    modalMeta.value.isOrderDetailModalOpen = true
  }
  const onDelete = async (row: any) => {
    await useApiFetch(`/api/invoices/${row?.UniqueID}`, {
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
    modalMeta.value.isOrderDetailModalOpen = false
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
    gridMeta.value.selectedOrderId = row?.UniqueID;
    gridMeta.value.selectedCustomerId = row?.customerid
  }
  const onDblClick = async () => {
    if(gridMeta.value.selectedOrderId){
      // modalMeta.value.isOrderDetailModalOpen = true
      emit('link', gridMeta.value.selectedOrderId)
      emit('close')
    }
  }
  watch(() => filterValues.value.from, () => {fetchGridData()})
  watch(() => filterValues.value.to, () => {fetchGridData()})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <!-- <UDashboardNavbar
        title="Invoice List"
      >
      </UDashboardNavbar> -->

      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/5 min-w-[150px]">
              <UFormGroup
                label="From"
                name="quoteDate"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(filterValues.from, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="filterValues.from" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/5 min-w-[150px]">
              <UFormGroup
                label="To"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(filterValues.to, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="filterValues.to" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/5 min-w-[150px]">
              <UFormGroup
                label="Serial"
              >
                <UInput 
                  v-model="filterValues.serial"
                  @update:model-value="handleFilterChange()"
                />
              </UFormGroup>
            </div>
          </div>
        </template>
        <!-- <template #right>
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
        </template> -->
      </UDashboardToolbar>
      
      <UTable
        :rows="gridMeta.orders"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'p-0'
          }, 
          td: {
            base: 'h-[41px]',
            padding: 'py-1'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        @select="onSelect"
        @dblclick="onDblClick"
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.kind !== 'actions'">
            <div class="px-4 py-3.5">
              <CommonSortAndInputFilter 
                @handle-sorting-button="handleSortingButton" 
                @handle-input-change="handleFilterInputChange"
                :label="column.label"
                :sortable="column.sortable"
                :sort-key="column.key" 
                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                :value="filterValues[column.key]"
                :filterable="column.filterable"
                :filter-key="column.key"
              />
            </div>
            </template>
            <template v-else class='bg-slate-400'>
              <div class="flex justify-center text-center w-[53px]">
                {{ column.label }}
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
            <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onEdit(row)"/>
          </UTooltip>
        </template>
        <template #delete-data="{row}">
          <UTooltip text="Delete" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onDelete(row)"/>
          </UTooltip>
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfOrders | 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- Order Modal -->
  <UDashboardModal
    v-model="modalMeta.isOrderDetailModalOpen"
    title="Order"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl'
    }"
  >
    <CustomersOrderDetail :selected-customer="gridMeta.selectedCustomerId" :selected-order="gridMeta.selectedOrderId"  @close="handleModalClose"/>
  </UDashboardModal>    
</template>
