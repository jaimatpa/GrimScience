<script lang="ts" setup>
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "select"]);

onMounted(() => {
    init();
});

useSeoMeta({
    title: "Grimm-Approvals",
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

let hasApprovePermission = ref(false);
let readonlyPermission = ref(false);
let permissionMessage = ref("");

let selectedJobId = ref(null);
let selectedJobInstanceId = ref(null);

const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "model",
            label: "Model",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "number",
            label: "Number",
            sortable: true,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "operation",
            label: "Operation",
            sortable: true,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "preparedBy",
            label: "Prepared By",
            sortable: true,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "preparedDate",
            label: "Prepared Date",
            sortable: true,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "approvedDate",
            label: "Approval Date",
            sortable: true,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "approve",
            label: "Approve",
            kind: "actions",
        },

    ],
    page: 1,
    pageSize: 50,
    numberOfApprovals: 0,
    approvals: [],
    selectedApprovalId: null,
    selectedApproval: null,
    sort: {
        column: "model",
        direction: "asc",
    },
    isLoading: false,
});
const modalMeta = ref({
    isManufacturingSequenceModalOpen: false,
});
const filterValues = ref({
    model: null,
});
const selectedColumns = ref(gridMeta.value.defaultColumns);

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
    await checkPermission();

    if (hasApprovePermission.value) {
        console.log("fetching data");

        fetchGridData();
    }
    // fetchGridData();
};
const fetchGridData = async () => {

    gridMeta.value.isLoading = true;
    await useApiFetch("/api/engineering/approvals/numbers", {
        method: "GET",
        params: {
            ...filterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                gridMeta.value.numberOfApprovals = response._data.body;
            }
        },
    });
    if (gridMeta.value.numberOfApprovals === 0) {
        gridMeta.value.approvals = [];
        gridMeta.value.numberOfApprovals = 0;
        gridMeta.value.isLoading = false;
        return;
    }
    if (gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfApprovals) {
        gridMeta.value.page = Math.ceil(gridMeta.value.numberOfApprovals / gridMeta.value.pageSize) | 1;
    }
    await useApiFetch("/api/engineering/approvals/", {
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
                gridMeta.value.approvals = response._data.body;
            }
            gridMeta.value.isLoading = false;
        },
    });
};

const checkPermission = async () => {
    await useApiFetch("/api/engineering/approvals/permissions", {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                hasApprovePermission.value = response._data.body.enabled;
                readonlyPermission.value = response._data.body.readOnly;
                permissionMessage.value = response._data.body.message;
            }
        },
    });
};

const onApprove = async (row) => {
    await useApiFetch("/api/engineering/approvals/", {
        method: "PUT",
        params: {
            uniqueID: row?.uniqueID,
        },
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


const handlePageChange = async () => {
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
                        gridMeta.value.sort.column = "uniqueID";
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

const onSelect = async (row) => {
    gridMeta.value.selectedApprovalId = row?.uniqueID;
    gridMeta.value.selectedApproval = row;

    gridMeta.value.approvals.forEach((aprv) => {
        if (aprv.uniqueID === row.uniqueID) {
            aprv.class = "bg-gray-200";
        } else {
            delete aprv.class;
        }
    });
    gridMeta.value.selectedApproval = row;
};

const handleSelect = () => {
    const cus = gridMeta.value.selectedApproval;
    const value = `#${cus?.number} ${cus?.fname} ${cus?.lname}`;
    emit("select", value);
    emit("close");
};
const onDblClick = async () => {
    if (gridMeta.value.selectedApprovalId) {
        console.log("onDblClick", gridMeta.value.selectedApproval)
        selectedJobId.value = gridMeta.value.selectedApproval?.jobId;
        selectedJobInstanceId.value = gridMeta.value.selectedApproval?.instanceID
        modalMeta.value.isManufacturingSequenceModalOpen = true;
    }
};
</script>

<template>
    <div v-if="!hasApprovePermission">
        <div class="w-full flex items-center text-center justify-center">{{ permissionMessage }}</div>
    </div>

    <div v-else>
        <UDashboardPage class=" max-h-screen">
            <UDashboardPanel grow>
                <UDashboardNavbar v-if="props.isPage" class="gmsBlueHeader" title="Entries Approvals">
                </UDashboardNavbar>
                <div v-if="props.isPage" class="px-4 py-2 gmsBlueTitlebar">
                    <h2>To Be Approved</h2>
                </div>

                <UTable :rows="gridMeta.approvals" :columns="columns" :loading="gridMeta.isLoading" class="w-full" :ui="{
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-0',
                    },
                    td: {
                        padding: 'py-1',
                    },
                }" :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                }" @select="onSelect" @dblclick="onDblClick">
                    <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                        <template v-if="column.kind !== 'actions'">
                            <div class="px-4 py-3.5">
                                <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                                    @handle-input-change="handleFilterInputChange" :label="column.label"
                                    :sortable="column.sortable" :sort-key="column.key"
                                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                                    :filterable="column.filterable" :filter-key="column.key" />
                            </div>
                        </template>
                        <template v-else class="bg-slate-400">
                            <div class="flex justify-center text-center w-[53px]">
                                {{ column.label }}
                            </div>
                        </template>
                    </template>
                    <template #approve-data="{ row }">
                        <UTooltip text="Approve" class="flex justify-center">
                            <UButton :disabled="readonlyPermission" color="green" variant="outline"
                                icon="i-heroicons-pencil-square" @click="onApprove(row)" />
                        </UTooltip>
                    </template>
                </UTable>

                <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
                    <div v-if="props.isPage" class="flex flex-row justify-end mr-20 mt-1">
                        <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfApprovals | 0"
                            v-model="gridMeta.page" @update:model-value="handlePageChange()" />
                    </div>

                    <div v-if="!props.isPage">
                        <div class="mt-3 w-[120px]">
                            <UButton icon="i-heroicons-cursor-arrow-ripple" variant="outline" color="green"
                                label="Select" :ui="{
                                    base: 'w-full',
                                    truncate: 'flex justify-center w-full',
                                }" truncate @click="handleSelect">
                            </UButton>
                        </div>
                    </div>
                </div>
            </UDashboardPanel>
        </UDashboardPage>
    </div>

    <!-- Manufacturing Sequnce Modal -->
    <UDashboardModal v-model="modalMeta.isManufacturingSequenceModalOpen" title="Manufacturing Sequence" description=""
        :ui="{
            width: 'w-[1800px] sm:max-w-7xl',
            body: { padding: 'py-0 sm:pt-0' },
        }">
        <JobManufacturingSequenceForm :selected-job="selectedJobId" :instance-id="selectedJobInstanceId" />
    </UDashboardModal>
</template>
<style scoped></style>
