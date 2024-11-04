<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderDetailsTable from "./table.vue";
import NewReportModul from "./NewReportComponent.vue";

onMounted(async () => {
  await init();
  await fetchInstrumentData();
  await fetchSubCategoryData();
  await fetchWorkCenterData();
  await fetchWorkCenterData();
  await fetchUserData();
  await fetchUOMListData();
  await fetchCalibrationDataList();
});

const headerFilters = ref({
  subCategoryList: {
    options: [],
  },
  fetchInstrumentDataList: {
    options: [],
  },
  workCenterList: {
    options: [],
  },
  userListList: {
    options: [],
  },
  getAllUOMOption: {
    options: [],
  },
  calibrationList: {
    options: [],
  },

  intervalList: {
    options: [
      {
        label: "6",
        value: "6",
      },
      {
        label: "12",
        value: "12",
      },
      {
        label: "24",
        value: "24",
      },
    ],
  },
});

const toast = useToast();
const modalMeta = ref({
  isSerialModalOpen: false,
  modalTitle: "Serial",
  isNewReportModalOpen: false,
  mainID: "",
});

const openSerialRecord = () => {
  modalMeta.value.modalTitle = "Serial list";
  modalMeta.value.isSerialModalOpen = true;
};

const openNewReport = () => {
  const reportID = handleVModel.value.manValue;
  if (reportID) {
    modalMeta.value.modalTitle = "Report";
    modalMeta.value.isNewReportModalOpen = true;
    modalMeta.value.mainID = reportID;
  } else {
    console.log("manValue is empty, modal will not open.");
  }
};

const emit = defineEmits(["rowSelectedProduct", "selectEco", "close"]);

const props = defineProps({
  isModal: {
    type: [Boolean],
  },
  selectedEmployee: {
    type: Object,
    required: true,
  },
  isPage: {
    type: Boolean,
    default: true,
  },
});

const clearValues = () => {
  handleVModel.value = {
    manValue: "",
    Instrument: "",
    subCategory: "",
    workCenter: "",
    responsible: "",
    dateInService: "",
    manufacturingName: "",
    manufacturingModel: "",
    manufacturingSerial: "",
    required: "",
    interval: "",
    date: "",
    expiresDate: "",
    removeFromService: "",
    Range: "",
    instrumentValue: "",
    numberValue: "",
    subCategory01: "",
    instrumentValue01: "",
    numberValue01: "",
    subCategory02: "",
    instrumentValue02: "",
    numberValue02: "",
    selectedRow: null,
    uniqueId: "",
    location: "",
    serialNo: "",
    type: "",
    nextReqService: "",
    Maintenance: "",
    selectedNoValue: null,
  };
};

const ReturnValueRemove = () => {
  handleVModel.value.removeFromService = "";
};

const uniqueIDP = ref(null);

