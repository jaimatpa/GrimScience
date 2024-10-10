<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import { ref } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import workCenter from "~/server/api/employees/workCenter";
import type { UTableColumn } from "~/types";
import PurchaseDetails from "../vendors/PurchaseDetails.vue";
import InventoryTransactions from "../transactions/InventoryTransactions.vue";
import ProductsForm from "~/components/products/ProductsForm.vue";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedParts: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
  selectedPartInstace: {
    type: [String, Number, null],
    required: true,
  },
  selectedPartModel: {
    type: [String, Number, null],
    required: true,
  },
});

const selectedPartsID = ref();
console.log("Parets ID-------", props.selectedParts);
console.log("Part Instace--------", props.selectedPartInstace);
console.log("Part Model--------", props.selectedPartModel);

const locationGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "location",
      label: "Locations",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const usedOnGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "Expr1",
      label: "Used On",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const revisionsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "code",
      label: "Action",
    },
    {
      key: "today",
      label: "Date",
    },
    {
      key: "revisedby",
      label: "Revision By",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const purchaseGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "ponumber",
      label: "PO Number",
    },
    {
      key: "uniqueid",
      label: "Unique ID",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "NAME",
      label: "Name",
    },
    {
      key: "ORDERED",
      label: "Ordered",
    },
    {
      key: "RECEIVED",
      label: "Received",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const inventoryGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "UID",
      label: "Unique ID",
    },
    {
      key: "QtyChange",
      label: "QTY",
    },
    // {
    //   key: "onhandITD",
    //   label: "OnhandITD",
    // },
    {
      key: "Dated",
      label: "Date",
    },
  ],
  options: [],
  selectedOption: null,
  isLoading: false,
});

const jobDetailsGridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "number",
      label: "Number",
    },
    {
      key: "required",
      label: "Required",
    },
  ],
  options: [],
  totalRequired: null,
  ordered: null,
  available: null,
  selectedOption: null,
  isLoading: false,
});

const toast = useToast();
const loadingOverlay = ref(false);
const partsExist = ref(true);
const category = ref([]);
const subCategory = ref([]);
const vendorList = ref();
const partUnit = ref([]);
const insepctionList = ref([]);
const accountList = ref([]);
const inventoryList = ref([]);
const revisedByList = ref([]);

