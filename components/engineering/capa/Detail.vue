<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";
import { format } from "date-fns";
import PartsComponent from "~/pages/materials/parts.vue";

const emit = defineEmits(["close", "link"]);
const props = defineProps({
    selectedCapa: {
        type: [Number, String, null],
        required: true,
    },
    isPage: {
        type: Boolean,
        default: true,
    },
});
const handleSelectedPart = (data) => {
    formData.PART = data;
    modalMeta.value.isPartsModalOpen = false;
};

const toast = useToast();
const loadingOverlay = ref(false);
const productLines = ref([]);
const employees = ref([]);
const workCenters = ref([]);
const noNeedValidationsChecked = ref(false);
const permissionEnabled = ref(false);
const formData = reactive({
    uniqueID: null,
    PANO: null,
    PRODLINE: null,
    DIAGDATE: null,
    ACTIONTYPE: null,
    DESCRIPTION: null,
    PROBLEMDESC: null,
    DIAGBY: null,
    PROBLEMDIAG: null,
    PART: null,
    VENDOR: null,
    WORKCENTERS: null,
    PREVENTPROB: null,
    ECO: null,
    Status: "Open",
    IMPLEMENTBY: null,
    IMPLEMENTDATE: null,
});
const investigationGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "PANO",
            label: "#",
            filterable: false,
        },
        {
            key: "PRODLINE",
            label: "Product Line",
            filterable: false,
            filterOptions: [],
        },
        {
            key: "DIAGDATE",
            label: "Date",
            filterable: false,
        },
        {
            key: "DESCRIPTION",
            label: "Description",
            filterable: false,
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
            key: "CUSTOMERNUMBER",
            label: "Customer#",
            filterable: true,
        },

    ],
    complaints: [],
    selectedComplaint: null,
    isLoading: false,
});
const capaGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "PANO",
            label: "#",
            filterable: true,
        },
        {
            key: "PRODLINE",
            label: "Action",
            filterable: true,
        },
        {
            key: "DIAGDATE",
            label: "Date",
            filterable: false,
        },
        {
            key: "ACTIONTYPE",
            label: "Type",
            filterable: true,
        },
        {
            key: "DESCRIPTION",
            label: "Description",
            filterable: true,
        },
    ],
    capas: [],
    selectedCapa: null,
    isLoading: false,
});

const modalMeta = ref({
    isConfirmRemoveModalOpen: false,
    isPartsModalOpen: false,
    isVendorModalOpen: false,
    isEcoModalOpen: false,
});
const statusGroup = ref([
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
]);
const actionTypes = ref([
    { value: "", label: "" },
    { value: "Corrective", label: "Corrective" },
    { value: "Preventative", label: "Preventative" },
    { value: "Repair", label: "Repair" },

]);
const selectedStatus = ref("open");
const filterValues = ref({
    PANO: null,
    PRODLINE: null,
    ACTIONTYPE: null,
    DESCRIPTION: null,
    chkOpenOnly: false,
});

// Complaints filter values

const complaintsFilterValues = ref({
    COMPLAINTDATE: null,
    SERIALNO: null,
    CUSTOMERNUMBER: null,
});

const editInit = async () => {
    loadingOverlay.value = true;
    await propertiesInit();
};
const propertiesInit = async () => {
    loadingOverlay.value = true;
    await getPermission();
    await fetchCapaList();
    await fetchProductLines();
    await fetchEmployees();
    await fetchWorkCenters();
    loadingOverlay.value = false;
};

const getPermission = async () => {
    await useApiFetch(`/api/engineering/capa/permissions`, {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                const data = response._data.body;
                if (data?.enabled === true) {
                    permissionEnabled.value = true;
                }
                else {
                    permissionEnabled.value = false;
                }
                console.log(permissionEnabled);
            }
        },
    });
};

const fetchCapaList = async () => {
    await useApiFetch(`/api/engineering/capa`, {
        method: "GET",
        params: {
            ...filterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                capaGridMeta.value.capas = response._data.body;
            }
        },
    });
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
                    fetchCapaList();
                } else if (response._data.messageType === "error") {
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

const fetchProductLines = async () => {
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

const fetchCapaDetails = async () => {
    await useApiFetch(`/api/engineering/capa/${capaGridMeta.value.selectedCapa?.uniqueID}`, {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                capaGridMeta.value.selectedCapa = response._data.body;

                Object.keys(formData).forEach((key) => {
                    const value = formData[key];
                    formData[key] = response._data.body[key];
                });
            }
        },
    });
};

