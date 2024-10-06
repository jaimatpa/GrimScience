<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-blue-800">Work Center Information</h2>
        <div class="flex gap-2">
     
      
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Form Section -->
      <div class="grid grid-cols-3 gap-4">
        <UFormGroup label="Number">
          <UInput
            v-model="formData.number"
            placeholder="number"
          />
        </UFormGroup>
           <UFormGroup label="Name">
          <UInput
            v-model="formData.number"
            placeholder="Input Name"
          />
        </UFormGroup>
        <UFormGroup label="Position Responsibility">
          <USelect
            v-model="formData.position"
            :options="positions"
            placeholder="Select position"
          />
        </UFormGroup>
        <!-- <UFormGroup label="Name">
          <UInput
            v-model="formData.name"
            placeholder="Enter workcenter name"
          />
        </UFormGroup> -->

     

      </div>

      <div class="flex gap-4 mb-4">
        <UCheckbox
          v-model="formData.timeEntryWithoutJob"
          label="Time Entry Without Job?"
        />
        <UCheckbox
          v-model="formData.paid"
          label="Paid?"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex grid-cols-5 gap-2 w-full">
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
      <!-- Data Display Section -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Work Centers List -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium">Work Centers</h3>
          </template>
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

          <!-- Employees List -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Assigned Employees</h3>
            </template>
            <UList v-if="workCenterEmployees.length" :items="workCenterEmployees" />
            <p v-else class="text-gray-500 text-center py-4">No employees assigned</p>
          </UCard>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const workCenters = ref([])
const selectedWorkCenter = ref(null)
const workCenterSkills = ref([])
const workCenterEmployees = ref([])
const positions = ref([])
const qbActivities = ref([])
const loading = ref(false)
const loadingQB = ref(false)

const formData = ref({
  number: '',
  name: '',
  position: null,
  qbActivity: null,
  timeEntryWithoutJob: false,
  paid: false
})

const tableColumns = [
  { key: 'number', label: 'Number', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'employee', label: 'Employee' },
  { key: 'position', label: 'Position' }
]

onMounted(async () => {
  await Promise.all([
    fetchWorkCenters(),
    fetchPositions()
  ])
})

async function fetchWorkCenters() {
  try {
    workCenters.value = await useApiFetch('/api/workcenters/')
  } catch (error) {
    console.error('Error fetching work centers:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load work centers',
      color: 'red'
    })
  }
}

async function fetchPositions() {
  try {
    const response = await useApiFetch('/api/utilities/workcenters')
    
    positions.value = response.map(pos => ({
      label: pos.title,
      value: pos.title
    }))
  } catch (error) {
    console.error('Error fetching positions:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load positions',
      color: 'red'
    })
  }
}

async function handleWorkCenterSelect(workCenter) {
  selectedWorkCenter.value = workCenter
  loadWorkCenterDetails(workCenter.uniqueID)
  
  // Update form data
  formData.value = {
    number: workCenter.NUMBER,
    name: workCenter.NAME,
    position: workCenter.position,
    qbActivity: workCenter.QB_Activity,
    timeEntryWithoutJob: workCenter.TimeEntryWithoutJob,
    paid: workCenter.Paid
  }
}

async function loadWorkCenterDetails(workCenterId) {
  try {
    const [skills, employees] = await Promise.all([
      $fetch(`/api/workcenters/skills?workcenterId=${workCenterId}`),
      $fetch(`/api/workcenters/employees?workcenterId=${workCenterId}`)
    ])
    
    workCenterSkills.value = skills
    workCenterEmployees.value = employees
  } catch (error) {
    console.error('Error loading work center details:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load work center details',
      color: 'red'
    })
  }
}

async function handleAdd() {
  if (!formData.value.name || !formData.value.number) {
    useToast().add({
      title: 'Validation Error',
      description: 'Name and number are required',
      color: 'red'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/workcenters', {
      method: 'POST',
      body: formData.value
    })
    await fetchWorkCenters()
    handleClearForm()
    useToast().add({
      title: 'Success',
      description: 'Work center added successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Error adding work center:', error)
    useToast().add({
      title: 'Error',
      description: error.statusMessage || 'Failed to add work center',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

async function handleModify() {
  if (!selectedWorkCenter.value) {
    useToast().add({
      title: 'Error',
      description: 'Please select a work center to modify',
      color: 'red'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/workcenters', {
      method: 'PUT',
      body: {
        ...formData.value,
        uniqueID: selectedWorkCenter.value.uniqueID
      }
    })
    await fetchWorkCenters()
    useToast().add({
      title: 'Success',
      description: 'Work center updated successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Error updating work center:', error)
    useToast().add({
      title: 'Error',
      description: error.statusMessage || 'Failed to update work center',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

function handleClearForm() {
  formData.value = {
    number: '',
    name: '',
    position: null,
    qbActivity: null,
    timeEntryWithoutJob: false,
    paid: false
  }
  selectedWorkCenter.value = null
  workCenterSkills.value = []
  workCenterEmployees.value = []
}

async function handleLoadQB() {
  loadingQB.value = true
  try {
    qbActivities.value = await $fetch('/api/workcenters/qb-activities')
  } catch (error) {
    console.error('Error loading QB activities:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load QuickBooks activities',
      color: 'red'
    })
  } finally {
    loadingQB.value = false
  }
}
</script>