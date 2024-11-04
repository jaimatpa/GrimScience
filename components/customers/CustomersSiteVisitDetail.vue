<script setup lang="ts">
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";
import CustomerList from "~/pages/customers/customers/list.vue";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedCustomer: {
    type: [Number, String, null],
    required: false,
  },
  siteVisitID: {
    type: [Number, String, null],
    required: false,
  },
});

console.log("props.visitID", props.siteVisitID);


const toast = useToast();
// const selectedCustomerId = ref(null);
const siteVisitID = ref(null);

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";
const markets = ref([]);
const professions = ref([]);
const states = ref([]);
const territories = ref([]);

const reasonList = ref([]);
const productLineList = ref([]);
const byList = ref([]);

const loadingOverlay = ref(false);

const statusGroup = ref([
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Close" },
]);

const filterValues = ref({
  market: null,
  source: null,
  territory: null,
  state: null,

  VisitDate: null,
  Reason: null,
  VisitNumber: null,
  ProductLine: null,
  By: null,
  Number: null,
  company1: null,
  city: null,
  status: null,
  openStatus: false,
  closedStatus: false,
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "VisitDate",
      label: "Date",
      sortable: true,
      filterable: true,
    },
    {
      key: "Reason",
      label: "Reason",
      sortable: true,
      filterable: true,
    },
    {
      key: "VisitNumber",
      label: "Visit #",
      sortable: true,
      filterable: true,
    },
    {
      key: "ProductLine",
      label: "ProductLine",
      sortable: true,
      filterable: true,
      filterOptions: [],
    },
    {
      key: "By",
      label: "By",
      sortable: true,
      filterable: true,
      filterOptions: [],
    },
    {
      key: "Number",
      label: "Customer #",
      sortable: true,
      filterable: true,
    },
    {
      key: "company1",
      label: "Company",
      sortable: true,
      filterable: true,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      filterable: true,
    },
    {
      key: "CState",
      label: "State",
    },
    {
      key: "Status",
      label: "Status",
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfCustomers: 0,
  customers: [],
  selectedCustomerId: props.selectedCustomer || null,
  isCustomerModalOpen: false,
  visitId: props.siteVisitID || null,
  sort: {
    column: "VisitNumber",
    direction: "asc",
  },
  isLoading: false,
});

