<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import { ref, computed, watch } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import type { UTableColumn } from "~/types";
import PurchaseDetails from "../vendors/PurchaseDetails.vue";
import InventoryTransactions from "../transactions/InventoryTransactions.vue";
import ProductsForm from "~/components/products/ProductsForm.vue";

const emit = defineEmits(["close", "save", "refresh"]);
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
  allOptions: [],
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
      label: "PO#",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "ORDERED",
      label: "Ordered",
    },
    {
      key: "RECEIVED",
      label: "Received",
    },
    {
      key: "NAME",
      label: "Name",
    },
    {
      key: "uniqueid",
      label: "ID",
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
      label: "#",
    },
    {
      key: "Dated",
      label: "Date",
    },
    {
      key: "QtyChange",
      label: "QTY",
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
      label: "Jobs",
    },
    {
      key: "required",
      label: "",
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
  STOCKNUMBER: null,
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
        locationGridMeta.value.allOptions = response._data.map((item) => ({
          label: item.location,
          value: item.UniqueId,
        }));

        // if (formData.WORKCENTERS) {
        //   const workCenterIds = formData.WORKCENTERS.split(",")
        //     .map((id) => id.trim())
        //     .filter((id) => id !== "");

        //   const filteredResponse = response._data.filter((val) =>
        //     workCenterIds.includes(val.UniqueId)
        //   );
        //   locationGridMeta.value.options = filteredResponse;
        // }

        if (formData.WORKCENTERS) {
          const workCenterIds = formData.WORKCENTERS.split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "");
          selectedWorkCenterIds.value = workCenterIds;
          updateLocationTable(workCenterIds);
        }
      }
    },
    onResponseError() {
      locationGridMeta.value.options = [];
      locationGridMeta.value.allOptions = [];
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
  loadingOverlay.value = true;
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
  loadingOverlay.value = false;
  getRevisions();
};

const onAdd = async (event: FormSubmitEvent<any>) => {
  loadingOverlay.value = true;
  fileUpload(event);
  if (event.data.SubassemblyInventoried === true) {
    event.data.SubassemblyInventoried = -1;
  }
  if (event.data.override === true) {
    event.data.override = -1;
  }
  event.data.CODE = "Initial";
  await useApiFetch(`/api/materials/parts/parts/${selectedPartsID.value}`, {
    method: "POST",
    body: event.data,
    onResponse({ response }) {
      console.log("POST", response);
      if (response.status === 200) {
        toast.add({
          title: "Add Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
    },
  });
  loadingOverlay.value = false;
  emit("save");
};

const onEdit = async (event: FormSubmitEvent<any>) => {
  loadingOverlay.value = true;
  fileUpload(event);
  if (event.data.SubassemblyInventoried === true) {
    event.data.SubassemblyInventoried = -1;
  }
  if (event.data.override === true) {
    event.data.override = -1;
  }

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
          title: "Modify Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      }
    },
  });
  loadingOverlay.value = false;
  emit("save");
};

