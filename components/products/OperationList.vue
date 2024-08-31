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
  selectedProduct: {
    type: [String, Number, null],
    required: true,
  },
  isPage: {
    type: [Boolean, null],
  },
});

const route = useRoute();
const toast = useToast();

const activeTab = ref("lookup");

function setActiveTab(tab) {
  activeTab.value = tab;
}

const headerFilters = ref({
  productline: {
    label: "Product Line",
    filter: "PRODUCTLINE",
    options: [],
  },
});


const loadingOverlay = ref(false);
const revisions = ref([]);
const jobHistory = ref([]);
const multipleProductSelect = ref([]);


const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    
    {
      key: "number",
      label: "#",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "operation",
      label: "Operation",
    },
    {
      key: "workcenter",
      label: "Work Center",
    },
    {
      key: "hours",
      label: "Hours",
    },
    {
      key: "cost",
      label: "Material",
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
  pageSize: 1000,
  totalHours: 0,
  operations: [],
  selectedOperationId: null,
  selectedOperation: null,
  isLoading: false,
});
const modalMeta = ref({
  isOperationModalOpen: false,
  modalTitle: "New Operation",
  isPartsModalOpen: false,
});


const selectedColumns = ref(gridMeta.value.defaultColumns);

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
  }
});

const init = async () => {
  fetchGridData();
};
const fetchGridData = async () => {
  gridMeta.value.isLoading = true
  await useApiFetch("/api/products/productoperations/"+props.selectedProduct, {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.operations = response._data.body.items;
        gridMeta.value.totalHours = response._data.body.totalHours
      }
      gridMeta.value.isLoading = false;
    },
  });
};


const onCreate = () => {
  gridMeta.value.selectedOperationId = null;
  modalMeta.value.modalTitle = "New Product";
  modalMeta.value.isOperationModalOpen = true;
};

const onEdit = (row) => {
  
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

const onSelect = async (row) => {
  // gridMeta.value.selectedOperationtId = row?.UniqueID;

  // gridMeta.value.products.forEach((pro) => {
  //   if (pro.UniqueID === row.UniqueID) {
  //     pro.class = "bg-gray-200";
  //   } else {
  //     delete pro.class;
  //   }
  // });
  // gridMeta.value.selectProduct = row;
  
  // await useApiFetch('/api/products/revisions/'+row?.UniqueID, {
  //   method: 'GET',
  //   onResponse({ response }) {
  //     if(response.status === 200) {
  //       if(response._data.body.length > 0) {
  //         revisions.value = response._data.body;
  //       }
  //     }
  //   }, 
  //   onResponseError() {
  //     revisions.value = []
  //   }
  // })
  // await useApiFetch('/api/products/jobhistory/'+row?.UniqueID, {
  //   method: 'GET',
  //   onResponse({ response }) {
  //     if(response.status === 200) {
  //       if(response._data.body.length > 0) {
  //         jobHistory.value = response._data.body;
  //       }
  //     }
  //   }, 
  //   onResponseError() {
  //     jobHistory.value = []
  //   }
  // })

};

const onRevisionSelect = async (row) => {
  gridMeta.value.selectedOperationId = row?.UniqueID;
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
  if (gridMeta.value.selectedOperationId) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isOperationModalOpen = true;
  }
};

const handleModalClose = () => {
  modalMeta.value.isOperationModalOpen = false;
};
const handleModalSave = async () => {
  handleModalClose();
  fetchGridData();
};

const handlePageChange = async () => {
  fetchGridData();
};

const handlePartListModal = () => {
  modalMeta.value.isPartsModalOpen = true
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
        class="gmsBlueHeader"
        title="Manufacturing Sequence"
      >
      </UDashboardNavbar>


      <UDashboardToolbar v-if="props.isPage">
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup label="Total Hours" name="totalhours">
                <div class="text-center text-bold">
                  {{ gridMeta.totalHours }}
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
        <template #right>
          
          <UButton
            style="--button-color: #15889c;"
            variant="outline"
            label="Preview Report"
          >
          </UButton>
          <UButton
            style="--button-color: #15889c;"
            variant="outline"
            label="View Parts List"
          />
          <UButton
            color="green"
            variant="outline"
            label="Create Operation"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <div v-if="props.isPage" class="px-4 py-2 gmsBlueTitlebar">
        <button
          :class="{
            'bg-white text-black': activeTab === 'lookup',
            gmsBlueTitlebar: activeTab !== 'lookup',
          }"
          @click="setActiveTab('lookup')"
          class="px-4 py-0.5 focus:outline-none rounded-md"
        >
          Operations
        </button>
        <button
          :class="{
            'bg-white text-black': activeTab === 'stepskills',
            gmsBlueTitlebar: activeTab !== 'stepskills',
          }"
          @click="setActiveTab('stepskills')"
          class="px-4 py-0.5 ml-2 focus:outline-none rounded-md"
        >
          Steps & Skills
        </button>
      </div>

      <UTable
        v-if="activeTab === 'lookup'"
        :rows="gridMeta.operations"
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
            :total="gridMeta.operations.length | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>

  <!-- New Operation Detail Modal -->
  <UDashboardModal
  v-model="modalMeta.isOperationModalOpen"
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
    :selected-operation="gridMeta.selectedOperation"
    :is-modal="true"
  />
  </UDashboardModal>


</template>
<style scoped></style>
