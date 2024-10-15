<script setup lang="ts">
import { ref, onMounted } from "vue";
import VendorsPageModule from "../../../pages/materials/vendors.vue";

onMounted(async () => {
  await init();
  await fetchAllByDataReport();
  await fetchAllWhereDataReport();
  await fetchAllCategoryList();
   await fetchAllUOMList();

});
const emit = defineEmits(["rowSelectedProduct", "selectEco", "close"]);

const props = defineProps({
  isModal: {
    type: [Boolean],
  },

  isPage: {
    type: Boolean,
    default: true,
  },
  mainID: {
    type: String, 
    required: true,
  },
});

console.log(props.mainID); 

const fetchAllByDataReport = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllReportData?type=by"
    );
    if (data._rawValue) {
      headerFilters.value.byList.options = data._rawValue.equipmentList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};

const fetchAllWhereDataReport = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllReportData?type=where"
    );
    if (data._rawValue) {
      headerFilters.value.whereList.options = data._rawValue.whereList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};



const fetchAllCategoryList = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllReportData?type=sub1"
    );
    if (data._rawValue) {
      headerFilters.value.subList.options = data._rawValue.subList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};

const fetchAllUOMList = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllReportData?type=UOM"
    );
    if (data._rawValue) {
      headerFilters.value.UOMLIST.options = data._rawValue.uomList.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};
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
  UOMLIST: {
    label: "Category",
    filter: "Category",
    options: [],
  },
  
  instrument: {
    label: "Sub Category",
    filter: "subcategory",
    options: [],
  },
  subList: {
    label: "Sub Category",
    filter: "PART",
    options: [],
  },
  byList: {
    label: "Sub Category",
    filter: "PART",
    options: [],
  },
  whereList: {
    label: "Sub Category",
    filter: "TYPE",
    options: [],
  },
});

const toast = useToast();

const modalMeta = ref({
  isSerialModalOpen: false,
  modalTitle: "Serial",
  isNewReportModalOpen: false,
  isNewVendorsModalOpen: false,
});

const openVendorRecord = () => {
  modalMeta.value.modalTitle = "Vendor";
  modalMeta.value.isNewVendorsModalOpen = true;
};

const openNewReport = () => {
  modalMeta.value.modalTitle = "New Report";
  modalMeta.value.isNewReportModalOpen = true;
};



//  const clearValues = () => {
//    handleVModel.value = {
//      uniqueId: "",
//      manValue: "",
//      category: "",
//      subCategory: "",
//      equipment: "",
//      serialNo: "",
//      type: "",
//      location: "",
//      responsible: "",
//      dateInService: "",
//      nextReqService: "",
//      Maintenance: "",
//    };
//  };

//  const handleRowSelected = (row) => {
//    console.log("Function OK", row);

//    // Function to format date to YYYY-MM-DD
//    const formatDateToYYYYMMDD = (dateString) => {
//      const dateParts = dateString.split("/");
//      return `${dateParts[2]}-${dateParts[0].padStart(
//        2,
//        "0"
//      )}-${dateParts[1].padStart(2, "0")}`;
//    };
//    const requiredDate = row.REQUIRED
//      ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
//      : "";
//    const dataData = row.DATE
//      ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
//      : "";

//    handleVModel.value = {
//      uniqueId: row.UniqueID || "",
//      manValue: row.MANO || "",
//      category: row.CATAGORY || "",
//      subCategory: row.SUBCATAGORY || "",
//      equipment: row.PART || "",
//      serialNo: row.SERIAL || "",
//      type: row.TYPE || "",
//      location: row.LOCATION || "",
//      responsible: row.ORDEREDBY || "",
//      dateInService: dataData,
//      nextReqService: requiredDate,
//      Maintenance: row.MAINTAINANCE,
//    };

//    onSelectReportMatchData();
//  };

const closeVendorsModal = () => {
  modalMeta.value.isNewVendorsModalOpen = false;
};

const handleRowSelectVendors = (row) => {
  console.log(row);
  handleVModel.value.vendorName = row.NAME;

};

//  const submitForm = async () => {
//    const formData = {
//      CATAGORY: handleVModel.value.category,
//      SUBCATAGORY: handleVModel.value.subCategory,
//      PART: handleVModel.value.equipment,
//      SERIAL: handleVModel.value.serialNo,
//      TYPE: handleVModel.value.type,
//      LOCATION: handleVModel.value.location,
//      ORDEREDBY: handleVModel.value.responsible,
//      DATE: handleVModel.value.dateInService,
//      REQUIRED: handleVModel.value.nextReqService,
//      MANO: handleVModel.value.manValue,
//      MAINTAINANCE: handleVModel.value.Maintenance,
//    };

