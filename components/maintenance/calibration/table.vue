<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { defineEmits } from "vue";

onMounted(async () => {
  await init();
  await fetchGridData();
  await fetchSubCategoryData();
  await fetchInstrumentData();
  await fetchUserData();
  await fetchWorkCenterData();
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

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "REQUIRED",
      label: "Expaire",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "MANO",
      label: "IC#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SUBCATAGORY",
      label: "SubCategory",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "PART",
      label: "Instrument",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "InstLoc",
      label: "WorkCenter",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "ORDEREDBY",
      label: "User",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "ManSerial",
      label: "Manufacture SN",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "RemovedFromService",
      label: "Removed From Service",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 15,
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
  REQUIRED: null,
  MANO: null,
  SUBCATAGORY: null,
  PART: null,
  InstLoc: null,
  ORDEREDBY: null,
  ManSerial: null,
  RemovedFromService: null,
  inService: "true",
});

// const handleSubmitCategory = (newValue) => {
//   filterValues.value.SUBCATAGORY = newValue.label;

//   fetchGridData();
// };

// const handleINstrument = (newValue) => {
//   filterValues.value.PART = newValue.label;
//   fetchGridData();
// };

// const handleWorkCenter = (newValue) => {
//   filterValues.value.InstLoc = newValue.label;
//   fetchGridData();
// };

// const handleUser = (newValue) => {
//   filterValues.value.ORDEREDBY = newValue.label;
//   fetchGridData();
// };

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
  gridMeta.value.isLoading = true;
};

const fetchGridData = async () => {
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

  await useApiFetch("/api/maintenance/calibration/getAllData?type=table", {
    method: "GET",

    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    },

    onResponse({ response }) {
      console.log("hello", response);
      if (response.status === 200) {
         gridMeta.value.orders = response._data.tableList;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

// const headerFilters = ref({
//   categoryList: {
//     filter: "PRODUCT",
//     options: [],
//   },
//   subCategoryList: {
//     filter: "PRODUCT",
//     options: [],
//   },
//   workCenterList: {
//     filter: "PRODUCT",
//     options: [],
//   },

//   userListList: {
//     filter: "PRODUCT",
//     options: [],
//   },
//   fetchInstrumentDataList: {
//     filter: "PRODUCT",
//     options: [],
//   },
// });


const fetchInstrumentData = async () => {
  await useApiFetch(`/api/maintenance/calibration/getAllData?type=instrument`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.instrumentList;
        //  console.log("hello API-----------------",filters)


        gridMeta.value.defaultColumns.find(
          (column) => column.key === "PART"
        ).filterOptions = filters.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
    },
  });
};



const fetchSubCategoryData = async () => {
  await useApiFetch(`/api/maintenance/calibration/getAllData?type=subCategory`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.subList;
          console.log("hello API-----------------",filters)


        gridMeta.value.defaultColumns.find(
          (column) => column.key === "SUBCATAGORY"
        ).filterOptions = filters.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
    },
  });
};


// const fetchSubCategoryData = async () => {
//   try {
//     const { data } = await useFetch(
//       "/api/maintenance/calibration/getAllData?type=subCategory"
//     );
//     if (data._rawValue) {
//       headerFilters.value.subCategoryList.options = data._rawValue.subList.map(
//         (category) => ({
//           label: category,
//           value: category,
//         })
//       );
//     } else {
//       console.error("No category data found");
//     }
//   } catch (err) {
//     console.error("Error fetching category data:", err);
//   }
// };
const fetchWorkCenterData = async () => {
  await useApiFetch(`/api/maintenance/calibration/getAllData?type=workCenter`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.workCenter;
        //  console.log("hello API-----------------",filters)


        gridMeta.value.defaultColumns.find(
          (column) => column.key === "InstLoc"
        ).filterOptions = filters.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
    },
  });
};



const fetchUserData = async () => {
  await useApiFetch(`/api/maintenance/calibration/getAllData?type=user`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.userList;
        //  console.log("hello API-----------------",filters)


        gridMeta.value.defaultColumns.find(
          (column) => column.key === "ORDEREDBY"
        ).filterOptions = filters.map((emp) => ({
          label: emp,
          value: emp,
        }));
      }
    },
  });
};


