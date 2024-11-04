<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useDatePicker } from "v-calendar";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import PartsUsed from "./PartsUsed.vue";
import PartsList from "../job/PartsList.vue";
import { format } from "date-fns";
import DatePickerClient from "../common/DatePicker.client.vue";
import type { UTableColumn } from "~/types";
import type { NUMBER } from "sequelize";
import { id } from "date-fns/locale";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});

const items = [
  {
    key: "sub",
    label: "Sub Assembly",
  },
  {
    key: "project",
    label: "Product Projects",
  },
  {
    key: "Operation",
    label: "Operations",
  },
];

const employeeOptions = ref([]);
const selectedProjectItem = ref(null);
const jobList = ref([]);
const joblistLabel = ref([]);

const form = reactive({
  NUMBER: null,
  QUANTITY: null,
  Cost: null,
  PerType: null,
  ProjectType: null,
  DATEOPENED: ref(new Date()),
  ProductionDate: ref(new Date()),
  ProductionBy: null,
  DATECLOSED: ref(new Date()),
  ClosedBy: null,
  SubCatagory: null,
  PART: null,
  InstanceID: null,
  JobType: "Product",

  BEGSERIAL: null,
  ByEmployee: null,
  Catagory: null,
  Customer: null,
  DateScheduled: null,
  ID: null,
  MODEL: null,
  PRODUCTLINE: null,
  PercentageComplete: null,
  ProjectManager: null,
  SAflag: null,
  UniqueID: null,
  YouTrackProjectShortName: null,
  jobcat: null,
  jobsubcat: null,
  linkedJob: null,
});

const newEntry = reactive({
  ShipDate: null,
  Serial: null,
  PlanID: null,
  Quantity: "",
  SingleMaterialCost: 10,
  PartsList: null,
  dateEntered: ref(new Date()),
  SingleLaborHours: null,
  SingleLaborCost: 10,
  ScheduledQty: null,
  ScheduledDate: ref(new Date()),
  CostPerUnit: 10,
});

const tableOfCompletion = ref([]);
const columns = [
  {
    key: "Quantity",
    label: "#",
  },
  {
    key: "dateEntered",
    label: "Completion Date",
  },
  {
    key: "ScheduledDate",
    label: "Schedule Date",
  },
];

const jobColumns = [
  {
    key: "label",
    label: "Linked Job#",
  },
];

const weekly = ref([]);
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Number",
      label: "#",
    },
    {
      key: "week",
      label: "Week",
    },
    {
      key: "Operation",
      label: "Operation",
    },
    {
      key: "WorkCenter",
      label: "Work Center",
    },
    {
      key: "Hours",
      label: "Hrs",
    },
    {
      key: "reworkhrs",
      label: "Rework Hours",
    },
    {
      key: "verified",
      label: "Verified",
    },
    {
      key: "delete",
      label: "Del",
      kind: "actions",
    },
  ],
  isLoading: false,
});


const employeeHours = ref([]);
const gridMeta1 = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "StartTime",
      label: "Date",
    },
    {
      key: "Name",
      label: "Employee",
    },
    {
      key: "Hours",
      label: "Hrs.",
    },
    {
      key: "delete",
      label: "Del",
      kind: "actions",
    },
  ],
  isLoading: false,
});

const onUsed = () => {
  modalMeta.value.isPartsUsed = true;
};

const onPartListing = () => {
  modalMeta.value.isPartLisingModalOpen = true;
};

const addInventory = () => {
  tableOfCompletion.value.push({ ...newEntry });
  console.log("table of completion", tableOfCompletion.value);
};

const toast = useToast();

const loadingOverlay = ref(false);
const customerExist = ref(true);
const totalHours = ref();
const projectTypes = ["Product", "Sub Assembly"];
const RelieveInventory = ["Serial/Unit", "Operation"];
const selectedInventory = ref(RelieveInventory[0]);
const category = ["Marketing", "Accounting", "Engineering", "Manufacturing"];
const subCategorielist = ref([]);
const partlist = ref([]);
const selectCategoryForList = ref();

const modalMeta = ref({
  isPartsUsed: false,
  isPartLisingModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  manuFactureModal: false,
  modalTitle: "New Customer",
});

onMounted(() => {
  init();
});

const init = async () => {
  fetchDropdownData();
};