//    try {
//      const { data, error } = await useFetch(
//        "/api/maintenance/equipment/insertData",
//        {
//          method: "POST",
//          body: formData,
//        }
//      );

//      if (error.value) {
//        console.error("Error submitting form:", error.value);
//      } else {
//        console.log("Form submitted successfully:", data.value);
//      }
//    } catch (err) {
//      console.error("Unexpected error:", err);
//    }
//  };

//  const deleteEquipmentTableData = async () => {
//    const uniqueId = handleVModel.value.uniqueId;

//    if (!uniqueId) {
//      toast.add({
//        title: "Error",
//        description: "Undefine ID. Cannot delete.",
//        icon: "i-heroicons-exclamation-circle",
//        color: "red",
//      });
//      return;
//    }

//    await useApiFetch(`/api/maintenance/equipment/deleteData?id=${uniqueId}`, {
//      method: "DELETE",
//      onResponse({ response }) {
//        console.log(response);
//        if (response.status === 200) {
//          toast.add({
//            title: "Successfully Delete",
//            description: response._data.message,
//            icon: "i-heroicons-check-circle",
//            color: "green",
//          });
//        } else {
//          toast.add({
//            title: "Failed",
//            description: response._data.message,
//            icon: "i-heroicons-x-circle",
//            color: "red",
//          });
//        }
//      },
//    });
//  };

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

//  const onSelectReportMatchData = async () => {
//    try {
//      const Id = handleVModel.value.uniqueId;
//      if (!Id) {
//        console.error("Unique ID is missing");
//        return;
//      }
//      const response = await useApiFetch(
//        `/api/maintenance/equipment/getMatchDataById/${Id}`,
//        {
//          method: "GET",
//        }
//      );

//      if (response && response.status === 200) {
//        inventoryDetailGridMeta.value.details = response.body;
//      } else {
//        console.error(
//          `Error: ${response?.status} - ${
//            response?.statusText || "No response text"
//          }`
//        );
//      }
//    } catch (error) {
//      console.error("Error fetching data:", error.message);
//    }
//  };

