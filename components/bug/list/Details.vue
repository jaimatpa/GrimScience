<script lang="ts" setup>
import type { UTableColumn } from "~/types";

onMounted(() => {
  init();
});
useSeoMeta({
  title: "Grimm-Bug Sheet",
});

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const route = useRoute();
const toast = useToast();

const selectStatus = ref("Open");

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "uniqueid",
      label: "Bug ID",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "datea",
      label: "Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "formName",
      label: "Form",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "employee",
      label: "By",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "complaintText",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap", 
    },
    {
      key: "address",
      label: "Details",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "dvanceLevels",
      label: "Type",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "cost",
      label: "Cost",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "approved",
      label: "Approved",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "max-w-[200px]", 
    },
    {
      key: "resolveversion",
      label: "Resolved In Version",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      class: "min-w-[150px]", 
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
  sort: {
    column: "uniqueid",
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
  resolved: "Open",
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

  await useApiFetch("/api/bugs", {
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
  if (selectStatus.value === "Open") {
    filterValues.value.resolved = "OPEN";
  } else {
    filterValues.value.resolved = "CLOSED";
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
  gridMeta.value.selectedEmpployee = row;
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.modalDescription = "Edit Employee information";
  modalMeta.value.isEmployeeModalOpen = true;
};

const onSelect = async (row) => {
  gridMeta.value.selectedEmpployee = row;
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
      <UDashboardNavbar class="bg-red-400" title="Bug Sheet">
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Sorting</h2>
      </div>

      <UDashboardToolbar class="gmsTealToolbar">
        <template #left>
          <UFormGroup label="Bug Status" name="state">
            <USelect
              v-model="selectStatus"
              :options="['Open', 'Closed']"
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
            label="Add Bug"
            class="bg-gmsTealHeader"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Bug Lookup</h2>
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
            // width: 'max-w-[200px]',
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

        <template v-for="column in columns" v-slot:[`${column.key}-data`]="{ row }">
          <div :class="column.class">
            <template v-if="column.kind === 'actions'">
              <template v-if="column.key === 'edit'">
                <UTooltip text="Edit" class="flex justify-center">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                    @click="onEdit(row)" 
                  />
                </UTooltip>
              </template>
              <template v-else-if="column.key === 'delete'">
                <UTooltip text="Delete" class="flex justify-center">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    @click="onDelete(row)" 
                  />
                </UTooltip>
              </template>
            </template>
            <template v-else>
              {{ row[column.key] }} 
            </template>
          </div>
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
      :is-modal="true"
    />
  </UDashboardModal>
</template>
