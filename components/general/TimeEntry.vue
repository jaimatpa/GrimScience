<script setup lang="ts">
import { format, parseISO } from 'date-fns'

interface TimeEntry {
  uniqueID: number
  employeeID: number
  startTime: string
  workCenterID: number
  jobID?: number
  operationID?: number
  hours: number
  paid: boolean
  workCenter?: string
  job?: string
  operation?: string
}

const timeentriesoptions = ref(["5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"]
)
const activeTab = ref<string>("timeEntry")
const items = ref([
  { label: 'Time Entry', slot: 'timeEntry' },
  { label: 'Time Verification', slot: 'timeVerification' }
])

function handleChangeTime() {
  if (!selectedWeeklyEntry.value) return

  // Set the date from the selected weekly entry
  selectedDate.value = new Date(selectedWeeklyEntry.value.startTime)

  // Change to the time entry tab
  activeTab.value = "timeEntry"

  // Reset form if needed
  clearForm()

  // Reset scroll positions
  nextTick(() => {
    // Reset the table wrapper scroll
    const tableWrappers = document.querySelectorAll('.overflow-y-auto')
    tableWrappers.forEach(wrapper => {
      wrapper.scrollTop = 0
    })

    // Reset the main tab content scroll if needed
    const tabContent = document.querySelector('.bg-gray-100')
    if (tabContent) {
      tabContent.scrollTop = 0
    }
  })

  loadTimeEntries()
}

const selectedDate = ref(new Date())
const loadingOverlay = ref(false)
const timeEntries = ref<TimeEntry[]>([])
const workCenters = ref<Array<{ id: number, name: string }>>([])
const jobs = ref<Array<{ id: number, instanceID: any, number: string }>>([])
const operations = ref<Array<{ id: number, name: string }>>([])


const weekDates = ref([])

