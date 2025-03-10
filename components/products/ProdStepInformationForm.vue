<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";
import Parts from '~/pages/materials/parts.vue';
const { handleFileInput, files } = useFileStorage();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const emit = defineEmits(["close","change"]);
const props = defineProps({
  operationId: {
    type: [String, Number, null],
    required: true,
  },
  instanceId: {
    type: [String, Number, null],
    required: true,
  },
  stepId:{
    type: [String, Number, null]
  },
  nextStep: {
    type: [String, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});


const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const ProductExist = ref(true);
const isLoading = ref(false);
const isQuantityModalOpen = ref(false);
const isKeyModalOpen = ref(false);
const productQuantity = ref(1);
const productKey = ref(null);
const stepFiles = ref([]);
const deleteFileListId = ref([]);

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

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/products/operationsteps/stepinfo/${props.stepId}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        for (const key in response._data.body.stepInfo) {
          if (response._data.body.stepInfo[key] !== undefined) {
            formData[key] = response._data.body.stepInfo[key]
          }
        }
        partsStockGridMeta.value.parts = response._data.body.parts
        stepGridMeta.value.steps = response._data.body.media
      }
    }, 
    onResponseError({}) {
      toast.add({
        title: "Failed",
        description: "Some error occured",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}

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
  loadingOverlay.value = true
  const formData = new FormData();

  // Prepare step data
  const stepData = {
    stepDescription: event.data.Description,
    stepLetter: props.nextStep,
    planID: props.operationId,
    instanceID: props.instanceId,
    notes: event.data.notes,
    UniqueID: props.stepId
  };


  formData.append('data', JSON.stringify({
    stepData,
    partsList: partsStockGridMeta.value.parts.map(part => ({
      qty: part.qty,
      UniqueID: part.UniqueID,
      key: part.key,
    })),
    username,
    deleteFiles:deleteFileListId.value
  }));

  // Append files to form data
  stepFiles.value.forEach((file) => {
    formData.append('files', file, file.name);
  });

  // Send the form data to the backend
  await useApiFetch("/api/products/operationsteps/stepsave", {
    method: "POST",
    body: formData,
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
    },
  });

  emit("change");
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
      key: "MODEL",
      label: "Stock #",
    },
    {
      key: "DESCRIPTION",
      label: "Description",
    },
    {
      key: "qty",
      label: "Qty",
    },
    {
      key: "UNIT",
      label: "Unit",
    },
    {
      key: "key",
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

const stepGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "name",
      label: "Name",
    },
    {
      key: "file",
      label: "File",
      kind: "actions",
    },
    {
      key: "delete",
      label: "Delete",
      kind: "actions",
    },
  ],
  steps: [],
  selectedStep: null,
  isLoading: false,
});

const modalMeta = ref({
  isPartsLookupModelOpne: false
})

const handleFileUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);
  stepFiles.value = [...stepFiles.value, ...selectedFiles];
  stepGridMeta.value.steps = [...stepGridMeta.value.steps, ...selectedFiles.map(file => ({
    name: file.name,
    uniqueID: file.lastModified
  }))];
}

const removeFile = (id,idx) => {
  if(stepGridMeta.value.steps[idx].path !== undefined){
    deleteFileListId.value = [...deleteFileListId.value, stepGridMeta.value.steps[idx].uniqueID]
  }else{
    stepFiles.value = stepFiles.value.filter(file => {
      return file.lastModified !== id
    })
  }
  stepGridMeta.value.steps = stepGridMeta.value.steps.filter(file => {
    return file.uniqueID !== id
  })
};

const onProductDblClick = async () => {
  partsStockGridMeta.value.selectedPart = null
  isQuantityModalOpen.value = true;
};

const onProductSelect = async (row) => {
  productGridMeta.value.selectedProduct = row
};

const onPartSelect = async (row) => {
  partsStockGridMeta.value.parts.forEach((part) => {
    if (part.UniqueID === row.UniqueID) {
      part.class = "bg-gray-200";
    } else {
      delete part.class;
    }
  });
  partsStockGridMeta.value.selectedPart = row
};

const onPartDblClick = async () => {
  modalMeta.value.isPartsLookupModelOpne = true
};

const handlePartsListClose = async () => {
  modalMeta.value.isPartsLookupModelOpne = false;
}


const handleQuantityClick = () => {
  if(partsStockGridMeta.value.selectedPart){
    const partIndex = partsStockGridMeta.value.parts.findIndex(part => {
      return part.UniqueID === partsStockGridMeta.value.selectedPart.UniqueID
    })
    partsStockGridMeta.value.parts[partIndex].qty = productQuantity.value
    isQuantityModalOpen.value = false
    productKey.value = null
    productQuantity.value = 1
  }else{
    if(productQuantity.value > 0) {
      isKeyModalOpen.value = true;
    }else {
      toast.add({
        title: "Failed",
        description: "Qunantiy should be more than zero",
        icon: "i-heroicons-minus-circle",
        color: "red",
      });
    }
  }
  
};

const handleKeyModalClick = () => {
  if(partsStockGridMeta.value.selectedPart){
    const partIndex = partsStockGridMeta.value.parts.findIndex(part => {
      return part.UniqueID === partsStockGridMeta.value.selectedPart.UniqueID
    })
    partsStockGridMeta.value.parts[partIndex].key = productKey.value
    isKeyModalOpen.value = false
    productKey.value = null
    productQuantity.value = 1
  }else{
    if(productKey.value !== null){
      partsStockGridMeta.value.parts = [...partsStockGridMeta.value.parts,{...productGridMeta.value.selectedProduct, qty: productQuantity.value, key: productKey.value}]
      isKeyModalOpen.value = false
      productKey.value = null
      productQuantity.value = 1
    }else{
      toast.add({
        title: "Failed",
        description: "Please provide a key",
        icon: "i-heroicons-minus-circle",
        color: "red",
      });
    }
  } 
};

