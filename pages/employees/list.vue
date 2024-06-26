<script lang="ts" setup>
  import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })
  useSeoMeta({
    title: 'Grimm-Employees List'
  })

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const route = useRoute()
  const toast = useToast()

  const headerFilters = ref({
    
  })

  const headerCheckboxes = ref({
    active: {
      label: 'Active',
      isChecked: false
    }, 
    inactive: {
      label: 'Inactive',
      isChecked: false
    }, 
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[
      // {
      //   key: 'UniqueID',
      //   label: 'Number',
      //   sortable: true,
      //   sortDirection: 'none',
      //   filterable: true
      // },
      {
        key: 'payrollno',
        label: 'Payroll #',
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
        key: 'address',
        label: 'Address',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'city',
        label: 'City',
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
      }, 
      // {
      //   key: 'home',
      //   label: 'Home',
      //   sortable: true,
      //   sortDirection: 'none',
      //   filterable: true
      // }, 
      {
        key: 'homephone',
        label: 'Home Cell Phone',
        sortable: true,
        sortDirection: 'none',
        filterable: true
        
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfOrders: 0,
    numberOfEmployee: 0,
    employess: [],
    selectedEmpployeeId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isEmployeeModalOpen: false,
    // isOrderDetailModalOpen: false,
    // isQuoteDetailModalOpen: false,
    // isServiceOrderDetailModalOpen: false,
    // isSiteVisitModalOpen: false,
    modalTitle: "New Employee",
    modalDescription: "Add a new Employee to your database"
  })
  const filterValues = ref({
    ACTIVE:  null,
    payrollno: null,
    fname: null,
    lname: null,
    address: null, 
    city: null,
    state: null,
    zip: null,
    homephone: null
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
    // for(const key in headerFilters.value) {
    //   const apiURL = headerFilters.value[key]?.api?? `/api/customers/${key}`;
    //   // console.log("check apiURL", apiURL)
    //   await useApiFetch(apiURL, {
    //     method: 'GET',
    //     onResponse({ response }) {
    //       if(response.status === 200) {
    //         headerFilters.value[key].options = [null, ...response._data.body];
    //       }
    //     }
    //   })
    // }
  }
  const fetchGridData = async () => {
    gridMeta.value.isLoading = true

    const { ACTIVE, ...values} = filterValues.value
    // handle number of emoloyees and pagination
    await useApiFetch('/api/employees/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value,
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.numberOfEmployee = response._data.body
        }
      }
    })
    if(gridMeta.value.numberOfEmployee === 0){
      gridMeta.value.employess = []
      gridMeta.value.numberOfEmployee = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfEmployee) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfEmployee / gridMeta.value.pageSize) | 1
    }
    await useApiFetch('/api/employees/list', {
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
            gridMeta.value.employess = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }

  const handleCheckBoxChange = () => {
    const isActiveChecked = headerCheckboxes.value.active.isChecked;
    const isInactiveChecked = headerCheckboxes.value.inactive.isChecked;

    if (isActiveChecked && !isInactiveChecked) {
      filterValues.value.ACTIVE = Number(1);
    } else if (!isActiveChecked && isInactiveChecked) {
      filterValues.value.ACTIVE = Number(0);
    } else {
      // If both are true or both are false, remove ACTIVE from filterValues
      delete filterValues.value.ACTIVE;
    }
    
    fetchGridData()
  }

  const handlePageChange = async () => {
    fetchGridData()
  }

  const onCreate = () => {
    gridMeta.value.selectedEmpployeeId = null
    modalMeta.value.modalTitle = "New Employee";
    modalMeta.value.modalDescription = "Add a new employee"
    modalMeta.value.isEmployeeModalOpen = true
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

  const handleModalClose = () => {
    modalMeta.value.isEmployeeModalOpen = false
  }

  const handleModalSave = async () => {
    handleModalClose()
    fetchGridData()
  }

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Employee List"
      >
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup
                label="Quantity"
                name="Quantity"
              >
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfEmployee }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <UButton
            label="New Employee"
            color="gray"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <!-- New Employee Detail Modal -->
      <UDashboardModal
        v-model="modalMeta.isEmployeeModalOpen"
        :title="modalMeta.modalTitle"
        :description="modalMeta.modalDescription"
       :ui="{width: 'w-[1600px] sm:max-w-8xl', body: {padding: 'py-0 sm:pt-0'}}"
      >
        <EmployeeForm @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedEmpployeeId" :is-modal="true"/>
      </UDashboardModal>
     
      <div class="flex flex-row px-10 mt-4">
        <template v-for="(checkbox, index) in headerCheckboxes" :key="index">
          <div class="basis-1/5">
            <UCheckbox
              v-model="checkbox.isChecked"
              :label="checkbox.label"
              @change="handleCheckBoxChange()"
            />
          </div>
        </template>
      </div>
      <UTable
        :rows="gridMeta.employess"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
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
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfEmployee || 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>