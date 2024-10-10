<script lang="ts" setup>
import type { UTableColumn } from "~/types";
import Loading from 'vue-loading-overlay'
const emit = defineEmits(["close", "select"]);

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
const activeTab = ref("lookup");

const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

function setActiveTab(tab) {
  if(!(tab === "history" && gridMeta.value.selectProduct === null)){
    activeTab.value = tab;
  }
}

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

const revisionColumns = ref([
  {
    key: "TODAY",
    label: "Date",
  },
  {
    key: "CODE",
    label: "Type",
  },
]);

const jobColumns = ref([
  {
    key: "NUMBER",
    label: "Job#",
  },
  {
    key: "DATECLOSED",
    label: "Closed",
  },
]);

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
          revisions.value = response._data.body;
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
const onRevisionSelect = async (row) => {
  gridMeta.value.selectedProductId = row?.UniqueID;
  revisions.value.forEach((pro) => {
    if (pro.UniqueID === row.UniqueID) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });
  gridMeta.value.selectProduct = row;

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
const handleCostCalculation = async () => {
  if (!Number.isNaN(gridMeta.value.selectProduct.SELLINGPRICE)) {
    loadingOverlay.value = true
    await useApiFetch('/api/products/costandprofit/'+gridMeta.value.selectedProductId, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          costCalculation.value = response._data.body;
        }
      }, 
      onResponseError() {
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
      }
    })
    loadingOverlay.value = false
  }
  
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
const handlePartListModal = () => {
  modalMeta.value.isPartsModalOpen = true
}
const handleOperationtModal = () => {
  modalMeta.value.isOperationsModalOpen = true
  modalMeta.value.modalTitle = "Manufacturing Secquence";
  modalMeta.value.modalDescription = `Manufacturing Secquence ${
    gridMeta.value.selectProduct.MODEL ? gridMeta.value.selectProduct.MODEL : gridMeta.value.selectProduct.MODEL
  }`;
}
const handleSerialsModal = () => {
  modalMeta.value.isSerialModalOpen = true
  modalMeta.value.modalTitle = "Serial Record Finished Goods";
  modalMeta.value.modalDescription = "Serial Record" 
}

const handleCloneModal = () => {
  sourceCloneModel.value = null
  modalMeta.value.isCloneModalOpen = true
}

