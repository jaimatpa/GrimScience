<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { debounce } from "lodash";
import { format } from "date-fns";

useSeoMeta({
  title: "Grimm-Customers Quote",
});

onMounted(async () => {
  fetchDropdownOptions();
  fetchQuotes();
});

const toast = useToast();
const exportIsLoading = ref(false);

const filters = ref({
  statusFilters: {
    quotePending: true,
    open: false,
    closed: false,
    orderPending: false,
    booked: false,
  },
  filterDate: false,
  startDate: "",
  endDate: "",
  model: "",
  invoicedate: "",
  quotenumber: "",
  Source: null,
  sourcedescription: null,
  status: null,
  productLine: null,
  customerNumber: null,
  customerName: "",
  company1: "",
  expirationdate: "",
  EstimatedBooking: "",
  Estimatedship: "",
});

const dropdownOptions = ref({
  SourceList: [],
  sourcedescriptionList: [],
  statusList: [],
  productLineList: [],
});

const columns = [
  { key: "invoicedate", label: "Date", sortable: true },
  { key: "quotenumber", label: "Quote #", sortable: true },
  { key: "Source", label: "Source", sortable: true, isDropdown: true },
  {
    key: "sourcedescription",
    label: "Source Desc.",
    sortable: true,
    isDropdown: true,
  },
  { key: "status", label: "Status", sortable: true, isDropdown: true },
  {
    key: "productLine",
    label: "Product Line",
    sortable: true,
    isDropdown: true,
  },
  { key: "customerNumber", label: "Customer#", sortable: true },
  { key: "customerName", label: "Customer", sortable: true },
  { key: "company1", label: "Company", sortable: true },
  { key: "expirationdate", label: "Expiration", sortable: false },
  { key: "EstimatedBooking", label: "Est. Book", sortable: false },
  { key: "Estimatedship", label: "Est. Ship", sortable: false },
];

const gridMeta = ref({
  quotes: [],
  selectedQuoteId: null as string | null,
  page: 1,
  pageSize: 50,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
});

const fetchSourceDescriptions = async (source) => {
  if (!source) {
    dropdownOptions.value.sourcedescriptionList = [];
    return;
  }

  await useApiFetch(`/api/quotes/sourceDescriptions`, {
    method: "GET",
    query: { source },
    onResponse({ response }) {
      if (response.status === 200) {
        dropdownOptions.value.sourcedescriptionList = response._data.body;
      }
    },
    onResponseError({ error }) {
      console.error("Source Description Error:", error);
      dropdownOptions.value.sourcedescriptionList = [];
      toast.add({
        title: "Error",
        description: "Failed to fetch source descriptions",
        color: "red",
      });
    },
  });
};

watch(
  () => filters.value.Source,
  async (newSource) => {
    if (newSource === null || newSource === undefined) {
      dropdownOptions.value.sourcedescriptionList = [];
      filters.value.sourcedescription = null;
      return;
    }
    filters.value.sourcedescription = null;
    await fetchSourceDescriptions(newSource);
  },
  { immediate: true }
);

const fetchDropdownOptions = async () => {
  await useApiFetch("/api/quotes/source", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        dropdownOptions.value.SourceList = response._data.body;
      }
    },
    onResponseError() {
      dropdownOptions.value.SourceList = [];
    },
  });

  await useApiFetch("/api/quotes/productLineList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        dropdownOptions.value.productLineList = response._data.body;
      }
    },
    onResponseError() {
      dropdownOptions.value.productLineList = [];
    },
  });
};

