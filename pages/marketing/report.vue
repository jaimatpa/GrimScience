<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import Loading from 'vue-loading-overlay'
import { format } from "date-fns";

onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Marketing Reoport ",
});

const route = useRoute();
const toast = useToast();

const sourceOptions = ref([])
const sourceDOptions = ref([])
const saleOptions = ref(["Quotes","Bookings","Sales","Warranty"]);
const saleFilter = ref('Bookings')
const total = ref(0);
const units = ref(0);
const startDate = ref(new Date(new Date().getFullYear()+'-01-01'));
const endDate = ref(new Date());

const headerFilters = ref({
  productline: {
    label: "Product Line",
    filter: "productline",
    type: "dropdown",
    options: [],
  },
  model: {
    label: "Model",
    filter: "model",
    type: "input",
  },
  market: {
    label: "Market",
    filter: "market",
    type: "dropdown",
    options: [],
  },
  profession: {
    label: "Profession",
    filter: "profession",
    type: "dropdown",
    options: [],
  },
  category: {
    label: "Category",
    filter: "category",
    type: "dropdown",
    options: [],
  },
  confrence: {
    label: "Confrence",
    filter: "confrence",
    type: "dropdown",
    options: [],
  },
  state: {
    label: "State",
    filter: "state",
    type: "dropdown",
    options: [],
  },
  zip: {
    label: "Zip",
    filter: "zip",
    type: "input",
  },

});


const loadingOverlay = ref(false);

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    
    {
      key: "Quote Date",
      label: "Quote Date",
      filterable: true,
    },
    {
      key: "orderdate",
      label: "Order Date",
      filterable: true,
    },
    {
      key: "shipdate",
      label: "Ship Date",
      filterable: true,
    },
    {
      key: "number",
      label: "Cust#",
      filterable: true,
    },
    {
      key: "QuoteOrderNumber",
      label: "Quote#",

      filterable: true,
    },
    {
      key: "invoicenumber",
      label: "Invoice#",
      filterable: true,
    },
    {
      key: "source",
      label: "Source",

    },
    {
      key: "sourcedescription",
      label: "Source Description",

    },

    {
      key: "SOLD",
      label: "Amount",

    },
  ],
  page: 1,
  pageSize: 50,
  numberOfProducts: 0,
  products: [],
  selectedCustomerId: null,
  selectedOrderId: null,
  selectProduct: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const modalMeta = ref({
  modalTitle: "New Product",
  modalDescription: "Create new product",
  isOrderDetailModalOpen: false
});

const filterValues = ref({

  tableFilters:{
    orderdate: '',
    shipdate: '',
    number: '',
    QuoteOrderNumber: '',
    invoicenumber: '',
    source: '',
    sourcedescription: '',
  },

  productline: null,
  model: null,
  market: null,
  profession: null,
  category: null,
  confrence: null,
  state: null,
  zip: null,
  source: null,
  sourceDescription: null,
  sale:'Bookings'

});

watch([startDate, endDate], () => {
  fetchGridData();  // Fetch data whenever either startDate or endDate changes
});

watch(() => filterValues.value.source, async (newSource) => {
  if (newSource) {
    await getSourceDescription(newSource);
  }
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
    if(headerFilters.value[key].type === "dropdown" ){
      const apiURL = headerFilters.value[key]?.api ?? `/api/salesreport/${key}`;
      await useApiFetch(apiURL, {
        method: "GET",
        onResponse({ response }) {
          if (response.status === 200) {
            headerFilters.value[key].options = [null, ...response._data.body];
          }
        },
      });
    }
  }

  await useApiFetch('/api/salesreport/source', {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        sourceOptions.value = [null, ...response._data.body];
      }
    },
  });

};

const getSourceDescription = async (source) => {
  await useApiFetch('/api/salesreport/sourceDescription', {
    method: "GET",
    params:{ source },
    onResponse({ response }) {
      if (response.status === 200) {
        sourceDOptions.value = [null, ...response._data.body];
      }
    },
  });
}

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  await useApiFetch("/api/salesreport/", {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      filterValues: JSON.stringify(filterValues.value),
      startDate: startDate.value,
      endDate: endDate.value
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfProducts = response._data.body.totalReports;
        gridMeta.value.products = response._data.body.results;
        total.value = response._data.body.total;
        units.value = response._data.body.units;

      }
      gridMeta.value.isLoading = false;
    },
  });
  
  if (gridMeta.value.numberOfProducts === 0) {
    gridMeta.value.products = [];
    gridMeta.value.numberOfProducts = 0;
    gridMeta.value.isLoading = false;
    return;
  }

  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfProducts
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfProducts / gridMeta.value.pageSize) | 1;
  }
};





const onSelect = async (row) => {
  gridMeta.value.selectProduct = row
  gridMeta.value.selectedCustomerId = row?.number
  gridMeta.value.selectedOrderId = row?.OrderID
  gridMeta.value.products.forEach((pro) => {
    if (pro.MODEL === row.MODEL) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });
};

const customerId = ref(null);

const viewQuote = async () => {
    await useApiFetch("/api/quotes/CustomerId", {
      method: "GET",
      params: { orderId: gridMeta.value.selectedOrderId },
      onResponse({ response }) {
        customerId.value = response._data.body.customerid;
        modalMeta.value.isOrderDetailModalOpen = true;
      },
      onResponseError() {
        toast.add({
          title: "Error",
          description: "No customer found!",
          color: "red",
        });
      },
    });
};

const onDblClick = async () => {
  if (gridMeta.value.selectProduct) {
    // modalMeta.value.isOrderDetailModalOpen = true;
    await viewQuote()
  }
};

