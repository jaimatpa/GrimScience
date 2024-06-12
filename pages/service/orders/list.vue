<script lang="ts" setup>
  import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })

  useSeoMeta({
    title: 'Grimm-Service Orders'
  })

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const totalBuilt = ref(24570);
  const totalOrders = ref(233);
  const percent = ref(1)

  const headerFilters = ref({
    productLines: {
      label: 'Product Line',
      filter: 'productLine',
      options: []
    }
  })
  const headerCheckboxes = ref({
    open: {
      label: 'Open',
      isChecked: true
    }, 
    cryotherm: {
      label: 'CRYOTherm Checkup',
      isChecked: false
    }, 
    nonMedical: {
      label: 'Non-Medical Device',
      isChecked: false
    }, 
    complaints: {
      label: 'Complaints',
      isChecked: false
    }, 
    injury: {
      label: 'Injury',
      isChecked: false
    }
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'UniqueID',
        label: 'SO#',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'serialid',
        label: 'Serial#',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'failure',
        label: 'Failure Comment',
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
        key: 'status',
        label: 'Status',
      }, {
        key: 'injury',
        label: 'Injury',
      }, {
        key: 'warranty',
        label: 'Warranty',
      }, {
        key: 'complaint',
        label: 'Complaint'
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfOrders: 0, 
    orders: [],
    selectedOrderId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isServiceOrderModalOpen: false,
  })
  const filterValues = ref({
    productLine: null,
    UniqueID: null,
    serial: null,
    orderdate: null,
    failureComment: null,
    company: null,
    status: null,
    injury: null,
    warranty: null,
    complaint: null,
  })
  const selectedColumns = ref(gridMeta.value.defaultColumns)
  const exportIsLoading = ref(false)

  const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))

  const init = () => {
    gridMeta.value.isLoading = true
    useApiFetch('/api/service/orders', {
      method: 'GET',
      params: {
        page: gridMeta.value.page,
        pageSize: gridMeta.value.pageSize,
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.isLoading = false
          gridMeta.value.orders = response._data.body;
        }
      }
    })
  }
  const handleModalClose = () => {
    modalMeta.value.isServiceOrderModalOpen = false
  }
  const handleModalSave = async () => {
    handleModalClose()
    init()
  }
  const handlePageChange = async () => {
    init()
  }
  const handleFilterChange = () => {
    gridMeta.value.page = 1
    init()
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
    init()
  }
  const handleFilterInputChange = async (event, name) => {
    gridMeta.value.page = 1
    if (filterValues.value.hasOwnProperty(name)) {
      filterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
    init()
  }
  const excelExport = () => {
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
    location.href = `/api/customers/exportorder?${paramsString}`
    exportIsLoading.value = false
  }
  const onSelect = async (row) => {
    gridMeta.value.selectedOrderId = row?.UniqueID;
  }
  const onDblClick = async () =>{
    if(gridMeta.value.selectedOrderId){
      // modalMeta.value.isServiceOrderModalOpen = true
    }
  }
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Service Order"
      >
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/5 max-w-[300px] min-w-[150px] mr-4">
              <UFormGroup
                label="Product Line"
                name="productLine"
              >
                <USelect
                  v-model="filterValues.productLine"
                  :options="headerFilters.productLines.options"
                  @change="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="Total Built"
                name="totalBuilt"
              >
                <div class="text-bold">
                  {{ totalBuilt }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="Total Orders"
                name="totalOrders"
              >
                <div class="text-bold">
                  {{ totalOrders }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="%"
                name="percent"
              >
                <div class="text-bold">
                  {{ percent }}%
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
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
        </template>
      </UDashboardToolbar>
      
      <UDashboardModal
        v-model="modalMeta.isServiceOrderModalOpen"
        title="Service Order List"
        :ui="{width: 'w-[1800px] sm:max-w-9xl', body: {padding: 'py-0 sm:pt-0'}}"
      >
        <ServiceOrderDetail @close="handleModalClose" @save="handleModalSave" :selected-order="gridMeta.selectedOrderId"/>
      </UDashboardModal>

      <div class="flex flex-row px-10 mt-4">
        <template v-for="checkbox in headerCheckboxes">
          <div class="basis-1/5">
            <UCheckbox
              v-model="checkbox.isChecked"
              :label="checkbox.label"
            />
          </div>
        </template>
      </div>
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
          }, 
          td: {
            padding: 'py-2'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        @select="onSelect"
        @dblclick="onDblClick"
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.key === 'failure'">
            <div class="min-w-[200px]">
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
            </div>
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
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.page" :total="1000" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>