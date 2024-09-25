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

const totalBuilt = ref(0);
const totalOrders = ref(0);

const headerFilters = ref({
  productLines: {
    label: 'Product Line',
    filter: 'PRODUCTDESC',
    api: '/api/materials/productlines',
    options: []
  }
})
const headerCheckboxes = ref({
  open: {
    label: 'Open',
    filterKey: 'OPENCASE',
    isChecked: true
  },
  cryotherm: {
    label: 'CRYOTherm Checkup',
    filterKey: 'CRYOThermCheckup',
    isChecked: false
  },
  nonMedical: {
    label: 'Non-Medical Device',
    filterKey: 'NonMedicalDevice',
    isChecked: false
  },
  complaints: {
    label: 'Complaints',
    filterKey: 'ValidComplaint',
    isChecked: false
  },
  injury: {
    label: 'Injury',
    filterKey: 'INJURYREPORTNO',
    isChecked: false
  }
})
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[{
    key: 'COMPLAINTNUMBER',
    label: 'SO#',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'SERIALNO',
    label: 'Serial#',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'COMPLAINTDATE',
    label: 'Date',
    sortable: true,
    sortDirection: 'none',
    filterable: true
  }, {
    key: 'FAILINVEST',
    label: 'Failure Comment',
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
    key: 'Status',
    label: 'Status',
  }, {
    key: 'INJURYREPORTNO',
    label: 'Injury',
  }, {
    key: 'Warranty',
    label: 'Warranty',
  }, {
    key: 'Complaint',
    label: 'Complaint'
  }
  ],
  page: 1,
  pageSize: 50,
  numberOfServiceOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedCustomerId: null,
  selectedCompaintNumber: null,
  selectedSerialNumber: null,
  sort: {
    column: 'COMPLAINTNUMBER',
    direction: 'desc'
  },
  isLoading: false
})
const modalMeta = ref({
  isServiceOrderModalOpen: false,
})
const filterValues = ref({
  PRODUCTDESC: null,
  COMPLAINTNUMBER: null,
  SERIALNO: null,
  COMPLAINTDATE: null,
  FAILINVEST: null,
  company1: null,
  OPENCASE: true,
  CRYOThermCheckup: null,
  NonMedicalDevice: null,
  ValidComplaint: null,
  INJURYREPORTNO: null
})
const watchCheckbox = (property, filterKey) => {
  watch(
    () => headerCheckboxes.value[property].isChecked,
    (newCheckedValue) => {
      filterValues.value[filterKey] = newCheckedValue ? "1" : "0";
    }
  );
}

// Watch for each checkbox
watchCheckbox('injury', 'INJURYREPORTNO');
watchCheckbox('open', 'OPENCASE');
watchCheckbox('cryotherm', 'CRYOThermCheckup');
watchCheckbox('nonMedical', 'NonMedicalDevice');
watchCheckbox('complaints', 'ValidComplaint');

watch(() => filterValues.value.PRODUCTDESC, () => fetchBuiltCount())

const percent = computed(() => {
  if (totalOrders.value === 0) {
    return 0;
  }
  return Math.round((totalBuilt.value / totalOrders.value) * 100);
});

const selectedColumns = ref(gridMeta.value.defaultColumns)
const exportIsLoading = ref(false)

const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))