const loadWeekDates = () => {
  weekDates.value = []

  // Start from last week of previous year
  let currentDate = new Date(new Date().getFullYear(), 0, 1)
  currentDate.setDate(currentDate.getDate() - 7)

  // Generate dates for 365 days + 2 weeks
  for (let i = 1; i <= 365 + 14; i++) {
    if (currentDate.getDay() === 0) { // Sunday
      weekDates.value.push(formatDate(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Set selected week to the most recent past Sunday
  const today = new Date()
  let checkDate = new Date(today)
  checkDate.setDate(checkDate.getDate() - 7)

  for (let i = 0; i >= -6; i--) {
    if (checkDate.getDay() === 0) {
      const formattedCheckDate = formatDate(checkDate)
      const weekIndex = weekDates.value.findIndex(date => date === formattedCheckDate)
      if (weekIndex !== -1) {
        selectedWeek.value = weekIndex
      }
      break
    }
    checkDate.setDate(checkDate.getDate() + i)
  }
}
const formatDate = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}
function formatDateTime(date: Date, timeStr: string): string {
  // Parse the time string (assumes format like "5:00 AM" or "05:00 AM")
  const [time, period] = timeStr.split(' ')
  let [hours, minutes] = time.split(':')

  // Convert to 24-hour format if needed
  if (period?.toUpperCase() === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12)
  } else if (period?.toUpperCase() === 'AM' && hours === '12') {
    hours = '00'
  }

  // Ensure two digits
  hours = hours.padStart(2, '0')
  minutes = minutes.padStart(2, '0')

  // Create date string in SQL Server format
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${hours}:${minutes}:00.000`
}
const verificationEntry = ref({
  dateRange: {
    end: "",
    start: ""
  },
  verification: {
    VerifyBy: '',
    VerifyDate: ''
  },
  totalHours: 0,
  timeEntries: []
})

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
})

const dayOfWeek = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', {
    weekday: 'long'
  })
})

const totalHours = computed(() => {
  return timeEntries.value.reduce((sum, entry) => sum + (entry.hours || 0), 0).toFixed(1)
})

async function loadWorkCenters() {
  loadingOverlay.value = true
  try {
    await useApiFetch('/api/general/timeentries/workcenters', {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200 && response._data.body) {
          workCenters.value = response._data.body.map((wc: any) => ({
            uniqueID: wc.uniqueID,
            id: `#${wc.NUMBER} ${wc.Name}`,
            name: `#${wc.NUMBER} ${wc.Name}`
          }))
        }
      },
      onResponseError({ response }) {
        console.error('Failed to load work centers:', response._data)
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

async function loadJobs(workCenter: string) {
  if (!workCenter) {
    jobs.value = []
    return
  }

  loadingOverlay.value = true
  try {
    const date = selectedDate.value.toISOString().split('T')[0]
    await useApiFetch('/api/general/timeentries/jobs', {
      method: 'GET',
      params: {
        workCenter,
        date,
        dateClosed: ''
      },
      onResponse({ response }) {
        if (response.status === 200 && response._data.body) {
          jobs.value = response._data.body.map((job: any) => ({
            id: job.uniqueID,
            instanceID: job.instanceID,
            number: job.NUMBER
          }))
        }
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

async function loadOperations(jobNum: string) {
  if (!jobNum || !formData.value.WorkCenter) {
    operations.value = []
    return
  }

  loadingOverlay.value = true
  const instanceId = jobs.value.find(j => j.number == formData.value.Job)?.instanceID
  const jobId = jobs.value.find(j => j.number == formData.value.Job)?.id

  try {
    await useApiFetch('/api/general/timeentries/operations', {
      method: 'GET',
      params: {
        jobId,
        workCenter: formData.value.WorkCenter,
        instanceId,
        verified: false
      },
      onResponse({ response }) {
        if (response.status === 200 && response._data.body) {
          operations.value = response._data.body.map((op: any) => ({
            id: op.uniqueID,
            name: `#${op.number} ${op.Operation}`
          }))
        }
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

async function loadTimeEntries() {
  loadingOverlay.value = true
  try {
    const date = selectedDate.value.toISOString().split('T')[0]
    await useApiFetch('/api/general/timeentries', {
      method: 'GET',
      params: { date },
      onResponse({ response }) {
        if (response.status === 200 && response._data.body) {
          timeEntries.value = response._data.body.map((entry: any) => ({
            ...entry,
            StartTime: new Date(entry.StartTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'UTC'
            })
          }))
        }
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

// Event handlers
function handleDateSelect(date: Date) {
  selectedDate.value = date
  formData.value.UID = 0
  loadTimeEntries();
}

async function handleSaveEntry() {
  const formattedDateTime = formatDateTime(selectedDate.value, formData.value.StartTime)

  console.log(formattedDateTime)

  if (!formData.value.WorkCenter) {
    alert('Please select a work center')
    return
  }

  loadingOverlay.value = true
  try {
    const entry = {
      startTime: formattedDateTime,
      workCenterName: formData.value.WorkCenter,
      jobNumber: formData.value.Job,
      operationName: formData.value.Operation,
      id: formData.value.UID
    }

    await useApiFetch('/api/general/timeentries', {
      method: 'POST',
      body: entry,
      onResponse({ response }) {
        if (response.status === 200) {
          loadTimeEntries()
          clearForm()
        }
      },
      onResponseError({ response }) {
        alert('Failed to save time entry. Please try again.')
        console.error('Save error:', response._data)
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

async function handleDeleteEntry() {

  if (!confirm('Are you sure you want to delete this time entry?')) {
    return
  }
  loadingOverlay.value = true
  try {
    await useApiFetch(`/api/general/timeentries/?id=${selectedEntry.value.UID}`, {
      method: 'DELETE',
      onResponse({ response }) {
        if (response.status === 200) {
          loadTimeEntries()
        }
      },
      onResponseError({ response }) {
        alert('Failed to delete time entry. Please try again.')
        console.error('Delete error:', response._data)
      }
    })
  } finally {
    loadingOverlay.value = false
  }
}

async function handleVerify() {
  console.log("Verify button clicked");
  console.log("Selected week:", selectedWeek);

  const response = await useApiFetch('/api/general/timeentries/verify', {
    method: 'POST',
    body: {
      weekSunday: selectedWeek,
    },
    onResponse({ response }) {
      console.log("API response:", response);
    },
    onResponseError({ response }) {
      console.error('Verify error:', response._data);
    }
  });

  console.log("Response after API call:", response);
}

const verificationData = computed(() => {
  return {
    verifyBy: verificationEntry.value?.verification?.VerifyBy ?? '',
    verifyDate: verificationEntry.value?.verification?.VerifyDate ?? ''
  }
})

function clearForm() {
  formData.value = {
    UID: 0,
    EmployeeID: 0,
    StartTime: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    WorkCenter: "",
    Job: null,
    Operation: null,
    hours: 0,
  }
  timeEntries.value = []
  loadTimeEntries()
}
const selectedWeek = ref<Date | null>(null)
const selectedWeeklyEntry = ref<any>(null)
const selectedEntry = ref<any>({})
async function loadWeeklyTimeEntries(weekSunday) {
  loadingOverlay.value = true;
  try {
    await useApiFetch('/api/general/timeentries', {
      method: 'GET',
      params: {
        weekSunday,
      },
      onResponse({ response }) {
        if (response.status === 200 && response._data.body) {
          console.log(response._data.body)
          verificationEntry.value = response._data.body
        }
      }
    })

  } finally {
    loadingOverlay.value = false
  }
}
const formData = ref({
  UID: 0,
  EmployeeID: 0,
  StartTime: new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }),
  WorkCenter: "",
  Job: null,
  Operation: null,
  hours: 0,
})

// Handle weekly entry selection
function handleWeeklyEntrySelect(entry: any) {
  console.log(entry)
  selectedWeeklyEntry.value = entry
}

function handleRowSelect(selected) {
  Object.keys(formData.value).forEach(function (key) {
    formData.value[key] = selected[key]
  })
  selectedEntry.value = selected
  console.log(formData.value, selected)
  timeEntries.value.forEach(en => {
    if (en.UID === selected.UID) {
      en.class = "bg-blue-100"
    } else {
      en.class = ""
    }
  })
}
watch(() => selectedWeek.value, (newEntries) => {
  console.log(newEntries)
  loadWeeklyTimeEntries(newEntries)
})
watch(() => formData.value.WorkCenter, async (newValue) => {
  console.log(newValue)
  await loadJobs(newValue)
})

watch(() => formData.value.Job, async (newValue) => {
  console.log(newValue)
  await loadOperations(newValue)
})

// Initialize data
onMounted(() => {
  loadWorkCenters()
  loadTimeEntries()
  loadWeekDates()
})
</script>

<template>
  <div>
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
    <div class="px-4 py-2">
      <UButton color="white" :variant="activeTab === 'timeEntry' ? 'solid' : 'ghost'" @click="activeTab = 'timeEntry'">
        Time Entry
      </UButton>

      <UButton color="white" :variant="activeTab === 'timeVerification' ? 'solid' : 'ghost'"
        @click="activeTab = 'timeVerification'" class="ml-2">
        Time Verification
      </UButton>
    </div>
    <div>
      <div v-if="activeTab === 'timeEntry'">
        <div class="flex flex-col space-y-4 px-4 py-4">

          <div class="flex flex-row space-x-2 items-end">
            <div class="w-1/5">
              <UFormGroup label="Date" required>
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton :label="formattedDate" icon="i-heroicons-calendar-days-20-solid" variant="outline"
                    class="w-full justify-between" />
                  <template #panel="{ close }">
                    <CommonDatePicker :model-value="selectedDate" @update:model-value="(date) => handleDateSelect(date)"
                      @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="w-1/5 pb-2 font-bold">{{ dayOfWeek }}</div>
          </div>


          <div class="flex flex-row space-x-2">
            <div class="basis-1/4">
              <UFormGroup label="Start Time" required>
                <UInputMenu v-model="formData.StartTime" :options="timeentriesoptions" placeholder="HH:MM AM/PM" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Workcenter" required>
                <UInputMenu v-model="formData.WorkCenter" :options="workCenters.map(e => e.name)"
                  placeholder="Select Workcenter" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Job">
                <UInputMenu v-model="formData.Job" :options="jobs.map(e => e.number)" placeholder="Select Job" />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup label="Operation">
                <UInputMenu v-model="formData.Operation" :options="operations.map(e => e.name)"
                  placeholder="Select Operation" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row w-2/3 space-x-2">
            <UButton label="Save" color="green" variant="outline" icon="i-heroicons-pencil-square" class="flex-1"
              @click="handleSaveEntry" />
            <UButton label="Delete" color="red" variant="outline" icon="i-heroicons-minus-circle" class="flex-1"
              @click="handleDeleteEntry()" />
            <UButton label="Clear" color="red" variant="outline" icon="i-f7-rays" class="flex-1" @click="clearForm" />
          </div>

          <UTable :rows="timeEntries" :columns="[
            { key: 'StartTime', label: 'Time' },
            { key: 'WorkCenter', label: 'Workcenter' },
            { key: 'Job', label: 'Job' },
            { key: 'Operation', label: 'Operation' },
            { key: 'hours', label: 'Hours' }
          ]" class="w-full" :ui="{
            wrapper: 'h-[500px] overflow-y-auto border border-gray-400 dark:border-gray-700',
            divide: 'divide-gray-200 dark:divide-gray-800',
            tr: { active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50' },
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:bg-gray-900',
              padding: 'py-2'
            },
            td: { base: 'h-[22px]', padding: 'py-1' }
          }" hover @select="(entry) => handleRowSelect(entry)" />


          <div class="flex justify-end">
            <div class="w-1/3 flex justify-between font-extrabold">
              <span>Hours Worked:</span>
              <span>{{ totalHours }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col space-y-4 px-4 py-4">

          <div class="flex flex-row space-x-2">
            <div class="basis-1/4">
              <UFormGroup label="Week Of" required>
                <UInputMenu mode="week" v-model="selectedWeek" :options="weekDates" />
              </UFormGroup>
            </div>
            <div class="flex-1" />
          </div>

          <UTable :rows="verificationEntry.timeEntries" :columns="[
            {
              key: 'startTime',
              label: 'Date',
            },
            {
              key: 'dayOfWeek',
              label: 'Day',
            },
            { key: 'hours', label: 'Hours' },

          ]" class="w-full" :ui="{
            wrapper: 'h-[500px] overflow-y-auto border border-gray-400 dark:border-gray-700',
            divide: 'divide-gray-200 dark:divide-gray-800',
            tr: { active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50' },
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:bg-gray-900',
              padding: 'py-2'
            },
            td: { base: 'h-[22px]', padding: 'py-1' }
          }" hover @select="handleWeeklyEntrySelect" />
          <div class="flex justify-end">
            <div class="w-1/3 flex justify-between font-extrabold">
              <span>Total Hours:</span>
              <span>{{ verificationEntry.totalHours }}</span>
            </div>
          </div>

          <div class="flex flex-row space-x-2 items-end">
            <div class="w-1/3">
              <UFormGroup label="Verified By:">
                <UInput v-model="verificationData.verifyBy" :ui="{ input: { color: 'white dark:white' } }" />
              </UFormGroup>
            </div>
            <div class="w-1/3">
              <UFormGroup label="Verified Date:">
                <UInput v-model="verificationData.verifyDate" :ui="{ input: { color: 'white dark:white' } }" />
              </UFormGroup>
            </div>
            <div class="w-1/3 flex flex-col space-y-2">
              <UButton label="Change Time" color="primary" variant="outline" icon="i-heroicons-pencil-square" block
                @click="handleChangeTime" />
              <UButton label="Verify" color="green" variant="outline" icon="i-heroicons-check-circle" block
                @click="handleVerify" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>