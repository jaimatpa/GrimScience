<script lang="ts" setup>
import PurchaseDetails from "~/components/materials/vendors/PurchaseDetails.vue";
import type { UTableColumn } from "~/types";

useSeoMeta({
  title: `Grimm-Materials purchases`,
});

const route = useRoute();
const toast = useToast();
const startDate = ref('');
const endDate = ref('');
const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const viewPurchaseModalMeta = ref({
  isModalOpen: false,
  modalDescription: "Add a new invoice to your database",
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "PONUMBER",
      label: "PO#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "DATE",
      label: "Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "NAME",
      label: "Vendor",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "IRPHONE",
      label: "Phone",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "TOTAL",
      label: "Total",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "OPENCLOSED",
      label: "Open",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfPurchases: 0,
  purchases: [],
  selectedPO: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const filterValues = ref({
  PONUMBER: null,
  DATE: null,
  NAME: null,
  IRPHONE: null,
  TOTAL: null,
  OPENCLOSED: null,
  startDate: null,
  endDate: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);
const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);
Object.entries(route.query).forEach(([key, value]) => {
  switch (key.toLowerCase()) {
    case "offset":
      gridMeta.value.page = Number(value);
      break;
    case "limit":
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
const onStartDateChange = (event: Event) => {
  startDate.value = (event.target as HTMLInputElement).value;
  filterValues.value.startDate = startDate.value;
};

const onEndDateChange = (event: Event) => {
  endDate.value = (event.target as HTMLInputElement).value;
  filterValues.value.endDate = endDate.value;
};
// fetch purchse list
const fetchPurchasesData = async () => {
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/materials/purchase/", {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    },
    onResponse: ({ response }) => {
      console.log(response?._data?.body, "====> purchases list");
      gridMeta.value.purchases = response?._data?.body.list;
      gridMeta.value.numberOfPurchases = response?._data?.body.count;
      gridMeta.value.isLoading = false;
    },
  });
};

// open view purchase moal
const triggerViewPurchaseModal = () => {
  if (gridMeta.value.selectedPO) {
    viewPurchaseModalMeta.value.isModalOpen = true;
  } else {
    toast.add({
      title: "info",
      description: "Slect a purchase first",
    });
  }
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
};

const handleFilterInputChange = async (event: any, name: string) => {
  gridMeta.value.page = 1;
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchPurchasesData();
};

fetchPurchasesData();

const onSelect = (row: any) => {
  gridMeta.value.selectedPO = row
  console.log(gridMeta.value.selectedPO);
};
// Handle date range lookup
const handleDateRangeLookup = () => {
  gridMeta.value.page = 1; // Reset to first page
  fetchPurchasesData();
};
const onDblClick = () => console.log(gridMeta.value, "======> selected Data");

// delete selected purchase
const deletePurchase = async () => {
  if (gridMeta.value.selectedPO) {
    gridMeta.value.isLoading = true;
    await useApiFetch("/api/materials/purchase/", {
      method: "DELETE",
      params: {
        UniqueID: gridMeta.value.selectedPO.UniqueID,
      },
      onResponse: ({ response }) => {
        console.log(response._data?.body);
        console.log(response);
        if (response._data?.status == 201) {
          toast.add({
            title: "Success",
            description: response._data.message,
          });
          fetchPurchasesData();
          gridMeta.value.isLoading = false;
        }
      },
    });
  } else
    toast.add({
      title: "info",
      description: "Cliek on a purchase tou want to delete.",
    });
};

const handlePageChange = async () => {
  fetchPurchasesData();
};

fetchPurchasesData();
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Purchases" class="gmsBlueHeader" />
      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Purchase Lookup</h2>
      </div>

      <UTable :rows="gridMeta.purchases" :columns="columns" :loading="gridMeta.isLoading"
        class="w-full min-h-[60%] overflow-y-auto" :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: {
            base: 'sticky top-0 z-10',
            padding: 'pb-0',
          },
          td: {
            padding: `py-1`,
          },
        }" :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }" @select="onSelect" @dblclick="onDblClick">
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.kind === 'actions'">
            <div class="">
              <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                @handle-input-change="handleFilterInputChange" :label="column.label" :sortable="column.sortable"
                :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
                  ? noneIcon
                  : column?.sortDirection === 'asc'
                    ? ascIcon
                    : descIcon
                  " :filterable="column.filterable" :filter-key="column.key" />
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
        <div class="flex flex-row justify-end mx-10 mt-1 gap-5">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
            </div>
            <div class="flex items-center gap-3">
              <UButton @click="triggerViewPurchaseModal" color="primary" variant="outline">
                View Purchase Order
              </UButton>
              <UButton @click="deletePurchase" color="red" variant="outline">
                Delete Purchase Order
              </UButton>
            </div>
          </div>
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfPurchases"
            v-model="gridMeta.page" @update:model-value="handlePageChange" />

        </div>
      </div>
      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Date Range Lookup</h2>
      </div>
      <div class="px-5 py-2 bg-gms-gray-100">
        <div class="flex items-center gap-10">
          <div class="flex items-center gap-2">
            <label for="startDate">From</label>
            <input type="date" class="border border-solid border-gray-600 rounded-lg px-2"
              @change="onStartDateChange" />
          </div>
          <div class="flex items-center gap-2">
            <label for="endDate">To</label>
            <input type="date" class="border border-solid border-gray-600 rounded-lg px-2" @change="onEndDateChange" />
          </div>
          <UButton color="primary" variant="solid" @click="handleDateRangeLookup">
            Lookup
          </UButton>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>


  <UDashboardModal v-model="viewPurchaseModalMeta.isModalOpen" class="h-[50vh] overflow-y-auto" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[90%] sm:max-w-9xl',
    height: 'h-[500px]',
  }">
    <PurchaseDetails :is-creating="false" :modal-data="gridMeta.selectedPO"></PurchaseDetails>

  </UDashboardModal>
</template>
<style scoped></style>