const handleUpdateKey = () => {
  if(partsStockGridMeta.value.selectedPart){
    productKey.value = partsStockGridMeta.value.selectedPart.key
    isKeyModalOpen.value = true
  }else{
    toast.add({
      title: "Failed",
      description: "Select a part",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }
}

const handleUpdateQty = () => {
  if(partsStockGridMeta.value.selectedPart){
    productQuantity.value = partsStockGridMeta.value.selectedPart.qty
    isQuantityModalOpen.value = true
  }else{
    toast.add({
      title: "Failed",
      description: "Select a part",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }
}

const handleRemovePart = () => {
  if(partsStockGridMeta.value.selectedPart){
    const newParts = partsStockGridMeta.value.parts.filter(part => {
      return part.UniqueID !== partsStockGridMeta.value.selectedPart.UniqueID
    })
    partsStockGridMeta.value.parts = [...newParts]
  }else{
    toast.add({
      title: "Failed",
      description: "Select a part",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  }
}

const handleDelteStep = async () => {
  await useApiFetch(`/api/products/operationsteps/stepinfo/${props.stepId}`, {
    method: 'DELETE',
    body: { username: username },
    onResponse({ response }) {
      if(response.status === 200) {
        toast.add({
          title: "Success",
          description: "Step deleted successfully",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
        emit('close')
        emit('change')
      }
    },
    onResponseError({}) {
      toast.add({
        title: "Failed",
        description: "Failed to delete step",
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    }
  });
}


const closeQuantityModal = () => {
  isQuantityModalOpen.value = false
  productKey.value = null
  productQuantity.value = 0
}

const closeKeyModal = () => {
  isKeyModalOpen.value = false
  productKey.value = null
  productQuantity.value = 0
}

if (props.stepId !== null) editInit();
else propertiesInit();
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
  <template v-if="!props.isModal && !ProductExist">
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

      <div>

        <div class="flex flex-col space-y-2 pb-3">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Details
          </div>
          
          
        </div>

        <div class="flex flex-col space-y-2">

          <div class="flex">

            <div class="w-1/2 p-3">
              <div class="flex flex-row space-x-3 items-end pb-3">
                <div class="">
                  <UFormGroup label="Step" name="Unit Material Cost">
                    <input
                      type="file"
                      size="sm"
                      icon="i-heroicons-folder"
                      id="file-upload"
                      multiple
                      @input="handleFileInput"
                      @change="handleFileUpload"
                    />
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
                :rows="stepGridMeta.steps"
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
                <template #file-data="{ row }">
                  <UTooltip  text="File">
                    <a 
                      v-if="row.path" 
                      class=" text-blue underline" 
                      :href="row.path" 
                      download
                    >
                      Download
                    </a>
                    <span v-else></span>
                  </UTooltip>
                </template>
                <template #delete-data="{ row , index}">
                  <UTooltip text="Delete" >
                    <UButton
                      color="red"
                      variant="ghost"
                      icon="i-heroicons-minus-circle"
                      @click="removeFile(row.uniqueID, index)"
                    />
                  </UTooltip>
                </template>
              </UTable>
            </div>

            <div class="w-1/2">
              <div class="p-3">
                <div class="">
                  <UFormGroup label="Notes" name="ReportsTo">
                    <UTextarea
                      v-model="formData.notes"
                      :rows="15"
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
                      @click="handleDelteStep"
                      truncate
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>

        <div>
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Parts Required
          </div>
          <div class="w-full px-3 pt-2">
                  <p><b> Part Lookup</b></p>
                </div>
          <div class="flex space-x-4">
           
            <div class="w-1/2">
              
              <div class="py-3 pl-3">
                
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
                </UTable>
              </div>
            </div>

            <div class="w-1/2">
              <div class="py-3 pr-3">
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
                  @select="onPartSelect"
                  @dblclick="onPartDblClick"
                >
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
              </div>

              <div class="flex justify-between px-4">
                <div>
                  <span class="text-sm text-left w-full italic">
                    Double-click To View Part</span
                  >
                </div>
                <div class="flex space-x-3">
                  <div>
                    <UButton
                      color="blue"
                      label="Update Key"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="handleUpdateKey"
                      truncate
                    />
                  </div>
                  <div class="">
                    <UButton
                      color="blue"
                      label="Update Qty"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="handleUpdateQty"
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
                      @click="handleRemovePart"
                      truncate
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      
    </UForm>

    <!-- Parts Modal -->
    <UDashboardModal
      v-model="modalMeta.isPartsLookupModelOpne"
      title="Parts"
      :ui="{
      title: 'text-lg text-white',
        description: 'text-black',
        header: {
          base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
        },
        body: { base: 'mt-0 gap-y-0 gms-modalForm' },
        width: 'w-[1250px] sm:max-w-9xl',
      }"
    >
      <Parts
      :isModal="true" 
      :model="partsStockGridMeta.selectedPart.MODEL"
      @close="handlePartsListClose"
      />
    </UDashboardModal>

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
      <div class="px-6" >
        <div class="flex flex-row space-x-5">
          <div class="flex items-center">Quantity to Add?</div>
          <div class="flex-1 mr-4">
            <UInput type="number" v-model="productQuantity" ></UInput>
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
      <div class="px-6 " >
        <div class="flex flex-row space-x-5">
          <div class="flex items-center">Key to Add?</div>
          <div class="flex-1 mr-4">
            <UInput v-model="productKey" ></UInput>
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
              @click="closeKeyModal"
            />
          </div>
        </div>
      </div>
    </UDashboardModal>
  </template>
</template>
