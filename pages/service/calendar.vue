<script lang="ts" setup>
// import { BryntumCalendarProjectModel, BryntumCalendar } from '@bryntum/calendar-vue-3'
import { AssignmentStore, Calendar } from '@bryntum/calendar';
import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-vue-3';
useSeoMeta({
  title: 'Grimm-Service calendar'
})
const useCalendarConfig = () => {
    return {
        date : '2022-01-01'
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
    name       : 'Default Calendar',
    eventColor : 'green'
  }
];
events.value =  [
  {
    id         : 1,
    name       : 'Meeting',
    startDate  : '2022-01-01T10:00:00',
    endDate    : '2022-01-01T11:00:00',
    resourceId : 1
  }, 
  {
    id         : 2,
    name       : 'Meeting',
    startDate  : '2022-01-02T10:00:00',
    endDate    : '2022-01-02T11:00:00',
    resourceId : 1
  }, 
];
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
      :onEmptyCellClick="(event) => {
        console.log(event)
      }"
      :onDragMoveEnd="(event) => {
        console.log(event)
      }"
    />
  </UDashboardPage>
</template>