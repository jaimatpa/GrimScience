<script lang="ts" setup>
import type { UTableColumn } from '~/types';
import PrintLabel from '~/components/materials/vendors/PrintLabel.vue';
import PurchaseDetails from '~/components/materials/vendors/PurchaseDetails.vue';
import PartsForm from '~/components/materials/Parts/PartsForm.vue';
import Parts from './parts.vue';


const props = defineProps({
  isPage: {
    type: Boolean,
    required: false,
    default: true
  },
  isNewReport: {
    type: Boolean,
    required: false,
    default: true
  }
});
const emit = defineEmits(['handleSelect', 'close'])
const toast = useToast()

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
];

const defaultPartsColumns: UTableColumn[] = [
  { key: 'MODEL', label: 'Stock#', sortable: false, filterable: false },
  { key: 'DESCRIPTION', label: 'Description', sortable: false, filterable: false },
];
const statusOptions = ref([]);

const approvedByOptions = ref([]);
const selectedCheck = ref(null);
const selectedOrder = ref(null);

const stateOptions = [
  { label: 'Ohio', value: 'OH' },
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
  parts: [],
  POItems: [],
  selectedVendor: null,
  selectedPart: null,
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
const suppliedPart = ref({})
const fetchSuppliedParts = async (search: string) => {
  gridMeta.value.isLoadingDetails = true;
  if (!search) return;

  try {
    const response = await useApiFetch(`/api/materials/vendors/vendorSuppliedParts?search=${search}`, {
      method: 'GET',
    });

    if (response.body) {
      gridMeta.value.parts = response.body
    } else {
      console.log('Unexpected response structure or status code:', response);
    }

  } catch (error) {
    console.error('Error fetching supplied parts:', error);
  } finally {
    gridMeta.value.isLoadingDetails = false;
  }
};
const fetchPOList = async (search: string) => {
  gridMeta.value.isLoading = true;
  if (!search) return;
  console.log(search)
  try {
    const response = await useApiFetch(`/api/materials/vendors/getAllPo?vendor=${search}`, {
      method: 'GET',
    });

    if (response.body) {
      gridMeta.value.POItems = response.body
    } else {
      console.log('Unexpected response structure or status code:', response);
    }

  } catch (error) {
    console.error('Error fetching supplied parts:', error);
  } finally {
    gridMeta.value.isLoading = false;
  }
};
const onPartsSuppliedDetails = () => {
  console.log("onPartsSuppliedDetails")
  showPartsSuppliedModal.value = true;
};

const formData = ref({});

watch(
  () => gridMeta.value.selectedVendor,
  (newVendor) => {
    if (newVendor) {
      fetchSuppliedParts(newVendor.NAME);
      formData.value = { ...newVendor };
      fetchPOList(newVendor.NUMBER);
    }
  },
  { immediate: true }
);

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
const onPrintLabel = (row: any) => openModal('printLabel', row);
const clearForm = () => {
  gridMeta.value.selectedVendor = {}
  gridMeta.value.parts = []
  formData.value = {};
  filterValues.value = {};
};
await useApiFetch('/api/common/vendorStatus', {
  method: 'GET',
  onResponse({ response }) {
    statusOptions.value = response._data.body
      .map(e => e.ApprovalStatus)
      .filter(status => status !== null && status !== "");
  }
});
useApiFetch('/api/auth/employees', {
  onResponse({ response }) {
    if (response.status === 200) {
      gridMeta.isLoading.value = false;
      approvedByOptions.value = response._data.body
    }
  }
})
const items = [
  {
    label: 'Order History',
    key: "orders"
  },
  {
    label: 'Check History',
    key: "checks"
  },
];

useApiFetch('/api/auth/employees', {
  onResponse({ response }) {
    if (response.status === 200) {
      loadingOverlay.value = false;
      approvedByOptions.value = response._data.body
    }
  }
})
const save = async () => {
  console.log('Form Data:', formData);
  await useApiFetch('/api/materials/vendors/update', {
    method: 'PUT',
    body: formData.value,
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'green'
        });
        console.log(response)
      }
    }
  });
};
const create = async () => {
  console.log('Form Data:', formData);
  await useApiFetch('/api/materials/vendors/create', {
    method: 'POST',
    body: formData.value,
    onResponse({ response }) {
      toast.add({
        title: "Success",
        description: response._data.message,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    }
  });
};


</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Vendors" />
      <div class="overflow-y-scroll">
        <div class="grid grid-cols-2 gap-2">
          <div class="oveflow-hidden">
            <div>
              <div class="px-4 py-2 gmsBlueTitlebar">
                <h2>Vendors Lookup</h2>
              </div>
              <div class="h-[20vh] overflow-y-scroll">
                <UTable :rows="gridMeta.vendors" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-0'
                  },
                  td: {
                    padding: 'py-1'
                  }
                }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" @select="onSelect"
                  @dblclick="onDblClick">
                  <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                      <div class="px-4 py-3.5">
                        <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                          @handle-input-change="handleFilterInputChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key"
                          :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                          :filterable="column.filterable" :filter-key="column.key" />
                      </div>
                    </template>
                  </template>
                </UTable>
              </div>
              <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
                <div class="flex flex-row justify-end mr-20 mt-1">
                  <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfVendors | 0"
                    v-model="gridMeta.page" @update:model-value="handlePageChange()" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="px-4 py-2 gmsBlueTitlebar">
              <h2>Parts Lookup</h2>
            </div>

            <div class="h-[20vh] overflow-y-scroll">
              <UTable :rows="gridMeta.parts" @select="row => gridMeta.selectedPart = row"
                @dblclick="onPartsSuppliedDetails" :columns="partsColumns" :loading="gridMeta.isLoadingDetails"
                class="w-full" :ui="{
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-0',
                  },
                  td: {
                    padding: 'py-1',
                  },
                }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">

              </UTable>
            </div>
          </div>
        </div>

        <div>
          <UForm :state="formData" class="flex flex-col gap-3 space-y-3">

            <div class="px-4 py-2 gmsBlueTitlebar">
              <h2>Vendor Information</h2>
            </div>
            <div class="grid grid-cols-2 gap-4 p-4">
              <div class="flex flex-row gap-3">
                <div class="basis-1/3">
                  <UFormGroup label="Number">
                    <UInput v-model="formData.NUMBER" />
                  </UFormGroup>
                </div>
                <div class="basis-2/3">
                  <UFormGroup label="Name">
                    <UInput v-model="formData.NAME" />
                  </UFormGroup>
                </div>
              </div>
              <UFormGroup label="Website">
                <UInput v-model="formData.WEBSITE" />
              </UFormGroup>
              <div>
                <UFormGroup label="Address">
                  <UInput v-model="formData.ADDESS" />
                </UFormGroup>
              </div>
              <div class="flex flex-row gap-3">
                <div class="w-full">
                  <UFormGroup label="Customer Number">
                    <UInput v-model="formData.CUSTNUMBER" />
                  </UFormGroup>
                </div>
                <div class="w-full">
                  <UFormGroup label="Terms">
                    <UInput v-model="formData.TERMS" />
                  </UFormGroup>
                </div>

              </div>

              <div class="grid grid-cols-5 gap-2">
                <div class="col-span-3">
                  <UFormGroup label="City">
                    <UInput v-model="formData.CITY" />
                  </UFormGroup>
                </div>
                <div class="col-span-1">
                  <UFormGroup label="State">
                    <USelect v-model="formData.STATE" :options="stateOptions" />
                  </UFormGroup>
                </div>
                <div class="col-span-1">
                  <UFormGroup label="ZIP">
                    <UInput v-model="formData.ZIP" />
                  </UFormGroup>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <UFormGroup label="Country">
                  <UInput v-model="formData.COUNTRY" />
                </UFormGroup>
                <UFormGroup label="Ship Via">
                  <UInput v-model="formData.SHIPVIA" />
                </UFormGroup>
              </div>
            </div>

            <div class="grid grid-cols-5 gap-3">
              <div class="col-span-1 h-full">
                <div class="px-4 py-2 gmsBlueTitlebar">
                  <h2>Inside Representative</h2>
                </div>
                <div class="p-3">
                  <UFormGroup>
                    <UFormGroup label="Name">
                      <UInput v-model="formData.IRNAME" />
                    </UFormGroup>
                    <div class="flex gap-3">
                      <UFormGroup class="basis-2/3" label="Telephone">
                        <UInput v-model="formData.IRPHONE" />
                      </UFormGroup>
                      <UFormGroup class="basis-1/3" label="Ext">
                        <UInput v-model="formData.IREXT" />
                      </UFormGroup>
                    </div>
                    <UFormGroup label="Fax">
                      <UInput v-model="formData.IRFAX" />
                    </UFormGroup>
                    <UFormGroup label="Email">
                      <UInput v-model="formData.IREMAIL" type="email" />
                    </UFormGroup>
                  </UFormGroup>
                </div>
              </div>

              <div class="col-span-1 h-full">
                <div class="px-4 py-2 gmsBlueTitlebar">
                  <h2>Technical Support</h2>
                </div>
                <div class="p-3">
                  <UFormGroup>
                    <UFormGroup label="Name">
                      <UInput v-model="formData.TSNAME" />
                    </UFormGroup>
                    <div class="flex gap-3">
                      <UFormGroup class="basis-2/3" label="Telephone">
                        <UInput v-model="formData.TSPHONE" />
                      </UFormGroup>
                      <UFormGroup class="basis-1/3" label="Ext">
                        <UInput v-model="formData.TSEXT" />
                      </UFormGroup>
                    </div>
                    <UFormGroup label="Fax">
                      <UInput v-model="formData.TSFAX" />
                    </UFormGroup>
                    <UFormGroup label="Email">
                      <UInput v-model="formData.TSEMAIL" type="email" />
                    </UFormGroup>
                  </UFormGroup>
                </div>
              </div>

              <div class="col-span-1 h-full">
                <div class="px-4 py-2 gmsBlueTitlebar">
                  <h2>Field Representative</h2>
                </div>
                <div class="p-3">
                  <UFormGroup>
                    <UFormGroup label="Name">
                      <UInput v-model="formData.FRNAME" />
                    </UFormGroup>
                    <UFormGroup label="Cell">
                      <UInput v-model="formData.FRCELL" />
                    </UFormGroup>
                    <UFormGroup label="Fax">
                      <UInput v-model="formData.FRFAX" />
                    </UFormGroup>
                    <UFormGroup label="Email">
                      <UInput v-model="formData.FREMAIL" type="email" />
                    </UFormGroup>
                  </UFormGroup>
                </div>
              </div>

              <div class="col-span-2 row-span-2">
                <div class="px-4 py-2 gmsBlueTitlebar">
                  <h2>Vendor Approval</h2>
                </div>
                <div class="p-3">
                  <UFormGroup class="space-y-3">
                    <UFormGroup label="Status">
                      <UInputMenu v-model="formData.ApprovalStatus" :options="statusOptions" />
                    </UFormGroup>
                    <UFormGroup label="Approved By">
                      <UInputMenu v-model="formData.ApprovedBy" :options="approvedByOptions" />
                    </UFormGroup>
                    <UFormGroup label="Approved Date">
                      <UInput v-model="formData.ApprovedDate" type="date" />
                    </UFormGroup>
                  </UFormGroup>
                </div>
                <div>
                  <UTabs :items="items">
                    <template #item="{ item }">
                      <UCard>
                        <template #header>
                          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            {{ item.label }}
                          </p>
                        </template>

                        <div v-if="item.key === 'orders'" class="space-y-3">
                          <ul>
                            <li v-for="(poItem, index) in gridMeta.POItems" :key="index" @click="selectedOrder = poItem"
                              class="p-1 cursor-pointer" :class="{ 'bg-gray-200 text-black': selectedOrder === poItem }"
                              styling>
                              {{ poItem }}
                            </li>
                          </ul>

                        </div>
                        <div v-else-if="item.key === 'checks'" class="space-y-3">

                        </div>

                        <template #footer>
                          <UButton @click="onViewOrderDetails" color="black">
                            View {{ item.key === 'orders' ? 'Order' : 'Check' }}
                          </UButton>
                        </template>
                      </UCard>
                    </template>
                  </UTabs>

                </div>
              </div>

              <div class="col-span-3 h-full">
                <UCard>
                  <UFormGroup label="Comments">
                    <UTextarea v-model="formData.COMMENTS" :rows="3" />
                  </UFormGroup>
                </UCard>
              </div>

            </div>

          </UForm>
        </div>
        <div class="gap-3 flex">
          <div v-if="props.isPage">
            <UButton icon="i-heroicons-cursor-arrow-ripple" :disabled="!gridMeta.selectedVendor" variant="outline"
              color="green" label="Select" truncate @click="emit('handleSelect', gridMeta.selectedVendor)">
            </UButton>
          </div>
          <UButton @click="create" :disabled="gridMeta.selectedVendor" variant="outline" color="green"
            icon="i-heroicons-plus" class="flex-1">
            Add Vendor
          </UButton>
          <UButton @click="save" :disabled="!gridMeta.selectedVendor" variant="outline" color="primary"
            icon="i-heroicons-pencil-square" class="flex-1">
            Modify Vendor
          </UButton>
          <UButton @click="clearForm" variant="outline" color="primary" icon="i-heroicons-arrow-path" class="flex-1">
            Clear
          </UButton>
          <UButton @click="onPrintLabel" variant="outline" color="primary" icon="i-heroicons-tag" class="flex-1">
            Vendor Label
          </UButton>
          <UButton @click="onCreatePurchaseOrder" variant="outline" color="green" icon="i-heroicons-plus"
            class="flex-1">
            Create Purchase Order
          </UButton>
        </div>
      </div>
      <UDashboardModal v-model="showLabelModal" title="Print Vendor Label" :ui="printModaluiConfig">
        <PrintLabel :isVisible="showLabelModal" :data="gridMeta.modalData.printLabel" @close="showLabelModal = false">
        </PrintLabel>
      </UDashboardModal>
      <UDashboardModal v-model="showCreatePurchaseOrderModal" title="Create Purchase Order" :ui="modalUIConfig">
        <PurchaseDetails :is-creating="true" :vendor-details="gridMeta.modalData.createPurchaseOrder"></PurchaseDetails>
      </UDashboardModal>
      <UDashboardModal v-model="showOrderListModal" title="Orders List" :ui="modalUIConfig">
        <PurchaseDetails :is-creating="false" :vendor-details="gridMeta.selectedVendor"
          :modal-data="{ ...gridMeta.selectedVendor, PONUMBER: selectedOrder.split[0] }"></PurchaseDetails>
      </UDashboardModal>

      <UDashboardModal v-model="showPartsSuppliedModal" title="Supplied Parts Details" :ui="modalUIConfig">
        <Parts />
        <!-- <PartsForm :selected-parts="gridMeta.selectedPart.UniqueID"
          :selectedPartInstace="gridMeta.selectedPart.InstanceID" :is-modal="true"
          :selectedPartModel="gridMeta.selectedPart.MODEL" /> -->
      </UDashboardModal>
    </UDashboardPanel>
  </UDashboardPage>
</template>
