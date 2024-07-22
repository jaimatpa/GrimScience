<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";

const emit = defineEmits(["close", "save"]);

const toast = useToast();
const router = useRouter();
const skillFormInstance = getCurrentInstance();
const loadingOverlay = ref(false);
const isLoading = ref(false);
const allSkills = ref([]);
const allFrequencies = ref([]);
const getEmployees = ref([]);
const formData = reactive({
  Name: null,
  Catagory: null,
  subcatagory: null,
  weeks: null,
  frequency: null,
  date: null,
  by: null,
  WorkCenterID: 0,
});

onMounted(() => {
  init();
});

const init = async () => {
  fetchFrequencies();
  fetchEmployees();
  fetchSkills();

  for (const key in headerFilters.value) {
    const apiURL = `/api/skills/${key}`;
    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
          headerFilters.value[key].allOptions = [...response._data.body];
        }
      },
    });
  }
};

const fetchEmployees = async () => {
  // get frequency
  await useApiFetch("/api/auth/employees", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        getEmployees.value = response._data.body;
      }
    },
    onResponseError() {
      getEmployees.value = [];
    },
  });
};

const fetchFrequencies = async () => {
  // get frequency
  await useApiFetch("/api/skills/frequency", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        allFrequencies.value = response._data.body;
      }
    },
    onResponseError() {
      allFrequencies.value = [];
    },
  });
};

const fetchSkills = async () => {
  loadingOverlay.value = true;

  // get skills
  await useApiFetch("/api/skills", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        allSkills.value = response._data.body;
        skillGridMeta.value.skills = response._data.body;
      }
    },
    onResponseError() {
      skillGridMeta.value.skills = [];
    },
  });

  loadingOverlay.value = false;
};

const headerFilters = ref({
  catagory: {
    label: "",
    filter: "Catagory",
    options: [],
    allOptions: [],
  },
  subCatagory: {
    label: "",
    filter: "subcatagory",
    options: [],
    allOptions: [],
  },
});

const filterValues = ref({
  UniqueID: null,
  Catagory: null,
  subcatagory: null,
});

const handleFilterChange = () => {
  fetchSkills();
};

const validate = (state: any): FormError[] => {
  const errors = [];
  return errors;
};

const handleEditClick = async () => {
  // console.log("edit");

  // console.log("fff", formData);

  // console.log("skillGridMeta.value", skillGridMeta.value.selectedSkill);
  const data = {
    WorkCenterID: 0,
    ...formData,
  };
  // console.log("sasdasddata", data);
  const id = skillGridMeta.value.selectedSkill.UniqueID;
  await useApiFetch(`/api/skills/${id}`, {
    method: "PUT",
    body: formData,
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
  });
  await fetchSkills();
};

const onDelete = async () => {
  // const id = skillGridMeta.value.selectedSkill.UniqueID;
  console.log(
    "skillGridMeta.value.selectedSkill",
    skillGridMeta.value.selectedSkill
  );

  if (!skillGridMeta.value.selectedSkill) {
    toast.add({
      title: "Failed",
      description: "Please select the skill.",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  } else {
    console.log("wwww");
    const id = skillGridMeta.value.selectedSkill.UniqueID;

    await useApiFetch(`/api/skills/${id}`, {
      method: "DELETE",
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-trash-solid",
            color: "green",
          });
          fetchSkills();
        }
      },
    });
  }
};

const onSubmit = async (event: FormSubmitEvent<any>, actionType: string) => {
  const { UniqueID, ...data } = event.data;
  const nameMatches = allSkills.value.some(
    (item) => item.Name.trim() === data.Name.trim()
  );

  if (nameMatches) {
    toast.add({
      title: "Failed",
      description: "Skill descripton must be different",
      icon: "i-heroicons-minus-circle",
      color: "red",
    });
  } else {
    isLoading.value = true;
    await useApiFetch("/api/skills", {
      method: "POST",
      body: data,
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
    await fetchSkills();
  }

  emit("save");
};

const handleClearCick = () => {
  Object.keys(formData).forEach((key) => {
    if (key !== "WorkCenterID") formData[key] = null;
  });
};

const skillGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "UniqueID",
      label: "Skill#",
    },
    {
      key: "Catagory",
      label: "Catagory",
    },
    {
      key: "subcatagory",
      label: "Subcatagory",
    },
    {
      key: "Name",
      label: "Skill",
    },
    {
      key: "weeks",
      label: "Weeks",
    },
  ],
  skills: [],
  selectedSkill: null,
  isLoading: false,
});

