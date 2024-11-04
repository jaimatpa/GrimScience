<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";
import { format } from "date-fns";
const emit = defineEmits(["close", "link"]);
const props = defineProps({
  selectedInvestigation: {
    type: [Number, String, null],
    required: true,
  },
  isPage: {
    type: Boolean,
    default: true,
  },
});
const handleSelectedCapa = async (data) => {
  await addCapa(data);
  await fetchCapas();
};

const capaToAdd = ref([]);
const toast = useToast();
const loadingOverlay = ref(false);
const productLines = ref([]);
const employees = ref([]);
const formData = reactive({
  uniqueID: null,
  PRODLLINE: null,
  DIAGDATE: null,
  DESCRIPTION: null,
  PROBELMDESC: null,
  DIAGBY: null,
  PREVENTPROB: null,
  PROBLEMDIAG: null,
  Status: null,
  IMPLEMENTBY: null,
  IMPLEMENTDATE: null
})

const investigationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "uniqueID",
      label: "#",
      filterable: true,
    },
    {
      key: "PRODLINE",
      label: "Product Line",
      filterable: true,
      filterOptions: [],
    },
    {
      key: "DIAGDATE",
      label: "Date",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      filterable: true,
    },
    {
      key: "Status",
      label: "Status",
    },
  ],
  investigations: [],
  selectedInvestigation: null,
  isLoading: false,
});
const complaintGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "COMPLAINTDATE",
      label: "Date",
      filterable: false,
    },
    {
      key: "SERIALNO",
      label: "Serial",
      filterable: true,
    },
    {
      key: "COMPLAINTNUMBER",
      label: "Complaint#",
      filterable: true,
    },
    {
      key: "Shipdate",
      label: "Ship Date",
      filterable: false,
    },
  ],
  complaints: [],
  selectedComplaint: null,
  isLoading: false,
});
const capaGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "DIAGDATE",
      label: "Date",
      filterable: false,
    },
    {
      key: "ACTIONTYPE",
      label: "Action",
      filterable: false,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      filterable: false,
    },
  ],
  capas: [],
  selectedCapa: null,
  isLoading: false,
});
const serialGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "serial",
      label: "Serial",
    },
  ],
  serials: [],
  selectedSerial: null,
  isLoading: false,
});
const invoiceGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "orderdate",
      label: "Date",
    },
    {
      key: "invoicenumber",
      label: "Invoice#",
    },
    {
      key: "terms",
      label: "Terms",
    },
  ],
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
});
const serviceReportGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "REPAIRDATE",
      label: "Date",
    },
    {
      key: "REPAIRDESC",
      label: "Type",
    },
    {
      key: "REPAIRSBY",
      label: "By",
    },
  ],
  serviceReports: [],
  selectedServiceReport: null,
  isLoading: false,
});

const serviceOrderInfo = ref({
  COMPLAINTNUMBER: null,
  COMPLAINTDATE: null,
  RECBY: null,
  RECBYOptions: [],
  SERIALNO: null,
  COMPLAINT: null,
  PRODUCTDESC: null,
});
const customerId = ref(null);
const typeOfServiceInfo = ref({
  reason: null,
  failure: null,
  reasonOptions: [],
});
const modalMeta = ref({
  isConfirmRemoveModalOpen: false,
  isCapaModalOpen: false,
  isInvoiceModalOpen: false,
  isInvoiceListModalOpen: false,
  isComplaintsModalOpen: false
});
const selectedServiceReportID = ref(null);
const date = ref(new Date());
const statusGroup = ref([
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
]);
const selectedStatus = ref("open");
const filterValues = ref({
  uniqueID: null,
  PRODLINE: null,
  Status: true,
  DIAGDATE: null,
  DESCRIPTION: null,
});

// Complaints filter values

const complaintsFilterValues = ref({
  COMPLAINTDATE: null,
  SERIALNO: null,
  COMPLAINTNUMBER: null,
  Shipdate: null,
});
const onComplaintsModal = () => {
  useApiFetch(`/api/customers`, {
    method: "GET",
    params: {
      number: complaintGridMeta.value.selectedComplaint.CustomerNumber,
    },
    onResponse({ response }) {
      console.log({ customerResponse: response });
      if (response.status === 200) {
        customerId.value = response._data.body[0].UniqueID;
        if (customerId) {

          modalMeta.value.isComplaintsModalOpen = true;
        }

      }
    }
  })
}
const editInit = async () => {
  loadingOverlay.value = true;
  await propertiesInit();
};
const propertiesInit = async () => {
  loadingOverlay.value = true;
  await fetchInvestigationList();
  await fetchInvestigationProductLines();
  await fetchEmployees();
  loadingOverlay.value = false;
};

