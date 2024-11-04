<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";

const emit = defineEmits(["close", "save", "fetchGridData", "onCreate"]);
const props = defineProps({
  isModal: {
    type: Boolean,
  },
  selectedBug: {
    type: Object,
    required: true,
  },
});

const toast = useToast();

const loadingOverlay = ref(false);
const bugExist = ref(true);

const typeList = ref(["Bug", "Quick Fix", "Project"]);

const authorList = ref(["Joseph Grimm", "Leith Stetson"]);

const versionList = ref(["V-1", "V-2", "V-3"]);

const formList = ref([]);
const employeeList = ref([]);

const formData = reactive({
  resolved: null,
  uniqueid: null,
  datea: null,
  formName: null,
  employee: null,
  complaintText: null,
  descr: null,
  dvanceLevels: null,
  cost: null,
  approved: null,
  resolveversion: null,
});

const convertToDate = (dateString) => {
  return dateString ? new Date(dateString) : new Date();
};

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/bugs/${props?.selectedBug?.uniqueid}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        bugExist.value = true;

        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = ["datea"].includes(key)
              ? convertToDate(response._data.body[key])
              : response._data.body[key];
          }
        }
      }
    },
    onResponseError({}) {
      bugExist.value = false;
    },
  });
  propertiesInit();
  loadingOverlay.value = false;
};

const propertiesInit = async () => {
  loadingOverlay.value = true;

  await useApiFetch("/api/bugs/reportedForm", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        formList.value = response._data.body.filter(
          (item: any) => item !== null
        );
      }
    },
    onResponseError() {
      formList.value = [];
    },
  });

  await useApiFetch("/api/auth/employees", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        employeeList.value = response._data.body.filter(
          (item: any) => item !== null
        );
      }
    },
    onResponseError() {
      employeeList.value = [];
    },
  });

  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors: FormError[] = [];

  if (!state.resolved || !["OPEN", "CLOSED"].includes(state.resolved)) {
    errors.push({
      path: "resolved",
      message: 'Status must be either "Open" or "Closed".',
    });
  }
  if (!state.formName) {
    errors.push({ path: "formName", message: "Form Reported is required." });
  }
  if (!state.complaintText || state.complaintText.trim() === "") {
    errors.push({ path: "complaintText", message: "Description is required." });
  }
  if (!state.descr || state.descr.trim() === "") {
    errors.push({ path: "descr", message: "Bug details are required." });
  }

  return errors;
};

