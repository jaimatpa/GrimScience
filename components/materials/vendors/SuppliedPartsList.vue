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
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};

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
