<script lang="ts" setup>
import PartsSuppliedDetails from './PartsSuppliedDetails.vue';
const loadingOverlay = ref(false);
const rows = ref({});
const columns = ref([
    { key: 'MODEL', label: 'Stock#' },
    { key: 'DESCRIPTION', label: 'Description' },
    {
        key: 'PARTTYPE',
        label: 'Category',
        sortable: false,
        filterable: false,
    },
    {
        key: 'SUBCATEGORY',
        label: 'Sub Category',
        sortable: false,
        filterable: false,
    },
    {
        key: 'OnHand',
        label: 'On Hand',
        sortable: false,
        filterable: false,
    },
    {
        key: 'partSupplied',
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
})
const showPartsSuppliedModal = ref(false);
const suppliedPart = ref({})
const fetchSuppliedParts = async (search: string) => {
    loadingOverlay.value = true;
    if (!search) return;

    try {
        const response = await useApiFetch(`/api/materials/vendors/vendorSuppliedParts?search=${search}`, {
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

const onPartsSuppliedDetails = (e) => {
    showPartsSuppliedModal.value = true;
    suppliedPart.value = e
    // console.log('from view btn', e)
};


fetchSuppliedParts(props.modalData.NAME)
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
        padding: 'p-0'
    },
    td: {
        padding: 'py-1'
    }
}
</script>

<template>
    <UTable :rows="rows" :columns="columns" :loading="loadingOverlay" class="w-full" :ui="tableUIConfig"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
        <template #partSupplied-data="{ row }">
            <UTooltip text="Parts Supplied Details" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="onPartsSuppliedDetails(row)" />
            </UTooltip>
        </template>
    </UTable>


    <UDashboardModal v-model="showPartsSuppliedModal" title="Supplied Parts Details" :ui="modalUIConfig">
        <PartsSuppliedDetails :modal-data="suppliedPart" :is-modal="true" />
    </UDashboardModal>
</template>
