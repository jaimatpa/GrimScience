<script lang="ts" setup>
  import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-vue-3';
  import { format, addHours } from 'date-fns'

  useSeoMeta({
    title: 'Grimm-Service calendar'
  })
  const useCalendarConfig = () => {
    return {
        date : new Date()
    };
  };
  const useProjectConfig = () => {
    return {
    };
  };
  const calendar = ref(null);
  const project = ref(null);

  const calendarConfig = reactive(useCalendarConfig());
  const projectConfig = reactive(useProjectConfig());

  const resources = ref(null);
  const events = ref(null);

  resources.value = [
    {
      id         : 1,
      name       : 'Installation',
      eventColor : 'green'
    }
  ];
  events.value = []
  console.log(process.env.NUXT_UI_PRO_PATH)
  const fetchServiceCalendarList = async () => {
    await useApiFetch(`/api/service/calendar`, {
      method: 'GET',
      onResponse({response}) {
        if(response.status === 200) {
          const tmpEvents = response._data.body.map((data, index) => {
            return {
              id: index,
              name: `SN${data.serial ?? ''} ${data.InstallationBy??''}`,
              startDate: format(data.datepromised, "yyyy-MM-dd'T'HH:mm:ss"),
              endDate: format(addHours(data.datepromised, 1), "yyyy-MM-dd'T'HH:mm:ss"),
              resourceId: 1
            }
          })
          events.value = tmpEvents
        }
      }
    })
  }
  await fetchServiceCalendarList()
  onMounted(() => {
    calendar.value.instance.value.project = project.value.instance.value;
  });

</script>

<template>
  <UDashboardPage>
    <bryntum-calendar-project-model
      ref="project"
      v-bind="projectConfig"
      :resources="resources"
      :events="events"
    />
    <bryntum-calendar
      ref="calendar"
      v-bind="calendarConfig"
    />
  </UDashboardPage>
</template>