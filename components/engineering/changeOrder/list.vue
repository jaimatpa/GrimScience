<script setup lang="ts">
import { ref, reactive } from "vue";
import PartsModalPage from "../../../pages/materials/parts/parts.vue"

const modalMeta = ref({
  isCustomerModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  modalTitle: "Products",
});

const onCreate = () => {
  gridMeta.value.selectedCustomerId = null;
  modalMeta.value.modalTitle = "Products";
  modalMeta.value.isCustomerModalOpen = true;
};

const handleSelectedPart = (data) => {
  console.log(data)
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
          throw new Error('Failed to fetch PDF');
        }

        const blob = await response.blob();
        const pdfContentUrl = URL.createObjectURL(blob); // Create a URL for the PDF blob
        
        // Open the PDF in a new tab/window after fetching
        window.open(pdfContentUrl, '_blank');
      } catch (error) {
        console.error(error);
        alert('Error fetching the PDF. Please try again later.');
      }
    };

    // Call the fetchData function with the unique ID
    fetchData(uniqueIDP.value);
  } else {
    alert('Unique ID is missing! The function cannot execute.');
  }
};



// ok code
// const onPrevieOrderBtnClick = () => {
//   if (uniqueIDP.value) {
//     const queryString = new URLSearchParams({ id: uniqueIDP.value }).toString();
//     window.open(`/engineering/pdf?${queryString}`, '_blank');
//   } else {
//     alert('Unique ID is missing! The function cannot execute.');
//   }
// };



onMounted(() => {
  init();
  fetchSignature();
  fetchEmployeeData();
  fetchReasonForChangeData();
});

// redirectToProductsList() {
//       // This will redirect to the specific path
//       this.$router.push('/marketing/products/list');
//     }

const emit = defineEmits(["selectEco","close"]);


const props = defineProps({
  isModal: {
    type: [Boolean],
  },
  selectedEmployee: {
    type: Object,
    required: true,
  },isPage: {
        type: Boolean,
        default: true,
    },

});

const clearFields = () => {
  selectedRowData.value = {
    uniqueID: "",
    DESCRIPTION: "",
    REASONFORCHANGE: "",
    ISSUE: "",
    SOLUTION: "",
    DetailReason: "",
    PRODUCT: "",
    FromModel: "",
    ToModel: "",
    PARTS: "",
    ENGAPPROVER: "",
    MARAPPROVER: "",
    ORIGINATOR: "",
    MANAPPROVER: "",
    ENGAPPROVAL: "",
    MARAPPROVAL: "",
    MANAPPROVAL: "",
    ENGDATEAPPROVED: "",
    MARDATEAPPROVED: "",
    MANDATEAPPROVED: "",
    ORIGINATORDATE: "",
    MANCOMMENTS: "",
    MARCOMMENTS: "",
    ENGCOMMENTS: "",
    COMMENTS: "",
    PRODUCTS: "",
    VandVNotRequired: "",
    MANUFACTURING: "",
    ENGINEERING: "",
    ProductsDetails:"",
    PartsDetails:"",
   
  };

  Description.value = "";
  IssueDetails.value = "";
  solutionOrder.value = "";
  uniqueIdNumber.value = "";
  DetailsReasonChange.value = "";
  fromModel.value = "";
  toModel.value = "";
  PartsAffect.value = "";
  productLineOption.value = "";
  changeReasonData.value = "";
  engineeringBoolean.value = "";
  marketingData.value = "";
  marketingBoolean.value = "";
  marketingComments.value = "";
  manufacturingCheck.value = false;
  manufacturingData.value = "";
  engineeringCheck.value = false;
  engineeringData.value = "";
  originatorData.value = "";
  signature.value = "";
  CompleteBoolean.value = "";
  commentsComplete.value = "";
  manufacturingBoolean.value = "";
  manufacturingComments.value = "";
  engineeringComments.value = "";
  manufacturingDate.value = "";
  engineeringDate.value = "";
  productsDetails.value ="";
  partsDetails.value =""
};

