<!-- pages/Vendors.vue -->
<script lang="ts" setup>
import Details from '~/components/materials/vendors/Details.vue';
import PrintLabel from '~/components/materials/vendors/PrintLabel.vue';
import PurchaseDetails from '~/components/materials/vendors/PurchaseDetails.vue';
import VendorTable from '~/components/materials/vendors/VendorTable.vue';
import type { UTableColumn } from '~/types';

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";
const modalUIConfig = {
  title: 'text-lg',
  header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
  body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
  width: 'w-[1800px] sm:max-w-9xl',
};
const printModaluiConfig = {
  title: 'text-lg',
  header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
  body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
  width: 'w-1/2 sm:max-w-9xl',
};
const defaultColumns: UTableColumn[] = [
  { key: 'NUMBER', label: 'Vendor#', sortable: true, sortDirection: 'asc', filterable: true },
  { key: 'NAME', label: 'Name', sortable: true, sortDirection: 'asc', filterable: true },
  { key: 'ZIP', label: 'Zip', sortable: true, sortDirection: 'asc', filterable: true },
  { key: 'label', label: 'Print Label', kind: 'actions' },
  { key: 'information', label: 'Vendor Details', kind: 'actions' },
  { key: 'partSupplied', label: 'Parts Supplied', kind: 'actions' },
  { key: 'createOrder', label: 'Create Orders', kind: 'actions' },
  { key: 'viewOrder', label: 'View Order', kind: 'actions' },
];

const defaultPartsColumns: UTableColumn[] = [
  { key: 'Model', label: 'Stock#', sortable: false, filterable: false },
  { key: 'Description', label: 'Description', sortable: false, filterable: false },
  { key: 'label', label: 'Label', kind: 'actions' },
];
const gridMeta = ref({
  defaultColumns: defaultColumns,
  partsColumns: defaultPartsColumns,
  modalData: {
    vendorDetails: null,
    printLabel: null,
    partsSupplied: null,
    orderDetails: null,
    createPurchaseOrder: null,
  },
  page: 1,
  pageSize: 50,
  numberOfVendors: 0,
  vendors: [],
  partsSupplied: [],
  selectedCustomerId: null,
  sort: {
    column: 'NUMBER',
    direction: 'asc'
  },
  isCreating: false,
  isLoading: false,
  isLoadingDetails: false
});

const filterValues = ref({
  NUMBER: null,
  NAME: null,
  ZIP: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);
const selectedPartsColumns = ref(gridMeta.value.partsColumns);

onMounted(() => {
  fetchGridData();
});

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;

  await useApiFetch("/api/materials/vendors/count/", {
    method: 'GET',
    params: {
      ...(filterValues.value || {}),
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfVendors = response._data.body
      }
    }
  })
  await useApiFetch("/api/materials/vendors/list/", {
    method: 'GET',
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...(filterValues.value || {}),
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.vendors = response._data.body
        console.log("number of vendors", response)
      }
    }
  })
  gridMeta.value.isLoading = false;
};

const handlePageChange = async () => {
  fetchGridData();
};

const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))
const partsColumns = computed(() => gridMeta.value.partsColumns.filter(column => selectedPartsColumns.value.includes(column)))

const handleSortingButton = async (btnName: string) => {
  gridMeta.value.page = 1
  for (const column of columns.value) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case 'none':
            column.sortDirection = 'asc';
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = 'asc';
            break;
          case 'asc':
            column.sortDirection = 'desc';
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = 'desc';
            break;
          default:
            column.sortDirection = 'none';
            gridMeta.value.sort.column = 'UniqueID';
            gridMeta.value.sort.direction = 'asc';
            break;
        }
      } else {
        column.sortDirection = 'none';
      }
    }
  }
  fetchGridData()
};


const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1
  if (name in filterValues.value) {
    filterValues.value[name] = event;
    console.log(`Updated filter ${name}:`, filterValues.value[name]);
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  await fetchGridData()
}