const handleVModel = ref({
  byValue: "",
  whereValue: "",
  numberValue: "",
  UomData:"",
  Accuracy:"",
  APPlid:"",
  Reading:"",
  Status:"",
  vendorName:"",




  selectedRow: null,
  uniqueId: "",
  manValue: "",
  category: "",
  subCategory: "",
  instrumentValue: "",
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

const calibrationProcedureInput = ref(null);
const thirdPartyReportInput = ref(null);
const calibrationProcedureFile = ref(null);
const thirdPartyReportFile = ref(null);

const triggerFileUpload = (inputType) => {
  if (inputType === "calibrationProcedure") {
    calibrationProcedureInput.value.click();
  } else if (inputType === "thirdPartyReport") {
    thirdPartyReportInput.value.click();
  }
};

const handleFileUpload = (fileType, event) => {
  const file = event.target.files[0];
  if (file) {
    if (fileType === "calibrationProcedure") {
      calibrationProcedureFile.value = file;
    } else if (fileType === "thirdPartyReport") {
      thirdPartyReportFile.value = file;
    }
    // You can add additional logic here, such as uploading the file to a server
    console.log(`File selected for ${fileType}:`, file.name);
  }
};
const fetchDataInstrumentCategory = async () => {
  debugger;
  try {
    const selectedSubCategory = handleVModel.value.subCategory.value; // Ensure this is correct
    console.log("Selected SubCategory:", selectedSubCategory); // Log it here
    if (!selectedSubCategory) {
      console.error("No subcategory selected");
      return;
    }
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=Search1&subCategory=${selectedSubCategory}`
    );
    if (data._rawValue) {
      headerFilters.value.instrument.options = data._rawValue.search1List.map(
        (category) => ({
          label: category,
          value: category,
        })
      );
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};

// const fetchDataInstrumentCategory = async () => {
//   try {
//     const selectedSubCategory = handleVModel.value.subCategory.value;
//     debugger
//     if (!selectedSubCategory) {
//       console.error('No subcategory selected');
//       return;
//     }
//     const { data} = await useFetch(`/api/maintenance/equipment/getAllReportData?type=Search1&subCategory=${selectedSubCategory}`);
//     if (data._rawValue) {
//       headerFilters.value.instrument.options = data._rawValue.search1List.map((category) => ({
//         label: category,
//         value: category,
//       }));
//     } else {
//       console.error("No type data found");
//     }
//   } catch (err) {
//     console.error("Error fetching type data:", err);
//   }
// };
</script>
<template>
  <UCard class="mb-6">
    <UForm class="space-y-6">
      <div class="flex flex-row space-x-6 bg-green-100">
        <p>Maintenance Order</p>
        <div class="basis-1/10 max-w-[300px] min-w-[150px]">
          <p
            class="mt-[15px] p-[7px] bg-white text-black border border-green-500 rounded-md"
          >
          {{manID}}
            <!-- {{ handleVModel.manValue || 0 }} -->
          </p>
        </div>
      </div>

      <div class="flex flex-row space-x-6">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Date</h3>
          <UInput
            v-model="handleVModel.nextReqService"
            type="date"
            class="w-40"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>By</h3>
          <UInputMenu
            v-model="handleVModel.byValue"
            :options="headerFilters.byList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Where</h3>
          <UInputMenu
            v-model="handleVModel.whereValue"
            :options="headerFilters.whereList.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="flex items-center mt-5">
            <UButton
              @click="openVendorRecord()"
              class="px-2 py-[10px] text-white bg-sky-700 hover:bg-sky-800 h-full flex justify-center items-center"
            >
              Vendor
            </UButton>
            <input
              v-model="handleVModel.vendorName"
              class="border-2 border-black-500 focus:ring-0 p-2 w-full rounded-[5px]"
              placeholder="Enter text"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-6">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>GSI Calibration Procedure</h3>
          <div class="flex items-center">
            <input
              type="file"
              @change="handleFileUpload('calibrationProcedure', $event)"
              class="hidden"
              ref="calibrationProcedureInput"
            />
            <UButton
              @click="triggerFileUpload('calibrationProcedure')"
              class="px-2 py-[10px] text-white bg-sky-700 hover:bg-sky-800 h-full flex justify-center items-center"
            >
              Choose File
            </UButton>
            <span class="ml-2">{{
              calibrationProcedureFile
                ? calibrationProcedureFile.name
                : "No file chosen"
            }}</span>
          </div>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Third Party Report</h3>
          <div class="flex items-center">
            <input
              type="file"
              @change="handleFileUpload('thirdPartyReport', $event)"
              class="hidden"
              ref="thirdPartyReportInput"
            />
            <UButton
              @click="triggerFileUpload('thirdPartyReport')"
              class="px-2 py-[10px] text-white bg-sky-700 hover:bg-sky-800 h-full flex justify-center items-center"
            >
              Choose File
            </UButton>
            <span class="ml-2">{{
              thirdPartyReportFile
                ? thirdPartyReportFile.name
                : "No file chosen"
            }}</span>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="basis-1/2 w-[480px]">
          <h3>Comments</h3>
          <textarea
            v-model="handleVModel.Maintenance"
            placeholder="Enter details"
            rows="3"
            class="border py-6 px-4 rounded w-full leading-[10px]"
          >
          </textarea>
        </div>
      </div>

      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>1</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Sub Category</h3>
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Instrument</h3>
          <UInputMenu
            v-model="handleVModel.instrumentValue"
            :options="headerFilters.instrument.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <h3>IC#</h3>
            <UInputMenu v-model="handleVModel.numberValue" />
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>2</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
      
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
     
          <UInputMenu
            v-model="handleVModel.instrumentValue"
            :options="headerFilters.instrument.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
           
            <UInputMenu v-model="handleVModel.numberValue" />
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>3</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
    
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
   
          <UInputMenu
            v-model="handleVModel.instrumentValue"
            :options="headerFilters.instrument.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          
            <UInputMenu v-model="handleVModel.numberValue" />
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>4</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
  
          <UInputMenu
            v-model="handleVModel.instrumentValue"
            :options="headerFilters.instrument.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        
            <UInputMenu v-model="handleVModel.numberValue" />
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-2 pt-[50px]">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>UOM</h3>
          <UInputMenu
            v-model="handleVModel.UomData"
            :options="headerFilters.UOMLIST.options"
          
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Accuracy</h3>
          <UInput v-model="handleVModel.Accuracy"/>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>APPlid</h3>
          <UInput v-model="handleVModel.APPlid"/>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Reading</h3>
          <UInput v-model="handleVModel.Reading"/>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Status</h3>
          <UInput v-model="handleVModel.Status" />
        </div>
   
          <div class="basis-3/7  mt-5">
            <UButton
        icon="i-heroicons-plus"
        variant="outline"
        color="green"
   
      />
          </div>
          
            <div class="basis-3/9 mt-5">
              <UButton
                icon="i-heroicons-minus-circle"
                variant="outline"
                color="red"
              />
          
          </div>
        </div>
     
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

      <UDivider />
    </UForm>
  </UCard>

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

  </div>

  <UDashboardModal
    v-model="modalMeta.isNewVendorsModalOpen"
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
    <VendorsPageModule
      @handleSelect="handleRowSelectVendors"
      @close="closeVendorsModal"
    />
  </UDashboardModal>
</template>