const selectedRowData = ref({
  uniqueID: "",
  DESCRIPTION: "",
  REASONFORCHANGE: "",
  ISSUE: "",
  SOLUTION: "",
  DetailReason: "",
  PRODUCT: "",
  FromModel: "",
  ToModel: "",
  PARTS: "",
  ENGAPPROVER: "",
  MARAPPROVER: "",
  ORIGINATOR: "",
  MANAPPROVER: "",
  ENGAPPROVAL: "",
  MARAPPROVAL: "",
  MANAPPROVAL: "",
  ENGDATEAPPROVED: "",
  MARDATEAPPROVED: "",
  MANDATEAPPROVED: "",
  ORIGINATORDATE: "",
  MANCOMMENTS: "",
  MARCOMMENTS: "",
  ENGCOMMENTS: "",
  COMMENTS: "",
  PRODUCTS: "",
  VandVNotRequired: "",
  MANUFACTURING: "",
  MARKETING:"",
  ENGINEERING:"",
  ProductsDetails:"",
  PartsDetails:"",
});

const handleRowSelected = (row) => {
  uniqueIDP.value = row.uniqueID;
  selectedRow.value = row;


  selectedRowData.value = {
    uniqueID: row.uniqueID,
    DESCRIPTION: row.DESCRIPTION,
    REASONFORCHANGE: row.REASONFORCHANGE,
    DetailReason: row.DetailReason,
    ISSUE: row.ISSUE,
    SOLUTION: row.SOLUTION,
    PRODUCT: row.PRODUCT,
    FromModel: row.FromModel,
    ToModel: row.ToModel,
    PARTS: row.PARTS,
    ENGAPPROVER: row.ENGAPPROVER,
    MARAPPROVER: row.MARAPPROVER,
    ORIGINATOR: row.ORIGINATOR,
    MANAPPROVER: row.MANAPPROVER,
    ENGAPPROVAL: row.ENGAPPROVAL,
    MARAPPROVAL: row.MARAPPROVAL,
    MANAPPROVAL: row.MANAPPROVAL,
    ENGDATEAPPROVED: row.ENGDATEAPPROVED,
    MARDATEAPPROVED: row.MARDATEAPPROVED,
    MANDATEAPPROVED: row.MANDATEAPPROVED,
    ORIGINATORDATE: row.ORIGINATORDATE,
    MANCOMMENTS: row.MANCOMMENTS,
    MARCOMMENTS: row.MARCOMMENTS,
    ENGCOMMENTS: row.ENGCOMMENTS,
    COMMENTS: row.COMMENTS,
    PRODUCTS: row.PRODUCTS,
    MARKETING: row.MARKETING,
    VandVNotRequired: row.VandVNotRequired,
    ENGINEERING: row.ENGINEERING,
    MANUFACTURING:row.MANUFACTURING,
    ProductsDetails:row.ProductsDetails,
    PartsDetails:row.PartsDetails,
  
    
  };

  Description.value = row.DESCRIPTION ;
  IssueDetails.value = row.ISSUE ;
  solutionOrder.value = row.SOLUTION ;
  uniqueIdNumber.value = row.uniqueID ;
  DetailsReasonChange.value = row.DetailReason ;
  fromModel.value = row.FromModel ;
  toModel.value = row.ToModel ;
  PartsAffect.value = row.PARTS ;
  productLineOption.value = row.PRODUCT ;
  changeReasonData.value = row.REASONFORCHANGE ;
  engineeringBoolean.value = row.ENGAPPROVAL ;
  marketingData.value = row.MARAPPROVER ;
  marketingBoolean.value = row.MARAPPROVAL ;
  marketingComments.value = row.MARCOMMENTS ;
  manufacturingCheck.value = row.MANUFACTURING  ||"";
  manufacturingData.value = row.MANAPPROVER ;
  engineeringCheck.value = row.ENGINEERING  || "";
  engineeringData.value = row.ENGAPPROVER || "" ;
  originatorData.value = row.ORIGINATOR ;
  signature.value = row.SIGNATURE ;
  CompleteBoolean.value = row.APPROVAL ;
  commentsComplete.value = row.COMMENTS ;
  manufacturingBoolean.value = row.MANAPPROVAL ;
  manufacturingComments.value = row.MANCOMMENTS ;
  engineeringComments.value = row.ENGCOMMENTS ;
  CompleteDate.value = row.DISTRIBUTIONDATE ;
  manufacturingDate.value = row.MANDATEAPPROVED ;
  marketingDate.value =row.MARDATEAPPROVED ;
  engineeringDate.value = row.ENGDATEAPPROVED ;
  productsDetails.value = row.ProductsDetails;
  partsDetails.value = row.PartsDetails;
  verificationValue.value = row.VandVNotRequired.value ? -1 : 0;

};




