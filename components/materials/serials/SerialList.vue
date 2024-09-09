<script lang="ts" setup>
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "select"]);

onMounted(() => {
    init();
});

useSeoMeta({
    title: "Grimm-Serials",
});

const props = defineProps({
    isPage: {
        type: [Boolean, null],
    },
});

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const headerFilters = ref({
    productLines: {
        label: "Product Line",
        filter: "productLine",
        api: "/api/materials/productlines",
        options: [],
    },

    usstates: {
        label: "State",
        filter: "state",
        api: "/api/common/usstates",
        options: [],
    },
});
const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "Serial",
            label: "Serial",
            sortable: false,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "MODEL",
            label: "Model #",
            sortable: false,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "Status",
            label: "Status",
            sortable: false,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "CustomerDetails",
            label: "Customer",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "CustomerNumber",
            label: "Cust #",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "invoicenumber",
            label: "Invoice #",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "shipdate",
            label: "Shipped",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "JID",
            label: "Job #",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "edit",
            label: "Edit",
            kind: "actions",
        },
        {
            key: "delete",
            label: "Delete",
            kind: "actions",
        },
    ],
    page: 1,
    pageSize: 50,
    numberOfSerials: 0,
    serials: [],
    selectedSerialId: null,
    selectSerial: null,
    sort: {
        column: "uid",
        direction: "asc",
    },
    isLoading: false,
});
const modalMeta = ref({
    isSerialModalOpen: false,
    isCustomerModalOpen: false,
    // isQuoteDetailModalOpen: false,
    // isServiceOrderDetailModalOpen: false,
    // isSiteVisitModalOpen: false,
    modalTitle: "New Serial",
});
const filterValues = ref({
    Serial: null,
    Status: null,
    MODEL: null, // From tblBP.MODEL
    productLine: null, // From tblBP.PRODUCTLINE
    // Customer: null,
    number: null, // From tblCustomer.number
    state: null, // From tblCustomer.state
});
const selectedColumns = ref(gridMeta.value.defaultColumns);
const exportIsLoading = ref(false);

const columns = computed(() => gridMeta.value.defaultColumns.filter((column) => selectedColumns.value.includes(column)));
Object.entries(route.query).forEach(([key, value]) => {
    switch (key.toLowerCase()) {
        case "page":
            gridMeta.value.page = Number(value);
            break;
        case "pagesize":
            gridMeta.value.pageSize = Number(value);
            break;
        case "sortby":
            gridMeta.value.sort.column = value as unknown as string;
            break;
        case "sortorder":
            gridMeta.value.sort.direction = value as unknown as string;
            break;
    }
});

