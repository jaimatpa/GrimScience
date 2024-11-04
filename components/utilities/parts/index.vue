<script setup lang="ts">
import type { UTableColumn } from "~/types";
import { ref, onMounted } from "vue";
import PartsModule from "~/pages/materials/parts.vue";

// Types
interface Label {
  stock: string;
  description: string;
  uniqueId?: number;
  workCenters?: WorkCenter[];
  partType?: string;
  subCategory?: string;
  MODEL?: string;
  DESCRIPTION?: string;
  class?: string;
}

interface WorkCenter {
  uniqueId: number;
  number: string;
}

// State Management
const selectedLabels = ref<(Label | null)[]>(Array(30).fill(null));
const startLabel = ref(0);
const numberToPrint = ref(0);
const searchStock = ref("");
const filterValues = ref({
  MODEL: null,
});

const printCoordinates = [];

// Grid Configuration
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "MODEL",
      label: "Stock #",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
    {
      key: "",
      label: "",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
  ],
  page: 1,
  pageSize: 50,
  partsList: [],
  isLoading: false,
});

const table02 = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "MODEL",
      label: "Stock #",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
    {
      key: "",
      label: "",
      sortable: false,
      sortDirection: "none",
      filterable: false,
    },
  ],
  partsList: [],
});

// Methods
const handleFilterChange = async (newValue: string | null) => {
  filterValues.value.MODEL = newValue;
  await searchParts();
};

const searchParts = async () => {
  gridMeta.value.isLoading = true;
  try {
    await useApiFetch("/api/utilities/labelParts/getData", {
      method: "GET",
      params: {
        model: filterValues.value.MODEL,
        partFlag: 1,
      },
      onResponse({ response }) {
        if (response._data) {
          console.log(response);
          gridMeta.value.partsList = response._data.body.searchData;
        }
      },
    });
  } catch (error) {
    console.error("Error fetching parts:", error);
    useToast().add({
      title: "Error",
      description: "Failed to fetch parts",
      color: "red",
    });
  } finally {
    gridMeta.value.isLoading = false;
  }
};

const selectedPartsID = ref(null);
const selectedInstanceID = ref(null);
const selectedModal = ref(null);

const onSelect = async (row) => {
  table02.value.partsList.push(row);
  selectedPartsID.value = row?.UniqueID;
  selectedInstanceID.value = row?.instanceID;
  selectedModal.value = row?.MODEL;
  selectedInstanceID.value = row?.DESCRIPTION;

  gridMeta.value.partsList.forEach((parts) => {
    parts.class = parts.UniqueID === row.UniqueID ? "bg-gms-blue-100" : "";
  });
};

const updateLabelPreview = () => {
  selectedLabels.value = Array(30).fill(null);

  let currentIndex = startLabel.value;
  table02.value.partsList.forEach((part) => {
    part.workCenters?.forEach((wc) => {
      if (currentIndex < 30) {
        selectedLabels.value[currentIndex] = {
          stock: part.MODEL,
          description: part.DESCRIPTION,
          workCenter: wc.number,
          category: `${part.partType || ""} / ${part.subCategory || ""}`,
        };
        currentIndex++;
      }
    });
  });
};

const selectLabel = (index: number) => {
  if (index < 0 || index >= 30) return;
  if (table02.value.partsList.length > 0 && index < startLabel.value) {
    useToast().add({
      title: "Warning",
      description: "Cannot select a position before existing labels",
      color: "yellow",
    });
    return;
  }

  startLabel.value = index;
  updateLabelPreview();
  updateLabelCount();
};

let clickTimeout = null;

const onRowClick = (row) => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    onSelect02(row, true);
  } else {
    clickTimeout = setTimeout(() => {
      onSelect02(row, false);
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }, 300);
  }
};

const onSelect02 = (row, isDoubleClick) => {
  const rowIndex = table02.value.partsList.findIndex(
    (part) => part.UniqueID === row.UniqueID
  );

  if (isDoubleClick) {
    if (rowIndex > -1) {
      table02.value.partsList.splice(rowIndex, 1);
    }
  } else {
    if (rowIndex === -1) {
      table02.value.partsList.push({
        ...row,
        class: "bg-gms-blue-100",
      });
    }
  }

  table02.value.partsList.forEach((parts) => {
    parts.class = parts.rowIndex === row.UniqueID ? "bg-gms-blue-100" : "";
  });
};

const updateLabelCount = () => {
  numberToPrint.value = table02.value.partsList.reduce((count, part) => {
    return count + (part.workCenters?.length || 0);
  }, 0);
};

const clearAll = () => {
  table02.value.partsList = [];
  selectedLabels.value = Array(30).fill(null);
  filterValues.value.MODEL = null;
  startLabel.value = 0;
  numberToPrint.value = 0;
};

