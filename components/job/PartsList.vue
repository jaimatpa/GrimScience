<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  instanceID: {
    type: [String, Number, null],
    required: true,
  },
});

const toast = useToast();
const router = useRouter();
const partsFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const partList = ref([]);
const formData = reactive({})

const init = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/jobs/operations/mfg/partlist/${props.instanceID}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        console.log(response._data.body)
        partList.value = response._data.body;
      }
    },
    onResponseError({}) {
      partList.value = []
    },
  });

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

const listColumns = ref([
  {
    key: "model",
    label: "Stock #",
  },
  {
    key: "description",
    label: "Desc",
  },
  {
    key: "quantity",
    label: "Qty",
  },
  {
    key: "inventoryunit",
    label: "Inv. Unit",
  },
  {
    key: "inventorycost",
    label: "Inv. Cost",
  },
  {
    key: "totalCost",
    label: "Total",
  },
  {
    key: "laborHours",
    label: "Sub Ass Hrs",
  },
]);

const excelExport = async () => {
  location.href = `/api/jobs/exportpartlist?id=${props.instanceID}`;
};

init();

</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
    <div class="w-full flex flex-col p-3">
      <div class="w-full ">
        <UTable
          :rows="partList"
          :columns="listColumns"
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
        <div class="pt-3">
          <UButton
            variant="outline"
            color="green"
            label="Generate Excel"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            @click="excelExport"
            truncate
          />
        </div>
       
      </div>
    </div>
  </UForm>
</template>
