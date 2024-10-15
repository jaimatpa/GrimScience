<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderDetailsTable from "./table.vue";
import NewReportModul from "./NewReportComponent.vue"



onMounted(async () => {
  await init();
  await fetchCategoryData(); 
  await fetchSubCategoryData();
  await fetchEquipmentList();
  await fetchEmployeeData();
  await fetchAllTypeList();
});

const headerFilters = ref({
  productLines: {
    label: "Product Line",
    filter: "PRODUCT",
    api: "/api/materials/productlines",
    options: [],
  },
  categoryList: {
    label: "Category",
    filter: "Category",
    options: [],
  },
  subCategoryList: {
    label: "Sub Category",
    filter: "subcategory",
    options: [],
  },
  equipmentList: {
    label: "Sub Category",
    filter: "PART",
    options: [],
  },
  employeeList: {
    label: "Sub Category",
    filter: "PART",
    options: [],
  },
  typeList: {
    label: "Sub Category",
    filter: "TYPE",
    options: [],
  },
});

const toast = useToast();

const modalMeta = ref({
  isSerialModalOpen: false,
  modalTitle: "Serial",
  isNewReportModalOpen:false,
  mainID:""
  
});

const openSerialRecord = () => {
  modalMeta.value.modalTitle = "Serial list";
  modalMeta.value.isSerialModalOpen = true;
};



const openNewReport = () => {
  const reportID = handleVModel.value.manValue
  if (reportID) { 

    modalMeta.value.modalTitle = "New Report";
    modalMeta.value.isNewReportModalOpen = true;
    modalMeta.value.mainID = reportID;
  } else {
    console.log("manValue is empty, modal will not open.");
  }
};

const fetchEmployeeData = async () => {
  try {
    const { data, error } = await useFetch(
      "/api/engineering/changeorder/getEmploy"
    );

    if (data.value?.body) {
      headerFilters.value.employeeList.options = data.value.body.map(
        (employee) => ({
          label: `${employee.fname} ${employee.lname}`,
          value: employee.fname,
        })
      );
    } else {
      console.error("No employee data found");
    }

    if (error.value) {
      console.error("Error fetching employee data:", error.value);
    }
  } catch (err) {
    console.error("Error fetching employee data:", err);
  }
};

