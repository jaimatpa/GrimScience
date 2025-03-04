<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";
import { format } from "date-fns";
import VendorInvoice from "../vendors/VendorInvoice.vue";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  isPage: {
    type: Boolean,
    required: false,
    default: true,
  },
  selectedOrder: {
    type: [Number, String, null],
  },
});

const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";
const loadingOverlay = ref(false);
const formData = reactive({
  transactionID: null,
  By: null,
  Dated: null,
  Justification: null,
});
const inventoryFilterValues = ref({
  Dated: null,
  By: null,
  uniqueid: null,
  JobID: null,
  COMPLAINTNUMBER: null,
  ServiceReportID: null,
  InvoiceID: null,
  PONumber: null,
  VendorInvoiceID: null,
});
const productFilterValues = ref({
  PARTTYPE: null,
  SUBCATEGORY: null,
  MODEL: null,
  DESCRIPTION: null,
});
const inventoryDetailFilterValues = ref({
  MODEL: null,
});
const inventoryGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Dated",
      label: "Date",
      filterable: true,
    },
    {
      key: "By",
      label: "By",
      filterable: true,
    },
    {
      key: "uniqueid",
      label: "#",
      filterable: true,
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "JobID",
      label: "Job#",
      filterable: true,
    },
    {
      key: "COMPLAINTNUMBER",
      label: "Complaint#",
      filterable: true,
    },
    {
      key: "ServiceReportID",
      label: "Service Report#",
      filterable: true,
    },
    {
      key: "InvoiceID",
      label: "Invoice#",
      filterable: true,
    },
    {
      key: "PONumber",
      label: "PO#",
      filterable: true,
    },
    {
      key: "VendorInvoiceID",
      label: "Vendor Invoice#",
      filterable: true,
    },
  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  inventories: [],
  selectedInventory: null,
  isLoading: false,
});
const productGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "PARTTYPE",
      label: "Category",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "SUBCATEGORY",
      label: "Sub Category",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "MODEL",
      label: "Stock#",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      filterable: true,
    },
    {
      key: "OnHand",
      label: "Current On Hand",
    },
  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  products: [],
  selectedProduct: null,
  isLoading: false,
});
const inventoryDetailGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "MODEL",
      label: "Stock#",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Desc.",
    },
    {
      key: "UNIT",
      label: "Inv.Unit",
    },
    {
      key: "QtyChange",
      label: "Adjustment",
    },
    {
      key: "OnHand",
      label: "Hand Count",
    },
  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  details: [],
  selectedDetail: null,
  isLoading: false,
});
const isAddPartsModalOpen = ref(false);
const isServiceReportModalOpen = ref(false);
const isJobModalOpen = ref(false);
const isVendorInvoiceModalOpen = ref(false);
const isInvoiceModalOpen = ref(false);
const selectedServiceReportID = ref(null);
const selectedJobID = ref(null);
const selectedVendorInvoiceID = ref(null);
const selectedPoNumber = ref(null);
const selectedInvoiceID = ref(null);
const updatedHand = ref(0.0);

