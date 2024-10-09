<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderDetailsTable from "./table.vue";

onMounted(async () => {
  await init();
  await fetchCategoryData(), await fetchSubCategoryData();
  await fetchEquipmentList();
  await fetchEmployeeData();
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
});

const toast = useToast();

const modalMeta = ref({
  isCustomerModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  modalTitle: "Products",
});

const openSerialRecord = () => {
  partsMeta.value.modalTitle = "Serial list";
  partsMeta.value.isPartsModalOpen = true;
};

const partsMeta = ref({
  isPartsModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  modalTitle: "Parts",
});

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
  debugger;
  try {
    const { data } = await useFetch(
      "/api/maintenance/equipment/getAllEquipment"
    );
    if (data._rawValue) {
      // Assuming `data.value.body` is an array of categories (strings or objects)
      headerFilters.value.equipmentList.options = data._rawValue.map(
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
    uniqeId: "",
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
  };
};

const handleRowSelected = (row) => {
  console.log("Function OK", row);

  // Function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (dateString) => {
    const dateParts = dateString.split("/");
    return `${dateParts[2]}-${dateParts[0].padStart(
      2,
      "0"
    )}-${dateParts[1].padStart(2, "0")}`;
  };

  // Extracting the REQUIRED date and formatting it
  const requiredDate = row.REQUIRED
    ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
    : "";
  const dataData = row.DATE
    ? formatDateToYYYYMMDD(row.REQUIRED.split(" ")[0])
    : "";

  handleVModel.value = {
    uniqeId: row.UniqueID || "",
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
  };
};

const closeSerialModal = () => {
  modalMeta.value.isCustomerModalOpen = false;
};

const selectedRowParts = ref({
  partsArray: [],
  partsData: "",
  selectedIndex: null,
});

const handleRowSelectedSerial = (row) => {
  console.log(row);
  const partExists = selectedRowParts.value.partsArray.some(
    (part) => part.MODEL === row.MODEL && part.DESCRIPTION === row.DESCRIPTION
  );

  if (!partExists) {
    selectedRowParts.value.partsArray.push({
      MODEL: row.MODEL,
      DESCRIPTION: row.DESCRIPTION,
    });
    updatePartsDetails();
  }
};

const updatePartsDetails = () => {
  selectedRowParts.value.partsData = selectedRowParts.value.partsArray
    .map((part) => `${part.MODEL} ${part.DESCRIPTION}`)
    .join(", ");
};

const handleVModel = ref({
  uniqeId: "",
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
});


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


const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "uniqueID",
      label: "#",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "DESCRIPTION",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "REASONFORCHANGE",
      label: "Reason",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "COMPLAINTDATE",
      label: "Origin Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DISTRIBUTIONDATE",
      label: "Completion Date",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 10,
  numberOfServiceOrders: 0,
  orders: [],
  selectedOrderId: null,
  selectedCustomerId: null,
  selectedCompaintNumber: null,
  selectedSerialNumber: null,
  sort: {
    column: "PRODUCT",
    direction: "desc",
  },
  isLoading: false,
});

const init = async () => {};

const filterValues = ref({
  MANO: null,
  CATAGORY: null,
  SUBCATAGORY: null,
  PART: null,
  ORDEREDBY: null,
  SERIAL: null,
  REQUIRED: null,
});
</script>
<template>
  <!-- Top product line search option start-->
  <OrderDetailsTable
    :is-page="true"
    @row-selected="handleRowSelected"
    :shouldRefresh="shouldRefresh"
  />
  <!-- Top product line search option End-->
  <UCard class="mb-6">
    <!-- <UForm :schema="formSchema" :state="formState" class="space-y-6"> -->

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
            :options="headerFilters.subCategoryList.options"
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

      <div class="flex flex-row space-x-4">
        <div class="w-3/4 flex flex-col"></div>
      </div>

      <div class="flex justify-end space-x-4">
        <UButton
          class="px-[30px]"
          @click="submitForm"
          color="green"
          label="Add/Save"
          icon="i-heroicons-plus"
        />
        <UButton
          class="px-[30px]"
          @click="submitForm"
          color="blue"
          label="Delete"
          icon="i-heroicons-pencil"
        />

        <UButton
          class="px-[30px]"
          @click="clearValues"
          color="red"
          label="Clear Form"
          icon="i-heroicons-trash"
        />

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
      <div v-if="!props.isPage" class="basis-1/3 flex justify-end">
        <div class="min-w-[150px]">
          <UButton
            icon="i-heroicons-cursor-arrow-ripple"
            label="Select"
            variant="outline"
            :ui="{
              base: 'min-w-[200px] w-full',
              truncate: 'flex justify-center w-full',
            }"
            @click="handleSelect"
            truncate
          />
        </div>
      </div>
      <UDivider />
    </UForm>
  </UCard>

  <UDashboardModal
    v-model="partsMeta.isPartsModalOpen"
    :title="partsMeta.modalTitle"
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
      @rowSelectedPart="handleRowSelectedSerial"
      @close="closeSerialModal"
    />
  </UDashboardModal>
</template>