const formData = reactive({
  UniqueID: null,
  instanceID: null,
  oldproductid: null,
  oldpartid: null,
  partflag: 1,
  subassemblyflag: null,
  productflag: null,
  supplyflag: null,
  ALTER2LEADTIME: null,
  ALTER2MANTXT: null,
  ALTER2MANNUM: null,
  ALTER2DEATXT: null,
  ALTER2DEANUM: null,
  ALTER2QTY1: null,
  ALTER2QTY2: null,
  ALTER2QTY3: null,
  ALTER2QTY4: null,
  ALTER2QTY5: null,
  ALTER2PRICE1: null,
  ALTER2PRICE4: null,
  ALTER2PRICE3: null,
  ALTER2PRICE2: null,
  ALTER2PRICE5: null,
  ALTER1LEADTIME: null,
  ALTER1MANTXT: null,
  ALTER1MANNUM: null,
  ALTER1DEATXT: null,
  ALTER1DEANUM: null,
  ALTER1QTY1: null,
  ALTER1QTY2: null,
  ALTER1QTY4: null,
  ALTER1QTY3: null,
  ALTER1PRICE1: null,
  ALTER1PRICE4: null,
  ALTER1PRICE3: null,
  ALTER1PRICE2: null,
  ALTER1PRICE5: null,
  ALTER1QTY5: null,
  PRIMARYQTY5: null,
  PRIMARYPRICE5: null,
  PRIMARYPRICE2: null,
  PRIMARYPRICE3: null,
  PRIMARYPRICE4: null,
  PRIMARYPRICE1: null,
  PRIMARYQTY3: null,
  PRIMARYQTY4: null,
  PRIMARYQTY2: null,
  PRIMARYQTY1: null,
  PRIMARYDEANUM: null,
  PRIMARYDEATXT: null,
  PRIMARYMANNUM: null,
  PRIMARYMANTXT: null,
  PRIMARYLEADTIME: null,
  SELLINGPRICE: null,
  SUBCATEGORY: null,
  PARTTYPE: null,
  SPECIFICATIONS: null,
  DESCRIPTION: null,
  STOCKNUMBER: null, //find qtyordered from MRP2
  UNIT: null,
  MULTIPLE: null,
  PRODUCTLINE: null,
  MODEL: null,
  WARRENTY: null,
  SHIPWEIGHT: null,
  NETWEIGHTFULL: null,
  ELECTRICAL: null,
  NETWEIGHT: null,
  OnHand: null,
  AdjustedAmount: null,
  Reason: null,
  COMMENT: null,
  ORDERCOST: null,
  WORKCENTERS: null,
  ALTER2UL: null,
  ALTER1UL: null,
  PRIMARYUL: null,
  DRAWINGCUSTOM: null,
  EQUIPMENTFLAG: null,
  PlanID: null,
  GeneralType: null,
  AccountNumber: null,
  InventoryUnit: null,
  InventoryCost: null,
  HEIGHT: null,
  WIDTH: null,
  LENGTH: null,
  SPECSHEET: null,
  TANKDEPTH: null,
  WAXCAPACITY: null,
  CRYOTHERMSECTIONS: null,
  CRYOTHERMWALLS: null,
  CRYTHERMGALLONSLEFT: null,
  CRYOTHERMGALLONSRIGHT: null,
  CRYTHERMCATEGORY: null,
  DURALASTSUBCATEGORY: null,
  DURALASTCATEGORY: null,
  PARADYNAMIXSUBCATEGORY: null,
  PARADYNAMIXCATEGORY: null,
  CRYOTHERMWARMTANKSWITCHABLE: null,
  VariablePricing: null,
  minimum: null,
  CryothermCorianNumber: null,
  CryothermPcoatNumber: null,
  CryothermLeftFrame: null,
  CryothermLeftTank: null,
  CryothermLeftPump: null,
  CryothermLeftJets: null,
  CryothermLeftCunitNumber: null,
  CryothermRightFrame: null,
  CryothermRightTank: null,
  CryothermRightPump: null,
  CryothermRightJets: null,
  CrythermRightCunitnumber: null,
  InspectionLevel: null,
  MDET: null,
  MDET1: null,
  SubassemblyInventoried: null,
  ETLCriticalComponent: null,
  override: null,
  BuiltInHouse: null,
  grossprofit: null,
  CryoThermControlPanelNumber: null,
  CryoThermHeaterNumber: null,
  amps: null,
  sds: null,
  LeftTankAssembly: null,
  RightTankAssembly: null,
  CODE: null,
  TODAY: null, // YYYY-MM-DD HH:MM:SS
  RevisedBy: "#41 Leith Stetson",
  Recommendations: null,
  StatementOfNeed: null,
  SupportorProject: null,
});

const getPartsData = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/materials/parts/parts/${selectedPartsID.value}`, {
    method: "GET",
    onResponse({ response }) {
      console.log("Get by ID ----", response);

      if (response.status === 200) {
        loadingOverlay.value = false;
        partsExist.value = true;
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key];
          }
        }
      }
    },
    onResponseError({}) {
      partsExist.value = false;
    },
  });
  loadingOverlay.value = false;
};

const editInit = async () => {
  selectedPartsID.value = props.selectedParts;
  getPartsData();
  loadingOverlay.value = true;
  propertiesInit();
  loadingOverlay.value = false;
};

const subCategoryList = async () => {
  await useApiFetch(`/api/materials/parts/${formData.PARTTYPE}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        subCategory.value = response._data.body;
      }
    },
    onResponseError() {
      subCategory.value = [];
    },
  });
};