const onSelect = async (row) => {
  gridMeta.value.isLoadingDetails = true;
  gridMeta.value.modalData = row;

  try {
    await useApiFetch('/api/materials/vendors/vendorSuppliedParts', {
      method: 'GET',
      params: {
        search: row.NAME,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          gridMeta.value.partsSupplied = response._data.body.parts || [];
        }
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    gridMeta.value.isLoadingDetails = false;
  }
};



const showVendorDetailsModal = ref(false);
const showLabelModal = ref(false);
const showPartsSuppliedModal = ref(false);
const showOrderDetailsModal = ref(false);
const showCreatePurchaseOrderModal = ref(false);

const openModal = (modalName: keyof typeof gridMeta.value.modalData, row: any = null, isCreating = false) => {
  if (row) gridMeta.value.modalData[modalName] = row;
  gridMeta.value.isCreating = isCreating;
  switch (modalName) {
    case 'vendorDetails':
      showVendorDetailsModal.value = true;
      break;
    case 'printLabel':
      showLabelModal.value = true;
      break;
    case 'partsSupplied':
      showPartsSuppliedModal.value = true;
      break;
    case 'orderDetails':
      showOrderDetailsModal.value = true;
      break;
    case 'createPurchaseOrder':
      showCreatePurchaseOrderModal.value = true;
      break;
    default:
      break;
  }
};

const onDblClick = () => openModal('vendorDetails');
const onCreatePurchaseOrder = (row: any) => openModal('createPurchaseOrder', row);
const onViewOrderDetails = (row: any) => openModal('orderDetails', row);
const onVendorDetailsEdit = (row: any) => openModal('vendorDetails', row);
const onPartsSuppliedDetails = (row: any) => openModal('partsSupplied', row);
const onPrintLabel = (row: any) => openModal('printLabel', row);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Vendors" />
      <UDashboardToolbar>
        <template #right>
          <UButton color="green" variant="outline" label="Add Vendor" trailing-icon="i-heroicons-plus"
            @click="openModal('vendorDetails', null, true)" />
        </template>
      </UDashboardToolbar>
      <div class="h-full overflow-y-auto">
        <VendorTable :columns="columns" :rows="gridMeta.vendors" :isLoading="gridMeta.isLoading" :gridMeta="gridMeta"
          :ascIcon="ascIcon" :descIcon="descIcon" :noneIcon="noneIcon" @pageChange="handlePageChange"
          @sortingButton="handleSortingButton" @filterInputChange="handleFilterInputChange" @select="onSelect"
          @dblClick="onDblClick" @vendor-details-edit="onVendorDetailsEdit" @print-label="onPrintLabel"
          @parts-supplied-details="onPartsSuppliedDetails" @create-purchase-order="onCreatePurchaseOrder"
          @view-order-details="onViewOrderDetails" />
      </div>
      <UDashboardModal v-model="showVendorDetailsModal" title="Vendor Information" :ui="modalUIConfig">
        <Details :isVisible="showVendorDetailsModal" :data="gridMeta.modalData.vendorDetails"
          @close="showVendorDetailsModal = false" :is-creating="gridMeta.isCreating">
        </Details>
      </UDashboardModal>
      <UDashboardModal v-model="showLabelModal" title="Print Vendor Label" :ui="printModaluiConfig">
        <PrintLabel :isVisible="showLabelModal" :data="gridMeta.modalData.printLabel" @close="showLabelModal = false">
        </PrintLabel>
      </UDashboardModal>
      <UDashboardModal v-model="showOrderDetailsModal" title="Order Details" :ui="modalUIConfig">
        <!-- <Details :isVisible="showOrderDetailsModal" :data="gridMeta.modalData.orderDetails"
          @close="showOrderDetailsModal = false"> -->
        <!-- </Details> -->
        <PurchaseDetails></PurchaseDetails>
      </UDashboardModal>
      <UDashboardModal v-model="showPartsSuppliedModal" title="Create Purchase Order" :ui="modalUIConfig">
        <MaterialsPartsForm @close="showPartsSuppliedModal = false" @save=""
          :selected-customer="gridMeta.selectedCustomerId" :is-modal="true" />
      </UDashboardModal>
      <UDashboardModal v-model="showCreatePurchaseOrderModal" title="Parts Supplied" :ui="modalUIConfig">
        <PurchaseDetails></PurchaseDetails>

      </UDashboardModal>

    </UDashboardPanel>
  </UDashboardPage>
</template>
