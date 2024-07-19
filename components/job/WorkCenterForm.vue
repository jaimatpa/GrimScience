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
const formData = reactive({});

const jobFilters = ref({
  JobID: [props.selectedJob],
});

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/jobs/details`, {
    method: "GET",
    params: { ...jobFilters.value },
    onResponse({ response }) {
      if (response.status === 200) {
        JobExist.value = true;
        console.log("response._data.body", response._data.body);

        // for (const key in response._data.body) {
        //   if (response._data.body[key] !== undefined) {
        //     formData[key] = response._data.body[key];
        //   }
        // }
      }
    },
    onResponseError({}) {
      JobExist.value = false;
    },
  });

  //   await propertiesInit();
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
  emit("save");
};

const productColumns = ref([
  {
    key: "serial",
    label: "Number",
  },
  {
    key: "date_serialized",
    label: "Name",
  },
  {
    key: "material_cost",
    label: "Personal Responsibilites",
  },
  {
    key: "material_cost",
    label: "Poistion",
  },
]);

const workCenterColumns = ref([
  {
    key: "serial",
    label: "Workcenter Skills",
  },
]);

const headerCheckboxes = ref({
  field: {
    label: "Time Entry Without Job?",
    isChecked: false,
  },
  open: {
    label: "Paid?",
    isChecked: false,
  },
});

if (props.selectedJob !== null) editInit();
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
      <div class="w-full flex flex-col">
        <div class="grid grid-cols-2 gap-x-4">
          <div class="w-full mt-5">
            <div class="flex space-x-3 justify-between">
              <div class="basis-1/2">
                <UFormGroup label="Number" name="Number">
                  <UInput placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Name" name="Name">
                  <UInput placeholder="" />
                </UFormGroup>
              </div>
            </div>
            <div class="w-full my-3 flex space-x-4">
              <template v-for="checkbox in headerCheckboxes">
                <div class="">
                  <UCheckbox
                    v-model="checkbox.isChecked"
                    :label="checkbox.label"
                  />
                </div>
              </template>
            </div>
            <div class="">
              <UButton
                icon="i-heroicons-document-text"
                type="submit"
                variant="outline"
                color="green"
                label="Save"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                truncate
              />
            </div>
            <div class="mt-4">
              <UTable
                :columns="productColumns"
                :ui="{
                  wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1',
                  },
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
          </div>

          <div class="w-full mt-5">
            <div class="">
              <UFormGroup
                label="Position Responsibilites"
                name="Position Responsibilites"
              >
                <UInputMenu :options="[]" />
              </UFormGroup>
            </div>

            <div class="flex items-end gap-x-4 mt-5">
              <div class="w-3/4">
                <UFormGroup label="Account" name="Account">
                  <UInputMenu :options="[]" />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UButton
                  color="blue"
                  variant="outline"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  label="Load QB"
                  icon="i-heroicons-pencil-square"
                />
              </div>
            </div>

            <div class="mt-4">
              <UTable
                :columns="workCenterColumns"
                :ui="{
                  wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-1',
                  },
                }"
              >
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </template>
</template>
