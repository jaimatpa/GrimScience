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
      label: "Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },

    {
      key: "SUBCATEGORY",
      label: "Sub Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
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
  submitPropsData: null,
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
        const uniqueSubcategories = [
          ...new Set(
            response._data.tableData.data
              .filter((item) => item.SUBCATEGORY) // Filter out null values
              .map((item) => item.SUBCATEGORY)
          ),
        ];

        // Update headerFilters with formatted options
        // headerFilters.value.SubCategoryList.options = uniqueSubcategories.map(
        //   (subcategory) => ({
        //     label: subcategory,
        //     value: subcategory,
        //   })
        // );


        gridMeta.value.defaultColumns.find(
          (column) => column.key === "SUBCATEGORY"
        ).filterOptions = uniqueSubcategories.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const fetchCategoryData = async () => {
  await useApiFetch(`/api/maintenance/equipment/getAllCategory`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data;
        // console.log("hello API-----------------",filters)

        gridMeta.value.defaultColumns.find(
          (column) => column.key === "PARTTYPE"
        ).filterOptions = filters.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
    },
  });
};

const fetchSubCategoryData = async () => {
  await useApiFetch(`/api/materials/requisitions/getAllDataApi?type=employee`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.employeeList;
        //  console.log("hello API-----------------",filters)
        headerFilters.value.EmployeeList.options =
        filters.map((category) => ({
            label: category,
            value: category,
          }));
      }
    },
  });
};

const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};

const emit = defineEmits(["rowSelected", "rowDoubleClicked"]);
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
const handleModalClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false;
};
const onDblClick = () => {
  emit("rowDoubleClicked");
};

// new COde

const handleCategoryChange = (newValue) => {
  filterValues.value.PARTTYPE = newValue.label;
  fetchGridData();
};

const handleTagEntriesFormData = async (event, name) => {
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="gmsBlueHeader">
        <h1 class="py-[10px] px-[15px] text-xl">Requisitions</h1>
      </div>
      <div class="gmsBlueTitlebar">
        <h3 class="py-[10px] px-[15px] text-sm">Employee</h3>
      </div>
      <div class="flex p-4">
        <div class="w-1/2">
          <div class="flex gap-4">
            <div class="w-1/2 flex">
              <h1 class="pr-[8px]">Employee:</h1>
              <UInputMenu
                v-model="submitData.employeeOption"
                :options="headerFilters.EmployeeList.options"
                class="w-full"
              />
            </div>
            <div class="w-1/2 flex">
              <h1 class="pr-[8px]">Date:</h1>
              <UInput v-model="submitData.inputData" type="date" class="w-40" />
            </div>
          </div>
        </div>
        <div class="w-1/2 flex justify-end">
          <div class="flex items-center">
            <h1 class="pr-[8px]">Date Required:</h1>
            <UInput v-model="submitData.requireDate" type="date" class="w-40" />
          </div>
        </div>
      </div>
      <div class="gmsBlueTitlebar">
        <h3 class="py-[10px] px-[15px] text-sm">Parts Lookup</h3>
      </div>
      <div class="basis-3/4">
        <UTable
          :rows="gridMeta.orders"
          :columns="gridMeta.defaultColumns"
          :loading="gridMeta.isLoading"
          class="w-full"
          :ui="{
            wrapper:
              'overflow-auto h-[300px] border-2 border-gray-300 dark:border-gray-700',
            divide: 'divide-gray-200 dark:divide-gray-800',
            tr: {
              active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
            },
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:text-gray dark:bg-[#111827]',
              padding: 'p-0',
            },
            td: {
              base: 'h-[31px]',
              padding: 'py-0',
            },
          }"
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'No items.',
          }"
          @select="onSelect"
          @dblclick="onDblClick"
        >
          <template
            v-for="column in gridMeta.defaultColumns"
            v-slot:[`${column.key}-header`]
          >
            <template v-if="!column.filterOptions">
              <div class="px-1 py-1">
                <CommonSortAndInputFilter
                  @handle-input-change="handleTagEntriesFormData"
                  :label="column.label"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                />
              </div>
            </template>
            <template v-else>
              <div class="px-1 py-1">
                <CommonSortAndSelectFilter
                  @handle-select-change="handleTagEntriesFormData"
                  :label="column.label"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                  :filter-options="column.filterOptions"
                />
              </div>
            </template>
          </template>
        </UTable>
      </div>
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
