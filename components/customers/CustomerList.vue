<script lang="ts" setup>
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "select"]);

onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Customers",
});

const props = defineProps({
  isPage: {
    type: [Boolean, null],
  },
});

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";
const activeTab = ref("lookup");

function setActiveTab(tab) {
  activeTab.value = tab;
}

const headerFilters = ref({
  markets: {
    label: "Market",
    filter: "market",
    options: [],
  },
  professions: {
    label: "Profession",
    filter: "source",
    options: [],
  },
  categories: {
    label: "Category",
    filter: "ParadynamixCatagory",
    options: [],
  },
  conferences: {
    label: "Conference",
    filter: "SourceConfrence",
    options: [],
  },
  usstates: {
    label: "State",
    filter: "state",
    api: "/api/common/usstates",
    options: [],
  },
});
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "number",
      label: "Number",
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
      key: "company1",
      label: "Company",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "homephone",
      label: "HomePhone",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "workphone",
      label: "WorkPhone",
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
  numberOfCustomers: 0,
  customers: [],
  selectedCustomerId: null,
  selectCustomer: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});
const modalMeta = ref({
  isCustomerModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  modalTitle: "New Customer",
});
const filterValues = ref({
  market: null,
  source: null,
  ParadynamixCatagory: null,
  SourceConfrence: null,
  number: null,
  fname: null,
  lname: null,
  company1: null,
  homephone: null,
  workphone: null,
  state: null,
  zip: null,
});
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

const init = async () => {
  fetchGridData();
  for (const key in headerFilters.value) {
    const apiURL = headerFilters.value[key]?.api ?? `/api/customers/${key}`;
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
  await useApiFetch("/api/customers/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfCustomers = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfCustomers === 0) {
    gridMeta.value.customers = [];
    gridMeta.value.numberOfCustomers = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfCustomers
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfCustomers / gridMeta.value.pageSize) | 1;
  }
  await useApiFetch("/api/customers/", {
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
        gridMeta.value.customers = response._data.body;
        console.log(gridMeta.value)
      }
      gridMeta.value.isLoading = false;
    },
  });
};
const onCreate = () => {
  gridMeta.value.selectedCustomerId = null;
  modalMeta.value.modalTitle = "New Customer";
  modalMeta.value.isCustomerModalOpen = true;
};
const onEdit = (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID;
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.isCustomerModalOpen = true;
};
const onDelete = async (row: any) => {
  await useApiFetch(`/api/customers/${row?.UniqueID}`, {
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
const handleModalClose = () => {
  modalMeta.value.isCustomerModalOpen = false;
};
const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
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
  location.href = `/api/customers/exportlist?${paramsString}`;
  exportIsLoading.value = false;
};

const getCustomerInvoices = async () => {
  await useApiFetch("/api/customers/invoices", {
    method: "GET",
    params: {
      customerid: gridMeta.value.selectedCustomerId,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        invoicesGridMeta.value.invoices = response._data.body;
      }
    },
  });
};

const getCustomerSiteVisit = async () => {
  await useApiFetch("/api/sitevisit/sitevisit", {
    method: "GET",
    params: {
      CustomerID: gridMeta.value.selectedCustomerId,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        sitevisitGridMeta.value.options = response._data.body;
      }
    },
  });
};

const onSelect = async (row) => {
  gridMeta.value.selectedCustomerId = row?.UniqueID;

  gridMeta.value.customers.forEach((cus) => {
    if (cus.UniqueID === row.UniqueID) {
      cus.class = "bg-gray-200";
    } else {
      delete cus.class;
    }
  });
  gridMeta.value.selectCustomer = row;

  await getCustomerInvoices();
  await getCustomerSiteVisit();
};

const invoicesGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "invoicedate",
      label: "Date",
    },
    {
      key: "orderid",
      label: "#",
    },
    {
      key: "status",
      label: "Status",
    },
  ],
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
});

const sitevisitGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "VisitDate",
      label: "Date",
    },
    {
      key: "VisitNumber",
      label: "#",
    },
    {
      key: "Status",
      label: "Status",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const onInvoicesSelect = (row) => {
  invoicesGridMeta.value.selectedInvoice = row;
};

const onDblInvoicesClick = () => {
  if (invoicesGridMeta.value.selectedInvoice) {
    modalMeta.value.isOrderDetailModalOpen = true;
  }
};

const handleSelect = () => {
  const cus = gridMeta.value.selectCustomer;
  const value = `#${cus?.number} ${cus?.fname} ${cus?.lname}`;
  emit("select", value);
  emit("close");
};
const onDblClick = async () => {
  if (gridMeta.value.selectedCustomerId) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isCustomerModalOpen = true;
  }
};

