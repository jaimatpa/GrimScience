<script lang="ts" setup>
import { format, addDays } from "date-fns";
import { BryntumGantt } from "@bryntum/gantt-vue-3";
import "@bryntum/gantt/gantt.stockholm.css";

import type { UTableColumn } from "~/types";

useSeoMeta({
  title: "Grimm Scentific Schedule",
});

onMounted(() => {
  init();
});

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const route = useRoute();
const toast = useToast();
const exportIsLoading = ref(false);
const schedulerView = ref(false);

const headerCheckboxes = ref({
  field: {
    label: "Field",
    isChecked: false,
  },
  open: {
    label: "Open",
    isChecked: false,
  },
  nonWarranty: {
    label: "Non-warranty",
    isChecked: false,
  },
  customer: {
    label: "Customer",
    isChecked: false,
  },
  closed: {
    label: "Closed",
    isChecked: false,
  },
  warranty: {
    label: "Warranty",
    isChecked: false,
  },
  factory: {
    label: "Factory",
    isChecked: false,
  },
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "SO#",
      label: "SO#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SO Status",
      label: "SO Status",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SN#",
      label: "SN#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SO Date",
      label: "SO Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Cust #",
      label: "Cust #",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Company",
      label: "Company",
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
      key: "ST",
      label: "ST",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SO Type",
      label: "SO Type",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },

    {
      key: "Failure Comment",
      label: "Failure Comment",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SR#",
      label: "SR#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Status",
      label: "Status",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },

    {
      key: "Type",
      label: "Type",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Service Tech",
      label: "Service Tech",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "SR Date",
      label: "SR Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Week",
      label: "Week",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Invoice",
      label: "Invoice",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "REPAIRSMADE",
      label: "REPAIRSMADE",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "edit",
      label: "Open Service Report",
      kind: "actions",
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfOSchedule: 0,
  schedules: [],
  selectedServiceId: null,
  sort: {
    column: "uniqueID",
    direction: "asc",
  },
  isLoading: false,
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

const headerFilters = ref({
  serviceTech: {
    label: "Service Tech",
    filter: "Service Tech",
    options: [],
  },
  weeks: {
    label: "Week",
    filter: "Week",
    options: [],
  },
  categories: {
    label: "Category",
    filter: "SO Type",
    options: [],
  },
});

const filterValues = ref({
  "SO#": null,
  "SO Status": null,
  "SN#": null,
  "SO Date": null,
  "Cust #": null,
  Company: null,
  city: null,
  ST: null,
  "SO Type": null,
  "Failure Comment": null,
  "SR#": null,
  Status: null,
  Type: null,
  "Service Tech": null,
  "SR Date": null,
  Week: null,
  Invoice: null,
  REPAIRSMADE: null,
  WarrentyService: null,
});
const ganttMeta = ref({
  tasks: [],
  startDate: new Date(),
  endDate: new Date(),
});

const init = async () => {
  fetchGridData();
  for (const key in headerFilters.value) {
    const apiURL = `/api/service/schedule/${key}`;
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

// Watcher to monitor changes in headerCheckboxes and update filterValues accordingly
watch(
  () => [
    headerCheckboxes.value.open.isChecked,
    headerCheckboxes.value.closed.isChecked,
  ],
  ([newOpenValue, newClosedValue]) => {
    if (newOpenValue && !newClosedValue) {
      filterValues.value.Status = "Open";
    } else if (!newOpenValue && newClosedValue) {
      filterValues.value.Status = "Closed";
    } else {
      filterValues.value.Status = null;
    }
  }
);

watch(
  () => [
    headerCheckboxes.value.warranty.isChecked,
    headerCheckboxes.value.nonWarranty.isChecked,
  ],
  ([newOpenValue, newClosedValue]) => {
    if (newOpenValue && !newClosedValue) {
      filterValues.value["SO Type"] = "Warranty";
    } else if (!newOpenValue && newClosedValue) {
      filterValues.value["SO Type"] = null;
    } else {
      filterValues.value["SO Type"] = null;
    }
  }
);

// Watch for field, customer, and factory checkboxes
watch(
  () => [
    headerCheckboxes.value.field.isChecked,
    headerCheckboxes.value.customer.isChecked,
    headerCheckboxes.value.factory.isChecked,
  ],
  ([newFieldValue, newCustomerValue, newFactoryValue]) => {
    const typeArray = [];
    if (newFieldValue) typeArray.push("Field");
    if (newCustomerValue) typeArray.push("Customer");
    if (newFactoryValue) typeArray.push("Factory");

    filterValues.value.Type = typeArray.length > 0 ? typeArray : null;
  }
);

// Watch for Toggle Button
watch(
  () => [schedulerView.value],
  ([newValue]) => {
    if (newValue) {
      fetchScheduleData();
    } else {
      fetchGridData();
    }
  }
);

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  // handle number of organization and pagination
  await useApiFetch("/api/service/schedule/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfOSchedule = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfOSchedule === 0) {
    gridMeta.value.schedules = [];
    gridMeta.value.numberOfOSchedule = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfOSchedule
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfOSchedule / gridMeta.value.pageSize) | 1;
  }

  await useApiFetch("/api/service/schedule", {
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
        gridMeta.value.schedules = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const fetchScheduleData = async () => {
  await useApiFetch("/api/service/schedule/allschedules", {
    method: "GET",
    params: {
      "SO Type": filterValues.value["SO Type"],
      Type: filterValues.value["Type"],
      "Service Tech": filterValues.value["Service Tech"],
      Week: filterValues.value["Week"],
      WarrentyService: filterValues.value["WarrentyService"],
    },
    onResponse({ response }) {
      if (response.status === 200) {
        let schedules = response._data.body;
        let employees = [];
        schedules.forEach((schedule) => {
          if (!employees.includes(schedule["Service Tech"])) {
            employees.push(schedule["Service Tech"]);
          }
        });
        ganttMeta.value.startDate = new Date();
        ganttMeta.value.endDate = new Date();
        ganttMeta.value.tasks = employees.map((employee, index) => {
          let schedulesForEmployee = schedules.filter(
            (schedule) => schedule["Service Tech"] === employee
          );
          let serviceOrders = [];
          let serviceOrderList = [];
          schedulesForEmployee.forEach((schedule) => {
            if (!serviceOrderList.includes(schedule["SO#"])) {
              serviceOrderList.push(schedule["SO#"]);
            }
          });
          serviceOrders = serviceOrderList.map((serviceOrder) => {
            let serviceReports = [];
            serviceReports = schedulesForEmployee
              .filter(
                (schedule) =>
                  schedule["Service Tech"] === employee &&
                  schedule["SO#"] === serviceOrder
              )
              .map((schedule) => {
                if (
                  new Date(ganttMeta.value.startDate) >
                  new Date(schedule["SR Date"])
                )
                  ganttMeta.value.startDate = new Date(schedule["SR Date"]);
                if (
                  new Date(ganttMeta.value.endDate) <
                  new Date(schedule["SR Date"])
                )
                  ganttMeta.value.endDate = addDays(
                    new Date(schedule["SR Date"]),
                    1
                  );
                return {
                  name: `${schedule["SR#"]}`,
                  startDate: schedule["SR Date"],
                  duration: 1,
                  manuallyScheduled: true,
                };
              });
            return {
              name: serviceOrder,
              children: serviceReports,
            };
          });
          return {
            name: employee,
            expanded: !index ? true : false,
            children: serviceOrders,
            eventColor: "#BB8ABC",
          };
        });
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
            gridMeta.value.sort.column = "uniqueID";
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

const handlePageChange = async () => {
  fetchGridData();
};

const modalMeta = ref({
  isReportModalOpen: false,
  modalTitle: "Service Report",
  modalDescription: "Service Report",
});

const onReportView = (row) => {
  gridMeta.value.selectedServiceId = row?.uniqueID;
  modalMeta.value.modalTitle = "Service Report";
  modalMeta.value.modalDescription = "Service Report";
  modalMeta.value.isReportModalOpen = true;
};

const handleModalClose = () => {
  modalMeta.value.isReportModalOpen = false;
};

const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};

const onSelect = async (row) => {
  gridMeta.value.selectedServiceId = row?.uniqueID;
};

const onDblClick = async () => {
  if (gridMeta.value.selectedServiceId) {
    modalMeta.value.modalTitle = "Service Report";
    modalMeta.value.modalDescription = "Service Report";
    modalMeta.value.isReportModalOpen = true;
  }
};

const onServiceReportSave = async () => {
  modalMeta.value.isReportModalOpen = false;
  if (schedulerView.value) {
    fetchScheduleData();
  } else {
    fetchGridData();
  }
};

const handleFilterChange = () => {
  gridMeta.value.page = 1;
  if (schedulerView.value) {
    fetchScheduleData();
  } else {
    fetchGridData();
  }
};

const handleCheckboxChange = () => {
  if (schedulerView.value) {
    fetchScheduleData();
  } else {
    fetchGridData();
  }
};

const excelExport = async () => {
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
  location.href = `/api/service/schedule/exportlist?${paramsString}`;
  exportIsLoading.value = false;
};
const onScheduletaskDblClick = async (event) => {
  let serviceReportID = 0;
  if (!event.taskRecord.originalData.children) {
    await useApiFetch(`/api/service/servicereports/`, {
      method: "GET",
      params: {
        CANO: event.taskRecord.originalData?.name ?? "",
      },
      onResponse({ response }) {
        if (response.status === 200) {
          serviceReportID = response._data.body[0]?.uniqueID ?? 0;
        }
      },
    });
    gridMeta.value.selectedServiceId = serviceReportID;
    modalMeta.value.modalTitle = "Service Report";
    modalMeta.value.modalDescription = "Service Report";
    modalMeta.value.isReportModalOpen = true;
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Service Schedule" class="gmsPurpleHeader">
      </UDashboardNavbar>
      <div class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Service Report List</h2>
      </div>
      <UDashboardToolbar>
        <div class="flex flex-col w-full">
          <div class="flex justify-between items-center w-full">
            <div class="flex space-x-2">
              <template
                v-for="[key, value] in Object.entries(headerFilters)"
                :key="key"
              >
                <template v-if="value.options.length > 1">
                  <div class="basis-1/7 max-w-[200px]">
                    <UFormGroup :label="value.label" :name="key">
                      <USelect
                        v-model="filterValues[`${value.filter}`]"
                        :options="value.options"
                        @change="handleFilterChange()"
                      />
                    </UFormGroup>
                  </div>
                </template>
              </template>

              <div class="grid grid-cols-3 ml-10">
                <template v-for="checkbox in headerCheckboxes">
                  <div class="basis-1/5">
                    <UCheckbox
                      v-model="checkbox.isChecked"
                      :label="checkbox.label"
                      @change="handleCheckboxChange"
                    />
                  </div>
                </template>
              </div>

              <!-- <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfOSchedule }}
                </div>
              </UFormGroup>
            </div>
          </div> -->
            </div>
            <div class="flex item space-x-2 items-center">
              <!-- <template #right> -->
              <div class="h-5">
                List
                <UToggle color="primary" xsize="2xl" v-model="schedulerView" />
                Scheduler
              </div>
              <UButton
                :loading="exportIsLoading"
                label="Export to Excel"
                color="gray"
                class="h-fit"
                :disabled="exportIsLoading"
                @click="excelExport"
              >
                <template #trailing>
                  <UIcon
                    name="i-heroicons-document-text"
                    class="text-green-500 w-5 h-5"
                  />
                </template>
              </UButton>
              <!-- </template> -->
            </div>
          </div>

          <div class="flex gap-x-10 mt-4">
            <div class="inline-flex space-x-2">
              <span>Total Travel Cost:</span>
              <span>0</span>
            </div>

            <div class="inline-flex space-x-2">
              <span>Total Onsite Cost:</span>
              <span>0</span>
            </div>

            <div class="inline-flex space-x-2">
              <span>Total Parts Cost:</span>
              <span>0</span>
            </div>

            <div class="inline-flex space-x-2">
              <span>Total Cost:</span>
              <span>0</span>
            </div>

          </div>
        </div>
      </UDashboardToolbar>

      <template v-if="!schedulerView">
        <UTable
          :rows="gridMeta.schedules"
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

          <template
            v-for="column in gridMeta.schedules"
            v-slot:[`cell-${column.key}`]="{ row }"
          >
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
            <UTooltip text="Delete" class="flex justify-center">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-eye"
                @click="onReportView(row)"
              />
            </UTooltip>
          </template>
        </UTable>
        <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
          <div class="flex flex-row justify-end mr-20 mt-1">
            <UPagination
              :max="7"
              :page-count="gridMeta.pageSize"
              :total="gridMeta.numberOfOSchedule || 0"
              v-model="gridMeta.page"
              @update:model-value="handlePageChange()"
            />
          </div>
        </div>
      </template>
      <template v-else style="height: 100%">
        <bryntum-gantt
          ref="gantt"
          :tasks="ganttMeta.tasks"
          :startDate="ganttMeta.startDate"
          :endDate="ganttMeta.endDate"
          :height="100"
          :parentAreaFeature="true"
          :scrollButtonsFeature="true"
          :taskEditFeature="false"
          :taskDragFeature="false"
          :taskCopyPasteFeature="false"
          :taskMenuFeature="false"
          @taskDblClick="onScheduletaskDblClick"
        />
      </template>
    </UDashboardPanel>
  </UDashboardPage>

  <!-- New Organization Detail Modal -->
  <UDashboardModal
    v-model="modalMeta.isReportModalOpen"
    title="Service Report"
    :ui="{
      width: 'w-[1800px] sm:max-w-9xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ServiceReportDetail
      :selected-complaint="null"
      :selected-service-report="gridMeta.selectedServiceId"
      @save="onServiceReportSave"
    />
  </UDashboardModal>
</template>
<style></style>
