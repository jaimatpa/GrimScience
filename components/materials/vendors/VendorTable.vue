<script lang="ts" setup>
import type { UTableColumn } from '~/types';

defineProps({
    columns: Array as PropType<UTableColumn[]>,
    rows: Array,
    isLoading: Boolean,
    onPageChange: Function,
    onSelect: Function,
    onDblClick: Function,
    onHandleSortingButton: Function,
    onHandleFilterInputChange: Function,
    onCreatePurchaseOrder: Function,
    onViewOrderDetails: Function,
    onVendorDetailsEdit: Function,
    onPartsSuppliedDetails: Function,
    onPrintLabel:Function,
    gridMeta: Object,
    ascIcon: String,
    descIcon: String,
    noneIcon: String,
});

const emit = defineEmits(['pageChange', 'sortingButton', 'filterInputChange', 'dblClick']);

const handlePageChange = () => {
    emit('pageChange');
};

const handleSortingButton = (btnName: string) => {
    emit('sortingButton', btnName);
};

const handleFilterInputChange = (event: Event, name: string) => {
    emit('filterInputChange', event, name);
};
const handleDblClick = (row: any) => {
    console.log("Double-click in VendorTable:", row);
    emit('dblClick', row);
};
</script>


<template>
    <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Vendors Lookup</h2>
    </div>


    <UTable :rows="rows" :columns="columns" :loading="isLoading" class="w-full" :ui="{
        divide: 'divide-gray-200 dark:divide-gray-800',
        th: {
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'p-0'
        },
        td: {
            padding: 'py-1'
        }
    }" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" @select="onSelect"
        @dblclick="onDblClick">
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
            <template v-if="column.kind !== 'actions'">
                <div class="px-4 py-3.5">
                    <CommonSortAndInputFilter @handle-sorting-button="handleSortingButton"
                        @handle-input-change="handleFilterInputChange" :label="column.label" :sortable="column.sortable"
                        :sort-key="column.key"
                        :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                        :filterable="column.filterable" :filter-key="column.key" />
                </div>
            </template>
            <template v-else class='bg-slate-400'>
                <div class="flex justify-center text-center w-[53px]">
                    {{ column.label }}
                </div>
            </template>
        </template>
        <template #label-data="{ row }">
            <UTooltip text="Label" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-tag" @click="onPrintLabel(row)" />
            </UTooltip>
        </template>
        <template #createOrder-data="{ row }">
            <UTooltip text="Create Purchase Order" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-plus" @click="onCreatePurchaseOrder(row)" />
            </UTooltip>
        </template>
        <template #viewOrder-data="{ row }">
            <UTooltip text="View Order Details" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="onViewOrderDetails(row)" />
            </UTooltip>
        </template>
        <template #information-data="{ row }">
            <UTooltip text="Vendor Details Edit" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square"
                    @click="onVendorDetailsEdit(row)" />
            </UTooltip>
        </template>
        <template #partSupplied-data="{ row }">
            <UTooltip text="Parts Supplied Details" class="flex justify-center">
                <UButton color="gray" variant="ghost" icon="i-heroicons-chat-bubble-left-ellipsis"
                    @click="onPartsSuppliedDetails(row)" />
            </UTooltip>
        </template>
    </UTable>

    <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
            <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfVendors | 0"
                v-model="gridMeta.page" @update:model-value="handlePageChange()" />
        </div>
    </div>
</template>