const fetchDropdownData = async () => {
  await useApiFetch("/api/projects/employees", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        employeeOptions.value = response._data.body;
      }
    },
  });
};

const addJob = async () => {
  if (selectedProjectItem.value && selectedProjectItem.value.value) {
    console.log("Selected value is", selectedProjectItem.value.label);

    const newJob = {
      value: selectedProjectItem.value.value,
    };

    jobList.value.push(newJob);
    joblistLabel.value.push({
      label: selectedProjectItem.value.label,
    });
  } else {
    console.error("Selected project item or value cannot be empty");
  }
};
const operation = ref([]);

const editInit = async () => {
  console.log("project is", props.selectedCustomer);
  if (props.selectedCustomer != null) {
    loadingOverlay.value = true;
    console.log("project is");
    await useApiFetch(`/api/projects/${props.selectedCustomer}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          loadingOverlay.value = false;
          customerExist.value = true;
          console.log("details is", response._data.body);

          for (const key in response._data.body) {
            form[key] = response._data.body[key];
          }
        }
      },
      onResponseError({}) {
        customerExist.value = false;
      },
    });

    subCategories();
    partDataList();
  }

  await useApiFetch(
    `/api/projects/linkedJob/getJob/${props.selectedCustomer}`,
    {
      method: "GET",

      onResponse({ response }) {
        if (response.status === 200) {
          const updatedJobList = response._data.body.map((job) => {
            return {
              label: job.linkedJob,
            };
          });
          joblistLabel.value = updatedJobList;
        }
      },
    }
  );

  getOperation();

  loadingOverlay.value = false;
};

const getOperation = async () => {
  await useApiFetch("/api/projects/operations/operationList", {
    method: "GET",
    params: {
        operationId: form.InstanceID,
        jobid: props.selectedCustomer,
      },
    onResponse({ response }) {
      if (response.status === 200) {
        console.log("operation is--------", response._data.body);
        weekly.value = response._data.body;
      }
    },
  });
};

const getInventory = async () => {
  loadingOverlay.value = true;
  await useApiFetch(
    `/api/projects/inventoryDetails/${props.selectedCustomer}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("response._data.body", response._data.body);
          const filteredData = response._data.body.filter((item) => {
            return Object.values(item).some((value) => value !== null);
          });
          loadingOverlay.value = false;
          customerExist.value = true;
          tableOfCompletion.value = filteredData;
        }
      },
      onResponseError({}) {
        customerExist.value = false;
      },
    }
  );
  loadingOverlay.value = false;
};