const onDelete = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/materials/parts/parts/${selectedPartsID.value}`, {
    method: "DELETE",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-trash-solid",
          color: "green",
        });
      }
    },
  });
  loadingOverlay.value = false;
  emit("save");
};

const onRefresh = async () => {
  selectedPartsID.value = null;

  for (const key in formData) {
    formData[key] = null;
  }
  formData.partflag = 1;
  formData.RevisedBy = "#41 Leith Stetson";

  revisionsGridMeta.value.options = [];
  usedOnGridMeta.value.options = [];
  purchaseGridMeta.value.options = [];
  inventoryGridMeta.value.options = [];
  locationGridMeta.value.options = [];
  jobDetailsGridMeta.value.options = [];

  emit("refresh");
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
  if (purchaseData) {
    purchaseGridMeta.value.selectedOption = purchaseData;
  }
};

const usedOnSelect = async (row) => {
  usedOnGridMeta.value.selectedOption = row?.instanceID;
};

const onTableBtnClick = (name: any) => {
  if (name === "inventory") {
    if (inventoryGridMeta.value.selectedOption !== null) {
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

const selectedWorkCenterIds = ref([]);

const selectedWorkCenterObjects = computed(() =>
  locationGridMeta.value.allOptions.filter((option) =>
    selectedWorkCenterIds.value.includes(option.value)
  )
);

const handleSelectionUpdate = (newSelection) => {
  const newIds = newSelection.map((item) => item.value);
  selectedWorkCenterIds.value = newIds;
  updateFormDataWorkcenters();
};

const updateFormDataWorkcenters = () => {
  const uniqueValues = [...new Set(selectedWorkCenterIds.value)].filter(
    Boolean
  );
  formData.WORKCENTERS =
    uniqueValues.length > 0 ? `,${uniqueValues.join(",")},` : "";
  updateLocationTable(uniqueValues);
};

const isSelected = (option) =>
  selectedWorkCenterIds.value.includes(option.value);

const updateLocationTable = (selectedIds) => {
  locationGridMeta.value.options = locationGridMeta.value.allOptions
    .filter((option) => selectedIds.includes(option.value))
    .map((option) => ({
      location: option.label,
      UniqueId: option.value,
    }));
  console.log("formData.WORKCENTERS", formData.WORKCENTERS);
};

watch(
  () => formData.WORKCENTERS,
  (newVal) => {
    if (newVal === null || newVal === undefined || newVal === "") {
      locationGridMeta.value.options = [];
      selectedWorkCenterIds.value = [];
      return;
    }
    const workCenterIds = newVal
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    selectedWorkCenterIds.value = workCenterIds;
    updateLocationTable(workCenterIds);
  },
  { immediate: true }
);

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
    <UForm :state="formData" class="space-y-4">
      <div class="flex flex-col container">
        <div class="flex">
          <div class="basis-1/2 border-r-[3px] border-black">
            <div
              class="w-full px-3 py-1 gmsBlueTitlebar flex flex-row justify-between"
            >
              <div>Part Lookup</div>
              <div class="bg-gms-gray-100">
                <UCheckbox label="Show ETL Critical Components" />
              </div>
            </div>

            <!-- Part List -->
            <div class="w-full p-3 border-b-[3px] border-black">
              <div class="flex flex-col space-y-2">
                <div>
                  <UTable
                    class="w-full"
                    :ui="{
                      wrapper:
                        'h-[115px] overflow-y-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                      divide: 'divide-gray-200 dark:divide-gray-800',
                      tr: {
                        active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                      },
                      th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white',
                        padding: 'py-0',
                      },
                      td: {
                        base: 'h-[22px]',
                        padding: 'py-0',
                      },
                    }"
                  />
                </div>

                <div class="flex flex-row justify-between">
                  <div>
                    <UButton
                      color="green"
                      variant="outline"
                      label="Export Window to Excel"
                      icon="i-heroicons-document-text"
                    />
                  </div>

                  <div>
                    <UFormGroup label="Quantity">
                      <div class="text-center text-bold p-0 m-0">0</div>
                    </UFormGroup>
                  </div>

                  <div>
                    <UButton
                      color="green"
                      variant="outline"
                      label="Export All Inventory"
                      icon="i-heroicons-arrow-right-start-on-rectangle"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Part Info -->
            <div class="w-full px-3 py-1 gmsBlueTitlebar">Part Information</div>
            <div
              class="flex flex-col p-3 space-y-2 border-b-[3px] border-black"
            >
              <div class="flex flex-row justify-between">
                <UCheckbox
                  v-model="formData.SubassemblyInventoried"
                  :checked="formData.SubassemblyInventoried === '-1'"
                  label="Job Subassembly"
                />
                <UCheckbox
                  v-model="formData.ETLCriticalComponent"
                  :checked="formData.ETLCriticalComponent === true"
                  label="ETL Critical Component"
                />
                <UCheckbox
                  v-model="formData.override"
                  :checked="formData.override === '-1'"
                  label="Selling Price Override"
                />
                <UCheckbox
                  v-model="formData.BuiltInHouse"
                  :checked="formData.BuiltInHouse === true"
                  label="Ignore Manufacturing Cost"
                />
              </div>

              <div class="flex flex-row space-x-2">
                <UFormGroup label="Category">
                  <UInputMenu v-model="formData.PARTTYPE" :options="category" />
                </UFormGroup>
                <UFormGroup label="Sub Category">
                  <UInputMenu
                    v-model="formData.SUBCATEGORY"
                    :options="subCategory"
                  />
                </UFormGroup>
                <UFormGroup label="Stock Number">
                  <UInput v-model="formData.MODEL" />
                </UFormGroup>
                <UFormGroup label="Inspection">
                  <UInputMenu
                    v-model="formData.InspectionLevel"
                    :options="insepctionList"
                  />
                </UFormGroup>
              </div>

              <div class="flex flex-row space-x-2">
                <div class="basis-2/12">
                  <UFormGroup label="Order Unit">
                    <UInputMenu v-model="formData.UNIT" :options="partUnit" />
                  </UFormGroup>
                </div>
                <div class="basis-1/12">
                  <UFormGroup label="Multiple">
                    <UInput v-model="formData.MULTIPLE" />
                  </UFormGroup>
                </div>
                <div class="basis-2/12">
                  <UFormGroup label="Inventory Unit">
                    <UInputMenu
                      v-model="formData.InventoryUnit"
                      :options="inventoryList"
                    />
                  </UFormGroup>
                </div>
                <div class="basis-3/12">
                  <UFormGroup label="Account#">
                    <UInputMenu
                      v-model="formData.AccountNumber"
                      :options="accountList"
                    />
                  </UFormGroup>
                </div>
                <div class="basis-4/12">
                  <UFormGroup label="Description">
                    <UInput v-model="formData.DESCRIPTION" />
                  </UFormGroup>
                </div>
              </div>

              <div class="flex flex-row space-x-2">
                <div class="basis-2/12">
                  <UFormGroup label="Order Cost">
                    <UInput v-model="formData.ORDERCOST" />
                  </UFormGroup>
                </div>
                <div class="basis-2/12">
                  <UFormGroup label="Inventory Cost">
                    <UInput v-model="formData.InventoryCost" />
                  </UFormGroup>
                </div>
                <div class="basis-2/12">
                  <UFormGroup label="Selling Price">
                    <UInput v-model="formData.SELLINGPRICE" />
                  </UFormGroup>
                </div>
                <div class="basis-6/12">
                  <UFormGroup label="Specification">
                    <UInput v-model="formData.SPECIFICATIONS" />
                  </UFormGroup>
                </div>
              </div>

              <div class="flex flex-row space-x-5">
                <div class="">
                  <div class="">Drawing/Mannul</div>
                  <label class="" for="DRAWINGCUSTOM">
                    <span
                      v-if="files[0]?.name || formData.DRAWINGCUSTOM"
                      class="bg-gray-400 text-white px-1 py-1 rounded cursor-pointer"
                    >
                      Upload
                    </span>
                    <span
                      :class="
                        !files[0]?.name && !formData.DRAWINGCUSTOM
                          ? 'bg-gray-400 text-white px-2 text-center py-1 rounded'
                          : ''
                      "
                    >
                      {{
                        (files[0]?.name?.length > 15
                          ? "..." + files[0]?.name.slice(-15)
                          : files[0]?.name) ||
                        (formData.DRAWINGCUSTOM?.length > 15
                          ? "..." + formData.DRAWINGCUSTOM.slice(-15)
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
                </div>

                <div class="">
                  <div class="">PDS</div>
                  <label class="" for="PDS">
                    <span
                      v-if="files[1]?.name || formData.SPECSHEET"
                      class="bg-gray-400 text-white px-1 py-1 rounded cursor-pointer"
                    >
                      Upload
                    </span>
                    <span
                      :class="
                        !files[1]?.name && !formData.SPECSHEET
                          ? 'bg-gray-400 text-white px-2 text-center py-1 rounded'
                          : ''
                      "
                    >
                      {{
                        (files[1]?.name?.length > 15
                          ? "..." + files[1]?.name.slice(-15)
                          : files[1]?.name) ||
                        (formData.SPECSHEET?.length > 15
                          ? "..." + formData.SPECSHEET.slice(-15)
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
                </div>

                <div class="">
                  <div class="">SDS</div>
                  <label class="" for="sds">
                    <span
                      v-if="files[2]?.name || formData.sds"
                      class="bg-gray-400 text-white px-1 py-1 rounded cursor-pointer"
                    >
                      Upload
                    </span>
                    <span
                      :class="
                        !files[2]?.name && !formData.sds
                          ? 'bg-gray-400 text-white px-2 text-center py-1 rounded'
                          : ''
                      "
                    >
                      {{
                        (files[2]?.name?.length > 15
                          ? "..." + files[2]?.name.slice(-15)
                          : files[2]?.name) ||
                        (formData.sds?.length > 15
                          ? "..." + formData.sds.slice(-15)
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
                </div>
              </div>
            </div>
          </div>

          <!-- Inventory -->
          <div class="w-1/2">
            <div class="w-full px-3 py-1 gmsBlueTitlebar">Inventory</div>
            <div
              class="w-full flex flex-row p-3 space-x-3 border-b-[3px] border-black"
            >
              <div class="w-3/12">
                <div class="flex flex-col space-y-2">
                  <div>
                    <UTable
                      :rows="locationGridMeta.options"
                      :columns="locationGridMeta.defaultColumns"
                      :ui="{
                        wrapper:
                          'h-[140px] border-[1px] border-gray-400 dark:border-gray-700',
                        tr: {
                          active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                        },
                        th: {
                          padding: 'p-1',
                          base: 'sticky top-0 z-10',
                          color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        },
                        td: {
                          padding: 'py-0 px-1',
                        },
                        checkbox: { padding: 'p-1 w-[10px]' },
                      }"
                    />

                    <USelectMenu
                      :model-value="selectedWorkCenterObjects"
                      @update:model-value="handleSelectionUpdate"
                      :options="locationGridMeta.allOptions"
                      multiple
                      placeholder="Select work centers"
                    >
                      <template #option="{ option }">
                        <div class="flex items-center gap-2">
                          <UCheckbox
                            :model-value="isSelected(option)"
                            class="opacity-50"
                          />
                          <span>{{ option.label }}</span>
                        </div>
                      </template>
                    </USelectMenu>
                  </div>

                  <div class="space-y-2 mt-2">
                    <div class="flex items-center space-x-2">
                      <label>On Order</label>
                      <UInput
                        class="flex-1 sm-field"
                        v-model="jobDetailsGridMeta.ordered"
                      />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label>On Hand</label>
                      <UInput
                        class="flex-1 sm-field"
                        v-model="formData.OnHand"
                      />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label>Required</label>
                      <UInput
                        class="flex-1 sm-field"
                        v-model="jobDetailsGridMeta.totalRequired"
                      />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label>Available</label>
                      <UInput
                        class="flex-1 sm-field"
                        v-model="jobDetailsGridMeta.available"
                      />
                    </div>
                    <div class="flex items-center space-x-2">
                      <label>Minimum</label>
                      <UInput
                        class="flex-1 sm-field"
                        v-model="formData.minimum"
                      />
                    </div>
                  </div>

                  <div>
                    <UTable
                      :rows="usedOnGridMeta.options"
                      :columns="usedOnGridMeta.defaultColumns"
                      @select="usedOnSelect"
                      @dblclick="onTableBtnClick('usedOn')"
                      :ui="{
                        wrapper:
                          'h-[158px] border-[1px] border-gray-400 dark:border-gray-700',
                        tr: {
                          active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                        },
                        th: {
                          padding: 'p-1',
                          base: 'sticky top-0 z-10',
                          color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        },
                        td: {
                          padding: 'py-0 px-1',
                        },
                        checkbox: { padding: 'p-1 w-[10px]' },
                      }"
                      :empty-state="{
                        icon: 'i-heroicons-circle-stack-20-solid',
                        label: 'No items.',
                      }"
                    />
                  </div>
                </div>
              </div>

              <div class="w-5/12 flex flex-col space-y-2">
                <UTable
                  :rows="purchaseGridMeta.options"
                  :columns="purchaseGridMeta.defaultColumns"
                  @select="onPurchaseSelect"
                  @dblclick="onTableBtnClick('purchase')"
                  :ui="{
                    wrapper:
                      'h-[328px] overflow-y-auto border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                    },
                    th: {
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      padding: 'py-0 px-1',
                    },
                    td: {
                      base: 'h-[22px]',
                      padding: 'py-0 px-1',
                    },
                    checkbox: { padding: 'p-1 w-[10px]' },
                  }"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                  }"
                />

                <div class="flex flex-row space-x-3">
                  <div class="w-2/5">
                    <UTable
                      :rows="jobDetailsGridMeta.options"
                      :columns="jobDetailsGridMeta.defaultColumns"
                      :ui="{
                        wrapper:
                          'h-[158px] border-[1px] border-gray-400 dark:border-gray-700',
                        tr: {
                          active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                        },
                        th: {
                          padding: 'p-1',
                          base: 'sticky top-0 z-10',
                          color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        },
                        td: {
                          padding: 'py-0 px-1',
                        },
                        checkbox: { padding: 'p-1 w-[10px]' },
                      }"
                      :empty-state="{
                        icon: 'i-heroicons-circle-stack-20-solid',
                        label: 'No items.',
                      }"
                    />
                  </div>

                  <div class="w-3/5 h-full">
                    <UFormGroup label="Comments">
                      <UTextarea :rows="6" v-model="formData.COMMENT" />
                    </UFormGroup>
                  </div>
                </div>
              </div>

              <div class="w-4/12 flex flex-col space-y-2">
                <UFormGroup label="Inventory Transactions">
                  <UTable
                    :columns="inventoryGridMeta.defaultColumns"
                    :rows="inventoryGridMeta.options"
                    @select="onInventorySelect"
                    @dblclick="onTableBtnClick('inventory')"
                    :ui="{
                      wrapper:
                        'overflow-auto h-[430px] border-[1px] border-gray-400 dark:border-gray-700',
                      tr: {
                        active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                      },
                      th: {
                        padding: 'p-1',
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                      },
                      td: {
                        padding: 'p-1',
                      },
                      checkbox: { padding: 'p-1 w-[10px]' },
                    }"
                    :empty-state="{
                      icon: 'i-heroicons-circle-stack-20-solid',
                      label: 'No items.',
                    }"
                  />
                </UFormGroup>
                <div class="w-full">
                  <UButton
                    icon="i-heroicons-check-badge"
                    label="View Inventory Transations"
                    variant="outline"
                    block
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex">
          <div class="basis-1/2 border-r-[3px] border-black">
            <div class="w-full px-3 py-1 gmsBlueTitlebar">Primary Vendor</div>
            <div
              class="w-full p-3 flex flex-row space-x-3 border-b-[3px] border-black"
            >
              <div class="basis-6/12 flex flex-col space-y-2">
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Manufacturer">
                    <UButton block label="Manufacturer" color="gms-blue" />
                    <UInputMenu
                      v-model="formData.PRIMARYMANTXT"
                      :options="vendorList"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number">
                    <UInput v-model="formData.PRIMARYMANNUM" />
                  </UFormGroup>
                </div>

                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Dealer">
                    <UButton block label="Dealer" color="gms-blue" />
                    <UInputMenu
                      v-model="formData.PRIMARYDEATXT"
                      :options="vendorList"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number">
                    <UInput v-model="formData.PRIMARYDEANUM" />
                  </UFormGroup>
                </div>
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup label="Lead Time">
                    <UInput v-model="formData.PRIMARYLEADTIME" />
                  </UFormGroup>
                  <UFormGroup label="UL Number">
                    <UInput v-model="formData.PRIMARYUL" />
                  </UFormGroup>
                </div>
              </div>

              <div class="basis-4/12 flex flex-col space-y-2">
                <div class="flex flex-row justify-around ms-6">
                  <div>Qty</div>
                  <div>Price</div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="mt-2">Min</div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.PRIMARYQTY1" />
                      <UInput v-model="formData.PRIMARYQTY2" />
                      <UInput v-model="formData.PRIMARYQTY3" />
                      <UInput v-model="formData.PRIMARYQTY4" />
                      <UInput v-model="formData.PRIMARYQTY5" />
                    </div>

                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.PRIMARYPRICE1" />
                      <UInput v-model="formData.PRIMARYPRICE2" />
                      <UInput v-model="formData.PRIMARYPRICE3" />
                      <UInput v-model="formData.PRIMARYPRICE4" />
                      <UInput v-model="formData.PRIMARYPRICE5" />
                    </div>
                  </div>
                </div>
              </div>

              <UFormGroup label="Last Ordered Date:" class="basis-2/12">
                <UInput />
              </UFormGroup>
            </div>
          </div>

          <div class="basis-1/2">
            <div class="w-full px-3 py-1 gmsBlueTitlebar">Revision History</div>
            <div
              class="w-full flex flex-row p-3 space-x-3 border-b-[3px] border-black"
            >
              <div class="basis-2/5 flex flex-col space-y-2">
                <UButton label="Show Rev's" color="gms-blue" />

                <UTable
                  :columns="revisionsGridMeta.defaultColumns"
                  :rows="revisionsGridMeta.options"
                  @select="onReviusedBySelect"
                  :ui="{
                    wrapper:
                      'h-[176px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'py-0 px-1',
                    },
                    checkbox: { padding: 'p-1 w-[10px]' },
                  }"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                  }"
                />
              </div>

              <div class="basis-3/5 flex flex-col space-y-2">
                <div class="">
                  <UFormGroup label="Revised By">
                    <UInputMenu
                      v-model="formData.RevisedBy"
                      :options="revisedByList"
                      class="w-[265px]"
                    />
                  </UFormGroup>
                </div>
                <div class="flex flex-row space-x-2">
                  <UButton
                    @click="onAdd({ data: formData })"
                    :disabled="selectedPartsID != null"
                    label="Add"
                    color="gms-blue"
                    class="basis-1/5"
                  />
                  <UButton
                    @click="onEdit({ data: formData })"
                    :disabled="selectedPartsID == null"
                    label="Modify"
                    color="gms-blue"
                    class="basis-1/5"
                  />
                  <UButton
                    @click="revision({ data: formData })"
                    label="Revision"
                    color="gms-blue"
                    class="basis-1/5"
                    :disabled="selectedPartsID == null"
                    variant="outline"
                  />
                  <UButton
                    @click="onDelete"
                    :disabled="selectedPartsID == null"
                    label="DELETE"
                    color="BLACK"
                    variant="outline"
                    class="basis-1/5"
                  />
                </div>

                <div class="flex flex-col space-y-2">
                  <div class="flex flex-row space-x-2">
                    <UButton
                      label="Obsolete"
                      color="red"
                      variant="outline"
                      icon="i-heroicons-minus-circle"
                      class="basis-1/3"
                    />
                    <UButton
                      label="Active"
                      variant="outline"
                      icon="i-heroicons-check-badge"
                      class="basis-1/3"
                    />
                    <UButton
                      label="Print Label"
                      variant="outline"
                      icon="i-heroicons-tag"
                      class="basis-1/3"
                    />
                  </div>

                  <div class="flex flex-row space-x-2">
                    <UButton
                      @click="onRefresh"
                      label="Clear Form"
                      color="red"
                      variant="outline"
                      icon="i-f7-rays"
                      class="basis-1/3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alternative Vendors -->

        <div class="flex">
          <div class="basis-1/2 border-r-[3px] border-black">
            <div class="w-full px-3 py-1 gmsBlueTitlebar">Alternate Vendor</div>
            <div class="w-full p-3 flex flex-row space-x-3">
              <div class="basis-6/12 flex flex-col space-y-2">
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Manufacturer">
                    <UButton label="Manufacturer" color="gms-blue" />
                    <UInputMenu
                      v-model="formData.ALTER1MANTXT"
                      :options="vendorList"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number">
                    <UInput v-model="formData.ALTER1MANNUM" />
                  </UFormGroup>
                </div>

                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Dealer">
                    <UButton block label="Dealer" color="gms-blue" />
                    <UInputMenu
                      v-model="formData.ALTER1DEATXT"
                      :options="vendorList"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number">
                    <UInput v-model="formData.ALTER1DEANUM" />
                  </UFormGroup>
                </div>
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup label="Lead Time">
                    <UInput v-model="formData.ALTER1LEADTIME" />
                  </UFormGroup>
                  <UFormGroup label="UL Number">
                    <UInput v-model="formData.ALTER1UL" />
                  </UFormGroup>
                </div>
              </div>

              <div class="basis-4/12 flex flex-col space-y-2">
                <div class="flex flex-row justify-around ms-6">
                  <div>Qty</div>
                  <div>Price</div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="mt-2">Min</div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.ALTER1QTY1" />
                      <UInput v-model="formData.ALTER1QTY2" />
                      <UInput v-model="formData.ALTER1QTY3" />
                      <UInput v-model="formData.ALTER1QTY4" />
                      <UInput v-model="formData.ALTER1QTY5" />
                    </div>

                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.ALTER1PRICE1" />
                      <UInput v-model="formData.ALTER1PRICE2" />
                      <UInput v-model="formData.ALTER1PRICE3" />
                      <UInput v-model="formData.ALTER1PRICE4" />
                      <UInput v-model="formData.ALTER1PRICE5" />
                    </div>
                  </div>
                </div>
              </div>

              <UFormGroup label="Last Ordered Date:" class="basis-2/12">
                <UInput />
              </UFormGroup>
            </div>
          </div>

          <div class="basis-1/2">
            <div class="w-full px-3 py-1 gmsBlueTitlebar">
              Alternate Vendor#2
            </div>
            <div class="w-full p-3 flex flex-row space-x-3">
              <div class="basis-6/12 flex flex-col space-y-2">
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Manufacturer">
                    <UButton block label="Manufacturer" color="gms-blue" />
                    <UInputMenu
                      v-model="formData.ALTER2MANTXT"
                      :options="vendorList"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number" name="Part Number">
                    <UInput v-model="formData.ALTER2MANNUM" />
                  </UFormGroup>
                </div>

                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup name="Dealer">
                    <UButton block label="Dealer" color="gms-blue" />
                    <UInputMenu
                      :options="vendorList"
                      v-model="formData.ALTER2DEATXT"
                    />
                  </UFormGroup>

                  <UFormGroup label="Part Number" name="Part Number">
                    <UInput v-model="formData.ALTER2DEANUM" />
                  </UFormGroup>
                </div>
                <div class="flex flex-row space-x-1 items-end">
                  <UFormGroup label="Lead Time">
                    <UInput v-model="formData.ALTER2LEADTIME" />
                  </UFormGroup>
                  <UFormGroup label="UL Number">
                    <UInput v-model="formData.ALTER2UL" />
                  </UFormGroup>
                </div>
              </div>

              <div class="basis-4/12 flex flex-col space-y-2">
                <div class="flex flex-row justify-around ms-6">
                  <div>Qty</div>
                  <div>Price</div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="mt-2">Min</div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.ALTER2QTY1" />
                      <UInput v-model="formData.ALTER2QTY2" />
                      <UInput v-model="formData.ALTER2QTY3" />
                      <UInput v-model="formData.ALTER2QTY4" />
                      <UInput v-model="formData.ALTER2QTY5" />
                    </div>

                    <div class="grid grid-cols-1 gap-1.5">
                      <UInput v-model="formData.ALTER2PRICE1" />
                      <UInput v-model="formData.ALTER2PRICE2" />
                      <UInput v-model="formData.ALTER2PRICE3" />
                      <UInput v-model="formData.ALTER2PRICE4" />
                      <UInput v-model="formData.ALTER2PRICE5" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="basis-2/12">
                <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </template>

  <!-- Purchase Modal -->
  <UDashboardModal
    v-model="modalMeta.isPurchaseModalOpen"
    title="View Purchase"
    class="h-[50vh] overflow-y-auto"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-9xl',
      height: 'h-[500px]',
    }"
  >
    <PurchaseDetails
      :is-creating="false"
      :modal-data="purchaseGridMeta.selectedOption"
    ></PurchaseDetails>
  </UDashboardModal>

  <!-- Inventory Modal -->
  <UDashboardModal
    v-model="modalMeta.isInventoryModalOpen"
    title="Inventory Transactions"
    class="h-[50vh] overflow-y-auto"
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
    <InventoryTransactions
      :selected-Order="inventoryGridMeta.selectedOption"
    ></InventoryTransactions>
  </UDashboardModal>

  <!-- Products Modal -->
  <UDashboardModal
    v-model="modalMeta.isProductsModalOpen"
    title="Products"
    class="h-[50vh] overflow-y-auto"
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
