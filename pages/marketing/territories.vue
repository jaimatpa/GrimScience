<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";

onMounted(() => {
  init();
});

const loadingOverlay = ref(false);
const loadingDeleteButton = ref(false);
const states = ref([]);
const selectedStates = ref([]);
const employees = ref([]);
const isDeleteModalOpen = ref(false);

const formData = reactive({
  Name: null,
  SalesRep: null,
  ServiceTech: null,
});

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Name",
      label: "Name",
    },
    {
      key: "SalesRep",
      label: "Sales Rep",
    },
    {
      key: "ServiceTech",
      label: "Service Tech",
    },
  ],

  territories: [],
  selectedTerritory: null,
  selectedTerritoryId: null,
  isLoading: false,
});

const stateColumns = ref([
  {
    key: "stateName",
    label: "State",
  },
]);

const headerFilters = ref({
  Name: {
    filter: "Name",
    options: [],
  },
  SalesRep: {
    filter: "SalesRep",
    options: [],
  },
  ServiceTech: {
    filter: "ServiceTech",
    options: [],
  },
});

const filterValues = ref({
  Name: null,
  SalesRep: null,
  ServiceTech: null,
});

const selectedColumns = ref(gridMeta.value.defaultColumns);
const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const init = async () => {
  fetchGridData();
  for (const key in headerFilters.value) {
    const apiURL = headerFilters.value[key]?.api ?? `/api/territories/${key}`;
    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      },
    });
  }
  await useApiFetch("/api/territories/employee", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        employees.value = response._data.body;
      }
    },
  });
};

const fetchGridData = async () => {
  loadingOverlay.value = true;
  await useApiFetch("/api/territories/", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.territories = response._data.body;
      }
    },
  });
  await useApiFetch("/api/territories/states", {
    method: "GET",
    params: { territoryId: null },
    onResponse({ response }) {
      if (response.status === 200) {
        states.value = response._data.body;
        selectedStates.vlaue = [];
      }
    },
  });
  loadingOverlay.value = false;
};

const getStates = async () => {
  await useApiFetch("/api/territories/states", {
    method: "GET",
    params: { territoryId: gridMeta.value.selectedTerritoryId },
    onResponse({ response }) {
      if (response.status === 200) {
        states.value = response._data.body;
        console.log(response._data.body);
        for (const state of response._data.body) {
          console.log(state);
          if (state.checked) {
            selectedStates.value = [...selectedStates.value, state];
          }
        }
      }
    },
  });
};

const add = async () => {
  if (formData.Name && formData.SalesRep && formData.ServiceTech) {
    loadingOverlay.value = true;
    const addedStates = states.value.map((item) => {
      const check = selectedStates.value.some(
        (state) => state.stateID == item.stateID
      );
      return {
        ...item,
        checked: check,
      };
    });
    await useApiFetch("/api/territories/", {
      method: "POST",
      body: {
        name: formData.Name,
        salesRep: formData.SalesRep,
        serviceTech: formData.ServiceTech,
        states: addedStates,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          gridMeta.value.territories = response._data.body;
        }
      },
    });
    await fetchGridData();
    loadingOverlay.value = false;
  }
};

const modify = async () => {
  if (formData.Name && formData.SalesRep && formData.ServiceTech) {
    loadingOverlay.value = true;
    const addedStates = states.value.map((item) => {
      const check = selectedStates.value.some(
        (state) => state.stateID == item.stateID
      );
      return {
        ...item,
        checked: check,
      };
    });
    await useApiFetch(
      "/api/territories/" + gridMeta.value.selectedTerritoryId,
      {
        method: "PUT",
        body: {
          name: formData.Name,
          salesRep: formData.SalesRep,
          serviceTech: formData.ServiceTech,
          states: addedStates,
        },
        onResponse({ response }) {
          if (response.status === 200) {
            gridMeta.value.territories = response._data.body;
          }
        },
      }
    );
    await fetchGridData();
    loadingOverlay.value = false;
  }
};

const clear = () => {
  formData.Name = null;
  formData.SalesRep = null;
  formData.ServiceTech = null;
  selectedStates.value = [];
  gridMeta.value.selectedTerritory = null;
  gridMeta.value.selectedTerritoryId = null;
};

const deleteTerritory = async () => {
  loadingDeleteButton.value = true;
  await useApiFetch("/api/territories/" + gridMeta.value.selectedTerritoryId, {
    method: "DELETE",
  });
  await fetchGridData();
  loadingDeleteButton.value = false;
  isDeleteModalOpen.value = false;
};