const fetchQuotes = async () => {
  gridMeta.value.isLoading = true;
  try {
    const statusFilters = Object.entries(filters.value.statusFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    await useApiFetch("/api/quotes/OrderDetails", {
      method: "GET",
      params: {
        ...filters.value,
        statusFilters,
        page: gridMeta.value.page,
        pageSize: gridMeta.value.pageSize,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          const { orders, pagination } = response._data.body;
          gridMeta.value.quotes = orders;
          gridMeta.value.page = pagination.page;
          gridMeta.value.pageSize = pagination.pageSize;
          gridMeta.value.totalItems = pagination.totalItems;
          gridMeta.value.totalPages = pagination.totalPages;
        }
      },
      onResponseError({ response }) {
        console.error("Error fetching quotes:", response._data);
        toast.add({
          title: "Error",
          description: "Failed to fetch quotes",
          color: "red",
        });
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    toast.add({
      title: "Error",
      description: "Failed to fetch quotes",
      color: "red",
    });
  } finally {
    gridMeta.value.isLoading = false;
  }
};

const modelLookup = async () => {
  if (filters.value.model) {
    gridMeta.value.page = 1;
    await fetchQuotes();
  } else {
    toast.add({
      title: "Info",
      description: "Please enter a model to search",
      color: "blue",
    });
  }
};

const deleteQuote = async () => {
  if (gridMeta.value.selectedQuoteId) {
    try {
      await useApiFetch("/api/quotes/deleteOrder", {
        method: "DELETE",
        body: { orderId: gridMeta.value.selectedQuoteId },
        onResponse() {
          gridMeta.value.quotes = gridMeta.value.quotes.filter(
            (q) => q.uniqueid !== gridMeta.value.selectedQuoteId
          );
          toast.add({
            title: "Success",
            description: `Quote ${gridMeta.value.selectedQuoteId} deleted`,
            color: "green",
          });
          gridMeta.value.selectedQuoteId = null;
          fetchQuotes();
        },
        onResponseError() {
          toast.add({
            title: "Error",
            description: "Failed to delete quote",
            color: "red",
          });
        },
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Failed to delete quote",
        color: "red",
      });
    }
  }
};

const customerId = ref(null);

const viewQuote = async () => {
  if (gridMeta.value.selectedQuoteId) {
    await useApiFetch("/api/quotes/CustomerId", {
      method: "GET",
      params: { orderId: gridMeta.value.selectedQuoteId },
      onResponse({ response }) {
        customerId.value = response._data.body.customerid;
        modalMeta.value.isQuoteDetailModalOpen = true;
      },
      onResponseError() {
        toast.add({
          title: "Error",
          description: "Failed to view ",
          color: "red",
        });
      },
    });
  }
};

const handleExcelExport = async () => {
  exportIsLoading.value = true;
  try {
    const statusFilters = Object.entries(filters.value.statusFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const response = await useApiFetch("/api/quotes/excellshow", {
      method: "POST",
      body: {
        ...filters.value,
        statusFilters,
      },
      // Important: specify responseType as blob
      responseType: "blob",
      onResponse({ response }) {
        if (response.status === 200) {
          // Handle successful response
          const blob = new Blob([response._data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Quotes_${format(new Date(), "yyyy-MM-dd")}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          toast.add({
            title: "Success",
            description: "Export completed successfully",
            color: "green",
          });
        }
      },
      onResponseError({ response }) {
        console.error("Export error:", response);
        toast.add({
          title: "Error",
          description: "Failed to export data. Please try again.",
          color: "red",
        });
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    toast.add({
      title: "Error",
      description: "Failed to export data",
      color: "red",
    });
  } finally {
    exportIsLoading.value = false;
  }
};

const selectQuote = (quote) => {
  gridMeta.value.selectedQuoteId = quote.orderid;
  gridMeta.value.quotes.forEach((quotes) => {
    quotes.class = quotes.orderid === quote.orderid ? "bg-blue-100" : "";
  });
};

const handleFilterChange = () => {
  gridMeta.value.page = 1;
  fetchQuotes();
};

const debouncedFilterChange = debounce(() => {
  handleFilterChange();
}, 300);

const handlePageChange = () => {
  fetchQuotes();
};

const modalMeta = ref({
  isQuoteDetailModalOpen: false,
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <div class="gmsPurpleHeader text-xl text-white p-4">
        <h1 class="text-white">Customer Quote Lookup</h1>
      </div>

      <div
        class="px-4 py-2 gmsPurpleTitlebar text-white flex justify-between items-center"
      >
        <h2 class="text-md text-black font-semibold">Quotation</h2>

        <div>
          <UButton
            label="Export to Excel"
            icon="i-heroicons-document-text"
            variant="outline"
            :loading="exportIsLoading"
            :disabled="exportIsLoading"
            @click="handleExcelExport"
            color="green"
            :ui="{
              base: 'min-w-[150px] w-full bg-purple-500 text-white hover:bg-purple-600',
              truncate: 'flex justify-center w-full',
              loading: 'text-white',
            }"
          />
        </div>
      </div>
      <div class="bg-gray-100 p-4 flex items-center justify-between space-x-3">
        <div class="flex items-center space-x-3">
          <UCheckbox
            v-model="filters.statusFilters.quotePending"
            label="Quote Pending"
            @change="handleFilterChange"
          />
          <UCheckbox
            v-model="filters.statusFilters.open"
            label="Open"
            @change="handleFilterChange"
          />
          <UCheckbox
            v-model="filters.statusFilters.closed"
            label="Closed"
            @change="handleFilterChange"
          />
          <UCheckbox
            v-model="filters.statusFilters.orderPending"
            label="Order Pending"
            @change="handleFilterChange"
          />
          <UCheckbox
            v-model="filters.statusFilters.booked"
            label="Booked"
            @change="handleFilterChange"
          />
        </div>

        <div class="flex items-center space-x-3">
          <UCheckbox
            v-model="filters.filterDate"
            label="Filter Date:"
            @change="handleFilterChange"
          />

          <UInput
            v-model="filters.startDate"
            type="date"
            :disabled="!filters.filterDate"
            class="w-24"
            @change="handleFilterChange"
          />
          <span>To</span>
          <UInput
            v-model="filters.endDate"
            type="date"
            :disabled="!filters.filterDate"
            class="w-24"
            @change="handleFilterChange"
          />

          <span>Model</span>
          <UInput v-model="filters.model" placeholder="Model" class="w-24" />

          <div>
            <UButton
              label="Model Lookup"
              icon="i-heroicons-eye-20-solid"
              variant="outline"
              :ui="{
                base: 'min-w-[150px] w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="modelLookup"
            />
          </div>
        </div>
      </div>

      <div class="bg-white p-4 flex gap-1">
        <div
          v-for="column in columns.slice(0, 9)"
          :key="column.key"
          class="max-w-40 min-w-24"
        >
          <UInput
            v-if="!column.isDropdown"
            v-model="filters[column.key]"
            :placeholder="column.label"
            class="w-full"
            @input="debouncedFilterChange"
          />
          <USelect
            v-else
            v-model="filters[column.key]"
            :options="
              dropdownOptions[
                column.key === 'Source'
                  ? 'SourceList'
                  : column.key === 'sourcedescription'
                  ? 'sourcedescriptionList'
                  : column.key === 'productLine'
                  ? 'productLineList'
                  : []
              ]
            "
            :placeholder="column.label"
            class="w-full"
            @change="handleFilterChange"
          />
        </div>
      </div>

      <div class="px-4">
        <UTable
          :rows="gridMeta.quotes"
          :columns="columns"
          :loading="gridMeta.isLoading"
          @select="selectQuote"
          @dblclick="viewQuote"
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
        >
        </UTable>
      </div>

      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mt-1 me-4">
          <UPagination
            :max="7"
            :page-count="gridMeta.totalPages"
            :total="gridMeta.totalItems || 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange"
          />
        </div>
      </div>

      <div class="flex justify-between p-4">
        <div>
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            variant="outline"
            color="red"
            label="Delete Quote"
            :disabled="!gridMeta.selectedQuoteId"
            @click="deleteQuote"
            :ui="{
              base: 'min-w-[150px]',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>

        <div>
          <UButton
            label="View Quote"
            icon="i-heroicons-eye"
            variant="outline"
            :disabled="!gridMeta.selectedQuoteId"
            @click="viewQuote"
            color="green"
            :ui="{
              base: 'min-w-[150px] w-full bg-purple-500 text-white hover:bg-purple-600',
              truncate: 'flex justify-center w-full',
              loading: 'text-white',
            }"
          />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>

  <!-- Quote Modal -->
  <UDashboardModal
    v-model="modalMeta.isQuoteDetailModalOpen"
    title="Quote"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center gmsPurpleHeader',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-7xl',
    }"
  >
    <CustomersQuoteDetail
      :selected-customer="customerId"
      :selected-order="gridMeta.selectedQuoteId"
    />
  </UDashboardModal>
</template>