const fetchComplaints = async () => {
    await useApiFetch(`/api/engineering/capa/complaints`, {
        method: "GET",
        params: {
            ...complaintsFilterValues.value,
            capaId: capaGridMeta.value.selectedCapa?.uniqueID,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                complaintGridMeta.value.complaints = response._data.body;
            }
        },
    });
};

const fetchInvestigations = async () => {
    await useApiFetch(`/api/engineering/capa/investigations`, {
        method: "GET",
        params: {
            PreventiveActionID: capaGridMeta.value.selectedCapa?.uniqueID,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                investigationGridMeta.value.investigations = response._data.body;
            }
        },
    });
};

const fetchWorkCenters = async () => {
    await useApiFetch(`/api/engineering/capa/workcenters`, {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                workCenters.value = response._data.body;
            }
        },
    });
};

const handleFilterChange = async (event, name) => {
    if (filterValues.value.hasOwnProperty(name)) {
        filterValues.value[name] = event;
    } else {
        console.error(`Filter does not have property: ${name}`);
    }
    await fetchCapaList();
};

const handleComplaintFilterChange = async (event, name) => {
    if (complaintsFilterValues.value.hasOwnProperty(name)) {
        complaintsFilterValues.value[name] = event;
    } else {
        console.error(`Filter does not have property: ${name}`);
    }
    await fetchComplaints();
};
const onCapaSelect = async (row) => {
    capaGridMeta.value.selectedCapa = { ...row, class: "" };
    emit('onCapaSelect', row?.uniqueID)
    capaGridMeta.value.capas.forEach((capa) => {
        if (capa.uniqueID === row.uniqueID) {
            capa.class = "bg-gray-200";
        } else {
            delete capa.class;
        }
    });

    investigationGridMeta.value.selectedInvestigation = null;
    complaintGridMeta.value.selectedComplaint = null;

    await fetchCapaDetails();
    await fetchComplaints();
    await fetchInvestigations();
};

// const onCapaSelect = (row) => {
//     capaGridMeta.value.selectedCapa = row;
//     capaGridMeta.value.capas.forEach((capa) => {
//         if (capa.uniqueID === row.uniqueID) {
//             capa.class = "bg-gray-200";
//         } else {
//             delete capa.class;
//         }
//     });
// };

const onWorkcenterChange = (index) => {

    //for workCenter length add 0 for each index in formData.WORKCENTERS string
    if(formData.WORKCENTERS === null){
        formData.WORKCENTERS = "0".repeat(workCenters.value.length);
    }
    else if (formData.WORKCENTERS.length < workCenters.value.length) {
        formData.WORKCENTERS = formData.WORKCENTERS.padEnd(workCenters.value.length, "0");
    }

    //for each checked checkbox, set the corresponding index to 1

    //break the string into an array of characters then chenge the index of the checked checkbox to 1 and join the array back to a string
    const workCentersArray = formData.WORKCENTERS.split("");
    workCentersArray[index] = "1";
    formData.WORKCENTERS = workCentersArray.join("");
};

const setWorkCenterChecked = (index) => {
    if (formData.WORKCENTERS === null) {
        return false;
    }
    return formData.WORKCENTERS[index] === "1";
};

const onChangePart = () => {
    modalMeta.value.isPartsModalOpen = true;
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
                        fetchCapaList();
                    } else if (response._data.messageType === "error") {
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

    await fetchCapaList();

    emit("close");
}
watch(
    () => filterValues.value.chkOpenOnly,
    () => {
        fetchCapaList();
    }
);
if (props.selectedCapa) editInit();
else propertiesInit();
</script>

