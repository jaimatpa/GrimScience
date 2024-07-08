<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedOrganization: {
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
const organizaationExist = ref(true);
const isLoading = ref(false);
const formData = reactive({
  ReportsTo: null,
  Title: null,
  Employee: null,
  JobType: "Product",
  JobDescription: null,
  WorkCenters: null,
  
  NUMBER: null,
  DATEOPENED: null,
  DATECLOSED: null,
  jobcat: null,
  jobsubcat: null

});

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/jobs/${props.selectedOrganization}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        organizaationExist.value = true;

        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key];
          }
        }
      }
    },
    onResponseError({}) {
      organizaationExist.value = false;
    },
  });
  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.ReportsTo)
    errors.push({
      path: "ReportsTo",
      message: "Please enter your report name.",
    });
  if (!state.Title)
    errors.push({ path: "Title", message: "Please enter a your title." });
  if (!state.Employee)
    errors.push({ path: "Employee", message: "Please enter your name." });
  // if (!state.JobDescription) errors.push({ path: 'JobDescription', message: 'Please enter your Job Description.' })
  // if (!state.WorkCenters) errors.push({ path: 'WorkCenters', message: 'Please enter your Work Centers.' })
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
  if (props.selectedOrganization === null) {
    // Create Organization
    // isLoading.value = true;
    // await useApiFetch("/api/employees/organization", {
    //   method: "POST",
    //   body: event.data,
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
    // Update Organization
    // await useApiFetch(
    //   `/api/employees/organization/${props.selectedOrganization}`,
    //   {
    //     method: "PUT",
    //     body: event.data,
    //     onResponse({ response }) {
    //       if (response.status === 200) {
    //         toast.add({
    //           title: "Success",
    //           description: response._data.message,
    //           icon: "i-heroicons-check-circle",
    //           color: "green",
    //         });
    //       }
    //     },
    //   }
    // );
  }
  emit("save");
};

// Use a computed property for tabitems
const tabitems = computed(() => [
  {
    slot: "product",
    label: formData.JobType,
  },
  {
    slot: "jobs",
    label:
      formData.JobType === "Product" ? "Sub Assembly Jobs" : "Product Jobs",
  },
  {
    slot: "operations",
    label: "Operation",
  },
]);

const productColumns = ref([
  {
    key: "serial",
    label: "Serial",
  },
  {
    key: "date_serialized",
    label: "Date Serialized",
  },
  {
    key: "material_cost",
    label: "Material Cost",
  },
]);

const asssemblyColumns = ref([
  {
    key: "serial",
    label: "#",
  },
  {
    key: "date_completed",
    label: "Date Completed",
  },
  {
    key: "material_cost",
    label: "Material Cost",
  },
]);

const operationsColumns = ref([
  {
    key: "serial",
    label: "#",
  },
  {
    key: "week",
    label: "Week",
  },
  {
    key: "operation",
    label: "Operation",
  },
  {
    key: "work_center",
    label: "Work Center",
  },
  {
    key: "hrs",
    label: "Hrs",
  },
  {
    key: "rework_hours",
    label: "Rework Hours",
  },
  {
    key: "rework_hours",
    label: "Rework Hours",
  },
  {
    key: "verified",
    label: "Verified",
  },
  {
    key: "scheduled",
    label: "Scheduled",
  },
]);

const employeeSchColumns = ref([
  {
    key: "date",
    label: "Date",
  },
  {
    key: "employees",
    label: "Employees",
  },
  {
    key: "hrs",
    label: "Hrs.",
  },
]);

const subAsssemblyColumns = ref([
  {
    key: "serial",
    label: "Linked Job#",
  },
]);