const uniqueIDP = ref(null);
const selectedRow = ref(null);
const SignatureList = ref([]);
const employeeOptions = ref([]);
const changeReason = ref([]);
const originatorData = ref("");
const originatorDate = ref("");
const productsDetails = ref("")
const partsDetails = ref("")
const engineeringCheck = ref(false);
const engineeringData = ref("");
const engineeringDate = ref("");
const engineeringBoolean = ref("");
const engineeringComments = ref("");
const marketingCheck = ref(false);
const marketingData = ref("");
const marketingDate = ref(null);
const marketingBoolean = ref("");
const marketingComments = ref("");
const manufacturingCheck = ref(false);
const manufacturingData = ref("");
const manufacturingDate = ref("");
const manufacturingBoolean = ref("");
const manufacturingComments = ref("");
const signature = ref("");
const CompleteDate = ref("");
const CompleteBoolean = ref();
const commentsComplete = ref("");
const changeReasonData = ref("");
const productLineOption = ref("");
const Description = ref("");
const IssueDetails = ref("");
const solutionOrder = ref("");
const fromModel = ref("");
const toModel = ref("");
const DetailsReasonChange = ref("");
const PartsAffect = ref("");
const ProductAffect = ref("");
const uniqueIdNumber = ref("");
const verificationNotRequired = ref(false);
const verificationValue = verificationNotRequired.value ? 0 : -1;


const submitInsertForm = async () => {
  const formatToSQLDateTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    date = new Date(date);
  }
  if (isNaN(date)) {
    throw new Error("Invalid date object");
  }
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};



  const formData = {
    uniqueID: uniqueIdNumber.value,
    REASONFORCHANGE: changeReasonData.value,
    PRODUCT: productLineOption.value,
    SOLUTION: solutionOrder.value,
    DESCRIPTION: Description.value,
    DetailReason: DetailsReasonChange.value,
    FromModel: fromModel.value,
    ToModel: toModel.value,
    PARTS: PartsAffect.value,
    ISSUE: IssueDetails.value,
    VandVNotRequired: verificationValue,
    ORIGINATOR: originatorData.value.label ,
    ORIGINATORDATE: (originatorDate.value),
    ENGINEERING: engineeringCheck.value,
    ENGAPPROVER: engineeringData.value.label ,
    // ENGDATEAPPROVED: engineeringDate.value, 
    ENGAPPROVAL: engineeringBoolean.value,
    ENGCOMMENTS: engineeringComments.value,
    MARKETING: marketingCheck.value,
    MARAPPROVER: marketingData.value.label,
    // MARDATEAPPROVED:marketingDate.value,
    MARAPPROVAL: marketingBoolean.value,
    MARCOMMENTS: marketingComments.value,
    MANUFACTURING: manufacturingCheck.value,
   MANAPPROVER: manufacturingData.value.label,
    // MANDATEAPPROVED: manufacturingDate.value, 
    MANAPPROVAL: manufacturingBoolean.value,
    MANCOMMENTS: manufacturingComments.value,
    SIGNATURE: signature.value.label,
    DISTRIBUTIONDATE:(CompleteDate.value), 
    APPROVAL: CompleteBoolean.value,
    COMMENTS: commentsComplete.value,
  };

  console.log(formData);
debugger
  try {
    const response = await useApiFetch(
      "/api/engineering/changeorder/postOrder",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.error("Submission failed:", response.error);
    }
  } catch (error) {
    console.error("Error during form submission:", error);
  }
};

const fetchInterval = ref(null);

