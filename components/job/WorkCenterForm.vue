<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);

const toast = useToast();
const router = useRouter();
const workCenterFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const WorkCenterExist = ref(true);
const responsibilities = ref([]);
const isLoading = ref(false);
const workCenters = ref([]);
const props = defineProps({
  selectedEmployee: {
    type: Object,
    required: true,
  },
});

const formData = reactive({
  NAME: null,
  NUMBER: null,
  position: null,
});

onMounted(() => {
  init();
});

const employeeFilters = ref({
  payrollnumber: props?.selectedEmployee?.payrollnumber,
});

const init = async () => {
  loadingOverlay.value = true;

  fetchResponsibilities();
  fetchWorkCenters();
  fetchEmployeeWorkCenters();

  loadingOverlay.value = false;
};

const fetchResponsibilities = async () => {
  await useApiFetch(`/api/workcenter/responsibilities`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        responsibilities.value = response._data.body;
      }
    },
    onResponseError({ }) {
      responsibilities.value = [];
    },
  });
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
    onResponseError({ }) {
      WorkCenterExist.value = false;
      workCenterGridMeta.value.options = [];
    },
  });
};

const fetchEmployeeWorkCenters = async () => {
  await useApiFetch(`/api/employees/workCenter`, {
    method: "GET",
    params: { ...employeeFilters.value },
    onResponse({ response }) {
      if (response.status === 200) {
        response._data.body.forEach((obj) => {
          const workCentersString = obj.WORKCENTERS;

          // Step 2: Extract IDs from string
          const ids = workCentersString
            .split(",")
            .filter((id) => id !== "")
            .map((id) => parseInt(id));

          // Step 3: Collect unique IDs using Set
          ids.forEach((id) => {
            if (!workCenters.value.includes(id)) {
              workCenters.value.push(id.toString());
            }
          });
        });

        for (let i = 0; i < workCenterGridMeta.value.options.length; i++) {
          const responseObject = workCenterGridMeta.value.options[i];

          if (workCenters.value.includes(responseObject.uniqueID)) {
            selected.value.push(responseObject);
          }
        }
      }
    },
    onResponseError({ }) {
      workCenters.value = [];
    },
  });
};

const validate = (state: any): FormError[] => {
  const errors = [];
  return errors;
};

const handleClose = async () => {
  if (workCenterFormInstance?.vnode?.props?.onClose) {
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

  const uniqueIDs = selected.value.map((obj) => obj.uniqueID);
  const result = `,${uniqueIDs.join(",")},`;

  const edata = {
    WORKCENTERS: result,
  };

  if (!workCenterGridMeta.value.selectedWorkCenter) {
    await useApiFetch(`/api/employees/${props?.selectedEmployee?.UniqueID}`, {
      method: "PUT",
      body: edata,
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

    await useApiFetch(`/api/employees/${props?.selectedEmployee?.UniqueID}`, {
      method: "PUT",
      body: edata,
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
const selected = ref([]);

const handleWorkCenterSelect = (row) => {
  const index = selected.value.findIndex(
    (item) => item.uniqueID === row.uniqueID
  );

  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }

  workCenterGridMeta.value.selectedWorkCenter = { ...row, class: "" };
  workCenterGridMeta.value.options.forEach((c) => {
    if (c.uniqueID === row.uniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  const data = workCenterGridMeta.value.selectedWorkCenter;
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
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
    <div class="w-full flex flex-col space-y-2 p-4">
      <div class="flex space-x-2">
        <div class="basis-1/4">
          <UFormGroup label="Number" name="Number">
            <UInput v-model="formData.NUMBER" />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup label="Name" name="Name">
            <UInput v-model="formData.NAME" />
          </UFormGroup>
        </div>
        <div class="basis-1/2">
          <UFormGroup label="Position Responsibilites" name="Position Responsibilites">
            <UInputMenu v-model="formData.position" v-model:query="formData.position" :options="responsibilities" />
          </UFormGroup>
        </div>
      </div>


      <div class="flex space-x-2 items-end">

        <div class="w-1/2 flex flex-col space-y-2">
          <div class="flex space-x-2">
            <template v-for="checkbox in headerCheckboxes">
              <div class="">
                <UCheckbox v-model="checkbox.isChecked" :label="checkbox.label" />
              </div>
            </template>
          </div>
          <div>
            <UButton icon="i-heroicons-document-text" type="submit" variant="outline" color="green" label="Save"
              block />
          </div>

        </div>
        <div class="basis-4/12">
          <UFormGroup label="Account" name="Account">
            <UInputMenu :options="[]" />
          </UFormGroup>
        </div>
        <div class="basis-2/12">
          <UButton color="primary" variant="outline" block label="Load QB" icon="i-heroicons-pencil-square" />
        </div>

      </div>

      <div class="flex space-x-2">
        <div class="w-1/2">
          <UTable v-model="selected" v-model:selected="selected" :columns="workCenterGridMeta.defaultColumns"
            :rows="workCenterGridMeta.options" :ui="{
              wrapper:
                'h-[528px] border-2 border-gray-300 dark:border-gray-700',
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
            }" @select="handleWorkCenterSelect">
            <template #empty-state>
              <div></div>
            </template>
          </UTable>
        </div>
        <div class="w-1/2">
          <div class="">
            <UTable :columns="workCenterColumns" :ui="{
              wrapper:
                'h-[528px] border-2 border-gray-300 dark:border-gray-700',
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white dark:text-gray dark:bg-[#111827]',
                padding: 'p-1',
              },
            }">
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
