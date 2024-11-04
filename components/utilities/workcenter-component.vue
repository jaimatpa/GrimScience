<script setup lang="ts">
import type { UTableColumn } from "~/types";
import { ref, onMounted } from "vue";
import { useApiFetch } from "~/composables/useApiFetch";

const toast = useToast();

onMounted(async () => {
  await fetchGetPositions();
  await fetchGetWorkCenterData();
});
const qbActivities = ref([]);
const loading = ref(false);
const loadingModify = ref(false);

const formData = ref({
  number: "",
  name: "",
  position: "",
  positionResponsibility: [],
  personResponsibility: [],
  qbActivity: null,
  timeEntryWithoutJob: false,
  paid: false,
  workCenters: [],
  uniqueID: null,
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "NUMBER",
      label: "Number",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "NAME",
      sortable: true,
      label: "Name",
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "Employee",
      label: "Personal Responsibility",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "position",
      label: "Position Responsibility",
      sortable: true,
      sortDirection: "none",
      filterable: true,
      filterOptions: [],
    },
  ],
  page: 1,
  pageSize: 10,
  numberOfChangeOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedCustomerId: null,
  selectedCompaintNumber: null,
  selectedSerialNumber: null,
  sort: {
    column: "MANO",
    direction: "desc",
  },
  isLoading: false,
});