const fetchEmployeeData = async () => {
  try {
    const { data, error } = await useFetch(
      "/api/engineering/changeorder/getEmploy"
    );

    if (data.value?.body) {
      employeeOptions.value = data.value.body.map((employee) => ({
        label: `${employee.fname} ${employee.lname}`,
        value: employee.fname,
      }));
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

const fetchSignature = async () => {
  try {
    const { data, error } = await useFetch(
      "/api/engineering/changeorder/getSignature"
    );
    if (data.value?.body && Array.isArray(data.value.body)) {
      SignatureList.value = data.value.body
        .filter((signature) => signature && signature.trim() !== "")
        .map((signature) => ({
          label: signature,
          value: signature,
        }));

      console.log("Signature List:", SignatureList.value);
    } else {
      console.error("No valid signatures found", data.value);
      SignatureList.value = [];
    }
    if (error.value) {
      console.error("Error fetching signature data:", error.value);
    }
  } catch (err) {
    console.error("Error fetching signature data:", err);
  }
};

const fetchReasonForChangeData = async () => {
  try {
    const { data, error } = await useFetch(
      "/api/engineering/changeorder/getreasonforchange"
    );

    if (data.value?.body) {
      changeReason.value = data.value.body.map((reason) => ({
        label: reason.reasonforchange,
        value: reason.reasonforchange,
      }));
    } else {
      console.error("No reasons found");
    }

    if (error.value) {
      console.error("Error fetching reason for change data:", error.value);
    }
  } catch (err) {
    console.error("Error fetching reason for change data:", err);
  }
};

// Clear the interval when the component is unmounted
onBeforeUnmount(() => {
  if (fetchInterval.value) {
    clearInterval(fetchInterval.value);
  }
});

const headerFilters = ref({
  productLines: {
    label: "Product Line",
    filter: "PRODUCTDESC",
    api: "/api/materials/productlines",
    options: [],
  },
});

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

const init = async () => {
  gridMeta.value.isLoading = true;
  for (const key in headerFilters.value) {
    const apiURL =
      headerFilters.value[key]?.api ?? `/api/service/orders/${key}`;
    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      },
    });
  }
};

const handleChange = (field, newValue) => {
  formState[field] = newValue;
};

const handleSelect=()=>{
  emit("selectEco", selectedRow);
  emit("close")
}
 
