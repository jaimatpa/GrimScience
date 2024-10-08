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

const user = useCookie<string>('user');
console.log(user)
const username = user.value.fname+" "+user.value.lname


const toast = useToast();
const router = useRouter();
const jobFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const JobExist = ref(true);
const isLoading = ref(false);
const categories = ref([]);
const subCategories = ref([]);
const part = ref([]);
const closedByUsers = ref([]);
const jobTypes = ref(["Product","Sub Assembly"]);
const perTypes = ref([]);
const productionUsers = ref([]);
const getEmployeees = ref([]);
const jobCat = ref([]);
const jobsubcat = ref([]);
const productLines = ref([]);
const models = ref([]);
const begPRSerial = ref(null);
const begSBSerial = ref(null);
const prodDesOperations = ref([]);
const subDesOperations = ref([]);
const prodScheduleHrs = ref("0");
const subScheduleHrs = ref("0");
const prodOperationIds = ref([]);
const subOperationIds = ref([]);
const multipleSerialSelect = ref([]);
const multipleEmployeeSelect = ref([]);
const multipleSubEmployeeSelect = ref([]);
const prodHrs = ref(0);
const subHrs = ref(0);
const unitCost = ref(null);
const reScheduleOp = ref(null)
const destOp = ref(null)
const operationHourInputDisable = ref(true)
const reworkCost = ref(0)
const sbQty = ref(null)
const instanceID = ref(0)
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
  InstanceID: null,
});


watch(() => formData.PRODUCTLINE, async (newProductLine) => {
  if (newProductLine) {
    await fetchModels(newProductLine);
  }
});

watch(() => formData.MODEL, async (newModel) => {
  if (newModel) {
    await getPRSerial(newModel);
  }
});

watch(() => formData.Catagory, async (newCategory) => {
  if (newCategory) {
    await fetchSubCategory(newCategory);
  }
});

watch(() => formData.SubCatagory, async (newSubCategory) => {
  if (newSubCategory) {
    await fetchPart(newSubCategory);
  }
});

watch(() => formData.PART, async (newPart) => {
  if (newPart) {
    await getSBSerial(newPart);
  }
});


let date = new Date();
let sbDate = new Date();
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
            instanceID.value = response._data.body["InstanceID"]
          }
        }
      }
    },
    onResponseError({}) {
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
  // await useApiFetch("/api/jobs/models", {
  //   method: "GET",
  //   params: {productline: formData.PRODUCTLINE},
  //   onResponse({ response }) {
  //     if (response.status === 200) {
  //       models.value = response._data.body;
  //     }
  //   },
  //   onResponseError() {
  //     models.value = [];
  //   },
  // });

  await fetchJobOperation();

  await useApiFetch(`/api/jobs/details`, {
    method: "GET",
    params: { ...jobFilters.value },
    onResponse({ response }) {
      if (response.status === 200) {

        if (formData.JobType === "Product") {
          productsSerialGridMeta.value.products = response._data.body;
        } else {
          productsSBSerialGridMeta.value.products = response._data.body;
        }
      }
    },
    onResponseError({}) {
      productsSerialGridMeta.value.products = [];
      productsSBSerialGridMeta.value.products = [];
    },
  });

  await useApiFetch(`/api/jobs/linkjob`, {
    method: "GET",
    params: { jobId: props.selectedJob },
    onResponse({ response }) {
      if (response.status === 200) {
        linkedJobGridMeta.value.jobs = response._data.body;
      }
    },
    onResponseError({}) {
      linkedJobGridMeta.value.jobs = null;
    },
  });
  await fetchModels(formData.PRODUCTLINE)
  await getLinkedJobs()
  await getSerial()
  await calculateLatestUnitCost()

  await propertiesInit();
  loadingOverlay.value = false;
};

const fetchModels = async (productLine) => {
  await useApiFetch("/api/jobs/models", {
    method: "GET",
    params: { productline: productLine },
    onResponse({ response }) {
      if (response.status === 200) {
        models.value = response._data.body;
      }
    },
    onResponseError() {
      models.value = [];
    },
  });
};

const getPRSerial = async (newModel) => {
  await useApiFetch("/api/jobs/getBegSerial", {
    method: "GET",
    params: { model: newModel },
    onResponse({ response }) {
      if (response.status === 200) {
        begPRSerial.value = response._data.body.recJOaBegSerial
        formData.InstanceID = response._data.body.recJOainstanceID
      }
    },
    onResponseError() {
      models.value = [];
    },
  });
}



