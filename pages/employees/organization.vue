<script lang="ts" setup>
import type { UTableColumn } from "~/types";

useSeoMeta({
  title: "Grimm-Employees Organization",
});

onMounted(() => {
  fetchGridData();
});

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const route = useRoute();
const toast = useToast();

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "ReportsTo",
      label: "Reports To",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Title",
      label: "Title",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Employee",
      label: "Employee",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "WorkCenters",
      label: "Work Centers",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Skills",
      label: "Skills",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Talents",
      label: "Talents",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    // {
    //   key: 'JobDescription',
    //   label: 'Job Description',
    //   sortable: true,
    //   sortDirection: 'none',
    //   filterable: true
    // },
    {
      key: "view",
      label: "View Position Details",
      kind: "actions",
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
  numberOfOrganization: 0,
  organization: [],
  selectedOrganizationId: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const modalMeta = ref({
  isOrganizatioModalOpen: false,
  modalTitle: "New Organization",
  modalDescription: "Add a new Organization",
  isPositionModalOpen: false,
});

const filterValues = ref({
  ReportsTo: null,
  Title: null,
  Employee: null,
  JobDescription: null,
  WorkCenters: null,
  Skills: null,
  Talents: null,
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

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  // handle number of organization and pagination
  await useApiFetch("/api/employees/organization/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfOrganization = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfOrganization === 0) {
    gridMeta.value.organization = [];
    gridMeta.value.numberOfOrganization = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfOrganization
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfOrganization / gridMeta.value.pageSize) |
      1;
  }

  await useApiFetch("/api/employees/organization", {
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
        gridMeta.value.organization = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
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
  modalMeta.value.isOrganizatioModalOpen = false;
  modalMeta.value.isPositionModalOpen = false;
};

const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};

const onCreate = () => {
  gridMeta.value.selectedOrganizationId = null;
  modalMeta.value.modalTitle = "New Organization";
  modalMeta.value.modalDescription = "Add a new organization";
  modalMeta.value.isOrganizatioModalOpen = true;
};

const onEdit = (row) => {
  gridMeta.value.selectedOrganizationId = row?.UniqueID;
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.modalDescription = "Edit Organization information";
  modalMeta.value.isOrganizatioModalOpen = true;
};

const onView = (row) => {
  gridMeta.value.selectedOrganizationId = row?.UniqueID;
  modalMeta.value.modalTitle = "View Position";
  modalMeta.value.modalDescription = "";
  modalMeta.value.isPositionModalOpen = true;
};

const onSelect = async (row) => {
  gridMeta.value.selectedOrganizationId = row?.UniqueID;
};

const onDblClick = async () => {
  if (gridMeta.value.selectedOrganizationId) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.modalDescription = "Edit Organization information";
    modalMeta.value.isOrganizatioModalOpen = true;
  }
};

const onDelete = async (row: any) => {
  await useApiFetch(`/api/employees/organization/${row?.UniqueID}`, {
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
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsTealHeader" title="Organization List">
      </UDashboardNavbar>
      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfOrganization }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <UButton
            variant="outline"
            label="Add Position"
            color="green"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <UTable
        :rows="gridMeta.organization"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: {
            base: 'sticky top-0 z-10',
            padding: 'pb-0',
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
            <div class="">
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
            <div class="flex w-[53px]">
              {{ column.label }}
            </div>
          </template>
        </template>
        <template #view-data="{ row }">
          <UTooltip text="Site Visit" class="flex ">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
              @click="onView(row)"
            />
          </UTooltip>
        </template>
        <template #edit-data="{ row }">
          <UTooltip text="Edit" class="flex">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="onEdit(row)"
            />
          </UTooltip>
        </template>
        <template #delete-data="{ row }">
          <UTooltip text="Delete" class="flex">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="onDelete(row)"
            />
          </UTooltip>
        </template>
      </UTable>
      <!-- <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfOrganization || 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div> -->
    </UDashboardPanel>
  </UDashboardPage>

  <!-- New Positon  Modal -->
  <UDashboardModal
    v-model="modalMeta.isPositionModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1600px] sm:max-w-8xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <EmployeeViewPositionForm
      @close="handleModalClose"
      @save="handleModalSave"
      :selected-organization="gridMeta.selectedOrganizationId"
      :is-modal="true"
    />
  </UDashboardModal>

  <!-- New Organization Detail Modal -->
  <UDashboardModal
    v-model="modalMeta.isOrganizatioModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <EmployeeOrganizationForm
      @close="handleModalClose"
      @save="handleModalSave"
      :selected-organization="gridMeta.selectedOrganizationId"
      :is-modal="true"
    />
  </UDashboardModal>
</template>