const init = async () => {
    fetchGridData();
    for (const key in headerFilters.value) {
        const apiURL = headerFilters.value[key]?.api ?? `/api/materials/serials/${key}`;
        await useApiFetch(apiURL, {
            method: "GET",
            onResponse({ response }) {
                if (response.status === 200) {
                    headerFilters.value[key].options = [null, ...response._data.body];
                }
            },
        });
    }
};
const fetchGridData = async () => {
    gridMeta.value.isLoading = true;
    await useApiFetch("/api/materials/serials/numbers", {
        method: "GET",
        params: {
            ...filterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                gridMeta.value.numberOfSerials = response._data.body;
            }
        },
    });
    if (gridMeta.value.numberOfSerials === 0) {
        gridMeta.value.serials = [];
        gridMeta.value.numberOfSerials = 0;
        gridMeta.value.isLoading = false;
        return;
    }
    if (gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfSerials) {
        gridMeta.value.page = Math.ceil(gridMeta.value.numberOfSerials / gridMeta.value.pageSize) | 1;
    }
    await useApiFetch("/api/materials/serials/", {
        method: "GET",
        params: {
            page: gridMeta.value.page,
            pageSize: gridMeta.value.pageSize,
            sortBy: gridMeta.value.sort.column,
            sortOrder: gridMeta.value.sort.direction,
            ...filterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                // gridMeta.value.serials = response._data.body;

                gridMeta.value.serials = response._data.body.map((serial) => {
                    // Create the customerDetails property
                    const customerDetails = `${serial.lname || ""} ${serial.fname || ""}, ${serial.company1 || ""}`;
                    const customerNumber = serial.number;

                    // Return a new object with all existing properties plus the new customerDetails property
                    return {
                        ...serial,
                        CustomerDetails: customerDetails.trim(),
                        CustomerNumber: customerNumber,
                    };
                });
            }
            gridMeta.value.isLoading = false;
        },
    });
};
const onCreate = () => {
    gridMeta.value.selectedSerialId = null;
    modalMeta.value.modalTitle = "New Serial";
    modalMeta.value.isSerialModalOpen = true;
};
const onEdit = (row) => {
    gridMeta.value.selectedSerialId = row?.uid;
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isSerialModalOpen = true;
};
const onDelete = async (row: any) => {
    await useApiFetch(`/api/materials/serials/${row?.uid}`, {
        method: "DELETE",
        onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: response._data.message,
                    icon: "i-heroicons-trash-solid",
                    color: "green",
                });
                fetchGridData();
            }
        },
    });
};
const handleModalClose = () => {
    modalMeta.value.isSerialModalOpen = false;
};
const handleModalSave = async () => {
    handleModalClose();
    fetchGridData();
};
const handlePageChange = async () => {
    fetchGridData();
};
const handleFilterChange = () => {
    gridMeta.value.page = 1;
    fetchGridData();
};
const handleSortingButton = async (btnName: string) => {
    gridMeta.value.page = 1;
    for (const column of columns.value) {
        if (column.sortable) {
            if (column.key === btnName) {
                switch (column.sortDirection) {
                    case "none":
                        column.sortDirection = "asc";
                        gridMeta.value.sort.column = btnName;
                        gridMeta.value.sort.direction = "asc";
                        break;
                    case "asc":
                        column.sortDirection = "desc";
                        gridMeta.value.sort.column = btnName;
                        gridMeta.value.sort.direction = "desc";
                        break;
                    default:
                        column.sortDirection = "none";
                        gridMeta.value.sort.column = "uid";
                        gridMeta.value.sort.direction = "asc";
                        break;
                }
            } else {
                column.sortDirection = "none";
            }
        }
    }
    fetchGridData();
};
const handleFilterInputChange = async (event, name) => {
    gridMeta.value.page = 1;
    if (filterValues.value.hasOwnProperty(name)) {
        filterValues.value[name] = event;
    } else {
        console.error(`Filter does not have property: ${name}`);
    }
    fetchGridData();
};
const excelExport = async () => {
    exportIsLoading.value = true;
    const params = {
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value,
    };
    const paramsString = Object.entries(params)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => {
            if (value !== null) return `${key}=${value}`;
        })
        .join("&");
    location.href = `/api/materials/serials/exportlist?${paramsString}`;
    exportIsLoading.value = false;
};

const onSelect = async (row) => {
    gridMeta.value.selectedSerialId = row?.uid;

    gridMeta.value.serials.forEach((ser) => {
        if (ser.uid === row.uid) {
            ser.class = "bg-gray-200";
        } else {
            delete ser.class;
        }
    });
    gridMeta.value.selectSerial = row;
};

