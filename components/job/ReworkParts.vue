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
  isModal: {
    type: [Boolean],
  },
});

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const JobExist = ref(true);
const isLoading = ref(false);
const formData = reactive({
  ReportsTo: null,
  Title: null,
  Employee: null,
  JobType: null,
  JobDescription: null,
  WorkCenters: null,

  NUMBER: null,
  QUANTITY: null,
  DATEOPENED: null,
  DATECLOSED: null,
  JOBCLOSED: null,
  jobcat: null,
  jobsubcat: null,
  Cost: null,
  Catagory: null,
  SubCatagory: null,
  ClosedBy: null,
  PerType: null,
  ProductionDate: null,
  ProductionBy: null,
  PART: null,
  ByEmployee: null,
  PRODUCTLINE: null,
  MODEL: null,
});
const date = new Date();
const editInit = async () => {
  loadingOverlay.value = true;

  //   await useApiFetch("/api/jobs/operations", {
  //     method: "GET",
  //     params: { ...operationFilterValues.value },
  //     onResponse({ response }) {
  //       if (response.status === 200) {
  //         prodOperationGridMeta.value.operations = response._data.body;

  //         totalHours.value = response._data.body.reduce(
  //           (sum, job) => sum + parseFloat(job.Hours),
  //           0
  //         );
  //       }
  //     },
  //     onResponseError() {
  //       prodOperationGridMeta.value.operations = [];
  //     },
  //   });

  loadingOverlay.value = false;
};

const propertiesInit = async () => {
  loadingOverlay.value = true;

  // get subJobCat users
  //   await useApiFetch("/api/jobs/jobsubcat", {
  //     method: "GET",
  //     onResponse({ response }) {
  //       if (response.status === 200) {
  //         jobsubcat.value = response._data.body;
  //       }
  //     },
  //     onResponseError() {
  //       jobsubcat.value = [];
  //     },
  //   });

  loadingOverlay.value = false;
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

const prodOperationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "#",
      label: "Category",
    },
    {
      key: "week",
      label: "Sub",
    },
    {
      key: "Operation",
      label: "Parts",
    },
    {
      key: "WorkCenter",
      label: "Description",
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
        <div class="gmsPurpleTitlebar py-3 mb-2 pl-2">Parts Used</div>
        <div class="w-full flex items-center mb-4 gap-x-4">
          <div class="flex flex-row items-center px-0 space-x-4 w-1/2">
            <div class="">
              <UFormGroup label="" name="ReportsTo">
                <UInputMenu :options="[]" />
              </UFormGroup>
            </div>
            <div class="">
              <UFormGroup label="" name="Job Qty">
                <UInputMenu :options="[]" />
              </UFormGroup>
            </div>
            <div class="">
              <UFormGroup label="" name="Job Type">
                <UInput placeholder="" />
              </UFormGroup>
            </div>
            <div class="">
              <UFormGroup label="" name="Unit Material Cost">
                <UInput placeholder="" />
              </UFormGroup>
            </div>
          </div>
          <div class="flex items-end justify-start w-1/2">
            <div class="w-[120px]">
              <UButton
                label="Remove Part"
                class="gmsPurpleTitlebar"
                :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
              />
            </div>
          </div>
        </div>

        <div class="flex gap-x-4">
          <div class="w-1/2">
            <UTable
              :columns="prodOperationGridMeta.defaultColumns"
              :rows="prodOperationGridMeta.operations"
              :ui="{
                wrapper:
                  'h-[168px] border-2 border-gray-300 dark:border-gray-700',
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

            <div class="flex">
              <span class="text-sm text-left w-full italic">
                Parts (Double-click To Select)</span
              >
            </div>
          </div>
          <div class="w-1/2">
            <UTable
              :columns="prodOperationGridMeta.defaultColumns"
              :rows="prodOperationGridMeta.operations"
              :ui="{
                wrapper:
                  'h-[168px] border-2 border-gray-300 dark:border-gray-700',
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

            <div class="flex items-end">
              <span class="text-sm text-right w-full"> Total Cost: 0</span>
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
              truncate
            />
          </div>
        </div>
      </div>
    </UForm>
  </template>
</template>
