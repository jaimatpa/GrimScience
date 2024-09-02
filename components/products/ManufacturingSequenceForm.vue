<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedProduct: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});

// Retrieve the user cookie
const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

// Parse the JSON string into an object
// const userData = user ? JSON.parse(user) : null;
// console.log(userData)
const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const JobExist = ref(true);
const isLoading = ref(false);
const perTypes = ref([]);
const totalHours = ref("0");
const subScheduleHrs = ref("0");
const workCenters = ref([]);
const formData = reactive({
  UniqueID: null,
  Number: null,
  week: null,
  Operation: null,
  WorkCenter: null,
  Hours: null,
});

const editInit = async () => {
  loadingOverlay.value = true;
  await getOperations();
  await propertiesInit();
  loadingOverlay.value = false;
};

const getOperations = async () => {
  await useApiFetch("/api/products/productoperations/"+props.selectedProduct, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        prodOperationGridMeta.value.operations = response._data.body.items;
        totalHours.value = response._data.body.totalHours
      }
    },
    onResponseError() {
      prodOperationGridMeta.value.operations = [];
    },
  });
};

const propertiesInit = async () => {
  loadingOverlay.value = true;

  // get operationList users
  await useApiFetch("/api/jobs/operations/workcenter", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        workCenters.value = response._data.body;
      }
    },
    onResponseError() {
      workCenters.value = [];
    },
  });

  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.Operation) errors.push({ path: 'Operation', message: 'Please enter operation.' })
  if (!state.week) errors.push({ path: 'week', message: 'Please enter a week.' })
  if (!state.WorkCenter) errors.push({ path: 'WorkCenter', message: 'Please entter a workcenter.' })
  if (!state.Hours) errors.push({ path: 'Hours', message: 'Please entter a hours.' })
  return errors
}
const handleClose = async () => {
  if (organizationFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (prodOperationGridMeta.value.selectedOperation === null) {
    // Create New Operation
    isLoading.value = true;
    await useApiFetch("/api/products/productoperations/create", {
      method: "POST",
      body: {
        data: {...event.data, skills: skillGridMeta.value.skills, prodID : props.selectedProduct, username},
      },
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
    handleClearCick()
    await getOperations()
  } else {
    // Edit Operation
    isLoading.value = true;
    await useApiFetch("/api/products/productoperations/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
      method: "PUT",
      body: {
        data: {...event.data, skills: skillGridMeta.value.skills, prodID : props.selectedProduct, username},
      },
      onResponse({ response }) {
        if (response.status === 200) {
          isLoading.value = false;
          prodOperationGridMeta.value.operations = response._data.body.items;
          totalHours.value = response._data.body.totalHours;
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
    handleClearCick()
    await getOperations()
  }
  emit("save");
};

const handleProdOperationSelect = async (row) => {
  prodOperationGridMeta.value.selectedOperation = row
  prodOperationGridMeta.value.operations.forEach((op) => {
    if (op.UniqueID === row.UniqueID) {
      op.class = "bg-gray-200";
    } else {
      delete op.class;
    }
  });
  const data = prodOperationGridMeta.value.selectedOperation;
  formData.UniqueID = data.UniqueID;
  formData.Number = data.Number;
  formData.week = data.week;
  formData.Operation = data.Operation;
  formData.WorkCenter = data.WorkCenter;
  formData.Hours = data.Hours;

  stepsGridMeta.value.isLoading = true;

  await useApiFetch("/api/products/operationsteps/"+data.UniqueID, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        stepsGridMeta.value.steps = response._data.body.steps;
      }
    },
    onResponseError() {
      stepsGridMeta.value.steps = [];
    },
  });

  stepsGridMeta.value.isLoading = false;

  skillGridMeta.value.isLoading = true;

  await useApiFetch("/api/products/operationskills/"+data.UniqueID, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        skillGridMeta.value.skills = response._data.body.skills;
      }
    },
    onResponseError() {
      skillGridMeta.value.skills = [];
    },
  });

  skillGridMeta.value.isLoading = false;

};

const handleClearCick = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
  });
  prodOperationGridMeta.value.selectedOperation = null
  stepsGridMeta.value.selectedStep = null
  skillGridMeta.value.selectedSkill = null
  stepsGridMeta.value.steps = []
  skillGridMeta.value.skills = []
};

const handleDeleteClick = async () => {

  if(prodOperationGridMeta.value.selectedOperation !== null){
    loadingOverlay.value = true
    await useApiFetch("/api/products/productoperations/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
      method: "DELETE",
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
    handleClearCick()
    await getOperations()
    loadingOverlay.value = false
  }
  
};

const prodOperationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Number",
      label: "#",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "Operation",
      label: "Operation",
    },
    {
      key: "WorkCenter",
      label: "Work Center",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
    {
      key: "material",
      label: "Material",
    },

  ],
  operations: [],
  selectedOperation: null,
  isLoading: false,
});

const stepsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Step",
      label: "Step",
    },
    {
      key: "Description",
      label: "Desc",
    },
  ],
  steps: [],
  selectedStep: null,
  isLoading: false,
});

const skillGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Name",
      label: "Skill",
    },
  ],
  skills: [],
  selectedSkill: null,
  isLoading: false,
});

const modalMeta = ref({
  isPartsModalOpen: false,
  modalTitle: "Parts Listing",
  modalDescription: "View Parts Listing",
  isSkillModalOpen: false,
  isStepInformationModalOpen: false,
});

