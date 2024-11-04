<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { format } from "date-fns";

useSeoMeta({
  title: "Grimm-Employees Jobs",
});

onMounted(() => {
  init();
});

const emit = defineEmits(["close"]);

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const route = useRoute();
const toast = useToast();

const startDate = ref(new Date('2019-10-12'));
const endDate = ref(new Date());
const isOpen = ref(true)
const isReleased = ref(false)

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "UniqueID",
      label: "UniqueID",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "NUMBER",
      label: "Job #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "QUANTITY",
      label: "Quantity",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "description",
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
      label: "Openend",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DATECLOSED",
      label: "Closed",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "PercentageComplete",
      label: "% Complete",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Cost",
      label: "Job Cost",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Catagory",
      label: "Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SubCatagory",
      label: "Sub Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "ProductionDate",
      label: "Production Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 20,
  numberOfOrganization: 0,
  organization: [],
  selectedJobId: null,
  selectedJob:null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const headerFilters = ref({
  jobCat: {
    label: "Category",
    filter: "jobCat",
    options: [],
  },
  jobTypes: {
    label: "Sub Category",
    filter: "JobType",
    options: [],
  },
});

const filterValues = ref({
  UniqueID: null,
  NUMBER: null,
  QUANTITY: null,
  MODEL: null,
  PerType: null,
  DATEOPENED: null,
  DATECLOSED: null,
  ProductionDate: null,
  PercentageComplete: null,
  Cost: null,
  jobcat: null,
  jobsubcat: null,
  
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
  for (const key in headerFilters.value) {
    const apiURL = `/api/jobs/${key}`;
    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      },
    });
  }
};

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;
  // // handle number of jobs and pagination
  await useApiFetch("/api/jobs/numbers", {
    method: "GET",
    params: {
      isOpen: isOpen.value,
      isReleased: isReleased.value,
      startDate:startDate.value,
      endDate:endDate.value,
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

  await useApiFetch("/api/jobs", {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      isOpen: isOpen.value,
      isReleased: isReleased.value,
      startDate:startDate.value,
      endDate:endDate.value,
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

const handleFilterInputChange = (event, name) => {
  gridMeta.value.page = 1;
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }

  fetchGridData();
};

const handleFilterChange = () => {
  gridMeta.value.page = 1;
  fetchGridData();
};

const onSelect = (row) => {
  gridMeta.value.selectedJobId = row?.UniqueID;
  gridMeta.value.selectedJob = { ...row, class: "" };
  gridMeta.value.organization.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });
};

const handleSelectJob = () => {
  if(gridMeta.value.selectedJob === null){
    toast.add({
      title: "Select",
      description: "Please select a job",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }else{
    emit('close', gridMeta.value.selectedJob)
  }
  
}

const handleHeaderCheckboxChange = () => {
  gridMeta.value.page = 1;
  fetchGridData()
}

watch([startDate, endDate], () => {
  fetchGridData();  // Fetch data whenever either startDate or endDate changes
});

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>

      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar>
        <template #left>
          <template
            v-for="[key, value] in Object.entries(headerFilters)"
            :key="key"
          >
            <!-- <template v-if="value.options.length > 1"> -->
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup :label="value.label" :name="key">
                <USelect
                  v-model="filterValues[`${value.filter}`]"
                  :options="value.options"
                  @change="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <!-- </template> -->
          </template>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfOrganization }}
                </div>
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row mt-4">
              <div class="ml-5">
                <UCheckbox
                  v-model="isOpen"
                  label="Show Open Only"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="isReleased"
                  label="Show Only Released"
                  @update:model-value="handleHeaderCheckboxChange"
                />
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
        :rows="gridMeta.organization"
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
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfOrganization || 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div>
      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Date Range Lookup</h2>
      </div>
      <div class="px-5 py-2 bg-gms-gray-100">
        <div class="flex justify-between gap-10">
          <div class="flex items-center gap-10">
            <div class="flex items-center gap-2">
              <p>From</p>
                <UFormGroup name="From">
                  <UPopover :popper="{ placement: 'top-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        startDate &&
                        format(startDate, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="startDate"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
            </div>
            <div class="flex items-center gap-2">
              <p>To</p>
              <UFormGroup name="To">
                  <UPopover :popper="{ placement: 'top-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        endDate &&
                        format(endDate, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="endDate"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
            </div>
            <UButton color="primary" variant="solid">
              Lookup
            </UButton>
          </div> 
        </div>
       
      </div>
    </UDashboardPanel>
  </UDashboardPage>

</template>
