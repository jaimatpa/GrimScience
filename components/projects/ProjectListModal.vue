<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import Loading from "vue-loading-overlay";
import { format } from "date-fns";

onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Marketing projects",
});

const emit = defineEmits(["close"]);

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const selected = ref([]);
const loadingDeleteButton = ref(false);
const loadingOverlay = ref(false);
const deleteJob = ref(null)

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "NUMBER",
      label: "Project#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "QUANTITY",
      label: "Qty.",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "MODEL",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "PerType",
      label: "Type",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DATEOPENED",
      label: "Opened",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DATECLOSED",
      label: "Closed",
      sortable: false,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "PercentageComplete",
      label: "% Complete",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
    {
      key: "Cost",
      label: "ProjectCost",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfProjects: 0,
  projects: [],
  selectedProjectId: null,
  selectedProject: null,
  sort: {
    column: "NUMBER",
    direction: "asc",
  },
  isLoading: false,
});

const modalMeta = ref({
  modalTitle: "New Project",
  isProjectFormModalOpen: false,
  isDeleteModalOpen: false,
});

const checkboxes = ref({
  Marketing: false,
  Accounting: false,
  Engineering: false,
  Manufacturing: false,
  ShowOpenOnly: true,
});

const filterValues = ref({
  NUMBER: null,
  QUANTITY: null,
  MODEL: null,
  PerType: null,
  DATEOPENED: null,
  PercentageComplete: null,
  Cost: null,
  Marketing: checkboxes.value.Marketing,
  Accounting: checkboxes.value.Accounting,
  Engineering: checkboxes.value.Engineering,
  Manufacturing: checkboxes.value.Manufacturing,
  ShowOpenOnly: checkboxes.value.ShowOpenOnly,
});

const onSelect = async (row) => {
  gridMeta.value.selectedProjectId = row?.UniqueID;
  gridMeta.value.selectedProject = { ...row, class: "" };
  gridMeta.value.projects.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });
};


const selectedColumns = ref(gridMeta.value.defaultColumns);
const exportIsLoading = ref(false);

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

const handleHeaderCheckboxChange = () => {
  filterValues.value.Marketing = checkboxes.value.Marketing
  filterValues.value.Accounting = checkboxes.value.Accounting,
  filterValues.value.Engineering = checkboxes.value.Engineering,
  filterValues.value.Manufacturing = checkboxes.value.Manufacturing,
  filterValues.value.ShowOpenOnly = checkboxes.value.ShowOpenOnly,
  gridMeta.value.page = 1;
  fetchGridData()
}

const init = async () => {
  fetchGridData();
};

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;  

  await useApiFetch("/api/projects/", {
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
        gridMeta.value.projects = response._data.body.list;
        gridMeta.value.numberOfProjects = response._data.body.totalCount;
      }
      gridMeta.value.isLoading = false;
    },
  });


  if (gridMeta.value.numberOfProjects === 0) {
    gridMeta.value.projects = [];
    gridMeta.value.numberOfProjects = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfProjects
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfProjects / gridMeta.value.pageSize) | 1;
  }

};


const handleModalClose = () => {
  modalMeta.value.isProjectFormModalOpen = false;
};

const handlePageChange = async () => {
  fetchGridData();
};
const handleFilterChange = () => {
  gridMeta.value.page = 1;
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


const handleSelectJob = () => {
  if(gridMeta.value.selectedProject === null){
    toast.add({
      title: "Select",
      description: "Please select a project",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }else{
    emit('close', gridMeta.value.selectedProject)
  }
  
}


</script>

<template>
  <div class="vl-parent">
    <loading
      v-model:active="loadingOverlay"
      :is-full-page="true"
      color="#000000"
      backgroundColor="#1B2533"
      loader="dots"
    />
  </div>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Projects">
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar>
        <template #left>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfProjects }}
                </div>
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row mt-4">
            <div class="flex items-center space-x-6 ms-6">
              <div>
                <UCheckbox label="Marketing" v-model="checkboxes.Marketing" @update:model-value="handleHeaderCheckboxChange" />
              </div>
              <div>
                <UCheckbox label="Accounting" v-model="checkboxes.Accounting" @update:model-value="handleHeaderCheckboxChange" />
              </div>
              <div>
                <UCheckbox label="Engineering" v-model="checkboxes.Engineering" @update:model-value="handleHeaderCheckboxChange" />
              </div>
              <div>
                <UCheckbox
                  label="Manufacturing"
                  v-model="checkboxes.Manufacturing"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div>
                <UCheckbox
                  label="Show Open Only"
                  v-model="checkboxes.ShowOpenOnly"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
            </div>
          </div>

        </template>

    
        <template #right>
          <UButton
            icon="i-heroicons-cursor-arrow-ripple"
            variant="outline"
            color="green"
            label="Select"
            :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }"
            @click="handleSelectJob"
            truncate
          />
        </template>
    

      </UDashboardToolbar>
      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Lookup</h2>
      </div>


      <UTable
        :rows="gridMeta.projects"
        :columns="columns"
        :loading="gridMeta.isLoading"
        v-model="selected"
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
            <div class="flex w-[53px]">
              {{ column.label }}
            </div>
          </template>
        </template>
      </UTable>

      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfProjects | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>

</template>
<style scoped></style>
