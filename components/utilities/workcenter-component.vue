<script setup>
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

// const fetchGridData = async () => {
//   try {
//     const data = await useApiFetch("/api/utilities/workcenters", {
//       method: "GET",
//     });
//     if (data && data.body) {
//       formData.value.position = data.body;
//     } else {
//       console.error("No data received or wrong structure");
//     }
//   } catch (error) {
//     console.error("Error fetching work centers:", error);
//   }
// };

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
    <div class="flex justify-between items-center bg-rose-400 py-[20px] px-[30px]">
      <h2 class="text-xl font-semibold text-white">
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

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-[25px]">
        <div>
          <div class="grid grid-cols-3 gap-[15px]">
            <UButton
              icon="i-heroicons-plus"
              label="Add"
              variant="outline"
              :ui="{
                base: 'min-w-[100px] w-full py-[10px]',
                truncate: 'flex justify-center w-full',
              }"
              truncate
              @click="handleSubmit"
              :loading="loading"
            />

            <UButton
              variant="outline"
              :ui="{
                base: 'min-w-[100px] w-full py-[10px]',
                truncate: 'flex justify-center w-full',
              }"
              truncate
              icon="i-heroicons-pencil"
              color="yellow"
              label="Modify"
              @click="handleModify"
              :loading="loadingModify"
            />

            <UButton
              variant="outline"
              :ui="{
                base: 'min-w-[100px] w-full py-[10px]',
                truncate: 'flex justify-center w-full',
              }"
              truncate
              icon="i-heroicons-arrow-path"
              label="Clear Form"
              @click="handleClearForm"
              color="red"
            />
          </div>
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
                icon="i-heroicons-pencil"
                color="blue"
                label="Load QB"
              />
            </div>
          </UFormGroup>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UTable
          class="h-[480px]"
          :columns="tableColumns"
          :rows="workCenters"
          @select="handleWorkCenterSelect"
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

        <!-- Right Side Panels -->
        <div class="space-y-4">
          <!-- Skills List -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Workcenter Skills</h3>
            </template>
            <UList v-if="workCenterSkills.length" :items="workCenterSkills" />
            <p v-else class="text-gray-500 text-center py-4">No skills found</p>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