const handleSkillSelect = (row) => {
  skillGridMeta.value.selectedSkill = { ...row, class: "" };
  skillGridMeta.value.skills.forEach((c) => {
    if (c.UniqueID === row.UniqueID) {
      c.class = "bg-gray-200";
    } else {
      delete c.class;
    }
  });
  const data = skillGridMeta.value.selectedSkill;
  formData.Catagory = data.Catagory;
  formData.subcatagory = data.subcatagory;
  formData.Name = data.Name;
  formData.weeks = data.weeks;
  formData.frequency = data.frequency;
  formData.date = data.date;
};
const relatedPartsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "week",
      label: "Catagory",
    },
    {
      key: "Operation",
      label: "Subcatagory",
    },
    {
      key: "WorkCenter",
      label: "Model #",
    },
    {
      key: "Hours",
      label: "Description",
    },
  ],
  parts: [],
  selectedParts: null,
  isLoading: false,
});

const columnGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "week",
      label: "ColumnHeader",
    },
    {
      key: "Operation",
      label: "ColumnHeader",
    },
    {
      key: "WorkCenter",
      label: "ColumnHeader",
    },
    {
      key: "Hours",
      label: "ColumnHeader",
    },
    {
      key: "Hours",
      label: "ColumnHeader",
    },
  ],
  columns: [],
  selectedColumn: null,
  isLoading: false,
});

const stepsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "step",
      label: "Step",
    },
    {
      key: "desc",
      label: "Desc",
    },
  ],
  steps: [],
  selectedStep: null,
  isLoading: false,
});

const modalMeta = ref({
  isWorkCenterModalOpen: false,
  modalTitle: "Work Center",
  modalDescription: "Work Center Information",
});
const handleWCClick = () => {
  modalMeta.value.isWorkCenterModalOpen = true;
};

