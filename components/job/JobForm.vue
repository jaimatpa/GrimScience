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
const jobFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const JobExist = ref(true);
const isLoading = ref(false);
const categories = ref([]);
const subCategories = ref([]);
const closedByUsers = ref([]);
const jobTypes = ref([]);
const perTypes = ref([]);
const productionUsers = ref([]);
const getEmployeees = ref([]);
const jobCat = ref([]);
const jobsubcat = ref([]);
const productLines = ref([]);
const models = ref([]);
const prodDesOperations = ref([]);
const subDesOperations = ref([]);
const prodScheduleHrs = ref("0");
const subScheduleHrs = ref("0");
const prodOperationIds = ref([]);
const subOperationIds = ref([]);
const prodHrs = ref(0);
const subHrs = ref(0);
const unitCost = ref();
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
  await useApiFetch(`/api/jobs/${props.selectedJob}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        JobExist.value = true;

        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            // formData[key] = response._data.body[key];
            if (key === "Cost") {
              formData[key] = `$${response._data.body[key]}`;
            } else {
              formData[key] = response._data.body[key];
            }
          }
        }
      }
    },
    onResponseError({ }) {
      JobExist.value = false;
    },
  });

  // get categories list
  await useApiFetch("/api/jobs/categories", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        categories.value = response._data.body;
      }
    },
    onResponseError() {
      categories.value = [];
    },
  });
  // get sub categories list
  await useApiFetch("/api/jobs/subCategories", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        subCategories.value = response._data.body;
      }
    },
    onResponseError() {
      subCategories.value = [];
    },
  });

  // get closedby users list
  await useApiFetch("/api/jobs/users", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        closedByUsers.value = response._data.body;
      }
    },
    onResponseError() {
      closedByUsers.value = [];
    },
  });

  // get productLines users
  await useApiFetch("/api/jobs/productLines", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        productLines.value = response._data.body;
      }
    },
    onResponseError() {
      productLines.value = [];
    },
  });

  // get models users
  await useApiFetch("/api/jobs/models", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        models.value = response._data.body;
      }
    },
    onResponseError() {
      models.value = [];
    },
  });

  await fetchJobOperation();

  await useApiFetch(`/api/jobs/details`, {
    method: "GET",
    params: { ...jobFilters.value },
    onResponse({ response }) {
      if (response.status === 200) {
        const totalAmount = formData.Cost;
        const numericAmount = parseFloat(totalAmount.replace("$", ""));

        // Filter objects that have a dateEntered value
        const validEntries = response._data.body.filter(
          (item) => item.dateEntered
        );

        // Calculate the cost per valid entry
        const costPerEntry = numericAmount / validEntries.length;

        unitCost.value = `$${costPerEntry.toFixed(2)}`;

        // Map over the data to create the new structure
        const transformedData = response._data.body.map((item) => {
          if (item.dateEntered) {
            return {
              ...item,
              cost: `$${costPerEntry.toFixed(2)}`, // Keep 2 decimal places
              SingleMaterialCost: null,
            };
          } else {
            return {
              ...item,
              cost: "$0.00",
              SingleMaterialCost: null,
            };
          }
        });

        if (formData.JobType === "Product") {
          productsSerialGridMeta.value.products = transformedData;
        } else {
          productsSBSerialGridMeta.value.products = transformedData;
        }
      }
    },
    onResponseError({ }) {
      productsSerialGridMeta.value.products = [];
      productsSBSerialGridMeta.value.products = [];
    },
  });

  await propertiesInit();
  loadingOverlay.value = false;
};

const fetchJobOperation = async () => {
  // get job operation
  await useApiFetch("/api/jobs/operations", {
    method: "GET",
    params: { ...operationFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        if (formData.JobType === "Product") {
          prodOperationGridMeta.value.operations = response._data.body;
          prodDesOperations.value = response._data.body.map(
            (item) => item.Operation
          );
        } else {
          subOperationGridMeta.value.subOperations = response._data.body;
          subDesOperations.value = response._data.body.map(
            (item) => item.Operation
          );
        }
      }
    },
    onResponseError() {
      prodOperationGridMeta.value.operations = [];
      subOperationGridMeta.value.subOperations = [];
    },
  });
};

const propertiesInit = async () => {
  loadingOverlay.value = true;

  // get job type list
  await useApiFetch("/api/jobs/jobTypes", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        jobTypes.value = response._data.body;
      }
    },
    onResponseError() {
      jobTypes.value = [];
    },
  });

  // get perType list
  await useApiFetch("/api/jobs/perType", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        perTypes.value = response._data.body;
      }
    },
    onResponseError() {
      perTypes.value = [];
    },
  });

  // get production users
  await useApiFetch("/api/jobs/productionUsers", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        productionUsers.value = response._data.body;
      }
    },
    onResponseError() {
      productionUsers.value = [];
    },
  });

  // get production users
  await useApiFetch("/api/jobs/employees", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        getEmployeees.value = response._data.body;
      }
    },
    onResponseError() {
      getEmployeees.value = [];
    },
  });

  // get jobCar users
  await useApiFetch("/api/jobs/jobCat", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        jobCat.value = response._data.body;
      }
    },
    onResponseError() {
      jobCat.value = [];
    },
  });

  // get subJobCat users
  await useApiFetch("/api/jobs/jobsubcat", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        jobsubcat.value = response._data.body;
      }
    },
    onResponseError() {
      jobsubcat.value = [];
    },
  });

  loadingOverlay.value = false;
};

const getSchedules = async () => {
  loadingOverlay.value = true;
  // get job operation
  await useApiFetch("/api/jobs/employeeSchedule", {
    method: "GET",
    params: { ...emploeeFilterValues.value },
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        if (formData.JobType === "Product") {
          prodEmployeeGridMeta.value.employees = response._data.body;
          prodScheduleHrs.value = response._data.body.reduce(
            (total, item) => total + item.Hours,
            0
          );
        } else {
          subEmployeeGridMeta.value.subEmployees = response._data.body;

          subScheduleHrs.value = response._data.body.reduce(
            (total, item) => total + item.Hours,
            0
          );
        }
      }
    },
    onResponseError() {
      prodEmployeeGridMeta.value.employees = [];
    },
  });

  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  return errors;
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
    await useApiFetch("/api/jobs", {
      method: "POST",
      body: data,
      onResponse({ response }) {
        if (response.status === 200) {
          isLoading.value = false;
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
  } else {
    // Update Job
    isLoading.value = true;
    await useApiFetch(`/api/jobs/${props.selectedJob}`, {
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

    // await deleteOperations();
  }
  emit("save");
};

const deleteOperations = async () => {
  const operationIds =
    formData.JobType === "Product"
      ? prodOperationIds.value
      : subOperationIds.value;

  if (operationIds?.length > 0) {
    for (let i = 0; i < operationIds.length; i++) {
      const operationId = operationIds[i];
      await useApiFetch(`/api/jobs/operations/${operationId}`, {
        method: "DELETE",
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
    }
  }
};

const handleClearCick = () => {
  Object.keys(formData).forEach((key) => {
    if (key !== "JobType") {
      formData[key] = null;
    }
  });
};

const handleProdOperationSelect = (row) => {
  prodOperationGridMeta.value.selectedOperation = { ...row, class: "" };
  prodOperationGridMeta.value.operations.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  emploeeFilterValues.value.OperationID =
    prodOperationGridMeta.value.selectedOperation.UniqueID;

  getSchedules();
};

const handleSubOperationSelect = (row) => {
  subOperationGridMeta.value.selectedSubOperation = { ...row, class: "" };
  subOperationGridMeta.value.subOperations.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  emploeeFilterValues.value.OperationID =
    subOperationGridMeta.value.selectedSubOperation.UniqueID;

  getSchedules();
};

const operationFilterValues = ref({
  JobID: props.selectedJob,
});

const emploeeFilterValues = ref({
  JobID: props.selectedJob,
  OperationID: null,
});

const jobFilters = ref({
  JobID: [props.selectedJob],
});

const handleDeleteOperation = async () => {
  if (
    subOperationGridMeta.value.selectedSubOperation === null &&
    prodOperationGridMeta.value.selectedOperation === null
  ) {
    toast.add({
      title: "Failed",
      description: "Please Select rouge Operation",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  }

  if (subOperationGridMeta.value.selectedSubOperation !== null) {
    if (subEmployeeGridMeta.value.subEmployees.length > 0) {
      toast.add({
        title: "Failed",
        description:
          "A rouge job operation cannot be deleted while it has a time enteries. Move time enteries and try delete operation again.",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    } else {
      const id = subOperationGridMeta.value.selectedSubOperation.UniqueID;

      const data = subOperationGridMeta.value.subOperations.filter(
        (item) => item.UniqueID !== id
      );
      subOperationGridMeta.value.subOperations = data;
    }
  }

  if (prodOperationGridMeta.value.selectedOperation !== null) {
    if (prodEmployeeGridMeta.value.employees.length > 0) {
      toast.add({
        title: "Failed",
        description:
          "A rouge job operation cannot be deleted while it has a time enteries. Move time enteries and try delete operation again.",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    } else {
      const id = prodOperationGridMeta.value.selectedOperation.UniqueID;
      const data = prodOperationGridMeta.value.operations.filter(
        (item) => item.UniqueID !== id
      );

      prodOperationGridMeta.value.operations = data;
      console.log("data", data);
    }
  }
};

const handleDeleteAll = () => {
  const uniqueIDs = prodOperationGridMeta.value.operations.map(
    (item) => item.UniqueID
  );

  const uniqueIDs2 = subOperationGridMeta.value.subOperations.map(
    (item) => item.UniqueID
  );
  prodOperationIds.value = uniqueIDs;
  subOperationIds.value = uniqueIDs2;
  prodOperationGridMeta.value.operations = [];
  subOperationGridMeta.value.subOperations = [];
};

const prodOperationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Number",
      label: "#",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "Operation",
      label: "Operation",
    },
    {
      key: "WorkCenter",
      label: "Work Center",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
    {
      key: "reworkhrs",
      label: "Rework Hours",
    },
    {
      key: "verified",
      label: "Verified",
    },
    {
      key: "DateScheduled",
      label: "Scheduled",
    },
  ],
  operations: [],
  selectedOperation: null,
  isLoading: false,
});

const subOperationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Number",
      label: "#",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "Operation",
      label: "Operation",
    },
    {
      key: "WorkCenter",
      label: "Work Center",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
    {
      key: "reworkhrs",
      label: "Rework Hours",
    },
    {
      key: "verified",
      label: "Verified",
    },
    {
      key: "DateScheduled",
      label: "Scheduled",
    },
  ],
  subOperations: [],
  selectedSubOperation: null,
  isLoading: false,
});

const prodEmployeeGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "StartTime",
      label: "Date",
    },
    {
      key: "employee",
      label: "Employees",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
  ],
  employees: [],
  selectedEmployee: null,
  isLoading: false,
});

const subEmployeeGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "StartTime",
      label: "Date",
    },
    {
      key: "employee",
      label: "Employees",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
  ],
  subEmployees: [],
  selectedESubEmployee: null,
  isLoading: false,
});

const productsSerialGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Serial",
      label: "Serial",
    },
    {
      key: "dateEntered",
      label: "Date Completed",
    },
    {
      key: "cost",
      label: "Material Cost",
    },
  ],
  products: [],
  selectedProduct: null,
  isLoading: false,
});

const productsSBSerialGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Serial",
      label: "Serial",
    },
    {
      key: "dateEntered",
      label: "Date Completed",
    },
    {
      key: "material_cost",
      label: "Material Cost",
    },
  ],
  products: [],
  selectedProduct: null,
  isLoading: false,
});

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

const subAsssemblyColumns = ref([
  {
    key: "serial",
    label: "Linked Job#",
  },
]);

const modalMeta = ref({
  isPartsModalOpen: false,
  modalTitle: "Parts Listing",
  modalDescription: "View Parts Listing",
  isOperationModalOpen: false,
  isReworkPartsModalOpen: false,
});

const onDblClick = () => {
  modalMeta.value.isOperationModalOpen = true;
  modalMeta.value.modalTitle = "Manufacturing Secquence";
  modalMeta.value.modalDescription = `Manufacturing Secquence ${formData.MODEL ? formData.MODEL : formData.PART
    }`;
};

const handleRWClick = () => {
  modalMeta.value.isReworkPartsModalOpen = true;
  modalMeta.value.modalTitle = "Parts Used";
  modalMeta.value.modalDescription = "";
};

const handleModalClose = () => {
  modalMeta.value.isPartsModalOpen = false;
};

const onPartsClick = () => {
  modalMeta.value.isPartsModalOpen = true;
};

const handleViewOperationClick = () => {
  window.open(`/api/jobs/exportoperation/${props.selectedJob}`);
};

if (props.selectedJob !== null) editInit();
else propertiesInit();
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>

  <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
    <div class="flex space-x-4">
      <div>
        <div class="flex flex-col space-y-4">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Job #" name="Job #">
                <UInput v-model="formData.NUMBER" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Job Qty" name="Job Qty">
                <UInput v-model="formData.QUANTITY" type="number" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Job Type" name="Job Type">
                <USelect v-model="formData.JobType" :options="jobTypes" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Unit Material Cost" name="Unit Material Cost">
                <UInput />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Relieve Inventory Per" name="Relieve Inventory Per">
                <UInputMenu v-model="formData.PerType" v-model:query="formData.PerType" :options="perTypes" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Date Opened" name="Date Opened">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DATEOPENED &&
                    format(formData.DATEOPENED, 'MM/dd/yyyy')
                    " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.DATEOPENED" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu v-model="formData.ByEmployee" v-model:query="formData.ByEmployee"
                  :options="productionUsers" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Ready To Produce" name="Ready To Produce">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.ProductionDate &&
                    format(formData.ProductionDate, 'MM/dd/yyyy')
                    " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.ProductionDate" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>

            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu v-model="formData.ProductionBy" v-model:query="formData.ProductionBy"
                  :options="productionUsers" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Job Material Cost" name="Job Material Cost">
                <UInput v-model="formData.Cost" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Job Closed" name="Job Closed">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.JOBCLOSED &&
                    format(formData.JOBCLOSED, 'MM/dd/yyyy')
                    " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.JOBCLOSED" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu v-model="formData.ClosedBy" v-model:query="formData.ClosedBy" :options="closedByUsers" />
              </UFormGroup>
            </div>

            <div class="basis-1/5">
              <UFormGroup label="" name="Title">
                <UButton label="Re-Open" icon="i-f7-arrow-clockwise" variant="outline" color="green" class="mt-6" :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }" />
              </UFormGroup>
            </div>

            <div class="basis-1/5">
              <UFormGroup label="Category" name="Category">
                <UInputMenu v-model="formData.jobcat" v-model:query="formData.jobcat" :options="jobCat" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Sub Category" name="Sub Category">
                <UInputMenu v-model="formData.jobsubcat" v-model:query="formData.jobsubcat" :options="jobsubcat" />
              </UFormGroup>
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-4 justify-start mt-5">
          <div class="">
            <UButton icon="i-heroicons-document-text" type="submit" variant="outline" color="green" label="Save"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
          <div class="">
            <UButton icon="i-f7-rays" variant="outline" color="red" :label="'Clear'"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" @click="handleClearCick" truncate />
          </div>
          <!-- <div>
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
        </div> -->
          <div class="">
            <UButton icon="i-f7-arrow-clockwise" variant="outline" color="green" label="Refresh Job Costs"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 justify-start mt-2">
        <div class="">
          <UButton icon="i-heroicons-magnifying-glass" variant="outline" color="green" label="View Parts List"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate @click="onPartsClick()" />
        </div>
        <div class="">
          <UButton icon="i-heroicons-magnifying-glass" variant="outline" color="green" label="View Operations"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" @click="handleViewOperationClick"
            truncate />
        </div>
        <div class="">
          <UButton icon="i-heroicons-magnifying-glass" variant="outline" color="green" label="View Subassemblies"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
        </div>
        <div>
          <UButton icon="i-heroicons-printer" label="Print Folder Label" variant="outline" color="purple" :ui="{
            base: 'min-w-[200px] w-full',
            truncate: 'flex justify-center w-full',
          }" truncate />
        </div>
        <div>
          <UButton icon="i-heroicons-printer" label="Print Documents" variant="outline" color="purple" :ui="{
            base: 'min-w-[200px] w-full',
            truncate: 'flex justify-center w-full',
          }" truncate />
        </div>
      </div>
    </div>
    <!-- Edit Tabs -->
    <div v-if="props.selectedJob !== null">
      <UTabs :items="tabitems" class="">
        <template #product="{ item }">
          <template v-if="formData.JobType === 'Product'">
            <div class="flex flex-col space-y-3">
              <div class="w-1/4">
                <UFormGroup label="Product Line" name="Product Line">
                  <UInputMenu v-model="formData.PRODUCTLINE" v-model:query="formData.PRODUCTLINE"
                    :options="productLines" />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Model" name="Model">
                  <UInputMenu v-model="formData.MODEL" v-model:query="formData.MODEL" :options="models" />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Beginning SN#" name="Beginning SN#">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
            <div class="">
              <UFormGroup label="" name="Title">
                <UButton label="Re-Open" icon="i-f7-arrow-clockwise" variant="outline" color="green" class="mt-6" :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }" />
              </UFormGroup>
            </div>
            <div class="w-full flex">
              <div class="w-1/2 mt-5">
                <UTable v-if="formData.JobType === 'Product'" :columns="productsSerialGridMeta.defaultColumns"
                  :rows="productsSerialGridMeta.products" :ui="{
                    wrapper:
                      'h-52 border-2 border-gray-300 dark:border-gray-700',
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
                  }">
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
              </div>
              <div class="w-1/2">
                <div class="mt-5 ml-4">
                  <UButton icon="i-heroicons-magnifying-glass" variant="outline" color="green" label="View Selected DHR"
                    :ui="{
                      base: 'w-fit',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                </div>
              </div>
            </div>
            <div class="flex space-x-3">
              <div class="mt-5">
                <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Pull into Serial Record" :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }" truncate />
              </div>
              <div class="basis-1/6 mt-5">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="date && format(date, 'MM/dd/yyyy')"
                    variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="date" is-required @close="close" />
                  </template>
                </UPopover>
              </div>
              <div class="mt-5">
                <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Fix Serial Issues" :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }" truncate />
              </div>
            </div>
          </template>
          <template v-if="formData.JobType === 'Sub Assembly'">
            <div class="flex flex-col space-y-3">
              <div class="w-1/4">
                <UFormGroup label="Category" name="Category">
                  <UInputMenu v-model="formData.Catagory" v-model:query="formData.Catagory" :options="categories" />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Sub Category" name="Sub Category">
                  <UInputMenu v-model="formData.SubCatagory" v-model:query="formData.SubCatagory"
                    :options="subCategories" />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Part" name="Part">
                  <UInput v-model="formData.PART" />
                </UFormGroup>
              </div>
            </div>

            <div class="w-full flex">
              <div class="w-1/2 mt-5">
                <UTable :columns="productsSBSerialGridMeta.defaultColumns" :rows="productsSBSerialGridMeta.products"
                  :ui="{
                    wrapper:
                      'h-52 border-2 border-gray-300 dark:border-gray-700',
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
                  }">
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
                <!-- <UTable
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
                  </UTable> -->
              </div>
            </div>
            <div class="mt-5">
              <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Pull into Serial Record" :ui="{
                base: 'w-fit',
                truncate: 'flex justify-center w-full',
              }" truncate />
            </div>
            <div class="flex space-x-3 mt-4">
              <div class="basis-1/6">
                <UFormGroup label="Qty" name="Qty">
                  <UInput type="number" />
                </UFormGroup>
              </div>

              <div class="basis-1/6 mt-5">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="date && format(date, 'MM/dd/yyyy')"
                    variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="date" is-required @close="close" />
                  </template>
                </UPopover>
              </div>
              <div class="mt-5">
                <UButton icon="i-heroicons-arrow-path" variant="outline" color="purple" label="Convert Inventory" :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }" truncate />
              </div>
            </div>
          </template>
        </template>

        <template #jobs="{ item }">
          <div class="w-1/2 mt-5">
            <UTable :columns="subAsssemblyColumns" :ui="{
              wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
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
          <div class="flex justify-between items-center mt-5 w-1/2">
            <div class="w-fit">
              <UButton icon="i-heroicons-plus-circle-20-solid" variant="outline" color="green" label="Add" :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }" truncate />
            </div>
            <div class="w-fit">
              <UButton icon="i-heroicons-minus-circle-20-solid" variant="outline" color="red" label="Remove Part" :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }" truncate />
            </div>
          </div>
        </template>

        <template #operations="{ item }">
          <div class="flex space-x-2 justify-between mt-4">
            <div class="basis-1/4">
              <UButton icon="i-heroicons-pencil-square" variant="outline" color="green" label="Refresh Operations" :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }" @click="fetchJobOperation()" truncate />
            </div>
            <div v-if="formData.JobType === 'Product'" class="basis-1/4">
              <UButton icon="i-heroicons-pencil-square" variant="outline" color="green" label="Edit Operations" :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }" truncate />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-minus-circle-20-solid" variant="outline" color="red"
                label="Delete Rouge Operations" :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }" @click="handleDeleteOperation" truncate />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-minus-circle-20-solid" variant="outline" color="red"
                label="Delete All Rouge Operations" :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }" @click="handleDeleteAll" truncate />
            </div>
          </div>

          <div class="w-full mt-5">
            <UTable v-if="formData.JobType === 'Product'" :columns="prodOperationGridMeta.defaultColumns"
              :rows="prodOperationGridMeta.operations" :ui="{
                wrapper: 'h-52 border-2 border-gray-300 dark:border-gray-700',
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
              }" @select="handleProdOperationSelect" @dblclick="onDblClick">
              <template #empty-state>
                <div></div>
              </template>
            </UTable>

            <UTable v-else :columns="subOperationGridMeta.defaultColumns" :rows="subOperationGridMeta.subOperations"
              :ui="{
                wrapper: 'h-52 border-2 border-gray-300 dark:border-gray-700',
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
              }" @select="handleSubOperationSelect" @dblclick="onDblClick">
              <template #empty-state>
                <div></div>
              </template>
            </UTable>
          </div>

          <div class="flex mt-2 space-x-5">
            <div class="w-full flex flex-col border-[1px] border-slate-200 mt-2">
              <div class="flex w-full space-x-5">
                <div class="basis-2/5 p-2">
                  <span class="text-sm">
                    Employee Hours For Selected Operations</span>
                  <UTable v-if="formData.JobType === 'Product'" :columns="prodEmployeeGridMeta.defaultColumns"
                    :rows="prodEmployeeGridMeta.employees" :ui="{
                      wrapper:
                        'h-52  border-2 border-gray-300 dark:border-gray-700',
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
                    }">
                    <template #empty-state>
                      <div></div>
                    </template>
                  </UTable>

                  <UTable v-else :columns="subEmployeeGridMeta.defaultColumns" :rows="subEmployeeGridMeta.subEmployees"
                    :ui="{
                      wrapper:
                        'h-52  border-2 border-gray-300 dark:border-gray-700',
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
                    }">
                    <template #empty-state>
                      <div></div>
                    </template>
                  </UTable>
                  <div class="w-full flex">
                    <span class="text-sm text-right w-full">
                      Total Hrs:
                      {{
                        formData.JobType === "Product"
                          ? prodScheduleHrs
                          : subScheduleHrs
                      }}</span>
                  </div>
                </div>

                <div class="basis-2/5 flex flex-col items-center justify-center">
                  <div class="flex items-center">
                    <div class="flex flex-col items-center">
                      <div>
                        <span>Rework</span>
                        <div class="">
                          <UButton icon="i-heroicons-pencil-square" variant="outline" color="green" label="Rework Parts"
                            :ui="{
                              base: 'w-fit',
                              truncate: 'flex justify-center w-full',
                            }" truncate @click="handleRWClick" />
                        </div>
                      </div>
                      <div class="w-28">
                        <UFormGroup label="Hours" name="Hours">
                          <UInput v-if="formData.JobType === 'Product'" v-model="prodHrs" />
                          <UInput v-else v-model="subHrs" />
                        </UFormGroup>
                      </div>
                    </div>
                    <div class="flex-col flex pl-3">
                      <span>Rework Cost</span>
                      <span v-if="formData.JobType === 'Product'">$ {{ (prodHrs * 36).toFixed(2) }}
                      </span>
                      <span v-else>$ {{ (subHrs * 36).toFixed(2) }} </span>
                    </div>
                  </div>

                  <div class="mt-5">
                    <UButton icon="i-heroicons-plus" variant="outline" color="green" label="Verify & Close Operation"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }" truncate />
                  </div>
                </div>
              </div>
              <div class="border-[1px] border-slate-200 p-2 m-2">
                <span class="text-sm"> Manage Time Entries</span>

                <div class="flex w-full space-x-3">
                  <div class="w-fit mt-6">
                    <UButton icon="i-heroicons-pencil-square" variant="outline" color="green"
                      label="Move Selected Enteries to Operation" :ui="{
                        base: 'w-fit',
                        truncate: 'flex justify-center w-full',
                      }" truncate />
                  </div>

                  <div class="basis-1/2">
                    <UFormGroup label="Destination Operation" name="Destination Operation">
                      <USelect v-if="formData.JobType === 'Product'" :options="prodDesOperations" />
                      <USelect v-else :options="subDesOperations" />
                    </UFormGroup>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formData.JobType === 'Product'" class="flex flex-col items-center justify-center">
              <div class="w-28">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DATEOPENED &&
                    format(formData.DATEOPENED, 'MM/dd/yyyy')
                    " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.DATEOPENED" is-required @close="close" />
                  </template>
                </UPopover>
              </div>

              <div class="mt-5">
                <UButton icon="i-heroicons-pencil-square" variant="outline" color="green" label="reSchedule Operation"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }" truncate />
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </UForm>

  <!-- Parts List Modal -->
  <UDashboardModal v-model="modalMeta.isPartsModalOpen" :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription" :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }">
    <JobPartsList :selected-job="selectedJob" @close="handleModalClose" />
  </UDashboardModal>

  <!-- Manufacturing Sequnce Modal -->
  <UDashboardModal v-model="modalMeta.isOperationModalOpen" :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription" :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }">
    <JobManufacturingSequenceForm :selected-job="selectedJob" />
  </UDashboardModal>

  <!-- Rework Parts Modal -->
  <UDashboardModal v-model="modalMeta.isReworkPartsModalOpen" :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription" :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }">
    <JobReworkParts :selected-job="selectedJob" />
  </UDashboardModal>
</template>