const subCategories = async () => {
  try {
    loadingOverlay.value = true;
    await useApiFetch("/api/projects/subCategory", {
      method: "GET",
      params: {
        subCategory: form.Catagory,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          subCategorielist.value = response._data.body.filter(
            (item) => item !== null
          );
        } else {
          subCategorielist.value = [];
          console.error("Unexpected response status:", response.status);
        }
      },
      onResponseError(error) {
        subCategorielist.value = [];
        console.error("API fetch error:", error);
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    loadingOverlay.value = false;
  }
};

const partDataList = async () => {
  try {
    loadingOverlay.value = true;
    await useApiFetch("/api/projects/parts", {
      method: "GET",
      params: {
        category: form.Catagory,
        subCategory: form.SubCatagory,
      },
      onResponse({ response }) {
        console.log('PartList response===', response._data.body);
        
        if (response.status === 200) {
          partlist.value = response._data.body
            .filter(
              (item) =>
                item !== null &&
                item.model &&
                item.description &&
                item.instanceID
            )
            .map((item) => `${item.model} ${item.description}`);
        } else {
          partlist.value = [];
          console.error("Unexpected response status:", response.status);
        }
        console.log('PartList ===', partlist.value);

      },
      onResponseError(error) {
        partlist.value = [];
        console.error("API fetch error:", error);
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    loadingOverlay.value = false;
  }
};

const filteredData = ref([]);
const productItem = async () => {
  try {
    loadingOverlay.value = true;
    await useApiFetch("/api/projects/projectItem", {
      method: "GET",
      params: {
        category: selectCategoryForList.value,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          filteredData.value = response._data.body
            .filter((item) => item !== null && item !== undefined)
            .map((item) => ({
              label: item.NUMBER,
              value: item.JobID,
            }));
        }
      },
      onResponseError(error) {
        filteredData.value = [];
        console.error("API fetch error:", error);
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    loadingOverlay.value = false;
  }
};

const handleClose = async () => {
  emit("close");
};

const onSubmit = async (event: FormSubmitEvent<any>) => {
  form.PerType = selectedInventory.value;
  form.ProjectType = form.Catagory;
  if (props.selectedCustomer === null) {
    console.log("Post formdata ===========", form);
    await useApiFetch("/api/projects", {
      method: "POST",
      body: form,
      onResponse({ response }) {
        console.log("Post response===========", response);
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
          if (form.JobType === "Sub Assembly") {
            insertInventory();
            AddLinkedJob();
          }
        }
      },
    });
  } else {
    console.log("Put formdata ===========", form);
    await useApiFetch(`/api/projects/${props.selectedCustomer}`, {
      method: "PUT",
      body: form,
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("Edit response===========", response);
          // jobList.value=response._data;
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
          if (form.JobType === "Sub Assembly") {
            insertInventory();
            AddLinkedJob();
          }
        }
      },
    });
  }
  emit("save");
};

const insertInventory = async () => {
  console.log("inventory list value is", tableOfCompletion.value);
  await useApiFetch("/api/projects/insertInventory", {
    method: "POST",
    body: JSON.stringify({
      tableOfCompletion: tableOfCompletion.value,
      selectedCustomer: props.selectedCustomer,
    }),

    onResponse({ response }) {
      console.log("Inventory res--------", response);

      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Inventory inserted successfully!",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
    },
  });
};

const AddLinkedJob = async () => {
  await useApiFetch(`/api/projects/linkedJob/${props.selectedCustomer}`, {
    method: "POST",
    body: JSON.stringify({
      jobData: jobList.value,
      selectedCustomer: props.selectedCustomer,
    }),
    onResponse({ response }) {
      console.log("AddLinkedJob res--------", response);
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
};

const onSelect = async (row) => {
  operation.value = row.uniqueID;

  weekly.value.forEach((item) => {
    item.class = item.uniqueID === operation.value ? "bg-green-400" : "";
  });
  handleRowClick()
};

const handleRowClick = async () => {
  console.log("Row double-clicked:", operation.value);

  try {
    await useApiFetch("/api/projects/operationHour", {
      method: "GET",
      params: {
        operationId: operation.value,
        jobid: props.selectedCustomer,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          employeeHours.value = response._data.body;
          console.log("dd", response._data.body);
          totalHours.value = response._data.body[0]?.totalHour;
          console.log("total hour is", totalHours.value);
        }
      },
    });
  } catch (error) {
    console.error("Error fetching operation hour:", error);
  }
};

const handleRowDoubleClick = () => {
  modalMeta.value.manuFactureModal = true;
};

const deleteOperation = async (row) => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/projects/operations/${row.uniqueID}`, {
    method: "DELETE",

    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
        getOperation();
      }
    },
  });
  loadingOverlay.value = false;
};

const deleteHour = async (row) => {
  console.log("row id in operations", row);
  await useApiFetch(`/api/projects/operations/operation/${row.UID}`, {
    method: "DELETE",
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
    params: {
      UniqueID: row.UID.value,
    },
  });
  handleRowClick();
};

if (props.selectedCustomer !== null) {
  editInit();
  getInventory();
}
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
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound
      :name="'Customer not found'"
      :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'"
    />
  </template>

  <template v-else>
    <UForm :state="form" class="space-y-4" @submit="onSubmit">
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup label="Project#" name="Project#">
            <UInput v-model="form.NUMBER" />
          </UFormGroup>
        </div>

        <div class="basis-1/5">
          <UFormGroup label="Project Qty." name="QUANTITY">
            <UInput v-model="form.QUANTITY" />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="ProjectType" name="PType">
            <UInputMenu v-model="form.JobType" :options="projectTypes" />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="Lastest Cost" name="LCost">
            <UInput v-model="form.Cost" />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="Relieve Inventory Per:" name="RelieveI">
            <UInputMenu v-model="form.PerType" :options="RelieveInventory" />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/2">
          <UFormGroup label="Date Opened" name="DOpened">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(form.DATEOPENED, 'd MMM, yyy')"
                variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                truncate
              />
              <template #panel="{ close }">
                <DatePickerClient
                  v-model="form.DATEOPENED"
                  is-required
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
        <div class="basis-1/2">
          <UFormGroup label="By" name="By">
            <UInputMenu v-model="form.ByEmployee" :options="employeeOptions" />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/2">
          <UFormGroup label="Ready To Produce" name="RTOProduce">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(form.ProductionDate, 'd MMM, yyy')"
                variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                truncate
              />
              <template #panel="{ close }">
                <CommonDatePicker
                  v-model="form.ProductionDate"
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
              v-model="form.ProductionBy"
              :options="employeeOptions"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/2">
          <UFormGroup label="Project Closed" name="PClosed">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(form.DATECLOSED, 'd MMM, yyy')"
                variant="outline"
                :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                truncate
              />
              <template #panel="{ close }">
                <CommonDatePicker
                  v-model="form.DATECLOSED"
                  is-required
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
        <div class="basis-1/2">
          <UFormGroup label="By" name="By">
            <UInputMenu v-model="form.ClosedBy" :options="employeeOptions" />
          </UFormGroup>
        </div>
      </div>

      <div v-if="form.JobType === 'Sub Assembly'">
        <UTabs :items="items" class="w-full">
          <template #item="{ item }">
            <div v-if="item.key === 'sub'" class="Category">
              <div class="flex flex-row space-x-2">
                <UFormGroup label="Category" class="basis-1/2" name="Category">
                  <UInputMenu
                    @change="subCategories"
                    v-model="form.Catagory"
                    :options="category"
                  />
                </UFormGroup>
                <UFormGroup
                  label="Sub Category"
                  class="basis-1/2"
                  name="Sub Category"
                >
                  <UInputMenu
                    :options="subCategorielist"
                    v-model="form.SubCatagory"
                    @change="partDataList"
                  />
                </UFormGroup>
              </div>
              <UFormGroup label="Part" name="Part" class="mt-2">
                <UInputMenu :options="partlist" v-model="form.PART" />
              </UFormGroup>
              <div class="grid grid-cols-1 mt-6 h-48">
                <UTable :rows="tableOfCompletion" :columns="columns" />
              </div>
              <div class="flex flex-row space-x-2 mt-2">
                <UFormGroup label="Qty" class="basis-1/3" name="Qty">
                  <UInput v-model="newEntry.Quantity" />
                </UFormGroup>
                <div class="mt-6">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="format(newEntry.dateEntered, 'd MMM, yyy')"
                      variant="outline"
                      :ui="{
                        base: 'w-full',
                        truncate: 'flex justify-center w-full',
                      }"
                      truncate
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="newEntry.dateEntered"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </div>

                <div class="basis-1/3 mt-6">
                  <UButton
                    color="cyan"
                    variant="outline"
                    icon="i-heroicons-pencil-square"
                    label="Put into Inventory"
                    @click="addInventory()"
                  />
                </div>
              </div>
            </div>
            <div
              v-else-if="
                item.key === 'Operation' && props.selectedCustomer !== null
              "
              class="space-y-3"
            >
              <div class="grid grid-cols-1 mt-6">
                <UTable
                  :rows="weekly"
                  :columns="gridMeta.defaultColumns"
                  @select="onSelect"
                  @dblclick="handleRowDoubleClick"
                  class="h-60"
                >
                  <template #delete-data="{ row }">
                    <UTooltip text="Delete" class="flex justify-center">
                      <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        @click="deleteOperation(row)"
                      />
                    </UTooltip>
                  </template>
                </UTable>
              </div>
              <div class="flex flex-row space-x-4 mt-2">
                <div class="grid grid-cols-1 mt-6 basis-1/2">
                  <h2 class="font-medium">
                    Employee Hours For Selected Operation
                  </h2>
                  <UTable
                    :rows="employeeHours"
                    :columns="gridMeta1.defaultColumns"
                    class="h-60"
                  >
                    <template #delete-data="{ row }">
                      <UTooltip text="Delete" class="flex justify-center">
                        <UButton
                          color="gray"
                          variant="ghost"
                          icon="i-heroicons-trash"
                          @click="deleteHour(row)"
                        />
                      </UTooltip>
                    </template>
                  </UTable>

                  <h1 class="mt-5 flex justify-end mr-2 font-bold">
                    Total Hours: {{ totalHours }}
                  </h1>
                </div>
                <div class="basis-1/2">
                  <div class="flex flex-row mt-6">
                    <div class="basis-1/2">
                      <h2 class="font-medium">Rework</h2>

                      <UTooltip text="Edit">
                        <UButton
                          color="cyan"
                          variant="outline"
                          icon="i-heroicons-pencil-square"
                          label="Rework Parts"
                          @click="onUsed()"
                        />
                      </UTooltip>

                      <UFormGroup label="Hours" name="Hours" class="mt-3">
                        <UInput />
                      </UFormGroup>
                    </div>
                    <div class="mt-3 ml-10">
                      <h2>Rework Cost</h2>
                      <h2>$00</h2>
                    </div>
                  </div>
                  <div class="mt-5 flex justify-center">
                    <UTooltip text="Edit">
                      <UButton
                        color="green"
                        variant="outline"
                        icon="i-heroicons-plus"
                        label="Verify  & Close Operation"
                      />
                    </UTooltip>
                  </div>
                </div>
              </div>
              <div class="flex flex-row">
                <div class="basis-1/2">
                  <h2 class="font-medium">Manage Time Entries</h2>
                  <UTooltip text="Edit">
                    <UButton
                      class="text-[#1c96c5]"
                      variant="outline"
                      icon="i-heroicons-pencil-square"
                      label="Move Selected Entries to Operation:"
                    />
                  </UTooltip>
                </div>
                <div class="basis-1/2">
                  <UFormGroup label="Destination Operation" name="Destination">
                    <UInputMenu />
                  </UFormGroup>
                </div>
              </div>
            </div>
            <div
              v-else-if="item.key === 'project'"
              class="flex flex-row space-x-3"
            >
              <div class="basis-1/2">
                <UTable :rows="joblistLabel" :columns="jobColumns" />
              </div>
              <div class="basis-1/2">
                <div>
                  <UFormGroup
                    label="Category"
                    class="basis-1/2"
                    name="Category"
                  >
                    <UInputMenu
                      @change="productItem"
                      v-model="selectCategoryForList"
                      :options="category"
                    />
                  </UFormGroup>
                </div>

                <div>
                  <UFormGroup
                    label="Project Item"
                    class="basis-1/2 mt-6"
                    name="ProjectItem"
                  >
                    <UInputMenu
                      v-model="selectedProjectItem"
                      :options="filteredData"
                    />
                  </UFormGroup>
                </div>
                <div class="basis-1/2 mt-6">
                  <UButton
                    class="text-[#1c96c5] ml-3"
                    variant="outline"
                    icon="i-heroicons-magnifying-glass"
                    label="Add Job"
                    @click="addJob"
                  />
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>

      <div class="flex justify-end gap-3">
        <UTooltip text="Edit">
          <UButton
            color="red"
            variant="outline"
            :label="!isModal ? 'Go back' : 'Cancel'"
            @click="handleClose"
          />
          <UButton
            class="text-[#1c96c5] ml-3"
            variant="outline"
            icon="i-heroicons-magnifying-glass"
            label="View Instructions"
          />
          <UButton
            class="text-[#1c96c5] ml-3"
            variant="outline"
            icon="i-heroicons-magnifying-glass"
            label="View Parts Listing"
            @click="onPartListing()"
          />
        </UTooltip>
        <UButton color="cyan" variant="outline" type="submit" label="Save" />
      </div>
    </UForm>
  </template>

  <!-- is Part Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsUsed"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-10' },
      width: 'w-[1500px] sm:max-w-9xl',
    }"
  >
    <!-- check this line -->
    <PartsUsed
      :selected-customer="selectedCustomer"
      :operation-ID="operation"
      @close="modalMeta.isPartsUsed = true"
    />
  </UDashboardModal>

  <!-- is Part Listing Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartLisingModalOpen"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1500px] sm:max-w-9xl',
    }"
  >
    <MarketingPartList
      :selectedProduct="selectedCustomer"
      @close="modalMeta.isPartLisingModalOpen = true"
    />
  </UDashboardModal>

  <UDashboardModal
    v-model="modalMeta.manuFactureModal"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-10' },
      width: 'w-[1500px] sm:max-w-9xl',
    }"
  >
    <MarketingManuFactureList
      :selected-customer="selectedCustomer"
      v-model="modalMeta.manuFactureModal"
    />
  </UDashboardModal>
</template>
