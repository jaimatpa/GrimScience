<script lang="ts" setup>
import type { UTableColumn } from "~/types";

onMounted(() => {
  init();
});
useSeoMeta({
  title: "Grimm-Employees List",
});

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const route = useRoute();
const toast = useToast();

const selectStatus = ref("Active");

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "payrollno",
      label: "Payroll #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "fname",
      label: "First",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "lname",
      label: "Last",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "state",
      label: "State",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "zip",
      label: "Zip",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "homephone",
      label: "Home Cell Phone",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "edit",
      label: "Edit",
      kind: "actions",
    },
    {
      key: "delete",
      label: "Delete",
      kind: "actions",
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfEmployee: 0,
  employess: [],
  selectedEmpployee: null,
  selectedEmpployeePayrollId: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});
const modalMeta = ref({
  isEmployeeModalOpen: false,
  modalTitle: "New Employee",
  modalDescription: "Add a new Employee",
});
const filterValues = ref({
  ACTIVE: "1",
  payrollno: null,
  fname: null,
  lname: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  homephone: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);

const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);
Object.entries(route.query).forEach(([key, value]) => {
  switch (key.toLowerCase()) {
    case "page":
      gridMeta.value.page = Number(value);
      break;
    case "pagesize":
      gridMeta.value.pageSize = Number(value);
      break;
    case "sortby":
      gridMeta.value.sort.column = value as unknown as string;
      break;
    case "sortorder":
      gridMeta.value.sort.direction = value as unknown as string;
      break;
  }
});

const init = async () => {
  fetchGridData();
};
const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  // handle number of emoloyees and pagination
  await useApiFetch("/api/employees/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfEmployee = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfEmployee === 0) {
    gridMeta.value.employess = [];
    gridMeta.value.numberOfEmployee = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfEmployee
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfEmployee / gridMeta.value.pageSize) | 1;
  }
  await useApiFetch("/api/employees", {
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
        gridMeta.value.employess = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const handleSelectChange = () => {
  if (selectStatus.value === "Active") {
    filterValues.value.ACTIVE = "1";
  } else {
    filterValues.value.ACTIVE = "0";
  }

  fetchGridData();
};

const handlePageChange = async () => {
  fetchGridData();
};

const onCreate = () => {
  gridMeta.value.selectedEmpployee = null;
  modalMeta.value.modalTitle = "New Employee";
  modalMeta.value.modalDescription = "Add a new employee";
  modalMeta.value.isEmployeeModalOpen = true;
};

const onEdit = (row) => {
  console.log("row", row);

  gridMeta.value.selectedEmpployee = row;
  gridMeta.value.selectedEmpployeePayrollId = row?.payrollnumber;
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.modalDescription = "Edit Employee information";
  modalMeta.value.isEmployeeModalOpen = true;
};

const onSelect = async (row) => {
  gridMeta.value.selectedEmpployee = row;
  gridMeta.value.selectedEmpployeePayrollId = row?.payrollnumber;
};
const onDblClick = async () => {
  if (gridMeta.value.selectedEmpployee) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.modalDescription = "Edit Employee information";
    modalMeta.value.isEmployeeModalOpen = true;
  }
};

const onDelete = async (row: any) => {
  await useApiFetch(`/api/employees/${row?.UniqueID}`, {
    method: "DELETE",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-trash-solid",
          color: "green",
        });
        fetchGridData();
      }
    },
  });
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
            gridMeta.value.sort.column = "UniqueID";
            gridMeta.value.sort.direction = "asc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  fetchGridData();
};

const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1;
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }

  fetchGridData();
};

const handleModalClose = () => {
  modalMeta.value.isEmployeeModalOpen = false;
};

const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsTealHeader" title="Employee List">
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Sorting</h2>
      </div>

      <UDashboardToolbar class="gmsTealToolbar">
        <template #left>
          <UFormGroup label="Employee Status" name="state">
            <USelect
              v-model="selectStatus"
              :options="['Active', 'Inactive']"
              @change="handleSelectChange"
              searchable="false"
            />
          </UFormGroup>
          <div class="flex flex-row space-x-3 ml-5">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfEmployee }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <UButton
            variant="outline"
            label="New Employee"
            class="bg-gmsTealHeader"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Lookup</h2>
      </div>

      <UTable
        :rows="gridMeta.employess"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: {
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'p-0',
          },
          td: {
            padding: 'py-1',
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
          <template v-if="column.kind !== 'actions'">
            <div class="px-4 py-3.5">
              <CommonSortAndInputFilter
                @handle-sorting-button="handleSortingButton"
                @handle-input-change="handleFilterInputChange"
                :label="column.label"
                :sortable="column.sortable"
                :sort-key="column.key"
                :sort-icon="
                  column?.sortDirection === 'none'
                    ? noneIcon
                    : column?.sortDirection === 'asc'
                    ? ascIcon
                    : descIcon
                "
                :filterable="column.filterable"
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
        <template #edit-data="{ row }">
          <UTooltip text="Edit" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="onEdit(row)"
            />
          </UTooltip>
        </template>
        <template #delete-data="{ row }">
          <UTooltip text="Delete" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="onDelete(row)"
            />
          </UTooltip>
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfEmployee || 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Employee Detail Modal -->
  <UDashboardModal
    v-model="modalMeta.isEmployeeModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1600px] sm:max-w-8xl',
    }"
  >
    <EmployeeForm
      @close="handleModalClose"
      @save="handleModalSave"
      :selected-employee="gridMeta.selectedEmpployee"
    />
  </UDashboardModal>
</template>