const handleSubmit = async () => {
  const insetData = {
    name: formData.value.name,
    number: formData.value.number,
    position: formData.value.position,
    TimeEntryWithoutJob: formData.value.timeEntryWithoutJob,
    Paid: formData.value.paid,
  };
  try {
    loading.value = true;
    const response = await useApiFetch(
      "/api/utilities/workcenters/insertData",
      {
        method: "POST",
        body: insetData,
      }
    );

    if (response.status === 200) {
      await fetchGetWorkCenterData();
      toast.add({
        title: "Success",
        description: response.message,
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
    loading.value = false;
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
const selectedColumns = ref(gridMeta.value.defaultColumns);

const fetchGetPositions = async () => {
  try {
    const data = await useApiFetch("/api/utilities/workcenters/getAlldata", {
      method: "GET",
    });
    if (data && data.body) {
      console.log("Fetched work centers Data:", data);
      const dataList = data.body;

      formData.value.positionResponsibility = dataList.map(
        (item) => item.label
      );
    } else {
      console.error("No data received or wrong structure");
    }
  } catch (error) {
    console.error("Error fetching work centers:", error);
  }
};

const fetchGetWorkCenterData = async () => {
  try {
    const data = await useApiFetch("/api/utilities/workcenters/getTableData", {
      method: "GET",
    });
    if (data && data.body) {
      gridMeta.value.orders = data.body;
    } else {
      console.error("No data received or wrong structure");
    }
  } catch (error) {
    console.error("Error fetching work centers:", error);
  }
};

const handleWorkCenterSelect = (row) => {
  formData.value = {
    ...formData.value,
    name: row.NAME,
    number: row.NUMBER,
    position: row.position,
    timeEntryWithoutJob: row.TimeEntryWithoutJob,
    paid: row.Paid,
    uniqueID: row.uniqueID,
  };
  console.log("Selected row with ID:", row.uniqueID);
};

const handleClearForm = async () => {
  formData.value = {
    number: "",
    name: "",
    position: "",
    timeEntryWithoutJob: false,
    paid: false,
    uniqueID: null,
  };
  await fetchGetPositions();
};

const handleModify = async () => {
  if (!formData.value.uniqueID) {
    console.error("No row selected for modification");
    return;
  }
  const updateData = {
    uniqueID: formData.value.uniqueID,
    name: formData.value.name,
    number: formData.value.number,
    position: formData.value.position,
    timeEntryWithoutJob: formData.value.timeEntryWithoutJob,
    paid: formData.value.paid,
  };
  try {
    loadingModify.value = true;

    const response = await useApiFetch(
      "/api/utilities/workcenters/updateTable",
      {
        method: "PUT",
        body: updateData,
      }
    );
    if (response.status === 200) {
      await fetchGetWorkCenterData();

      toast.add({
        title: "Success",
        description: response.message,
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
  } catch (error) {
    console.error("Error updating work center:", error);
  } finally {
    loadingModify.value = false;
  }
};
</script>
<template>
  <div>
    <div class="gmsRedHeader py-[10px]">
      <h2 class="text-xl font-semibold text-white pl-[10px]">
        Work Center Information
      </h2>
    </div>

    <div class="space-y-6 p-4">
      <div class="grid grid-cols-3 gap-4">
        <UFormGroup label="Number">
          <UInput v-model="formData.number" placeholder="number" />
        </UFormGroup>
        <UFormGroup label="Name">
          <UInput v-model="formData.name" placeholder="Input Name" />
        </UFormGroup>
        <UFormGroup label="Position Responsibility">
          <USelect
            v-model="formData.position"
            :options="formData.positionResponsibility"
            placeholder="Select position"
          />
        </UFormGroup>
      </div>

      <div class="flex gap-4 mb-4">
        <UCheckbox
          v-model="formData.timeEntryWithoutJob"
          label="Time Entry Without Job?"
        />
        <UCheckbox v-model="formData.paid" label="Paid?" />
      </div>

      <div class="flex flex-row space-x-2">
        <div class="basis-1/2 space-x-5">
          <UButton
            icon="i-heroicons-plus"
            label="Add"
            variant="outline"
            color="green"
            truncate
            @click="handleSubmit"
            :loading="loading"
          />

          <UButton
            variant="outline"
            truncate
            icon="i-heroicons-pencil-square"
            color="primary"
            label="Modify"
            @click="handleModify"
            :loading="loadingModify"
          />

          <UButton
            variant="outline"
            truncate
            icon="i-heroicons-arrow-path"
            label="Clear Form"
            @click="handleClearForm"
            color="red"
          />
        </div>
        <div class="">
          <UFormGroup label="Account" class="mt-[-25px]">
            <div class="flex flex-row gap-4">
              <div class="max-w-[300px] min-w-[430px]">
                <USelect
                  v-model="formData.qbActivity"
                  :options="qbActivities"
                  placeholder="Select QB activity"
                />
              </div>
              <UButton
                variant="outline"
                truncate
                icon="i-heroicons-pencil-square"
                color="primary"
                label="Load QB"
              />
            </div>
          </UFormGroup>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UTable
          :rows="gridMeta.orders"
          :columns="gridMeta.defaultColumns"
          :loading="gridMeta.isLoading"
          class="w-full"
          :ui="{
            wrapper:
              'overflow-auto h-[600px] border-2 border-gray-300 dark:border-gray-700',
            divide: 'divide-gray-200 dark:divide-gray-800',
            tr: {
              active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
            },
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:text-gray dark:bg-[#111827]',
              padding: 'p-0 py-3',
            },
            td: {
              base: 'h-[31px]',
              padding: 'py-0',
            },
          }"
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'No items.',
          }"
          @select="handleWorkCenterSelect"
        >
        </UTable>

        <div class="space-y-4">
          <div class="h-[590px] bg-white">
            <h3 class="text-sm p-[10px]">Workcenter Skills</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref, onMounted } from "vue";
import { useApiFetch } from "~/composables/useApiFetch";
const toast = useToast();

onMounted(async () => {
  // await fetchGridData();
  await fetchGetPositions();
  await fetchGetWorkCenterData();
});
const workCenters = ref([]);
const selectedWorkCenter = ref(null);
const workCenterSkills = ref([]);
const qbActivities = ref([]);
const loading = ref(false);
const loadingModify = ref(false);

const formData = ref({
  number: "",
  name: "",
  position: "",
  positionResponsibility: [],
  personResponsibility: [],
  qbActivity: null,
  timeEntryWithoutJob: false,
  paid: false,
  workCenters: [],
  uniqueID: null,
});

const handleSubmit = async () => {
  const insetData = {
    name: formData.value.name,
    number: formData.value.number,
    position: formData.value.position,
    TimeEntryWithoutJob: formData.value.timeEntryWithoutJob,
    Paid: formData.value.paid,
  };
  try {
    loading.value = true;
    const response = await useApiFetch(
      "/api/utilities/workcenters/insertData",
      {
        method: "POST",
        body: insetData,
      }
    );

    if (response.status === 200) {
      await fetchGetWorkCenterData();
      toast.add({
        title: "Success",
        description: response.message,
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
    loading.value = false;
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

const tableColumns = [
  { key: "number", label: "Number", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "employee", label: "Person Responsibility" },
  { key: "position", label: "Position Responsibility" },
];

const fetchGetPositions = async () => {
  try {
    const data = await useApiFetch("/api/utilities/workcenters/getAlldata", {
      method: "GET",
    });
    if (data && data.body) {
      const dataList = data.body;
      formData.value.positionResponsibility = dataList.map(
        (item) => item.label
      );
      formData.value.personResponsibility = dataList.map(
        (item) => item.employee
      );
    } else {
      console.error("No data received or wrong structure");
    }
  } catch (error) {
    console.error("Error fetching work centers:", error);
  }
};

const fetchGetWorkCenterData = async () => {
  try {
    const data = await useApiFetch("/api/utilities/workcenters/getTableData", {
      method: "GET",
    });
    console.log("Fetched work centers Data:", data);
    if (data && data.body) {
      workCenters.value = data.body;
    } else {
      console.error("No data received or wrong structure");
    }
  } catch (error) {
    console.error("Error fetching work centers:", error);
  }
};

const handleWorkCenterSelect = (row) => {
  formData.value = {
    ...formData.value,
    name: row.NAME,
    number: row.NUMBER,
    position: row.position,
    timeEntryWithoutJob: row.TimeEntryWithoutJob,
    paid: row.Paid,
    uniqueID: row.uniqueID,
  };
  console.log("Selected row with ID:", row.uniqueID);
};

const handleClearForm = async () => {
  formData.value = {
    number: "",
    name: "",
    position: "",
    // positionResponsibility: [],
    // personResponsibility: [],
    // qbActivity: null,
    timeEntryWithoutJob: false,
    paid: false,
    uniqueID: null,
  };
  await fetchGetPositions();
};

const handleModify = async () => {
  if (!formData.value.uniqueID) {
    console.error("No row selected for modification");
    return;
  }
  const updateData = {
    uniqueID: formData.value.uniqueID,
    name: formData.value.name,
    number: formData.value.number,
    position: formData.value.position,
    timeEntryWithoutJob: formData.value.timeEntryWithoutJob,
    paid: formData.value.paid,
  };
  try {
    loadingModify.value = true;

    const response = await useApiFetch(
      "/api/utilities/workcenters/updateTable",
      {
        method: "PUT",
        body: updateData,
      }
    );
    if (response.status === 200) {
      await fetchGetWorkCenterData();
      toast.add({
        title: "Success",
        description: response.message,
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
  } catch (error) {
    console.error("Error updating work center:", error);
  } finally {
    loadingModify.value = false;
  }
};
</script>
<template>
  <div>
    <div class="flex justify-between items-center py-[0px] px-[10px]">
      <h2 class="text-sm">Workcenters</h2>
    </div>

    <div class="gmsRedHeader py-[10px]">
      <h2 class="text-xl font-semibold text-white pl-[10px]">
        Work Center Information
      </h2>
    </div>

    <div class="space-y-6 p-4">
      <div class="grid grid-cols-3 gap-4">
        <UFormGroup label="Number">
          <UInput v-model="formData.number" placeholder="number" />
        </UFormGroup>
        <UFormGroup label="Name">
          <UInput v-model="formData.name" placeholder="Input Name" />
        </UFormGroup>

        <UFormGroup label="Position Responsibility">
          <USelect
            v-model="formData.position"
            :options="formData.positionResponsibility"
            placeholder="Select position"
          />
        </UFormGroup>
      </div>

      <div class="flex gap-4 mb-4">
        <UCheckbox
          v-model="formData.timeEntryWithoutJob"
          label="Time Entry Without Job?"
        />
        <UCheckbox v-model="formData.paid" label="Paid?" />
      </div>

 
      <div class="grid grid-cols-2 gap-4">
        <div class="">
          <UButton
            icon="i-heroicons-plus"
            label="Add"
            variant="outline"
            color="green"
            truncate
            @click="handleSubmit"
            :loading="loading"
          />

          <UButton
            variant="outline"
            truncate
            icon="i-heroicons-pencil-square"
            color="primary"
            label="Modify"
            @click="handleModify"
            :loading="loadingModify"
          />

          <UButton
            variant="outline"
            truncate
            icon="i-heroicons-arrow-path"
            label="Clear Form"
            @click="handleClearForm"
            color="red"
          />
        </div>
        <div>
          <UFormGroup label="Account" class="mt-[-25px]">
            <div class="grid grid-cols-2 gap-4">
              <USelect
                v-model="formData.qbActivity"
                :options="qbActivities"
                placeholder="Select QB activity"
              />

              <UButton
                variant="outline"
                :ui="{
                  base: 'min-w-[100px] w-full py-[10px]',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
                icon="i-heroicons-pencil-square"
                color="primary"
                label="Load QB"
              />
            </div>
          </UFormGroup>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">

        
        <UTable
          class="h-[580px]"
          :columns="tableColumns"
          :rows="workCenters"
          @select="handleWorkCenterSelect"
          :ui="{
            td: {
              padding: 'py-[5px]',
            },
          }"
        >
          <template #number-data="{ row }">
            {{ row.NUMBER }}
          </template>
          <template #name-data="{ row }">
            {{ row.NAME }}
          </template>
          <template #employee-data="{ row }">
            {{ row.Employee }}
          </template>
          <template #position-data="{ row }">
            {{ row.position }}
          </template>
        </UTable>

       >
        <div class="space-y-4">
        
          <div class="h-[590px] bg-white">
            <h3 class="text-sm p-[10px]">Workcenter Skills</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->
