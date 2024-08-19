<script lang="ts" setup>
import CreatePurchaseModal from "~/components/purchase/CreatePurchaseModal.vue";
import type { UTableColumn } from "~/types";

useSeoMeta({
  title: `Grimm-Materials purchases`,
});

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const createPurchaseModalMeta = ref({
  isOrderDetailModalOpen: false,
  modalTitle: "New Invoice",
  modalDescription: "Add a new invoice to your database",
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "UniqueId",
      label: "PO#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "vendor",
      label: "Vendor",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      kind: "actions",
    },
    {
      key: "open",
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
  selectedPurchaseId: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const filterValues = ref({
  UniqueId: null,
  date: null,
  vendor: null,
  phone: null,
  total: null,
  open: null,
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
      gridMeta.value.purchases = response?._data?.body;
      gridMeta.value.isLoading = false;
    },
  });
};

// open the modal for create purchase
const triggerCreatePurchaseModal = () => {
  createPurchaseModalMeta.value.isOrderDetailModalOpen = true;
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
  gridMeta.value.selectedPurchaseId = row.UniqueId;
  console.log(gridMeta.value.selectedPurchaseId);
};

const onDblClick = () => console.log(gridMeta.value, "======> selected Data");

// delete selected purchase
const deletePurchase = async () => {
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/materials/purchase/", {
    method: "DELETE",
    params: {
      UniqueId: gridMeta.value.selectedPurchaseId,
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

      <UTable
        :rows="gridMeta.purchases"
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
            padding: `py-1`,
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
          <template v-if="column.kind === 'actions'">
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
        <template #label-data="{ row }">
          <UTooltip text="Label" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-tag"
              @click=""
            />
          </UTooltip>
        </template>
        <template #order-data="{ row }">
          <UTooltip text="Order" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-shopping-cart"
              @click="onOrderDetail(row)"
            />
          </UTooltip>
        </template>
        <template #quote-data="{ row }">
          <UTooltip text="Quote" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-currency-dollar"
              @click="onQuoteDetail(row)"
            />
          </UTooltip>
        </template>
        <template #serviceOrder-data="{ row }">
          <UTooltip text="Service Order" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-chat-bubble-left-ellipsis"
              @click="onServiceOrderDetail(row)"
            />
          </UTooltip>
        </template>
        <template #siteVisit-data="{ row }">
          <UTooltip text="Site Visit" class="flex justify-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-clipboard-document-list"
              @click="onSiteVisitDetail(row)"
            />
          </UTooltip>
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
        <div class="flex flex-row justify-end mx-10 mt-1 gap-5">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <button
                class="border border-solid border-gray-300 px-5 py-1 text-sm"
              >
                Select Purchase Order
              </button>
              <button
                @click="triggerCreatePurchaseModal"
                class="border border-solid border-gray-300 px-5 py-1 text-sm"
              >
                Create Purchase Order
              </button>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="border border-solid border-blue-300 px-5 py-1 text-blue-400 text-sm"
              >
                View Purchase Order
              </button>
              <button
                @click="deletePurchase"
                class="border border-solid border-red-300 px-5 py-1 text-red-400 text-sm"
              >
                Delete Purchase Order
              </button>
            </div>
          </div>
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfPurchases | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div>
      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Date Range Lookup</h2>
      </div>
      <div class="px-5 py-2">
        <div class="flex items-center gap-10">
          <div class="flex items-center gap-2">
            <label for="form">Form</label>
            <input
              type="date"
              class="border border-solid border-gray-600 rounded-lg px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <label for="to">To</label>
            <input
              type="date"
              class="border border-solid border-gray-600 rounded-lg px-2"
            />
          </div>
          <button class="bg-[steelblue] text-white px-5 py-1 rounded-md">
            Lookup
          </button>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal
    v-model="createPurchaseModalMeta.isOrderDetailModalOpen"
    title="Create Purchase"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[60%] sm:max-w-9xl',
    }"
  >
    <CreatePurchaseModal :modalMeta="createPurchaseModalMeta" />
  </UDashboardModal>
</template>
<style scoped></style>
