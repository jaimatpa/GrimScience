<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { defineEmits } from "vue";

onMounted(async() => {
  await init();
  fetchGridData();
  await fetchCategoryData();
  await fetchSubCategoryData();
});

useSeoMeta({
  title: "Grimm-Service Orders",
});

const props = defineProps({
  shouldRefresh: {
    type: Boolean,
  },
  isPage: {
    type: [Boolean, null],
  },
});

watchEffect(() => {
  if (props.shouldRefresh) {
    fetchGridData();
  }
});

const headerFilters = ref({
  // productLines: {
  //   label: "Product Line",
  //   filter: "PRODUCT",
  //   api: "/api/materials/productlines",
  //   options: [],
  // },
  categoryList: {
    
    filter: "PRODUCT",
    options: [],
  },
  subCategoryList:{
    filter: "PRODUCT",
    options: [], 
  }
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "MANO",
      label: "#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "CATAGORY",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SUBCATAGORY",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "PART",
      label: "Equipment",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "ORDEREDBY",
      label: "Responsible",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SERIAL",
      label: "Serial #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "REQUIRED",
      label: "Next Service Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 10,
  numberOfChangeOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedCustomerId: null,
  selectedCompaintNumber: null,
  selectedSerialNumber: null,
  sort: {
    column:"MANO",
    direction: "desc",
  },
  isLoading: false,
});

// const formattedOrders = computed(() => {
//   return gridMeta.value.orders.map((order) => {
//     return {
//       ...order,
//       DESCRIPTION: order.DESCRIPTION.split(" ").slice(0, 5).join(" "),
//     };
//   });
// });

const modalMeta = ref({
  isServiceOrderModalOpen: false,
});

const filterValues = ref({
  MANO: null,
  CATAGORY: null,
  SUBCATAGORY: null,
  PART: null,
  ORDEREDBY: null,
  SERIAL: null,
  REQUIRED: null,
});

const handleCategoryChange = (newValue) => {
  debugger
  filterValues.value.CATAGORY  = newValue;
  fetchGridData();
};

const handleSubcategoryChange = (newValue) => {
  filterValues.value.SUBCATAGORY  = newValue;
  fetchGridData();
};




watch(
  filterValues,
  (newVal) => {
    fetchGridData();
  },
  { deep: true }
);

const selectedColumns = ref(gridMeta.value.defaultColumns);
const exportIsLoading = ref(false);
const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const init = async () => {
  fetchGridData();
  gridMeta.value.isLoading = true
};


