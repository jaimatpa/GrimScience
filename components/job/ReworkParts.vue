<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedJob: {
    type: [String, Number, null],
    required: true,
  },
  operationId: {
    type: [String, Number, null],
    required: true,
  }
});

const toast = useToast();
const router = useRouter();
const reworkFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const isLoading = ref(false);
const isQuantityModalOpen = ref(false);
const partQuantity = ref(1);
const totalCost = ref(0)
const category = ref([])
const subCategory = ref([])
const formData = reactive({
  category: null,
  subcategory: null,
  parts: null,
  description: null
});
const date = new Date();
const editInit = async () => {
  loadingOverlay.value = true;

    await useApiFetch("/api/jobs/reworkparts/category", {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          category.value = response._data.body
        }
      },
      onResponseError() {
        category.value = []
      },
    });

    await useApiFetch("/api/jobs/reworkparts/subcategory", {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          subCategory.value = response._data.body
        }
      },
      onResponseError() {
        subCategory.value = []
      },
    });

  loadingOverlay.value = false;
};

const productFilterValues = ref({
  PARTTYPE: null,
  SUBCATEGORY: null,
  MODEL: null,
  DESCRIPTION: null,
});

const propertiesInit = async () => {
  loadingOverlay.value = true;

  await useApiFetch(`/api/jobs/reworkparts/selectedPartinfo`, {
    method: "GET",
    params: { jobId: props.selectedJob ,jobOperationId: props.operationId },
    onResponse({ response }) {
      if (response.status === 200) {
        selectedPartsGridMeta.value.selectedParts = response._data.body
      }
    },
    onResponseError() {
      selectedPartsGridMeta.value.selectedParts = []
    },
  });

  await fetchParts();

  loadingOverlay.value = false;
};

const fetchParts = async () => {
  await useApiFetch(`/api/materials/parts`, {
    method: "GET",
    params: { ...productFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        reworkPartsGridMeta.value.parts = response._data.body;
      }
    },
  });

  await useApiFetch(`/api/materials/categories`, {
    method: "GET",
    params: { partflag: 1 },
    onResponse({ response }) {
      if (response.status === 200) {
        reworkPartsGridMeta.value.defaultColumns.forEach((column: any) => {
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
        reworkPartsGridMeta.value.defaultColumns.forEach((column: any) => {
          if (column.key === "SUBCATEGORY")
            column.filterOptions = [null, ...response._data.body];
        });
      }
    },
  });
};


const handleProductFilterInputChange = async (event, name) => {
  if (productFilterValues.value.hasOwnProperty(name)) {
    productFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchParts();
};


const validate = (state: any): FormError[] => {
  const errors = [];
  return errors;
};
const handleClose = async () => {
  if (reworkFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  const totalAmount = event.data.Cost;
  const numericAmount = parseFloat(totalAmount.replace("$", ""));
  const data = {
    ...event.data,
    Cost: numericAmount,
  };

  if (props.selectedJob === null) {
    // Create New Job
    isLoading.value = true;
    // await useApiFetch("/api/jobs", {
    //   method: "POST",
    //   body: data,
    //   onResponse({ response }) {
    //     if (response.status === 200) {
    //       isLoading.value = false;
    //       toast.add({
    //         title: "Success",
    //         description: response._data.message,
    //         icon: "i-heroicons-check-circle",
    //         color: "green",
    //       });
    //     }
    //   },
    // });
  } else {
    // Update Job
    isLoading.value = true;
    // await useApiFetch(`/api/jobs/${props.selectedJob}`, {
    //   method: "PUT",
    //   body: data,
    //   onResponse({ response }) {
    //     if (response.status === 200) {
    //       toast.add({
    //         title: "Success",
    //         description: response._data.message,
    //         icon: "i-heroicons-check-circle",
    //         color: "green",
    //       });
    //     }
    //   },
    // });
  }
  emit("save");
};

const reworkPartsGridMeta = ref({
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
      label: "Parts#",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      filterable: true,
    },

  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  parts: [],
  selectedPart: null,
  isLoading: false,
});


const selectedPartsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "qty",
      label: "Qty",
    },
    {
      key: "MODEL",
      label: "Parts#",
    },
    {
      key: "DESCRIPTION",
      label: "Description",
    },
    {
      key: "InventoryCost",
      label: "Cost",
    },
    {
      key: "InventoryUnit",
      label: "Unit",
    },
    {
      key: "Amount",
      label: "Amount",
    },
    {
      key: "nonConfermance",
      label: "NonConfermance",
    },

  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  selectedParts: [],
  selectedPart: null,
  isLoading: false,
});

const onPartSelect = async (row) => {
  reworkPartsGridMeta.value.selectedPart = row
};

const onPartDblClick = async () => {
  isQuantityModalOpen.value = true;
};

const onSelectedPartSelect = async (row) => {
  selectedPartsGridMeta.value.selectedPart = row
  selectedPartsGridMeta.value.selectedParts.forEach((part) => {
    if (part.UniqueID === row.UniqueID) {
      part.class = "bg-gray-200";
    } else {
      delete part.class;
    }
  });
}