const propertiesInit = async () => {
  loadingOverlay.value = true;

  await useApiFetch("/api/materials/parts/categoryList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        category.value = response._data.body;
      }
    },
    onResponseError() {
      category.value = [];
    },
  });

  await useApiFetch("/api/common/getInspectionNumbers", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        insepctionList.value = response._data.body;
      }
    },
    onResponseError() {
      insepctionList.value = [];
    },
  });

  await useApiFetch("/api/common/partUnit", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        partUnit.value = response._data.body
          .map((item) => item.unit)
          .filter((unit) => unit !== null && unit !== undefined);
      }
    },
    onResponseError() {
      partUnit.value = [];
    },
  });

  await useApiFetch("/api/common/inventoryList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        inventoryList.value = response._data.body;
      }
    },
    onResponseError() {
      inventoryList.value = [];
    },
  });

  await useApiFetch("/api/materials/parts/accountsList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        accountList.value = response._data.body;
      }
    },
    onResponseError() {
      accountList.value = [];
    },
  });

  await useApiFetch("/api/materials/parts/getVendor", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        vendorList.value = response._data.body;
      }
    },
    onResponseError() {
      vendorList.value = [];
    },
  });

  await useApiFetch(
    `/api/materials/parts/parts/transactions?model=${props.selectedPartModel}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          inventoryGridMeta.value.options = response._data.body;
        }
      },
      onResponseError() {
        inventoryGridMeta.value.options = [];
      },
    }
  );

  await useApiFetch(
    `/api/materials/parts/parts/podetails?instanceId=${props.selectedPartInstace}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          purchaseGridMeta.value.options = response._data.body;
        }
      },
      onResponseError() {
        purchaseGridMeta.value.options = [];
      },
    }
  );

  await useApiFetch(
    `/api/materials/parts/totalRequired?model=${props.selectedPartModel}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          jobDetailsGridMeta.value.options = response._data.body.jobs;
          jobDetailsGridMeta.value.ordered = response._data.body.ordered;
          jobDetailsGridMeta.value.totalRequired =
            response._data.body.totalRequired;

          jobDetailsGridMeta.value.available =
            formData.OnHand +
            jobDetailsGridMeta.value.ordered -
            jobDetailsGridMeta.value.totalRequired;
        }
      },
      onResponseError() {
        jobDetailsGridMeta.value.options = [];
      },
    }
  );

  await useApiFetch("/api/materials/workcenter", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        if (formData.WORKCENTERS) {
          const workCenterIds = formData.WORKCENTERS.split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "");

          const filteredResponse = response._data.filter((val) =>
            workCenterIds.includes(val.UniqueId)
          );
          locationGridMeta.value.options = filteredResponse;
        }
      }
    },
    onResponseError() {
      revisionsGridMeta.value.options = [];
    },
  });

  await useApiFetch("/api/materials/vendors/usedOn", {
    method: "GET",
    query: {
        instanceId: props.selectedPartInstace,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        usedOnGridMeta.value.options = response._data;
      }
    },
    onResponseError() {
      usedOnGridMeta.value.options = [];
    },
  });

  getRevisions();
  loadingOverlay.value = false;
};

if (selectedPartsID.value !== null) editInit();
else propertiesInit();

const files = ref([null, null, null]);
const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    files.value[index] = file;
  } else {
    event.target.value = "";
  }
};
const fileUpload = async (event: FormSubmitEvent<any>) => {
  const formData = new FormData();
  const fileTypes = ["Drawing/Manual", "PDS", "SDS"];

  files.value.forEach((file, index) => {
    if (file) {
      formData.append(fileTypes[index], file);
    }
  });

  try {
    const response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });
    toast.add({
      title: "Success",
      description: "Files Added successfully!",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
    if (response.ok) {
      const responseData = await response.json();
      responseData.files.forEach((file) => {
        if (file.fileType === "Drawing/Manual") {
          event.data.DRAWINGCUSTOM = file.url;
        }
        if (file.fileType === "PDS") {
          event.data.SPECSHEET = file.url;
        }
        if (file.fileType === "SDS") {
          event.data.sds = file.url;
        }
      });

      files.value = [null, null, null];
    } else {
      throw new Error("Upload failed!");
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("An error occurred while uploading the files. Please try again.");
  }
};

const getRevisions = async () => {
  await useApiFetch(
    `/api/materials/parts/revisions?instanceId=${props.selectedPartInstace}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          revisionsGridMeta.value.options = response._data.body;
          revisedByList.value = [
            ...new Set(
              response._data.body
                .map((id) => id.revisedby)
                .filter((value) => value !== null && value !== "")
            ),
          ];
        }
      },
      onResponseError() {
        revisionsGridMeta.value.options = [];
      },
    }
  );
};

// function formatDate(date: Date): string {
//   return format(date, "yyyy-MM-dd HH:mm:ss");
// }

const revision = async (event: FormSubmitEvent<any>) => {
  fileUpload(event);
  if (event.data.SubassemblyInventoried === true) {
    event.data.SubassemblyInventoried = -1;
  }
  if (event.data.override === true) {
    event.data.override = -1;
  }

  if (props.selectedPartInstace != null) {
    await useApiFetch(
      `/api/materials/parts/parts/revision?instanceIdForRevision=${props.selectedPartInstace}&id=${selectedPartsID.value}`,
      {
        method: "PUT",
        body: event.data,
        onResponse({ response }) {
          if (response.status === 200) {
            toast.add({
              title: "Success",
              description: "Revision Added successfully!",
              icon: "i-heroicons-check-circle",
              color: "green",
            });
          }
        },
      }
    );
  }
  getRevisions();
};