const handleRowSelected = (row) => {
  console.log("got this value ", row);

  uniqueIDP.value = row.MANO;
  const formatDateRve = (dateString) => {
    if (!dateString) return "";

    try {
      let date;
      if (dateString.includes("/")) {
        const [month, day, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      return dateString;
    } catch (error) {
      console.error("Date formatting error:", error, "for date:", dateString);
      return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      let date;

      if (dateString.includes("T")) {
        date = new Date(dateString);
        return date.toISOString().split("T")[0];
      }

      // Handle format like "1/23/2019 12:00:00 AM"
      if (dateString.includes(":")) {
        date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
      }

      // Handle format like "11/16/2024"
      if (dateString.includes("/")) {
        const [month, day, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      return "";
    } catch (error) {
      console.error("Date formatting error:", error, "for date:", dateString);
      return "";
    }
  };

  const formattedDate = formatDate(row.DATE); // ISO format
  const inserviceDate = formatDate(row.InserviceDate); // MM/DD/YYYY HH:MM:SS AM/PM format
  const requiredDate = formatDate(row.REQUIRED); // MM/DD/YYYY format
  const removedFromService = formatDateRve(row.RemovedFromService);

  handleVModel.value = {
    Instrument: row.PART,
    subCategory: row.SUBCATAGORY,
    workCenter: row.InstLoc || "",
    orderBy: row.ORDEREDBY || "",
    dateInService: inserviceDate, // Changed to use formatted inserviceDate
    manufacturingName: row.MfgName || "",
    manufacturingModel: row.mfgModel || "",
    manufacturingSerial: row.ManSerial || "",
    required: row.CALIBRATIONREQ,
    date: formattedDate,
    expiresDate: requiredDate,
    removeFromService: removedFromService,
    Range: row.Range || "",
    subCategory01: row.Range2 || "",
    subCategory02: row.Range3 || "",
    instrumentValue: row.Tolerance || "",
    instrumentValue01: row.Tolerance2 || "",
    instrumentValue02: row.Tolerance3 || "",
    numberValue: row.UOM || "",
    numberValue01: row.UOM2 || "",
    numberValue02: row.UOM3 || "",
    manValue: row.MANO || "",
    interval: row.TYPE,
  };

  console.log("Final handleVModel:", handleVModel.value);
  onSelectReportMatchData();
};

const closeSerialModal = () => {
  modalMeta.value.isSerialModalOpen = false;
};

const handleRowSelectedSerial = (row) => {
  handleVModel.value.serialNo = row.Serial;
};

const submitForm = async () => {
  const formData = {
    PART: handleVModel.value.Instrument.value,
    SUBCATAGORY: handleVModel.value.subCategory.value,
    InstLoc: handleVModel.value.workCenter.value,
    ORDEREDBY: handleVModel.value.orderBy.value,
    InserviceDate: handleVModel.value.dateInService,
    MfgName: handleVModel.value.manufacturingName,
    mfgModel: handleVModel.value.manufacturingModel,
    ManSerial: handleVModel.value.manufacturingSerial,
    CALIBRATIONREQ: handleVModel.value.required.value,
    DATE: handleVModel.value.date,
    REQUIRED: handleVModel.value.expiresDate,
    RemovedFromService: handleVModel.value.removeFromService,
    Range: handleVModel.value.Range,
    Range2: handleVModel.value.subCategory01,
    Range3: handleVModel.value.subCategory02,
    Tolerance: handleVModel.value.instrumentValue,
    Tolerance2: handleVModel.value.instrumentValue01,
    Tolerance3: handleVModel.value.instrumentValue02,
    UOM: handleVModel.value.numberValue.value,
    UOM2: handleVModel.value.numberValue01.value,
    UOM3: handleVModel.value.numberValue02.value,
    MANO: handleVModel.value.manValue,
    TYPE: handleVModel.value.interval.value,
  };

  try {
 
    const { data, error } = await useFetch(
      "/api/maintenance/calibration/insertData?type=insert01",
      {
        method: "POST",
        body: formData,
      }
    );

    if (error.value) {
      console.error("Error submitting form:", error.value);
      useToast().add({
        title: "Error",
        description: error.value.message || "Failed to save calibration data",
        type: "error",
      });
    } else {
      console.log("Form submitted successfully:", data.value);
      useToast().add({
        title: "Success",
        description: "Calibration data saved successfully",
        type: "success",
      });
      clearValues();
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    useToast().add({
      title: "Error",
      description: "An unexpected error occurred",
      type: "error",
    });
  }
};

const deleteEquipmentTableData = async () => {
  const uniqueId = handleVModel.value.uniqueId;

  if (!uniqueId) {
    toast.add({
      title: "Error",
      description: "Undefine ID. Cannot delete.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
    return;
  }

  await useApiFetch(`/api/maintenance/equipment/deleteData?id=${uniqueId}`, {
    method: "DELETE",
    onResponse({ response }) {
      console.log(response);
      if (response.status === 200) {
        toast.add({
          title: "Successfully Delete",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      } else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    },
  });
};

const init = async () => {};

const inventoryDetailGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "No",
      label: "Report #",
      filterable: true,
    },

    {
      key: "date",
      label: "Date",
    },

    {
      key: "by",
      label: "Calibrated By",
    },
  ],

  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  details: [],
  selectedDetail: null,
  isLoading: false,
});

const onSelectReportMatchData = async () => {
  try {
    const Id = handleVModel.value.manValue;
    if (!Id) {
      console.error("Unique ID is missing");
      return;
    }
    const response = await useApiFetch(
      `/api/maintenance/equipment/getMatchDataById/${Id}`,
      {
        method: "GET",
      }
    );

    if (response && response.status === 200) {
      console.log(response.body);

      inventoryDetailGridMeta.value.details = response.body;
    } else {
      console.error(
        `Error: ${response?.status} - ${
          response?.statusText || "No response text"
        }`
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const handleVModel = ref({
  // Top section fields
  manValue: "",
  Instrument: "",
  subCategory: "",
  workCenter: "",
  orderBy: "",
  responsible:"",
  // Second row fields
  dateInService: "",
  manufacturingName: "",
  manufacturingModel: "",
  manufacturingSerial: "",
  required: "",
  interval: "",
  date: "",
  expiresDate: "",
  removeFromService: "",

  Range: "",
  instrumentValue: "",
  numberValue: "",

  // Right side - Group 2
  subCategory01: "",
  instrumentValue01: "",
  numberValue01: "",
  subCategory02: "",
  instrumentValue02: "",
  numberValue02: "",

  // Additional tracking fields
  selectedRow: null,
  uniqueId: "",
  serialNo: "",
  type: "",
  nextReqService: "",
  Maintenance: "",
  selectedNoValue: null,
});

const onSelect = (row) => {
  console.log(row.No);
  handleVModel.value.selectedNoValue = row.No;
};

const onRemoveReport = async () => {
  if (handleVModel.value.selectedNoValue) {
    const serialNo = handleVModel.value.selectedNoValue;
    await useApiFetch(
      `/api/maintenance/equipment/removeTableData?id=${serialNo}`,
      {
        method: "DELETE",
        onResponse({ response }) {
          if (response.status === 200) {
            toast.add({
              title: "Success",
              description: "Item deleted successfully.",
              icon: "i-heroicons-check-circle",
              color: "green",
            });

            const Id = handleVModel.value.manValue;
            onSelectReportMatchData(Id);
          } else {
            toast.add({
              title: "Error",
              description: "Failed to delete the item.",
              icon: "i-heroicons-exclamation-triangle",
              color: "red",
            });
          }
        },
      }
    );
  } else {
    toast.add({
      title: "",
      description: "Select item to delete.",
      icon: "i-heroicons-exclamation-triangle",
      color: "yellow",
    });
  }
};

const onPrevieOrderBtnClick = () => {
  if (uniqueIDP.value) {
    const queryString = new URLSearchParams({ id: uniqueIDP.value }).toString();
    const fetchData = async (id) => {
      const pdfUrl = `/api/maintenance/equipment/pdf/${id}`;
      try {
        const response = await fetch(pdfUrl);
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch PDF");
        }
        const blob = await response.blob();
        const pdfContentUrl = URL.createObjectURL(blob);
        window.open(pdfContentUrl, "_blank");
      } catch (error) {
        console.error(error);
        alert("Error fetching the PDF. Please try again later.");
      }
    };
    fetchData(uniqueIDP.value);
  } else {
    alert("Unique ID is missing! The function cannot execute.");
  }
};

// new code
const fetchUOMListData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=UOMList"
    );
    if (data._rawValue) {
      headerFilters.value.getAllUOMOption.options = data._rawValue.uomList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchInstrumentData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=instrument"
    );
    if (data._rawValue) {
      headerFilters.value.fetchInstrumentDataList.options =
        data._rawValue.instrumentList.map((category) => ({
          label: category,
          value: category,
        }));
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchCalibrationDataList = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=Calibration"
    );
    if (data._rawValue) {
      headerFilters.value.calibrationList.options = data._rawValue.calList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchSubCategoryData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=subCategory"
    );
    if (data._rawValue) {
      headerFilters.value.subCategoryList.options = data._rawValue.subList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchWorkCenterData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=workCenter"
    );
    if (data._rawValue) {
      // console.log(data._rawValue);
      headerFilters.value.workCenterList.options =
        data._rawValue.workCenter.map((category) => ({
          label: category,
          value: category,
        }));
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchUserData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/calibration/getAllData?type=user"
    );
    if (data._rawValue) {
      headerFilters.value.userListList.options = data._rawValue.userList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};
</script>

<template>
  <OrderDetailsTable
    :is-page="true"
    @row-selected="handleRowSelected"
  />

  <UForm class="space-y-6 pt-2">
    <div class="flex flex-row space-x-6 gmsBlueTitlebar">
      <p class="pl-[10px] py-[10px]">Calibration</p>
    </div>
    <div class="flex flex-row space-x-6 px-[15px]">
      <div class="basis-1/10 max-w-[300px] min-w-[80px]">
        <UFormGroup label="IC#">
          <p
            class="py-[3px] px-[6px] bg-white text-black border border-black rounded-md"
          >
            {{ handleVModel.manValue || 0 }}
          </p>
        </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Sub Category">
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subCategoryList.options"
          />
        </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Instrument">
          <UInputMenu
            v-model="handleVModel.Instrument"
            :options="headerFilters.fetchInstrumentDataList.options"
          />
        </UFormGroup>
      </div>

      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Work Center">
          <UInputMenu
            v-model="handleVModel.workCenter"
            :options="headerFilters.workCenterList.options"
          />
        </UFormGroup>
      </div>

      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="User">
          <UInputMenu
            v-model="handleVModel.orderBy"
            :options="headerFilters.userListList.options"
          />
        </UFormGroup>
      </div>
    </div>
    <div class="flex flex-row space-x-6 px-[15px]">
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Date In Service">
          <UInput
            v-model="handleVModel.dateInService"
            type="date"
            class="w-40"
          />
        </UFormGroup>
      </div>

      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Manufacturing Name">
          <UInput v-model="handleVModel.manufacturingName" />
        </UFormGroup>
      </div>

      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Manufacturing Model#">
          <UInput v-model="handleVModel.manufacturingModel" />
        </UFormGroup>
      </div>

      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Manufacturing Serial #">
          <UInput v-model="handleVModel.manufacturingSerial" />
        </UFormGroup>
      </div>
    </div>

    <div class="flex flex-row space-x-4 px-[15px]">
      <div class="w-1/2">
        <div class="flex flex-row w-full">
          <div class="basis-3/5 mr-4">
            <UFormGroup label="required">
              <UInputMenu
                v-model="handleVModel.required"
                :options="headerFilters.calibrationList.options"
              />
            </UFormGroup>
          </div>

          <div class="basis-3/5 mr-4">
            <UFormGroup label="Intervale">
              <UInputMenu
                v-model="handleVModel.interval"
                :options="headerFilters.intervalList.options"
              />
            </UFormGroup>
          </div>
          <div class="basis-3/5 mr-4">
            <UFormGroup label="Date">
              <UInput v-model="handleVModel.date" type="date" />
            </UFormGroup>
          </div>
          <div class="basis-3/5">
            <UFormGroup label="Expires Date">
              <UInput v-model="handleVModel.expiresDate" type="date" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex flex-row mt-[20px]">
          <div class="basis-1/7 mr-4">
            <UFormGroup label="Date Remove From Serves">
            <UInput
              v-model="handleVModel.removeFromService"
              type="date"
            />
          </UFormGroup>
          </div>
          <div class="basis-3/5 mt-6">
            <UButton
              icon="i-f7-rays"
              label="Return To Service"
              @click="ReturnValueRemove"
              variant="outline"
              color="red"
              truncate
            />
          </div>
        </div>
      </div>

      <div class="w-1/2 pl-[10px]">
        <div class="flex flex-row space-x-2 mt-[10px]">
          <div class="basis-3/2 mr-4 mt-[20px]">
            <h3>1</h3>
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInput label="Range" v-model="handleVModel.Range" />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInput label="Accuracy" v-model="handleVModel.instrumentValue" />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <div class="basis-3/5 max-w-[300px] min-w-[150px]">
              <UInputMenu
                label="Unit Of Measure"
                v-model="handleVModel.numberValue"
                :options="headerFilters.getAllUOMOption.options"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-row space-x-2 pt-[8px]">
          <div class="basis-3/2 mr-4">
            <h3>2</h3>
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInput v-model="handleVModel.subCategory01" />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInput
              v-model="handleVModel.instrumentValue01"
              @change="instrumentFunction01"
            />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInputMenu
              v-model="handleVModel.numberValue01"
              :options="headerFilters.getAllUOMOption.options"
            />
          </div>
        </div>

        <div class="flex flex-row space-x-2 pt-[8px]">
          <div class="basis-3/2 mr-4">
            <h3>3</h3>
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <UInput v-model="handleVModel.subCategory02" />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <UInput v-model="handleVModel.instrumentValue02" />
          </div>
          <div class="basis-3/5 max-w-[300px] min-w-[150px]">
            <UInputMenu
              v-model="handleVModel.numberValue02"
              :options="headerFilters.getAllUOMOption.options"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4 pt-[30px] px-[15px]">
      <UButton
        icon="i-f7-rays"
        label="Clear"
        @click="clearValues"
        variant="outline"
        color="red"
        truncate
      />

      <UButton
        icon="i-heroicons-plus"
        label="Add New"
        variant="outline"
        color="green"
        @click="submitForm"
        truncate
      />

      <UButton
        icon="i-heroicons-pencil-square"
        label="Modify"
        variant="outline"
        color="green"
        @click="submitForm"
        truncate
      />

      <UButton
        color="gray"
        label="Print Label"
        icon="i-heroicons-tag"
        @click="onPrevieOrderBtnClick"
      />
    </div>
  </UForm>

  <div class="flex flex-row space-x-6 gmsBlueTitlebar mt-[20px]">
    <p class="pl-[10px] py-[10px]">Calibration Report</p>
  </div>

  <div class="basis-1/2 pt-[10px] px-[15px]">
    <UTable
      :rows="inventoryDetailGridMeta.details"
      :columns="inventoryDetailGridMeta.defaultColumns"
      :loading="inventoryDetailGridMeta.isLoading"
      class="w-full"
      :ui="{
        th: {
          base: 'sticky top-0 z-10',
          color: 'bg-white dark:text-gray dark:bg-[#111827]',
          padding: 'pl-[15px]',
        },
        td: {
          base: 'h-[31px]',
          padding: 'py-0',
        },
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.',
      }"
      @select="onSelect"
    >
      <template
        v-for="column in inventoryDetailGridMeta.defaultColumns"
        v-slot:[`${column.key}-header`]
      >
        <template v-if="column.kind !== 'actions'">
          <div class="px-1 py-1">
            <CommonSortAndInputFilter
              :label="column.label"
              :sortable="column.sortable"
              :sort-key="column.key"
              :filter-key="column.key"
            />
          </div>
        </template>

        <template v-else class="bg-slate-400">
          <div class="flex justify-center text-center w-[53px]">
            {{ column.label }}
          </div>
        </template>
      </template>

      <template #default="{ rows }">
        <template v-for="row in rows" :key="row.uniqueid">
          <tr
            @click="onSelect(row)"
            :class="{
              'bg-red-500': isSelected(row),
              'hover:bg-gray-200 cursor-pointer': !isSelected(row),
            }"
          >
            <td>
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change.stop="toggleRowSelection(row)"
              />
            </td>
            <td
              v-for="column in inventoryDetailGridMeta.defaultColumns"
              :key="column.key"
            >
              {{ row[column.key] }}
            </td>
          </tr>
        </template>
      </template>
    </UTable>
  </div>

  <div
    class="flex justify-between items-center space-x-4 pt-[10px] my-[20px] px-[15px]"
  >
    <div class="">
      <UButton
        icon="i-heroicons-plus"
        label="Refresh Report"
        variant="outline"
        color="green"
        @click=""
        truncate
      />
    </div>

    <div class="flex space-x-4 ml-auto">
      <UButton
        icon="i-heroicons-plus"
        label="New Report"
        variant="outline"
        color="green"
        @click="openNewReport()"
        truncate
      />

      <UButton
        icon="i-heroicons-minus-circle"
        label="Remove Report"
        variant="outline"
        color="red"
        @click="onRemoveReport"
        truncate
      />
    </div>
  </div>

  <UDashboardModal
    v-model="modalMeta.isSerialModalOpen"
    :title="modalMeta.modalTitle"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: {
        base: 'gap-y-1',
        padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5',
      },
      width: 'w-[3000px] sm:max-w-7xl',
    }"
  >
    <MaterialsSerialsSerialList
      @select="handleRowSelectedSerial"
      @close="closeSerialModal"
    />
  </UDashboardModal>

  <UDashboardModal
    v-model="modalMeta.isNewReportModalOpen"
    :title="modalMeta.modalTitle"
    :ui="{
      title: 'text-sm text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center ',
        padding: 'sm:px-2',
      },
      body: {
        base: '',
        padding: '',
      },
      width: 'w-[3000px] sm:max-w-7xl',
    }"
  >
    <NewReportModul
      @select="handleRowSelectedSerial"
      @close="closeSerialModal"
      :mainID="modalMeta.mainID"
    />
  </UDashboardModal>
</template>