const init = async () => {
  gridMeta.value.isLoading = true
  fetchGridData()
  fetchBuiltCount()
  for (const key in headerFilters.value) {
    const apiURL = headerFilters.value[key]?.api ?? `/api/service/orders/${key}`;
    await useApiFetch(apiURL, {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      }
    })
  }
}
const fetchGridData = async () => {
  gridMeta.value.isLoading = true
  await useApiFetch('/api/service/orders/numbers', {
    method: 'GET',
    params: {
      ...filterValues.value
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfServiceOrders = response._data.body
      }
    }
  })
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfServiceOrders
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfServiceOrders / gridMeta.value.pageSize) | 1;
  }
  await useApiFetch('/api/service/orders/', {
    method: 'GET',
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.orders = response._data.body
      }
      gridMeta.value.isLoading = false
    }
  });
}
const fetchBuiltCount = async () => {
  await useApiFetch('/api/service/orders/builtCount', {
    method: 'GET',
    params: {
      PRODUCTLINE: `${filterValues.value.PRODUCTDESC}`
    },
    onResponse({ response }) {
      if (response.status === 200) {
        totalBuilt.value = response._data.body
      }
    }
  })
}
const handleModalClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false
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
            gridMeta.value.sort.column = 'COMPLAINTNUMBER';
            gridMeta.value.sort.direction = 'desc';
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
      if (value !== null)
        return `${key}=${value}`
    })
    .join("&")
  location.href = `/api/service/orders/exportorder?${paramsString}`
  exportIsLoading.value = false
}
const onPrevieOrderBtnClick = () => {
  // location.href = `/api/service/orders/exportcomplaints`
  window.open(`/api/service/orders/exportcomplaints`)
}
const onSelect = async (row) => {
  gridMeta.value.selectedOrderId = row?.uniqueID;
  gridMeta.value.selectedCustomerId = row?.customerID;
  gridMeta.value.selectedCompaintNumber = row?.COMPLAINTNUMBER;
  gridMeta.value.selectedSerialNumber = row?.SERIALNO;
}
const onDblClick = async () => {
  if (gridMeta.value.selectedCustomerId && gridMeta.value.selectedCompaintNumber) {
    modalMeta.value.isServiceOrderModalOpen = true
  }
}
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsPurpleHeader" title="Service Order">
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/5 max-w-[300px] min-w-[150px] mr-4">
              <UFormGroup label="Product Line" name="productLine">
                <USelect v-model="filterValues.PRODUCTDESC" :options="headerFilters.productLines.options"
                  @change="handleFilterChange()" />
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup label="Total Built" name="totalBuilt">
                <div class="text-bold">
                  {{ totalBuilt }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup label="Total Orders" name="totalOrders">
                <div class="text-bold">
                  {{ gridMeta.numberOfServiceOrders }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup label="%" name="percent">
                <div class="text-bold">
                  {{ percent }}%
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <div class="flex flex-row space-x-2">
            <div>
              <UButton icon="i-heroicons-document-text" label="Export to Excel" color="green" variant="outline"
                :ui="{ base: 'min-w-[210px] w-full', truncate: 'flex justify-center w-full' }" truncate
                @click="excelExport" />
            </div>
            <div>
              <UButton icon="i-heroicons-eye-20-solid" label="Preview Order Summary" variant="outline"
                :ui="{ base: 'min-w-[210px] w-full', truncate: 'flex justify-center w-full' }" truncate
                @click="onPrevieOrderBtnClick" />
            </div>
          </div>
        </template>
      </UDashboardToolbar>
      <div class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Order Lookup</h2>
      </div>
      <div class="flex flex-row px-4 pt-4 bg-gms-gray-100">
        <template v-for="checkbox in headerCheckboxes">
          <div class="basis-1/5">
            <UCheckbox v-model="filterValues[checkbox.filterKey]" :label="checkbox.label"
              @update:model-value="handleFilterChange" />
          </div>
        </template>
      </div>
      <UTable :rows="gridMeta.orders" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
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
          <template v-if="column.key === 'failure'">
            <div class="">
              <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                @handle-input-change="handleFilterInputChange" :label="column.label" :sortable="column.sortable"
                :sort-key="column.key"
                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                :filterable="column.filterable" :filter-key="column.key" />
            </div>
          </template>
          <template v-else>
            <div class="">
              <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                @handle-input-change="handleFilterInputChange" :label="column.label" :sortable="column.sortable"
                :sort-key="column.key"
                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                :filterable="column.filterable" :filter-key="column.key" />
            </div>
          </template>
        </template>
      </UTable>
      <!-- <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfServiceOrders || 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div> -->
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal v-model="modalMeta.isServiceOrderModalOpen" title="Service Order" :ui="{
    title: 'text-lg text-white',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
    },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <ServiceOrderDetail @close="handleModalClose" @save="handleModalSave" :form-action="null"
      :selected-serial="gridMeta.selectedSerialNumber" :selected-customer="gridMeta.selectedCustomerId"
      :selected-complaint="gridMeta.selectedCompaintNumber" :selected-order="gridMeta.selectedOrderId" />
  </UDashboardModal>


</template>