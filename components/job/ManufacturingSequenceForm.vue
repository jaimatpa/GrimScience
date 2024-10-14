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
  await useApiFetch("/api/jobs/operations/mfg/"+props.instanceId, {
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
    await useApiFetch("/api/jobs/operations/mfg/create", {
      method: "POST",
      body: {
        data: {...event.data, skills: skillGridMeta.value.skills, instanceId : props.instanceId, username},
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
    await useApiFetch("/api/jobs/operations/mfg/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
      method: "PUT",
      body: {
        data: {...event.data, skills: skillGridMeta.value.skills, instanceId : props.instanceId, username},
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

  skillGridMeta.value.isLoading = true;

  await useApiFetch("/api/jobs/operations/mfg/operationskills/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
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

const getOperationSteps = async () => {

  stepsGridMeta.value.isLoading = true;

  await useApiFetch("/api/jobs/operations/mfg/operationsteps/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
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
    await useApiFetch("/api/jobs/operations/mfg/productoperations/"+prodOperationGridMeta.value.selectedOperation.UniqueID, {
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
  isDeleteModalOpen: false
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
    await useApiFetch(`/api/jobs/operations/mfg/operationsteps/upstep`, {
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
    await useApiFetch(`/api/jobs/operations/mfg/operationsteps/downstep`, {
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
  window.open(`/api/jobs/exportoperation/${props.instanceId}`);
};

if (props.selectedJob !== null) editInit();
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
              @click="modalMeta.isDeleteModalOpen = true"
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
                    'h-[668px] border-2 border-gray-300 dark:border-gray-700',
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
                @click="previewOperationReport"
                truncate
              />
              <UButton
                label="Clipboard"
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
                      'h-[668px] border-2 border-gray-300 dark:border-gray-700',
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
                  @select="onStepSelect"
                  @dblclick="onStepDblClick"
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
                      @click="handleStepDown"
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
                      @click="handleStepUp"
                    />
                  </div>
                </div>
                <div class="flex space-x-3">
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
                      @click="handleStepCreate"
                      truncate
                    />
                  </div>
                </div>
              </div>
              <!-- <div>
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
                    @select="onSkillSelect"
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
                      @click="handleRemoveSkill"
                      truncate
                    />
                  </div>
                </div>
              </div> -->
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
    <JobPartsList :instanceID="props.instanceId"/>
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
      :instance-id="prodOperationGridMeta.selectedOperation.instanceid"
      :step-id="stepsGridMeta.selectedStep ? stepsGridMeta.selectedStep.UniqueID : null"
      :next-step="stepsGridMeta.steps.length > 0 ? String.fromCharCode(stepsGridMeta.steps[stepsGridMeta.steps.length - 1].Step.charCodeAt(0) + 1) : 'A'"
      @close="handleStepModalClose"
      @change="getOperationSteps"
      :is-modal="true"
    />
  </UDashboardModal>

  <!-- Product Skill Modal -->
  <!-- <UDashboardModal
    v-model="modalMeta.isSkillModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-6xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobSkillForm :is-modal="true" @close="handleSkillModalClose"/>
  </UDashboardModal> -->

  <!-- New Step Info Modal -->
  <!-- <UDashboardModal
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
      :instance-id="prodOperationGridMeta.selectedOperation.instanceid"
      :step-id="stepsGridMeta.selectedStep ? stepsGridMeta.selectedStep.UniqueID : null"
      :next-step="stepsGridMeta.steps.length > 0 ? String.fromCharCode(stepsGridMeta.steps[stepsGridMeta.steps.length - 1].Step.charCodeAt(0) + 1) : 'A'"
      @close="handleStepModalClose"
      @change="getOperationSteps"
      :is-modal="true"
    />
  </UDashboardModal> -->

  <!-- Delete Confirmation Modal -->
  <UDashboardModal
    v-model="modalMeta.isDeleteModalOpen"
    title="Delete operation"
    description="Are you sure you wish to delete this entire operatin?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
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
