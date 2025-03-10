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
  instanceId: {
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
const copiedOperations = ref([])
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
  loadingOverlay.value = true
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
  loadingOverlay.value = false
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

  getOperationSteps()

  // skillGridMeta.value.isLoading = true;

  // await useApiFetch("/api/products/operationskills/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
  //   method: "GET",
  //   onResponse({ response }) {
  //     if (response.status === 200) {
  //       skillGridMeta.value.skills = response._data.body.skills;
  //     }
  //   },
  //   onResponseError() {
  //     skillGridMeta.value.skills = [];
  //   },
  // });

  // skillGridMeta.value.isLoading = false;

};

const getOperationSteps = async () => {

  stepsGridMeta.value.isLoading = true;

  await useApiFetch("/api/products/operationsteps/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        stepsGridMeta.value.steps = response._data.body.steps;
        if(stepsGridMeta.value.selectedStep !== null){
          stepsGridMeta.value.steps.forEach((step) => {
          if (step.UniqueID === stepsGridMeta.value.selectedStep.UniqueID) {
            step.class = "bg-gray-200";
          } else {
            delete step.class;
          }
        });
        }
        
      }
    },
    onResponseError() {
      stepsGridMeta.value.steps = [];
    },
  });

  stepsGridMeta.value.isLoading = false;
}



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
    modalMeta.value.isDeleteModalOpen = false
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
  isDeleteModalOpen: false,
  isClipboardModalOpen: false
});

