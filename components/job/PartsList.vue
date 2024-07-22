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
const partsFormInstance = getCurrentInstance();
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
  if (partsFormInstance?.vnode?.props.onClose) {
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
    label: "Stock #",
  },
  {
    key: "date_serialized",
    label: "Desc",
  },
  {
    key: "material_cost",
    label: "Qty",
  },
  {
    key: "material_cost",
    label: "Inv. Unit",
  },
  {
    key: "material_cost",
    label: "Inv. Cost",
  },
  {
    key: "material_cost",
    label: "Total",
  },
  {
    key: "material_cost",
    label: "Sub Ass Hrs",
  },
]);

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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="w-full flex flex-col">
      <div class="w-full mt-5">
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
      <div class="flex">
        <div class="mt-5 ml-4">
          <UButton
            variant="outline"
            color="green"
            label="Generate Excel"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
        <div class="mt-5 ml-4">
          <UButton
            icon="i-heroicons-chat-bubble-oval-left-ellipsis"
            variant="outline"
            color="green"
            label="Show Sub Assembly Hours"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
      </div>
    </div>
  </UForm>
</template>
