<script setup lang="ts">
import type { UTableColumn } from "~/types";

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "number",
      label: "Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "fname",
      label: "Sub Category",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "lname",
      label: "Stock#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "company1",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "homephone",
      label: "On Hand",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "workphone",
      label: "ETL Critical Component",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfCustomers: 0,
  customers: [],
  selectedCustomerId: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const filterValues = ref({
  market: null,
  source: null,
  ParadynamixCatagory: null,
  SourceConfrence: null,
  number: null,
  fname: null,
  lname: null,
  company1: null,
  homephone: null,
  workphone: null,
  state: null,
  zip: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);

const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const fetchGridData = async () => {
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/customers/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfCustomers = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfCustomers === 0) {
    gridMeta.value.customers = [];
    gridMeta.value.numberOfCustomers = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfCustomers
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfCustomers / gridMeta.value.pageSize) | 1;
  }
  await useApiFetch("/api/customers/", {
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
        gridMeta.value.customers = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};

fetchGridData();
</script>
<template>
  <UTable
    :rows="gridMeta.customers"
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
    @dblclick="onDblClick"
  >
    <template v-for="column in columns" v-slot:[`${column.key}-header`]>
      <template v-if="column.kind === 'actions'">
        <div class="px-4 py-3.5">
          <CommonSortAndInputFilter
            @handle-sorting-button="handleSortingButton"
            @handle-input-change="handleFilterInputChange"
            :label="column.label"
            :sortable="column.sortable"
            :sort-key="column.key"
            :sort-icon="
              column?.sortDirection === 'none'
                ? noneIcon
                : column?.sortDirection === 'asc'
                ? ascIcon
                : descIcon
            "
            :filterable="column.filterable"
            :filter-key="column.key"
          />
        </div>
      </template>
      <template v-else class="bg-slate-400">
        <div class="flex justify-center text-center w-[53px]">
          {{ column.label }}
        </div>
      </template>
    </template>
    <template #label-data="{ row }">
      <UTooltip text="Label" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-tag"
          @click=""
        />
      </UTooltip>
    </template>
    <template #order-data="{ row }">
      <UTooltip text="Order" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-shopping-cart"
          @click="onOrderDetail(row)"
        />
      </UTooltip>
    </template>
    <template #quote-data="{ row }">
      <UTooltip text="Quote" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-currency-dollar"
          @click="onQuoteDetail(row)"
        />
      </UTooltip>
    </template>
    <template #serviceOrder-data="{ row }">
      <UTooltip text="Service Order" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-chat-bubble-left-ellipsis"
          @click="onServiceOrderDetail(row)"
        />
      </UTooltip>
    </template>
    <template #siteVisit-data="{ row }">
      <UTooltip text="Site Visit" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-clipboard-document-list"
          @click="onSiteVisitDetail(row)"
        />
      </UTooltip>
    </template>
    <template #edit-data="{ row }">
      <UTooltip text="Edit" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          @click="onEdit(row)"
        />
      </UTooltip>
    </template>
    <template #delete-data="{ row }">
      <UTooltip text="Delete" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-trash"
          @click="onDelete(row)"
        />
      </UTooltip>
    </template>
  </UTable>
</template>
