<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { defineEmits } from "vue";
import PopupCard from "./popup.vue";

onMounted(async () => {
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
  categoryList: {
    filter: "PRODUCT",
    options: [],
  },
  EmployeeList: {
    filter: "EMPLOYEE",
    options: [],
  },
  SubCategoryList: {
    filter: "EMPLOYEE",
    options: [],
  },
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[

    {
      key: "PARTTYPE",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },

    {
      key: "SUBCATEGORY",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "STOCKNUMBER",
      label: "Stock #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 30,
  numberOfChangeOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedSerialRow: null,
  selectedCustomerId: null,
  submitPropsData:null,
  sort: {
    column: "PARTTYPE",
    direction: "desc",
  },
  isLoading: false,
});

const submitData = ref({
  employeeOption: "",
  inputData: "",
  requireDate: "",

});
const filterValues = ref({
  PARTTYPE: "Computer",
  SUBCATEGORY: null,
  DESCRIPTION: null,
  STOCKNUMBER: null,
});



const handleSubcategoryChange = (newValue) => {
  filterValues.value.SUBCATEGORY = newValue;
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

const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const init = async () => {
  gridMeta.value.isLoading = true;
};

// const fetchGridData = async () => {
//   await useApiFetch("/api/materials/requisitions/getAllDataApi?type=table", {
//     method: "GET",
//     params: {
//       page: gridMeta.value.page,
//       pageSize: gridMeta.value.pageSize,
//       sortBy: gridMeta.value.sort.column,
//       sortOrder: gridMeta.value.sort.direction,
//       ...filterValues.value,
//     },

//     onResponse({ response }) {
//       console.log(response);
//       if (response.status === 200) {
//       console.log( response._data.tableData.data)
//         gridMeta.value.orders = response._data.tableData.data;

//          headerFilters.value.SubCategoryList.options =  response._data.tableData.data.SUBCATEGORY.map(
//         (SUBCATEGORY) => ({
//           label: SUBCATEGORY,
//           value: SUBCATEGORY,
//         })
//       );
//       }
//       gridMeta.value.isLoading = false;
//     },
//   });
// };

const fetchGridData = async () => {
  await useApiFetch("/api/materials/requisitions/getAllDataApi?type=table", {
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
        // Store the full data in gridMeta
        gridMeta.value.orders = response._data.tableData.data;

        // Extract unique SUBCATEGORY values
        const uniqueSubcategories = [...new Set(
          response._data.tableData.data
            .filter(item => item.SUBCATEGORY) // Filter out null values
            .map(item => item.SUBCATEGORY)
        )];

        // Update headerFilters with formatted options
        headerFilters.value.SubCategoryList.options = uniqueSubcategories.map(
          subcategory => ({
            label: subcategory,
            value: subcategory,
          })
        );
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const fetchCategoryData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllCategory"
    );
    if (data._rawValue) {
      headerFilters.value.categoryList.options = data._rawValue.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
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

const emit = defineEmits(["rowSelected", "rowDoubleClicked"]);

const handleModalClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false;
};
const modalMeta = ref({
  isServiceOrderModalOpen: false,
});




const onSelect = (row) => {
  gridMeta.value.selectedSerialRow = row;
  gridMeta.value.submitPropsData = {
    employeeOption: submitData.value.employeeOption.label || "",
    inputData: submitData.value.inputData || "",
    requireDate: submitData.value.requireDate || "",
  };
  modalMeta.value.isServiceOrderModalOpen = true;
};

const onDblClick = () => {
  emit("rowDoubleClicked");
};

// new COde
const fetchSubCategoryData = async () => {
  try {
    const { data } = await useFetch(
      "/api/materials/requisitions/getAllDataApi?type=employee"
    );
    if (data._rawValue) {
    
      headerFilters.value.EmployeeList.options =
        data._rawValue.employeeList.map((category) => ({
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

const handleCategoryChange = (newValue) => {
  debugger;
  filterValues.value.PARTTYPE = newValue.label;
  fetchGridData();
};

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-show="props.isPage"
        class="bg-[#4682B4] w-full"
        title="Requisitions"
      >
      </UDashboardNavbar>

      <div class="flex bg-gray-100 p-4">
        <div class="w-1/2">
          <div class="flex gap-4">
            <div class="w-1/2 flex">
              <h1 class="pr-[8px]">Emplayee</h1>

              <UInputMenu
                v-model="submitData.employeeOption"
                :options="headerFilters.EmployeeList.options"
                class="w-full"
              />
            </div>
            <div class="w-1/2 flex">
              <h1 class="pr-[8px]">Date</h1>
              <UInput v-model="submitData.inputData" type="date" class="w-40" />
            </div>
          </div>
        </div>

        <div class="w-1/2 ml-auto">
          <div class="w-1/2 flex">
            <h1 class="pr-[8px]">Date Required</h1>
            <UInput v-model="submitData.requireDate" type="date" class="w-40" />
          </div>
        </div>
      </div>

      <div class="bg-[#4682B4]">
        <h1 class="pt-[20px]">Parts Lookup</h1>
      </div>
      <UTable
        :rows="gridMeta.orders"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :style="{
          maxHeight: gridMeta.orders.length > 10 ? '400px' : 'auto',
          overflowY: gridMeta.orders.length > 10 ? 'scroll' : 'auto',
        }"
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
            <template v-if="column.key === 'PARTTYPE'">
              <div class="w-full">
                <UInputMenu
                  v-model="filterValues.PARTTYPE"
                  :options="headerFilters.categoryList.options"
                  @change="handleCategoryChange"
                  class="w-full"
                />
                <span class="text-xs text-gray-500">Category</span>
              </div>
            </template>

            <template v-if="column.key === 'SUBCATEGORY'">
              <div class="w-full">
                <UInputMenu
                  v-model="filterValues.SUBCATEGORY"
                  :options="headerFilters.SubCategoryList.options"
                  @change="handleSubcategoryChange"
                  class="w-full"
                />
                <span class="text-xs text-gray-500">Sub</span>
              </div>
            </template>

            <template
              v-else-if="['STOCKNUMBER', 'DESCRIPTION'].includes(column.key)"
            >
              <div class="w-full">
                <input
                  type="text"
                  v-model="filterValues[column.key]"
                  @input="filterTable"
                  placeholder="Search"
                  class="w-full mt-1 border border-gray-300 rounded px-2 py-1"
                /><br />
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
    </UDashboardPanel>
  </UDashboardPage>



  <UDashboardModal
    v-model="modalMeta.isServiceOrderModalOpen"
    title="How Many Items Would You Like To Request ? "
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-[#4682B4] py-5 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[650px] sm:max-w-9xl',
    }"
  >
    <PopupCard
      @close="handleModalClose"
      @save="handleModalSave"
      :selectedRow="gridMeta.selectedSerialRow"
      :submitData="gridMeta.submitPropsData"
    />
  </UDashboardModal>

  
</template>