const handleSelect = () => {
    const ser = gridMeta.value.selectSerial;
    const value = `#${ser?.number} ${ser?.fname} ${ser?.lname}`;
    emit("select", value);
    emit("close");
};
const onDblClick = async () => {
    if (gridMeta.value.selectedSerialId) {
        modalMeta.value.isCustomerModalOpen = true;
        // modalMeta.value.modalTitle = "Edit";
        // modalMeta.value.isSerialModalOpen = true;
    }
};
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar v-if="props.isPage" class="gmsBlueHeader" title="Serial Record Finished Goods"> </UDashboardNavbar>
            <UDashboardToolbar v-if="props.isPage">
                <template #left>
                    <div class="flex flex-row space-x-3">
                        <template v-for="[key, value] in Object.entries(headerFilters)" :key="key">
                            <template v-if="value.options.length > 1">
                                <div class="basis-1/7 max-w-[200px]">
                                    <UFormGroup :label="value.label" :name="key">
                                        <USelect v-model="filterValues[`${value.filter}`]" :options="value.options" @change="handleFilterChange()" />
                                    </UFormGroup>
                                </div>
                            </template>
                        </template>
                        <div class="basis-1/7 max-w-[200px]">
                            <UFormGroup label="Customer #" name="customerNumber">
                                <UInput v-model="filterValues.number" @update:model-value="handleFilterChange()" />
                            </UFormGroup>
                        </div>
                        <div class="basis-1/7 max-w-[200px]">
                            <UFormGroup label="Quantity Of Records To View" name="Quantity">
                                <UInput v-model="gridMeta.pageSize" @update:model-value="handleFilterChange()" />
                            </UFormGroup>
                        </div>
                    </div>
                </template>
                <template #right>
                    <UButton
                        color="green"
                        variant="outline"
                        :loading="exportIsLoading"
                        label="Export to Excel"
                        trailing-icon="i-heroicons-document-text"
                        @click="excelExport">
                    </UButton>
                    <UButton color="green" variant="outline" label="New serial" trailing-icon="i-heroicons-plus" @click="onCreate()" />
                </template>
            </UDashboardToolbar>

            <UTable
                :rows="gridMeta.serials"
                :columns="columns"
                :loading="gridMeta.isLoading"
                class="w-full"
                :ui="{
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
                @select="onSelect"
                @dblclick="onDblClick">
                <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                        <div class="px-4 py-3.5">
                            <CommonSortAndInputFilter
                                @handle-sorting-button="handleSortingButton"
                                @handle-input-change="handleFilterInputChange"
                                :label="column.label"
                                :sortable="column.sortable"
                                :sort-key="column.key"
                                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                                :filterable="column.filterable"
                                :filter-key="column.key" />
                        </div>
                    </template>
                    <template v-else class="bg-slate-400">
                        <div class="flex justify-center text-center w-[53px]">
                            {{ column.label }}
                        </div>
                    </template>
                </template>
                <template #edit-data="{ row }">
                    <UTooltip text="Edit" class="flex justify-center">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onEdit(row)" />
                    </UTooltip>
                </template>
                <template #delete-data="{ row }">
                    <UTooltip text="Delete" class="flex justify-center">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onDelete(row)" />
                    </UTooltip>
                </template>
            </UTable>

            <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
                <div v-if="props.isPage" class="flex flex-row justify-end mr-20 mt-1">
                    <UPagination
                        :max="7"
                        :page-count="gridMeta.pageSize"
                        :total="gridMeta.numberOfSerials | 0"
                        v-model="gridMeta.page"
                        @update:model-value="handlePageChange()" />
                </div>

                <div v-if="!props.isPage">
                    <div class="mt-3 w-[120px]">
                        <UButton
                            icon="i-heroicons-cursor-arrow-ripple"
                            variant="outline"
                            color="green"
                            label="Select"
                            :ui="{
                                base: 'w-full',
                                truncate: 'flex justify-center w-full',
                            }"
                            truncate
                            @click="handleSelect">
                        </UButton>
                    </div>
                </div>
            </div>
        </UDashboardPanel>
    </UDashboardPage>
    <!-- New Serial Detail Modal -->
    <UDashboardModal
        v-model="modalMeta.isSerialModalOpen"
        :title="modalMeta.modalTitle"
        :ui="{
            title: 'text-lg',
            header: {
                base: 'flex flex-row min-h-[0] items-center',
                padding: 'pt-5 sm:px-9',
            },
            body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
            width: 'w-[1000px] sm:max-w-7xl',
        }">
        <MaterialsSerialsForm @close="handleModalClose" @save="handleModalSave" :selected-serial="gridMeta.selectedSerialId" :is-modal="true" />
    </UDashboardModal>

    <!-- Customer Detail Modal -->
    <UDashboardModal
        v-model="modalMeta.isCustomerModalOpen"
        title="Customer Detail"
        :ui="{
            title: 'text-lg',
            header: {
                base: 'flex flex-row min-h-[0] items-center',
                padding: 'pt-5 sm:px-9',
            },
            body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
            width: 'w-[1000px] sm:max-w-7xl',
        }">
        <CustomersForm @close="" @save="fetchGridData" :selected-customer="parseInt(gridMeta.selectSerial?.Customer)" :is-modal="true" />
    </UDashboardModal>
</template>
<style scoped></style>
