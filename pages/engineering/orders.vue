<script setup lang="ts">
import { ref, reactive } from "vue";

const emit = defineEmits([]);
const props = defineProps({
  isModal: {
    type: [Boolean],
  },
  selectedEmployee: {
    type: Object,
    required: true,
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
  };

  // Step 2: Clear input fields
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

  for (const role of Object.keys(formState.value)) {
    formState.value[role].employeeData = ""; 
    formState.value[role].dateOrder = ""; 
    formState.value[role].approval = ""; 
    formState.value[role].comments = ""; 
    formState.value[role].checked = false; 
  }

  // formState.value.originator.selectedValue = "";
  // formState.value.engineering.selectedValue = ""; 
  // formState.value.marketing.selectedValue = "";
  // formState.value.manufacturing.selectedValue = ""; 
  // formState.value.complete.selectedValue = ""; 
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
  PRODUCTS:""
  
});

const handleRowSelected = (row) => {
  console.log(row)
 
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
    PRODUCTS:row.PRODUCTS
  
  };
  Description.value = row.DESCRIPTION;
  IssueDetails.value = row.ISSUE;
  solutionOrder.value = row.SOLUTION;
  uniqueIdNumber.value = row.uniqueID;
  DetailsReasonChange.value = row.DetailReason;
  Description.value = row.DESCRIPTION;
  IssueDetails.value = row.ISSUE;
  solutionOrder.value = row.SOLUTION;
  uniqueIdNumber.value = row.uniqueID || "";
  DetailsReasonChange.value = row.DetailReason || "";
  fromModel.value = row.FromModel || "";
  toModel.value = row.ToModel || "";
  PartsAffect.value = row.PARTS || "";
  productLineOption.value = row.PRODUCT || "";
  changeReasonData.value = row.REASONFORCHANGE || "";
  formState.value.originator.employeeData = row.ORIGINATOR
    ? row.ORIGINATOR
    : "";
  formState.value.engineering.employeeData = row.ENGAPPROVER
    ? row.ENGAPPROVER
    : "";
  formState.value.marketing.employeeData = row.MARAPPROVER
    ? row.MARAPPROVER
    : "";
  formState.value.manufacturing.employeeData = row.MANAPPROVER
    ? row.MANAPPROVER
    : "";
  formState.value.complete.employeeData = row.APPROVALS ? row.APPROVALS : "";

 formState.value.originator.employeeData = row.ORIGINATOR
    ? row.ORIGINATOR
    : "";

  formState.value.originator.dateOrder = row.ORIGINATORDATE
    ? formatDate(row.ORIGINATORDATE)
    : "";
  formState.value.engineering.dateOrder = row.ENGDATEAPPROVED
    ? formatDate(row.ENGDATEAPPROVED)
    : "";
  formState.value.marketing.dateOrder = row.MARDATEAPPROVED
    ? formatDate(row.MARDATEAPPROVED)
    : "";
  formState.value.manufacturing.dateOrder = row.MANDATEAPPROVED
    ? formatDate(row.MANDATEAPPROVED)
    : "";
  formState.value.complete.dateOrder = row.APPROVALS
    ? formatDate(row.APPROVALS)
    : "";

  // Map row approval values to formState yes or no
  formState.value.engineering.approval = row.ENGAPPROVAL ? "yes" : "no";
  formState.value.marketing.approval = row.MARAPPROVAL || "";
  formState.value.manufacturing.approval = row.MANAPPROVAL || "";
  formState.value.complete.approval = row.APPROVALS || "";

  // Update comments for the selected role
  formState.value.complete.comments = row.COMMENTS || "";
  formState.value.engineering.comments = row.ENGCOMMENTS || "";
  formState.value.marketing.comments = row.MARCOMMENTS || "";
  formState.value.manufacturing.comments = row.MANCOMMENTS || "";
};