const editInit = async () => {
  loadingOverlay.value = true;
  await inventoryFetchGridData();
  await productFetchGridData();
  await inventoryDetailFetchGridData();
  loadingOverlay.value = false;
};
const propertiesInit = async () => {
  // loadingOverlay.value = true
  // loadingOverlay.value = false
};
const inventoryFetchGridData = async () => {
  await useApiFetch(`/api/materials/inventorytransactions`, {
    method: "GET",
    params: { ...inventoryFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        inventoryGridMeta.value.inventories = response._data.body;
      }
    },
  });
};
const productFetchGridData = async () => {
  await useApiFetch(`/api/materials/parts`, {
    method: "GET",
    params: { ...productFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        productGridMeta.value.products = response._data.body;
      }
    },
  });
  await useApiFetch(`/api/materials/categories`, {
    method: "GET",
    params: { partflag: 1 },
    onResponse({ response }) {
      if (response.status === 200) {
        productGridMeta.value.defaultColumns.forEach((column: any) => {
          if (column.key === "PARTTYPE")
            column.filterOptions = [null, ...response._data.body];
        });
      }
    },
  });
  await useApiFetch(`/api/materials/subcategories`, {
    method: "GET",
    params: { category: productFilterValues.value.PARTTYPE, partflag: 1 },
    onResponse({ response }) {
      if (response.status === 200) {
        productGridMeta.value.defaultColumns.forEach((column: any) => {
          if (column.key === "SUBCATEGORY")
            column.filterOptions = [null, ...response._data.body];
        });
      }
    },
  });
};
const inventoryDetailFetchGridData = async () => {
  inventoryGridMeta.value.selectedInventory &&
    (await useApiFetch(
      `/api/materials/inventorytransactions/${inventoryGridMeta.value.selectedInventory.uniqueid}`,
      {
        method: "GET",
        params: { ...inventoryDetailFilterValues.value },
        onResponse({ response }) {
          if (response.status === 200) {
            inventoryDetailGridMeta.value.details = response._data.body;
          }
        },
      }
    ));
};
const onInventorySelect = async (row) => {
  // console.log('Row :' , row)
  inventoryGridMeta.value.selectedInventory = row;
  inventoryGridMeta.value.inventories.forEach((product) => {
    if (product.uniqueid === row.uniqueid) {
      product.class = "bg-gray-200";
    } else {
      delete product.class;
    }
  });
  formData.transactionID = row.uniqueid;
  formData.By = row.By;
  formData.Dated = new Date(row.Dated);
  formData.Justification = row.Justification;
  inventoryDetailFetchGridData();
};
const onInventoryDblClick = async () => {
  if (inventoryGridMeta.value.selectedInventory) {
    let data = inventoryGridMeta.value.selectedInventory;

    if (data.ServiceReportID > 0) {
      selectedServiceReportID.value = data.ServiceReportID;
      isServiceReportModalOpen.value = true;
    } else if (data.JobUniqueID > 0) {
      selectedJobID.value = data.JobUniqueID;
      isJobModalOpen.value = true;
    } else if (data.JobUniqueID > 0) {
      selectedJobID.value = data.JobUniqueID;
      isJobModalOpen.value = true;
    } else if (data.VendorInvoiceID > 0) {
      selectedVendorInvoiceID.value = data.VendorInvoiceID;
      selectedPoNumber.value = data.PONumber;
      isVendorInvoiceModalOpen.value = true;
    } else if (data.InvoiceID > 0) {
      selectedInvoiceID.value = data.InvoiceID;
      isInvoiceModalOpen.value = true;
    }
  }
};
const onProductSelect = async (row) => {
  productGridMeta.value.selectedProduct = row;
};
const onProductDblClick = async () => {
  if (inventoryGridMeta.value.selectedInventory) {
    isAddPartsModalOpen.value = true;
    updatedHand.value = productGridMeta.value.selectedProduct.OnHand;
  } else {
    toast.add({
      title: "",
      description: "Select inventory transaction.",
      icon: "i-heroicons-exclamation-triangle",
      color: "yellow",
    });
  }
};
const onInventoryDetailSelect = async (row) => {
  if (
    JSON.stringify({
      ...inventoryDetailGridMeta.value.selectedDetail,
      class: "",
    }) === JSON.stringify({ ...row, class: "" })
  )
    inventoryDetailGridMeta.value.selectedDetail = null;
  else {
    inventoryDetailGridMeta.value.selectedDetail = { ...row, class: "" };
  }
  inventoryDetailGridMeta.value.details.forEach((item) => {
    if (item.uniqueID === row.uniqueID && row.class != "bg-gray-200") {
      item.class = "bg-gray-200";
    } else {
      delete item.class;
    }
  });
};
const handleInventorySortingButton = async (btnName: string) => {
  for (const column of inventoryGridMeta.value.defaultColumns) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case "none":
            column.sortDirection = "asc";
            inventoryGridMeta.value.sort.column = btnName;
            inventoryGridMeta.value.sort.direction = "asc";
            break;
          case "asc":
            column.sortDirection = "desc";
            inventoryGridMeta.value.sort.column = btnName;
            inventoryGridMeta.value.sort.direction = "desc";
            break;
          default:
            column.sortDirection = "none";
            inventoryGridMeta.value.sort.column = "UniqueID";
            inventoryGridMeta.value.sort.direction = "asc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  inventoryFetchGridData();
};
const handleInventoryFilterInputChange = async (event, name) => {
  if (inventoryFilterValues.value.hasOwnProperty(name)) {
    inventoryFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  inventoryFetchGridData();
};
const handleProductSortingButton = async (btnName: string) => {
  for (const column of productGridMeta.value.defaultColumns) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case "none":
            column.sortDirection = "asc";
            productGridMeta.value.sort.column = btnName;
            productGridMeta.value.sort.direction = "asc";
            break;
          case "asc":
            column.sortDirection = "desc";
            productGridMeta.value.sort.column = btnName;
            productGridMeta.value.sort.direction = "desc";
            break;
          default:
            column.sortDirection = "none";
            productGridMeta.value.sort.column = "UniqueID";
            productGridMeta.value.sort.direction = "asc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  productFetchGridData();
};
const handleProductFilterInputChange = async (event, name) => {
  if (productFilterValues.value.hasOwnProperty(name)) {
    productFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  productFetchGridData();
};
const handleStockSortingButton = async (btnName: string) => {
  for (const column of productGridMeta.value.defaultColumns) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case "none":
            column.sortDirection = "asc";
            productGridMeta.value.sort.column = btnName;
            productGridMeta.value.sort.direction = "asc";
            break;
          case "asc":
            column.sortDirection = "desc";
            productGridMeta.value.sort.column = btnName;
            productGridMeta.value.sort.direction = "desc";
            break;
          default:
            column.sortDirection = "none";
            productGridMeta.value.sort.column = "UniqueID";
            productGridMeta.value.sort.direction = "asc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  inventoryDetailFetchGridData();
};

const handleInventoryDetailFilterInputChange = async (event, name) => {
  if (inventoryDetailFilterValues.value.hasOwnProperty(name)) {
    inventoryDetailFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  inventoryDetailFetchGridData();
};
const onInventoryEdit = (row) => {
  inventoryGridMeta.value.selectedInventory = row;
};
const onInventoryDelete = async (row: any) => { };
const onAddPartToInventoryTransaction = async () => {
  await useApiFetch(`/api/materials/inventorytransactions/detail`, {
    method: "POST",
    body: {
      inventoryid: inventoryGridMeta.value.selectedInventory.uniqueid,
      onhand: updatedHand.value,
      bpid: productGridMeta.value.selectedProduct.UniqueID,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        inventoryDetailFetchGridData();
      }
    },
  });
  isAddPartsModalOpen.value = false;
  updatedHand.value = 0;
};
const onRemovePart = async () => {
  if (inventoryDetailGridMeta.value.selectedDetail) {
    await useApiFetch(
      `/api/materials/inventorytransactions/detail/${inventoryDetailGridMeta.value.selectedDetail.uniqueID}`,
      {
        method: "DELETE",
        onResponse({ response }) {
          if (response.status === 200) {
            inventoryDetailFetchGridData();
          }
        },
      }
    );
  } else {
    toast.add({
      title: "",
      description: "Select item to delete.",
      icon: "i-heroicons-exclamation-triangle",
      color: "yellow",
    });
  }
};
const onDelete = async () => {
  if (inventoryGridMeta.value.selectedInventory) {
    await useApiFetch(
      `/api/materials/inventorytransactions/${inventoryGridMeta.value.selectedInventory.uniqueid}`,
      {
        method: "DELETE",
        onResponse({ response }) {
          if (response.status === 200) {
            inventoryGridMeta.value.selectedInventory = null;
            inventoryFetchGridData();
            formData.transactionID = null;
            formData.By = null;
            formData.Dated = null;
            formData.Justification = null;
            toast.add({
              title: "",
              description: response._data.message,
              icon: "i-heroicons-trash",
              color: "green",
            });
          }
        },
      }
    );
  } else {
    toast.add({
      title: "",
      description: "Select item to delete.",
      icon: "i-heroicons-exclamation-triangle",
      color: "yellow",
    });
  }
};
const onSave = async () => {
  if (inventoryGridMeta.value.selectedInventory) {
    await useApiFetch(
      `/api/materials/inventorytransactions/${inventoryGridMeta.value.selectedInventory.uniqueid}`,
      {
        method: "PUT",
        body: { ...formData },
        async onResponse({ response }) {
          if (response.status === 200) {
            await inventoryFetchGridData();

            inventoryGridMeta.value.inventories.forEach((product) => {
              if (
                product.uniqueid ===
                inventoryGridMeta.value.selectedInventory.uniqueid
              ) {
                product.class = "bg-gray-200";
              } else {
                delete product.class;
              }
            });
            toast.add({
              title: "",
              description: response._data.message,
              icon: "i-heroicons-trash",
              color: "green",
            });
          }
        },
      }
    );
  } else {
    toast.add({
      title: "",
      description: "Select item to save.",
      icon: "i-heroicons-exclamation-triangle",
      color: "yellow",
    });
  }
};
const onClear = () => {
  inventoryGridMeta.value.selectedInventory = null;
  inventoryDetailGridMeta.value.details = [];
  formData.transactionID = null;
  formData.By = null;
  formData.Dated = null;
  formData.Justification = null;
  inventoryGridMeta.value.inventories.forEach((product) => {
    delete product.class;
  });
};
const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.fname)
    errors.push({ path: "fname", message: "Please enter your frist name." });
  if (!state.lname)
    errors.push({ path: "lname", message: "Please enter a your last name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  return errors;
};
async function onSubmit(event: FormSubmitEvent<any>) {
  emit("save", event.data);
}
editInit();
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UDashboardNavbar v-if="props.isPage" class="gmsBlueHeader text-white" title="Inventory transactions">
    <template #right>
      <div class="flex flex-row space-x-5">
        <div class="flex flex-row space-x-3">
          <div class="flex items-center">Stock# Search</div>
          <div class="min-w-[150px]">
            <UInput v-model="inventoryFilterValues.uniqueid" />
          </div>
        </div>
        <div>
          <UButton label="Refresh List" color="gray" />
        </div>
      </div>
    </template>
  </UDashboardNavbar>
  <UDashboardPanelContent class="p-0">
    <UForm :validate="validate" :validate-on="['submit']" :state="formData" @submit="onSubmit">
      <div class="flex flex-col">

        <div class="py-2">
          <div class="px-4">
            <UTable :rows="inventoryGridMeta.inventories" :columns="inventoryGridMeta.defaultColumns"
              :loading="inventoryGridMeta.isLoading" class="w-full" :ui="{
                wrapper:
                  'overflow-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                divide: 'divide-gray-200 dark:divide-gray-800',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                },
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0',
                },
                td: {
                  base: 'h-[31px]',
                  padding: 'py-0',
                },
              }" :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }" @select="onInventorySelect" @dblclick="onInventoryDblClick">
              <template v-for="column in inventoryGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                <template v-if="column.kind !== 'actions'">
                  <div class="px-1 py-1">
                    <CommonSortAndInputFilter @handle-sorting-button="handleInventorySortingButton"
                      @handle-input-change="handleInventoryFilterInputChange" :label="column.label"
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
              <template #UniqueID-data="{ row }">
                <div class="w-[50px]">
                  {{ row.UniqueID }}
                </div>
              </template>
              <template #edit-data="{ row }">
                <UTooltip text="Detail" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square"
                    @click="onInventoryEdit(row)" />
                </UTooltip>
              </template>
              <template #delete-data="{ row }">
                <UTooltip text="Delete" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)" />
                </UTooltip>
              </template>
            </UTable>
          </div>
          <div class="p-4">
            <div class="gmsBlueHeader p-3 text-white">Parts Used</div>
            <div class="flex flex-row-reverse px-4 py-1">
              <div class="min-w-[100px]">
                <UButton label="Remove Part" :ui="{ base: 'min-w-[125px] justify-center' }" @click="onRemovePart" />
              </div>
            </div>
            <div class="flex flex-row space-x-3 p-4 pt-0">
              <div class="basis-1/2">
                <UTable :rows="productGridMeta.products" :columns="productGridMeta.defaultColumns"
                  :loading="productGridMeta.isLoading" class="w-full" :ui="{
                    wrapper:
                      'overflow-y-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-0',
                    },
                    td: {
                      base: 'h-[31px]',
                      padding: 'py-0',
                    },
                  }" :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                  }" @select="onProductSelect" @dblclick="onProductDblClick">
                  <template v-for="column in productGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                    <template v-if="!column.filterOptions">
                      <div class="px-1 py-1">
                        <CommonSortAndInputFilter @handle-sorting-button="handleProductSortingButton"
                          @handle-input-change="handleProductFilterInputChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
                            ? noneIcon
                            : column?.sortDirection === 'asc'
                              ? ascIcon
                              : descIcon
                            " :filterable="column.filterable" :filter-key="column.key" />
                      </div>
                    </template>
                    <template v-else>
                      <div class="px-1 py-1 min-w-[120px]">
                        <CommonSortAndSelectFilter @handle-sorting-button="handleProductSortingButton"
                          @handle-select-change="handleProductFilterInputChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
                            ? noneIcon
                            : column?.sortDirection === 'asc'
                              ? ascIcon
                              : descIcon
                            " :value="productFilterValues[column.key]" :filterable="column.filterable"
                          :filter-key="column.key" :filter-options="column.filterOptions" />
                      </div>
                    </template>
                  </template>
                  <template #UniqueID-data="{ row }">
                    <div class="w-[50px]">
                      {{ row.UniqueID }}
                    </div>
                  </template>
                  <template #edit-data="{ row }">
                    <UTooltip text="Detail" class="flex justify-center">
                      <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square"
                        @click="onInventoryEdit(row)" />
                    </UTooltip>
                  </template>
                  <template #delete-data="{ row }">
                    <UTooltip text="Delete" class="flex justify-center">
                      <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)" />
                    </UTooltip>
                  </template>
                </UTable>
              </div>

              <div class="basis-1/2">
                <UTable :rows="inventoryDetailGridMeta.details" :columns="inventoryDetailGridMeta.defaultColumns"
                  :loading="inventoryDetailGridMeta.isLoading" class="w-full" :ui="{
                    wrapper:
                      'overflow-y-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                    },
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-0',
                    },
                    td: {
                      base: 'h-[31px]',
                      padding: 'py-0',
                    },
                  }" :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                  }" @select="onInventoryDetailSelect" @dblclick="">
                  <template v-for="column in inventoryDetailGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                      <div class="px-1 py-1">
                        <CommonSortAndInputFilter @handle-sorting-button="handleStockSortingButton"
                          @handle-input-change="handleInventoryDetailFilterInputChange
                            " :label="column.label" :sortable="column.sortable" :sort-key="column.key" :sort-icon="column?.sortDirection === 'none'
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
                  <template #UniqueID-data="{ row }">
                    <div class="w-[50px]">
                      {{ row.UniqueID }}
                    </div>
                  </template>
                  <template #edit-data="{ row }">
                    <UTooltip text="Detail" class="flex justify-center">
                      <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square"
                        @click="onInventoryEdit(row)" />
                    </UTooltip>
                  </template>
                  <template #delete-data="{ row }">
                    <UTooltip text="Delete" class="flex justify-center">
                      <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)" />
                    </UTooltip>
                  </template>
                </UTable>
              </div>
            </div>
            <div class="flex flex-row">
              <div class="basis-1/2 p-4 pt-0">
                <div class="italic">Parts(Double-Click To Add)</div>
              </div>
              <div class="basis-1/2 p-4 pt-0 flex flex-row space-x-3">
                <div class="basis-1/4 flex justify-center">
                  Transaction#: {{ formData.transactionID }}
                </div>
                <div class="basis-1/4 flex flex-col space-y-3">
                  <UFormGroup label="By">
                    <UInput v-model="formData.By" />
                  </UFormGroup>
                  <UFormGroup label="Date">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.Dated && format(formData.Dated, 'MM/dd/yyyy')
                        " variant="outline" :ui="{
                          base: 'w-full',
                          truncate: 'flex justify-center w-full',
                        }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.Dated" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div class="basis-1/2">
                  <UFormGroup label="Justification">
                    <UTextarea v-model="formData.Justification" :rows="5" />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between gap-3 px-8">
        <div>
          <UButton icon="i-heroicons-minus-circle" label="Delete" color="red" variant="outline" :ui="{
            base: 'min-w-[200px]',
            truncate: 'flex justify-center w-full',
          }" truncate @click="onDelete" />
        </div>
        <div class="flex flex-row space-x-5">
          <UButton icon="i-f7-rays" label="Clear Form" color="red" variant="outline" :ui="{
            base: 'min-w-[200px]',
            truncate: 'flex justify-center w-full',
          }" truncate @click="onClear" />
          <UButton icon="i-heroicons-document-text" type="submit" label="Save" color="green" variant="outline" :ui="{
            base: 'min-w-[200px]',
            truncate: 'flex justify-center w-full',
          }" truncate @click="onSave" />
        </div>
      </div>
    </UForm>
  </UDashboardPanelContent>
  <UDashboardModal v-model="isAddPartsModalOpen" :ui="{
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'p-0 pt-1',
    },
    body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
    width: 'w-[300px]',
  }">
    <div>
      <div class="flex flex-row space-x-5">
        <div class="flex items-center">Onhand Count:</div>
        <div class="flex-1 mr-4">
          <UInput type="number" v-model="updatedHand"></UInput>
        </div>
      </div>
      <div class="flex flex-row-reverse mt-2">
        <div class="min-w-[60px]">
          <UButton label="OK" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="onAddPartToInventoryTransaction" />
        </div>
        <div class="min-w-[60px] mr-3">
          <UButton label="Cancel" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate
            @click="isAddPartsModalOpen = false" />
        </div>
      </div>
    </div>
  </UDashboardModal>

  <!-- Service Report Modal -->
  <UDashboardModal v-model="isServiceReportModalOpen" title="Service Report" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1700px] sm:max-w-9xl',
  }">
    <ServiceReportDetail :selected-complaint="null" :selected-service-report="selectedServiceReportID" @save="editInit"
      @close="" />
  </UDashboardModal>

  <!-- Job Detail Modal -->
  <UDashboardModal v-model="isJobModalOpen" title="Job Details" :ui="{
    width: 'w-[1100px] sm:max-w-7xl',
    body: { padding: 'py-0 sm:pt-0' },
  }">
    <JobForm @close="" @save="editInit" :selected-job="selectedJobID" :is-modal="true" />
  </UDashboardModal>

  <!-- Vendor Invoice Modal -->
  <UDashboardModal v-model="isVendorInvoiceModalOpen" title="Order" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
  }">
    <VendorInvoice @close="" />
  </UDashboardModal>

  <!-- Order / Invoice Modal -->
  <UDashboardModal v-model="isInvoiceModalOpen" title="Order" :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
  }">
    <InvoiceDetail :selected-customer="null" :selected-order="selectedInvoiceID" @close="" />
  </UDashboardModal>
</template>