const onSelect = async (row) => {
  gridMeta.value.selectedTerritory = row;
  gridMeta.value.selectedTerritoryId = row?.TerritoryID;
  formData.Name = row.Name;
  formData.SalesRep = row.formSalesRep;
  formData.ServiceTech = row.formServiceTech;
  gridMeta.value.territories.forEach((item) => {
    if (item.TerritoryID === row.TerritoryID) {
      item.class = "bg-gray-200";
    } else {
      delete item.class;
    }
  });
  await getStates();
};

const handleFilterChange = () => {
  fetchGridData();
};

init();
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

  <UDashboardPage class="overflow-y-scroll">
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Sales Territories">
      </UDashboardNavbar>

      <UForm>
        <div class="flex flex-col space-x-4 p-3">
          <div class="flex">
            <div class="w-4/5">
              <div class="flex flex-row space-x-3 pb-4">
                <div
                  class="w-[200px]"
                  v-for="[key, value] in Object.entries(headerFilters)"
                  :key="key"
                >
                  <UFormGroup :name="key">
                    <USelect
                      v-model="filterValues[`${value.filter}`]"
                      :options="value.options"
                      @change="handleFilterChange()"
                    />
                  </UFormGroup>
                </div>
              </div>
              <div class="mt-4">
                <UTable
                  :columns="columns"
                  :rows="gridMeta.territories"
                  :ui="{
                    wrapper:
                      'h-[740px] border-2 border-gray-300 dark:border-gray-700',
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
                  @select="onSelect"
                >
                  <template #empty-state>
                    <div></div>
                  </template>
                </UTable>
              </div>
            </div>
            <div class="w-1/5">
              <div class="text-gray py-3 pl-4 opacity-75">
                (One Territory Per State)
              </div>
              <div>
                <div class="pt-4 pl-4">
                  <UTable
                    v-model="selectedStates"
                    :columns="stateColumns"
                    :rows="states"
                    :ui="{
                      wrapper:
                        'h-[740px]  border-2 border-gray-300 dark:border-gray-700',
                      tr: {
                        active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                      },
                      th: {
                        base: 'sticky top-0 z-10 ',
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
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-3 px-3">
          <div class="">
            <UFormGroup label="Name" name="Name">
              <UInput v-model="formData.Name" placeholder="" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Service Tech" name="Service Tech">
              <USelect v-model="formData.SalesRep" :options="employees" />
            </UFormGroup>
          </div>
          <div class="">
            <UFormGroup label="Service Tech" name="Service Tech">
              <USelect v-model="formData.ServiceTech" :options="employees" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex space-x-3 pl-3 py-8">
          <div class="w-[120px]">
            <UButton
              icon="i-heroicons-plus"
              type="submit"
              variant="outline"
              color="green"
              label="Add"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="add"
              truncate
            />
          </div>
          <div class="w-[120px]">
            <UButton
              icon="i-heroicons-pencil-square"
              type="submit"
              variant="outline"
              label="Modify"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="modify"
              truncate
            />
          </div>
          <div class="w-[120px]">
            <UButton
              icon="i-f7-rays"
              variant="outline"
              color="red"
              label="Clear Form"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="clear"
              truncate
            />
          </div>
          <div class="w-[120px]">
            <UButton
              icon="i-heroicons-minus-circle"
              variant="outline"
              color="red"
              label="Delete"
              :ui="{
                base: 'w-full',
                truncate: 'flex justify-center w-full',
              }"
              @click="isDeleteModalOpen = true"
              truncate
            />
          </div>
        </div>
      </UForm>
    </UDashboardPanel>
  </UDashboardPage>

  <!-- Delete Confirmation Modal -->
  <UDashboardModal
    v-model="isDeleteModalOpen"
    title="Delete Territory?"
    description="Are you sure you want to delete this territory?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      title: 'text-lg text-black',
       header: {
        base: '',
        padding: 'pt-5 sm:px-9',
      },
      width: 'w-[400px]',
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
    }"
  >
    <template #footer>
      <div class="flex ms-auto gap-4 mt-10">
        <UButton
          color="white"
          label="Yes"
          :loading="loadingDeleteButton"
          @click="deleteTerritory"
          class="w-20"
        />
        <UButton
          color="white"
          label="No"
          @click="isDeleteModalOpen = false"
          class="w-20"
        />
      </div>
    </template>
  </UDashboardModal>
</template>
