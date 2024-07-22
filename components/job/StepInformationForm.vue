<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  operationId: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});

onMounted(() => {
  propertiesInit();
});

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const JobExist = ref(true);
const isLoading = ref(false);
const workCenters = ref([]);
const isQuantityModalOpen = ref(false);
const isKeyModalOpen = ref(false);
const formData = reactive({
  Description: null,
  notes: null,
});

const productFilterValues = ref({
  PARTTYPE: null,
  SUBCATEGORY: null,
  MODEL: null,
  DESCRIPTION: null,
});

const propertiesInit = async () => {
  loadingOverlay.value = true;

  await fetchParts();

  loadingOverlay.value = false;
};

const fetchParts = async () => {
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

const validate = (state: any): FormError[] => {
  const errors = [];
  return errors;
};
const handleClose = async () => {
  if (organizationFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  console.log("ccccc");
  console.log("props.operationId", props.operationId);

  // Create New Step
  isLoading.value = true;
  console.log("in api");

  await useApiFetch("/api/workcenter/steps", {
    method: "POST",
    body: event.data,
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

  emit("save");
};

const partsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "PARTTYPE",
      label: "Category",
    },
    {
      key: "SUBCATEGORY",
      label: "SubCategory",
    },
    {
      key: "MODEL",
      label: "Number",
    },
    {
      key: "DESCRIPTION",
      label: "Description",
    },
  ],
  parts: [],
  selectedPart: null,
  isLoading: false,
});

const partsStockGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Number",
      label: "Stock #",
    },
    {
      key: "week",
      label: "Description",
    },
    {
      key: "Operation",
      label: "Qty",
    },
    {
      key: "WorkCenter",
      label: "Unit",
    },
    {
      key: "WorkCenter",
      label: "Key",
    },
  ],
  parts: [],
  selectedPart: null,
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
  ],
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  products: [],
  selectedProduct: null,
  isLoading: false,
});

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
  fetchParts();
};

const handleProductFilterInputChange = async (event, name) => {
  if (productFilterValues.value.hasOwnProperty(name)) {
    productFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchParts();
};

const onProductDblClick = async () => {
  // if(inventoryGridMeta.value.selectedInventory){
  isQuantityModalOpen.value = true;
  //   updatedHand.value = productGridMeta.value.selectedProduct.OnHand
  // } else {
  //   toast.add({
  //     title: "",
  //     description: "Select inventory transaction.",
  //     icon: 'i-heroicons-exclamation-triangle',
  //     color: 'yellow'
  //   })
  // }
};

const stepGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "step",
      label: "Name",
    },
    {
      key: "step",
      label: "File",
    },
  ],
  steps: [],
  selectedStep: null,
  isLoading: false,
});

const onProductSelect = async (row) => {
  productGridMeta.value.selectedProduct = row;
};
const handleQuantityClick = () => {
  isKeyModalOpen.value = true;
};

