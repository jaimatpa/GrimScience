<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedService: {
    type: [Number, String, null],
    required: true,
  },
});
const serialColumns = ref([
  {
    key: "serial",
    label: "Serial",
  },
]);
const orderColumns = ref([
  {
    key: "order",
    label: "Order",
  },
  {
    key: "UniqueID",
    label: "#",
  },
]);
const invoiceColumns = ref([
  {
    key: "orderdate",
    label: "Date",
  },
  {
    key: "invoice",
    label: "Invoice#",
  },
  {
    key: "terms",
    label: "Terms",
  },
]);
const reportColumns = ref([
  {
    key: "date",
    label: "Date",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "by",
    label: "By",
  },
]);
const investigationColumns = ref([
  {
    key: "category",
    label: "Category",
  },
  {
    key: "sub",
    label: "Sub",
  },
  {
    key: "stock#",
    label: "Stock #",
  },
  {
    key: "description",
    label: "Description",
  },
]);
const investigationColumns2 = ref([
  {
    key: "qty",
    label: "Qty",
  },
  {
    key: "stock",
    label: "Stock #",
  },
  {
    key: "description",
    label: "Description",
  },
]);
const loadingOverlay = ref(false);
const formData = reactive({
  customerID: props.selectedService,
  Week: null,
  REPAIRSMADE: null,
  Status: null,
  Type: null,
  "Service Tech": null,
  HIREDATE: new Date(),
});
const serials = ref([]);
const date = ref(new Date());
const orderers = ref([]);
const orderer = ref([]);

const selectedStatus = ref("open");
const description = ref("Warm Tank fill valve not closing");
const riskStatusGroup = ref([
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
]);
const checkStatusGroup = ref([
  { value: "Open", label: "Open" },
  { value: "Close", label: "Close" },
]);
const statusGroup = ref([
  { value: "Factory", label: "Factory" },
  { value: "Customer", label: "Customer" },
  { value: "Field", label: "Field" },
]);
const selectedRiskStatus = ref("no");
const receivedDate = ref(null);
const nc = ref(null);
const accessories = ref(null);
const service = ref(null);
const serviceList = ref([]);
const failure = ref(null);

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/service/schedule/${props.selectedService}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key];
          }
        }
      }
    },
  });
  // await propertiesInit()
  loadingOverlay.value = false;
};

