<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import { format } from "date-fns";
const emit = defineEmits(["close", "select"]);

const props = defineProps({
  isModal: {
    type: [Boolean, null],
  },
});

onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Customers",
});

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";
const items = [
  {
    label: "Customer Lookup",
    key: "lookup",
  },
  {
    label: "Customer History",
    key: "history",
  },
];
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
      label: "Home Phone",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "workphone",
      label: "Work Phone",
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
  ],
  page: 1,
  pageSize: 50,
  numberOfCustomers: 0,
  customers: [],
  selectedCustomerId: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const invoicesGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "DateTime",
      label: "Date",
    },
    {
      key: "number",
      label: "#",
    },
    {
      key: "openclosed",
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
const serviceOrderGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "DateTime",
      label: "Date",
    },
    {
      key: "number",
      label: "#",
    },
    {
      key: "openclosed",
      label: "Status",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});
const quoteGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "DateTime",
      label: "Date",
    },
    {
      key: "number",
      label: "#",
    },
    {
      key: "openclosed",
      label: "Status",
    },
  ],
  options: [],
  selectedOption: null,
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
const formatStatus = (s: number | string | null | undefined) => {
  if (s === null || s === undefined) return "";
  return s === 0 ? "" : "Closed";
}
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
  // table data coming in there
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
      }
      gridMeta.value.isLoading = false;
    },
  });
};


const getCustomerInvoices = async () => {
  await useApiFetch("/api/customers/invoices", {
    method: "GET",
    params: {
      customerid: gridMeta.value.selectedCustomerId,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        invoicesGridMeta.value.invoices = response._data.body.map((invoice) => ({
          ...invoice,
          DateTime: format(new Date(invoice.DateTime), "MM/dd/yyyy"),
          openclosed: formatStatus(invoice.openclosed)
        }));
        console.log(invoicesGridMeta.value.invoices)

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
        sitevisitGridMeta.value.options = response._data.body.map((visit) => ({
          ...visit,
          DateTime: format(new Date(visit.VisitDate), "MM/dd/yyyy"),
        }));
      }
    },
  });
};

const getCustomerServiceOrders = async () => {
  await useApiFetch("/api/service/orders/getCustomerServiceOrders", {
    method: "GET",
    params: {
      CustomerID: gridMeta.value.selectedCustomerId,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        serviceOrderGridMeta.value.options = response._data.body.map(
          (order) => ({
            ...order,
            DateTime: format(new Date(order.DateTime), "MM/dd/yyyy"),
            openclosed: formatStatus(order.openclosed)
          })
        );
      }
    },
  });
};

const getCustomerQuotes = async () => {
  await useApiFetch("/api/quotes/getCustomerQuotes", {
    method: "GET",
    params: {
      CustomerID: gridMeta.value.selectedCustomerId,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        quoteGridMeta.value.options = response._data.body.map((quote) => ({
          ...quote,
          DateTime: format(new Date(quote.DateTime), "MM/dd/yyyy"),
        }));
      }
    },
  });
};

const onOrderDetail = (row) => {
  // gridMeta.value.selectedCustomerId = row?.UniqueID;
};
const onOrderDetailDblClick = () => {
  modalMeta.value.isOrderDetailModalOpen = true;
};
const onQuoteDetail = (row) => {
  // gridMeta.value.selectedCustomerId = row?.UniqueID;
};
const onQuoteDetailDblClick = () => {
  modalMeta.value.isQuoteDetailModalOpen = true;
}
const onServiceOrderDetail = (row) => {
  // gridMeta.value.selectedCustomerId = row?.UniqueID;
};
const onServiceOrderDetailDblClick = () => {
  modalMeta.value.isServiceOrderDetailModalOpen = true;
};
const onSiteVisitDetail = (row) => {
  // gridMeta.value.selectedCustomerId = row?.UniqueID;
};
const onSiteVisitDetailDblClick = (row) => {
  modalMeta.value.isSiteVisitModalOpen = true;
};

