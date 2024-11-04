<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import Loading from 'vue-loading-overlay'

onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Marketing Sales",
});

const route = useRoute();

const includeReadyRefs = ref(true);
const siteVisits = ref(true)
const serviceReport = ref(true)
const installations = ref(true)
const open = ref(true)
const closed = ref(false)

const customerId = ref(null)
const orderId = ref(null)
const visitId = ref(null)
const complaintId = ref(null)
const serviceReportId = ref(null)
const serialNo = ref(null)
const complaintNo = ref(null)

const siteVisitCount = ref(0)
const serviceReportsCount = ref(0)
const installationCount = ref(0)


const loadingOverlay = ref(false);

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    
    {
      key: "date",
      label: "Date",
      filterable: true,
    },
    {
      key: "customer",
      label: "Customer#",
      filterable: true,
    },
    {
      key: "company",
      label: "Company",
      filterable: true,
    },
    {
      key: "city",
      label: "City",
      filterable: true,
    },
    {
      key: "state",
      label: "State",

      filterable: true,
    },
    {
      key: "by",
      label: "By",
      filterable: true,
    },
    {
      key: "siteVisit",
      label: "Site Visit#",
      filterable: true,
    },
    {
      key: "complaint",
      label: "Compaint#",
      filterable: true,
    },
    {
      key: "serviceReport",
      label: "Service Report#",
      filterable: true,
    },
    {
      key: "installation",
      label: "Installation#",
      filterable: true,
    },
    {
      key: "status",
      label: "Status",
    },

  ],
  page: 1,
  pageSize: 50,
  numberOfSales: 0,
  sales: [],
  selectedSaleId: null,
  selectSale: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const modalMeta = ref({
  isOrderDetailModalOpen:false,
  isServiceOrderModalOpen:false,
  isSiteVisitModalOpen:false,
});

const filterValues = ref({

  tableFilters:{
    date: null, //t1
    customer: null, //t2
    company: null, //t3
    city: null, //t4
    state: null, //t5
    by: null, //t6
    siteVisit: null, //t7
    complaint: null, //t8
    serviceReport: null, //t9
    installation: null, //t10
  },

  includeReadyRefs: includeReadyRefs.value,
  siteVisits: siteVisits.value,
  serviceReport: serviceReport.value,
  installations: installations.value,
  open: open.value,
  closed: closed.value,
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
};

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  await useApiFetch("/api/fieldsales/", {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      filterValues: JSON.stringify(filterValues.value),
    },
    onResponse({ response }) {
      if (response.status === 200) {
        // gridMeta.value.numberOfSales = response._data.body.totalSales;
        gridMeta.value.sales = [...response._data.body.siteVisitResults, ...response._data.body.serviceReportResults, ...response._data.body.installationResults];
        siteVisitCount.value = response._data.body.siteVisitCount
        serviceReportsCount.value = response._data.body.serviceReportsCount
        installationCount.value = response._data.body.installationCount

      }
      gridMeta.value.isLoading = false;
    },
  });
  
};

const onSelect = async (row) => {
  gridMeta.value.selectSale = row
  gridMeta.value.selectedSaleId = row?.number
  customerId.value = row?.customerId || null
  orderId.value = row?.orderId || null
  visitId.value = row?.visitId || null
  serviceReportId.value = row?.serviceReportId || null
  complaintId.value = row?.complaintId || null
  serialNo.value = row?.serialNo || null
  complaintNo.value = row?.complaint
  gridMeta.value.sales.forEach((pro) => {
    if (pro.id === row.id) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });
};

const onDblClick = async () => {
  if (gridMeta.value.selectSale) {
    if(gridMeta.value.selectSale.siteVisit){
      modalMeta.value.isSiteVisitModalOpen = true
    }else if(gridMeta.value.selectSale.serviceReport){
      modalMeta.value.isServiceOrderModalOpen = true
    }else if(gridMeta.value.selectSale.installation){
      modalMeta.value.isOrderDetailModalOpen = true;
    }
  }
};