const handleStepCreate = () => {
  stepsGridMeta.value.selectedStep = null

  if (prodOperationGridMeta.value.selectedOperation == null) {
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

const onStepSelect = (row) => {
  stepsGridMeta.value.selectedStep = row
  stepsGridMeta.value.steps.forEach((step) => {
    if (step.UniqueID === row.UniqueID) {
      step.class = "bg-gray-200";
    } else {
      delete step.class;
    }
  });
}

const onStepDblClick = () => {
  if (!stepsGridMeta.value.selectedStep == null) {
    toast.add({
      title: "Failed",
      description: "Please select a step",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  } else {
    modalMeta.value.isStepInformationModalOpen = true;
    modalMeta.value.modalTitle = "Step Information";
    modalMeta.value.modalDescription = "Step Information";
  }
}

const handleStepUp = async () => {
  if(stepsGridMeta.value.selectedStep !== null){
    await useApiFetch(`/api/products/operationsteps/upstep`, {
      method: 'PUT',
      body: { stepId: stepsGridMeta.value.selectedStep.UniqueID, planId: prodOperationGridMeta.value.selectedOperation.UniqueID },
      onResponse({ response }) {
        getOperationSteps()
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: "Step up successfully",
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
      onResponseError({}) {
        toast.add({
          title: "Failed",
          description: "Failed to move step",
          icon: "i-heroicons-exclamation-circle",
          color: "red",
        });
      }
    });
  }else{
    toast.add({
      title: "Failed",
      description: "Please select a step",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
  
}

const handleStepDown = async () => {
  if(stepsGridMeta.value.selectedStep !== null){
    await useApiFetch(`/api/products/operationsteps/downstep`, {
      method: 'PUT',
      body: {stepId: stepsGridMeta.value.selectedStep.UniqueID, planId: prodOperationGridMeta.value.selectedOperation.UniqueID },
      onResponse({ response }) {
        getOperationSteps()
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: "Step down successfully",
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
      onResponseError({}) {
        toast.add({
          title: "Failed",
          description: "Failed to move step",
          icon: "i-heroicons-exclamation-circle",
          color: "red",
        });
      }
    });
  }else{
    toast.add({
      title: "Failed",
      description: "Please select a step",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
  
}

const handleStepModalClose = () => {
  modalMeta.value.isStepInformationModalOpen = false;
};

const handleSkillClick = () => {
  modalMeta.value.isSkillModalOpen = true;
  modalMeta.value.modalTitle = "Skills ";
  modalMeta.value.modalDescription = "";
};

const onSkillSelect = (row) => {
  skillGridMeta.value.selectedSkill = row
  skillGridMeta.value.skills.forEach((skill) => {
    if (skill.UniqueID === row.UniqueID) {
      skill.class = "bg-gray-200";
    } else {
      delete skill.class;
    }
  });
}

const handleRemoveSkill = () => {
  if(skillGridMeta.value.selectedSkill !== null){
    skillGridMeta.value.skills =  skillGridMeta.value.skills.filter(skill => {
      return skill.UniqueID !== skillGridMeta.value.selectedSkill.UniqueID
    })
  }else{
    toast.add({
      title: "Failed",
      description: "Please select a operation and skill",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}


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

const previewOperationReport = () => {
  window.open(`/api/products/exportoperation/${props.instanceId}`);
};

const handleClipboardClose = () => {
  modalMeta.value.isClipboardModalOpen = false;
};

const handleCopyOp = () => {
  copiedOperations.value = [...copiedOperations.value, {instanceId: props.instanceId, operation: prodOperationGridMeta.value.selectedOperation, desc: prodOperationGridMeta.value.selectedOperation.Operation  }]
  localStorage.setItem('copyOpList', JSON.stringify(copiedOperations.value) ) 
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
      :name="'Manufacturing sequence not found'"
      :message="'The operations you are looking for does not exist'"
      :to="'/employees/organization'"
    />
  </template>
  <template v-else>
    <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">

      <div class="flex flex-col">

        <div class="flex flex-col space-y-2">
          <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
            <h2 class="flex items-center">Operation</h2>
          </div>
          <div class="flex flex-row px-4 space-x-2">
            <div class="w-2/3 flex space-x-2">
              <div class="basis-1/6">
                <UFormGroup label="Number" name="ReportsTo">
                  <UInput v-model="formData.Number" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-1/6">
                <UFormGroup label="Week" name="Job Qty">
                  <UInput v-model="formData.week" type="number" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-2/6">
                <UFormGroup label="Operation" name="Job Type">
                  <UInput v-model="formData.Operation" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-1/6">
                <UFormGroup label="Work Center" name="Unit Material Cost">
                  <UInputMenu v-model="formData.WorkCenter" v-model:query="formData.WorkCenter"
                    :options="workCenters" />
                </UFormGroup>
              </div>
              <div class="basis-1/6">
                <UFormGroup label="Hours" name="Relieve Inventory Per">
                  <UInput v-model="formData.Hours" type="number" placeholder="" />
                </UFormGroup>
              </div>

            </div>
            <div class="w-1/3 flex space-x-2 items-end">

              <div class="w-1/3">
                <UButton icon="i-heroicons-document-text" type="submit" variant="outline" color="green" label="Save"
                  block />
              </div>

              <div class="w-1/3">
                <UButton icon="i-f7-rays" variant="outline" color="red" label="Clear" @click="handleClearCick" block />
              </div>

              <div class="w-1/3">
                <UButton icon="i-heroicons-minus-circle" variant="outline" color="red" label="Delete"
                  @click="modalMeta.isDeleteModalOpen = true" block />
              </div>

            </div>

          </div>
        </div>

      </div>

      <div class="w-full flex border-t-[3px] border-black border-solid">

        <div class="w-2/3 border-r-[3px] border-black border-solid flex flex-col space-y-2">
          <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
            <h2 class="flex items-center">Manufacturing Sequence</h2>
          </div>
          <div class="px-4 py-2 flex flex-col space-y-2">
            <div>
              <UTable :columns="prodOperationGridMeta.defaultColumns" :rows="prodOperationGridMeta.operations" :ui="{
                wrapper:
                  'h-[600px] border-2 border-gray-300 dark:border-gray-700',
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
              }" @select="handleProdOperationSelect">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex space-x-2">
              <div class="w-1/4">
                <UButton icon="i-heroicons-eye" label="Preview Report" color="primary" variant="outline"
                  @click="previewOperationReport" block />
              </div>
              <div class="w-1/4">
                <UButton label="Clipboard" color="primary" variant="outline" icon="i-heroicons-clipboard-document-list"
                  block @click="modalMeta.isClipboardModalOpen = true" />
              </div>
              <div class="w-1/4">
                <UButton icon="i-heroicons-magnifying-glass" variant="outline" color="primary" label="View Parts List"
                  block @click="onPartsClick()" />
              </div>
              <div class="w-1/4">
                <div class="flex">
                  <span class="text-sm text-right w-full">
                    Total Hrs:
                    {{ totalHours }}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div class="w-1/3 flex flex-col space-y-2">
          <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
            <h2 class="flex items-center">Steps</h2>
          </div>
          <div class="px-4 py-2 flex flex-col space-y-2">
            <div>
              <UTable :columns="stepsGridMeta.defaultColumns" :rows="stepsGridMeta.steps" :ui="{
                wrapper:
                  'h-[600px] border-2 border-gray-300 dark:border-gray-700',
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
              }" @select="onStepSelect" @dblclick="onStepDblClick">
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>

            <div class="flex space-x-2">
              <div class="w-2/3 flex space-x-2">
                <div class="basis-1/4">
                  <UButton icon="i-f7-arrowtriangle-down-fill" color="blue" label="Down" @click="handleStepDown"
                    block />
                </div>
                <div class="basis-1/4">
                  <UButton icon="i-f7-arrowtriangle-up-fill" color="blue" label="Up" @click="handleStepUp" block />
                </div>
                <div class="basis-1/4"></div>
                <div class="basis-1/4">
                  <UButton color="blue" label="Refresh" block />
                </div>
              </div>
              <div class="w-1/3">
                <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Create Step" block
                  @click="handleStepCreate" />
              </div>

            </div>
          </div>
        </div>



        <!-- <div class="flex flex-col space-y-2">
        <div class="flex justify-between px-4 py-2 gmsBlueTitlebar">
        <h2 class="flex items-center">Skills</h2>
        </div>
        <div class="flex flex-col px-4 pt-2 space-y-2">
        <div>
          <UTable :columns="skillGridMeta.defaultColumns" :ui="{
            wrapper:
              'h-[200px] border-2 border-gray-300 dark:border-gray-700',
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
          }">
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
        </div>
        <div class="flex space-x-2 justify-between">
          <div class="basis-1/3">
            <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Add Skill" block
              @click="handleSkillClick" />
          </div>

          <div class="basis-1/3">
            <UButton icon="i-heroicons-minus" variant="outline" color="red" label="Remove Skill" block />
          </div>
        </div>
        </div>
        </div> -->

      </div>

    </UForm>
  </template>

  
  <CommonMfgClipboard 
    v-if="modalMeta.isClipboardModalOpen" 
    :instanceId="props.instanceId" 
    @close="handleClipboardClose"
    @copyOp = "handleCopyOp"
    @refreshOperations = "getOperations"
  />

  <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    title="Parts Listing"
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1000px] sm:max-w-9xl',
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
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1200px] sm:max-w-9xl',
    }"
  >
    <ProductsProdStepInformationForm
      :operation-id="prodOperationGridMeta.selectedOperation.UniqueID"
      :instance-id="prodOperationGridMeta.selectedOperation.instanceid"
      :step-id="stepsGridMeta.selectedStep ? stepsGridMeta.selectedStep.UniqueID : null"
      :next-step="stepsGridMeta.steps.length > 0 ? String.fromCharCode(stepsGridMeta.steps[stepsGridMeta.steps.length - 1].Step.charCodeAt(0) + 1) : 'A'"
      @close="handleStepModalClose"
      @change="getOperationSteps"
      :is-modal="true"
    />
  </UDashboardModal>

  <!-- Delete Confirmation Modal -->
  <UDashboardModal
    v-model="modalMeta.isDeleteModalOpen"
    title="Delete operation"
    description="Are you sure you wish to delete this entire operatin?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      title:'text-black',
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-14'
      } as any,
      width: 'w-[500px]',
    }"
  >
    <template #footer>
      <UButton
        color="red"
        label="Delete"
        :loading="loadingOverlay"
        @click="handleDeleteClick"
      />
      <UButton
        color="white"
        label="Cancel"
        @click="modalMeta.isDeleteModalOpen = false"
      />
    </template>
  </UDashboardModal>

</template>