const handleModalClose = () => {
  modalMeta.value.isCustomerModalOpen = false;
};
const handleModalSave = async () => {
  handleModalClose();
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

const selectedCustomerRow = ref({});

const onSelect = async (row) => {
  selectedCustomerRow.value = row;

  gridMeta.value.selectedCustomerId = row?.UniqueID;
  await getCustomerInvoices();
  await getCustomerSiteVisit();
  await getCustomerServiceOrders();
  await getCustomerQuotes();
};

const handleSelect = () => {
  emit("select", selectedCustomerRow.value);
  emit("close");
};

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsPurpleHeader" title="Customer List" v-if="!props.isModal">
      </UDashboardNavbar>

      <UDashboardPanelContent class="p-0">
        <div class="px-4 py-2 gmsPurpleTitlebar">
          <h2>Sort</h2>
        </div>

        <UDashboardToolbar class="bg-gms-gray-100">
          <template #left>
            <div class="flex flex-row space-x-3" style="max-width: 930px">
              <template v-for="[key, value] in Object.entries(headerFilters)" :key="key">
                <template v-if="value.options.length > 1">
                  <div class="basis-1/7 max-w-[200px]">
                    <UFormGroup :label="value.label" :name="key">
                      <USelect v-model="filterValues[`${value.filter}`]" :options="value.options"
                        @change="handleFilterChange()" />
                    </UFormGroup>
                  </div>
                </template>
              </template>

              <div class="basis-1/7 max-w-[200px]">
                <UFormGroup label="Zip" name="zip">
                  <UInput v-model="filterValues.zip" @update:model-value="handleFilterChange()" />
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
            <UButton color="green" variant="outline" :loading="exportIsLoading" label="Export to Excel"
              trailing-icon="i-heroicons-document-text" @click="excelExport">
            </UButton>
          </template>
        </UDashboardToolbar>

        <UTabs :items="items" :ui="{
          wrapper: ' bg-gms-purple',
          list: {
            base: 'relative',
            background: 'bg-gms-purple',
            rounded: 'rounded-none',
            shadow: 'shadow-none',
            width: '',
            marker: {
              rounded: 'rounded-none',
              shadow: 'shadow-none',
            },
            tab: {
              background: '',
              active: 'text-gray-900 dark:text-white',
              inactive: 'text-gray-100 dark:text-gray-200 bg-gms-purple',
              shadow: '',
            },
          },
        }">
          <template #item="{ item }">
            <div class="h-[25vh] overflow-hidden bg-white">
              <div v-if="item.key === 'lookup'">
                <UTable :rows="gridMeta.customers" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
                  th: {
                    base: 'sticky top-0 z-10',
                    padding: 'pb-0',
                  },
                  td: {
                    padding: 'py-1',
                  },
                  wrapper:
                    'overflow-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                }" :empty-state="{
                  icon: 'i-heroicons-circle-stack-20-solid',
                  label: 'No items.',
                }" @select="onSelect">
                  <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                      <div class="">
                        <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                          @handle-input-change="handleFilterInputChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
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
              </div>
              <div v-else-if="item.key === 'history'">
                <div>
                  <div class="p-3 flex space-x-4">
                    <div class="w-1/4">
                      <UFormGroup label="Service Orders">
                        <UTable :rows="serviceOrderGridMeta.options" :columns="serviceOrderGridMeta.defaultColumns"
                          :loading="serviceOrderGridMeta.isLoading" :ui="{
                            wrapper:
                              'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                            divide: 'divide-gray-200 dark:divide-gray-800',
                            tr: {
                              active:
                                'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                            },
                            th: {
                              base: 'sticky top-0 z-10',
                              padding: 'px-2 py-0',
                            },
                            td: {
                              base: 'h-[31px]',
                              padding: 'px-2 py-0',
                            },
                          }" @select="onServiceOrderDetail" @dblclick="onServiceOrderDetailDblClick">
                        </UTable>
                      </UFormGroup>
                    </div>

                    <div class="w-1/4">
                      <UFormGroup label="Quotes">
                        <UTable :rows="quoteGridMeta.options" :columns="quoteGridMeta.defaultColumns"
                          :loading="quoteGridMeta.isLoading" :ui="{
                            wrapper:
                              'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                            divide: 'divide-gray-200 dark:divide-gray-800',
                            tr: {
                              active:
                                'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                            },
                            th: {
                              base: 'sticky top-0 z-10',
                              padding: 'px-2 py-0',
                            },
                            td: {
                              base: 'h-[31px]',
                              padding: 'px-2 py-0',
                            },
                          }" @select="onQuoteDetail" @dblclick="onQuoteDetailDblClick">
                        </UTable>
                      </UFormGroup>
                    </div>

                    <div class="w-1/4">
                      <UFormGroup label="Invoices">
                        <UTable :rows="invoicesGridMeta.invoices" :columns="invoicesGridMeta.defaultColumns" :ui="{
                          wrapper:
                            'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                          divide: 'divide-gray-200 dark:divide-gray-800',
                          tr: {
                            active:
                              'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                          },
                          th: {
                            base: 'sticky top-0 z-10',
                            padding: 'px-2 py-0',
                          },
                          td: {
                            base: 'h-[31px]',
                            padding: 'px-2 py-0',
                          },
                        }" @select="onOrderDetail" @dblclick="onOrderDetailDblClick">
                        </UTable>
                      </UFormGroup>
                    </div>

                    <div class="w-1/4">
                      <UFormGroup label="Site Visits">
                        <UTable :rows="sitevisitGridMeta.options" :columns="sitevisitGridMeta.defaultColumns"
                          :loading="sitevisitGridMeta.isLoading" :ui="{
                            wrapper:
                              'h-32 border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                            divide: 'divide-gray-200 dark:divide-gray-800',
                            tr: {
                              active:
                                'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                            },
                            th: {
                              base: 'sticky top-0 z-10',
                              padding: 'px-2 py-0',
                            },
                            td: {
                              base: 'h-[31px]',
                              padding: 'px-2 py-0',
                            },
                          }" @select="onSiteVisitDetail" @dblclick="onSiteVisitDetailDblClick">
                        </UTable>
                      </UFormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>

        <CustomersForm @close="handleModalClose" @save="handleModalSave"
          :selected-customer="gridMeta?.selectedCustomerId" :is-modal="false" @select="handleSelect" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal v-model="modalMeta.isOrderDetailModalOpen" title="Invoice" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <InvoiceDetail :selected-customer="gridMeta.selectedCustomerId" @close="modalMeta.isOrderDetailModalOpen = false" />
  </UDashboardModal>



  <UDashboardModal v-model="modalMeta.isQuoteDetailModalOpen" title="Quote" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1250px] sm:max-w-7xl',
  }">
    <CustomersQuoteDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>



  <UDashboardModal v-model="modalMeta.isServiceOrderDetailModalOpen" title="Service Order" :ui="{
    title: 'text-lg text-white',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0',
    },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <ServiceOrderDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>



  <UDashboardModal v-model="modalMeta.isSiteVisitModalOpen" title="Site Visit" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <CustomersSiteVisitDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>
</template>
