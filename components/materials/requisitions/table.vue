<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { defineEmits } from "vue";

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
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
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
      label: "Stock #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "ORDEREDBY",
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
  selectedCustomerId: null,
  selectedCompaintNumber: null,
  selectedSerialNumber: null,
  sort: {
    column: "MANO",
    direction: "desc",
  },
  isLoading: false,
});

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
  filterValues.value.CATAGORY = newValue;
  fetchGridData();
};

const handleSubcategoryChange = (newValue) => {
  filterValues.value.SUBCATAGORY = newValue;
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
  fetchGridData();
  gridMeta.value.isLoading = true;
};

const fetchGridData = async () => {
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

const emit = defineEmits(["rowSelected", "rowDoubleClicked"]);
const onSelect = (row) => {
  emit("rowSelected", row);
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
      console.log("okay", data._rawValue);
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
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-show="props.isPage"
        class="gmsPurpleHeader"
        title="Requisitions"
      >
      </UDashboardNavbar>

      <div class="flex bg-gray-100 p-4">
        <div class="w-1/2">
          <div class="flex gap-4">
            <div class="w-1/2 flex">
              <h1>Emplayee</h1>

              <USelect
                :options="headerFilters.EmployeeList.options"
                class="w-full"
              />
            </div>
            <div class="w-1/2 flex">
              <h1>Date</h1>
              <UInput type="date" class="w-40" />
            </div>
          </div>
        </div>

        <div class="w-1/2 ml-auto">
          <div class="w-1/2 flex">
            <h1>Date Required</h1>
            <UInput type="date" class="w-40" />
          </div>
        </div>
      </div>

      <div class="bg-green-500">
        <h1 class="pt-[20px]">Parts Lookup</h1>
      </div>

      <!-- <UTable
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
                  :options="headerFilters.EmployeeList.options"
                  @change="handleSubcategoryChange"
                  class="w-full"
                />
                <span class="text-xs text-gray-500">Sub </span>
              </div>
            </template>

            <template v-else-if="['PART', 'ORDEREDBY'].includes(column.key)">
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
      </UTable> -->
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
                  :options="headerFilters.EmployeeList.options"
                  @change="handleSubcategoryChange"
                  class="w-full"
                />
                <span class="text-xs text-gray-500">Sub</span>
              </div>
            </template>

            <template v-else-if="['PART', 'ORDEREDBY'].includes(column.key)">
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
