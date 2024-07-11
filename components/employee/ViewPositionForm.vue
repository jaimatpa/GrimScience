<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedOrganization: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const organizaationExist = ref(true);
const isLoading = ref(false);
const formData = reactive({
  ReportsTo: null,
  Title: null,
  Employee: null,
  JobDescription: null,
  WorkCenters: null,
});

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(
    `/api/employees/organization/${props.selectedOrganization}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          loadingOverlay.value = false;
          organizaationExist.value = true;

          for (const key in response._data.body) {
            if (response._data.body[key] !== undefined) {
              formData[key] = response._data.body[key];
            }
          }
        }
      },
      onResponseError({}) {
        organizaationExist.value = false;
      },
    }
  );
  loadingOverlay.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  // if (!state.ReportsTo) errors.push({ path: 'ReportsTo', message: 'Please enter your report name.' })
  // if (!state.Title) errors.push({ path: 'Title', message: 'Please enter a your title.' })
  // if (!state.Employee) errors.push({ path: 'Employee', message: 'Please enter your name.' })
  // if (!state.JobDescription) errors.push({ path: 'JobDescription', message: 'Please enter your Job Description.' })
  // if (!state.WorkCenters) errors.push({ path: 'WorkCenters', message: 'Please enter your Work Centers.' })
  return errors;
};
const handleClose = async () => {
  if (organizationFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (props.selectedOrganization === null) {
    // Create Organization
    isLoading.value = true;
    await useApiFetch("/api/employees/organization", {
      method: "POST",
      body: event.data,
      onResponse({ response }) {
        if (response.status === 200) {
          isLoading.value = false;
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
  } else {
    // Update Position Detail
    await useApiFetch(
      `/api/employees/organization/${props.selectedOrganization}`,
      {
        method: "PUT",
        body: event.data,
        onResponse({ response }) {
          if (response.status === 200) {
            toast.add({
              title: "Success",
              description: response._data.message,
              icon: "i-heroicons-check-circle",
              color: "green",
            });
          }
        },
      }
    );
  }
  emit("save");
};

if (props.selectedOrganization !== null) editInit();

const items = [
  {
    slot: "schedule",
    label: "My Schedule",
  },
  {
    slot: "add",
    label: "Add",
  },
];

const routineitems = [
  {
    slot: "routines",
    label: "My Routines",
  },
  {
    slot: "add",
    label: "Add",
  },
];

const goalsitems = [
  {
    slot: "goals",
    label: "My Goals",
  },
  {
    slot: "add",
    label: "Add",
  },
];

const projectsitems = [
  {
    slot: "projects",
    label: "My Projects",
  },
  {
    slot: "add",
    label: "Add",
  },
];

const quotedColumns = ref([
  {
    key: "id",
    label: "ID",
  },
  {
    key: "period",
    label: "Period",
  },
  {
    key: "title",
    label: "Title",
  },
]);

const routinesColumns = ref([
  {
    key: "id",
    label: "ID",
  },
  {
    key: "period",
    label: "Period",
  },
  {
    key: "title",
    label: "Title",
  },
]);

const goalColumns = ref([
  {
    key: "id",
    label: "ID",
  },
  {
    key: "period",
    label: "Period",
  },
  {
    key: "goal",
    label: "Goal",
  },
]);

const projectColumns = ref([
  {
    key: "job",
    label: "Job#",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "model",
    label: "Model",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "dateOpened",
    label: "Date Opened",
  },
  {
    key: "dateClosed",
    label: "Date Closed",
  },
  {
    key: "cost",
    label: "Cost",
  },
  {
    key: "scheduled",
    label: "Date Scheduled",
  },
]);

const modalMeta = ref({
  isJobsListModalOpen: false,
});

const handleConnectClick = () => {
  modalMeta.value.isJobsListModalOpen = true;
};

const jobModalMeta = ref({
  isJobFormModalOpen: false,
  modalTitle: "New Job",
  modalDescription: "Add New Job",
  isPositionModalOpen: false,
});

const handleModalClose = () => {
  jobModalMeta.value.isJobFormModalOpen = false;
};

const handleModalSave = async () => {
  handleModalClose();
};

const onJobCreate = () => {
  jobModalMeta.value.modalTitle = "New Job";
  jobModalMeta.value.modalDescription = "Add New Job";
  jobModalMeta.value.isJobFormModalOpen = true;
};

if (props.selectedOrganization !== null) editInit();
// else
// propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading
      v-model:active="loadingOverlay"
      :is-full-page="true"
      color="#000000"
      backgroundColor="#1B2533"
      loader="dots"
    />
  </div>
  <template v-if="!props.isModal && !organizaationExist">
    <CommonNotFound
      :name="'Organization not found'"
      :message="'The organization you are looking for does not exist'"
      :to="'/employees/organization'"
    />
  </template>
  <template v-else>
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="w-full flex gap-5">
        <div class="w-1/5 flex flex-col gap-y-2">
          <div class="">
            <UFormGroup label="Employee" name="ReportsTo">
              <UInput v-model="formData.Employee" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Position" name="ReportsTo">
              <UInput v-model="formData.Title" placeholder="" />
            </UFormGroup>
          </div>

          <div class="">
            <UFormGroup label="Reports To" name="ReportsTo">
              <UInput v-model="formData.ReportsTo" placeholder="" />
            </UFormGroup>
          </div>

          <div class="">
            <UFormGroup label="Position Description" name="WorkCenters">
              <UTextarea
                v-model="formData.JobDescription"
                :rows="4"
                type="text"
                placeholder=""
              />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Other People Rely on Me For" name="WorkCenters">
              <UTextarea :rows="4" type="text" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="I Teach Other / I Grow..." name="WorkCenters">
              <UTextarea :rows="4" type="text" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="My Authority" name="WorkCenters">
              <UTextarea :rows="4" type="text" placeholder="" />
            </UFormGroup>
          </div>
        </div>
        <div class="w-2/5">
          <div class="">
            <UTabs :items="items" class="">
              <template #schedule="{ item }">
                <UTable
                  :columns="quotedColumns"
                  :rows="[]"
                  :ui="{
                    wrapper:
                      'h-96 border-2 border-gray-300 dark:border-gray-700',
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-1',
                    },
                  }"
                />
              </template>

              <template #add="{ item }">
                <div class="flex flex-col gap-y-2 h-96">
                  <div class="">
                    <UFormGroup label="Title" name="WorkCenters">
                      <UInput type="text" placeholder="" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Scheduled Period" name="WorkCenters">
                      <USelect
                        :options="['Week', 'Month', 'Quarter', 'Year', 'Day']"
                      />
                    </UFormGroup>
                  </div>

                  <div class="w-[180px]">
                    <UButton
                      icon="i-heroicons-document-text"
                      type="submit"
                      variant="outline"
                      color="green"
                      :disabled="isLoading"
                      label="Save"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
          <div class="mt-5 h-44">
            <UTabs :items="goalsitems" class="">
              <template #goals="{ item }">
                <UTable
                  :columns="goalColumns"
                  :rows="[]"
                  :ui="{
                    wrapper:
                      'h-44 border-2 border-gray-300 dark:border-gray-700',
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-1',
                    },
                  }"
                />
              </template>

              <template #add="{ item }">
                <div class="flex flex-col gap-y-2">
                  <div class="">
                    <UFormGroup label="Title" name="WorkCenters">
                      <UInput type="text" placeholder="" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Scheduled Period" name="WorkCenters">
                      <USelect
                        :options="['Week', 'Month', 'Quarter', 'Year', 'Day']"
                      />
                    </UFormGroup>
                  </div>

                  <div class="w-[180px]">
                    <UButton
                      icon="i-heroicons-document-text"
                      type="submit"
                      variant="outline"
                      color="green"
                      :disabled="isLoading"
                      label="Save"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
        </div>

        <div class="w-2/5">
          <div>
            <UTabs :items="routineitems" class="">
              <template #routines="{ item }">
                <UTable
                  :columns="routinesColumns"
                  :rows="[]"
                  :ui="{
                    wrapper:
                      'h-96 border-2 border-gray-300 dark:border-gray-700',
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-1',
                    },
                  }"
                />
              </template>

              <template #add="{ item }">
                <div class="flex flex-col gap-y-2 h-96">
                  <div class="">
                    <UFormGroup label="Title" name="WorkCenters">
                      <UInput type="text" placeholder="" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Scheduled Period" name="WorkCenters">
                      <USelect
                        :options="['Week', 'Month', 'Quarter', 'Year', 'Day']"
                      />
                    </UFormGroup>
                  </div>

                  <div class="w-[180px]">
                    <UButton
                      icon="i-heroicons-document-text"
                      type="submit"
                      variant="outline"
                      color="green"
                      :disabled="isLoading"
                      label="Save"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
          <div class="mt-5">
            <UTabs :items="projectsitems" class="">
              <template #projects="{ item }">
                <UTable
                  :columns="projectColumns"
                  :rows="[]"
                  :ui="{
                    wrapper:
                      'h-32 border-2 border-gray-300 dark:border-gray-700',
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'p-1',
                    },
                  }"
                />
                <div class="flex flex-row space-x-4 justify-start mt-2">
                  <div class="w-[180px]">
                    <UButton
                      color="gray"
                      label="Connect"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                      @click="handleConnectClick"
                    />
                  </div>
                  <div>
                    <UButton
                      label="Add New Project (Job)"
                      color="gray"
                      :ui="{
                        base: 'min-w-[200px] w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      @click="onJobCreate()"
                      truncate
                    />
                  </div>
                  <div>
                    <UButton
                      label="Disconnect"
                      color="gray"
                      :ui="{
                        base: 'min-w-[200px] w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </template>

              <template #add="{ item }">
                <div class="flex flex-col gap-y-2">
                  <div class="">
                    <UFormGroup label="Title" name="WorkCenters">
                      <UInput type="text" placeholder="" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Scheduled Period" name="WorkCenters">
                      <USelect
                        :options="['Week', 'Month', 'Quarter', 'Year', 'Day']"
                      />
                    </UFormGroup>
                  </div>

                  <div class="w-[180px]">
                    <UButton
                      icon="i-heroicons-document-text"
                      type="submit"
                      variant="outline"
                      color="green"
                      :disabled="isLoading"
                      label="Save"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-4 justify-start mt-2">
        <div class="w-[180px]">
          <UButton
            icon="i-heroicons-document-text"
            type="submit"
            variant="outline"
            color="green"
            :disabled="isLoading"
            label="Save"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
            truncate
          />
        </div>
        <div>
          <UButton
            icon="i-heroicons-printer"
            label="Print Report"
            variant="outline"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
      </div>
    </UForm>
  </template>

  <!-- Jobs List Modal -->
  <UDashboardModal
    v-model="modalMeta.isJobsListModalOpen"
    title="Jobs List"
    :ui="{
      width: 'w-[1600px] sm:max-w-8xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobList />
  </UDashboardModal>

  <!-- New Organization Detail Modal -->
  <UDashboardModal
    v-model="jobModalMeta.isJobFormModalOpen"
    :title="jobModalMeta.modalTitle"
    :description="jobModalMeta.modalDescription"
    :ui="{
      width: 'w-[1000px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobForm
      @close="handleModalClose"
      @save="handleModalSave"
      :selected-job="null"
      :is-modal="true"
    />
  </UDashboardModal>
</template>