if (props.selectedOrganization !== null) editInit();
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
  <template v-if="!props.isModal && !organizaationExist">
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
      <div class="flex flex-col space-y-4">
        <div class="flex flex-row space-x-3">
          <div class="basis-2/6">
            <UFormGroup label="Job #" name="ReportsTo">
              <UInput v-model="formData.NUMBER" placeholder="" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Job Qty" name="Title">
              <UInput v-model="formData.Title" placeholder="" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Job Type" name="Employee">
              <USelect
                v-model="formData.JobType"
                :options="['Product', 'Sub Assembly']"
              />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Unit Material Cost" name="Title">
              <UInput v-model="formData.Title" placeholder="" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Relieve Inventory Per" name="Title">
              <USelect :options="[]" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex flex-row space-x-3">
          <div class="basis-2/6">
            <UFormGroup label="Date Opened" name="ReportsTo">
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    formData.DATEOPENED &&
                    format(formData.DATEOPENED, 'MM/dd/yyyy')
                  "
                  variant="outline"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
                <template #panel="{ close }">
                  <CommonDatePicker
                    v-model="formData.DATEOPENED"
                    is-required
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="By" name="Employee">
              <USelect :options="[]" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Date Closed" name="ReportsTo">
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    formData.DATECLOSED &&
                    format(formData.DATECLOSED, 'MM/dd/yyyy')
                  "
                  variant="outline"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
                <template #panel="{ close }">
                  <CommonDatePicker
                    v-model="formData.DATECLOSED"
                    is-required
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>

          <div class="basis-2/6">
            <UFormGroup label="Job Material Cost" name="Title">
              <USelect :options="[]" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Relieve Inventory Per" name="Title">
              <UInput v-model="formData.Title" placeholder="" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex flex-row space-x-3">
          <div class="basis-2/6">
            <UFormGroup label="Job Closed" name="ReportsTo">
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    formData.DATEOPENED &&
                    format(formData.DATEOPENED, 'MM/dd/yyyy')
                  "
                  variant="outline"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
                <template #panel="{ close }">
                  <CommonDatePicker
                    v-model="formData.DATEOPENED"
                    is-required
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="By" name="Employee">
              <USelect :options="[]" />
            </UFormGroup>
          </div>

          <div class="basis-2/6">
            <UFormGroup label="" name="Title">
              <UButton
                label="Re-Open"
                icon="i-f7-arrow-clockwise"
                variant="outline"
                color="green"
                class="mt-6"
                :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }"
              />
            </UFormGroup>
          </div>

          <div class="basis-2/6">
            <UFormGroup label="Category" name="Title">
              <USelect :options="[]" />
            </UFormGroup>
          </div>
          <div class="basis-2/6">
            <UFormGroup label="Sub Category" name="Title">
              <USelect :options="[]" />
            </UFormGroup>
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-4 justify-start mt-2">
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
        <div class="">
          <UButton
            icon="i-f7-rays"
            variant="outline"
            color="red"
            :label="'Clear'"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div>
          <UButton
            icon="i-heroicons-eye"
            label="View Position Details"
            variant="outline"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
        <div class="">
          <UButton
            icon="i-f7-arrow-clockwise"
            type="submit"
            variant="outline"
            color="green"
            label="Refresh Job Costs"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
      </div>
      <div class="flex flex-row space-x-4 justify-start mt-2">
        <div class="">
          <UButton
            icon="i-heroicons-magnifying-glass"
            variant="outline"
            color="green"
            label="View Parts List"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div class="">
          <UButton
            icon="i-heroicons-magnifying-glass"
            variant="outline"
            color="green"
            label="View Operations"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div class="">
          <UButton
            icon="i-heroicons-magnifying-glass"
            variant="outline"
            color="green"
            label="View Subassemblies"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div>
          <UButton
            icon="i-heroicons-printer"
            label="Print Folder Label"
            variant="outline"
            color="purple"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
        <div>
          <UButton
            icon="i-heroicons-printer"
            label="Print Documents"
            variant="outline"
            color="purple"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
      </div>
      <!-- Edit Tabs -->
      <div v-if="props.selectedOrganization !== null">
        <UTabs :items="tabitems" class="">
          <template #product="{ item }">
            <template v-if="formData.JobType === 'Product'">
              <div class="flex flex-col space-y-3">
                <div class="w-1/4">
                  <UFormGroup label="Product Line" name="Title">
                    <USelect :options="[]" />
                  </UFormGroup>
                </div>
                <div class="w-1/4">
                  <UFormGroup label="Model" name="Title">
                    <USelect :options="[]" />
                  </UFormGroup>
                </div>
                <div class="w-1/4">
                  <UFormGroup label="Beginning SN#" name="Title">
                    <UInput placeholder="" />
                  </UFormGroup>
                </div>
              </div>
              <div class="">
                <UFormGroup label="" name="Title">
                  <UButton
                    label="Re-Open"
                    icon="i-f7-arrow-clockwise"
                    variant="outline"
                    color="green"
                    class="mt-6"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }"
                  />
                </UFormGroup>
              </div>
              <div class="w-full flex">
                <div class="w-1/2 mt-5">
                  <UTable
                    :columns="productColumns"
                    :ui="{
                      wrapper:
                        'h-40 border-2 border-gray-300 dark:border-gray-700',
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
                <div class="w-1/2">
                  <div class="mt-5 ml-4">
                    <UButton
                      icon="i-heroicons-magnifying-glass"
                      variant="outline"
                      color="green"
                      label="View Selected DHR"
                      :ui="{
                        base: 'w-fit',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </div>
              <div class="flex space-x-3">
                <div class="mt-5">
                  <UButton
                    icon="i-heroicons-plus"
                    variant="outline"
                    color="green"
                    label="Pull into Serial Record"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
                <div class="basis-1/6 mt-5">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        formData.DATEOPENED &&
                        format(formData.DATEOPENED, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="formData.DATEOPENED"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </div>
                <div class="mt-5">
                  <UButton
                    icon="i-heroicons-plus"
                    variant="outline"
                    color="green"
                    label="Fix Serial Issues"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
              </div>
            </template>
            <template v-if="formData.JobType === 'Sub Assembly'">
              <div class="flex flex-col space-y-3">
                <div class="w-1/4">
                  <UFormGroup label="Category" name="Title">
                    <USelect v-model="formData.jobcat" :options="[]" />
                  </UFormGroup>
                </div>
                <div class="w-1/4">
                  <UFormGroup label="Sub Category" name="Title">
                    <USelect v-model="formData.jobsubcat" :options="[]" />
                  </UFormGroup>
                </div>
                <div class="w-1/4">
                  <UFormGroup label="Part" name="Title">
                    <UInput placeholder="" />
                  </UFormGroup>
                </div>
              </div>

              <div class="w-full flex">
                <div class="w-1/2 mt-5">
                  <UTable
                    :columns="asssemblyColumns"
                    :ui="{
                      wrapper:
                        'h-40 border-2 border-gray-300 dark:border-gray-700',
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
              <div class="mt-5">
                <UButton
                  icon="i-heroicons-plus"
                  variant="outline"
                  color="green"
                  label="Pull into Serial Record"
                  :ui="{
                    base: 'w-fit',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="flex space-x-3 mt-4">
                <div class="basis-1/6">
                  <UFormGroup label="Qty" name="Title">
                    <UInput type="number" placeholder="" />
                  </UFormGroup>
                </div>

                <div class="basis-1/6 mt-5">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        formData.DATEOPENED &&
                        format(formData.DATEOPENED, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="formData.DATEOPENED"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </div>
                <div class="mt-5">
                  <UButton
                    icon="i-heroicons-arrow-path"
                    variant="outline"
                    color="purple"
                    label="Convert Inventory"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
              </div>
            </template>
          </template>

          <template #jobs="{ item }">
            <div class="w-1/2 mt-5">
              <UTable
                :columns="subAsssemblyColumns"
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
            <div class="flex justify-between items-center mt-5 w-1/2">
              <div class="w-fit">
                <UButton
                  icon="i-heroicons-plus-circle-20-solid"
                  variant="outline"
                  color="green"
                  label="Add"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="w-fit">
                <UButton
                  icon="i-heroicons-minus-circle-20-solid"
                  variant="outline"
                  color="red"
                  label="Remove Part"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
            </div>
          </template>

          <template #operations="{ item }">
            <div class="flex space-x-2 mt-4">
              <div class="basis-1/4">
                <UButton
                  icon="i-heroicons-pencil-square"
                  variant="outline"
                  color="green"
                  label="Refresh Operations"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="basis-1/4">
                <UButton
                  icon="i-heroicons-pencil-square"
                  variant="outline"
                  color="green"
                  label="Edit Operations"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="basis-1/4">
                <UButton
                  icon="i-heroicons-minus-circle-20-solid"
                  variant="outline"
                  color="red"
                  label="Delete Rouge Operations"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="basis-1/4">
                <UButton
                  icon="i-heroicons-minus-circle-20-solid"
                  variant="outline"
                  color="red"
                  label="Delete All Rouge Operations"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
            </div>

            <div class="w-full mt-5">
              <UTable
                :columns="operationsColumns"
                :ui="{
                  wrapper: 'h-52 border-2 border-gray-300 dark:border-gray-700',
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

            <div class="flex mt-2 space-x-5">
              <div
                class="w-full flex flex-col border-[1px] border-slate-200 mt-2"
              >
                <div class="flex w-full space-x-5">
                  <div class="basis-2/5 p-2">
                    <span class="text-sm">
                      Employee Hours For Selected Operations</span
                    >
                    <UTable
                      :columns="employeeSchColumns"
                      :ui="{
                        wrapper:
                          'h-52  border-2 border-gray-300 dark:border-gray-700',
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
                    <div class="w-full flex">
                      <span class="text-sm text-right w-full">
                        Total Hrs: 0</span
                      >
                    </div>
                  </div>

                  <div
                    class="basis-2/5 flex flex-col items-center justify-center"
                  >
                    <div class="flex items-center">
                      <div class="flex flex-col items-center">
                        <div>
                          <span>Rework</span>
                          <div class="">
                            <UButton
                              icon="i-heroicons-pencil-square"
                              variant="outline"
                              color="green"
                              label="Rework Parts"
                              :ui="{
                                base: 'w-fit',
                                truncate: 'flex justify-center w-full',
                              }"
                              truncate
                            />
                          </div>
                        </div>
                        <div class="w-28">
                          <UFormGroup label="Hours" name="Title">
                            <UInput placeholder="" />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex-col flex pl-3">
                        <span>Rework Cost</span>
                        <span>$ 0.00</span>
                      </div>
                    </div>

                    <div class="mt-5">
                      <UButton
                        icon="i-heroicons-plus"
                        variant="outline"
                        color="green"
                        label="Verify & Close Operation"
                        :ui="{
                          base: 'w-full',
                          truncate: 'flex justify-center w-full',
                        }"
                        truncate
                      />
                    </div>
                  </div>
                </div>
                <div class="border-[1px] border-slate-200 p-2 m-2">
                  <span class="text-sm"> Manage Time Entries</span>

                  <div class="flex w-full space-x-3">
                    <div class="w-fit mt-6">
                      <UButton
                        icon="i-heroicons-pencil-square"
                        variant="outline"
                        color="green"
                        label="Move Selected Enteries to Operation"
                        :ui="{
                          base: 'w-fit',
                          truncate: 'flex justify-center w-full',
                        }"
                        truncate
                      />
                    </div>

                    <div class="w-1/2">
                      <UFormGroup label="Destination Operation" name="Title">
                        <USelect :options="[]" />
                      </UFormGroup>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="formData.JobType === 'Product'"
                class="flex flex-col items-center justify-center"
              >
                <div class="w-28">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        formData.DATEOPENED &&
                        format(formData.DATEOPENED, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="formData.DATEOPENED"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </div>

                <div class="mt-5">
                  <UButton
                    icon="i-heroicons-pencil-square"
                    variant="outline"
                    color="green"
                    label="reSchedule Operation"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </UForm>
  </template>
</template>