const handleQuantityClick = async () => {
  if(partQuantity.value > 0) {
    selectedPartsGridMeta.value.selectedParts = [...selectedPartsGridMeta.value.selectedParts,{...reworkPartsGridMeta.value.selectedPart, Amount: (reworkPartsGridMeta.value.selectedPart.InventoryCost *  partQuantity.value).toFixed(2), qty: partQuantity.value }]
    console.log(selectedPartsGridMeta.value.selectedParts)
    isQuantityModalOpen.value = false
    partQuantity.value = 1
  }else {
    toast.add({
      title: "Failed",
      description: "Qunantiy should be more than zero",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }

};

const closeQuantityModal = () => {
  isQuantityModalOpen.value = false
  partQuantity.value = 1
}

const saveReworkParts = async () => {
  loadingOverlay.value = true;

  await useApiFetch(`/api/jobs/reworkparts/savereworkparts`, {
    method: "POST",
    body: { jobId: props.selectedJob ,jobOperationId: props.operationId, parts: selectedPartsGridMeta.value.selectedParts },
    onResponse({ response }) {
      if (response.status === 200) {
          isLoading.value = false;
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
    },
  });

  loadingOverlay.value = false;
};

const removePart = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/jobs/reworkparts/removepart`, {
    method: "DELETE",
    params: { jobId: props.selectedJob ,jobOperationId: props.operationId, partId: selectedPartsGridMeta.value.selectedPart.UniqueID },
    onResponse({ response }) {
      if (response.status === 200) {
          selectedPartsGridMeta.value.selectedParts = response._data.body
          isLoading.value = false;
        }
    },
  });
  loadingOverlay.value = false;
};

 watch(
  () => selectedPartsGridMeta.value.selectedParts,
  () => {
    console.log(selectedPartsGridMeta.value.selectedParts)
    totalCost.value = 0
    selectedPartsGridMeta.value.selectedParts.forEach(part => {
      totalCost.value = totalCost.value + parseFloat(part.Amount)
    })
  },
  { deep: true }
);
propertiesInit();
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col space-x-4">
      <div class="gmsPurpleTitlebar py-3 mb-2 pl-2">Parts Used</div>
      <div class="flex items-end justify-end mb-5">
        <div class="w-[120px]">
          <UButton
            label="Remove"
            class="gmsPurpleTitlebar"
            :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }"
            @click="removePart"
            truncate
          />
        </div>
      </div>

      <div class="flex gap-x-4">
        <div class="w-1/2">
          <UTable
            :columns="reworkPartsGridMeta.defaultColumns"
            :rows="reworkPartsGridMeta.parts"
            :ui="{
              wrapper:
                'h-[300px] border-2 border-gray-300 dark:border-gray-700',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'px-2 py-0',
              },
              td: {
                base: 'h-[31px]',
                padding: 'px-2 py-0',
              },
            }"
            @select="onPartSelect"
            @dblclick="onPartDblClick"

          >
          <template
              v-for="column in reworkPartsGridMeta.defaultColumns"
              v-slot:[`${column.key}-header`]
            >
              <template v-if="!column.filterOptions">
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter
                    @handle-input-change="handleProductFilterInputChange"
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
              <template v-else>
                <div class="px-1 py-1 min-w-[120px]">
                  <CommonSortAndSelectFilter
                    @handle-select-change="handleProductFilterInputChange"
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
                    :value="productFilterValues[column.key]"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                    :filter-options="column.filterOptions"
                  />
                </div>
              </template>
            </template>
            <template #UniqueID-data="{ row }">
              <div class="w-[50px]">
                {{ row.UniqueID }}
              </div>
            </template>

          </UTable>

          <div class="flex">
            <span class="text-sm text-left w-full italic">
              Parts (Double-click To Select)</span
            >
          </div>
        </div>
        <div class="w-1/2">
          <UTable
            :columns="selectedPartsGridMeta.defaultColumns"
            :rows="selectedPartsGridMeta.selectedParts"
            :ui="{
              wrapper:
                'h-[300px] border-2 border-gray-300 dark:border-gray-700',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'px-2 py-0',
              },
              td: {
                base: 'h-[31px]',
                padding: 'px-2 py-0',
              },
            }"
            @select="onSelectedPartSelect"
          >
            <template #empty-state>
              <div></div>
            </template>
          </UTable>

          <div class="flex items-end">
            <span class="text-sm text-right w-full"> Total Cost: {{ totalCost }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-end justify-end mt-5">
        <div class="w-[120px]">
          <UButton
            label="Save"
            class="gmsPurpleTitlebar"
            :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }"
            @click="saveReworkParts"
            truncate
          />
        </div>
      </div>
    </div>
  </UForm>
  <UDashboardModal
      v-model="isQuantityModalOpen"
      :ui="{
        header: {
          base: 'flex flex-row min-h-[0] items-center',
          padding: 'p-0 pt-1',
        },
        body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
        width: 'w-[600px]',
      }"
    >
      <div>
        <div class="flex flex-row space-x-5">
          <div class="flex items-center">How Many Items Would You Like To Place on this Job?</div>
          <div class="flex-1 mr-4">
            <UInput type="number" v-model="partQuantity" ></UInput>
          </div>
        </div>
        <div class="flex flex-row-reverse mt-2">
          <div class="min-w-[60px]">
            <UButton
              label="OK"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              @click="handleQuantityClick"
              truncate
            />
          </div>
          <div class="min-w-[60px] mr-3">
            <UButton
              label="Cancel"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              truncate
              @click="closeQuantityModal"
            />
          </div>
        </div>
      </div>
    </UDashboardModal>
</template>