const handleModalClose = () => {
  modalMeta.value.isWorkCenterModalOpen = false;
};
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

  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col space-x-4">
      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Skill Lookup</h2>
      </div>

      <div class="flex flex-row space-x-3 items-end mb-4 mt-5">
        <div class="basis-1/7 max-w-[200px]">
          <UFormGroup label="" name="zip">
            <UInput
              v-model="filterValues.UniqueID"
              @update:model-value="handleFilterChange()"
            />
          </UFormGroup>
        </div>

        <template
          v-for="[key, value] in Object.entries(headerFilters)"
          :key="key"
        >
          <div class="w-[200px]">
            <UFormGroup :label="value.label" :name="key">
              <USelect
                v-model="filterValues[`${value.filter}`]"
                :options="value.options"
                @change="handleFilterChange()"
              />
            </UFormGroup>
          </div>
        </template>
      </div>

      <UTable
        :columns="skillGridMeta.defaultColumns"
        :rows="skillGridMeta.skills"
        :ui="{
          wrapper: 'h-[168px] border-2 border-gray-300 dark:border-gray-700',
          tr: {
            active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
          },
          th: {
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'px-2 py-0',
          },
          td: {
            base: 'h-[31px]',
            padding: 'px-2 py-0',
          },
        }"
        @select="handleSkillSelect"
      >
        <template #empty-state>
          <div></div>
        </template>
      </UTable>

      <div class="px-4 py-2 gmsTealTitlebar mt-4">
        <h2>Skill Information</h2>
      </div>

      <div class="flex flex-row space-x-3 items-end mb-4 mt-5">
        <div class="">
          <UFormGroup label="Catagory" name="Catagory">
            <UInputMenu
              v-model="formData.Catagory"
              v-model:query="formData.Catagory"
              :options="headerFilters.catagory.allOptions"
            />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Sub Categary" name="Sub Categary">
            <UInputMenu
              v-model="formData.subcatagory"
              v-model:query="formData.subcatagory"
              :options="headerFilters.subCatagory.allOptions"
            />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Description" name="Description">
            <UInput v-model="formData.Name" placeholder="" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Weeks" name="Weeks">
            <UInput v-model="formData.weeks" type="number" placeholder="" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup label="Frequency" name="Frequency">
            <UInputMenu
              v-model="formData.frequency"
              v-model:query="formData.frequency"
              :options="allFrequencies"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="flex space-x-5 items-end">
        <div class="w-3/5">
          <UFormGroup label="Comment" name="comment">
            <UTextarea :rows="5" type="text" placeholder="" />
          </UFormGroup>

          <div class="flex justify-between mt-5">
            <div class="w-[160px]">
              <UButton
                icon="i-heroicons-cursor-arrow-ripple"
                variant="outline"
                color="green"
                label="Select"
                :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
              />
            </div>
            <div>
              <UButton
                icon="i-heroicons-eye"
                variant="outline"
                color="green"
                label="View Work Centers"
                :ui="{
                  base: 'w-full',
                  truncate: 'flex justify-center w-full',
                }"
                @click="handleWCClick"
                truncate
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/5">
          <div class="flex space-x-4">
            <div class="w-1/2 flex flex-col gap-y-1">
              <div>
                <UButton
                  icon="i-heroicons-plus"
                  variant="outline"
                  color="green"
                  label="Add Skill"
                  type="submit"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div>
                <UButton
                  icon="i-f7-rays"
                  variant="outline"
                  color="red"
                  label="Clear Form"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  @click="handleClearCick"
                  truncate
                />
              </div>
            </div>
            <div class="w-1/2 flex flex-col gap-y-1">
              <div>
                <UButton
                  icon="i-heroicons-pencil-square"
                  variant="outline"
                  color="green"
                  label="Modify Skill"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  @click="handleEditClick"
                  truncate
                />
              </div>
              <div>
                <UButton
                  icon="i-heroicons-eye"
                  variant="outline"
                  color="green"
                  label="Preview Report"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div>
                <UButton
                  icon="i-heroicons-minus-circle"
                  variant="outline"
                  color="red"
                  label="Delete Skill"
                  :ui="{
                    base: 'w-full',
                    truncate: 'flex justify-center w-full',
                  }"
                  @click="onDelete"
                  truncate
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between space-x-4 mt-4">
            <div class="basis-1/2">
              <UFormGroup label="Date:" name="Date">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="
                      formData.date && format(formData.date, 'MM/dd/yyyy')
                    "
                    variant="outline"
                    :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }"
                    truncate
                  />
                  <template #panel="{ close }">
                    <CommonDatePicker
                      v-model="formData.date"
                      is-required
                      @close="close"
                    />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="By" name="By">
                <UInputMenu
                  v-model="formData.by"
                  v-model:query="formData.by"
                  :options="getEmployees"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2 gmsTealTitlebar mt-4">
        <h2>Related parts</h2>
      </div>
      <div class="flex flex-row space-x-3 items-end mb-4 mt-5">
        <div class="">
          <UFormGroup>
            <!-- v-model="formData.WorkCenter"
              v-model:query="formData.WorkCenter" -->
            <UInputMenu :options="[]" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup>
            <UInputMenu :options="[]" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup>
            <UInput type="number" placeholder="" />
          </UFormGroup>
        </div>
        <div class="">
          <UFormGroup>
            <UInput type="number" placeholder="" />
          </UFormGroup>
        </div>
      </div>
      <UTable
        :columns="relatedPartsGridMeta.defaultColumns"
        :rows="relatedPartsGridMeta.parts"
        :ui="{
          wrapper: 'h-[128px] border-2 border-gray-300 dark:border-gray-700',
          tr: {
            active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
          },
          th: {
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'px-2 py-0',
          },
          td: {
            base: 'h-[31px]',
            padding: 'px-2 py-0',
          },
        }"
      >
        <template #empty-state>
          <div></div>
        </template>
      </UTable>

      <div class="mt-4">
        <UTable
          :columns="columnGridMeta.defaultColumns"
          :rows="columnGridMeta.columns"
          :ui="{
            wrapper: 'h-[128px] border-2 border-gray-300 dark:border-gray-700',
            tr: {
              active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
            },
            th: {
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:text-gray dark:bg-[#111827]',
              padding: 'px-2 py-0',
            },
            td: {
              base: 'h-[31px]',
              padding: 'px-2 py-0',
            },
          }"
        >
          <template #empty-state>
            <div></div>
          </template>
        </UTable>
      </div>

      <div class="flex items-end justify-end mt-4 gap-x-4">
        <div>
          <UButton
            icon="i-heroicons-plus"
            variant="outline"
            color="green"
            label="Add Part"
            :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>

        <div>
          <UButton
            icon="i-heroicons-minus-circle"
            variant="outline"
            color="red"
            label="Remove Part"
            :ui="{
              base: 'w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
      </div>
    </div>
  </UForm>

  <!-- Work Center Modal -->
  <UDashboardModal
    v-model="modalMeta.isWorkCenterModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: '[w-800px] sm:max-w-5xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <JobWorkCenterForm :selected-employee="null" @close="handleModalClose" />
  </UDashboardModal>
</template>