const printLabels = async () => {
  if (table02.value.partsList.length === 0) {
    useToast().add({
      title: "Error",
      description: "You must have at least one label to print.",
      color: "red",
    });
    return;
  }

  if (numberToPrint.value > 30 - startLabel.value) {
    useToast().add({
      title: "Error",
      description: "Too many labels for remaining space.",
      color: "red",
    });
    return;
  }

  try {
    const printData = table02.value.partsList.flatMap((part, index) => {
      return (
        part.workCenters?.map((wc) => ({
          stock: part.MODEL,
          description: part.DESCRIPTION,
          workCenter: wc.number,
          category: `${part.partType || ""} / ${part.subCategory || ""}`,
          coordinates: printCoordinates[index + startLabel.value],
        })) || []
      );
    });

    await useApiFetch("/api/utilities/labelParts/print", {
      method: "POST",
      body: {
        labels: printData,
        startPosition: startLabel.value,
      },
      onResponse({ response }) {
        if (response.ok) {
          useToast().add({
            title: "Success",
            description: "Labels sent to printer",
            color: "green",
          });
        }
      },
    });
  } catch (error) {
    console.error("Error printing labels:", error);
    useToast().add({
      title: "Error",
      description: "Failed to print labels",
      color: "red",
    });
  }
};

onMounted(async () => {
  await searchParts();
});

const onPrevieOrderBtnClick = async () => {
  if (table02.value.partsList.length > 0) {
    const modelNumber = table02.value.partsList.map((item) => item.MODEL);

    console.log(modelNumber);
    try {
      await useApiFetch("/api/utilities/labelParts/pdf", {
        method: "GET",
        params: {
          modelNumber,
        },
        onResponse({ response }) {
          if (response._data) {
            const blob = new Blob([response._data], {
              type: "application/pdf",
            });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, "_blank");
            setTimeout(() => {
              URL.revokeObjectURL(fileURL);
            }, 100);
          }
        },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending data to the backend. Please try again.");
    }
  } else {
    alert("Parts list is empty!");
  }
};

const modalMeta = ref({
  isPartsModalOpen: false,
});

const handleOpen = () => {
  modalMeta.value.isPartsModalOpen = true;
};

const handleClose = () => {
  modalMeta.value.isPartsModalOpen = false;
};
</script>

<template>
  <div class="border-2 border-teal-800 flex p-0">
    <div class="grid grid-cols-3 flex-grow">
      <div class="absolute top-0">
        <p class="text-red-800 font-bold text-lg">
          PLEASE SELECT START LABEL (DOUBLE CLICK)
        </p>
        <p class="text-sm text-gray-600">
          Labels to print: {{ numberToPrint }}/{{ 30 - startLabel }}
        </p>
      </div>

      <template v-for="i in 30" :key="i">
        <div
          @dblclick="selectLabel(i - 1)"
          :class="[
            'border-2 border-teal-800 h-20 cursor-pointer',
            i - 1 === startLabel ? 'bg-gray-100' : 'bg-white',
            i - 1 < startLabel ? 'bg-gray-200' : '',
          ]"
        >
          <template v-if="selectedLabels[i - 1]">
            <div class="p-2">
              <p class="text-sm font-bold">{{ selectedLabels[i - 1].stock }}</p>
              <p class="text-xs">{{ selectedLabels[i - 1].workCenter }}</p>
              <p class="text-xs truncate">
                {{ selectedLabels[i - 1].description }}
              </p>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div class="w-[500px] border-l-2 border-teal-800">
      <!-- Search Area -->
      <div class="bg-gray-50 p-2">
        <div class="h-8 flex items-center bg-white px-2">
          <UInput
            v-model="filterValues.MODEL"
            @change="handleFilterChange"
            placeholder="Stock#"
          />
          <span class="text-sm text-green-800 pl-[30px]">
            &lt;-- Press "Return" To Search
          </span>
        </div>

        <div class="border border-gray-300 bg-white mt-1">
          <UTable
            :rows="gridMeta.partsList"
            :columns="gridMeta.defaultColumns"
            @select="onSelect"
            class="w-full"
            :ui="{
              wrapper:
                'h-[300px] overflow-auto border border-gray-400 dark:border-gray-700',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white',
                padding: 'py-0',
              },
              td: {
                base: 'h-[22px]',
                padding: 'py-0',
              },
            }"
          />
        </div>

        <div class="flex justify-end mt-2">
          <UButton
            color="gray"
            variant="outline"
            size="sm"
            class="border-gray-400"
            @click="handleOpen"
          >
            Edit
          </UButton>
        </div>
      </div>

      <!-- Print Queue -->
      <div class="bg-gray-50 p-2 mt-2">
        <div class="border border-gray-300 bg-white">
          <UTable
            :rows="table02.partsList"
            :columns="table02.defaultColumns"
            @select="onRowClick"
            class="w-full"
            :ui="{
              wrapper:
                'h-[300px] overflow-auto border border-gray-400 dark:border-gray-700',
              divide: 'divide-gray-200 dark:divide-gray-800',
              tr: {
                active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
              },
              th: {
                base: 'sticky top-0 z-10',
                color: 'bg-white',
                padding: 'py-0',
              },
              td: {
                base: 'h-[22px]',
                padding: 'py-0',
              },
            }"
          />
        </div>

        <div class="mt-1 text-center">
          <span class="text-red-800 text-sm italic">
            (Double-Click To Remove From Print Queue)
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between p-3 bg-teal-800">
        <UButton @click="clearAll" color="white" variant="solid">
          Clear
        </UButton>
        <UButton @click="onPrevieOrderBtnClick" color="white" variant="solid">
          Print
        </UButton>
      </div>
    </div>
  </div>

  <!-- Products Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    class="h-[50vh] overflow-y-auto"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center gms',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-9xl',
    }"
  >
    <PartsModule :is-page="true" />
  </UDashboardModal>
</template>
