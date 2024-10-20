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

// const fetchAllTableReport = async () => {
//   try {
//     const { data } = await useFetch(
//       "/api/maintenance/equipment/getAllReportData?type=tableData"
//     );
//     if (data._rawValue) {
//       headerFilters.value.tableData.options = data._rawValue.search1List.map(
//         (category) => ({
//           label: category,
//           value: category,
//         })
//       );
//     } else {
//       console.error("No type data found");
//     }
//   } catch (err) {
//     console.error("Error fetching type data:", err);
//   }
// };

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
const fetchReportTableData = async () => {
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllReportData?type=reportTable"
    );
    if (data._rawValue) {
      headerFilters.value.reportTable.options = data._rawValue.subList.map(
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
  instrument01: {
    label: "Sub Category",
    filter: "subcategory",
    options: [],
  },
  instrument02: {
    label: "Sub Category",
    filter: "subcategory",
    options: [],
  },
  instrument03: {
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
  tableData: {
    label: "Sub Category",
    filter: "PART",
    options: [],
  },
  whereList: {
    label: "Sub Category",
    filter: "TYPE",
    options: [],
  },
  reportTable: {
    label: "Sub Category",
    filter: "TYPE",
    options: [],
  },
  numberValueOp: {
    label: "IC1",
    filter: "IC1",
    options: [],
  },
  numberValueOp01: {
    label: "IC1",
    filter: "IC1",
    options: [],
  },
  numberValueOp02: {
    label: "IC1",
    filter: "IC1",
    options: [],
  },
  numberValueOp03: {
    label: "IC1",
    filter: "IC1",
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
      key: "UOM",
      label: "UOM",
      filterable: true,
    },
    {
      key: "Accuracy",
      label: "Accuracy",
    },
    {
      key: "Applied",
      label: "Applied",
    },
    {
      key: "Reading",
      label: "Reading",
    },
    {
      key: "Status",
      label: "Status",
    },
  ],

  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  details: [],
  selectedDetail: null,
  reportTableData: "",
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
  UomData: "",
  Accuracy: "",
  APPlid: "",
  Reading: "",
  Status: "",

  vendorName: "",
  byValue: "",
  whereValue: "",
  reportComments: "",
  reportCreateData: "",
  subCategory: "",
  subCategory01: "",
  subCategory02: "",
  subCategory03: "",
  instrumentValue: "",
  instrumentValue01: "",
  instrumentValue02: "",
  instrumentValue03: "",
  numberValue: "",
  numberValue01: "",
  numberValue02: "",
  numberValue03: "",
  fileUpload01: null,
  fileUpload02: null,
});



