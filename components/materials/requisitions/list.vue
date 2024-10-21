<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderDetailsTable from "./table.vue";

onMounted(async () => {
  await init();
  await fetchCategoryData();
  await fetchSubCategoryData();
  await fetchGridData();
});

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

const modalMeta = ref({
  isSerialModalOpen: false,
  modalTitle: "Serial",
  isNewReportModalOpen: false,
  mainID: "",
});

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

const init = async () => {};

const inventoryDetailGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "checkbox",
      label: "",
      kind: "actions",
    },
    {
      key: "No",
      label: "Report",
      filterable: true,
    },

    {
      key: "date",
      label: "Date",
    },

    {
      key: "by",
      label: "By",
    },
    {
      key: "Report",
      label: "Report#",
    },
    {
      key: "Date",
      label: "Date",
    },
    {
      key: "",
      label: "MaintenanceBy",
    },
  ],

  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  details: [],
  selectedDetail: null,
  isLoading: false,
});

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
  debugger;
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
      key: "PoNumber",
      label: "PO",
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
  pageSize: 200,
  numberOfChangeOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedSerialRow: null,
  selectedCustomerId: null,
  submitPropsData: null,
  sort: {
    column: "STOCKNUMBER",
    direction: "desc",
  },
  isLoading: false,
});

const filterValues = ref({
  QTY: null,
  reqdate: null,
  DESCRIPTION: null,
  STOCKNUMBER: null,
  PoNumber: null,
  EMPLOYEE: null,
});

const searchBYEmpleey = (newDate) => {
  filterValues.value.EMPLOYEE = newDate.label;
  fetchGridData();
};

const fetchGridData = async () => {
  await useApiFetch("/api/materials/requisitions/table2?type=table2", {
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
        gridMeta.value.orders = response._data.tableData;
      }
      gridMeta.value.isLoading = false;
    },
  });
};
</script>

<template>
  <OrderDetailsTable :is-page="true" />

  <UForm class="mt-[20px]">
    <div class="flex flex-row space-x-6 bg-[#4682B4] w-full">
      <p class="py-[10px]">Requisitions Lookup</p>
    </div>
    <div class="flex flex-row space-x-6 pt-[20px] pb-[30px]">
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <h3>Show History</h3>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <h3>By</h3>

        <UInputMenu
          @change="searchBYEmpleey"
          v-model="handleVModel.subCategory"
          :options="headerFilters.EmployeeList.options"
        />
      </div>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4"
    >
      <div class="">
        <UInput
          v-model="input1"
          label="Input 1"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>

      <div class="">
        <UInput
          v-model="input2"
          label="Input 2"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>

      <div class="">
        <UInput
          v-model="input3"
          label="Input 3"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>

      <div class="">
        <UInput
          v-model="input4"
          label="Input 4"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>

      <div class="">
        <UInput
          v-model="input5"
          label="Input 5"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>

      <div class=" ">
        <UInput
          v-model="input6"
          label="Input 6"
          placeholder="Enter text"
          class="mb-4"
        />
      </div>
    </div>

    <UDivider />
  </UForm>

  <div class="">
    <UTable
      :rows="gridMeta.orders"
      :columns="gridMeta.defaultColumns"
      :loading="gridMeta.isLoading"
      class="w-full"
      :ui="{
        wrapper: ' h-60 border-2 border-gray-300 dark:border-gray-700',
        divide: 'divide-gray-200 dark:divide-gray-800',
        th: {
          base: 'top-0',
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
    >
      <template
        v-for="column in inventoryDetailGridMeta.defaultColumns"
        v-slot:[`${column.key}-header`]
      >
        <template v-if="column.kind !== 'actions'">
          <div class="px-1 py-1">
            <CommonSortAndInputFilter
              :label="column.label"
              :sortable="column.sortable"
              :sort-key="column.key"
              :filter-key="column.key"
            />
          </div>
        </template>

        <template v-else class="bg-slate-400">
          <div class="flex justify-center text-center w-[53px]">
            {{ column.label }}
          </div>
        </template>
      </template>

      <template #default="{ rows }">
        <template v-for="row in rows" :key="row.uniqueid">
          <tr
            @click="onSelect(row)"
            :class="{
              'bg-red-500': isSelected(row),
              'hover:bg-gray-200 cursor-pointer': !isSelected(row),
            }"
          >
            <td>
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change.stop="toggleRowSelection(row)"
              />
            </td>
            <td
              v-for="column in inventoryDetailGridMeta.defaultColumns"
              :key="column.key"
            >
              {{ row[column.key] }}
            </td>
          </tr>
        </template>
      </template>
    </UTable>
  
      
  </div>

  <div class="flex justify-end space-x-4 pt-[10px]">
    <div class="basis-1/6">
      <UButton
        icon="i-heroicons-plus"
        label="Uncheck All"
        variant="outline"
        color="green"
        @click="openNewReport()"
        :ui="{
          base: 'min-w-[200px] w-full',
          truncate: 'flex justify-center w-full',
        }"
        truncate
      />
    </div>
    <div class="basis-1/6">
      <UButton
        icon="i-heroicons-plus"
        label="Ordered"
        variant="outline"
        color="green"
        @click="openNewReport()"
        :ui="{
          base: 'min-w-[200px] w-full',
          truncate: 'flex justify-center w-full',
        }"
        truncate
      />
    </div>
    <div class="basis-1/6">
      <UButton
        icon="i-heroicons-minus-circle"
        label="Delete Requisition"
        variant="outline"
        color="red"
        :ui="{
          base: 'min-w-[200px] w-full',
          truncate: 'flex justify-center w-full',
        }"
        truncate
        @click="deleteEquipmentTableData"
      />
    </div>
  </div>
</template>