<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533" loader="dots" />
    </div>

    <UForm :validate="validate" :validate-on="['submit']" :state="formData" @submit="onSubmit">
        <UDashboardNavbar v-if="props.isPage" class="gmsBlueHeader w-full" title="Corrective / Preventative Actions"> </UDashboardNavbar>
        <div class="flex flex-row">
            <div class="basis-2/3 border-[1px] border-slate-600 border-l-0 border-b-0 border-t-0 pb-3">
                <div class="w-full px-3 py-1 bg-slate-400">Lookup</div>
                <div class="flex flex-col space-y-2 px-3 pr-7">
                    <div class="flex justify-end">
                        <UCheckbox v-model="filterValues.chkOpenOnly" label="Show Open Only" class="pt-4" />
                    </div>
                    <UTable
                        :rows="capaGridMeta.capas"
                        :columns="capaGridMeta.defaultColumns"
                        class="w-full"
                        :ui="{
                            wrapper: 'overflow-auto h-60 border-2 border-gray-300 dark:border-gray-700 bg-white dark:text-gray dark:bg-[#111827]',
                            divide: 'divide-gray-200 dark:divide-gray-800',
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
                        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
                        @select="onCapaSelect"
                        @dblclick="">
                        <template v-for="column in capaGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                            <template v-if="column.kind !== 'actions'">
                                <template v-if="column.key === 'PRODLINE'">
                                    <div class="min-w-[160px]">
                                        <div class="px-4 py-3.5">
                                            <CommonSortAndInputFilter
                                                @handle-input-change="handleFilterChange"
                                                :label="column.label"
                                                :sortable="column.sortable"
                                                :sort-key="column.key"
                                                :filterable="column.filterable"
                                                :filter-key="column.key" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="px-4 py-3.5">
                                        <CommonSortAndInputFilter
                                            @handle-input-change="handleFilterChange"
                                            :label="column.label"
                                            :sortable="column.sortable"
                                            :sort-key="column.key"
                                            :filterable="column.filterable"
                                            :filter-key="column.key" />
                                    </div>
                                </template>
                            </template>
                            <template v-else class="bg-slate-400">
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
            <div class="basis-1/3">
                <div class="w-full px-3 py-1 bg-slate-400">Complaints</div>
                <div class="flex mt-11 px-3 pl-7">
                    <div class="">
                        <UTable
                            :rows="complaintGridMeta.complaints"
                            :columns="complaintGridMeta.defaultColumns"
                            class="w-[400px] overflow-y-auto"
                            :ui="{
                                wrapper: 'overflow-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                                divide: 'divide-gray-200 dark:divide-gray-800',
                                tr: {
                                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                                },
                                th: {
                                    base: 'sticky top-0 z-10',
                                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                                    padding: 'p-0',
                                },
                                td: {
                                    base: 'h-[31px]',
                                    padding: 'py-0',
                                },
                            }"
                            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
                            <template v-for="column in complaintGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                                <template v-if="column.key === 'Shipdate'">
                                    <div class="min-w-[160px]">
                                        <div class="px-4 py-3.5">
                                            <CommonSortAndInputFilter
                                                @handle-input-change="handleComplaintFilterChange"
                                                :label="column.label"
                                                :sortable="column.sortable"
                                                :sort-key="column.key"
                                                :filterable="column.filterable"
                                                :filter-key="column.key" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="px-4 py-3.5">
                                        <CommonSortAndInputFilter
                                            @handle-input-change="handleComplaintFilterChange"
                                            :label="column.label"
                                            :sortable="column.sortable"
                                            :sort-key="column.key"
                                            :filterable="column.filterable"
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
        <div class="flex flex-row">
            <div class="basis-2/3 border-[1px] border-slate-600 border-l-0 border-b-0 border-t-0">
                <div class="w-full px-3 py-1 bg-slate-400">Action</div>
                <div class="flex flex-col space-y-2 px-3 pr-7 py-3">
                    <div class="flex flex-row space-x-2">
                        <div class="min-w-[100px]">
                            <UFormGroup label="Number">
                                <div class="pl-2">
                                    {{ formData.PANO }}
                                </div>
                            </UFormGroup>
                        </div>
                        <div class="min-w-[150px]">
                            <UFormGroup label="Product Line">
                                <USelect v-model="formData.PRODLINE" :options="productLines" />
                            </UFormGroup>
                        </div>
                        <div class="min-w-[150px]">
                            <UFormGroup label="Date">
                                <UPopover :popper="{ placement: 'bottom-start' }">
                                    <UButton
                                        icon="i-heroicons-calendar-days-20-solid"
                                        :label="formData.DIAGDATE && format(formData.DIAGDATE, 'MM/dd/yyyy HH:mm:ss')"
                                        variant="outline"
                                        :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                                        truncate />
                                    <template #panel="{ close }">
                                        <CommonDatePicker v-model="formData.DIAGDATE" is-required @close="close" />
                                    </template>
                                </UPopover>
                            </UFormGroup>
                        </div>
                        <div class="min-w-[150px]">
                            <UFormGroup label="Type">
                                <USelect v-model="formData.ACTIONTYPE" :options="actionTypes" />
                            </UFormGroup>
                        </div>
                        <div class="flex-1">
                            <UFormGroup label="Description">
                                <UInput v-model="formData.DESCRIPTION" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="w-full">
                        <div class="flex-1">
                            <UFormGroup label="Define Problem">
                                <UInput v-model="formData.PROBLEMDESC" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="flex flex-row space-x-2">
                        <div class="min-w-[150px]">
                            <UFormGroup label="By">
                                <USelect v-model="formData.DIAGBY" :options="employees" />
                            </UFormGroup>
                        </div>
                        <div class="flex-1">
                            <UFormGroup label="How Was Problem Diagnosed?">
                                <UInput v-model="formData.PROBLEMDIAG" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="flex flex-row space-x-2 justify-start">
                        <div class="flex-1">
                            <UFormGroup label="Problem Part(s)">
                                <UInput v-model="formData.PART" />
                            </UFormGroup>
                        </div>
                        <div class="flex-1 mt-6">
                            <UFormGroup label="">
                                <UButton color="gray" variant="outline" label="Find Part" @click="onChangePart" />
                            </UFormGroup>
                        </div>
                    </div>

                    <div class="flex flex-row space-x-2 justify-start">
                        <div class="flex-1">
                            <UFormGroup label="Problem Vendor">
                                <UInput v-model="formData.VENDOR" />
                            </UFormGroup>
                        </div>
                        <div class="flex-1 mt-6">
                            <UFormGroup label="">
                                <UButton color="gray" variant="outline" label="Find Vendor" @click="onChangePart" />
                            </UFormGroup>
                        </div>
                        <div class="mt-6 font-semibold">Implement to Correct/Prevent Problem</div>
                    </div>

                    <div class="flex flex-row space-x-2">
                        <div class="flex-1 min-w-[200px] h-[150px] overflow-auto">
                            <!-- Create checkbox for each item in workcenters string array -->
                            <UFormGroup label="Problem Work">
                                <div v-for="(workCenter, index) in workCenters" :key="index">
                                    <input class="me-2" type="checkbox" :id="'workcenter-' + index" :value="workCenter" :checked="setWorkCenterChecked(index)" @change="onWorkcenterChange(index)" />
                                    <label :for="'workcenter-' + index">{{ workCenter }}</label>
                                </div>
                            </UFormGroup>
                        </div>
                        <div class="flex-1">
                            <UFormGroup label="Description">
                                <UTextarea v-model="formData.PREVENTPROB" :rows="6" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="flex flex-row space-x-2 justify-start">
                        <div class="flex-1">
                            <UFormGroup label="Engineering Changes">
                                <UInput v-model="formData.ECO" />
                            </UFormGroup>
                        </div>
                        <div class="flex-1 mt-6">
                            <UFormGroup label="">
                                <UButton color="gray" variant="outline" label="Find ECO" @click="onChangePart" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="flex justify-between pt-4">
                        <div class="flex flex-row gap-5 p-2 border-[1px] border-slate-200">
                            <URadio v-for="status of statusGroup" :key="status.value" v-model="formData.Status" v-bind="status" />
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="flex items-center font-medium">Closed By</div>
                            <div class="flex items-center min-w-[200px]">
                                <div class="w-full">
                                    <USelect v-model="formData.IMPLEMENTBY" :options="employees" />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="flex items-center font-medium">Closed Date</div>
                            <div class="flex items-center min-w-[200px]">
                                <div class="w-full">
                                    <UPopover :popper="{ placement: 'bottom-start' }">
                                        <UButton
                                            icon="i-heroicons-calendar-days-20-solid"
                                            :label="formData.IMPLEMENTDATE && format(formData.IMPLEMENTDATE, 'MM/dd/yyyy')"
                                            variant="outline"
                                            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                                            truncate />
                                        <template #panel="{ close }">
                                            <CommonDatePicker v-model="formData.IMPLEMENTDATE" @close="close" />
                                        </template>
                                    </UPopover>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row space-x-2">
                        <div class="w-full">
                            <UFormGroup label="">
                                <div>
                                    <input class="me-2" type="checkbox" id="noNeedValidqationsChk" :value="noNeedValidationsChecked" :checked="noNeedValidationsChecked"  />
                                    <label for="noNeedValidqationsChk">Verification & Validation - Not Required because product has been 100% and inspected for specification