const fetchGridData = async () => {
  debugger
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/maintenance/equipment/totalNumber", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfChangeOrders = response._data.body;
      }
    },
  });

  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfChangeOrders
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfChangeOrders / gridMeta.value.pageSize) |
      1;
  }

  
  await useApiFetch("/api/maintenance/equipment/getTableData", {
  
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    },

    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.orders = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const fetchCategoryData = async () => { 
  try {
    const {data }= await useFetch("/api/maintenance/equipment/getAllCategory");
    if (data._rawValue) {
      headerFilters.value.categoryList.options = data._rawValue.map((category) => ({
        label: category ,
        value: category, 
      }));
  
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchSubCategoryData = async () => { 
  try {
    const {data }= await useFetch("/api/maintenance/equipment/getAllSubCategory");
    if (data._rawValue) {
      headerFilters.value.subCategoryList.options = data._rawValue.map((category) => ({
        label: category,
        value: category, 
      }));
  
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};


const handleModalClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false;
};
const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};
const handlePageChange = async () => {
  fetchGridData();
};

const handleSortingButton = async (btnName: string) => {
  gridMeta.value.page = 1;
  for (const column of columns.value) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case "none":
            column.sortDirection = "asc";
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = "asc";
            break;
          case "asc":
            column.sortDirection = "desc";
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = "desc";
            break;
          default:
            column.sortDirection = "none";
            gridMeta.value.sort.column = "uniqueID";
            gridMeta.value.sort.direction = "desc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  init();
};

// Export excel data download  function
const excelExport = () => {
  exportIsLoading.value = true;
  const params = {
    sortBy: gridMeta.value.sort.column,
    sortOrder: gridMeta.value.sort.direction,
    ...filterValues.value,
  };
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      if (value !== null) return `${key}=${value}`;
    })
    .join("&");
  location.href = `/api/maintenance/equipment/exportorder?${paramsString}`;
  exportIsLoading.value = false;
};


const emit = defineEmits(["rowSelected", "rowDoubleClicked"]);
const onSelect = (row) => {
  emit("rowSelected", row);
};
const onDblClick = () => {
  emit("rowDoubleClicked");
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-show="props.isPage"
        class="gmsPurpleHeader"
        title="Order Details"
      >
      </UDashboardNavbar>
      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[300px] min-w-[150px] mr-4">
              <UFormGroup label="Maintenance order lookup" name="productLine">
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <div class="flex flex-row space-x-2">
            <div>
              <UButton
                icon="i-heroicons-document-text"
                label="Export to Excel"
                color="green"
                variant="outline"
                :ui="{
                  base: 'min-w-[210px] w-full',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
                @click="excelExport"
              />
            </div>
          </div>
        </template>
      </UDashboardToolbar>
      <UTable
  :rows="gridMeta.orders"
  :columns="columns"
  :loading="gridMeta.isLoading"
  class="w-full"
  :ui="{
    divide: 'divide-gray-200 dark:divide-gray-800',
    th: {
      base: 'top-0 z-5 px-1',
      padding: 'pb-0',
    },
    td: {
      padding: 'py-0.5 px-1',
    },
  }"
  :empty-state="{
    icon: 'i-heroicons-circle-stack-20-solid',
    label: 'No items.',
  }"
  @select="onSelect"
  @dblclick="onDblClick"
>
  <template v-for="column in columns" v-slot:[`${column.key}-header`]>
    <div class="space-x-2"> 

      
      <template v-if="column.key === 'CATAGORY'">
        <div class="w-full"> 
          <USelect
            v-model="filterValues.CATEGORY"
            :options="headerFilters.categoryList.options"
            @change="handleCategoryChange"
            class="w-full" 
          />
          <span class="text-xs text-gray-500">Category</span>
        </div>
      </template>

      <template v-if="column.key === 'SUBCATAGORY'">
        <div class="w-full">
          <USelect
            v-model="filterValues.SUBCATEGORY"
            :options="headerFilters.subCategoryList.options"
            @change="handleSubcategoryChange"
            class="w-full"
          />
          <span class="text-xs text-gray-500">Subcategory</span>
        </div>
      </template>

   
      <template
        v-else-if="['MANO','PART', 'ORDEREDBY', 'SERIAL', 'REQUIRED'].includes(column.key)"
      >
        <div class="w-full">
          <input
            type="text"
            v-model="filterValues[column.key]"
            @input="filterTable"
            placeholder="Search"
            class="w-full mt-1 border border-gray-300 rounded px-2 py-1" 
          /><br/>
          <span class="text-xs text-gray-500">{{ column.label }}</span>
        </div>
      </template>

      <template v-else>
        <div class="w-full">
          <span class="text-xs text-gray-500">{{ column.label }}</span>
        </div>
      </template>

    </div>
  </template>
</UTable>

      <!-- <UTable
        :rows="gridMeta.orders"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: {
            base: ' top-0 z-10 px-1',
            padding: 'pb-0',
          },
          td: {
            padding: 'py-0.5 px-1',
          },
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        @select="onSelect"
        @dblclick="onDblClick"
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
         
     
          <template v-if="column.key === 'CATAGORY'">
            <div>
              <USelect
                v-model="filterValues.CATAGORY"
                :options="headerFilters.categoryList.options" 
                @change="handleCategoryChange"
                class="w-full"
              />
              <span class="text-xs text-gray-500">Category</span>
            </div>
          </template>

       
          <template v-if="column.key === 'SUBCATAGORY'">
            <div>
              <USelect
                v-model="filterValues.SUBCATAGORY"
                :options="headerFilters.subCategoryList.options"
                @change="handleSubcategoryChange"
              />
              <span class="text-xs text-gray-500">Subcategory</span>
            </div>
          </template>

     
          <template
            v-else-if="
              ['MANO','PART', 'ORDEREDBY', 'SERIAL', 'REQUIRED'].includes(column.key)
            "
          >
            <div>
              <input
                type="text"
                v-model="filterValues[column.key]"
                @input="filterTable"
                placeholder="Search"
                class="mt-1 border border-gray-300 rounded px-2 py-1"
              /><br/>
              <span class="text-xs text-gray-500">{{ column.label }}</span>
            </div>
          </template>

      
          <template v-else>
            <div>
              <span class="text-xs text-gray-500">{{ column.label }}</span>
            </div>
          </template>
        </template>
      </UTable> -->


      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfChangeOrders | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>

        <div v-if="!props.isPage">
          <div class="mt-3 w-[120px]">
            <UButton
              icon="i-heroicons-cursor-arrow-ripple"
              variant="outline"
              color="green"
              label="Select"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              truncate
              @click="handleSelect"
            >
            </UButton>
          </div>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal
    v-model="modalMeta.isServiceOrderModalOpen"
    title="Service Order"
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
    }"
  >
    <ServiceOrderDetail
      @close="handleModalClose"
      @save="handleModalSave"
      :form-action="null"
      :selected-serial="gridMeta.selectedSerialNumber"
      :selected-customer="gridMeta.selectedCustomerId"
      :selected-complaint="gridMeta.selectedCompaintNumber"
      :selected-order="gridMeta.selectedOrderId"
    />
  </UDashboardModal>
</template>