const fetchInvestigationList = async () => {
  await useApiFetch(`/api/engineering/investigations`, {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        investigationGridMeta.value.investigations = response._data.body;
      }
    },
  });
};
const addCapa = async (data) => {
  capaToAdd.value = data;
  if (!capaToAdd.value) {
    toast.add({
      title: "Error",
      description: "Please select a CAPA to add.",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
    return;
  } else {
    await useApiFetch(`/api/engineering/investigations/capas`, {
      method: "POST",
      params: {
        investigationID: parseInt(investigationGridMeta.value.selectedInvestigation?.uniqueID),
        uid: capaToAdd.value,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          modalMeta.value.isCapaModalOpen = false;
          capaToAdd.value = null;
        }
      },
    });
  }
};

const onInvestigationCreate = async () => {
  await useApiFetch(`/api/engineering/investigations`, {
    method: "POST",
    body: formData,
    onResponse({ response }) {
      if (response.status === 200) {
        if (response._data.messageType === "success") {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
          onClear();
          fetchInvestigationList();
        }
        else if (response._data.messageType === "error") {
          toast.add({
            title: "Failed",
            description: response._data.message,
            icon: "i-heroicons-minus-circle",
            color: "red",
          });
        }

        // fetchInvestigationList();
      }
    },
    onResponseError({ response }) {
      if (response.status === 400) {
        toast.add({
          title: "Error",
          description: response._data.message,
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    },
  });
};

const fetchInvestigationProductLines = async () => {
  await useApiFetch(`/api/engineering/investigations/productlines`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        productLines.value = response._data.body;
      }
    },
  });
};

const fetchEmployees = async () => {
  await useApiFetch(`/api/engineering/investigations/employees`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        employees.value = response._data.body;
      }
    },
  });
};