conformity & effectiveness including confirmation that there is no adverse affect on the finished device.</label>
                                </div>
                                <div class="mt-2 text-gray-400">If box is unchecked above then Validation and/or Verification is requried. See SOP 10.1</div>
                            </UFormGroup>
                        </div>
                    </div>
                </div>
            </div>
            <div class="basis-1/3 flex flex-col">
                <div class="w-full px-3 py-1 bg-slate-400">Investigations</div>
                <div class="flex flex-col p-3 pl-7 space-y-2">
                    <div class="">
                        <UTable
                            :rows="investigationGridMeta.investigations"
                            :columns="investigationGridMeta.defaultColumns"
                            class="w-[400px] overflow-y-auto"
                            :ui="{
                                wrapper: 'overflow-auto h-[570px] border-2 border-gray-300 dark:border-gray-700',
                                divide: 'divide-gray-200 dark:divide-gray-800',
                                tr: {
                                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                                },
                                th: {
                                    base: 'sticky top-0 z-10',
                                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                                    padding: 'p-0',
                                },
                                td: {
                                    base: 'h-[31px]',
                                    padding: 'py-0',
                                },
                            }"
                            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
                            @select="">
                            <template v-for="column in investigationGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                                <template>
                                    <div class="min-w-[160px]">
                                        <div class="px-4 py-3.5">
                                            <CommonSortAndInputFilter
                                                @handle-input-change=""
                                                :label="column.label"
                                                :sortable="column.sortable"
                                                :sort-key="column.key"
                                                :filterable="column.filterable"
                                                :filter-key="column.key" />
                                        </div>
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
        <div class="flex justify-between px-3 py-2">
            <div class="basis-2/3">
                <div class="flex flex-row space-x-10">
                    <div class="min-w-[100px]">
                        <UButton
                            icon="i-heroicons-plus"
                            label="Add"
                            color="green"
                            variant="outline"
                            type="submit"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            :disabled="formData.uniqueID || permissionEnabled == false ? true : false"
                            truncate />
                    </div>
                    <div class="min-w-[150px]">
                        <UButton
                            icon="i-heroicons-pencil"
                            label="Modify"
                            variant="outline"
                            type="submit"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            :disabled="formData.uniqueID && permissionEnabled == true ? false : true"
                            truncate />
                    </div>
                    <div class="min-w-[150px]">
                        <UButton
                            icon="i-f7-rays"
                            label="Clear"
                            color="red"
                            variant="outline"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            @click="onClear"
                            :disabled="!permissionEnabled"
                            truncate />
                    </div>
                </div>
            </div>
            <div class="basis-1/3 flex justify-end">
                <div class="min-w-[150px]">
                    <UButton
                        icon="i-heroicons-cursor-arrow-ripple"
                        label="Select"
                        variant="outline"
                        :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                        truncate />
                </div>
            </div>
        </div>
    </UForm>

    <!-- Parts Modal -->

    <UDashboardModal
        v-model="modalMeta.isPartsModalOpen"
        title="Confirm Remove CAPA"
        :ui="{
            title: 'text-lg',
            header: {
                base: 'flex flex-row min-h-[0] items-center bg-white',
                padding: 'pt-5 sm:px-9',
            },
            body: { base: 'gap-y-1 bg-white', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
            width: 'w-[1200px] sm:max-w-9xl',
        }">
        <PartsComponent @onPartSelect="handleSelectedPart" />
    </UDashboardModal>
</template>
