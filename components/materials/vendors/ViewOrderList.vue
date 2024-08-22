<template>
    <UTable :rows="rows" :columns="columns" :loading="loadingOverlay" class="w-full" :ui="tableUIConfig"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
        <template #details-data="{ row }">
            <UTooltip text="Parts Supplied Details" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="onPODetails(row)" />
            </UTooltip>
        </template>
    </UTable>

    <UDashboardModal v-model="showPODetailsModal" title="PO Details" :ui="modalUIConfig">
        <PurchaseDetails :modal-data="selectedRow"></PurchaseDetails>
    </UDashboardModal>
</template>

<script lang="ts" setup>
import PurchaseDetails from './PurchaseDetails.vue';

const loadingOverlay = ref(false);
const rows = ref({});
const selectedRow = ref({});  // Reactive variable to hold the selected row data

const columns = ref([
    {
        key: 'PONUMBER',
        label: 'PO Number',
        sortable: false,
        filterable: false,
    },
    {
        key: 'DATE',
        label: 'Date',
        sortable: false,
        filterable: false,
    },
    {
        key: 'NAME',
        label: 'Vendor',
        sortable: false,
        filterable: false,
    },
    {
        key: 'TOTAL',
        label: 'Total',
        sortable: false,
        filterable: false,
    },
    {
        key: 'details',
        label: 'Details',
        kind: 'actions',
        class: 'text-center'
    },
]);

const props = defineProps({
    modalData: Object,
    isModal: {
        type: [Boolean]
    }
});

const showPODetailsModal = ref(false);

const fetchPODetails = async (search: string) => {
    loadingOverlay.value = true;
    if (!search) return;

    try {
        const response = await useApiFetch(`/api/materials/vendors/getAllPo?vendor=${search}`, {
            method: 'GET',
        });

        if (response.body) {
            rows.value = response.body
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};

const onPODetails = (row) => {
    selectedRow.value = row;  // Set the selected row data
    showPODetailsModal.value = true;
};


const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};

const tableUIConfig = {
    divide: 'divide-gray-200 dark:divide-gray-800',
    th: {
        base: 'sticky top-0 z-10',
        color: 'bg-white dark:text-gray dark:bg-[#111827]',
        padding: 'p-2',
    },
    td: {
        padding: 'p-2',
    }
};

fetchPODetails(props.modalData?.NUMBER);
</script>