</script>
<template>
  <!-- Top product line search option start-->
  <EngineeringChangeOrderDetail
    :is-page="true"
    @row-selected="handleRowSelected"
  />
  <!-- Top product line search option End-->

  <UCard class="mb-6">
    <UForm :schema="formSchema" :state="formState" class="space-y-6">
      <div class="flex flex-row space-x-6">
        <div class="basis-1/10 max-w-[300px] min-w-[150px]">
          <p
            class="mt-[15px] p-[7px] bg-gray-600 text-white border border-green-500 rounded-md"
          >
            {{ uniqueIdNumber || 0 }}
          </p>
        </div>

        <!-- Right side select dropdown -->
        <div class="basis-3/5 max-w-[300px] min-w-[150px] mr-4">
          <UFormGroup label="Product Line" name="productLine">
            <USelect
              v-model="productLineOption"
              :options="headerFilters.productLines.options"
              @change="handleChange('productLine', $event)"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3 pb-4">
        <!-- Left side select dropdown -->
        <div class="basis-1/5 max-w-[300px] min-w-[150px] mr-4">
          <UFormGroup label="Reason For Change" name="changeReason">
            <USelect
              v-model="changeReasonData"
              :options="changeReason"
              @change="handleChange('changeReasonOptions', $event)"
            />
          </UFormGroup>
        </div>

        <!-- Right side textarea -->
        <div class="w-full">
          <UFormGroup
            label="Action/ Description (40 Characters )"
            name="Description"
          >
            <UTextarea
              v-model="Description"
              placeholder="Action/ Description (40 Characters )"
              class="w-full h-[1px]"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="pt-[4px]">
        <div class="w-full">
          <UFormGroup
            label="Issue( 100 characters or Less)"
            name="IssueDetails"
          >
            <UTextarea v-model="IssueDetails" class="w-full" />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-4 mt-[4px]">
        <!-- Left side: Textarea for Solution -->
        <div class="w-1/2">
          <UFormGroup
            label="Solution( 100 characters or Less)"
            name="solutionOrder"
          >
            <UTextarea v-model="solutionOrder" />
          </UFormGroup>
        </div>

        <!-- Right side: Checkbox -->
        <div class="w-1/2 mt-[30px] ml-[20px]">
          <UCheckbox
            v-model="verificationNotRequired"
            label="Verification & Validation - Not Required"
            help="Check if product has been 100% tested and inspected for specification conformity & effectiveness"
          />
        </div>
      </div>

      <div class="flex flex-row space-x-4 mt-[4px]">
        <!-- First input field -->
        <div class="w-1/4">
          <UFormGroup label="From Model" name="fromModel">
            <UInput v-model="fromModel" />
          </UFormGroup>
        </div>

        <div class="w-1/4">
          <UFormGroup label="To Model" name="toModel">
            <UInput v-model="toModel" />
          </UFormGroup>
        </div>

        <div class="w-1/2">
          <UFormGroup
            label="Please Details Reason For Change"
            name="ResoneChange"
          >
            <UTextarea v-model="DetailsReasonChange" class="w-full" />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-4">
        <div class="w-3/4 flex flex-col">
          <div class="flex justify-between items-center">
            <UFormGroup
              class="flex-1"
              label="Parts and Affect"
              name="PartsAffect"
            >
              <UInput class="h-full" />
            </UFormGroup>
            <UButton
              class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[30px] ml-[10px]"
             
            >
              Fiend
            </UButton>
          </div>
        </div>

        <div class="w-3/4 flex flex-col">
          <div class="flex justify-between items-center">
            <h2 class="text-left">Products Affected</h2>
            <UButton
              class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[30px]"
               @click="onCreate()"
            >
              Find
            </UButton>
          </div>
        </div>
      </div>

      <div class="flex flex-row space-x-4">
        <div class="w-3/4 flex flex-col">
          <UTextarea v-model="PartsAffect" class="w-full" />
        </div>
        <div class="w-3/4 flex flex-col">
          <UTextarea v-model="ProductAffect" class="w-full" />
        </div>
      </div>

      <div class="flex flex-row space-x-4">
        <div class="w-3/4 flex flex-col">
          <div class="flex justify-between items-center">
            <UFormGroup class="flex-1" name="firstInput">
              <UInput class="h-full"  v-model="partsDetails" />
            </UFormGroup>
            <UButton
              class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[10px] ml-[10px]"
            >
              Remove
            </UButton>
          </div>
        </div>

        <div class="w-3/4 flex flex-col">
          <div class="flex justify-between items-center">
            <UFormGroup class="flex-1" name="firstInput">
              <UInput class="h-full" v-model="productsDetails"/>
            </UFormGroup>
            <UButton
              class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[10px] ml-[10px]"
            >
              Remove
            </UButton>
          </div>
        </div>
      </div>

      <div class="px-[20px] pb-[20px]">
        <div class="grid lg:grid-cols-6 lg:items-start gap-3 mt-8">
          <div
            class="lg:col-span-1 flex gap-1 flex items-center justify-center mt-6"
          >
            <h3>Originator</h3>
          </div>
          <div class="lg:col-span-1">
            <h3>Employee</h3>

            <UInputMenu v-model="originatorData" :options="employeeOptions" />
          </div>

          <div class="lg:col-span-1">
            <h3>Date</h3>
            <UInput
              v-model="originatorDate"
              type="date"
              class="w-40 cursor-pointer"
            />
          </div>

          <div class="lg:col-span-1"><h3>Yes/No</h3></div>
          <div class="lg:col-span-1"><h3>Comments</h3></div>
        </div>

        <div class="grid lg:grid-cols-6 lg:items-start gap-3 mt-2">
          <div class="lg:col-span-1 flex gap-3">
            <UCheckbox v-model="engineeringCheck" />
            <h3>Engineering</h3>
          </div>
          <div class="lg:col-span-1">
            <UInputMenu v-model="engineeringData" :options="employeeOptions" />
          </div>
          <div class="lg:col-span-1">
            <UInput
              v-model="engineeringDate"
              type="DATE"
              class="w-40 cursor-pointer"
            />
          </div>
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-4">
              <URadio
                v-model="engineeringBoolean"
                value="yes"
                class="cursor-pointer"
              />
              <span>Yes</span>
              <URadio
                v-model="engineeringBoolean"
                value="no"
                class="cursor-pointer"
              />
              <span>No</span>
              <URadio
                v-model="engineeringBoolean"
                value="tbd"
                class="cursor-pointer"
              />
              <span>TBD</span>
            </div>
          </div>
          <div class="lg:col-span-2 ml-[25px]">
            <UInput
              v-model="engineeringComments"
              placeholder="Comments"
              class="flex-grow"
            />
          </div>
        </div>

        <div class="grid lg:grid-cols-6 lg:items-start gap-3 mt-2">
          <div class="lg:col-span-1 flex gap-3">
            <UCheckbox v-model="marketingCheck" />
            <h3>Marketing</h3>
          </div>
          <div class="lg:col-span-1">
            <UInputMenu v-model="marketingData" :options="employeeOptions" />
          </div>
          <div class="lg:col-span-1">
            <UInput v-model="marketingDate" type="DATE" class="w-40" />
          </div>
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-4">
              <URadio v-model="marketingBoolean" value="yes" />
              <span>Yes</span>
              <URadio v-model="marketingBoolean" value="no" />
              <span>No</span>
              <URadio v-model="marketingBoolean" value="tbd" />
              <span>TBD</span>
            </div>
          </div>
          <div class="lg:col-span-2 ml-[25px]">
            <UInput
              v-model="marketingComments"
              placeholder="Comments"
              class="flex-grow"
            />
          </div>
        </div>

        <div class="grid lg:grid-cols-6 lg:items-start gap-3 mt-2">
          <div class="lg:col-span-1 flex gap-3">
            <UCheckbox v-model="manufacturingCheck" />
            <h3>Manufacturing</h3>
          </div>
          <div class="lg:col-span-1">
            <UInputMenu
              v-model="manufacturingData"
              :options="employeeOptions"
            />
          </div>
          <div class="lg:col-span-1">
            <UInput v-model="manufacturingDate" type="DATE" class="w-40" />
          </div>
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-4">
              <URadio v-model="manufacturingBoolean" value="yes" />
              <span>Yes</span>
              <URadio v-model="manufacturingBoolean" value="no" />
              <span>No</span>
              <URadio v-model="manufacturingBoolean" value="tbd" />
              <span>TBD</span>
            </div>
          </div>
          <div class="lg:col-span-2 ml-[25px]">
            <UInput
              v-model="manufacturingComments"
              placeholder="Comments"
              class="flex-grow"
            />
          </div>
        </div>

        <div class="grid lg:grid-cols-6 lg:items-start gap-3 mt-2">
          <div
            class="lg:col-span-1 flex gap-5 flex items-center justify-center"
          >
            <h3>Complete</h3>
          </div>
          <div class="lg:col-span-1">
            <UInputMenu v-model="signature" :options="SignatureList" />
          </div>
          <div class="lg:col-span-1">
            <UInput v-model="CompleteDate" type="date" class="w-40" />
          </div>
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-4">
              <URadio v-model="CompleteBoolean" value="yes" />
              <span>Yes</span>
              <URadio v-model="CompleteBoolean" value="no" />
              <span>No</span>
              <URadio v-model="CompleteBoolean" value="tbd" />
              <span>TBD</span>
            </div>
          </div>
          <div class="lg:col-span-2 ml-[25px]">
            <UInput
              v-model="commentsComplete"
              placeholder="Comments"
              class="flex-grow"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <UButton
          @click="submitInsertForm"
          color="green"
          label="Add"
          icon="i-heroicons-plus"
        />
        <UButton
          @click="submitInsertForm"
          color="blue"
          label="Modify"
          icon="i-heroicons-pencil"
        />

        <UButton
          @click="clearFields"
          color="red"
          label="Clear Form"
          icon="i-heroicons-trash"
        />

        <div>
          <UButton
            color="gray"
            label="Preview ECO"
            icon="i-heroicons-eye"
          @click="onPrevieOrderBtnClick"
          />
        </div>
      </div>
<div v-if="!props.isPage" class="basis-1/3 flex justify-end">
                <div class="min-w-[150px]">
                    <UButton icon="i-heroicons-cursor-arrow-ripple" label="Select" variant="outline"
                        :ui="{ base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full' }"
                         @click="handleSelect" truncate />
                </div>
            </div>

      <UDivider />
    </UForm>
  </UCard>





 
  <UDashboardModal
          v-model="modalMeta.isCustomerModalOpen"
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
            width: 'w-[1000px] sm:max-w-7xl',
          }"
        >
          <ProductsProductList @onPartSelect="handleSelectedPart"/>
        </UDashboardModal>

</template>
