<!-- WorkCenterInfo.vue -->
<template>
  <div class="p-6 mx-auto gap-3 flex">
    <UCard class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold">Work Centers</h2>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <UInput placeholder="Number" />
        <UInput placeholder="Name" />
        <USelect placeholder="Position Responsibility" :options="positionOptions" />
        <USelect placeholder="Account" :options="accountOptions" />
      </div>

      <div class="flex items-center space-x-4 mb-6">
        <UCheckbox v-model="timeEntryWithoutJob" label="Time Entry Without Job?" />
        <UCheckbox v-model="paid" label="Paid?" />
      </div>

      <template #footer>
        <div class="flex space-x-4">
          <UButton @click="saveData">Save</UButton>
          <UButton variant="outline" icon="i-heroicons-arrow-down-tray" @click="loadQB">Load QB</UButton>
        </div>
      </template>
    </UCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Work Centers</h2>
        </template>
        <div class="h-64 overflow-y-auto">
          <UTable :columns="columns" :rows="workCenters">
            <template #cell.check="{ row }">
              <input type="checkbox" v-model="row.checked" @change="handleCheck(row)" />
            </template>
          </UTable>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Workcenter Skills</h2>
        </template>
        <div class="bg-gray-100 p-4 rounded-lg h-64">
          <p class="text-gray-500">No skills defined</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const workCenters = ref([])
// const props = defineProps({
//   workCenters: {
//     type: Array,
//     required: true,
//   },
// })

const timeEntryWithoutJob = ref(false)
const paid = ref(false)

const positionOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
]

const accountOptions = [
  { label: 'Account 1', value: 'account1' },
  { label: 'Account 2', value: 'account2' },
]
const columns = [
  { key: "check" },
  { key: 'number', label: 'Number' },
  { key: 'name', label: 'Name' },
  { key: 'personsResponsibility', label: 'Persons Responsibility' },
]


const fetchWorkCenterDetails = async () => {
  try {
    const response = await fetch('/api/materials/vendors/workcentersDetails');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    workCenters.value = data.map(item => ({
      number: item.NUMBER,
      name: item.NAME,
      personsResponsibility: `#${item.uid} ${item.position}`
    }));
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const saveData = async () => {
  try {
    await axios.post('/api/materials/vendors/workcenters', {
      number: number.value,
      name: name.value,
      position: position.value,
      account: account.value,
      timeEntryWithoutJob: timeEntryWithoutJob.value,
      paid: paid.value
    });
    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

const loadQB = async () => {
  try {
    const response = await axios.get('/api/materials/vendors/load-qb');
    console.log('QB Data:', response.data);
  } catch (error) {
    console.error('Error loading QB data:', error);
  } onsole.log('Loading QB...')
}
fetchWorkCenterDetails()
</script>