const fetchSubCategory = async (category) => {
  await useApiFetch("/api/jobs/subCategories", {
    method: "GET",
    params: {category: category},
    onResponse({ response }) {
      if (response.status === 200) {
        subCategories.value = response._data.body.distinctSubCategories;
        part.value = response._data.body.distinctPart
      }
    },
    onResponseError() {
      subCategories.value = [];
      part.value = []
    },
  });
}

const fetchPart = async (subCategory) => {
  await useApiFetch("/api/jobs/parts", {
    method: "GET",
    params: {category: formData.Catagory, subCategory:subCategory},
    onResponse({ response }) {
      if (response.status === 200) {
        part.value = response._data.body
      }
    },
    onResponseError() {
      part.value = [];
    },
  });
}

const getSBSerial = async (newPart) => {
  await useApiFetch("/api/jobs/getBegSerial", {
    method: "GET",
    params: { model: newPart },
    onResponse({ response }) {
      if (response.status === 200) {
        begSBSerial.value = response._data.body.recJOaBegSerial
        formData.InstanceID = response._data.body.recJOainstanceID
      }
    },
    onResponseError() {
      models.value = [];
    },
  });
}

const getLinkedJobs = async () => {
  await useApiFetch(`/api/jobs/linkjob`, {
    method: "GET",
    params: { jobId: props.selectedJob },
    onResponse({ response }) {
      if (response.status === 200) {
        linkedJobGridMeta.value.jobs = response._data.body;
      }
    },
    onResponseError({}) {
      linkedJobGridMeta.value.jobs = null;
    },
  });
}

const getSerial = async () => {
  await useApiFetch(`/api/jobs/details`, {
    method: "GET",
    params: { ...jobFilters.value },
    onResponse({ response }) {
      if (response.status === 200) {
        if (formData.JobType === "Product") {
          productsSerialGridMeta.value.products = response._data.body;
        } else {
          productsSBSerialGridMeta.value.products = response._data.body;
        }
      }
    },
    onResponseError({}) {
      productsSerialGridMeta.value.products = [];
      productsSBSerialGridMeta.value.products = [];
    },
  });
}

