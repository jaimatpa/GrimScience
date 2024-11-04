<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close","copyOp","refreshOperations"]);
const props = defineProps({
  instanceId: {
    type: [String, Number, null],
    required: true,
  },
});

const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

const toast = useToast();
const router = useRouter();
const loadingOverlay = ref(false);
const partsFormInstance = getCurrentInstance();
const operationList = ref([]);
const formData = reactive({})
const selectedOperation = ref(null)

const init = async () => {
  operationList.value = JSON.parse(localStorage.getItem('copyOpList')) ? JSON.parse(localStorage.getItem('copyOpList')) : []
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

const listColumns = ref([
  {
    key: "desc",
    label: "Data",
  },

]);

const onSelect = (row) => {
  selectedOperation.value = { ...row, class: "" };
  operationList.value.forEach((c) => {
    if (c.operation.UniqueID === row.operation.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });
};

const close = () =>{
  emit('close')
}

const copy = () => {
  emit('copyOp')
  operationList.value = JSON.parse(localStorage.getItem('copyOpList'))
}

const clear =() => {
  operationList.value = []
  localStorage.setItem('copyOpList', JSON.stringify(operationList.value) ) 
  
}

const paste = async () => {
  if(selectedOperation.value !== null){
    loadingOverlay.value = true
    await useApiFetch(`/api/products/productoperations/copyoperation`, {
      method: 'PUT',
      params: { targetId:props.instanceId, sourceId:selectedOperation.value.operation.UniqueID, username },
    });
    emit("refreshOperations")
    loadingOverlay.value = false
  }
}

init();

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
  >
    <div class="w-full flex flex-col p-3">
      <div class="w-full mt-5">
        <UTable
          :rows="operationList"
          :columns="listColumns"
          :ui="{
            wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:text-gray dark:bg-[#111827]',
              padding: 'p-1',
            },
     
          }"
          @select="onSelect"
        >
          <template #empty-state>
            <div></div>
          </template>
        </UTable>
      </div>
      <div class="flex justify-between">

        <div class="mt-5">
          <UButton
            variant="outline"
            color="purple"
            label="Copy"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            @click="copy"
            truncate
          />
          <UButton
            class="ml-5"
            variant="outline"
            color="green"
            label="Paste"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            @click="paste"
            truncate
          />
          <UButton
            class="ml-5"
            variant="outline"
            color="red"
            label="Clear Board"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            @click="clear"
            truncate
          />
        </div>

        <div class="mt-5">
          <UButton
            variant="outline"
            color="red"
            label="Close"
            :ui="{
              base: 'w-fit',
              truncate: 'flex justify-center w-full',
            }"
            @click="close"
            truncate
          />
        </div>
       
      </div>
    </div>
  </UForm>
</template>