const formData = reactive({
  CustomerID: gridMeta.value.selectedCustomerId || null,
  number: null,
  fname: null,
  lname: null,
  position: null,
  company1: null,
  company2: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  workphone: null,
  cellphone: null,
  email: null,
  VisitID: null,

  InvoiceNumber: null,
  QuoteNumber: null,
  ComplaintNumber: null,
  Comments: null,
  CreatedBy: null,
  CreatedDate: new Date(),

  Status: null,
  VisitNumber: null,
  VisitDate: new Date(),
  ProductLine: null,
  Reason: null,
  By: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);
const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const propsCustomerIdInit = async () => {
  gridMeta.value.selectedCustomerId =
    props.selectedCustomer || tblSiteCustomerId.value;
  tblSiteCustomerId.value = props.selectedCustomer;
  loadingOverlay.value = true;
  await useApiFetch(
    `/api/tbl/tblCustomers/${gridMeta.value.selectedCustomerId}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          loadingOverlay.value = false;
          for (const key in response._data.body) {
            if (response._data.body[key] !== undefined) {
              if (key === "state") {
                const stateValue = response._data.body[key];
                if (stateValue && !states.value.includes(stateValue)) {
                  states.value.push(stateValue);
                }
                formData.state = stateValue;
              } else {
                formData[key] = response._data.body[key];
              }
            }
          }
        }
      },
    }
  );
  loadingOverlay.value = false;
};

const loadStates = async (territory?: string) => {
  try {
    const queryParams = territory ? { territory } : {};
    await useApiFetch("/api/sitevisit/states", {
      method: "GET",
      params: queryParams,
      onResponse({ response }) {
        if (response.status === 200) {
          states.value = [null, ...response._data.body];
          const stateColumn = gridMeta.value.defaultColumns.find(
            (col) => col.key === "CState"
          );
          if (stateColumn) {
            stateColumn.filterOptions = response._data.body;
          }
        }
      },
    });
  } catch (error) {
    console.error("Error loading states:", error);
    states.value = [null];
  }
};

watch(
  () => filterValues.value.territory,
  async (newTerritory) => {
    await loadStates(newTerritory);
    filterValues.value.state = null;
  }
);

const propertiesInit = async () => {
  loadingOverlay.value = true;

  await useApiFetch("/api/customers/markets", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        markets.value = [null, ...response._data.body];
      }
    },
  });

  await useApiFetch("/api/customers/professions", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        professions.value = [null, ...response._data.body];
      }
    },
  });

  await loadStates();
  await useApiFetch("/api/customers/territories", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        territories.value = [null, ...response._data.body];
      }
    },
  });

  await useApiFetch("/api/sitevisit/siteVisitBy", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const byColumn = gridMeta.value.defaultColumns.find(
          (col) => col.key === "By"
        );
        if (byColumn) {
          byColumn.filterOptions = response._data.body;
          byList.value = response._data.body;
        }
      }
    },
  });

  await useApiFetch("/api/sitevisit/productLine", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const byColumn = gridMeta.value.defaultColumns.find(
          (col) => col.key === "ProductLine"
        );
        if (byColumn) {
          byColumn.filterOptions = response._data.body;
          productLineList.value = response._data.body;
        }
      }
    },
  });

  await useApiFetch("/api/sitevisit/reasonList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        reasonList.value = response._data.body;
      }
    },
  });

  loadingOverlay.value = false;
};

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/sitevisit/number", {
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
  await useApiFetch("/api/sitevisit/list", {
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

const handleSelectChange = () => {
  gridMeta.value.page = 1;
  fetchGridData();
};

const complaintsList = ref([]);
const invoicesList = ref([]);
const quotesList = ref([]);

const loadSiteVisitDetails = async () => {
  try {
    loadingOverlay.value = true;
    await useApiFetch(`/api/sitevisit/${gridMeta.value.visitId}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          const { siteVisit, relatedData } = response._data.body;
          for (const key in siteVisit) {
            if (siteVisit[key] !== undefined) {
              if (key === "state") {
                const stateValue = siteVisit[key];
                if (stateValue && !states.value.includes(stateValue)) {
                  states.value.push(stateValue);
                }
                formData.state = stateValue;
              } else {
                formData[key] = siteVisit[key];
              }
            }
          }
          complaintsList.value = relatedData.complaints || [];
          invoicesList.value = relatedData.invoices || [];
          quotesList.value = relatedData.quotes || [];
        }
      },
    });
  } catch (error) {
    console.error("Error loading site visit details:", error);
  } finally {
    loadingOverlay.value = false;
  }
};