const handleKeyModalClick = () => {
  console.log("ccccc key");
};
// if (props.selectedJob !== null) editInit();
// else propertiesInit();
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
  <template v-if="!props.isModal && !JobExist">
    <CommonNotFound
      :name="'Organization not found'"
      :message="'The organization you are looking for does not exist'"
      :to="'/employees/organization'"
    />
  </template>
  <template v-else>
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="flex flex-col">
        <div class="menuBlue text-white py-3 pl-2 opacity-75">Details</div>

        <div class="flex">
          <div class="w-1/2">
            <div class="flex flex-row space-x-3 items-end mb-4 px-4">
              <div class="">
                <UFormGroup label="Step" name="Unit Material Cost">
                  <UInput type="file" size="sm" icon="i-heroicons-folder" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="Description" name="ReportsTo">
                  <UInput v-model="formData.Description" placeholder="" />
                </UFormGroup>
              </div>
            </div>
            <UTable
              :columns="stepGridMeta.defaultColumns"
              :ui="{
                wrapper:
                  'h-[268px] border-2 border-gray-300 dark:border-gray-700',
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
            >
              <template #empty-state>
                <div></div>
              </template>
            </UTable>
            <div class="flex justify-between space-x-3 my-4">
              <div class="">
                <UButton
                  color="blue"
                  label="Remove"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="">
                <UButton
                  color="blue"
                  label="View Drawing"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <div class="pt-4 pl-4 mt-7">
              <div class="">
                <UFormGroup label="Notes" name="ReportsTo">
                  <UTextarea
                    v-model="formData.notes"
                    :rows="13"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
              <div class="flex justify-between my-4">
                <div class="w-[120px]">
                  <UButton
                    icon="i-heroicons-document-text"
                    type="submit"
                    variant="outline"
                    color="green"
                    label="Save"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
                <div class="w-[120px]">
                  <UButton
                    icon="i-heroicons-minus-circle"
                    variant="outline"
                    color="red"
                    label="Delete"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full">
        <div class="menuBlue text-white py-3 pl-2 opacity-75">
          Parts Required
        </div>

        <div class="flex">
          <div class="w-1/2">
            <!-- <div class="flex flex-row space-x-3 items-end mb-4 px-4">
              <div class="">
                <UFormGroup label="Part Lookup" name="Unit Material Cost">
                  <UInputMenu :options="[]" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="" name="Unit Material Cost">
                  <UInputMenu :options="[]" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="" name="ReportsTo">
                  <UInput placeholder="" />
                </UFormGroup>
              </div>
              <div class="">
                <UFormGroup label="" name="Job Qty">
                  <UInput placeholder="" />
                </UFormGroup>
              </div>
            </div> -->
            <div class="mt-5">
              <UTable
                :rows="productGridMeta.products"
                :columns="productGridMeta.defaultColumns"
                :loading="productGridMeta.isLoading"
                class="w-full"
                :ui="{
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
                }"
                :empty-state="{
                  icon: 'i-heroicons-circle-stack-20-solid',
                  label: 'No items.',
                }"
                @select="onProductSelect"
                @dblclick="onProductDblClick"
              >
                <template
                  v-for="column in productGridMeta.defaultColumns"
                  v-slot:[`${column.key}-header`]
                >
                  <template v-if="!column.filterOptions">
                    <div class="px-1 py-1">
                      <CommonSortAndInputFilter
                        @handle-sorting-button="handleProductSortingButton"
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
                        @handle-sorting-button="handleProductSortingButton"
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
                <!-- <template #edit-data="{row}">
                <UTooltip text="Detail" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onInventoryEdit(row)"/>
                </UTooltip>
              </template>
              <template #delete-data="{row}">
                <UTooltip text="Delete" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)"/>
                </UTooltip>
              </template> -->
              </UTable>
            </div>

            <!-- <UTable
              :columns="partsGridMeta.defaultColumns"
              :rows="partsGridMeta.parts"
              :ui="{
                wrapper:
                  'h-[268px] border-2 border-gray-300 dark:border-gray-700',
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
            >
              <template #empty-state>
                <div></div>
              </template>
            </UTable> -->
          </div>
          <div class="w-1/2">
            <div class="pl-4 mt-5">
              <UTable
                :columns="partsStockGridMeta.defaultColumns"
                :rows="partsStockGridMeta.parts"
                :ui="{
                  wrapper: 'h-60 border-2 border-gray-300 dark:border-gray-700',
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
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>

            <div class="flex justify-between my-3 px-4">
              <div>
                <span class="text-sm text-left w-full italic">
                  Double-click To View Part</span
                >
              </div>
              <div class="flex space-x-3">
                <div>
                  <UButton
                    color="blue"
                    label="Updata Key"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
                <div class="">
                  <UButton
                    color="blue"
                    label="Updata Qty"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
                <div class="">
                  <UButton
                    color="blue"
                    label="Remove"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
              </div>
            </div>
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
        width: 'w-[300px]',
      }"
    >
      <div>
        <div class="flex flex-row space-x-5">
          <div class="flex items-center">Quantity to Add?</div>
          <div class="flex-1 mr-4">
            <UInput type="number"></UInput>
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
              @click="isQuantityModalOpen = false"
            />
          </div>
        </div>
      </div>
    </UDashboardModal>

    <UDashboardModal
      v-model="isKeyModalOpen"
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
        <div class="flex flex-row space-x-5">
          <div class="flex items-center">Key to Add?</div>
          <div class="flex-1 mr-4">
            <UInput></UInput>
          </div>
        </div>
        <div class="flex flex-row-reverse mt-2">
          <div class="min-w-[60px]">
            <UButton
              label="OK"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              @click="handleKeyModalClick"
              truncate
            />
          </div>
          <div class="min-w-[60px] mr-3">
            <UButton
              label="Cancel"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              truncate
              @click="isKeyModalOpen = false"
            />
          </div>
        </div>
      </div>
    </UDashboardModal>
  </template>
</template>