const handlePageChange = async () => {
  fetchGridData();
};

const handleFilterChange = () => {
  gridMeta.value.page = 1;
  fetchGridData();
};

const handleFilterTxtChange = (event) => {
  filterValues.value[event.target.name] = event.target.value
  gridMeta.value.page = 1;
  fetchGridData();
};


const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1;
  if (filterValues.value.tableFilters.hasOwnProperty(name)) {
    filterValues.value.tableFilters[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchGridData();
};

const excelExport = () => {
  loadingOverlay.value = true;
  const params = {
    filterValues: JSON.stringify(filterValues.value),
    startDate: startDate.value,
    endDate: endDate.value
  }
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      if (value !== null) return `${key}=${value}`;
    })
    .join("&");
  location.href = `/api/salesreport/exportlist?${paramsString}`;
  loadingOverlay.value = false;
}

const handleModalClose = () => {
  modalMeta.value.isOrderDetailModalOpen = false;
};


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

      <UDashboardNavbar
        class="gmsPurpleHeader"
        title="Sales Reporting"
      >
      </UDashboardNavbar>

      <!-- {{ isPage }} -->
      <div class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex flex-row space-x-3">
            <template
              v-for="[key, value] in Object.entries(headerFilters)"
              :key="key"
            >
              <div class="basis-1/7 min-w-[140px] max-w-[140px]">
                <UFormGroup v-if="value.type == 'dropdown'" :label="value.label" :name="key">
                  <USelect
                    v-model="filterValues[`${value.filter}`]"
                    :options="value.options"
                    @change="handleFilterChange()"
                  />
                </UFormGroup>
                <UFormGroup v-else
                  :label="value.label" 
                  :name="key"
                  
                >
                  <UInput
                    :name="key"
                    v-model="filterValues[`${value.filter}`]"
                    @input="handleFilterTxtChange"
                  />
                </UFormGroup>
              </div>
            </template>
          </div>
        </template>

      </UDashboardToolbar>

      <UDashboardToolbar class="bg-gms-gray-100">
        <div class="flex  justify-center w-full space-x-3">
          <UFormGroup class="min-w-[140px] max-w-[140px]"
          label="Source" name="Source">
            <USelect
              :options="sourceOptions"
              v-model="filterValues.source"
              @change="handleFilterChange()"
            />
          </UFormGroup>
          
          <UFormGroup class="min-w-[140px] max-w-[140px]"
            label="Source Description" name="Source">
            <USelect
              :options="sourceDOptions"
              v-model="filterValues.sourceDescription"
              @change="handleFilterChange()"
            />
          </UFormGroup>
        </div>
      </UDashboardToolbar>

      <div class="px-4 py-2 gmsPurpleTitlebar">
        Sale Lookup
      </div>

      <UDashboardToolbar class="bg-gms-gray-100">
   
          <UFormGroup class="min-w-[130px] max-w-[130px]"
           name="sale">
            <USelect
              :options="saleOptions"
              v-model="filterValues.sale"
              @change="handleFilterChange()"
        
            />
          </UFormGroup>

      </UDashboardToolbar>

      <UTable
        :rows="gridMeta.products"
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
            <div class="">
              <CommonSortAndInputFilter
                @handle-input-change="handleFilterInputChange"
                :label="column.label"
                :filterable="column.filterable"
                :filter-key="column.key"
              />
            </div>
        </template>
      </UTable>

      <!-- v-if="props.isPage && activeTab === 'lookup'" -->
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div
          class="flex flex-row justify-end mr-20 mt-1"
        >
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfProducts | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>

      </div>
      <div class="flex w-full">
        <div class="w-[600px] border-r-4 border-[#1f1c1c]">
          <div class="px-4 py-2 gmsBlueTitlebar">
            <h2>Date Range Lookup</h2>
          </div>
          <div class="px-5 py-2 bg-gms-gray-100">
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
              <UButton color="primary" variant="solid" @click="fetchGridData">
                Lookup
              </UButton>
            </div>
          </div>
        </div>
        <div class="w-2/3">
          <div class="px-4 py-2 gmsBlueTitlebar">
            <h2>Total From Search</h2>
          </div>
          <div class="px-5 py-2 bg-gms-gray-100">
            <div class="flex items-center gap-5">
              <div class="flex items-center gap-1">
                <p>{{'$'+total}}</p>
              </div>
              <div class="flex items-center gap-1">
                <p>Units</p>
                <input class="w-[80px] pl-2 focus:outline-none focus:ring-0" type="text" v-model="units">
              </div>
              <div class="flex items-center gap-1">
                <p>Average Unit Price</p>
                <input class="w-[80px] pl-2 focus:outline-none focus:ring-0" type="text" :value="'$'+( units ? total/units : 0).toFixed(2)">
              </div>
              <div class="flex items-center gap-1">
                <UButton color="green" variant="outline" :loading="exportIsLoading" label="Export to Excel"
                  trailing-icon="i-heroicons-document-text" @click="excelExport">
                </UButton>
              </div>
              
            </div>
          </div>
        </div>

        
      </div>
      
    </UDashboardPanel>
  </UDashboardPage>

  <!-- Order Modal -->
  <UDashboardModal v-model="modalMeta.isOrderDetailModalOpen" 
  title="Invoices" 
  :ui="{
      title: 'text-lg text-white',
      description: 'text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'container sm:max-w-9xl',
    }"
  >
    <InvoiceDetail :selected-customer="customerId.value"
      :selected-order="gridMeta.selectedOrderId" @close="handleModalClose" />
  </UDashboardModal>


</template>
<style scoped></style>