const fetchEquipmentList = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllEquipment"
    );
    if (data._rawValue) {
      headerFilters.value.equipmentList.options = data._rawValue.map(
        (category) => ({
          label: category || "Unnamed",
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

const fetchAllTypeList = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllTypeList"
    );
    if (data._rawValue) {
      headerFilters.value.typeList.options = data._rawValue.map((category) => ({
        label: category || "Unnamed",
        value: category,
      }));
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const fetchCategoryData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllCategory"
    );
    if (data._rawValue) {
      headerFilters.value.categoryList.options = data._rawValue.map(
        (category) => ({
          label: category || "Unnamed", // If category is a string
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
      "/api/maintenance/equipment/getAllSubCategory"
    );
    if (data._rawValue) {
      // Assuming `data.value.body` is an array of categories (strings or objects)
      headerFilters.value.subCategoryList.options = data._rawValue.map(
        (category) => ({
          label: category || "Unnamed", // If category is a string
          value: category, // If category is a string
        })
      );
    } else {
      console.error("No category data found");
    }
  } catch (err) {
    console.error("Error fetching category data:", err);
  }
};

const onPrevieOrderBtnClick = () => {
  if (uniqueIDP.value) {
    const queryString = new URLSearchParams({ id: uniqueIDP.value }).toString();
    const fetchData = async (id) => {
      const pdfUrl = `/api/engineering/changeorder/pdf/${id}`;
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
    uniqueId: "",
    manValue: "",
    category: "",
    subCategory: "",
    equipment: "",
    serialNo: "",
    type: "",
    location: "",
    responsible: "",
    dateInService: "",
    nextReqService: "",
    Maintenance: "",
  };
};

const handleRowSelected = (row) => {
  // Function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (dateString) => {
    const dateParts = dateString.split("/");
    return `${dateParts[2]}-${dateParts[0].padStart(
      2,
      "0"
    )}-${dateParts[1].padStart(2, "0")}`;
  };
  const requiredDate = row.REQUIRED
    ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
    : "";
  const dataData = row.DATE
    ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
    : "";

  handleVModel.value = {
    uniqueId: row.UniqueID || "",
    manValue: row.MANO || "",
    category: row.CATAGORY || "",
    subCategory: row.SUBCATAGORY || "",
    equipment: row.PART || "",
    serialNo: row.SERIAL || "",
    type: row.TYPE || "",
    location: row.LOCATION || "",
    responsible: row.ORDEREDBY || "",
    dateInService: dataData,
    nextReqService: requiredDate,
    Maintenance: row.MAINTAINANCE,
  };

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
    CATAGORY: handleVModel.value.category,
    SUBCATAGORY: handleVModel.value.subCategory,
    PART: handleVModel.value.equipment,
    SERIAL: handleVModel.value.serialNo,
    TYPE: handleVModel.value.type,
    LOCATION: handleVModel.value.location,
    ORDEREDBY: handleVModel.value.responsible,
    DATE: handleVModel.value.dateInService,
    REQUIRED: handleVModel.value.nextReqService,
    MANO: handleVModel.value.manValue,
    MAINTAINANCE: handleVModel.value.Maintenance,
  };

  try {
    const { data, error } = await useFetch(
      "/api/maintenance/equipment/insertData",
      {
        method: "POST",
        body: formData,
      }
    );

    if (error.value) {
      console.error("Error submitting form:", error.value);
    } else {
      console.log("Form submitted successfully:", data.value);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
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
      label: "Report",
      filterable: true,
    },

    {
      key: "date",
      label: "Date",
    },

    {
      key: "by",
      label: "By",
    },
    {
      key: "",
      label: "Report#",
    },
    {
      key: "",
      label: "Date",
    },
    {
      key: "",
      label: "MaintenanceBy",
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
    const Id = handleVModel.value.uniqueId;
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
      console.log(response.body)
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
  selectedRow: null,
  uniqueId: "",
  manValue: "",
  category: "",
  subCategory: "",
  equipment: "",
  serialNo: "",
  type: "",
  location: "",
  responsible: "",
  dateInService: "",
  nextReqService: "",
  Maintenance: "",
  selectedNoValue: null,
});

const onSelect = (row) => {
  console.log(row.No)
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

// const isSelected = (row) => {
//   return selectedRow.value && selectedRow.value.uniqueid === row.uniqueid;

// }

//   MANO: null,
//   CATAGORY: null,
//   SUBCATAGORY: null,
//   PART: null,
//   ORDEREDBY: null,
//   SERIAL: null,
//   REQUIRED: null,
// });
</script>
<template>
  <OrderDetailsTable
    :is-page="true"
    @row-selected="handleRowSelected"
    :shouldRefresh="shouldRefresh"
  />

  <UCard class="mb-6">
    <UForm class="space-y-6">
      <div class="flex flex-row space-x-6 bg-green-100">
        <p>Maintenance Order</p>
        <div class="basis-1/10 max-w-[300px] min-w-[150px]">
          <p
            class="mt-[15px] p-[7px] bg-white text-black border border-green-500 rounded-md"
          >
            {{ handleVModel.manValue || 0 }}
          </p>
        </div>
      </div>
      <div class="flex flex-row space-x-6">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Category</h3>
          <UInputMenu
            v-model="handleVModel.category"
            :options="headerFilters.categoryList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Sub Category</h3>
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subCategoryList.options"
          />
        </div>

        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Equipment</h3>
          <UInputMenu
            v-model="handleVModel.equipment"
            :options="headerFilters.equipmentList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="flex items-center mt-5">
            <UButton
              @click="openSerialRecord()"
              class="px-2 py-[10px] text-white bg-sky-700 hover:bg-sky-800 h-full flex justify-center items-center"
            >
              SN
            </UButton>
            <input
              v-model="handleVModel.serialNo"
              class="border-2 border-black-500 focus:ring-0 p-2 w-full rounded-[5px]"
              placeholder="Enter text"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-6">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Type</h3>
          <UInputMenu
            v-model="handleVModel.type"
            :options="headerFilters.typeList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Location</h3>
          <input
            v-model="handleVModel.location"
            class="border-2 border-black-500 focus:ring-0 p-2 w-full rounded-[5px]"
            placeholder="Enter text"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Responsible</h3>
          <UInputMenu
            v-model="handleVModel.responsible"
            :options="headerFilters.employeeList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Date In Service</h3>
          <UInput
            v-model="handleVModel.dateInService"
            type="date"
            class="w-40"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Next Req. Service</h3>
          <UInput
            v-model="handleVModel.nextReqService"
            type="date"
            class="w-40"
          />
        </div>
      </div>
      <div class="w-full">
        <div class="basis-1/2 w-[480px]">
          <h3>Maintenance</h3>
          <textarea
            v-model="handleVModel.Maintenance"
            placeholder="Enter details"
            rows="3"
            class="border py-6 px-4 rounded w-full leading-[10px]"
          >
          </textarea>
        </div>
      </div>

      <div class="flex flex-row space-x-4">
        <div class="w-3/4 flex flex-col"></div>
      </div>

      <div class="flex justify-end space-x-4">
        <div class="basis-1/6 w-full">
          <UButton
            icon="i-heroicons-plus"
            label="Add/Save"
            variant="outline"
            color="green"
            @click="submitForm"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>

        <div class="basis-1/6 w-full">
          <UButton
            icon="i-heroicons-minus-circle"
            label="Delete"
            variant="outline"
            color="red"
            @click="deleteEquipmentTableData"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
        <div class="basis-1/6 w-full">
          <UButton
            icon="i-f7-rays"
            label="Clear"
            @click="clearValues"
            variant="outline"
            color="red"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            truncate
          />
        </div>
        <div>
          <UButton
            class="px-[30px]"
            color="gray"
            label="Preview"
            icon="i-heroicons-eye"
            @click="onPrevieOrderBtnClick"
          />
        </div>
      </div>
      <UDivider />
    </UForm>
  </UCard>
  <div class="basis-1/2">
    <UTable
      :rows="inventoryDetailGridMeta.details"
      :columns="inventoryDetailGridMeta.defaultColumns"
      :loading="inventoryDetailGridMeta.isLoading"
      class="w-full"
      :ui="{
        wrapper:
          'overflow-y-auto h-60 border-2 border-gray-300 dark:border-gray-700',
        divide: 'divide-gray-200 dark:divide-gray-800',
        th: {
          base: 'sticky top-0 z-10',
          color: 'bg-white dark:text-gray dark:bg-[#111827]',
          padding: 'p-0',
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


  <div class="flex justify-end space-x-4 pt-[10px]">
    <div class="basis-1/6">
      <UButton
        icon="i-heroicons-plus"
        label="New Report"
        variant="outline"
        color="green"
        @click="openNewReport()"
        :ui="{
          base: 'min-w-[200px] w-full',
          truncate: 'flex justify-center w-full',
        }"
        truncate
      />
    </div>



    <div class="basis-1/6">
    <UButton
      icon="i-heroicons-minus-circle"
      label="Remove Report"
      variant="outline"
      color="red"
      :ui="{
        base: 'min-w-[200px] w-full',
        truncate: 'flex justify-center w-full',
      }"
      truncate
      @click="onRemoveReport"
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
    :mainID="modalMeta.mainID"
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

    <NewReportModul
     @select="handleRowSelectedSerial"
     @close="closeSerialModal"
    />
  </UDashboardModal>
</template>