const onSubmit = async (event: FormSubmitEvent<any>) => {
  const errors = validate(formData);

  if (errors.length > 0) {
    errors.forEach((error) => {
      toast.add({
        title: "Validation Error",
        description: error.message,
        icon: "i-heroicons-exclamation-triangle",
        color: "red",
      });
    });
    return;
  }

  if (!props.selectedBug) {
    formData.datea = new Date();
  }

  loadingOverlay.value = true;

  const apiUrl = props.selectedBug
    ? `/api/bugs/${props.selectedBug.uniqueid}`
    : "/api/bugs";

  const method = props.selectedBug ? "PUT" : "POST";

  await useApiFetch(apiUrl, {
    method,
    body: event.data,
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

  loadingOverlay.value = false;

  emit("save");
};

const resetForm = () => {
  emit("onCreate");
  formData.resolved = null;
  formData.formName = null;
  formData.employee = null;
  formData.complaintText = null;
  formData.descr = null;
  formData.dvanceLevels = null;
  formData.cost = null;
  formData.approved = null;
  formData.resolveversion = null;
};

const onDelete = async (uniqueid: any) => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/bugs/${uniqueid}`, {
    method: "DELETE",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-trash-solid",
          color: "green",
        });
        emit("fetchGridData");
        loadingOverlay.value = true;
        emit("close");
      }
    },
  });
  loadingOverlay.value = false;
};

if (props?.selectedBug) editInit();
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

    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="border-r-[3px]">
        <h2
          class="flex items-center justify-between px-4 py-2 gmsRedTitlebar border-t"
        >
          Bug Information
        </h2>

        <div class="w-full p-4 flex flex-row space-x-4">
          <div class="flex flex-col space-y-2 w-full">
            <div class="flex flex-row space-x-4 justify-start">
              <UCheckbox
                label="Open"
                v-model="formData.resolved"
                :checked="formData.resolved === 'OPEN'"
                @change="formData.resolved = 'OPEN'"
              />
              <UCheckbox
                label="Closed"
                v-model="formData.resolved"
                :checked="formData.resolved === 'CLOSED'"
                @change="formData.resolved = 'CLOSED'"
              />
            </div>

            <div
              v-if="props.selectedBug"
              class="flex justify-between space-x-2"
            >
              <UFormGroup label="Bug ID" name="uniqueid" class="w-full">
                <UInput v-model="formData.uniqueid" :disabled="true" />
              </UFormGroup>

              <UFormGroup label="Date" name="datea" class="w-full">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    :disabled="true"
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      formData.datea && format(formData.datea, 'dd/MM/yyyy')
                    "
                    variant="outline"
                    class="w-full truncate"
                  />
                  <template #panel="{ close }">
                    <CommonDatePicker
                      v-model="formData.datea"
                      is-required
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>

            <div class="flex justify-between space-x-2">
              <UFormGroup label="Form Reported" name="formName" class="w-full">
                <UInputMenu v-model="formData.formName" :options="formList" />
              </UFormGroup>
              <UFormGroup label="By" name="employee" class="w-full">
                <UInputMenu
                  v-model="formData.employee"
                  :options="employeeList"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Description" name="complaintText" class="w-full">
              <UInput
                v-model="formData.complaintText"
                placeholder="Description"
              />
            </UFormGroup>
            <UFormGroup label="Details of Bug" name="descr" class="w-full">
              <UTextarea
                v-model="formData.descr"
                :rows="6"
                class="w-full font-mono"
                placeholder="Bug Details"
              />
            </UFormGroup>

            <div class="flex justify-between space-x-2">
              <UFormGroup label="Type" name="dvanceLevels" class="w-full">
                <UInputMenu
                  v-model="formData.dvanceLevels"
                  :options="typeList"
                />
              </UFormGroup>
              <UFormGroup label="Cost" name="cost" class="w-full">
                <UInput v-model="formData.cost" placeholder="Cost" />
              </UFormGroup>
            </div>

            <div class="flex justify-between space-x-2">
              <UFormGroup label="Authorized By" name="approved" class="w-full">
                <UInputMenu v-model="formData.approved" :options="authorList" />
              </UFormGroup>
              <UFormGroup
                label="Released in Version"
                name="resolveversion"
                class="w-full"
              >
                <UInputMenu
                  v-model="formData.resolveversion"
                  :options="versionList"
                />
              </UFormGroup>
            </div>

            <div class="flex ms-auto space-x-2 my-4 pt-4">
              <div v-if="!props.selectedBug" class="w-[150px]">
                <UButton
                  label="Add Bug"
                  color="green"
                  variant="outline"
                  icon="i-heroicons-plus"
                  block
                  @click="onSubmit({ data: formData })"
                />
              </div>

              <div v-if="props.selectedBug" class="w-[150px]">
                <UButton
                  label="Modify Bug"
                  color="primary"
                  variant="outline"
                  icon="i-heroicons-pencil-square"
                  block
                  @click="onSubmit({ data: formData })"
                />
              </div>

              <div class="w-[150px]">
                <UButton
                  label="Clear Form"
                  color="red"
                  variant="outline"
                  icon="i-heroicons-x-circle"
                  block
                  @click="resetForm"
                />
              </div>

              <div v-if="props.selectedBug" class="w-[150px]">
                <UButton
                  label="Delete"
                  color="red"
                  variant="outline"
                  icon="i-heroicons-x-circle"
                  block
                  @click="onDelete(formData.uniqueid)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>