const handleStepClick = () => {
  if (!prodOperationGridMeta.value.selectedOperation) {
    toast.add({
      title: "Failed",
      description: "Please select the Operation",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  } else {
    modalMeta.value.isStepInformationModalOpen = true;
    modalMeta.value.modalTitle = "Step Information";
    modalMeta.value.modalDescription = "Step Information";
  }
};

const handleSkillClick = () => {
  modalMeta.value.isSkillModalOpen = true;
  modalMeta.value.modalTitle = "Skills ";
  modalMeta.value.modalDescription = "";
};

const handleStepModalClose = () => {
  modalMeta.value.isStepInformationModalOpen = false;
};

const handleSkillModalClose = (data) => {
  skillGridMeta.value.skills = [...skillGridMeta.value.skills,data]
  modalMeta.value.isSkillModalOpen = false
}

const handleModalClose = () => {
  modalMeta.value.isPartsModalOpen = false;
};

const onPartsClick = () => {
  modalMeta.value.isPartsModalOpen = true;
};

if (props.selectedProduct !== null) editInit();
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
      <div class="flex flex-col space-x-4">
        <div class="flex flex-row space-x-3 items-end mb-4 px-4">
          <div class="">
            <UFormGroup label="Number" name="ReportsTo">
              <UInput v-model="formData.Number" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Week" name="Job Qty">
              <UInput v-model="formData.week" type="number" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Operation" name="Job Type">
              <UInput v-model="formData.Operation" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Work Center" name="Unit Material Cost">
              <UInputMenu
                v-model="formData.WorkCenter"
                v-model:query="formData.WorkCenter"
                :options="workCenters"
              />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Hours" name="Relieve Inventory Per">
              <UInput v-model="formData.Hours" type="number" placeholder="" />
            </UFormGroup>
          </div>

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
              icon="i-f7-rays"
              variant="outline"
              color="red"
              :label="'Clear'"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="handleClearCick"
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
              @click="handleDeleteClick"
              truncate
            />
          </div>
        </div>

        <div class="flex">
          <div class="w-3/5">
            <div class="menuBlue text-white py-3 pl-2 opacity-75">
              Manufacturing Secquence
            </div>
            <div class="mt-4">
              <UTable
                :columns="prodOperationGridMeta.defaultColumns"
                :rows="prodOperationGridMeta.operations"
                :ui="{
                  wrapper:
                    'h-[868px] border-2 border-gray-300 dark:border-gray-700',
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
                @select="handleProdOperationSelect"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex mt-5 justify-between items-center">
              <UButton
                icon="i-heroicons-eye"
                label="Preview Report"
                color="green"
                variant="outline"
                :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
              />
              <UButton
                label="Site Visit"
                color="green"
                variant="outline"
                icon="i-heroicons-clipboard-document-list"
                :ui="{ base: 'w-fit', truncate: 'flex justify-center w-full' }"
              />
              <div class="">
                <UButton
                  icon="i-heroicons-magnifying-glass"
                  variant="outline"
                  color="green"
                  label="View Parts List"
                  :ui="{
                    base: 'w-fit',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                  @click="onPartsClick()"
                />
              </div>
              <div class="flex">
                <span class="text-sm text-right w-full">
                  Total Hrs:
                  {{ totalHours }}</span
                >
              </div>
            </div>
          </div>
          <div class="w-2/5">
            <div class="menuBlue text-white py-3 pl-2 opacity-75">Steps</div>
            <div>
              <div class="pt-4 pl-4">
                <UTable
                  
                  :columns="stepsGridMeta.defaultColumns"
                  :rows="stepsGridMeta.steps"
                  :ui="{
                    wrapper:
                      'h-[368px] border-2 border-gray-300 dark:border-gray-700',
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

              <div class="flex justify-between my-3">
                <div class="flex space-x-3 ml-5">
                  <div>
                    <UButton
                      icon="i-f7-arrowtriangle-down-fill"
                      color="blue"
                      label="Down"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                  <div class="">
                    <UButton
                      icon="i-f7-arrowtriangle-up-fill"
                      color="blue"
                      label="Up"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
                <div class="flex space-x-3">
                  <div class="">
                    <UButton
                      color="blue"
                      label="Refresh"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                  <div class="">
                    <UButton
                      icon="i-heroicons-plus"
                      variant="outline"
                      color="green"
                      label="Create Step"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="handleStepClick"
                      truncate
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="menuBlue text-white py-3 pl-2 opacity-75">
                  Skills
                </div>
                <div class="pt-4 pl-4">
                  <UTable      
                    :columns="skillGridMeta.defaultColumns"
                    :rows="skillGridMeta.skills"
                    :ui="{
                      wrapper:
                        'h-[371px] border-2 border-gray-300 dark:border-gray-700',
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

                <div class="flex justify-between w-full my-3 px-5">
                  <div class="">
                    <UButton
                      icon="i-heroicons-plus"
                      variant="outline"
                      color="green"
                      label="Add Skill"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="handleSkillClick"
                      truncate
                    />
                  </div>
                  <div class="">
                    <UButton
                      icon="i-heroicons-minus"
                      variant="outline"
                      color="red"
                      label="Remove Skill"
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
      </div>
    </UForm>
  </template>

  <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    title="Parts Listing"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ProductsPartList :selected-product="props.selectedProduct"/>
  </UDashboardModal>

  <!-- Product Skill Modal -->
  <UDashboardModal
    v-model="modalMeta.isSkillModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-6xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ProductsSkillForm :is-modal="true" @close="handleSkillModalClose"/>
  </UDashboardModal>

  <!-- New Step Info Modal -->
  <UDashboardModal
    v-model="modalMeta.isStepInformationModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1200px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <ProductsProdStepInformationForm
      :operation-id="prodOperationGridMeta.selectedOperation.UniqueID"
      @close="handleStepModalClose"
      :is-modal="true"
    />
  </UDashboardModal>

</template>
