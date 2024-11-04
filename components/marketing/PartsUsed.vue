<script setup lang="ts">
import { number } from "yup";
import type { UTableColumn } from "~/types";

const items = ref([]);
const isOpen = ref(false);
const tbBpId = ref(null);

const qty = ref(null);
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true,
  },
  operationID: {
    type: [String, Number, null],
    required: true,
  },
});

const partsTable2 = ref([{}]);
const partsTable2Columns = [
  {
    key: "Qty",
    label: "Qty",
  },
  {
    key: "model",
    label: "Part #",
  },
  {
    key: "Description",
    label: "Description",
  },
  {
    key: "inventoryCost",
    label: "Cost",
  },
  {
    key: "inventoryUnit",
    label: "Unit",
  },
];


const headerFilters = ref({
  parttype: {
    filter: "parttype ",
    options: [],
  },
  subcategory: {
    filter: "subcategory ",
    options: [],
  },
});

const filterValues = ref({
  PARTTYPE: null,
  SUBCATEGORY: null,
  MODEL: null,
  DESCRIPTION: null,
});

onMounted(() => {
  init();
});

const columns = [
  {
    key: "PARTTYPE",
    label: "Category",
  },
  {
    key: "SUBCATEGORY",
    label: "Sub",
  },
  {
    key: "MODEL",
    label: "Part#",
  },
  {
    key: "DESCRIPTION",
    label: "Description",
  },
  {
    key: "UNIT",
    label: "UNIT",
  },
];

const init = async () => {
  for (const key in headerFilters.value) {
    const apiURL =
      headerFilters.value[key]?.api ?? `/api/projects/usedParts/${key}`;

    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      },
    });
    parts();
  }
};

const parts = async () => {
  await useApiFetch("/api/projects/partsHoursDetails/", {
    method: "GET",
    params: { JobId: props.selectedCustomer, OperationID: props.operationID },
    onResponse({ response }) {
      if (response.status === 200) {
        partsTable2.value = response._data.body;
      }
    },
  });
};

const fetchGridData = async () => {
  const cleanedParams = Object.fromEntries(
    Object.entries(filterValues.value).filter(([key, value]) => value !== null)
  );

  await useApiFetch("/api/projects/usedParts/", {
    method: "GET",
    params: cleanedParams,
    onResponse({ response }) {
      if (response.status === 200) {
        items.value = response._data.body;
      }
    },
  });
};

const handleFilterChange = () => {
  fetchGridData();
};

const onSelect = async (row) => {
  tbBpId.value = row.UniqueID;
};

const handleRowClick = async () => {
  isOpen.value = true;
};


// Here is a problem
const insertQty = async () => {
  await useApiFetch(
    `/api/projects/insertOperationWork?JobID=${
      props.selectedCustomer
    }&OperationID=${456}&tblBPID=${tbBpId.value}&Qty=${qty.value}`,
    {
      method: "POST",
      onResponse({ response }) {
        console.log("qty is insertd", response);
        if (response.status === 200) {
          parts();
          isOpen.value = false;
        }
      },
    }
  );
};
</script>
<template>
  <UDashboardNavbar class="gmsPurpleTitlebar" title="Parts used" />
  <div class="grid grid-cols-2 space-x-20">
    <div class="h-[500px] overflow-auto flex flex-wrap gap-4">
      <template
        v-for="[key, value] in Object.entries(headerFilters)"
        :key="key"
      >
        <template v-if="value.options.length > 1">
          <div class="basis-1/7 max-w-[110px]">
            <UFormGroup :label="value.filter" :name="key">
              <USelect
                v-model="filterValues[`${value.filter}`]"
                :options="value.options"
                @change="handleFilterChange()"
              />
            </UFormGroup>
          </div>
        </template>
      </template>
      <div class="basis-1/7 max-w-[70px]">
        <UFormGroup>
          <UInput
            class="mt-6"
            v-model="filterValues.MODEL"
            @update:model-value="handleFilterChange()"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/7 max-w-[140px]">
        <UFormGroup>
          <UInput
            class="mt-6"
            v-model="filterValues.DESCRIPTION"
            @update:model-value="handleFilterChange()"
          />
        </UFormGroup>
      </div>
      <div>
        <UTable
          :rows="items"
          :columns="columns"
          @select="onSelect"
          @dblclick="handleRowClick()"
        />
      </div>
    </div>

    <div class="h-[500px] overflow-auto">
      <UTable :columns="partsTable2Columns" :rows="partsTable2" />
    </div>
  </div>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        How Many Items Would You Like to Place on this Job
      </template>

      <input
        type="number"
        v-model="qty"
        class="border rounded p-2 w-full"
        placeholder="Enter number of items"
      />

      <template #footer>
        <div class="p-2 flex justify-end">
          <button
            @click="insertQty"
            class="bg-blue-500 text-white rounded px-4 py-2"
          >
            Submit
          </button>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
