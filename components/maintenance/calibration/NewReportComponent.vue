<script setup lang="ts">
import { ref, onMounted } from "vue";
import VendorsPageModule from "../../../pages/materials/vendors.vue";

onMounted(async () => {
  await init();
  await fetchAllByDataReport();
  await fetchAllWhereDataReport();
  await fetchAllCategoryList();
  await fetchUOMListData();
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

  getAllUOMOption: {
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

const closeVendorsModal = () => {
  modalMeta.value.isNewVendorsModalOpen = false;
};

const handleRowSelectVendors = (row) => {
  console.log(row);
  handleVModel.value.vendorName = row.NAME;
};

const init = async () => {};

const inventoryDetailGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "UOM",
      label: "UOM",
      filterable: true,
    },
    {
      key: "Applied",
      label: "Accuracy",
    },
    {
      key: "Reading",
      label: "Applied",
    },
    {
      key: "Adjusted",
      label: "Reading",
    },
    {
      key: "Min",
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
  SPECSHEET: null,
  DRAWINGCUSTOM: null,
});

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
  console.log(row);
  handleVModel.value.selectedNoValue = row.uniqueID;
};

const onRemoveReport = async () => {
  if (handleVModel.value.selectedNoValue) {
    const serialNo = handleVModel.value.selectedNoValue;
    console.log(serialNo);
    await useApiFetch(
      `/api/maintenance/calibration/deleteData?id=${serialNo}`,
      {
        method: "DELETE",
        onResponse({ response }) {
          if (response.status === 200) {
            fetchAllWhereDataReport();
            fetchAllByDataReport();
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
    // console.log("Selected SubCategory:", selectedSubCategory);
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

const instrumentFunction03 = async (newValue) => {
  const Value = encodeURIComponent(newValue.value);
  try {
    const { data } = await useFetch(
      `/api/maintenance/equipment/getAllReportData?type=instrument&subCategory=${Value}`
    );

    console.log("API Response:", data);

    if (data.value) {
      console.log("Search1List:", data.value.search1List);
      headerFilters.value.numberValueOp03.options = data.value.search1List.map(
        (IC1) => ({
          label: IC1,
          value: IC1,
        })
      );
      console.log(
        "Updated numberValueOp03 options:",
        headerFilters.value.numberValueOp03.options
      );
    } else {
      console.error("No data found");
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const files = ref([null, null]);

const handleFileChange = async (event, index) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.add({
        title: "Error",
        description: "Please select a PDF file only!",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return;
    }
    files.value[index] = file;
    const formData = new FormData();
    let fileType;
    if (index === 0) {
      fileType = "Drawing/Manual";
    } else {
      fileType = "PDS";
    }
    formData.append(fileType, file);
    const { data } = await useFetch("/api/file", {
      method: "POST",
      body: formData,
    });
    if (data.value && data.value.files && data.value.files.length > 0) {
      const fileData = data.value.files[0];

      if (fileData.fileType === "Drawing/Manual") {
        handleVModel.value.DRAWINGCUSTOM = fileData.url;
        handleVModel.value.fileUpload01 = fileData.filePath;
      } else if (fileData.fileType === "PDS") {
        handleVModel.value.SPECSHEET = fileData.url;
        handleVModel.value.fileUpload02 = fileData.filePath;
      }

      toast.add({
        title: "Success",
        description: "File uploaded successfully!",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.add({
      title: "Error",
      description: "Failed to upload file. Please try again.",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
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
    fileUpload01: handleVModel.value.fileUpload01 || "",
    fileUpload02: handleVModel.value.fileUpload02 || "",
  };

  try {
    const { data, error } = await useFetch(
      "/api/maintenance/equipment/tableInsertData?type=newReport",
      {
        method: "POST",
        body: formData,
      }
    );
    console.log("Form submitted successfully:", data.value);
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

  <UForm>
    <div class="flex flex-row gmsBlueTitlebar py-[10px]">
      <h3 class="pl-[8px]">Report Details</h3>
    </div>

    <div class="flex flex-row px-[25px] space-x-3 pt-[15px]">
      <div class="basis-1/10">
        <UFormGroup label="#">
        <UInput
          v-model="props.mainID"
        >
      
        </UInput>
      </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
    
        <UFormGroup label="Date">
        <UInput v-model="handleVModel.reportCreateData" type="date" />
      </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">

        <UFormGroup label="By">
        <UInputMenu
          v-model="handleVModel.byValue"
          :options="headerFilters.byList.options"
        />
      </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Where">
        <UInputMenu
          v-model="handleVModel.whereValue"
          :options="headerFilters.whereList.options"
        />
      </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <div class="text-center mt-[7px]">
          <p
            @click="openVendorRecord()"
            class="px-2 py-[5px] bg-gree-100 text-black border-[1px] border-black rounded-[5px] cursor-pointer"
          >
            Vendor
          </p>
          <input
            v-model="handleVModel.vendorName"
            class="border-2 border-black-500 focus:ring-0 p-2 w-full rounded-[5px]"
            placeholder="Enter text"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-row px-[15px]">
      <div class="basis-1/4 max-w-[300px] min-w-[150px] mr-4">
        <div>
          <UFormGroup label="GSI Calibration Procedure">
          <UInput
            id="DRAWINGCUSTOM"
            type="file"
            @change="(e) => handleFileChange(e, 0)"
            accept="application/pdf"
            class="hidden"
          />
        </UFormGroup>
        </div>

        <div class="flex items-center justify-between">
          <span class="bg-white truncate flex-1 py-[5px] pl-[5px]">
            {{
              (files[0]?.name?.length > 15
                ? "..." + files[0]?.name.slice(-15)
                : files[0]?.name) ||
              (handleVModel.DRAWINGCUSTOM?.length > 15
                ? "..." + handleVModel.DRAWINGCUSTOM.slice(-15)
                : handleVModel.DRAWINGCUSTOM) ||
              "..."
            }}
          </span>

          <label class="flex-shrink-0" for="DRAWINGCUSTOM">
            <span
              v-if="files[0]?.name || handleVModel.DRAWINGCUSTOM"
              class="gmsBlueHeader text-white px-[5px] py-1 cursor-pointer"
            >
              ...
            </span>
            <span
              :class="
                !files[0]?.name && !handleVModel.DRAWINGCUSTOM
                  ? 'gmsBlueHeader text-white px-[8px] text-center py-1'
                  : ''
              "
            >
              <span v-if="!files[0]?.name && !handleVModel.DRAWINGCUSTOM"
                >...</span
              >
            </span>
          </label>
        </div>
      </div>

      <div class="basis-1/2 max-w-[300px] min-w-[150px] mr-4">
        <div>
          <UFormGroup label="Third Party Report">
            <UInput
              id="PDS"
              type="file"
              @change="(e) => handleFileChange(e, 1)"
              accept="application/pdf"
              class="hidden"
            />
          </UFormGroup>
        </div>

        <div class="flex items-center justify-between">
          <span class="bg-white truncate flex-1 py-[5px] pl-[5px]">
            {{
              (files[1]?.name?.length > 15
                ? "..." + files[1]?.name.slice(-15)
                : files[1]?.name) ||
              (handleVModel.SPECSHEET?.length > 15
                ? "..." + handleVModel.SPECSHEET.slice(-15)
                : handleVModel.SPECSHEET) ||
              "..."
            }}
          </span>

          <label class="flex-shrink-0" for="PDS">
            <span
              v-if="files[1]?.name || handleVModel.SPECSHEET"
              class="gmsBlueHeader text-white px-1 py-1 cursor-pointer"
            >
              ...
            </span>
            <span
              :class="
                !files[1]?.name && !handleVModel.SPECSHEET
                  ? 'gmsBlueHeader text-white px-1 text-center py-1 '
                  : ''
              "
            >
              <span v-if="!files[0]?.name && !handleVModel.DRAWINGCUSTOM"
                >...</span
              >
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="w-full mb-[10px] mt-[10px] px-[15px] pt-[10px]">
      <div class="basis-1/2 w-[480px]">
        <UFormGroup label="Comments">
        <textarea
          v-model="handleVModel.reportComments"
          placeholder="Enter details"
          rows="3"
          class="border py-6 px-4 rounded w-full leading-[10px]"
        >
        </textarea>
      </UFormGroup>
      </div>
    </div>

    <div class="flex flex-row mt-[20px] px-[15px] pt-[10px]">
      <p class="pl-[10px] py-[10px]">Calibration Reference</p>
    </div>

    <div class="flex flex-row space-x-2 mt-[10px] px-[15px] pt-[10px]">
      <div class="basis-3/2 mr-4 mt-[20px]">
        <label>1</label>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Sub Category">
          <UInputMenu
            v-model="handleVModel.subCategory"
            :options="headerFilters.subList.options"
            @change="fetchDataInstrumentCategory"
          />
       </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UFormGroup label="Instrument">
          <UInputMenu
            v-model="handleVModel.instrumentValue"
            :options="headerFilters.instrument.options"
            @change="instrumentFunction"
          />
        </UFormGroup>
      </div>
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UFormGroup label="IC#">
            <UInputMenu
              v-model="handleVModel.numberValue"
              :options="headerFilters.numberValueOp.options"
            />
          </UFormGroup>
        </div>
      </div>
    </div>

    <div class="flex flex-row space-x-2 py-[5px] px-[15px] pt-[10px]">
      <div class="basis-3/2 mr-4">
    
        <label>2</label>
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

    <div class="flex flex-row space-x-2 py-[5px] px-[15px] pt-[10px]">
      <div class="basis-3/2 mr-4">

        <label>3</label>
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
    <div class="flex flex-row space-x-2 py-[5px] px-[15px] pt-[10px]">
      <div class="basis-3/2 mr-4">
        <label>4</label>
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

    <div class="flex flex-row space-x-6 gmsBlueTitlebar mt-[50px]">
      <p class="pl-[10px] py-[10px]">Measured Data Value</p>
    </div>

    <div class="flex flex-row space-x-2 pt-[15px] px-[25px] pt-[10px]">
      <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
        <UInputMenu
          v-model="handleVModel.UomData"
          :options="headerFilters.getAllUOMOption.options"
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

      <div class="basis-3/7">
        <UButton
          icon="i-heroicons-plus"
          variant="outline"
          color="green"
          @click="CreateTable"
        />
      </div>

      <div class="basis-3/9">
        <UButton
          icon="i-heroicons-minus-circle"
          variant="outline"
          color="red"
          @click="onRemoveReport"
        />
      </div>
    </div>
    <div class="px-[25px]">
      <UTable
        :rows="inventoryDetailGridMeta.reportTableData"
        :columns="inventoryDetailGridMeta.defaultColumns"
        :loading="inventoryDetailGridMeta.isLoading"
        class="w-full mt-[10px]"
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

        <!-- <template #default="{ rows }">
          <template v-for="row in rows" :key="row.uniqueid">
            <tr
              @click="onSelect(row)"
              :class="{
                'bg-red-500',
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
        </template> -->
      </UTable>
    </div>
  </UForm>

  <div class="flex justify-end space-x-4 pt-[10px] px-[15px] pb-[20px]">
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