// const fetchUserData = async () => {
//   try {
//     const { data } = await useFetch(
//       "/api/maintenance/calibration/getAllData?type=user"
//     );
//     if (data._rawValue) {
//       headerFilters.value.userListList.options = data._rawValue.userList.map(
//         (category) => ({
//           label: category,
//           value: category,
//         })
//       );
//     } else {
//       console.error("No category data found");
//     }
//   } catch (err) {
//     console.error("Error fetching category data:", err);
//   }
// };


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

// const handleSortingButton = async (btnName: string) => {
//   gridMeta.value.page = 1;
//   for (const column of columns.value) {
//     if (column.sortable) {
//       if (column.key === btnName) {
//         switch (column.sortDirection) {
//           case "none":
//             column.sortDirection = "asc";
//             gridMeta.value.sort.column = btnName;
//             gridMeta.value.sort.direction = "asc";
//             break;
//           case "asc":
//             column.sortDirection = "desc";
//             gridMeta.value.sort.column = btnName;
//             gridMeta.value.sort.direction = "desc";
//             break;
//           default:
//             column.sortDirection = "none";
//             gridMeta.value.sort.column = "uniqueID";
//             gridMeta.value.sort.direction = "desc";
//             break;
//         }
//       } else {
//         column.sortDirection = "none";
//       }
//     }
//   }
//   init();
// };

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

const handleTagEntriesFormData = async (event, name) => {
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }

}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-if="props.isPage"
        class="gmsBlueHeader"
        title="Instrument Calibration"
      >
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
      </UDashboardNavbar>

      <div class="flex flex-row space-x-2 justify-end py-[20px] pr-[20px]">
        <div>
          <UCheckbox
            icon="i-heroicons-document-text"
            label="In Service"
            color="green"
            variant="outline"
            v-model="filterValues.inService"
          />
        </div>
      </div>

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

        <!-- <UTable
          :rows="gridMeta.orders"
          :columns="columns"
          :loading="gridMeta.isLoading"
          class="w-full"
          :ui="{
            divide: 'divide-gray-100 dark:divide-gray-800',
            th: {
              base: 'top-0 z-5',
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
  -->
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


          <!-- <template v-for="column in columns" v-slot:[`${column.key}-header`]>
            <div class="">
              <template v-if="column.key === 'SUBCATAGORY'">
                <div class="w-full">
                  <UInputMenu
                    v-model="filterValues.SUBCATAGORY"
                    :options="headerFilters.subCategoryList.options"
                    @change="handleSubmitCategory"
                    class="w-full"
                  />
                  <span class="text-xs text-gray-500">Subcategory</span>
                </div>
              </template>

              <template v-if="column.key === 'PART'">
                <div class="w-full">
                  <UInputMenu
                    v-model="filterValues.PART"
                    :options="headerFilters.fetchInstrumentDataList.options"
                    @change="handleINstrument"
                    class="w-full"
                  />
                  <span class="text-xs text-gray-500">Instrument</span>
                </div>
              </template>

              <template v-if="column.key === 'InstLoc'">
                <div class="w-full">
                  <UInputMenu
                    v-model="filterValues.InstLoc"
                    :options="headerFilters.workCenterList.options"
                    @change="handleWorkCenter"
                    class="w-full"
                  />
                  <span class="text-xs text-gray-500">Work Center</span>
                </div>
              </template>

              <template v-if="column.key === 'ORDEREDBY'">
                <div class="w-full">
                  <UInputMenu
                    v-model="filterValues.ORDEREDBY"
                    :options="headerFilters.userListList.options"
                    @change="handleUser"
                    class="w-full"
                  />
                  <span class="text-xs text-gray-500">User</span>
                </div>
              </template>

              <template
                v-else-if="
                  [
                    'REQUIRED',
                    'MANO',
                    'ManSerial',
                    'RemovedFromService',
                  ].includes(column.key)
                "
              >
                <div class="w-full">
                  <input
                    type="text"
                    v-model="filterValues[column.key]"
                    @input="filterTable"
                    class="w-full mt-1 border-[1px] border-black py-[5px] rounded"
                  />
                  <span class="text-xs text-gray-500">{{ column.label }}</span>
                </div>
              </template>

              <template v-else>
                <div class="w-full">
                  <span class="text-xs text-gray-500">{{ column.label }}</span>
                </div>
              </template>
            </div>
          </template> -->
        </UTable>
    

      <!-- <div class="border-t-[1px]">
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
      </div> -->
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal
    v-model="modalMeta.isServiceOrderModalOpen"
    title="Service Order"
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple  gms-modalHeader',
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