const calculateLatestUnitCost = async () => {
  await useApiFetch(`/api/jobs/calculateLatestUnitCost/${props.selectedJob}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        unitCost.value = response._data.body
      }
    },
    onResponseError({}) {
      unitCost.value = null
    },
  });
}

const fetchJobOperation = async () => {
  // get job operation
  await useApiFetch("/api/jobs/operations", {
    method: "GET",
    params: { jobId:props.selectedJob, instanceId: formData.InstanceID, jobQty: formData.QUANTITY },
    onResponse({ response }) {
      if (response.status === 200) {
        if (formData.JobType === "Product") {
          prodOperationGridMeta.value.operations = response._data.body;
          prodDesOperations.value = response._data.body.map(
            (item) =>{
              return {name: item.Operation, value: item.uniqueID }
            } 
          );
        } else {
          subOperationGridMeta.value.subOperations = response._data.body;
          subDesOperations.value = response._data.body.map(
            (item) => {
              return {name: item.Operation, value: item.uniqueID }
            }
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
  // await useApiFetch("/api/jobs/jobTypes", {
  //   method: "GET",
  //   onResponse({ response }) {
  //     if (response.status === 200) {
  //       jobTypes.value = response._data.body;
  //     }
  //   },
  //   onResponseError() {
  //     jobTypes.value = [];
  //   },
  // });

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
        console.log(response._data.body)
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
  if (!state.NUMBER) errors.push({ path: 'NUMBER', message: 'Please enter your job number.' })
  if (!state.QUANTITY) errors.push({ path: 'QUANTITY', message: 'Please enter a your job quantity.' })
  if (!state.JobType) errors.push({ path: 'JobType', message: 'Please enter an job type.' })
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

const handleProdOperationSelect = async (row) => {
  prodOperationGridMeta.value.selectedOperation = { ...row, class: "" };
  prodOperationGridMeta.value.operations.forEach((c) => {
    if (c.uniqueID === row.uniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  emploeeFilterValues.value.OperationID = prodOperationGridMeta.value.selectedOperation.uniqueID;
  reScheduleOp.value = prodOperationGridMeta.value.selectedOperation.DateScheduled
  operationHourInputDisable.value = !prodOperationGridMeta.value.selectedOperation.verified
  prodHrs.value = prodOperationGridMeta.value.selectedOperation.reworkhrs ? prodOperationGridMeta.value.selectedOperation.reworkhrs : 0
  await useApiFetch(`/api/jobs/operations/reworkcost/`, {
    method: "GET",
    params: { jobId: props.selectedJob, operationId: prodOperationGridMeta.value.selectedOperation.uniqueID, reworkHrs: prodHrs.value },
    onResponse({ response }) {
      if (response.status === 200) {
        reworkCost.value = response._data.body
      }
    },
  });
  getSchedules();
};

const handleSubOperationSelect = async (row) => {
  subOperationGridMeta.value.selectedSubOperation = { ...row, class: "" };

  subOperationGridMeta.value.subOperations.forEach((c) => {
    if (c.uniqueID === row.uniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });

  emploeeFilterValues.value.OperationID = subOperationGridMeta.value.selectedSubOperation.uniqueID;
  operationHourInputDisable.value = !subOperationGridMeta.value.selectedSubOperation.verified
  subHrs.value = subOperationGridMeta.value.selectedSubOperation.reworkhrs ? subOperationGridMeta.value.selectedSubOperation.reworkhrs : 0
  await useApiFetch(`/api/jobs/operations/reworkcost/`, {
    method: "GET",
    params: { jobId: props.selectedJob, operationId: subOperationGridMeta.value.selectedSubOperation.uniqueID, reworkHrs: subHrs.value },
    onResponse({ response }) {
      if (response.status === 200) {
        reworkCost.value = response._data.body
      }
    },
  });

  getSchedules();
};

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
      description: "Please Select Rouge Operation",
      icon: "i-heroicons-check-circle",
      color: "red",
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

      await useApiFetch(`/api/jobs/operations/deleteoperation`, {
        method: "DELETE",
        params: {jobId:props.selectedJob, operationId:subOperationGridMeta.value.selectedSubOperation.uniqueID, planId:subOperationGridMeta.value.selectedSubOperation.PlanID },
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
      await fetchJobOperation()
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
      
      await useApiFetch(`/api/jobs/operations/deleteoperation`, {
        method: "DELETE",
        params: {jobId:props.selectedJob, operationId:prodOperationGridMeta.value.selectedOperation.uniqueID, planId:prodOperationGridMeta.value.selectedOperation.PlanID },
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
      await fetchJobOperation()
    }
  }
};

const handleDeleteAllOperation = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/operations/deleteallrougeoperation`, {
    method: "DELETE",
    params: {jobId:props.selectedJob },
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
  await fetchJobOperation()
  loadingOverlay.value = false
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
      key: "select",
      label: "Select",
      kind: "actions",
    },
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
      key: "select",
      label: "Select",
      kind: "actions",
    },
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
      key: "select",
      label: "Select",
      kind: "actions",
    },
    {
      key: "Serial",
      label: "Serial",
    },
    {
      key: "dateEntered",
      label: "Date Serialized",
    },
    {
      key: "CostPerUnit",
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
      key: "Quantity",
      label: "#",
    },
    {
      key: "dateEntered",
      label: "Date Completed",
    },
    {
      key: "CostPerUnit",
      label: "Material Cost",
      sortable: true,
      direction: 'asc' as const
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

const linkedJobGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "NUMBER",
      label: "Linked Job#",
    },
  ],
  jobs: [],
  selectedJob: null,
  isLoading: false,
});

const modalMeta = ref({
  isPartsModalOpen: false,
  modalTitle: "Parts Listing",
  modalDescription: "View Parts Listing",
  isOperationModalOpen: false,
  isReworkPartsModalOpen: false,
  isJobListModalOpen: false,
  reworkModalOperationId: null
});

const onDblClick = () => {
  modalMeta.value.isOperationModalOpen = true;
  modalMeta.value.modalTitle = "Manufacturing Secquence";
  modalMeta.value.modalDescription = `Manufacturing Secquence ${
    formData.MODEL ? formData.MODEL : formData.PART
  }`;
};