const handleCloneModalClick = async () => {
  if(sourceCloneModel.value){
    loadingOverlay.value = true
    await useApiFetch(`/api/products/productoperations/cloneoperation`, {
      method: 'PUT',
      body: { targetId:sourceCloneModel.value, sourceId:gridMeta.value.selectProduct.MODEL, username },
      onResponse({ response }) {
        if(response.status === 200) {
          sourceCloneModel.value = null
          modalMeta.value.isCloneModalOpen = false
          toast.add({
            title: "Success",
            description: "Instruction cloned successfully",
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
      onResponseError({}) {
        toast.add({
          title: "Failed",
          description: "Failed to clone instructions",
          icon: "i-heroicons-exclamation-circle",
          color: "red",
        });
      }
    });
    loadingOverlay.value = false
  }else{
    toast.add({
      title: "Validation Error",
      description: "Please provide a model",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

const closeCloneModal = () => {
  sourceCloneModel.value = null
  modalMeta.value.isCloneModalOpen = false
}


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

      <UDashboardToolbar v-if="props.isPage">
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

      <div v-if="props.isPage" class="px-4 py-2 gmsPurpleTitlebar">
        <button
          :class="{
            'bg-white text-black': activeTab === 'lookup',
            gmsPurpleTitlebar: activeTab !== 'lookup',
          }"
          @click="setActiveTab('lookup')"
          class="px-4 py-0.5 focus:outline-none rounded-md"
        >
          Lookup
        </button>
        <button
          :class="{
            'bg-white text-black': activeTab === 'history',
            gmsPurpleTitlebar: activeTab !== 'history',
          }"
          @click="setActiveTab('history')"
          class="px-4 py-0.5 ml-2 focus:outline-none rounded-md"
        >
          Product History
        </button>
      </div>

      <UTable
        v-if="activeTab === 'lookup'"
        :rows="gridMeta.products"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
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
        @select="onSelect"
        @dblclick="onDblClick"
      >
      
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.kind !== 'actions'">
            <div class="px-4 py-3.5">
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
            <div class="flex justify-center text-center w-[53px]">
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
      <div v-else class="flex flex-col overflow-y-scroll">
        <div class="grid grid-cols-2 gap-5 px-5">
          <div>
            <span>Revision History</span>
            <UTable
              :columns="revisionColumns"
              :rows="revisions"
              :ui="{
                wrapper: 'h-56 border-2 border-gray-300 dark:border-gray-700',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-1',
                },
              }"
              @select="onRevisionSelect"
              @dblclick="onDblClick"
            />
          </div>
          <div>
            <span>Job History</span>
            <UTable
              :columns="jobColumns"
              :rows="jobHistory"
              :ui="{
                wrapper: 'h-56 border-2 border-gray-300 dark:border-gray-700',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-1',
                },
              }"
            />
          </div>


          <div>
            <span>Cost</span>
            <div class="space-y-4 border-2 p-2">
              <div class="flex flex-row space-x-3">
                
              
                <p class="basis-1/2">Selling Price</p>
              
                <p>$</p>
                <UInput class="basis-1/2"
                disabled
                v-model="gridMeta.selectProduct.SELLINGPRICE"
                  
                />

              </div>
              <div class="flex flex-row space-x-3">
                
                
                <p class="basis-1/2">Suggested Price</p>

                <p>$</p>
                <UInput class="basis-1/2"
                disabled
                  v-model="costCalculation.suggestedPrice"
                />

              </div>

              <div class="flex flex-row space-x-3">
                
                
                <p class="basis-1/3">Product Labor</p>

                <p>$</p>
                <UInput class="basis-1/3"
                disabled
                  v-model="costCalculation.productLabor"
                />



                <UInput class="basis-1/3"
                disabled
                  v-model="costCalculation.productLabourHours"
                />
                <p>hr</p>

              
              
              </div>

              <div class="flex flex-row space-x-3">
                
                
                <p class="basis-1/3">Subassembly Labor</p>
                <p>$</p>
                <UInput class="basis-1/3"
                disabled
                   v-model="costCalculation.subAssemblyLaborCost"
                />

                <UInput class="basis-1/3"
                disabled
                  v-model="costCalculation.subAssemblyLaborHours"
                />
                <p>hr</p>
              
              
              </div>

              <div class="flex flex-row space-x-3 border-t border-gray-300 pt-3">
                
                
                <p class="basis-1/3">Total Labor</p>
                <p>$</p>
                <UInput class="basis-1/3"
                disabled
                  v-model="costCalculation.totalCost"
                />

                <UInput class="basis-1/3"
                disabled
                  v-model="costCalculation.totalHours"
                />
                <p>hr</p>
              
              
              </div>

              <div class="flex flex-row space-x-3 ">
                
                
                <p class="basis-1/3">Material Cost</p>
                <p class="basis-1/3">$ {{ costCalculation.materialCost }}</p>

              </div>

              <div class="flex flex-row space-x-3">
                
                
                <p class="basis-1/3">Total Cost</p>
                <p class="basis-1/3">$ {{ costCalculation.totalCost }}</p>
                

              </div>

              <div class="flex flex-row space-x-3">
                
                
                <p class="basis-1/3">Gross Profit</p>
                <p class="basis-1/3"> $ {{ costCalculation.grossProfit }}</p>
                <p class="basis-1/3">{{ costCalculation.grossProfitPercent }} %</p>

              
              
              </div>

              <div class="flex flex-row space-x-2">
                
              
                <p class="basis-1/2">Units Shipped   YTD = </p>
                <p class="basis-1/2">Total=</p>
              
              
              </div>

            <div class="grid grid-cols-2 gap-4">
              <UButton class="bg-[#9b4b99] text-white hover:bg-[#7f3e7e]" @click="handleOperationtModal" >View Operations</UButton>
              <UButton class="bg-[#9b4b99] text-white hover:bg-[#7f3e7e]" @click="handleCloneModal" >Clone Operations</UButton>
              <UButton class="bg-[#9b4b99] text-white hover:bg-[#7f3e7e]" @click="handlePartListModal" >View Parts List</UButton>
              <UButton class="bg-[#9b4b99] text-white hover:bg-[#7f3e7e]" @click="handleSerialsModal">View Serials</UButton>
              <UButton class="bg-[#9b4b99] text-white hover:bg-[#7f3e7e]" @click="handleCostCalculation" >View Costs</UButton>
            </div>



            </div>
            
          </div>

        </div>
      </div>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div
          v-if="props.isPage && activeTab === 'lookup'"
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
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Product Detail Modal -->
  <UDashboardModal
  v-model="modalMeta.isProductModalOpen"
  :title="modalMeta.modalTitle"
  :ui="{
    title: 'text-lg',
    header: {
      base: 'flex flex-row min-h-[0] items-center',
      padding: 'pt-5 sm:px-9',
    },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1000px] sm:max-w-7xl',
  }"
>
  <ProductsForm
    @close="handleModalClose"
    @save="handleModalSave"
    :selected-product="gridMeta.selectedProductId"
    :is-modal="true"
  />
  </UDashboardModal>

   <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    title="Parts Listing"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ProductsPartList :selected-product="gridMeta.selectedProductId"/>
  </UDashboardModal>

  <!-- Manufacturing Sequnce Modal -->
  <UDashboardModal
    v-model="modalMeta.isOperationsModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ProductsManufacturingSequenceForm :selected-product="gridMeta.selectedProductId" :instance-id="gridMeta.selectProduct.instanceID" />
  </UDashboardModal>

  <!-- Serials Modal -->
  <UDashboardModal
    v-model="modalMeta.isSerialModalOpen"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <MaterialsSerialsSerialList :is-page="true" :productModel="gridMeta.selectProduct.MODEL" />
  </UDashboardModal>

  <!-- Clone Operation Modal -->
  <UDashboardModal
      v-model="modalMeta.isCloneModalOpen"
      :ui="{
        header: {
          base: 'flex flex-row min-h-[0] items-center',
          padding: 'p-0 pt-1',
        },
        body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
        width: 'w-[300px]',
      }"
    >
      <div>
        <div class="">
          <div class="">What model would you like to clone these instructions to?</div>
          
        </div>
        <div class="mt-3">
          <UInput v-model="sourceCloneModel" ></UInput>
        </div>
        
        <div class="flex flex-row-reverse mt-2">
          <div class="min-w-[60px]">
            <UButton
              label="Clone"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              @click="handleCloneModalClick"
              truncate
            />
          </div>
          <div class="min-w-[60px] mr-3">
            <UButton
              label="Cancel"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              truncate
              @click="closeCloneModal"
            />
          </div>
        </div>
      </div>
    </UDashboardModal>

</template>
<style scoped></style>
