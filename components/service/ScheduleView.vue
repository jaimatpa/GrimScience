<script lang="ts" setup>
import { format } from "date-fns";
import {
    BryntumSchedulerProjectModel,
    BryntumScheduler
} from '@bryntum/scheduler-vue-3';
import "@bryntum/scheduler/scheduler.stockholm.css";

const scheduler = ref(null);
const project = ref(null);

const resources = ref(null);
const events = ref(null);
const assignments = ref(null);
const dependencies = ref(null);

const useSchedulerConfig = () => {
    return {
        columns   : [{ text : 'Name', field : 'name',  width : 160 }],
        startDate : new Date(2022, 0, 1),
        endDate   : new Date(2022, 0, 10)
    };
};
const useProjectConfig = () => {
    return {
    };
};

const schedulerConfig = reactive(useSchedulerConfig());
const projectConfig = reactive(useProjectConfig());

resources.value = [
    { id : 1, name : 'Dan Stevenson' },
    { id : 2, name : 'Talisha Babin' }
];

events.value = [
    { resourceId : 1, startDate : '2022-01-01', endDate : '2022-01-10' },
    { resourceId : 2, startDate : '2022-01-02', endDate : '2022-01-09' }
];
assignments.value = [
    { event : 1, resource : 1 },
    { event : 2, resource : 2 }
];

dependencies.value = [
    { fromEvent : 1, toEvent : 2 }
];
</script>

<template>
    <bryntum-scheduler-project-model
                ref="project"
                v-bind="projectConfig"
                :resources="resources"
                :events="events"
                :assignments="assignments"
                :dependencies="dependencies"
    />
    <bryntum-scheduler
        ref="scheduler"
        v-bind="schedulerConfig"
    />
</template>