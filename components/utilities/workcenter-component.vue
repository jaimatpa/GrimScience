<script setup>
import { ref, onMounted } from 'vue';
import { useApiFetch } from '~/composables/useApiFetch'; 
onMounted(async () => {
  await fetchGridData();
});
const workCenters = ref([]);
const selectedWorkCenter = ref(null);
const workCenterSkills = ref([]);
const qbActivities = ref([]);
const loading = ref(false);
const loadingQB = ref(false);

const formData = ref({
  number: "",
  name: "",
  position: [],
  qbActivity: null,
  timeEntryWithoutJob: false,
  paid: false,
});

const tableColumns = [
  { key: "number", label: "Number", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "employee", label: "Employee" },
  { key: "positionD", label: "PositionD" },
];

const fetchGridData = async () => { 
  try {
    const  data = await useApiFetch("/api/utilities/workcenters", {
      method: "GET",
    });

    // Check the entire data structure being returned
    console.log('Fetched Data:', data);

    if (data && data.body) {
      formData.value.position = data.body; // Assuming data.body contains the array of positions
    } else {
      console.error('No data received or wrong structure');
    }
  } catch (error) {
    console.error('Error fetching work centers:', error);
  }
};


</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-blue-800">
          Work Center Information
        </h2>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Form Section -->
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
            :options="formData.position"  
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
      <div class="grid grid-cols-5 gap-4">
        <UButton
          icon="i-heroicons-plus"
          color="green"
          @click="handleAdd"
          :loading="loading"
        >
          Add
        </UButton>

        <UButton
          icon="i-heroicons-pencil"
          color="yellow"
          @click="handleModify"
          :loading="loading"
          :disabled="!selectedWorkCenter"
        >
          Modify
        </UButton>

        <UButton
          icon="i-heroicons-arrow-path"
          color="red"
          variant="ghost"
          @click="handleClearForm"
        >
          Clear Form
        </UButton>

        <UFormGroup label="QB Activity">
          <USelect
            v-model="formData.qbActivity"
            :options="qbActivities"
            placeholder="Select QB activity"
          />
        </UFormGroup>

        <UButton
          icon="i-heroicons-arrow-down-tray"
          color="blue"
          @click="handleLoadQB"
          :loading="loadingQB"
        >
          Load QB
        </UButton>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UCard>
          <UTable
            :columns="tableColumns"
            :rows="workCenters"
            :sort="{ column: 'number', direction: 'asc' }"
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
        </UCard>

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
  </UCard>
</template>





<!-- 
<script setup>

onMounted(async () => {
   await fetchGridData();
   init();
});
 

 const init = async () => {
    fetchGridData() 
 }

const workCenters = ref([]);
const selectedWorkCenter = ref(null);
const workCenterSkills = ref([]);
const workCenterEmployees = ref([]);
const qbActivities = ref([]);
const loading = ref(false);
const loadingQB = ref(false);


const formData = ref({
  number: "",
  name: "",
  position:[],
  qbActivity: null,
  timeEntryWithoutJob: false,
  paid: false,
});

const tableColumns = [
  { key: "number", label: "Number", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "employee", label: "Employee" },
  { key: "positionD", label: "PositionD" },
];






const fetchGridData = async () => { 
  try {
    const data  = await useApiFetch("/api/utilities/workcenters", {
      method: "GET",
    });

    // Check the entire data structure being returned
    console.log('Fetched Data:', data);

    if (data && data.body) {
      formData.value.position = data.body; 
    } else {
      console.error('No data received or wrong structure');
    }
  } catch (error) {
    console.error('Error fetching work centers:', error);
  }
};














</script>





<template>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-blue-800">
            Work Center Information
          </h2>
          <div class="flex gap-2"></div>
        </div>
      </template>
  
      <div class="space-y-6">
    
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
              :options="position"
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
  
      
        <div class="grid grid-cols-5 gap-4 ">
          <UButton
            icon="i-heroicons-plus"
            color="green"
            @click="handleAdd"
            :loading="loading"
          >
            Add
          </UButton>
  
          <UButton
            icon="i-heroicons-pencil"
            color="yellow"
            @click="handleModify"
            :loading="loading"
            :disabled="!selectedWorkCenter"
          >
            Modify
          </UButton>
  
          <UButton
            icon="i-heroicons-arrow-path"
            color="bg-green"
            variant="ghost"
            @click="handleClearForm"
          >
            Clear Form
          </UButton>
  
          <UFormGroup label="QB Activity">
            <USelect
              v-model="formData.qbActivity"
              :options="qbActivities"
              placeholder="Select QB activity"
            />
          </UFormGroup>
  
          <UButton
            icon="i-heroicons-arrow-down-tray"
            color="blue"
            @click="handleLoadQB"
            :loading="loadingQB"
          >
            Load QB
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UCard>
            <UTable
              :columns="tableColumns"
              :rows="workCenters"
              :sort="{ column: 'number', direction: 'asc' }"
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
          </UCard>
  
        
          <div class="space-y-4">
        
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
    </UCard>
  </template>
  


 -->