const CreateTable = async () => {
  const formData = {
    ReportID: props.mainID,
    UOM: handleVModel.value.UomData?.value || "",
    Applied: handleVModel.value.Accuracy,
    Reading: handleVModel.value.APPlid,
    Adjusted: handleVModel.value.Reading,
    Min: handleVModel.value.Status,
  };

  try {
    const { data, error } = await useFetch(
      "/api/maintenance/equipment/tableInsertData?type=table",
      {
        method: "POST",
        body: formData,
      }
    );
debugger
    if (error.value) {
      console.log("Form submitted successfully:", data.value);
    } else {
     inventoryDetailGridMeta.value.reportTableData = data._rawValue.body;
      console.log("Form submitted successfully:", data.value);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

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



const fetchDataInstrumentCategory = async () => {
  try {
    const selectedSubCategory = handleVModel.value.subCategory.value;
    console.log("Selected SubCategory:", selectedSubCategory);
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
const fetchDataInstrumentCategory01 = async () => {
  try {
    const selectedSubCategory = handleVModel.value.subCategory01.value;
    console.log("Selected SubCategory:", selectedSubCategory);
    if (!selectedSubCategory) {
      console.error("No subcategory selected");
      return;
    }
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=Search1&subCategory=${selectedSubCategory}`
    );
    if (data._rawValue) {
      headerFilters.value.instrument01.options = data._rawValue.search1List.map(
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
const fetchDataInstrumentCategory02 = async () => {
  try {
    const selectedSubCategory = handleVModel.value.subCategory02.value;
    console.log("Selected SubCategory:", selectedSubCategory);
    if (!selectedSubCategory) {
      console.error("No subcategory selected");
      return;
    }
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=Search1&subCategory=${selectedSubCategory}`
    );
    if (data._rawValue) {
      headerFilters.value.instrument02.options = data._rawValue.search1List.map(
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
const fetchDataInstrumentCategory03 = async () => {
  try {
    const selectedSubCategory = handleVModel.value.subCategory03.value;
    console.log("Selected SubCategory:", selectedSubCategory);
    if (!selectedSubCategory) {
      console.error("No subcategory selected");
      return;
    }
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=Search1&subCategory=${selectedSubCategory}`
    );
    if (data._rawValue) {
      headerFilters.value.instrument03.options = data._rawValue.search1List.map(
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
const instrumentFunction = async (newValue) => {
  try {
    const Value = encodeURIComponent(newValue.value); 
   
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${Value}`
    );
    if (data._rawValue) {
      headerFilters.value.numberValueOp.options =
        data._rawValue.search1List.map((IC1) => ({
          label: IC1,
          value: IC1,
        }));
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};
const instrumentFunction01 = async (newValue) => {

  try {
    const Value = encodeURIComponent(newValue.value);  
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${Value}`
    );
    if (data._rawValue) {
      headerFilters.value.numberValueOp01.options =
        data._rawValue.search1List.map((IC1) => ({
          label: IC1,
          value: IC1,
        }));
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};

const instrumentFunction02 = async (newValue) => {
  try {
    const Value = encodeURIComponent(newValue.value);  

    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${Value}`
    );
    if (data._rawValue) {
      headerFilters.value.numberValueOp02.options =
        data._rawValue.search1List.map((IC1) => ({
          label: IC1,
          value: IC1,
        }));
    } else {
      console.error("No type data found");
    }
  } catch (err) {
    console.error("Error fetching type data:", err);
  }
};
// const instrumentFunction03 = async () => {
//   debugger
//   try {
//     const selectedSubCategory = handleVModel.value.instrumentValue03.value;
//     if (!selectedSubCategory) {
//       console.error("No subcategory selected");
//       return;
//     }
//     const { data } = await useFetch(
//       `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${selectedSubCategory}`
//     );
//     if (data._rawValue) {

//       headerFilters.value.numberValueOp03.options =
//         data._rawValue.search1List.map((IC1) => ({
//           label: IC1,
//           value: IC1,
//         }));
//     } else {
//       console.error("No type data found");
//     }
//   } catch (err) {
//     console.error("Error fetching type data:", err);
//   }
// };

const instrumentFunction03 = async (newValue) => {
  debugger
  const Value = encodeURIComponent(newValue.value);  
  try {
    const {data} = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${Value}`
    );

    console.log("API Response:", data);

    if (data.value) {
      console.log("Search1List:", data.value.search1List);
      headerFilters.value.numberValueOp03.options = data.value.search1List.map((IC1) => ({
        label: IC1,
        value: IC1,
      }));
      console.log("Updated numberValueOp03 options:", headerFilters.value.numberValueOp03.options);
    } else {
      console.error("No data found");
    }
  } catch (err) {
    console.error("Error fetching data:", err);
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
// {{ handleVModel.manValue || 0 }}

const files = ref([null, null, null]);

const handleFileChange = (event, index) => {
  console.log("file", event.target.files[0]);
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    files.value[index] = file;
  } else {
    alert("Please select a PDF file.");
    event.target.value = "";
  }
};

const onSubmit = async (event: FormSubmitEvent<any>) => {
  console.log("files are", files.value);

  // Check if there are any files to upload
  if (!files.value.some(file => file)) {
    console.log('No files to upload.');
    alert('Please upload at least one file.');
    return;
  }

  const formData = new FormData();
  const fileTypes = ['Drawing/Manual', 'PDS', 'SDS'];

  // Loop through files and append only if a file exists
  files.value.forEach((file, index) => {
    if (file) {
      formData.append(fileTypes[index], file);
    }
  });
  try {
    // Replace '/api/upload' with your actual upload endpoint
    const response = await fetch('/api/file', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json(); // Parse the JSON response
      console.log('Files uploaded successfully! Response:', responseData);
      alert('Files uploaded successfully!');

      // You can print individual file details
      responseData.files.forEach(file => {
        console.log(`File uploaded: ${file.originalName}, URL: ${file.url}`);
        if (file.fileType === 'SDS') {
          event.data.sds = file.url;
        }
        if (file.fileType === 'Drawing/Manual') {
          
        }


      });

      files.value = [null, null, null];
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('An error occurred while uploading the files. Please try again.');
  }

};


const CreateReport = async () => {

const formData = {
  ReportID: props.mainID,
  vendorName: handleVModel.value.vendorName?.value || "",
  byValue: handleVModel.value.byValue?.value || "",
  whereValue: handleVModel.value.whereValue?.value || "",
  reportComments: handleVModel.value.reportComments,
  reportCreateData: handleVModel.value.reportCreateData,
  subCategory: handleVModel.value.subCategory?.value || "",
  subCategory01: handleVModel.value.subCategory01?.value || "",
  subCategory02: handleVModel.value.subCategory02?.value || "",
  subCategory03: handleVModel.value.subCategory03?.value || "",
  instrumentValue: handleVModel.value.instrumentValue?.value || "",
  instrumentValue01: handleVModel.value.instrumentValue01?.value || "",
  instrumentValue02: handleVModel.value.instrumentValue02?.value || "",
  instrumentValue03: handleVModel.value.instrumentValue03?.value || "",

  numberValue: handleVModel.value.numberValue?.value || "",
  numberValue01: handleVModel.value.numberValue01?.value || "",
  numberValue02: handleVModel.value.numberValue02?.value || "",
  numberValue03: handleVModel.value.numberValue03?.value || "",

  fileUpload01: handleVModel.value.fileUpload01?.value || "",
  fileUpload02: handleVModel.value.fileUpload02?.value || "",
};

try {
  const { data, error } = await useFetch(
    "/api/maintenance/equipment/tableInsertData?type=newReport",
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
  console.error("Submission error:", err);
}
};


</script>
<template>

    <UForm class="">
      <div class="flex flex-row space-x-6 bg-[#024CAA] py-[10px] text-white">
        <p>Report Details</p>
        
      </div>

      <div class="basis-1/10 max-w-[90px] min-w-[90px] mb-[10px] mt-[10px]">
        <span>#</span>
          <p
            class="mt-[1px] p-[4px] bg-white text-black border border-green-500 rounded-md"
          >
            {{ props.mainID }}
          </p>
        </div>

      <div class="flex flex-row space-x-6">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <h3>Date</h3>
          <UInput
            v-model="handleVModel.reportCreateData"
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

      <div class="flex flex-row space-x-6 mb-[10px] mt-[10px]">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="flex items-center">
            <UFormGroup label="GSI Calibration Procedure" name="SPECSHEET">
              <UInput
                type="file"
                size="sm"
                icon="i-heroicons-folder"
                @change="(e) => handleFileChange(e, 0)"
                accept="application/pdf"
              />
            </UFormGroup>
          </div>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UFormGroup label="Third Party Report" name="PDS">
            <UInput
              type="file"
              size="sm"
              icon="i-heroicons-folder"
              @change="(e) => handleFileChange(e, 1)"
              accept="application/pdf"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="w-full mb-[10px] mt-[10px]">
        <div class="basis-1/2 w-[480px]">
          <h3>Comments</h3>
          <textarea
            v-model="handleVModel.reportComments"
            placeholder="Enter details"
            rows="3"
            class="border py-6 px-4 rounded w-full leading-[10px]"
          >
          </textarea>
        </div>
      </div>

      <div class="flex flex-row space-x-2 mt-[10px]">
        <div class="basis-3/2 mr-4 mt-[20px]">
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
            @change="instrumentFunction"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <h3>IC#</h3>
            <UInputMenu
              v-model="handleVModel.numberValue"
              :options="headerFilters.numberValueOp.options"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>2</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.subCategory01"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory01"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.instrumentValue01"
            :options="headerFilters.instrument01.options"
            @change="instrumentFunction01"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <UInputMenu
              v-model="handleVModel.numberValue01"
              :options="headerFilters.numberValueOp01.options"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>3</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.subCategory02"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory02"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.instrumentValue02"
            :options="headerFilters.instrument02.options"
            @change="instrumentFunction02"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <UInputMenu
              v-model="handleVModel.numberValue02"
              :options="headerFilters.numberValueOp02.options"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="basis-3/2 mr-4">
          <h3>4</h3>
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.subCategory03"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory03"
          />
        </div>

        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UInputMenu
            v-model="handleVModel.instrumentValue03"
            :options="headerFilters.instrument03.options"
            @change="instrumentFunction03"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
            <UInputMenu
              v-model="handleVModel.numberValue03"
              :options="headerFilters.numberValueOp03.options"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-2 pt-[50px]">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
 
          <UInputMenu
            v-model="handleVModel.UomData"
            :options="headerFilters.UOMLIST.options"
          />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
     
          <UInput v-model="handleVModel.Accuracy" />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
    
          <UInput v-model="handleVModel.APPlid" />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
 
          <UInput v-model="handleVModel.Reading" />
        </div>
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
      
          <UInput v-model="handleVModel.Status" />
        </div>

        <div class="basis-3/7 ">
          <UButton
            icon="i-heroicons-plus"
            variant="outline"
            color="green"
            @click="CreateTable"
          />
        </div>

        <div class="basis-3/9 ">
          <UButton
            icon="i-heroicons-minus-circle"
            variant="outline"
            color="red"
           
          />
        </div>
      </div>

      <!-- 
      <UTable
        :rows="inventoryDetailGridMeta.reportTableData"
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
      </UTable> -->

      
      <UTable
        :rows="inventoryDetailGridMeta.reportTableData"
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

   
 

  <div class="flex justify-end space-x-4 pt-[10px]">
    <div class="basis-1/6">
      <UButton
        icon="i-heroicons-plus"
        label="New Report"
        variant="outline"
        color="green"
        :ui="{
          base: 'min-w-[200px] w-full',
          truncate: 'flex justify-center w-full',
        }"
        truncate
        @click="CreateReport"
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