const updateOrCreateData = async () => {

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day} 00:00:00.000`;
  };
  
  const updatePayload = {
    uniqueID: selectedRowData.value.uniqueID,
    DESCRIPTION: Description.value,
    REASONFORCHANGE: changeReasonData.value,
    DetailReason: DetailsReasonChange.value,
    ISSUE: IssueDetails.value,
    SOLUTION: solutionOrder.value,
    PRODUCT: productLineOption.value,
    FromModel: fromModel.value,
    ToModel: toModel.value,
    PARTS: PartsAffect.value,
    PRODUCTS:ProductAffect.value,
    ENGAPPROVER: formState.value.engineering.employeeData,
    MARAPPROVER: formState.value.marketing.employeeData,
    MANAPPROVER: formState.value.manufacturing.employeeData,
    ORIGINATOR: formState.value.originator.employeeData,
    ENGAPPROVAL: formState.value.engineering.approval,
    MARAPPROVAL: formState.value.marketing.approval,
    MANAPPROVAL: formState.value.manufacturing.approval,
    ENGDATEAPPROVED: dateFormate(formState.value.engineering.dateOrder),
    MARDATEAPPROVED: dateFormate(formState.value.marketing.dateOrder),
    MANDATEAPPROVED: dateFormate(formState.value.manufacturing.dateOrder),
    ORIGINATORDATE: dateFormate(formState.value.originator.dateOrder),
    APPROVALS: dateFormate(formState.value.complete.dateOrder),
    MANCOMMENTS: formState.value.manufacturing.comments,
    MARCOMMENTS: formState.value.marketing.comments,
    COMMENTS: formState.value.complete.comments,
    ENGCOMMENTS: formState.value.engineering.comments,
  };

  try {
    // Call the API with the updatePayload
    const response = await $fetch(
      "/api/engineering/changeorder/updateChangeOrderData",
      {
        method: "POST",
        body: updatePayload,
      }
    );
  
    if (response.status === "success") {
      console.log("Operation successful:", response.message);
    } else {
      console.error("Operation failed:", response.message);
    }
  } catch (error) {
    console.error("Error updating or creating data:", error);
    alert("An error occurred: " + error.message);
  }
};


const dateFormate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day} 00:00:00.000`;
  };


// const formatDate = (dateString) => {

//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// this code for insert data
const SignatureList = ref([]);
const employeeOptions = ref([]);
const changeReason = ref([]);
const signatureListData = ref("")
const changeReasonData = ref("");
const productLineOption = ref("");
const Description = ref("");
const IssueDetails = ref("");
const solutionOrder = ref("");
const fromModel = ref("");
const toModel = ref("");
const DetailsReasonChange = ref("");
const PartsAffect = ref("");
const ProductAffect = ref("")
const uniqueIdNumber = ref("");

const roles = [
  "Originator",
  "Engineering",
  "Marketing",
  "Manufacturing",
  "Complete",
  
];

const formState = ref({
  verificationNotRequired: false,
  originator: {
    checked: false,
    employeeData: "",
    dateOrder: "",
    approval: "",
    comments: "",
  },
  engineering: {
    checked: false,
    employeeData: "",
    dateOrder: "",
    approval: "",
    comments: "",
  },
  marketing: {
    checked: false,
    employeeData: "",
    dateOrder: "",
    approval: "",
    comments: "",
  },
  manufacturing: {
    checked: false,
    employeeData: "",
    dateOrder: "",
    approval: "",
    comments: "",
  },
  complete: {
    checked: false,
    employeeData: "",
    dateOrder: "",
    approval: "",
    comments: "",
  },
});

watch(
  formState,
  (newValue) => {
    console.log("Form data changed:", newValue);
  },
  { deep: true }
); 


