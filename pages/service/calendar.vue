<!-- components/ServiceSchedule.vue -->
<script lang="ts" setup>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek,
  endOfWeek, isToday, isSameMonth
} from 'date-fns';

const modalMeta = ref({
  isServiceOrderOpen: false,
  isSiteVisitOpen: false
})

const activeTab = ref('service')
const loading = ref(false)
const error = ref('')
const scheduleData = ref([])
const employees = ref([])
const serviceType = ref('')  // Empty by default
const selectedTechnician = ref('')  // Empty by default
const showOpenOnly = ref(false)
const selectedAppointment = ref(null)
const currentDate = ref(new Date())

// Calendar specific refs
const calendarDays = ref<Date[]>([])
const calendarEvents = ref<{ [key: string]: any[] }>({})

// Initialize calendar days for the entire month view
const initializeCalendar = () => {
  const start = startOfWeek(startOfMonth(currentDate.value))
  const end = endOfWeek(endOfMonth(currentDate.value))
  calendarDays.value = eachDayOfInterval({ start, end })
}

// Get calendar weeks for proper grid rendering
const calendarWeeks = computed(() => {
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  calendarDays.value.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return weeks
})
// const modalMeta = ref({
//   isServiceOrderDetailModalOpen: false,
//   isSiteVisitModalOpen: false
// })

const handleEventDblClick = (event: any) => {
  selectedAppointment.value = event
  const id = event.content.split('#')[1]

  if (event.content.startsWith('SR#')) {
    modalMeta.value.isServiceOrderOpen = true
  } else if (event.content.startsWith('SV#')) {
    modalMeta.value.isSiteVisitOpen = true
  }
}
// Organize events by date
const organizeEventsByDate = (events: any[]) => {
  const organized: { [key: string]: any[] } = {}

  events.forEach(event => {
    const dateKey = format(new Date(event.startTime), 'yyyy-MM-dd')
    if (!organized[dateKey]) {
      organized[dateKey] = []
    }
    organized[dateKey].push(event)
  })

  calendarEvents.value = organized
}

// Fetch active employees
const fetchEmployees = async () => {
  loading.value = true
  try {
    await useApiFetch('/api/calendar/schedule/employees', {
      method: 'GET',
      onResponse: ({ response }) => {
        console.log(response)
        employees.value = response._data?.body || []
      },
      onResponseError: ({ response }) => {
        console.error(response)
      }
    })
  } catch (err) {
    error.value = 'Failed to load employees'
    console.error(err)
  }
  loading.value = false
}

const fetchScheduleData = async () => {
  loading.value = true
  try {
    const params: any = {
      year: currentDate.value.getFullYear(),
      month: currentDate.value.getMonth() + 1,
    }

    // Add optional filters
    if (selectedTechnician.value) {
      params.technician = selectedTechnician.value
    }
    if (serviceType.value) {
      params.serviceType = serviceType.value
    }
    if (showOpenOnly.value) {
      params.openOnly = showOpenOnly.value
    }

    await useApiFetch(`/api/calendar/schedule/service`, {
      method: 'GET',
      params,
      onResponse: ({ response }) => {
        const events = response._data?.body || []
        organizeEventsByDate(events)
      },
      onResponseError: ({ response }) => {
        console.error(response)
      }
    })
  } catch (err) {
    error.value = 'Failed to load schedule data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Reset filters and reload data
const resetFilters = () => {
  selectedTechnician.value = ''
  serviceType.value = ''
  showOpenOnly.value = false
  fetchScheduleData()
}

// Handle schedule type change
const handleTypeChange = (value: string) => {
  serviceType.value = value
  fetchScheduleData()
}

// Handle technician selection
const handleTechnicianChange = (value: string) => {
  selectedTechnician.value = value
  fetchScheduleData()
}

const goToPreviousMonth = async () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
  initializeCalendar()
  await fetchScheduleData()
}

const goToNextMonth = async () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  initializeCalendar()
  await fetchScheduleData()
}

const goToToday = async () => {
  currentDate.value = new Date()
  initializeCalendar()
  await fetchScheduleData()
}

// Handle appointment click
const handleAppointmentClick = (appointment: any) => {
  selectedAppointment.value = appointment

  if (appointment.content.startsWith('SR#')) {
    modalMeta.value.isServiceOrderOpen = true
  } else if (appointment.content.startsWith('SV#')) {
    modalMeta.value.isSiteVisitOpen = true
  }
}

watch(showOpenOnly, () => {
  fetchScheduleData()
})

const handleServiceOrderClose = () => {
  modalMeta.value.isServiceOrderOpen = false
  selectedAppointment.value = null
}

const handleSiteVisitClose = () => {
  modalMeta.value.isSiteVisitOpen = false
  selectedAppointment.value = null
}

onMounted(async () => {
  initializeCalendar()
  await fetchEmployees()
  await fetchScheduleData()
})
</script>

