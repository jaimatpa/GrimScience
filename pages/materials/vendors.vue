<script lang="ts" setup>
import Details from '~/components/materials/vendors/Details.vue';
import PrintLabel from '~/components/materials/vendors/PrintLabel.vue';
import PurchaseDetails from '~/components/materials/vendors/PurchaseDetails.vue';
// import PurchaseDetails from '~/components/materials/vendors/PurchaseDetails.vue';
import SuppliedPartsList from '~/components/materials/vendors/SuppliedPartsList.vue';
import VendorTable from '~/components/materials/vendors/VendorTable.vue';
import ViewOrderList from '~/components/materials/vendors/ViewOrderList.vue';
// import ViewOrderList from '~/components/materials/vendors/ViewOrderList.vue';
import type { UTableColumn } from '~/types';

const props = defineProps({
  isPage: {
    type: Boolean,
    required: false,
    default: true
  },
  isNewReport: {
    type: Boolean,
    required:false,
    default: true
  }
});
const emit = defineEmits(['handleSelect' , 'close'])

const handleSelectRow = () => {
    const ser = gridMeta.value.selectedVendor;
    emit("handleSelect", ser);
    emit("close");
};

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
  neReportData:[],
  selectedVendor: null,
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
  gridMeta.value.neReportData = row;
  
  gridMeta.value.selectedVendor = row;
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
const showOrderListModal = ref(false);
const showCreatePurchaseOrderModal = ref(false);

const openModal = async (modalName: keyof typeof gridMeta.value.modalData, row: any = null, isCreating = false) => {
  gridMeta.value.isCreating = isCreating;
  switch (modalName) {
    case 'vendorDetails':
      showVendorDetailsModal.value = true;
      gridMeta.value.modalData.vendorDetails = row;
      break;
    case 'printLabel':
      showLabelModal.value = true;
      gridMeta.value.modalData.printLabel = row;
      break;
    case 'partsSupplied':
      showPartsSuppliedModal.value = true;
      gridMeta.value.modalData.partsSupplied = row;
      break;
    case 'orderDetails':
      showOrderListModal.value = true;
      gridMeta.value.modalData.orderDetails = row;
      break;
    case 'createPurchaseOrder':
      showCreatePurchaseOrderModal.value = true;
      gridMeta.value.modalData.createPurchaseOrder = row;
      break;
    default:
      break;
  }
};

const onDblClick = () => openModal('vendorDetails');
const onCreatePurchaseOrder = (row: any) => openModal('createPurchaseOrder', row);
const onViewOrderDetails = (row: any) => openModal('orderDetails', row);
const onVendorDetailsEdit = (row: any) => openModal('vendorDetails', row);
const onPartsSuppliedDetails = (row: any) => { openModal('partsSupplied', row) };
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

        <div v-if="!props.isPage">
          <div class="mt-3 w-[120px]">
            <UButton icon="i-heroicons-cursor-arrow-ripple" variant="outline" color="green" label="Select" :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }" truncate @click="emit('handleSelect', gridMeta.selectedVendor)">
            </UButton>
          </div>
        </div>

        <div>
          <div class="mt-3 w-[120px]">
            <UButton icon="i-heroicons-cursor-arrow-ripple" variant="outline" color="green" label="Select" :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }" truncate @click="handleSelectRow">
            </UButton>
          </div>
        </div>

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
      <UDashboardModal v-model="showOrderListModal" title="Orders List" :ui="modalUIConfig">
        <ViewOrderList :is-modal="true" :modal-data="gridMeta.modalData.orderDetails" />
      </UDashboardModal>
      <UDashboardModal v-model="showPartsSuppliedModal" title="Supplied Parts Details" :ui="modalUIConfig">
        <SuppliedPartsList :modal-data="gridMeta.modalData.partsSupplied" />
      </UDashboardModal>
      <UDashboardModal v-model="showCreatePurchaseOrderModal" title="Create Purchase Order" :ui="modalUIConfig">
        <PurchaseDetails :is-creating="true" :vendor-details="gridMeta.modalData.createPurchaseOrder"></PurchaseDetails>
      </UDashboardModal>

    </UDashboardPanel>
  </UDashboardPage>
</template>