const submitInsertForm = async () => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day} 00:00:00.000`;
  };

  const formData = {
    REASONFORCHANGE: changeReasonData.value,
    PRODUCT: productLineOption.value,
    SOLUTION: solutionOrder.value,
    DESCRIPTION: Description.value,
    DetailReason: DetailsReasonChange.value,
    FromModel: fromModel.value,
    ToModel: toModel.value,
    PARTS: PartsAffect.value,
    ISSUE: IssueDetails.value,

    // Approvers
    ENGAPPROVER: formState.value.engineering.employeeData,
    MARAPPROVER: formState.value.marketing.employeeData,
    ORIGINATOR: formState.value.complete.employeeData,
    MANAPPROVER: formState.value.manufacturing.employeeData,

    // Approval Status
    ENGAPPROVAL: formState.value.engineering.approval,
    MARAPPROVAL: formState.value.marketing.approval,
    MANAPPROVAL: formState.value.manufacturing.approval,
    APPROVALS: formState.value.manufacturing.approval,

    // Approval Dates - Format dates to 'YYYY-MM-DD 00:00:00.000'
    ENGDATEAPPROVED: formatDate(formState.value.engineering.dateOrder),
    MARDATEAPPROVED: formatDate(formState.value.marketing.dateOrder),
    MANDATEAPPROVED: formatDate(formState.value.manufacturing.dateOrder),
    ORIGINATORDATE: formatDate(formState.value.complete.dateOrder),

    // Comment Section
    MANCOMMENTS: formState.value.manufacturing.comments,
    MARCOMMENTS: formState.value.marketing.comments,
    COMMENTS: formState.value.complete.comments,
    ENGCOMMENTS: formState.value.engineering.comments,
  };

  // Submit the form using your API
  await useApiFetch("/api/engineering/changeorder/postOrder", {
    method: "POST",
    body: formData,

    onResponse({ response }) {
      if (response.status === 200) {
        console.log(response);
      }
    },
  });
};

onMounted(() => {
  init();
  fetchSignature();
  fetchEmployeeData();
  fetchReasonForChangeData();
});

// Function to submit the form
// const submitForm = async () => {
//   try {
//     const { data, error } = await useFetch(
//       "/api/engineering/changeorder/postOrder",
//       {
//         method: "POST",
//         body: formState,
//       }
//     );

//     if (error.value) {
//       console.error("Error submitting data:", error.value);
//     } else {
//       console.log("Form submitted successfully:", data.value);
//     }
//   } catch (err) {
//     console.error("Error submitting form:", err);
//   }
// };

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

// const fetchSignature = async () => {
//   try {
//     const { data, error } = await useFetch(
//       "/api/engineering/changeorder/getSignature"
//     );

//     if (data.value?.body) {
//       SignatureList.value = data.value.body.map((signature) => ({
//         label: signature.SIGNATURE,
//         value: signature.SIGNATURE,
//       }));
//       console.log(SignatureList);
//     } else {
//       console.error("No signatures found");
//     }

//     if (error.value) {
//       console.error("Error fetching signature data:", error.value);
//     }
//   } catch (err) {
//     console.error("Error fetching signature data:", err);
//   }
// };


const fetchSignature = async () => {
  try {
    // Fetch signature data from the API endpoint
    const { data, error } = await useFetch("/api/engineering/changeorder/getSignature");

    // Check if the response contains the body and it's an array
    if (data.value?.body && Array.isArray(data.value.body)) {
      // Filter out null and empty values, then map to structured format
      SignatureList.value = data.value.body
        .filter(signature => signature && signature.trim() !== "") // Filter out null and empty strings
        .map(signature => ({
          label: signature, // Use the signature as the label
          value: signature, // Use the signature as the value
        }));

      console.log('Signature List:', SignatureList.value); // Log the populated SignatureList
    } else {
      console.error("No valid signatures found", data.value);
      SignatureList.value = []; // Clear SignatureList if no valid data
    }

    // Handle potential errors in fetching data
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
</script>

<!-- ChangeOrdersForm.vue -->
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent>
        <!-- Top product line search option start-->
        <EngineeringChangeOrderDetail
          :is-page="true"
          @row-selected="handleRowSelected"
        />
        <!-- Top product line search option End-->

        <UCard class="mb-6">
          <UForm :schema="formSchema" :state="formState" class="space-y-6">
            <!-- <div>  
              Selected Order: {{ selectedRowData.uniqueID || "" }}<br>
           </div> -->

            <div class="flex flex-row space-x-6">
              <!-- Left side input field -->
              <div class="basis-1/10 max-w-[300px] min-w-[150px] mr-4">
                <p class="mt-[20px] p-[10px] bg-gray-600 text-white">
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
                  v-model="formState.verificationNotRequired"
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

              <!-- Second input field -->
              <div class="w-1/4">
                <UFormGroup label="To Model" name="toModel">
                  <UInput v-model="toModel" />
                </UFormGroup>
              </div>

              <!-- Textarea -->
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
              <!-- Left side: Input field and Find button -->
              <div class="w-3/4 flex flex-col">
                <div class="flex justify-between items-center">
                  <!-- Input field -->
                  <UFormGroup
                    class="flex-1"
                    label="Parts and Affect"
                    name="PartsAffect"
                  >
                    <UInput  class="h-full" />
                  </UFormGroup>
                  <UButton
                    class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[30px] ml-[10px]"
                  >
                    Fiend
                  </UButton>
                </div>
              </div>

              <!-- Right side: Find button and Textarea -->
              <div class="w-3/4 flex flex-col">
                <div class="flex justify-between items-center">
                  <h2 class="text-left">Products Affected</h2>
                  <UButton
                  
                    class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[30px]"
                  >
                    Find
                  </UButton>
                </div>
              </div>
            </div>

            <div class="flex flex-row space-x-4">
              <!-- Left side: Input field and Find button -->
              <div class="w-3/4 flex flex-col">
                <UTextarea v-model="PartsAffect"  class="w-full" />
              </div>

              <!-- Right side: Find button and Textarea -->
              <div class="w-3/4 flex flex-col">
                <UTextarea v-model=" ProductAffect" class="w-full" />
              </div>
            </div>

            <div class="flex flex-row space-x-4">
              <!-- Left side: Input field and Find button -->
              <div class="w-3/4 flex flex-col">
                <div class="flex justify-between items-center">
                  <!-- Input field -->
                  <UFormGroup class="flex-1" name="firstInput">
                    <UInput class="h-full" />
                  </UFormGroup>
                  <UButton
                    class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[10px] ml-[10px]"
                  >
                    Remove
                  </UButton>
                </div>
              </div>

              <!-- Right side: Find button and Textarea -->
              <div class="w-3/4 flex flex-col">
                <div class="flex justify-between items-center">
                  <!-- Input field -->
                  <UFormGroup class="flex-1" name="firstInput">
                    <UInput class="h-full" />
                  </UFormGroup>
                  <UButton
                    class="mb-2 px-[5px] w-1/4 text-white bg-red-500 hover:bg-red-600 flex justify-center items-center mt-[10px] ml-[10px]"
                  >
                    Remove
                  </UButton>
                </div>
              </div>
            </div>

            <UDivider />

            <div class="space-y-2">
              <div v-for="role in roles" :key="role" class="mb-4">
                <UFormGroup>
                  <div class="flex items-center space-x-4">
                    <div
                      class="flex items-center"
                      v-if="
                        ['Engineering', 'Marketing', 'Manufacturing'].includes(
                          role
                        )
                      "
                    >
                      <UCheckbox
                        v-model="formState[role.toLowerCase()].checked"
                        :value="role"
                        :name="'roleSelection'"
                      />
                      <span class="font-medium ml-2">{{ role }}</span>
                    </div>

                    <!-- Column 2: Product Line Dropdown -->
                    <div class="basis-1/5 max-w-[300px] min-w-[150px]">
                      <!-- <UFormGroup name="employeeData">
                        <USelect
                          v-model="formState[role.toLowerCase()].employeeData"
                          :options="employeeOptions"
                          @change="handleFilterChange()"
                        />
                      </UFormGroup> -->
                      <!-- <UFormGroup name="employeeData">
                        <USelect
                          v-model="formState[role.toLowerCase()].employeeData"
                          :options="
                            role === 'Complete'
                              ? SignatureList
                              : employeeOptions
                          "
                       
                        />
                      </UFormGroup> -->
                      <UFormGroup name="employeeData">
                        <UInputMenu
                          v-if="role === 'Complete'"
                          v-model="formState[role.toLowerCase()].signatureListData"
                          :options="SignatureList"
                        />
                        <UInputMenu
                          v-if="
                            [
                              'Originator',
                              'Engineering',
                              'Marketing',
                              'Manufacturing',
                              
                            ].includes(role)
                          "
                          v-model="formState[role.toLowerCase()].employeeData"
                          :options="employeeOptions"
                        />
                      </UFormGroup>
                    </div>

                    <!-- Column 3: Date Input -->
                    <UInput
                      v-model="formState[role.toLowerCase()].dateOrder"
                      type="date"
                      class="w-40 pt-[22px]"
                    />

                    <!-- Column 4: Yes/No/TBD Radio Buttons -->
                    <div
                      v-if="
                        [
                          'Engineering',
                          'Marketing',
                          'Manufacturing',
                          'Complete',
                        ].includes(role)
                      "
                      class="flex space-x-4"
                    >
                      <label class="flex items-center space-x-2">
                        <URadio
                          v-model="formState[role.toLowerCase()].approval"
                          value="yes"
                          :name="`${role}Approval`"
                        />
                        <span>Yes</span>
                      </label>
                      <label class="flex items-center space-x-2">
                        <URadio
                          v-model="formState[role.toLowerCase()].approval"
                          value="no"
                          :name="`${role}Approval`"
                        />
                        <span>No</span>
                      </label>
                      <label class="flex items-center space-x-2">
                        <URadio
                          v-model="formState[role.toLowerCase()].approval"
                          value="tbd"
                          :name="`${role}Approval`"
                        />
                        <span>TBD</span>
                      </label>
                    </div>

                    <!-- Column 5: Comments Input -->
                    <UInput
                      v-model="formState[role.toLowerCase()].comments"
                      placeholder="Comments"
                      class="flex-grow"

                      v-if="
                        [
                          'Engineering',
                          'Marketing',
                          'Manufacturing',
                          'Complete',
                        ].includes(role)
                      "
                    />
                  </div>
                </UFormGroup>
              </div>
            </div>
          </UForm>
        </UCard>

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
          
          color="red" label="Clear Form" icon="i-heroicons-trash" />


          <UButton color="gray" label="Preview ECO" icon="i-heroicons-eye" />
        </div>
        <!-- </UContainer> -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
