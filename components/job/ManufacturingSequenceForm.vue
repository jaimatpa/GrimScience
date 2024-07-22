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
});

const toast = useToast();
const router = useRouter();
const manufacturingFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const isLoading = ref(false);
const totalHours = ref("0");
const workCenters = ref([]);
const formData = reactive({
  UniqueID: null,
  Number: null,
  week: null,
  Operation: null,
  WorkCenter: null,
  Hours: null,
});
const date = new Date();
const editInit = async () => {
  loadingOverlay.value = true;
  await getOperations();
  await propertiesInit();
  loadingOverlay.value = false;
};

const getOperations = async () => {
  await useApiFetch("/api/jobs/operations", {
    method: "GET",
    params: { ...operationFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        prodOperationGridMeta.value.operations = response._data.body;

        totalHours.value = response._data.body.reduce(
          (sum, job) => sum + parseFloat(job.Hours),
          0
        );
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
  const errors = [];
  return errors;
};
const handleClose = async () => {
  if (manufacturingFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  console.log("ccccc");

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
    await useApiFetch(`/api/jobs/operations/${formData.UniqueID}`, {
      method: "PUT",
      body: event.data,
      onResponse({ response }) {
        if (response.status === 200) {
          getOperations();
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
  }
  emit("save");
};

const handleProdOperationSelect = (row) => {
  prodOperationGridMeta.value.selectedOperation = { ...row, class: "" };
  prodOperationGridMeta.value.operations.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });
  const data = prodOperationGridMeta.value.selectedOperation;
  formData.UniqueID = data.UniqueID;
  formData.Number = data.Number;
  formData.week = data.week;
  formData.Operation = data.Operation;
  formData.WorkCenter = data.WorkCenter;
  formData.Hours = data.Hours;
};

const handleClearCick = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
  });
};

const operationFilterValues = ref({
  JobID: props.selectedJob,
});

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
      key: "step",
      label: "Step",
    },
    {
      key: "desc",
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
      key: "step",
      label: "Skill",
    },
  ],
  steps: [],
  selectedStep: null,
  isLoading: false,
});

const modalMeta = ref({
  isPartsModalOpen: false,
  modalTitle: "Parts Listing",
  modalDescription: "View Parts Listing",
  isSkillModalOpen: false,
});

const handleSkillClick = () => {
  modalMeta.value.isSkillModalOpen = true;
  modalMeta.value.modalTitle = "Skills ";
  modalMeta.value.modalDescription = "";
};

const handleModalClose = () => {
  modalMeta.value.isPartsModalOpen = false;
};

const onPartsClick = () => {
  modalMeta.value.isPartsModalOpen = true;
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
            <UInput v-model="formData.Number" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Week" name="Job Qty">
            <UInput v-model="formData.week" type="number" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Operation" name="Job Type">
            <UInput v-model="formData.Operation" />
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
            <UInput v-model="formData.Hours" type="number" />
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
            truncate
          />
        </div>
      </div>

      <div class="flex">
        <div class="w-3/5">
          <div class="menuBlue text-white py-3 pl-2 opacity-75">
            Manufacturing Secquence
          </div>
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
                    truncate
                  />
                </div>
              </div>
            </div>
            <div>
              <div class="menuBlue text-white py-3 pl-2 opacity-75">Skills</div>
              <div class="pt-4 pl-4">
                <UTable
                  :columns="skillGridMeta.defaultColumns"
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

  <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobPartsList
      :selected-job="selectedJob"
      @close="handleModalClose"
      :is-modal="true"
    />
  </UDashboardModal>

  <!-- Job Skill Modal -->
  <UDashboardModal
    v-model="modalMeta.isSkillModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-6xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobSkillForm :is-modal="true" />
  </UDashboardModal>
</template>
