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
const partsData = ref('');
const handleUpdateData = (data) => {
    formData.PART = data
    modalMeta.value.isPartsModalOpen = false
}
// watch(partsData, (newVal) => {
//   console.log(newVal, "newVal")
//   modalMeta.value.isPartsModalOpen = false
//   // Example of how you might use the data
//   // formData.PART = newVal
// })
const toast = useToast();
const loadingOverlay = ref(false);
const productLines = ref([]);
const employees = ref([]);
const formData = reactive({
    uniqueID: null,
    PANO: null,
    PRODLINE: null,
    DIAGDATE: null,
    DESCRIPTION: null,
    PROBLEMDESC: null,
    DIAGBY: null,
    PROBLEMDIAG: null,
    PART: null,
    PREVENTPROB: null,
    PROBLEMDIAG: null,
    Status: "Open",
    IMPLEMENTBY: null,
    IMPLEMENTDATE: null,
});
const investigationGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "PANO",
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
    isInvoiceModalOpen: false,
    isInvoiceListModalOpen: false,
});
const statusGroup = ref([
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
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
    COMPLAINTNUMBER: null,
    Shipdate: null,
});

const editInit = async () => {
    loadingOverlay.value = true;
    await propertiesInit();
};
const propertiesInit = async () => {
    loadingOverlay.value = true;
    await fetchCapaList();
    await fetchInvestigationProductLines();
    await fetchEmployees();
    loadingOverlay.value = false;
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

const fetchCapaDetails = async () => {
    await useApiFetch(`/api/engineering/capa/${capaGridMeta.value.selectedCapa?.uniqueID}`, {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                capaGridMeta.value.selectedCapa = response._data.body;

                // Object.keys(formData).forEach((key) => {
                //     const value = formData[key];
                //     formData[key] = response._data.body[key];
                // });
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
    capaGridMeta.value.capas.forEach((capa) => {
        if (capa.uniqueID === row.uniqueID) {
            capa.class = "bg-gray-200";
        } else {
            delete capa.class;
        }
    });

    investigationGridMeta.value.selectedInvestigation = null;
    complaintGridMeta.value.selectedComplaint = null;

    fetchCapaDetails();
    // fetchComplaints();
    // fetchCapas();
};
const onInvestigationDblclick = () => {
    emit("link", investigationGridMeta.value.selectedInvestigation?.uniqueID);
    emit("close");
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

const onChangePart = () => {
    // reset customer filter values
    // customerFilterValues.value = {
    //     market: null,
    //     source: null,
    //     ParadynamixCatagory: null,
    //     SourceConfrence: null,
    //     number: null,
    //     fname: null,
    //     lname: null,
    //     company1: null,
    //     homephone: null,
    //     workphone: null,
    //     state: null,
    //     zip: null,
    // };

    // getCustomers();
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
                        @dblclick="onInvestigationDblclick">
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
                            class="w-full"
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




                    <div class="w-full">
                        <UFormGroup label="Investigation(Use the 5 Whys Method at a minium)">
                            <UTextarea v-model="formData.PREVENTPROB" :rows="6" />
                        </UFormGroup>
                    </div>
                    <div class="w-full">
                        <UFormGroup label="Root Cause">
                            <UInput v-model="formData.PROBLEMDIAG" />
                        </UFormGroup>
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
                </div>
            </div>
            <div class="basis-1/3 flex flex-col">
                <div class="w-full px-3 py-1 bg-slate-400">Investigations</div>
                <div class="flex flex-col p-3 pl-7 space-y-2">
                    <div class="">
                        <UTable
                            :rows="investigationGridMeta.investigations"
                            :columns="investigationGridMeta.defaultColumns"
                            class="w-full"
                            :ui="{
                                wrapper: 'overflow-auto h-[370px] border-2 border-gray-300 dark:border-gray-700',
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
                            @select="onCapaSelect">
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
                    <div class="flex flex-row space-x-2">
                        <div class="w-full">
                            <UButton label="Add CAPA" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                        </div>
                        <div class="w-full">
                            <UButton
                                label="Remove CAPA"
                                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                                :disabled="capaGridMeta.selectedCapa ? false : true"
                                @click="modalMeta.isConfirmRemoveModalOpen = true"
                                truncate />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between px-3 py-2">
            <div class="basis-2/3">
                <div class="flex flex-row space-x-10">
                    <div class="min-w-[150px]">
                        <UButton
                            icon="i-heroicons-eye"
                            label="Preview Report"
                            variant="outline"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            @click="previewReport"
                            truncate />
                    </div>
                    <div class="min-w-[100px]">
                        <UButton
                            icon="i-heroicons-plus"
                            label="Add"
                            color="green"
                            variant="outline"
                            type="submit"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            :disabled="formData.uniqueID ? true : false"
                            truncate />
                    </div>
                    <div class="min-w-[150px]">
                        <UButton
                            icon="i-heroicons-pencil"
                            label="Modify"
                            variant="outline"
                            type="submit"
                            :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                            :disabled="formData.uniqueID ? false : true"
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
        <PartsComponent @updateData="handleUpdateData" />
    </UDashboardModal>
</template>
