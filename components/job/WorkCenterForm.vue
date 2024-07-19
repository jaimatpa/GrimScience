<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  isModal: {
    type: [Boolean],
  },
});

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const WorkCenterExist = ref(true);
const responsibilities = ref([]);
const isLoading = ref(false);
const formData = reactive({
  NAME: null,
  NUMBER: null,
  position: null,
});

onMounted(() => {
  init();
});

const init = async () => {
  loadingOverlay.value = true;

  fetchWorkCenters();
  await useApiFetch(`/api/workcenter/responsibilities`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        responsibilities.value = response._data.body;
      }
    },
    onResponseError({}) {
      responsibilities.value = [];
    },
  });

  loadingOverlay.value = false;
};

const fetchWorkCenters = async () => {
  await useApiFetch(`/api/workcenter`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        WorkCenterExist.value = true;
        workCenterGridMeta.value.options = response._data.body;
      }
    },
    onResponseError({}) {
      WorkCenterExist.value = false;
      workCenterGridMeta.value.options = [];
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
  const data = {
    TimeEntryWithoutJob: headerCheckboxes.value.time.isChecked ? 1 : 0,
    Paid: headerCheckboxes.value.paid.isChecked ? 1 : 0,
    ...event.data,
  };

  if (!workCenterGridMeta.value.selectedWorkCenter) {
    toast.add({
      title: "Failed",
      description: "Please select the Work Center to udpate.",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  } else {
    isLoading.value = true;
    const id = workCenterGridMeta.value.selectedWorkCenter.uniqueID;

    await useApiFetch(`/api/workcenter/${id}`, {
      method: "PUT",
      body: data,
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
    fetchWorkCenters();
    handleClose();
  }

  emit("save");
};

const workCenterGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "NUMBER",
      label: "Number",
    },
    {
      key: "NAME",
      label: "Name",
    },
    {
      key: "res",
      label: "Person Responsibilites",
    },
    {
      key: "position",
      label: "Poistion Responsibility",
    },
  ],
  options: [],
  selectedWorkCenter: null,
  isLoading: false,
});

const handleWorkCenterSelect = (row) => {
  workCenterGridMeta.value.selectedWorkCenter = { ...row, class: "" };
  workCenterGridMeta.value.options.forEach((c) => {
    if (c.uniqueID === row.uniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  const data = workCenterGridMeta.value.selectedWorkCenter;
  console.log("data", data);

  formData.NAME = data.NAME;
  formData.NUMBER = data.NUMBER;
  formData.position = data.position;
  headerCheckboxes.value.time.isChecked = data.TimeEntryWithoutJob;
  headerCheckboxes.value.paid.isChecked = data.Paid;
};

const workCenterColumns = ref([
  {
    key: "serial",
    label: "Workcenter Skills",
  },
]);

const headerCheckboxes = ref({
  time: {
    label: "Time Entry Without Job?",
    isChecked: false,
  },
  paid: {
    label: "Paid?",
    isChecked: false,
  },
});

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
  <template v-if="!props.isModal && !WorkCenterExist">
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
                  <UInput v-model="formData.NUMBER" placeholder="" />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Name" name="Name">
                  <UInput v-model="formData.NAME" placeholder="" />
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
                :columns="workCenterGridMeta.defaultColumns"
                :rows="workCenterGridMeta.options"
                :ui="{
                  wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
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
                @select="handleWorkCenterSelect"
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
                <UInputMenu
                  v-model="formData.position"
                  v-model:query="formData.position"
                  :options="responsibilities"
                />
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