const getComments = async (customerID) => {
  try {
    loadingOverlay.value = true;
    await useApiFetch(`/api/sitevisit/comments/${customerID}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          const { relatedData } = response._data.body;
          complaintsList.value = relatedData.complaints || [];
          invoicesList.value = relatedData.invoices || [];
          quotesList.value = relatedData.quotes || [];
        }
      },
    });
  } catch (error) {
    console.error("Error loading site visit details:", error);
  } finally {
    loadingOverlay.value = false;
  }
};

const tblSiteCustomerId = ref(null);

const handleSelectVisitSite = (row) => {
  gridMeta.value.visitId = row.VisitID;
  formData.CustomerID = row.Number;
  tblSiteCustomerId.value = row.CustomerID;
  loadSiteVisitDetails();
};

const onCustomerSelect = async () => {
  gridMeta.value.isCustomerModalOpen = true;
};

const handleSelected = (selectedValue: string) => {
  clearForm();
  gridMeta.value.isCustomerModalOpen = false;
  tblSiteCustomerId.value = selectedValue.UniqueID;
  propsCustomerIdInit();
  getComments(selectedValue.UniqueID);
};

const handlePageChange = async () => {
  fetchGridData();
};

const handleStatusChange = () => {
  gridMeta.value.page = 1;

  if (filterValues.value.openStatus && filterValues.value.closedStatus) {
    filterValues.value.status = "both";
  } else if (filterValues.value.openStatus) {
    filterValues.value.status = "Open";
  } else if (filterValues.value.closedStatus) {
    filterValues.value.status = "Closed";
  } else {
    filterValues.value.status = null;
  }
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
            gridMeta.value.sort.column = "VisitDate";
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

const onSubmit = async () => {
  if (!tblSiteCustomerId.value) {
    const toast = useToast();
    toast.add({
      id: "customer-required",
      title: "Customer Required",
      description: "Please select a customer to save this site visit",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  loadingOverlay.value = true;
  try {
    await useApiFetch("/api/sitevisit/AddUpdate", {
      method: "POST",
      body: {
        visitId: formData.VisitID,
        Status: formData.Status,
        VisitDate: formData.VisitDate,
        Reason: formData.Reason,
        bye: formData.By,
        ProductLine: formData.ProductLine,
        ComplaintNumber: formData.ComplaintNumber,
        InvoiceNumber: formData.InvoiceNumber,
        QuoteNumber: formData.QuoteNumber,
        Comments: formData.Comments,
        CustomerID: tblSiteCustomerId.value,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          const toast = useToast();
          toast.add({
            title: "Success",
            description: "Site visit saved successfully",
            color: "green",
            icon: "i-heroicons-check-circle",
          });

          fetchGridData();
        }
      },
    });
  } catch (error) {
    console.error("Error saving site visit:", error);
    toast.add({
      title: "Error",
      description: "Error saving site visit",
      color: "red",
      icon: "i-heroicons-x-circle",
      timeout: 3000,
    });
  } finally {
    loadingOverlay.value = false;
  }
};

const handleDelete = async () => {
  if (
    !confirm(
      'Are you sure you want to delete this Site Visit? This is difficult to recover", "Delete Confirm"'
    )
  ) {
    return;
  }

  loadingOverlay.value = true;
  try {
    await useApiFetch("/api/sitevisit/delete", {
      method: "POST",
      body: {
        visitId: formData.VisitID,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          const toast = useToast();
          toast.add({
            title: "Success",
            description: "Site visit deleted successfully",
            color: "green",
            icon: "i-heroicons-check-circle",
          });
          clearForm();
          fetchGridData();
        }
      },
    });
  } catch (error) {
    console.error("Error deleting site visit:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Error deleting site visit",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    loadingOverlay.value = false;
  }
};

const clearForm = () => {
  tblSiteCustomerId.value = null;
  complaintsList.value = [];
  invoicesList.value = [];
  quotesList.value = [];
  Object.assign(formData, {
    ...Object.fromEntries(Object.keys(formData).map((key) => [key, null])),
    CreatedDate: new Date(),
    VisitDate: new Date(),
    Status: "Open",
  });
};

const exportIsLoading = ref(false);
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
  location.href = `/api/sitevisit/exportList?${paramsString}`;
  exportIsLoading.value = false;
};

const onPreviewHandle = async () => {
  if (!gridMeta.value.visitId) {
    const toast = useToast();
    toast.add({
      id: "customer-required",
      title: "Customer Required",
      description: "Please select a customer to preview.",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  if (gridMeta.value.visitId) {
    const pdfUrl = `/api/sitevisit/preview/${gridMeta.value.visitId}`;
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
      const blob = await response.blob();
      const pdfContentUrl = URL.createObjectURL(blob);
      window.open(pdfContentUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert("Error fetching the PDF. Please try again later.");
    }
  } else {
    alert("Please select a customer to preview.");
  }
};

if (props.selectedCustomer) {
  propsCustomerIdInit();
  propertiesInit();
  fetchGridData();
} else {
  propertiesInit();
  fetchGridData();
}

if (props.siteVisitID && props.selectedCustomer) {
  loadSiteVisitDetails();
}
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :state="formData" @submit="onSubmit">
    <div class="flex flex-col">
      <div class="w-full">
        <div class="flex justify-between px-4 py-2 gmsPurpleTitlebar">
          <h2 class="flex items-center">Sort</h2>
        </div>
        <div class="flex flex-row justify-between w-full p-3">
          <div class="flex flex-row space-x-2 w-1/2">
            <div class="basis-1/4">
              <UFormGroup label="Market" name="market">
                <USelect v-model="filterValues.market" :options="markets" @change="handleSelectChange" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Profession" name="profession">
                <USelect v-model="filterValues.source" :options="professions" @change="handleSelectChange" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Territory" name="territory">
                <USelect v-model="filterValues.territory" :options="territories" @change="handleSelectChange" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="State" name="state">
                <USelect v-model="filterValues.state" :options="states" @change="handleSelectChange" />
              </UFormGroup>
            </div>
          </div>
          <div class="w-1/4 flex justify-end items-end">
            <div class="basis-3/4">
              <UButton color="green" variant="outline" label="Export to Excel" icon="i-heroicons-document-text"
                :loading="exportIsLoading" @click="excelExport" block />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="flex justify-between px-4 py-2 gmsPurpleTitlebar">
          <h2 class="flex items-center">Lookup</h2>
        </div>
        <div class="w-full px-3 py-1 flex flex-col space-y-2">
          <div class="flex flex-row space-x-5 justify-end">
            <UCheckbox v-model="filterValues.openStatus" label="Open" @change="handleStatusChange" />
            <UCheckbox v-model="filterValues.closedStatus" label="Closed" @change="handleStatusChange" />
          </div>
          <div>
            <UTable :rows="gridMeta.customers" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
              wrapper:
                'h-80 overflow-y-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
              divide: 'divide-gray-200 dark:divide-gray-800',
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'p-0',
              },
              td: {
                padding: 'py-1',
              },
            }" :empty-state="{
              icon: 'i-heroicons-circle-stack-20-solid',
              label: 'No items.',
            }" @select="handleSelectVisitSite" @dblclick="">
              <template v-for="column in columns" :key="column.key" v-slot:[`${column.key}-header`]>
                <template v-if="!column.filterOptions">
                  <div class="px-1 py-1">
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

                <template v-else>
                  <div class="px-1 py-1">
                    <CommonSortAndSelectFilter @handle-sorting-button="handleSortingButton" @handle-select-change="(value) => handleFilterInputChange(value, column.key)
                      " :label="column.label" :sortable="column.sortable" :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
                        ? noneIcon
                        : column?.sortDirection === 'asc'
                          ? ascIcon
                          : descIcon
                        " :filterable="column.filterable" :filter-key="column.key"
                      :filter-options="column.filterOptions" :model-value="filterValues[column.key]" />
                  </div>
                </template>
              </template>

              <template v-slot:[`VisitDate-data`]="{ row }">
                {{ format(new Date(row.VisitDate), "MM/dd/yyyy") }}
              </template>
            </UTable>

            <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
              <div class="flex flex-row justify-end mt-1">
                <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfCustomers || 0"
                  v-model="gridMeta.page" @update:model-value="handlePageChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row space-x-5 w-full px-3 py-1">
      <div class="w-1/3">
        <div class="flex justify-between p-2 gmsPurpleTitlebar">
          <h2 class="flex items-center">Site Visit</h2>
        </div>
        <div class="flex flex-col space-y-3 p-2">
          <div class="flex flex-row space-x-5">
            <URadio v-for="status of statusGroup" :key="status.value" v-model="formData.Status" v-bind="status" />
          </div>

          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Visit#">
                <UInput v-model="formData.VisitNumber" disabled />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Date">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.VisitDate, 'MM/dd/yyyy')"
                    variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.VisitDate" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Reason">
                <USelect v-model="formData.Reason" :options="reasonList" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="By">
                <USelect v-model="formData.By" :options="byList" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Product Line">
                <USelect v-model="formData.ProductLine" :options="productLineList" />
              </UFormGroup>
            </div>

            <div class="basis-1/2"></div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline" @click="onSubmit" />
            <UButton icon="i-heroicons-eye" label="Preview" variant="outline" @click="onPreviewHandle" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UButton icon="i-f7-rays" label="Clear" color="red" variant="outline" @click="clearForm" />
            <UButton icon="i-heroicons-minus-circle" label="Delete" color="red" @click="handleDelete"
              variant="outline" />
          </div>
        </div>
      </div>

      <div class="w-1/3">
        <div class="flex justify-between p-2 gmsPurpleTitlebar">
          <h2 class="flex items-center">Location</h2>
        </div>
        <div class="flex flex-col space-y-1 p-2">
          <div class="grid grid-cols-2 gap-2">
            <div class="">
              <UFormGroup label="Customer#">
                <UInput v-model="formData.number" disabled />
              </UFormGroup>
            </div>
            <div class="self-end">
              <UButton class="px-0 w-full" icon="i-heroicons-cursor-arrow-ripple" label="Select/View Customer"
                variant="outline" @click="onCustomerSelect" />
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="First">
                <UInput v-model="formData.fname" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Last">
                <UInput v-model="formData.lname" />
              </UFormGroup>
            </div>
          </div>

          <div class="w-full">
            <UFormGroup label="Position">
              <UInput v-model="formData.position" />
            </UFormGroup>
          </div>
          <div class="w-full">
            <UFormGroup label="Company 1">
              <UInput v-model="formData.company1" />
            </UFormGroup>
          </div>
          <div class="w-full">
            <UFormGroup label="Company 2">
              <UInput v-model="formData.company2" />
            </UFormGroup>
          </div>

          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Address">
                <UInput v-model="formData.address" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="E-mail">
                <UInput v-model="formData.email" />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="City">
                <UInput v-model="formData.city" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="State">
                <USelect v-model="formData.state" :options="states" :clearable="true" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Zip">
                <UInput v-model="formData.zip" />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Work">
                <UInput v-model="formData.workphone" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Cell">
                <UInput v-model="formData.cellphone" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/3">
        <div class="flex justify-between p-2 gmsPurpleTitlebar">
          <h2 class="flex items-center">Comments</h2>
        </div>
        <div class="flex flex-col space-y-2 p-2">
          <div class="flex flex-row space-x-2">
            <div class="basis-1/3">
              <UFormGroup label="Invoice #">
                <USelect v-model="formData.InvoiceNumber" :options="invoicesList" />
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Quote #">
                <USelect v-model="formData.QuoteNumber" :options="quotesList" />
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Complain #">
                <USelect v-model="formData.ComplaintNumber" :options="complaintsList" />
              </UFormGroup>
            </div>
          </div>
          <UTextarea :rows="8" v-model="formData.Comments" />

          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup label="Created By">
                <UInput placeholder="#41 Leith Stetson" v-model="formData.CreatedBy" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Date">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.CreatedDate, 'MM/dd/yyyy')"
                    variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.CreatedDate" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UForm>
  <!-- Open Customer Modal -->
  <UDashboardModal v-model="gridMeta.isCustomerModalOpen" title="Customer List" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1250px]',
  }">
    <CustomerList @select="handleSelected" @close="gridMeta.isCustomerModalOpen = false" :is-modal="true" />
  </UDashboardModal>
</template>
