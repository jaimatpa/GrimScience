<script lang="ts" setup>
  import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })
  useSeoMeta({
    title: 'Grimm-Employees List'
  })

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
      }, {
        key: 'zip',
        label: 'Zip',
      }, {
        key: 'home',
        label: 'Home',
      }, {
        key: 'homephone',
        label: 'Home Cell Phone'
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfOrders: 0,
    numberOfEmployee: 0,
    employess: [],
    selectedOrderId: null,
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
    Active:  false,
    inActive: false
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
    // handle number of emoloyees and pagination
    await useApiFetch('/api/employees/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          console.log('response._data',response._data);
          
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
            console.log("calling response._data.body",response._data.body)
            gridMeta.value.employess = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }

  const handleCheckBoxChange = () => {

    filterValues.value.Active = headerCheckboxes.value.active.isChecked
    // filterValues.value.inActive = headerCheckboxes.value.inactive.isChecked
    console.log('√√', filterValues.value);
    
    fetchGridData()
  }

  const handlePageChange = async () => {
    fetchGridData()
  }

  const onCreate = () => {
    console.log("create employee")
   
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
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfEmployee || 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>