const fetchInvestigationDetails = async () => {
  await useApiFetch(`/api/engineering/investigations/${investigationGridMeta.value.selectedInvestigation?.uniqueID}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        investigationGridMeta.value.selectedInvestigation = response._data.body;

        Object.keys(formData).forEach((key) => {
          const value = formData[key];
          formData[key] = response._data.body[key];
        });
      }
    },
  });
};

const fetchComplaints = async () => {
  await useApiFetch(`/api/engineering/investigations/complaints`, {
    method: "GET",
    params: {
      ...complaintsFilterValues.value,
      investigationID: investigationGridMeta.value.selectedInvestigation?.uniqueID,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        complaintGridMeta.value.complaints = response._data.body;
      }
    },
  });
};

const fetchCapas = async () => {
  await useApiFetch(`/api/engineering/investigations/capas`, {
    method: "GET",
    params: {
      investigationID: investigationGridMeta.value.selectedInvestigation?.uniqueID,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        capaGridMeta.value.capas = response._data.body;
      }
    },
  });
};

const removeCapa = async () => {
  await useApiFetch(`/api/engineering/investigations/capas`, {
    method: "DELETE",
    params: {
      investigationID: parseInt(investigationGridMeta.value.selectedInvestigation?.uniqueID),
      uid: parseInt(capaGridMeta.value.selectedCapa?.uniqueID),
    },
    onResponse({ response }) {
      if (response.status === 200) {
        modalMeta.value.isConfirmRemoveModalOpen = false;
        capaGridMeta.value.selectedCapa = null;
        capaGridMeta.value.capas.forEach((capa) => {
          delete capa.class;
        });
        fetchCapas();
      }
    },
  });
};

const handleFilterChange = async (event, name) => {
  console.log(event, name);
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  await fetchInvestigationList();
};

const handleComplaintFilterChange = async (event, name) => {
  if (complaintsFilterValues.value.hasOwnProperty(name)) {
    complaintsFilterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  await fetchComplaints();
};
const onInvestigationSelect = async (row) => {
  investigationGridMeta.value.selectedInvestigation = { ...row, class: "" };
  investigationGridMeta.value.investigations.forEach((investigation) => {
    if (investigation.uniqueID === row.uniqueID) {
      investigation.class = "bg-gray-200";
    } else {
      delete investigation.class;
    }
  });

  capaGridMeta.value.selectedCapa = null;
  complaintGridMeta.value.selectedComplaint = null;

  fetchInvestigationDetails();
  fetchComplaints();
  fetchCapas();
};
const onInvestigationDblclick = () => {
  emit("link", investigationGridMeta.value.selectedInvestigation?.uniqueID);
  emit("close");
};

const onCapaSelect = (row) => {
  capaGridMeta.value.selectedCapa = row;
  capaGridMeta.value.capas.forEach((capa) => {
    if (capa.uniqueID === row.uniqueID) {
      capa.class = "bg-gray-200";
    } else {
      delete capa.class;
    }
  });
};

const validate = (state: any): FormError[] => {
  const errors = [];

  return errors;
};

const onClear = () => {
  investigationGridMeta.value.selectedInvestigation = null;
  Object.keys(formData).forEach((key) => {
    formData[key] = null;
    formData.Status = "Open";
  });

  investigationGridMeta.value.investigations.forEach((investigation) => {
    delete investigation.class;
  });

  complaintGridMeta.value.complaints = [];
  complaintGridMeta.value.selectedComplaint = null;
  capaGridMeta.value.capas = [];
  capaGridMeta.value.selectedCapa = null;
};

const previewReport = () => {
  window.open(`/api/engineering/investigations/previewreport/${investigationGridMeta.value.selectedInvestigation?.uniqueID}`);
};


async function onSubmit(event: FormSubmitEvent<any>) {
  console.log("submitting");
  if (investigationGridMeta.value.selectedInvestigation) {
    console.log("attempting to update");
    await useApiFetch(`/api/engineering/investigations`, {
      method: "PUT",
      body: formData,
      onResponse({ response }) {
        if (response.status === 200) {
          if (response._data.messageType === "success") {
            toast.add({
              title: "Success",
              description: response._data.message,
              icon: "i-heroicons-check-circle",
              color: "green",
            });
            fetchInvestigationList();
          }
          else if (response._data.messageType === "error") {
            toast.add({
              title: "Failed",
              description: response._data.message,
              icon: "i-heroicons-minus-circle",
              color: "red",
            });
          }
        }
      },
      onResponseError({ response }) {
        if (response.status === 400) {
          toast.add({
            title: "Error",
            description: response._data.message,
            icon: "i-heroicons-x-circle",
            color: "red",
          });
        }
      },
    });
  } else {
    console.log("attempting to create");
    await onInvestigationCreate();
  }

  await fetchInvestigationList();

  emit("close");
}
watch(
  () => filterValues.value.Status,
  () => {
    fetchInvestigationList();
  }
);
if (props.selectedInvestigation) editInit();
else propertiesInit();
</script>


<template>
  <UDashboardPage>
    <div class="vl-parent">
      <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
        loader="dots" />
    </div>
    <UForm :validate="validate" :validate-on="['submit']" :state="formData" @submit="onSubmit">

      <div class="flex flex-col">
        <UDashboardNavbar v-if="props.isPage" class="gmsBlueHeader w-full" title="Root Cause Investigation">
          <template #right>
            <UButton color="green" variant="outline" :loading="exportIsLoading" label="Export to Excel"
              trailing-icon="i-heroicons-document-text" @click="excelExport" block />
          </template>
        </UDashboardNavbar>
      </div>
      <div class="grid grid-cols-3 border-b-[3px] border-black">
        <div class="col-span-2 border-r-[3px] border-black">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Lookup
          </div>
          <div class="flex flex-col space-y-2 p-3">
            <div class="flex justify-end">
              <UCheckbox v-model="filterValues.Status" label="Show Open Only" class="" />
            </div>
            <UTable :rows="investigationGridMeta.investigations" :columns="investigationGridMeta.defaultColumns"
              class="w-full" :ui="{
                wrapper: 'h-[225px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                divide: 'divide-gray-200 dark:divide-gray-800',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                },
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white',
                  padding: 'p-0'
                },
                td: {
                  padding: 'py-0'
                }
              }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
              @select="onInvestigationSelect" @dblclick="onInvestigationDblclick">
              <template v-for="column in investigationGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                <template v-if="column.kind !== 'actions'">
                  <template v-if="column.key === 'PRODLINE'">
                    <div class="min-w-[160px]">
                      <div class="p-1">
                        <CommonSortAndSelectFilter @handle-select-change="handleFilterChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                          :filter-key="column.key" :filterOptions="productLines" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template v-else class='bg-slate-400'>
                  <div class="flex justify-center text-center w-[53px]">
                    {{ column.label }}
                  </div>
                </template>
              </template>
              <template #empty-state>
                <div></div>
              </template>
            </UTable>
          </div>
        </div>
        <div class="col-span-1 ">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Complaints
          </div>
          <div class="flex p-3">
            <div class="">
              <UTable :rows="complaintGridMeta.complaints" :columns="complaintGridMeta.defaultColumns" class="w-full"
                :ui="{
                  wrapper: 'h-[253px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white',
                    padding: 'p-0'
                  },
                  td: {
                    padding: 'py-0'
                  }
                }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
                @select="row => complaintGridMeta.selectedComplaint = row" @dblclick="onComplaintsModal">
                <template v-for="column in complaintGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                  <template v-if="column.key === 'Shipdate'">

                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleComplaintFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>

                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleComplaintFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 border-b-[3px] border-black">
        <div class="col-span-2 border-r-[3px] border-black">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            Investigation
          </div>
          <div class="flex flex-col space-y-2 p-3">
            <div class="flex flex-row space-x-2">
              <div class="basis-1/12">
                <UFormGroup label="Number">
                  <div class="">
                    {{ formData.uniqueID }}
                  </div>
                </UFormGroup>
              </div>
              <div class="basis-3/12">
                <UFormGroup label="Product Line">
                  <USelect v-model="formData.PRODLLINE" :options="productLines" />
                </UFormGroup>
              </div>
              <div class="basis-3/12">
                <UFormGroup label="Date">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid"
                      :label="formData.DIAGDATE && format(formData.DIAGDATE, 'MM/dd/yyyy HH:mm:ss')" variant="outline"
                      :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                    <template #panel="{ close }">
                      <CommonDatePicker v-model="formData.DIAGDATE" is-required @close="close" />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-5/12">
                <UFormGroup label="Description">
                  <UInput v-model="formData.DESCRIPTION" />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="basis-5/6">
                <UFormGroup label="Define Investigations?">
                  <UInput v-model="formData.PROBELMDESC" />
                </UFormGroup>
              </div>
              <div class="basis-1/6">
                <UFormGroup label="Diagnosed By">
                  <USelect v-model="formData.DIAGBY" :options="[formData.DIAGBY]" />
                </UFormGroup>
              </div>
            </div>
            <div class="w-full">
              <UFormGroup label="Investigation(Use the 5 Whys Method at a minium)">
                <UTextarea v-model="formData.PROBELMDESC" :rows="6" />
              </UFormGroup>
            </div>
            <div class="w-full">
              <UFormGroup label="Root Cause">
                <UInput v-model="formData.PROBLEMDIAG" />
              </UFormGroup>
            </div>
            <div class="flex justify-between">
              <div class="flex flex-row gap-5 p-2 border-[1px] border-slate-400">
                <URadio v-for="status of statusGroup" :key='status.value' v-model="selectedStatus" v-bind="status" />
              </div>
              <div class="flex flex-row space-x-2">
                <div class="flex items-center font-medium">
                  Closed By
                </div>
                <div class="flex items-center min-w-[200px]">
                  <div class="w-full">
                    <USelect v-model="formData.IMPLEMENTBY" />
                  </div>
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <div class="flex items-center font-medium">
                  Closed Date
                </div>
                <div class="flex items-center min-w-[200px]">
                  <div class="w-full">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid"
                        :label="serviceOrderInfo.COMPLAINTDATE && format(serviceOrderInfo.COMPLAINTDATE, 'MM/dd/yyyy')"
                        variant="outline" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="date" is-required @close="close" />
                      </template>
                    </UPopover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1 flex flex-col">
          <div class="w-full px-3 py-1 gmsBlueTitlebar">
            CAPAS
          </div>
          <div class="flex flex-col p-3 space-y-2">
            <div class="">
              <UTable :rows="capaGridMeta.capas" :columns="capaGridMeta.defaultColumns" class="w-full" :ui="{
                wrapper: 'h-[354px] overflow-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                divide: 'divide-gray-200 dark:divide-gray-800',
                tr: {
                  active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                },
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white',
                  padding: 'p-0'
                },
                td: {
                  padding: 'py-0'
                }
              }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
                @select="onCapaSelect">
                <template v-for="column in complaintGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                  <template v-if="column.key === 'Shipdate'">
                    <div class="min-w-[160px]">
                      <div class="p-1">
                        <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                          :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                          :filter-key="column.key" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-1">
                      <CommonSortAndInputFilter @handle-input-change="handleFilterChange" :label="column.label"
                        :sortable="column.sortable" :sort-key="column.key" :filterable="column.filterable"
                        :filter-key="column.key" />
                    </div>
                  </template>
                </template>
                <template #empty-state>
                  <div></div>
                </template>
              </UTable>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="w-1/2">
                <UButton color="gms-blue" label="Add CAPA" @click="() => (modalMeta.isCapaModalOpen = true)" block />
              </div>
              <div class="w-1/2">
                <UButton color="gms-blue" label="Remove CAPA" block :disabled="capaGridMeta.selectedCapa ? false : true"
                  @click="modalMeta.isConfirmRemoveModalOpen = true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 p-3">
        <div class="col-span-2 ">
          <div class="flex flex-row space-x-2">
            <div class="basis-1/4">
              <UButton icon="i-heroicons-eye" label="Preview Report" @click="previewReport" variant="outline" block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-plus" :disabled="formData.uniqueID ? true : false" label="Add" color="green"
                variant="outline" block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-heroicons-pencil" label="Modify" variant="outline" block />
            </div>
            <div class="basis-1/4">
              <UButton icon="i-f7-rays" label="Clear" @click="onClear" color="red" variant="outline" block />
            </div>
          </div>
        </div>
        <div class="col-span-1 flex justify-end">
          <div class="w-1/2">
            <UButton icon="i-heroicons-cursor-arrow-ripple" label="Select" variant="outline" block />
          </div>
        </div>
      </div>
    </UForm>
  </UDashboardPage>
  <UDashboardModal v-model="modalMeta.isConfirmRemoveModalOpen" title="Confirm Remove CAPA" :ui="{
    header: {
      base: 'bg-gms-blue',
    },
    body: {
      base: 'bg-white',
    },
    width: 'w-[400px] sm:max-w-9xl',
  }">
    <UCard :ui="{ ring: '', shadow: 'shadow-none' }">
      <div class="flex flex-row space-x-2">
        <div class="flex w-full mb-3">Are You Sure You Wish To Remove This Action From The Investigation?"</div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="flex w-full justify-between">
          <UButton label="Yes" color="green" variant="outline"
            :ui="{ base: 'w-[100px]', truncate: 'flex justify-center w-full' }" @click="removeCapa" truncate />
          <UButton label="No" color="red" variant="outline"
            :ui="{ base: 'w-[100px]', truncate: 'flex justify-center w-full' }"
            @click="modalMeta.isConfirmRemoveModalOpen = false" truncate />
        </div>
      </div>
    </UCard>
  </UDashboardModal>

  <UDashboardModal v-model="modalMeta.isCapaModalOpen" title="ADD CAPA" :ui="{
    header: {
      base: 'bg-gms-blue',
    },
    width: 'w-[1250px]',
  }">
    <EngineeringCapaDetail :isPage="false" @link="handleSelectedCapa" />
  </UDashboardModal>
  <UDashboardModal v-model="modalMeta.isComplaintsModalOpen" title="Service Order" :ui="{
    header: {
      base: 'bg-gms-purple',
    },
    width: 'w-[1250px]',
  }">
    <ServiceOrderDetail :selected-order="complaintGridMeta.selectedComplaint.COMPLAINTNUMBER"
      :selected-serial="complaintGridMeta.selectedComplaint.SERIALNO" :selected-customer="customerId" :isPage="false" />
  </UDashboardModal>

</template>
