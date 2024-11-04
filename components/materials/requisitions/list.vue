<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderDetailsTable from "./table.vue";

onMounted(async () => {
  await init();
  await fetchCategoryData();
  await fetchSubCategoryData();
  await fetchGridData();
});

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfChangeOrders
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfChangeOrders / gridMeta.value.pageSize) |
      1;
  }

  const params = {
    page: gridMeta.value.page,
    pageSize: gridMeta.value.pageSize,
    sortBy: gridMeta.value.sort.column,
    sortOrder: gridMeta.value.sort.direction,
    ...Object.fromEntries(
      Object.entries(filterValues.value).filter(([_, value]) => value != null)
    ),
  };

  try {
    await useApiFetch("/api/materials/requisitions/table2?type=table2", {
      method: "GET",
      params,
      onResponse({ response }) {
        console.log("hello controller", response._data.tableData);
        if (response.status === 200) {
          gridMeta.value.orders = response._data.tableData;
        }
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    gridMeta.value.isLoading = false;
  }
};

const headerFilters = ref({
  subCategoryList: {
    label: "Sub Category",
    filter: "subcategory",
    options: [],
  },

  EmployeeList: {
    filter: "EMPLOYEE",
    options: [],
  },
});

const toast = useToast();

// const modalMeta = ref({
//   isSerialModalOpen: false,
//   modalTitle: "Serial",
//   isNewReportModalOpen: false,
//   mainID: "",
// });

const fetchCategoryData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllCategory"
    );
    if (data._rawValue) {
      headerFilters.value.categoryList.options = data._rawValue.map(
        (category) => ({
          label: category || "Unnamed",
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

const emit = defineEmits(["rowSelectedProduct", "selectEco", "close"]);

const init = async () => {
  fetchGridData();
};

const handleVModel = ref({
  selectedRow: null,
  uniqueId: "",
  manValue: "",
  category: "",
  subCategory: "",
  equipment: "",
  serialNo: "",
  type: "",
  location: "",
  responsible: "",
  dateInService: "",
  nextReqService: "",
  Maintenance: "",
  selectedNoValue: null,
});

const onSelect = (row) => {
  console.log("select  row ", row);
  handleVModel.value.selectedNoValue = row.uniqueID;
};

const deleteEquipmentTableData = async () => {
  const uniqueId = handleVModel.value.selectedNoValue;

  if (!uniqueId) {
    toast.add({
      title: "Error",
      description: "Undefine ID. Cannot delete.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
    return;
  }

  await useApiFetch(`/api/materials/requisitions/deleteData?id=${uniqueId}`, {
    method: "DELETE",
    onResponse({ response }) {
      console.log(response);
      if (response.status === 200) {
        toast.add({
          title: "Successfully Delete",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
        fetchGridData();
      } else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    },
  });
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

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "checkbox",
      label: "",
      sortable: false,
      filterable: false,
      width: 40,
    },
    {
      key: "STOCKNUMBER",
      label: "Part#",
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
    {
      key: "PONumber",
      label: "PO",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },

    {
      key: "QTYORDER",
      label: "On Order",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "QTY",
      label: "Needed",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "OnHand",
      label: "On Hand",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },

    {
      key: "EMPLOYEE",
      label: "By",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "reqdate",
      label: "Date",
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
  selectedSerialRow: null,
  selectedCustomerId: null,
  submitPropsData: null,
  sort: {
    column: "STOCKNUMBER",
    direction: "DESC",
  },
  isLoading: false,
});

const filterValues = ref({
  QTY: null,
  reqdate: null,
  DESCRIPTION: null,
  STOCKNUMBER: null,
  PONumber: null,
  EMPLOYEE: null,
});

const searchBYEmpleey = (newDate) => {
  filterValues.value.EMPLOYEE = newDate.label;
  fetchGridData();
};

const selectedColumns = ref(gridMeta.value.defaultColumns);
const exportIsLoading = ref(false);

const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1;
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event.target?.value || event;
  }
  await fetchGridData();
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
            gridMeta.value.sort.column = "STOCKNUMBER";
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
const handlePageChange = async () => {
  fetchGridData();
};

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const selectedRows = ref(new Set());

const toggleRow = (stockNumber: string, checked: boolean) => {
  if (checked) {
    selectedRows.value.add(stockNumber);
  } else {
    selectedRows.value.delete(stockNumber);
  }
};

const clearAllSelections = () => {
  selectedRows.value.clear();
};
</script>

<template>
   <UDashboardPage>
    <UDashboardPanel grow>
  <OrderDetailsTable :is-page="true" />

  <UForm class="">
    <div class="flex flex-row w-full">
      <p class="py-[5px] pl-[20px] italic">
        Parts Needed ( Double Click to select)
      </p>
    </div>
    <div class="flex flex-row gmsBlueTitlebar w-full">
      <p class="py-[10px] pl-[20px]">Requisitions Lookup</p>
    </div>

    <div class="flex flex-row pt-[10px] pb-[30px]">
      <div class="mr-4 flex pt-[25px] pl-[20px]">
        <UCheckbox :model-value="isAllSelected" />
        <h3 class="pl-[5px]">Show History</h3>
      </div>
      <div class="">
        <h3>By</h3>

        <UInputMenu
          @change="searchBYEmpleey"
          v-model="handleVModel.subCategory"
          :options="headerFilters.EmployeeList.options"
        />
      </div>
    </div>
  </UForm>

  <div class="">
    <UTable
      :rows="gridMeta.orders"
      :columns="columns"
      :loading="gridMeta.isLoading"
      class="w-full overflow-auto h-[300px]"
      :ui="{
        divide: 'divide-gray-200 dark:divide-gray-800',
        th: {
          base: ' top-0 ',
          padding: 'pb-0',
        },
        td: {
          padding: 'py-0',
        },
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.',
      }"
      @select="onSelect"
    >
      <!-- Add this template for checkbox column header -->
      <template #checkbox-header>
        <div class="flex items-center justify-center">
          <UCheckbox
            :model-value="isAllSelected"
            @update:model-value="toggleAllRows"
          />
        </div>
      </template>

      <!-- Add this template for checkbox column cells -->
      <template #checkbox-data="{ row }">
        <div class="flex items-center justify-center">
          <UCheckbox
            :model-value="selectedRows.has(row.STOCKNUMBER)"
            @update:model-value="
              (checked) => toggleRow(row.STOCKNUMBER, checked)
            "
          />
        </div>
      </template>

      <!-- Your existing column headers -->
      <template v-for="column in columns" v-slot:[`${column.key}-header`]>
        <template v-if="column.key !== 'checkbox'">
          <div>
            <CommonSortAndInputFilter
              @handle-sorting-button="handleSortingButton"
              @handle-input-change="handleFilterInputChange"
              :label="column.label"
              :sortable="column.sortable"
              :sort-key="column.key"
              :sort-icon="''"
              :filterable="column.filterable"
              :filter-key="column.key"
            />
          </div>
        </template>
      </template>
    </UTable>
  </div>


  <div class="flex justify-between items-center space-x-2 pt-[10px] mb-[15px] px-[20px]">
  <div class="flex space-x-2">
    <UButton
      icon="i-heroicons-plus"
      label="Uncheck All"
      variant="outline"
      color="green"
      @click="clearAllSelections"
      truncate
    />
    <UButton
      icon="i-heroicons-minus-circle"
      label="Delete Requisition"
      variant="outline"
      color="red"
      truncate
      @click="deleteEquipmentTableData"
    />
  </div>
  <div>
    <UButton
      icon="i-heroicons-plus"
      label="Ordered"
      variant="outline"
      color="green"
      @click="openNewReport()"
      truncate
    />
  </div>
</div>
</UDashboardPanel>
</UDashboardPage>
</template>