const routinesColumns = ref([
  {
    key: "id",
    label: "Date",
  },
  {
    key: "period",
    label: "#",
  },
  {
    key: "title",
    label: "Status",
  },
]);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-if="props.isPage"
        class="gmsPurpleHeader"
        title="Customer List"
      >
      </UDashboardNavbar>
      <!-- {{ isPage }} -->
      <div v-if="props.isPage" class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar v-if="props.isPage">
        <template #left>
          <div class="flex flex-row space-x-3">
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
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Zip" name="zip">
                <UInput
                  v-model="filterValues.zip"
                  @update:model-value="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfCustomers }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          <UButton
            color="green"
            variant="outline"
            :loading="exportIsLoading"
            label="Export to Excel"
            trailing-icon="i-heroicons-document-text"
            @click="excelExport"
          >
          </UButton>
          <UButton
            color="green"
            variant="outline"
            label="New customer"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <div v-if="props.isPage" class="px-4 py-2 gmsPurpleTitlebar">
        <button
          :class="{
            'bg-white text-black': activeTab === 'lookup',
            gmsPurpleTitlebar: activeTab !== 'lookup',
          }"
          @click="setActiveTab('lookup')"
          class="px-4 py-0.5 focus:outline-none rounded-md"
        >
          Lookup
        </button>
        <button
          :class="{
            'bg-white text-black': activeTab === 'history',
            gmsPurpleTitlebar: activeTab !== 'history',
          }"
          @click="setActiveTab('history')"
          class="px-4 py-0.5 ml-2 focus:outline-none rounded-md"
        >
          Customer History
        </button>
      </div>
      <UTable
        v-if="activeTab === 'lookup'"
        :rows="gridMeta.customers"
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
      <div v-else class="flex flex-col overflow-scroll">
        <div class="w-full mt-4 flex items-end justify-end pr-5">
          <UButton
            icon="i-f7-arrow-clockwise"
            variant="outline"
            color="green"
            label="Refresh"
            :ui="{ base: 'w-fit', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div class="grid grid-cols-2 gap-5 px-5">
          <div>
            <span>Service Order</span>
            <UTable
              :columns="routinesColumns"
              :rows="[]"
              :ui="{
                wrapper: 'h-56 border-2 border-gray-300 dark:border-gray-700',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-1',
                },
              }"
            />
          </div>
          <div>
            <span>Quotes</span>
            <UTable
              :columns="routinesColumns"
              :rows="[]"
              :ui="{
                wrapper: 'h-56 border-2 border-gray-300 dark:border-gray-700',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-1',
                },
              }"
            />
          </div>
          <div>
            <span>Invoices</span>
            <UTable
              :columns="invoicesGridMeta.defaultColumns"
              :rows="invoicesGridMeta.invoices"
              :ui="{
                wrapper:
                  'h-56 border-[1px] border-gray-400 dark:border-gray-700',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                },
                th: {
                  padding: 'p-1',
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                },
                td: {
                  padding: 'p-1',
                },
                checkbox: { padding: 'p-1 w-[10px]' },
              }"
              @select="onInvoicesSelect"
              @dblclick="onDblInvoicesClick"
            />
          </div>
          <div>
            <span>Site Visits</span>
            <UTable
              :columns="sitevisitGridMeta.defaultColumns"
              :rows="sitevisitGridMeta.options"
              :ui="{
                wrapper:
                  'h-56 border-[1px] border-gray-400 dark:border-gray-700',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                },
                th: {
                  padding: 'p-1',
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                },
                td: {
                  padding: 'p-1',
                },
                checkbox: { padding: 'p-1 w-[10px]' },
              }"
            />
          </div>
        </div>
      </div>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div
          v-if="props.isPage && activeTab === 'lookup'"
          class="flex flex-row justify-end mr-20 mt-1"
        >
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfCustomers | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>

        <div v-if="!props.isPage">
          <div class="mt-3 w-[120px]">
            <UButton
              icon="i-heroicons-cursor-arrow-ripple"
              variant="outline"
              color="green"
              label="Select"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              truncate
              @click="handleSelect"
            >
            </UButton>
          </div>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Customer Detail Modal -->
  <UDashboardModal
    v-model="modalMeta.isCustomerModalOpen"
    :title="modalMeta.modalTitle"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-7xl',
    }"
  >
    <CustomersForm
      @close="handleModalClose"
      @save="handleModalSave"
      :selected-customer="gridMeta.selectedCustomerId"
      :is-modal="true"
    />
  </UDashboardModal>

  <!-- Order Modal -->
  <UDashboardModal
    v-model="modalMeta.isOrderDetailModalOpen"
    title="Order"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl',
    }"
  >
    <InvoiceDetail
      :selected-customer="gridMeta.selectedCustomerId"
      :selected-order="invoicesGridMeta.selectedInvoice.orderid"
      @close="handleModalClose"
    />
  </UDashboardModal>
</template>
<style scoped></style>