<template>
  <loading v-model:active="loading" :is-full-page="true" color="#000000" backgroundColor="#1B2533" loader="dots" />
  <UDashboardPage>
    <UDashboardPanel grow>
      <!-- Header Section -->
      <UDashboardNavbar class="gmsPurpleHeader">
        <template #title>
          Service Calendar
          <template v-if="serviceType">
            - {{ serviceType }}
          </template>
          <template v-if="selectedTechnician">
            for {{ selectedTechnician }}
          </template>
        </template>
      </UDashboardNavbar>

      <!-- Filters Section -->
      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex flex-row space-x-4 items-center">
            <!-- Technician Select -->
            <div class="w-64">
              <UFormGroup label="Technician">
                <USelect v-model="selectedTechnician" :options="[
                  { label: 'All Technicians', value: '' },
                  ...employees.map(emp => ({
                    label: `#${emp.payrollno} ${emp.fname} ${emp.lname}`,
                    value: emp.id
                  }))
                ]" @change="handleTechnicianChange" />
              </UFormGroup>
            </div>

            <!-- Service Type Select -->
            <div class="w-48">
              <UFormGroup label="Service Type">
                <USelect v-model="serviceType" :options="[
                  { label: 'All Types', value: '' },
                  { label: 'Field', value: 'Field' },
                  { label: 'Customer', value: 'Customer' },
                  { label: 'Factory', value: 'Factory' }
                ]" @change="handleTypeChange" />
              </UFormGroup>
            </div>

            <!-- Open Only Toggle -->
            <UCheckbox v-model="showOpenOnly" label="Show Open Only" />

            <!-- Calendar Navigation -->
            <div class="flex items-center space-x-2 ml-4">
              <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="goToPreviousMonth" />
              <UButton variant="ghost" @click="goToToday">
                {{ format(currentDate, 'MMMM yyyy') }}
              </UButton>
              <UButton icon="i-heroicons-arrow-right" color="gray" variant="ghost" @click="goToNextMonth" />
            </div>
          </div>
        </template>

        <template #right>
          <div class="flex space-x-2">
            <UButton color="gray" variant="outline" icon="i-heroicons-x-mark" label="Clear Filters"
              @click="resetFilters" />
            <UButton color="green" variant="outline" icon="i-heroicons-arrow-path" label="Refresh"
              @click="fetchScheduleData" />
          </div>
        </template>
      </UDashboardToolbar>

      <!-- Error Alert -->
      <UAlert v-if="error" color="red" variant="soft" :title="error" class="mb-4" />

      <!-- Calendar Grid -->
      <div class="p-4">
        <!-- Calendar Header -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-t">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
            class="bg-white p-2 text-center font-medium text-sm">
            {{ day }}
          </div>
        </div>

        <!-- Loading Overlay -->


        <!-- Calendar Body -->
        <div class="grid gap-px bg-gray-200">
          <!-- Calendar Weeks -->
          <div v-for="(week, weekIndex) in calendarWeeks" :key="weekIndex" class="grid grid-cols-7 gap-px">
            <!-- Days in Week -->
            <div v-for="day in week" :key="format(day, 'yyyy-MM-dd')" class="bg-white p-2 min-h-[120px] relative"
              :class="{
                'bg-blue-50': isToday(day),
                'opacity-50': !isSameMonth(day, currentDate)
              }">
              <!-- Date number -->
              <div class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-sm rounded-full"
                :class="{ 'bg-blue-500 text-white': isToday(day) }">
                {{ format(day, 'd') }}
              </div>

              <!-- Events for this day -->
              <div class="mt-6 space-y-1">
                <template v-for="event in calendarEvents[format(day, 'yyyy-MM-dd')] || []" :key="event.content">
                  <div class="text-xs p-1 rounded cursor-pointer truncate flex items-center justify-between" :class="{
                    'bg-blue-100 hover:bg-blue-200': event.content.startsWith('SR#'),
                    'bg-green-100 hover:bg-green-200': event.content.startsWith('SV#')
                  }" @dblclick="handleEventDblClick(event)">
                    <span>{{ event.subject }}</span>
                    <UBadge :color="event.status === 'Open' ? 'yellow' : 'green'" size="sm" class="ml-1">
                      {{ event.status }}
                    </UBadge>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <UDashboardModal
      :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center gmsRedHeader',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1250px] sm:max-w-8xl',
    }"
      v-model="modalMeta.isServiceOrderOpen" title="Service Order Details">
        <ServiceOrderDetail v-if="selectedAppointment" :service-id="selectedAppointment.content.replace('SR#', '')"
          @close="handleServiceOrderClose" />
      </UDashboardModal>

      <UDashboardModal 
      :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center gmsRedHeader',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1250px] sm:max-w-8xl',
    }"v-model="modalMeta.isSiteVisitOpen" title="Site Visit Details">
        <CustomersSiteVisitDetail v-if="selectedAppointment" :visit-id="selectedAppointment.content.replace('SV#', '')"
          @close="handleSiteVisitClose" />
      </UDashboardModal> -->
    </UDashboardPanel>
  </UDashboardPage>
</template>