const propertiesInit = async () => {
  // loadingOverlay.value = true
  // await useApiFetch(`/api/tbl/tblCustomers/${props.selectedService}`, {
  //   method: 'GET',
  //   onResponse({ response }) {
  //     if(response.status === 200) {
  //       loadingOverlay.value = false
  //       for (const key in response._data.body) {
  //         if (response._data.body[key]) {
  //           formData[key] = response._data.body[key]
  //         }
  //       }
  //     }
  //   }
  // })
  // await useApiFetch(`/api/customers/serials/${props.selectedService}`, {
  //   method: 'GET',
  //   onResponse({ response }) {
  //     if(response.status === 200) {
  //       loadingOverlay.value = false
  //       serials.value = response._data.body
  //     }
  //   }
  // })

  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.fname)
    errors.push({ path: "fname", message: "Please enter your frist name." });
  if (!state.lname)
    errors.push({ path: "lname", message: "Please enter a your last name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  emit("save", event.data);
  emit("close");
}
if (props.selectedService !== null) editInit();
else propertiesInit();
</script>

<template>
  {{ selectedService }}
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
    @submit="onSubmit"
  >
    <div class="!my-0 flex flex-row space-x-8 pb-3">
      <div class="basis-1/2">
        <div class="flex flex-col justify-between">
          <div class="flex items-center justify-between gap-x-2">
            <div class="basis-1/4">
              <span class="bg-slate-400 p-1 font-bold">Report</span>
              <span class="ml-3 bg-slate-400 p-1 font-bold">1233</span>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Date" name="HIREDATE">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="format(formData.HIREDATE, 'dd/MM/yyyy')"
                    variant="outline"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                  <template #panel="{ close }">
                    <CommonDatePicker
                      v-model="formData.HIREDATE"
                      is-required
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Service Tech" name="select">
                <USelect
                  v-model="formData['Service Tech']"
                  :options="serviceList"
                />
              </UFormGroup>
            </div>

            <div class="basis-1/4">
              <UFormGroup label="Week" name="failure">
                <UInput v-model="formData.Week" placeholder="0.00" />
              </UFormGroup>
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <div class="flex gap-2">
                <URadio
                  v-for="riskStatus of checkStatusGroup"
                  :key="riskStatus.value"
                  v-model="formData.Status"
                  v-bind="riskStatus"
                  class="pb-3"
                />
              </div>
              <div class="flex gap-2">
                <URadio
                  v-for="riskStatus of statusGroup"
                  :key="riskStatus.value"
                  v-model="formData.Type"
                  v-bind="riskStatus"
                  class="pb-3"
                />
              </div>
              <div class="w-fit">
                <UFormGroup label="Factory Hrs" name="failure">
                  <UInput type="number" placeholder="0.00" />
                </UFormGroup>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-1 mt-2">
              <UFormGroup label="Travel Hrs" name="failure">
                <UInput placeholder="0.00" />
              </UFormGroup>
              <UFormGroup type="number" label="Miles" name="failure">
                <UInput type="number" placeholder="0.00" />
              </UFormGroup>
              <UFormGroup label="Onsite Hrs." name="failure">
                <UInput type="number" placeholder="0.00" />
              </UFormGroup>
              <UFormGroup label="Per Dimen" name="failure">
                <UInput type="number" placeholder="0.00" />
              </UFormGroup>
            </div>
          </div>

          <UFormGroup label="Description" name="description">
            <UTextarea v-model="formData.REPAIRSMADE" :rows="2" />
          </UFormGroup>
        </div>
        <div class="flex flex-row space-x-3"></div>
      </div>
      <div class="basis-1/2">
        <div class="flex flex-row space-x-3">
          <div class="basis-1/2">
            <UFormGroup
              label="Was device performing per specification?"
              name="description"
            >
              <URadio
                v-for="riskStatus of riskStatusGroup"
                :key="riskStatus.value"
                v-model="selectedRiskStatus"
                v-bind="riskStatus"
                class="pb-3"
              />
              <UTextarea :rows="8" />
            </UFormGroup>
          </div>

          <div class="flex flex-col">
            <div class="bg-slate-400 px-3 py-1 mb-2">Invoice</div>
            <div>
              <UTable
                :columns="invoiceColumns"
                :ui="{
                  wrapper: 'h-40 border-2 border-gray-300 dark:border-gray-700',
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
            <div class="flex flex-row space-x-1 mt-3">
              <div class="basis-1/3 w-full">
                <UButton
                  icon="i-heroicons-plus-20-solid"
                  label="Look Up Invoice"
                  variant="outline"
                  color="green"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="basis-1/3 w-full">
                <UButton
                  icon="i-heroicons-plus-20-solid"
                  label="Create Invoice"
                  variant="outline"
                  color="green"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="basis-1/3 w-full">
                <UButton
                  icon="i-heroicons-minus-circle-20-solid"
                  label="Unlink"
                  variant="outline"
                  color="red"
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

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-1">Warrenty Material</div>
        <div class="flex flex-row space-x-5 px-5 pt-5">
          <div class="w-1/2">
            <USelect v-model="service" :options="serviceList" />
          </div>
          <div class="w-1/2">
            <USelect v-model="service" :options="serviceList" />
          </div>
          <div class="w-1/2">
            <UInput v-model="failure" />
          </div>
          <div class="w-1/2">
            <UInput v-model="failure" />
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full">
            <UFormGroup label="" name="investigation">
              <UTable
                :columns="investigationColumns"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
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
              <span class="italic text-xs">Parts (Double Click to select)</span>
            </UFormGroup>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-4"></div>
        <div class="flex flex-row space-x-5 px-5 pt-5">
          <UButton
            label="Remove Part"
            variant="solid"
            :ui="{ base: 'w-fit', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>

        <div class="flex flex-col space-x-5 p-5">
          <div class="w-full">
            <UFormGroup label="" name="investigation">
              <UTable
                :columns="investigationColumns2"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
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

              <div class="pt-2 flex justify-between">
                <UFormGroup
                  label="Start Date"
                  name="HIREDATE"
                  class="flex items-center gap-x-2"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="format(formData.HIREDATE, 'dd/MM/yyyy')"
                      variant="outline"
                      :ui="{
                        base: 'w-fit',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="formData.HIREDATE"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>

                <UFormGroup
                  label="Shipping"
                  name="AnnualSalary"
                  class="flex items-center gap-x-2"
                >
                  <UInput placeholder="" />
                </UFormGroup>

                <div class="flex font-semibold items-center gap-x-2">
                  <span>Total</span>
                  <span>0.00</span>
                </div>
              </div>
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>

    <div class="!my-0 flex flex-row">
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-1">Parts Received</div>
        <div class="flex flex-row space-x-5 px-5 pt-5">
          <div class="w-1/2">
            <USelect v-model="service" :options="serviceList" />
          </div>
          <div class="w-1/2">
            <USelect v-model="service" :options="serviceList" />
          </div>
          <div class="w-1/2">
            <UInput v-model="failure" />
          </div>
          <div class="w-1/2">
            <UInput v-model="failure" />
          </div>
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="w-full">
            <UFormGroup label="" name="investigation">
              <UTable
                :columns="investigationColumns"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
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
              <span class="italic text-xs">Parts (Double Click to select)</span>
            </UFormGroup>
          </div>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="w-full bg-slate-400 px-3 py-4"></div>
        <div class="flex flex-row space-x-5 px-5 pt-10 mt-3"></div>

        <div class="flex flex-col space-x-5 p-5">
          <div class="w-full">
            <UFormGroup label="" name="investigation">
              <UTable
                :columns="investigationColumns2"
                :rows="[]"
                :ui="{
                  wrapper: 'h-32 border-2 border-gray-300 dark:border-gray-700',
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
              <span class="italic text-xs"
                >Singleclick to Select Part for Non-Confirmation(Double Click to
                view)</span
              >
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row space-x-4 justify-end items-center mt-2">
      <div class="w-fit">
        <UButton
          icon="i-heroicons-document-arrow-up"
          variant="outline"
          label="Save"
          color="green"
          :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
          truncate
        />
      </div>
      <div class="w-fit">
        <UButton
          icon="i-heroicons-magnifying-glass"
          variant="outline"
          label="View Order"
          color="blue"
          :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
          truncate
        />
      </div>
      <div class="w-fit">
        <UButton
          icon="i-heroicons-currency-dollar"
          variant="outline"
          label="Quickbooks"
          color="blue"
          :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
          truncate
        />
      </div>
      <div class="w-fit">
        <UButton
          icon="i-heroicons-minus-circle-20-solid"
          variant="outline"
          color="red"
          label="Remove Part"
          :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
          truncate
        />
      </div>
      <div class="w-fit">
        <UButton
          icon="i-heroicons-minus-circle-20-solid"
          variant="outline"
          color="green"
          label="Non-Conformance Create/View"
          :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
          truncate
        />
      </div>

      <div class="font-semibold">
        <span>Total:</span>
        <span class="pl-3">121,122</span>
      </div>
    </div>
  </UForm>
</template>
