<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import Loading from 'vue-loading-overlay'
const emit = defineEmits(["rowSelectedProduct", "close", "select"]);



const handleSelect = ()=>{
  emit("rowSelectedProduct",  gridMeta.value.selectProduct);
  emit("close");
}


onMounted(() => {
  init();
});

useSeoMeta({
  title: "Grimm-Products",
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

const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

const headerFilters = ref({
  productline: {
    label: "Product Line",
    filter: "PRODUCTLINE",
    options: [],
  },
});

const headerCheckboxes = ref({
  isActive: {
    label: 'Show Active Only',
    filterKey: 'CODE',
    isChecked: true
  }
})

const loadingOverlay = ref(false);
const revisions = ref([]);
const jobHistory = ref([]);
const multipleProductSelect = ref([]);
const sourceCloneModel = ref(null);
const costCalculation = ref({
  materialCost: null,
  productLabor: null,
  productLabourHours: null,
  subAssemblyLaborCost: null,
  subAssemblyLaborHours: null,
  totalLaborCost: null,
  totalHours: null,
  totalCost: null,
  suggestedPrice: null,
  grossProfitPercent: null,
  grossProfit: null
})
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    
    {
      key: "MODEL",
      label: "Model",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "grossprofit",
      label: "Gross Profit",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "select",
      label: "Select",
      kind: "actions",
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
  numberOfProducts: 0,
  products: [],
  selectedProductId: null,
  selectProduct: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});
const modalMeta = ref({
  isProductModalOpen: false,
  modalTitle: "New Product",
  modalDescription: "Create new product",
  isPartsModalOpen: false,
  isOperationsModalOpen: false,
  isSerialModalOpen: false,
  isCloneModalOpen: false
});

const filterValues = ref({
  MODEL: null,
  DESCRIPTION: null,
  grossprofit: null,
  CODE: true
});

const watchCheckbox = (property, filterKey) => {
  watch(
    () => headerCheckboxes.value[property].isChecked,
    (newCheckedValue) => {
      filterValues.value[filterKey] = newCheckedValue ? "1" : "0";
    }
  );
}

watchCheckbox('isActive', 'CODE');

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
    const apiURL = headerFilters.value[key]?.api ?? `/api/products/${key}`;
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
  await useApiFetch("/api/products/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfProducts = response._data.body;
      }
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
  await useApiFetch("/api/products/", {
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
        gridMeta.value.products = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

const onCreate = () => {
  gridMeta.value.selectedProductId = null;
  modalMeta.value.modalTitle = "New Product";
  modalMeta.value.isProductModalOpen = true;
};
const onEdit = (row) => {
  gridMeta.value.selectedProductId = row?.UniqueID;
  modalMeta.value.modalTitle = "Edit";
  modalMeta.value.isProductModalOpen = true;
};
const onDelete = async(row: any) => {
  await useApiFetch(`/api/products/${row?.UniqueID}`, {
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
const onMultipleSelect = (row) => {
  if(multipleProductSelect.value.includes(row.UniqueID) ){
    const index = multipleProductSelect.value.indexOf(row.UniqueID)
    multipleProductSelect.value.splice(index, 1)
  } else {
    multipleProductSelect.value = [...multipleProductSelect.value,row?.UniqueID]
  }
}
const onSelect = async (row) => {
  gridMeta.value.selectProduct = row
  gridMeta.value.selectedProductId = row?.UniqueID;
  costCalculation.value = {
    materialCost: null,
    productLabor: null,
    productLabourHours: null,
    subAssemblyLaborCost: null,
    subAssemblyLaborHours: null,
    totalLaborCost: null,
    totalHours: null,
    totalCost: null,
    suggestedPrice: null,
    grossProfitPercent: null,
    grossProfit: null
  }
  gridMeta.value.products.forEach((pro) => {
    if (pro.UniqueID === row.UniqueID) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });
  gridMeta.value.selectProduct = row;
  
  await useApiFetch('/api/products/revisions/'+row?.UniqueID, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          revisions.value = response._data.body
        }
      }
    }, 
    onResponseError() {
      revisions.value = []
    }
  })
  await useApiFetch('/api/products/jobhistory/'+row?.UniqueID, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          jobHistory.value = response._data.body;
        }
      }
    }, 
    onResponseError() {
      jobHistory.value = []
    }
  })

};

const onDblClick = async () => {
  if (gridMeta.value.selectedProductId) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isProductModalOpen = true;
  }
};
const handleBulkInactive = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/products/bulkInactiveProduct/', {
    method: 'PUT',
    body: {data:multipleProductSelect}, 
    onResponse({ response }) {
      if(response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
      }
    }
  })
  loadingOverlay.value = false
}

const handleModalClose = () => {
  modalMeta.value.isProductModalOpen = false;
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
        v-if="props.isPage"
        class="gmsPurpleHeader"
        title="Products List"
      >
      </UDashboardNavbar>
      <!-- {{ isPage }} -->
      <div v-if="props.isPage" class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Sort</h2>
      </div>

      <UDashboardToolbar v-if="props.isPage" class="bg-gms-gray-100">
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
              <UFormGroup label="Quantity" name="Quantity">
                <div class="text-center text-bold">
                  {{ gridMeta.numberOfProducts }}
                </div>
              </UFormGroup>
            </div>
            <div class="flex flex-row px-10 mt-4">
              <template v-for="checkbox in headerCheckboxes">
                <div>
                  <UCheckbox
                    v-model="filterValues[checkbox.filterKey]"
                    :label="checkbox.label"
                    @update:model-value="handleFilterChange"
                  />
                </div>
              </template>
            </div>
          </div>
        </template>
        <template #right>
          
          <UButton
            icon="i-heroicons-minus-circle-20-solid"
            color="red"
            variant="outline"
            :loading="exportIsLoading"
            label="Bulk Inactive"
            trailing-icon="i-heroicons-document-text"
            @click="handleBulkInactive"
          >
          </UButton>
          <UButton
            color="green"
            variant="outline"
            label="New Product"
            trailing-icon="i-heroicons-plus"
            @click="onCreate"
          />
        </template>
      </UDashboardToolbar>

      <div class="px-4 py-2 gmsPurpleTitlebar">
        <h2>Lookup</h2>
      </div>

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
          <template v-if="column.kind !== 'actions'">
            <div class="">
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
            <div class="flex w-[53px]">
              {{ column.label }}
            </div>
          </template>
        </template>
        <template  #select-data="{ row }">
          <UTooltip v-if="row.CODE != 'Inactive'" text="Select" >
            <UCheckbox
              @change="onMultipleSelect(row)"
            />
          </UTooltip>
        </template>
        <template #edit-data="{ row }">
          <UTooltip text="Edit" >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="onEdit(row)"
            />
          </UTooltip>
        </template>
        <template #delete-data="{ row }">
          <UTooltip text="Delete" >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="onDelete(row)"
            />
          </UTooltip>
        </template>
        
      </UTable>

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
  <!-- New Product Detail Modal -->
  <UDashboardModal
  v-model="modalMeta.isProductModalOpen"
  :title="modalMeta.modalTitle"
  :ui="{
    title: 'text-lg text-white',
    header: {
      base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
    },
    body: { base: 'mt-0 gap-y-0 gms-modalForm' },
    width: 'w-[1250px] sm:max-w-9xl',
  }"
>
  <ProductsProductForm
    @close="handleModalClose"
    @save="handleModalSave"
    :selected-product="gridMeta.selectedProductId"
    :is-modal="true"
  />
  </UDashboardModal>


</template>
<style scoped></style>