const handleRWClick = () => {
  modalMeta.value.isReworkPartsModalOpen = true;
  modalMeta.value.modalTitle = "Parts Used";
  modalMeta.value.modalDescription = "";

  if (
    subOperationGridMeta.value.selectedSubOperation === null &&
    prodOperationGridMeta.value.selectedOperation === null
  ) {
    toast.add({
      title: "Failed",
      description: "Please Select an Operation",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }

  if (subOperationGridMeta.value.selectedSubOperation !== null) {
    modalMeta.value.reworkModalOperationId = subOperationGridMeta.value.selectedSubOperation.uniqueID
  }

  if (prodOperationGridMeta.value.selectedOperation !== null) {
    modalMeta.value.reworkModalOperationId = prodOperationGridMeta.value.selectedOperation.uniqueID
  }
  
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

const handleUpdateQty = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/updateSerial/`, {
    method: "PUT",
    params: { jobId:props.selectedJob, jobQty: formData.QUANTITY, begSerial: begPRSerial.value },
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Updated Qty.",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
      emit('save')
    },
  });
  loadingOverlay.value = false
}

const handlePullIntoSerial = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/pullintoserial/`, {
    method: "PUT",
    params: { serialList: JSON.stringify(multipleSerialSelect.value), instanceId: formData.InstanceID, employee: username, perType: formData.PerType, jobPart: formData.PART, jobId: props.selectedJob, model: formData.MODEL, date:date },

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
  await getSerial()
  await calculateLatestUnitCost()
  loadingOverlay.value = false
}

const handlePullIntoInventory = async () => {
  if(sbQty.value){
    loadingOverlay.value = true
    await useApiFetch(`/api/jobs/pullintoinventory/`, {
      method: "PUT",
      body: { subSerialList: productsSBSerialGridMeta.value.products , instanceId: formData.InstanceID, employee: username, perType: formData.PerType, jobPart: formData.PART, jobId: props.selectedJob, jobQty: formData.QUANTITY, qty:sbQty.value, latestUnitCost: unitCost.value, date:sbDate },

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
    await getSerial()
    loadingOverlay.value = false
  }else{
    toast.add({
      title: "Success",
      description: "Please put a quantity",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }
}

const handleFixSerialIssue = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/fixSerialIssue/`, {
    method: "PUT",
    params: { serialList: JSON.stringify(multipleSerialSelect.value), instanceId: formData.InstanceID, employee: username, perType: formData.PerType, jobPart: formData.PART, jobId: props.selectedJob, date:date },
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
  await getSerial()
  await calculateLatestUnitCost()
  loadingOverlay.value = false
}

const correctInventory = async () => {
  if(productsSBSerialGridMeta.value.selectedProduct !== null){
    await useApiFetch(`/api/jobs/correctInventory/`, {
      method: "PUT",
      params: { jobId:props.selectedJob, employee: username, jobDetailId: productsSBSerialGridMeta.value.selectedProduct.UniqueID },
    });
  }else{
    toast.add({
      title: "Select",
      description: "Please select a serial",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }
  
}

const onMultipleSerialSelect = (row) => {
  productsSerialGridMeta.value.products.forEach(item => {
    if(item.checked === undefined){
      item.checked = false
    }
    if(item.UniqueID === row.UniqueID){
      item.checked = item.checked ? false : true
    }
  })
  multipleSerialSelect.value = productsSerialGridMeta.value.products
}

const handleJobListModalOpen = () => {
  modalMeta.value.isJobListModalOpen = true
}

const handleJobSelect = async (data) => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/linkjob/`, {
    method: "POST",
    body: { job1: props.selectedJob, job2: data.UniqueID },
    onResponse({ response }) {
      if (response.status === 200) {
        linkedJobGridMeta.value.jobs = [...linkedJobGridMeta.value.jobs, data]
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
    },
  });
  loadingOverlay.value = false
  modalMeta.value.isJobListModalOpen = false
}

const handleDeleteLinkedJob = async () =>{
  if(linkedJobGridMeta.value.selectedJob == null){
    toast.add({
      title: "Select",
      description: "Please select a job",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }else{
    loadingOverlay.value = true
    await useApiFetch(`/api/jobs/linkjob/`, {
      method: "DELETE",
      body: { jobID: props.selectedJob, linkedJobId: linkedJobGridMeta.value.selectedJob.UniqueID },
    });
    await getLinkedJobs()
    loadingOverlay.value = false
    modalMeta.value.isJobListModalOpen = false
  }
}

const onSelectLinkedJob = (row) => {
  linkedJobGridMeta.value.selectedJob = row
  linkedJobGridMeta.value.jobs.forEach((jobs) => {
    if (jobs.UniqueID === row.UniqueID) {
      jobs.class = "bg-gray-200";
    } else {
      delete jobs.class;
    }
  });
}

const onSelectSBSerial = (row) => {
  productsSBSerialGridMeta.value.selectedProduct = row
  productsSBSerialGridMeta.value.products.forEach((product) => {
    if (product.UniqueID === row.UniqueID) {
      product.class = "bg-gray-200";
    } else {
      delete product.class;
    }
  });
}

const handleRefreshOperation = async() => {
  loadingOverlay.value = true
  await useApiFetch("/api/jobs/operations/refreshoperations", {
    method: "GET",
    params: { jobId:props.selectedJob, instanceId: instanceID.value, recJOainstanceID: formData.InstanceID },
  });

  await fetchJobOperation()
  loadingOverlay.value = false
}

const reScheduleOperation = async() => {
  if(prodOperationGridMeta.value.selectedOperation !== null){
    loadingOverlay.value = true
    await useApiFetch("/api/jobs/operations/reScheduledOp", {
      method: "PUT",
      params: { operationId: prodOperationGridMeta.value.selectedOperation.uniqueID , date: reScheduleOp.value },
    });

    await fetchJobOperation()
    loadingOverlay.value = false
  }else{
    toast.add({
      title: "Select",
      description: "Please select a job",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }
  
}

const onMultipleEmployeeSelect = (row) => {
  prodEmployeeGridMeta.value.employees.forEach(item => {
    if(item.checked === undefined){
      item.checked = false
    }
    if(item.UniqueID === row.UniqueID){
      item.checked = item.checked ? false : true
    }
  })
  multipleEmployeeSelect.value = prodEmployeeGridMeta.value.employees
}

const onMultipleSubEmployeeSelect = (row) => {
  subEmployeeGridMeta.value.subEmployees.forEach(item => {
    if(item.checked === undefined){
      item.checked = false
    }
    if(item.UniqueID === row.UniqueID){
      item.checked = item.checked ? false : true
    }
  })
  multipleSubEmployeeSelect.value = subEmployeeGridMeta.value.subEmployees
}

const moveSelectedEnteriesToOperation = async () => {

  if(destOp !== null){
    

    if (
      subOperationGridMeta.value.selectedSubOperation === null &&
      prodOperationGridMeta.value.selectedOperation === null
    ) {
      toast.add({
        title: "Failed",
        description: "Please Select an Operation",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    }

    if (subOperationGridMeta.value.selectedSubOperation !== null) {
      loadingOverlay.value = true
      await useApiFetch("/api/jobs/operations/movetooperation", {
        method: "PUT",
        body: { operationId: destOp.value , employees: multipleSubEmployeeSelect.value },
        onResponse({ response }) {
        if (response.status === 200) {
          subEmployeeGridMeta.value.subEmployees = subEmployeeGridMeta.value.subEmployees.filter(item => item.checked === false)
        }
      },
      });

      destOp.value = null
      loadingOverlay.value = false
    }

    if (prodOperationGridMeta.value.selectedOperation !== null) {
      loadingOverlay.value = true
      await useApiFetch("/api/jobs/operations/movetooperation", {
        method: "PUT",
        body: { operationId: destOp.value , employees: multipleEmployeeSelect.value },
        onResponse({ response }) {
        if (response.status === 200) {
          prodEmployeeGridMeta.value.employees = prodEmployeeGridMeta.value.employees.filter(item => item.checked === false)
        }
      },
      });

      destOp.value = null
      loadingOverlay.value = false
    }
  }else{
    toast.add({
      title: "Select",
      description: "Please select destination operation",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }
}

const verifyAndCloseOperation = async () => {
  if (
    subOperationGridMeta.value.selectedSubOperation === null &&
    prodOperationGridMeta.value.selectedOperation === null
  ) {
    toast.add({
      title: "Failed",
      description: "Please Select an Operation",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }

  if (subOperationGridMeta.value.selectedSubOperation !== null) {
    loadingOverlay.value = true
    await useApiFetch(`/api/jobs/operations/verifyAndCloseOp/`, {
      method: "PUT",
      params: { jobId: props.selectedJob, operationId: subOperationGridMeta.value.selectedSubOperation.uniqueID, reworkHours: prodHrs.value, employee: username, perType: formData.PerType, quantity: formData.QUANTITY },
      onResponse({ response }) {
        
      },
    });

    operationHourInputDisable.value = false
    await fetchJobOperation()
    loadingOverlay.value = false
  }

  if (prodOperationGridMeta.value.selectedOperation !== null) {
    loadingOverlay.value = true
    await useApiFetch(`/api/jobs/operations/verifyAndCloseOp/`, {
      method: "PUT",
      params: { jobId: props.selectedJob, operationId: prodOperationGridMeta.value.selectedOperation.uniqueID, reworkHours: prodHrs.value, employee: username, perType: formData.PerType, quantity: formData.QUANTITY },
      onResponse({ response }) {
        
      },
    });

    operationHourInputDisable.value = false
    await fetchJobOperation()
    loadingOverlay.value = false
  }

}

const reOpenOperation = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/jobs/operations/reOpenOp/`, {
    method: "PUT",
    params: { jobId: props.selectedJob, operationId: prodOperationGridMeta.value.selectedOperation.uniqueID, unitCost: unitCost.value, employee: username, quantity: formData.QUANTITY },
    onResponse({ response }) {
      
    },
  });
  operationHourInputDisable.value = true
  await fetchJobOperation()
  loadingOverlay.value = false
}

const onReworkHrsChange = async (event) => {
  if (
    subOperationGridMeta.value.selectedSubOperation === null &&
    prodOperationGridMeta.value.selectedOperation === null
  ) {
    toast.add({
      title: "Failed",
      description: "Please Select an Operation",
      icon: "i-heroicons-check-circle",
      color: "red",
    });
  }

  if (subOperationGridMeta.value.selectedSubOperation !== null) {
    await useApiFetch(`/api/jobs/operations/reworkcost/`, {
      method: "GET",
      params: { jobId: props.selectedJob, operationId: subOperationGridMeta.value.selectedSubOperation.uniqueID, reworkHrs: event.target.value },
      onResponse({ response }) {
        if (response.status === 200) {
          reworkCost.value = response._data.body
        }
      },
    });
  }

  if (prodOperationGridMeta.value.selectedOperation !== null) {
    await useApiFetch(`/api/jobs/operations/reworkcost/`, {
      method: "GET",
      params: { jobId: props.selectedJob, operationId: prodOperationGridMeta.value.selectedOperation.uniqueID, reworkHrs: event.target.value },
      onResponse({ response }) {
        if (response.status === 200) {
          reworkCost.value = response._data.body
        }
      },
    });
  }

}

if (props.selectedJob !== null) editInit();
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
  </div>

  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    class="space-y-4"
    @submit="onSubmit"
  >
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
                <UInput 
                  v-model="unitCost"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup
                label="Relieve Inventory Per"
                name="Relieve Inventory Per"
              >
                <UInputMenu
                  v-model="formData.PerType"
                  v-model:query="formData.PerType"
                  :options="perTypes"
                />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Date Opened" name="Date Opened">
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
            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu
                  v-model="formData.ByEmployee"
                  v-model:query="formData.ByEmployee"
                  :options="getEmployeees"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Ready To Produce" name="Ready To Produce">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      formData.ProductionDate &&
                      format(formData.ProductionDate, 'MM/dd/yyyy')
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
                      v-model="formData.ProductionDate"
                      is-required
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>

            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu
                  v-model="formData.ProductionBy"
                  v-model:query="formData.ProductionBy"
                  :options="getEmployeees"
                />
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
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      formData.JOBCLOSED &&
                      format(formData.JOBCLOSED, 'MM/dd/yyyy')
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
                      v-model="formData.JOBCLOSED"
                      is-required
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="By" name="By">
                <UInputMenu
                  v-model="formData.ClosedBy"
                  v-model:query="formData.ClosedBy"
                  :options="getEmployeees"
                />
              </UFormGroup>
            </div>

            <div class="basis-1/5">
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

            <div class="basis-1/5">
              <UFormGroup label="Category" name="Category">
                <UInputMenu
                  v-model="formData.jobcat"
                  v-model:query="formData.jobcat"
                  :options="jobCat"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Sub Category" name="Sub Category">
                <UInputMenu
                  v-model="formData.jobsubcat"
                  v-model:query="formData.jobsubcat"
                  :options="jobsubcat"
                />
              </UFormGroup>
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-4 justify-start mt-5">
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
              @click="handleClearCick"
              truncate
            />
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
            <UButton
              icon="i-f7-arrow-clockwise"
              variant="outline"
              color="green"
              label="Refresh Job Costs"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              @click="handleRefreshOperation"
              truncate
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 justify-start mt-2">
        <div class="">
          <UButton
            icon="i-heroicons-magnifying-glass"
            variant="outline"
            color="green"
            label="View Parts List"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
            @click="onPartsClick()"
          />
        </div>
        <div class="">
          <UButton
            icon="i-heroicons-magnifying-glass"
            variant="outline"
            color="green"
            label="View Operations"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            @click="handleViewOperationClick"
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
    </div>
    <!-- Edit Tabs -->
    <div v-if="props.selectedJob !== null">
      <UTabs :items="tabitems" class="">
        <template #product="{ item }">
          <template v-if="formData.JobType === 'Product'">
            <div class="flex flex-col space-y-3">
              <div class="w-1/4">
                <UFormGroup label="Product Line" name="Product Line">
                  <UInputMenu
                    v-model="formData.PRODUCTLINE"
                    v-model:query="formData.PRODUCTLINE"
                    :options="productLines"
                  />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Model" name="Model">
                  <UInputMenu
                    v-model="formData.MODEL"
                    v-model:query="formData.MODEL"
                    :options="models"
                  />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Beginning SN#" name="Beginning SN#">
                  <UInput v-model="begPRSerial" />
                </UFormGroup>
              </div>
            </div>
            <div class="">
              <UFormGroup label="" name="Title">
                <UButton
                  label="Update Qty."
                  icon="i-f7-arrow-clockwise"
                  variant="outline"
                  color="green"
                  class="mt-6"
                  :ui="{
                    base: 'w-fit',
                    truncate: 'flex justify-center w-full',
                  }"
                  @click = "handleUpdateQty"
                />
              </UFormGroup>
            </div>
            <div class="w-full flex">
              <div class="w-1/2 mt-5">
                <UTable
                  v-if="formData.JobType === 'Product'"
                  :columns="productsSerialGridMeta.defaultColumns"
                  :rows="productsSerialGridMeta.products"
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
                  }"
                >
                <template  #select-data="{ row }">
                  <UTooltip text="Select" >
                    <UCheckbox
                     :model-value="row.checked"
                      @change="onMultipleSerialSelect(row)"
                    />
                  </UTooltip>
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
                  @click="handlePullIntoSerial"
                  truncate
                />
              </div>
              <div class="basis-1/6 mt-5">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="date && format(date, 'MM/dd/yyyy')"
                    variant="outline"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                  <template #panel="{ close }">
                    <CommonDatePicker
                      v-model="date"
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
                  @click="handleFixSerialIssue"
                  truncate
                />
              </div>
            </div>
          </template>
          <template v-if="formData.JobType === 'Sub Assembly'">
            <div class="flex flex-col space-y-3">
              <div class="w-1/4">
                <UFormGroup label="Category" name="Category">
                  <UInputMenu
                    v-model="formData.Catagory"
                    v-model:query="formData.Catagory"
                    :options="categories"
                  />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Sub Category" name="Sub Category">
                  <UInputMenu
                    v-model="formData.SubCatagory"
                    v-model:query="formData.SubCatagory"
                    :options="subCategories"
                  />
                </UFormGroup>
              </div>
              <div class="w-1/4">
                <UFormGroup label="Part" name="Part">
                <UInputMenu
                  v-model="formData.PART"
                  v-model:query="formData.PART"
                  :options="part"
                />
                </UFormGroup>
              </div>
            </div>

            <div class="w-full flex">
              <div class="w-1/2 mt-5">
                <UTable
                  :columns="productsSBSerialGridMeta.defaultColumns"
                  :rows="productsSBSerialGridMeta.products"
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
                  }"
                  @select="onSelectSBSerial"
                >
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
              <UButton
                icon="i-heroicons-plus"
                variant="outline"
                color="green"
                label="Pull into Inventory"
                :ui="{
                  base: 'w-fit',
                  truncate: 'flex justify-center w-full',
                }"
                @click="handlePullIntoInventory"
                truncate
              />
            </div>
            <div class="flex space-x-3 mt-4">
              <div class="basis-1/6">
                <UFormGroup label="Qty" name="Qty">
                  <UInput type="number" v-model="sbQty" />
                </UFormGroup>
              </div>

              <div class="basis-1/6 mt-5">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="date && format(sbDate, 'MM/dd/yyyy')"
                    variant="outline"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                  <template #panel="{ close }">
                    <CommonDatePicker
                      v-model="sbDate"
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
                  label="Correct Inventory"
                  :ui="{
                    base: 'w-fit',
                    truncate: 'flex justify-center w-full',
                  }"
                  @click="correctInventory"
                  truncate
                />
              </div>
            </div>
          </template>
        </template>

        <template #jobs="{ item }">
          <div class="w-1/2 mt-5">
            <UTable
              :columns="linkedJobGridMeta.defaultColumns"
              :rows="linkedJobGridMeta.jobs"
              :ui="{
                wrapper: 'h-96 border-2 border-gray-300 dark:border-gray-700',
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
              @select="onSelectLinkedJob"
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
                @click="handleJobListModalOpen"
                truncate
              />
            </div>
            <div class="w-fit">
              <UButton
                icon="i-heroicons-minus-circle-20-solid"
                variant="outline"
                color="red"
                label="Remove"
                :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }"
                @click="handleDeleteLinkedJob"
                truncate
              />
            </div>
          </div>
        </template>

        <template #operations="{ item }">
          <div class="flex space-x-2 justify-between mt-4">
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
                @click="handleRefreshOperation"
                truncate
              />
            </div>
            <div v-if="formData.JobType === 'Product'" class="basis-1/4">
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
                @click="handleDeleteOperation"
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
                @click="handleDeleteAllOperation"
                truncate
              />
            </div>
          </div>

          <div class="w-full mt-5">
            <UTable
              v-if="formData.JobType === 'Product'"
              :columns="prodOperationGridMeta.defaultColumns"
              :rows="prodOperationGridMeta.operations"
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
              }"
              @select="handleProdOperationSelect"
              @dblclick="onDblClick"
            >
              <template #empty-state>
                <div></div>
              </template>
            </UTable>

            <UTable
              v-else
              :columns="subOperationGridMeta.defaultColumns"
              :rows="subOperationGridMeta.subOperations"
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
              }"
              @select="handleSubOperationSelect"
              @dblclick="onDblClick"
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
                    v-if="formData.JobType === 'Product'"
                    :columns="prodEmployeeGridMeta.defaultColumns"
                    :rows="prodEmployeeGridMeta.employees"
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
                    }"
                  >
                    <template  #select-data="{ row }">
                      <UTooltip text="Select" >
                        <UCheckbox
                        :model-value="row.checked"
                          @change="onMultipleEmployeeSelect(row)"
                        />
                      </UTooltip>
                    </template>
                  </UTable>

                  <UTable
                    v-else
                    :columns="subEmployeeGridMeta.defaultColumns"
                    :rows="subEmployeeGridMeta.subEmployees"
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
                    }"
                  >
                  <template  #select-data="{ row }">
                      <UTooltip text="Select" >
                        <UCheckbox
                        :model-value="row.checked"
                          @change="onMultipleSubEmployeeSelect(row)"
                        />
                      </UTooltip>
                    </template>
                  </UTable>
                  <div class="w-full flex">
                    <span class="text-sm text-right w-full">
                      Total Hrs:
                      {{
                        formData.JobType === "Product"
                          ? prodScheduleHrs
                          : subScheduleHrs
                      }}</span
                    >
                  </div>
                </div>

                <div
                  class="basis-2/5 flex flex-col "
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
                            @click="handleRWClick"
                          />
                        </div>
                      </div>
                      <div class="w-28">
                        <UFormGroup label="Hours" name="Hours">
                          <UInput
                            v-if="formData.JobType === 'Product'"
                            :disabled="!operationHourInputDisable"
                            v-model="prodHrs"
                            type="number"
                            @input="onReworkHrsChange"
                          />
                          <UInput v-else 
                            :disabled="!operationHourInputDisable"
                            v-model="subHrs"
                            type="number"
                            @input="onReworkHrsChange"
                          />
                        </UFormGroup>
                      </div>
                    </div>
                    <div class="flex-col flex pl-3">
                      <span>Rework Cost</span>
                      <span v-if="formData.JobType === 'Product'"
                        >$ {{ reworkCost }}
                      </span>
                      <span v-else>$ {{ reworkCost }} </span>
                    </div>
                  </div>

                  <div class="mt-5" >
                    <UButton
                      v-if="operationHourInputDisable"
                      icon="i-heroicons-plus"
                      variant="outline"
                      color="green"
                      label="Verify & Close Operation"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="verifyAndCloseOperation"
                      truncate
                    />

                    <UButton
                      v-else
                      icon="i-f7-rays"
                      variant="outline"
                      color="red"
                      label="Re-Open Operation"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="reOpenOperation"
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
                      @click="moveSelectedEnteriesToOperation"
                      truncate
                    />
                  </div>

                  <div class="basis-1/2">
                    <UFormGroup
                      label="Destination Operation"
                      name="Destination Operation"
                    >
                      <USelect
                        v-if="formData.JobType === 'Product'"
                        v-model="destOp"
                        :options="prodDesOperations"
                        option-attribute="name"
                      />
                      <USelect 
                        v-else 
                        v-model="destOp"
                        :options="subDesOperations" 
                        option-attribute="name"
                      />
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
                      reScheduleOp &&
                      format(reScheduleOp, 'MM/dd/yyyy')
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
                      v-model="reScheduleOp"
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
                  @click="reScheduleOperation"
                  truncate
                />
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </UForm>

  <!-- Job List Modal -->
  <UDashboardModal
    v-model="modalMeta.isJobListModalOpen"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobListModal @close="handleJobSelect" />
  </UDashboardModal>

  <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobPartsList :selected-job="selectedJob" @close="handleModalClose" />
  </UDashboardModal>

  <!-- Manufacturing Sequnce Modal -->
  <UDashboardModal
    v-model="modalMeta.isOperationModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobManufacturingSequenceForm :selected-job="selectedJob" :instanceId="formData.InstanceID" :isModal="true "/>
  </UDashboardModal>

  <!-- Rework Parts Modal -->
  <UDashboardModal
    v-model="modalMeta.isReworkPartsModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobReworkParts :selected-job="selectedJob" :operationId="modalMeta.reworkModalOperationId" />
  </UDashboardModal>
</template>