const handleHeaderCheckboxChange = () => {
  filterValues.value.includeReadyRefs = includeReadyRefs.value,
  filterValues.value.siteVisits= siteVisits.value,
  filterValues.value.serviceReport= serviceReport.value,
  filterValues.value.installations= installations.value,
  filterValues.value.open= open.value,
  filterValues.value.closed= closed.value,
  gridMeta.value.page = 1;
  fetchGridData()
}

const handleFilterInputChange = async (event, name) => {
  console.log(event,name)
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
  }
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      if (value !== null) return `${key}=${value}`;
    })
    .join("&");
  location.href = `/api/fieldsales/exportlist?${paramsString}`;
  loadingOverlay.value = false;
}

const handleInvoiceModalClose = () => {
  modalMeta.value.isOrderDetailModalOpen = false;
};

const handleServiceReportClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false;
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
        title="Field Sales and Service"
      >
      </UDashboardNavbar>

      <!-- {{ isPage }} -->


      <div class=" flex justify-between px-4 py-2 gmsPurpleTitlebar">
        Lookup

        <div class="flex items-center gap-1">
          <UButton color="green" variant="outline" :loading="exportIsLoading" label="Export to Excel"
            trailing-icon="i-heroicons-document-text" @click="excelExport">
          </UButton>
        </div>
      </div>

      <UDashboardToolbar class="bg-gms-gray-100">
        <template #right>
        
          <div class="flex flex-row pt-4">
              <div class="">
                <p>Include Ready Refs:</p>
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="includeReadyRefs"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-20">
                <UCheckbox
                  v-model="siteVisits"
                  label="Site Visits"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="serviceReport"
                  label="Service Reports"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="installations"
                  label="Installations"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="open"
                  label="Open"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
              <div class="ml-5">
                <UCheckbox
                  v-model="closed"
                  label="Closed"
                  @update:model-value="handleHeaderCheckboxChange"
                />
              </div>
          </div>
        </template>
          

      </UDashboardToolbar>

      <UTable
        :rows="gridMeta.sales"
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

      <UDashboardToolbar class="bg-gms-gray-100">
        <template #right>
        
          <div class="flex flex-row pt-4">
              <div class="pt-6">
                <p>Quantitties:</p>
              </div>
              <div class="ml-5">
                <p>Site Visits</p>
                <input class="w-[160px] bg-white pl-2 focus:outline-none focus:ring-0" disabled type="text" v-model="siteVisitCount" >
              </div>
              <div class="ml-5">
                <p>Service Reports</p>
                <input class="w-[160px] bg-white pl-2 focus:outline-none focus:ring-0" disabled type="text" v-model="serviceReportsCount" >
              </div>
              <div class="ml-5">
                <p>Installations</p>
                <input class="w-[160px] bg-white pl-2 focus:outline-none focus:ring-0" disabled type="text" v-model="installationCount" >
              </div>
          </div>
        </template>
          

      </UDashboardToolbar>

      
    </UDashboardPanel>
  </UDashboardPage>

  <!-- Invoice Modal -->
  <UDashboardModal 
  v-model="modalMeta.isOrderDetailModalOpen" 
  title="Invoice" 
  :ui="{
      title: 'text-lg text-white',
      description: 'text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1800px] sm:max-w-9xl',
    }"
  >
    <InvoiceDetail :selected-customer="customerId"
      :selected-order="orderId" @close="handleInvoiceModalClose" />
  </UDashboardModal>

  <!-- Service Order -->
  <UDashboardModal v-model="modalMeta.isServiceOrderModalOpen" title="Service Order" :ui="{
    title: 'text-lg text-white',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
    },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">
    <ServiceOrderDetail @close="handleServiceReportClose" :form-action="null"
       :selected-customer="customerId"
       :selected-serial="serialNo"
      :selected-complaint="complaintNo" :selected-order="orderId" />
  </UDashboardModal>

  <!-- Site Visit -->
  <UDashboardModal 
    v-model="modalMeta.isSiteVisitModalOpen" 
    title="Site Visits" 
    :ui="{
    title: 'text-lg text-white',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
    },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }">

    <CustomersSiteVisitDetail :selectedCustomer="customerId" :siteVisitID="visitId" />
  </UDashboardModal>


</template>
<style scoped></style>