const onSubmit = async (event: FormSubmitEvent<any>) => {
  fileUpload(event);
  if (event.data.SubassemblyInventoried === true) {
    event.data.SubassemblyInventoried = -1;
  }
  if (event.data.override === true) {
    event.data.override = -1;
  }

  if (selectedPartsID.value != null) {
    const now = new Date();
    const isoString = now.toISOString();
    event.data.TODAY = isoString;

    await useApiFetch(`/api/materials/parts/parts/${selectedPartsID.value}`, {
      method: "PUT",
      body: event.data,
      onResponse({ response }) {
        console.log("PUT", response);
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
  } else {
    event.data.CODE = "Initial";
    await useApiFetch(`/api/materials/parts/parts/${selectedPartsID.value}`, {
      method: "POST",
      body: event.data,
      onResponse({ response }) {
        console.log("POST", response);
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
  }
  emit("save");
};

const onReviusedBySelect = async (row) => {
  revisionsGridMeta.value.selectedOption = row?.uniqueid;
  selectedPartsID.value = row?.uniqueid;
  getPartsData();

  revisionsGridMeta.value.options.forEach((inventory) => {
    inventory.class = inventory.uniqueid === row.uniqueid ? "bg-green-400" : "";
  });
};

const onInventorySelect = async (row) => {
  inventoryGridMeta.value.selectedOption = row;
};

const onPurchaseSelect = async (row) => {
  const purchaseData = {
    PONUMBER: row?.ponumber,
    NAME: row?.NAME, 
    ORDERED: row?.ORDERED,
    RECEIVED: row?.RECEIVED,
    DATE: row?.date,        
  };
  if(purchaseData){
    purchaseGridMeta.value.selectedOption = purchaseData;
  }
};

const usedOnSelect = async (row) => {
  usedOnGridMeta.value.selectedOption = row?.instanceID;
};

const onTableBtnClick = (name: any) => {
  if (name === "inventory") {
    if (inventoryGridMeta.value.selectedOption !== null) {
      console.log('TTTTTTTTTTTT', inventoryGridMeta.value.selectedOption);
      
      modalMeta.value.isInventoryModalOpen = true;
    } else {
      toast.add({
        title: "Failed",
        description: "Please select an inventory item!",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    }
  }

  if (name === "purchase") {
    if (purchaseGridMeta.value.selectedOption !== null) {
      modalMeta.value.isPurchaseModalOpen = true;
    } else {
      toast.add({
        title: "Failed",
        description: "Please select a purchase item!",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    }
  }

  if (name === "usedOn") {
    if (usedOnGridMeta.value.selectedOption !== null) {
      modalMeta.value.isProductsModalOpen = true;
    } else {
      toast.add({
        title: "Failed",
        description: "Please select a used on product item!",
        icon: "i-heroicons-check-circle",
        color: "red",
      });
    }
  }

  if (name === "location") {
    modalMeta.value.isWorkCenterModalOpen = true;
  }
};

const optionOnhandITD = () => {
  if (inventoryGridMeta.value.options.length > 0) {
    inventoryGridMeta.value.options.forEach((inventory) => {
      inventory.class = inventory.onhandITD > 0 ? "bg-orange-400" : undefined;
    });
  }
};

const modalMeta = ref({
  isProductsModalOpen: false,
  isWorkCenterModalOpen: false,
  isInventoryModalOpen: false,
  isPurchaseModalOpen: false,
  modalTitle: "New Modal",
});

watch(
  () => inventoryGridMeta.value.options,
  (newVal) => {
    if (newVal) {
      optionOnhandITD();
    }
  }
);

watch(
  () => formData.PARTTYPE,
  (newVal) => {
    if (newVal) {
      subCategoryList();
    }
  }
);
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
  <template v-if="!props.isModal && !partsExist">
    <CommonNotFound
      :name="'Parts not found!'"
      :message="'The parts you are looking for does not exist!'"
      :to="'/materials/parts'"
    />
  </template>

  <template v-else>
    <UForm :state="formData" class="space-y-4" @submit="onSubmit">
      <div class="overflow-auto">
        <div class="space-y-4">
          <div class="gmsBlueTitlebar ps-2 py-1.5 text-white font-bold">
            Part Information
          </div>

          <div class="flex flex-row space-x-4">
            <UCheckbox
              v-model="formData.SubassemblyInventoried"
              :checked="formData.SubassemblyInventoried === '-1'"
              label="Job Subassembly"
              class="basis-1/4"
            />
            <UCheckbox
              v-model="formData.ETLCriticalComponent"
              :checked="formData.ETLCriticalComponent === true"
              label="ETL Critical Component"
              class="basis-1/4"
            />
            <UCheckbox
              v-model="formData.override"
              :checked="formData.override === '-1'"
              label="Selling Price Override"
              class="basis-1/4"
            />
            <UCheckbox
              v-model="formData.BuiltInHouse"
              :checked="formData.BuiltInHouse === true"
              label="Ignore Manufacturing Cost"
              class="basis-1/4"
            />
          </div>

          <div class="flex flex-row space-x-4">
            <div class="basis-1/4 space-y-1">
              <label>Category</label>
              <UInputMenu v-model="formData.PARTTYPE" :options="category" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Sub Category</label>
              <UInputMenu
                v-model="formData.SUBCATEGORY"
                :options="subCategory"
              />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Stock Number</label>
              <UInput v-model="formData.MODEL" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Inspection</label>
              <UInputMenu
                v-model="formData.InspectionLevel"
                :options="insepctionList"
              />
            </div>
          </div>

          <div class="flex flex-row space-x-4">
            <div class="basis-1/4 space-y-1">
              <label>Order Unit</label>
              <UInputMenu v-model="formData.UNIT" :options="partUnit" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Multiple</label>
              <UInput v-model="formData.MULTIPLE" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Inventory Unit</label>
              <UInputMenu
                v-model="formData.InventoryUnit"
                :options="inventoryList"
              />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Account#</label>
              <UInputMenu
                v-model="formData.AccountNumber"
                :options="accountList"
              />
            </div>
          </div>

          <div class="flex flex-row space-x-4">
            <div class="basis-1/4 space-y-1">
              <label>Order Cost</label>
              <UInput v-model="formData.ORDERCOST" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Inventory Cost</label>
              <UInput v-model="formData.InventoryCost" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Selling Price</label>
              <UInput v-model="formData.SELLINGPRICE" />
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Specification</label>
              <UInput v-model="formData.SPECIFICATIONS" />
            </div>
          </div>

          <div class="flex flex-row space-x-4 mb-3">
            <div class="basis-1/4">
              <div class="mb-2">Drawing/Mannul</div>
              <label class="" for="DRAWINGCUSTOM">
                <span
                  v-if="files[0]?.name || formData.DRAWINGCUSTOM"
                  class="bg-gray-400 text-white px-2 py-2 rounded cursor-pointer me-3"
                >
                  Upload
                </span>
                <span
                  :class="
                    !files[0]?.name && !formData.DRAWINGCUSTOM
                      ? 'bg-gray-400 text-white px-3 text-center py-2 rounded'
                      : ''
                  "
                >
                  {{
                    (files[0]?.name?.length > 20
                      ? "..." + files[0]?.name.slice(-20)
                      : files[0]?.name) ||
                    (formData.DRAWINGCUSTOM?.length > 20
                      ? "..." + formData.DRAWINGCUSTOM.slice(-20)
                      : formData.DRAWINGCUSTOM) ||
                    "Upload a file"
                  }}
                </span>
              </label>
              <input
                id="DRAWINGCUSTOM"
                type="file"
                @change="(e) => handleFileChange(e, 0)"
                accept="application/pdf"
                class="hidden"
              />
              <!-- </UFormGroup> -->
            </div>
            <div class="basis-1/4">
              <!-- <UFormGroup label="PDS" name="PDS"> -->
              <div class="mb-2">PDS</div>
              <label class="" for="PDS">
                <span
                  v-if="files[1]?.name || formData.SPECSHEET"
                  class="bg-gray-400 text-white px-2 py-2 rounded cursor-pointer me-3"
                >
                  Upload
                </span>
                <span
                  :class="
                    !files[1]?.name && !formData.SPECSHEET
                      ? 'bg-gray-400 text-white px-3 text-center py-2 rounded'
                      : ''
                  "
                >
                  {{
                    (files[1]?.name?.length > 20
                      ? "..." + files[1]?.name.slice(-20)
                      : files[1]?.name) ||
                    (formData.SPECSHEET?.length > 20
                      ? "..." + formData.SPECSHEET.slice(-20)
                      : formData.SPECSHEET) ||
                    "Upload a file"
                  }}
                </span>
              </label>
              <input
                id="PDS"
                type="file"
                @change="(e) => handleFileChange(e, 1)"
                accept="application/pdf"
                class="hidden"
              />
              <!-- </UFormGroup> -->
            </div>
            <div class="basis-1/4">
              <!-- <UFormGroup label="sds" name="sds"> -->
              <div class="mb-2">SDS</div>
              <label class="" for="sds">
                <span
                  v-if="files[2]?.name || formData.sds"
                  class="bg-gray-400 text-white px-2 py-2 rounded cursor-pointer me-3"
                >
                  Upload
                </span>
                <span
                  :class="
                    !files[2]?.name && !formData.sds
                      ? 'bg-gray-400 text-white px-3 text-center py-2 rounded'
                      : ''
                  "
                >
                  {{
                    (files[2]?.name?.length > 20
                      ? "..." + files[2]?.name.slice(-20)
                      : files[2]?.name) ||
                    (formData.sds?.length > 20
                      ? "..." + formData.sds.slice(-20)
                      : formData.sds) ||
                    "Upload a file"
                  }}
                </span>
              </label>
              <input
                id="sds"
                type="file"
                @change="(e) => handleFileChange(e, 2)"
                accept="application/pdf"
                class="hidden"
              />
              <!-- </UFormGroup> -->
            </div>
            <div class="basis-1/4 space-y-1">
              <label>Description</label>
              <UInput v-model="formData.DESCRIPTION" />
            </div>
          </div>
        </div>

        <div class="space-y-4 mt-4">
          <div class="gmsBlueTitlebar ps-2 py-1.5 text-white font-bold">
            Primary Vendor
          </div>

          <div class="grid grid-cols-3 gap-5">
            <!-- Left Grid Section -->
            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2 space-y-1">
                <label>Manufacturer</label>
                <UInputMenu
                  v-model="formData.PRIMARYMANTXT"
                  :options="vendorList"
                />
              </div>
              <div class="space-y-1">
                <label>Dealer</label>
                <UInputMenu
                  v-model="formData.PRIMARYDEATXT"
                  :options="vendorList"
                />
              </div>
              <div class="space-y-1">
                <label>Lead Time</label>
                <UInput v-model="formData.PRIMARYLEADTIME" />
              </div>
              <div class="col-span-2 space-y-1">
                <label>Last Ordered Date:</label>
                <UInput />
              </div>
            </div>
            <!-- Middle Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div class="space-y-1">
                <label>Part Number</label>
                <UInput v-model="formData.PRIMARYMANNUM" />
              </div>
              <div class="space-y-1">
                <label>Part Number</label>
                <UInput v-model="formData.PRIMARYDEANUM" />
              </div>
              <div class="space-y-1">
                <label>UL Number</label>
                <UInput v-model="formData.PRIMARYUL" />
              </div>
            </div>
            <!-- Right Grid Section -->
            <div class="col-span-1 grid grid-cols-2 gap-5">
              <div class="grid grid-cols-1 gap-1.5">
                <div>Qty</div>
                <UInput v-model="formData.PRIMARYQTY1" />
                <UInput v-model="formData.PRIMARYQTY2" />
                <UInput v-model="formData.PRIMARYQTY3" />
                <UInput v-model="formData.PRIMARYQTY4" />
                <UInput v-model="formData.PRIMARYQTY5" />
              </div>

              <div class="grid grid-cols-1 gap-1.5">
                <div>Price</div>
                <UInput v-model="formData.PRIMARYPRICE1" />
                <UInput v-model="formData.PRIMARYPRICE2" />
                <UInput v-model="formData.PRIMARYPRICE3" />
                <UInput v-model="formData.PRIMARYPRICE4" />
                <UInput v-model="formData.PRIMARYPRICE5" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row gap-5 mt-4 mb-3">
          <div
            class="basis-1/2 gmsBlueTitlebar text-white font-bold ps-2 py-1.5"
          >
            Alternative Vendor #1
          </div>
          <div
            class="basis-1/2 gmsBlueTitlebar text-white font-bold ps-2 py-1.5"
          >
            Alternative Vendor #2
          </div>
        </div>

        <div class="flex flex-row space-x-5 mt-2">
          <!-- Alternative Vendor #1 -->
          <div class="basis-1/2">
            <div class="grid grid-cols-3 gap-5">
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <div>
                      <label class="mb-1">Manufacturer</label>
                      <UInputMenu
                        v-model="formData.ALTER1MANTXT"
                        :options="vendorList"
                      />
                    </div>
                    <div>
                      <label class="mb-1">Dealer</label>
                      <UInputMenu
                        v-model="formData.ALTER1DEATXT"
                        :options="vendorList"
                      />
                    </div>
                    <div>
                      <label class="mb-1">Lead Time</label>
                      <UInput v-model="formData.ALTER1LEADTIME" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div>
                      <label class="mb-1">Part Number</label>
                      <UInput v-model="formData.ALTER1MANNUM" />
                    </div>
                    <div>
                      <label class="mb-1">Part Number</label>
                      <UInput v-model="formData.ALTER1DEANUM" />
                    </div>
                    <div>
                      <label class="mb-1">UL Number</label>
                      <UInput v-model="formData.ALTER1UL" />
                    </div>
                  </div>
                </div>

                <div class="mt-2">
                  <label class="mb-1">Last Ordered Date:</label>
                  <UInput />
                </div>
              </div>

              <div class="col-span-1 grid grid-cols-2 gap-3">
                <div class="grid grid-cols-1 gap-[10px]">
                  <div class="-mb-[15px]">Qty</div>
                  <UInput v-model="formData.ALTER1QTY1" />
                  <UInput v-model="formData.ALTER1QTY2" />
                  <UInput v-model="formData.ALTER1QTY3" />
                  <UInput v-model="formData.ALTER1QTY4" />
                  <UInput v-model="formData.ALTER1QTY5" />
                </div>
                <div class="grid grid-cols-1 gap-[10px]">
                  <div class="-mb-[15px]">Price</div>
                  <UInput v-model="formData.ALTER1PRICE1" />
                  <UInput v-model="formData.ALTER1PRICE2" />
                  <UInput v-model="formData.ALTER1PRICE3" />
                  <UInput v-model="formData.ALTER1PRICE4" />
                  <UInput v-model="formData.ALTER1PRICE5" />
                </div>
              </div>
            </div>
          </div>

          <!-- Alternative Vendor #2 -->
          <div class="basis-1/2">
            <div class="grid grid-cols-3 gap-5">
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <div>
                      <label class="mb-1">Manufacturer</label>
                      <UInputMenu
                        v-model="formData.ALTER2MANTXT"
                        :options="vendorList"
                      />
                    </div>
                    <div>
                      <label class="mb-1">Dealer</label>
                      <UInputMenu
                        :options="vendorList"
                        v-model="formData.ALTER2DEATXT"
                      />
                    </div>
                    <div>
                      <label class="mb-1">Lead Time</label>
                      <UInput v-model="formData.ALTER2LEADTIME" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div>
                      <label class="mb-1">Part Number</label>
                      <UInput v-model="formData.ALTER2MANNUM" />
                    </div>
                    <div>
                      <label class="mb-1">Part Number</label>
                      <UInput v-model="formData.ALTER2DEANUM" />
                    </div>
                    <div>
                      <label class="mb-1">UL Number</label>
                      <UInput v-model="formData.ALTER2UL" />
                    </div>
                  </div>
                </div>

                <div class="mt-2">
                  <label class="mb-1">Last Ordered Date:</label>
                  <UInput />
                </div>
              </div>

              <div class="col-span-1 grid grid-cols-2 gap-3">
                <div class="grid grid-cols-1 gap-[10px]">
                  <div class="-mb-[15px]">Qty</div>
                  <UInput v-model="formData.ALTER2QTY1" />
                  <UInput v-model="formData.ALTER2QTY2" />
                  <UInput v-model="formData.ALTER2QTY3" />
                  <UInput v-model="formData.ALTER2QTY4" />
                  <UInput v-model="formData.ALTER2QTY5" />
                </div>
                <div class="grid grid-cols-1 gap-[10px]">
                  <div class="-mb-[15px]">Price</div>
                  <UInput v-model="formData.ALTER2PRICE1" />
                  <UInput v-model="formData.ALTER2PRICE2" />
                  <UInput v-model="formData.ALTER2PRICE3" />
                  <UInput v-model="formData.ALTER2PRICE4" />
                  <UInput v-model="formData.ALTER2PRICE5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="gmsBlueTitlebar text-white font-bold ps-2 py-1.5 mt-4 mb-3">
          Inventory
        </div>

        <div class="flex flex-row space-x-8">
          <div class="basis-3/5">
            <div class="-mt-2 font-bold">Purchases</div>
            <UTable
              :rows="purchaseGridMeta.options"
              :columns="purchaseGridMeta.defaultColumns"
              class="h-60 w-full mt-2"
              @select="onPurchaseSelect"
              @dblclick="onTableBtnClick('purchase')"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
          </div>

          <div class="basis-2/5">
            <div class="-mt-2 font-bold">Inventory Transactions</div>
            <UTable
              :columns="inventoryGridMeta.defaultColumns"
              :rows="inventoryGridMeta.options"
              class="h-60 w-full mt-2"
              @select="onInventorySelect"
              @dblclick="onTableBtnClick('inventory')"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
          </div>
        </div>

        <div class="gmsBlueTitlebar h-8 w-full mt-5 mb-3"></div>

        <div class="grid grid-cols-5 gap-5">
          <div class="col-span-1 mt-2">
            <div class="mb-2 grid grid-cols-2 gap-3">
              <label class="ms-auto my-auto">On Order</label>
              <UInput v-model="jobDetailsGridMeta.ordered" />
            </div>
            <div class="mb-2 grid grid-cols-2 gap-3">
              <label class="ms-auto my-auto">On Hand</label>
              <UInput v-model="formData.OnHand" />
            </div>
            <div class="mb-2 grid grid-cols-2 gap-3">
              <label class="ms-auto my-auto">Required</label>
              <UInput v-model="jobDetailsGridMeta.totalRequired" />
            </div>
            <div class="mb-2 grid grid-cols-2 gap-3">
              <label class="ms-auto my-auto">Available</label>
              <UInput v-model="jobDetailsGridMeta.available" />
            </div>
            <div class="mb-2 grid grid-cols-2 gap-3">
              <label class="ms-auto my-auto">Minimum</label>
              <UInput v-model="formData.minimum" />
            </div>
          </div>

          <div class="col-span-1 mt-2">
            <label class="font-bold">Comments</label>
            <UTextarea
              class="w-full h-full mt-3"
              :rows="7"
              v-model="formData.COMMENT"
            />
          </div>
          <!-- Used on Table -->
          <div class="col-span-1">
            <UTable
              :rows="usedOnGridMeta.options"
              :columns="usedOnGridMeta.defaultColumns"
              @select="usedOnSelect"
              @dblclick="onTableBtnClick('usedOn')"
              class="h-[184px] w-full mt-2"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
          </div>
          <!-- Job Details Table -->
          <div class="col-span-1">
            <div class="font-bold">Jobs</div>
            <UTable
              :rows="jobDetailsGridMeta.options"
              :columns="jobDetailsGridMeta.defaultColumns"
              class="h-40 w-full mt-2"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
          </div>
          <!-- Location Table -->
          <div class="col-span-1 space-y-2">
            <UTable
              :rows="locationGridMeta.options"
              :columns="locationGridMeta.defaultColumns"
              class="h-[150px] w-full mt-2"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
            <UButton
              color="cyan"
              variant="outline"
              @click="onTableBtnClick('location')"
              label="Select work center"
              class="w-full flex justify-center"
            />
          </div>
        </div>

        <div class="gmsBlueTitlebar text-white font-bold ps-2 py-1.5 my-3">
          Revision History
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="col-span-1 overflow-auto">
            <UTable
              :columns="revisionsGridMeta.defaultColumns"
              :rows="revisionsGridMeta.options"
              class="h-40 w-full"
              @select="onReviusedBySelect"
              :ui="{
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: {
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0 pb-2',
                },
                td: {
                  padding: 'py-1',
                },
              }"
              :empty-state="{
                icon: 'i-heroicons-circle-stack-20-solid',
                label: 'No items.',
              }"
            />
          </div>

          <div class="col-span-1 flex flex-col justify-between">
            <div>
              <div class="mb-2">Revised By</div>
              <div class="flex gap-8">
                <UInputMenu
                  v-model="formData.RevisedBy"
                  :options="revisedByList"
                  class="w-full"
                />
                <UButton
                  color="cyan"
                  :disabled="props.selectedPartInstace == null"
                  variant="outline"
                  @click="revision({ data: formData })"
                  label="Revision"
                  class="px-7"
                />
              </div>
            </div>
            <div class="flex justify-center">
              <UButton
                color="cyan"
                variant="outline"
                type="submit"
                label="Save"
                class="px-10"
              />
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </template>

  <!-- Purchase Modal -->
  <UDashboardModal v-model="modalMeta.isPurchaseModalOpen" title="View Purchase" class="h-[50vh] overflow-y-auto"
    :ui="{
        title: 'text-lg',
        header: {
          base: 'flex flex-row min-h-[0] items-center',
          padding: 'pt-5 sm:px-9',
        },
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'container sm:max-w-9xl',
        height: 'h-[500px]',
      }">
    <PurchaseDetails :is-creating="false" :modal-data="purchaseGridMeta.selectedOption"></PurchaseDetails>
  </UDashboardModal>

  <!-- Inventory Modal -->
  <UDashboardModal
    v-model="modalMeta.isInventoryModalOpen" title="Inventory Transactions" class="h-[50vh] overflow-y-auto"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-9xl',
    }"
  >
    <InventoryTransactions :selected-Order="inventoryGridMeta.selectedOption"></InventoryTransactions>
  </UDashboardModal>

  <!-- Products Modal -->
  <UDashboardModal v-model="modalMeta.isProductsModalOpen" title="Products" class="h-[50vh] overflow-y-auto"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-9xl',
    }"
  >
  <ProductsForm
    :selected-product="usedOnGridMeta.selectedOption"
    :is-modal="true"
  />
  </UDashboardModal>

  <!-- Locations Modal -->
  <UDashboardModal
    v-model="modalMeta.isWorkCenterModalOpen"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-9xl',
    }"
  >
    <div>Locations Modal</div>
  </UDashboardModal>
</template>
