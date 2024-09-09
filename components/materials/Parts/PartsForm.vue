<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";




const accountList = ref([]);
const revisions = ref([]);
const workplaces = ref([]);
const workplacesColumns = [
  {
    key: "location",
    label: "location",
  }
];



const revisionsColumns = [
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
];

const poDetails = ref([]);
const poDetailsColumns = [
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
];

const InventoryTransactions = ref([]);
const InventoryTransactionsColumns = [
  {
    key: "UID",
    label: "Unique ID",
  },
  {
    key: "QtyChange",
    label: "QTY",
  },
  {
    key: "Dated",
    label: "Date",
    formatter: (value) => formatDate(value as string),
  },
];

const jobDetails = ref([]);
const jobDetailsColumns = [
  {
    key: "Expr1",
    label: "Jobs",
  },
  {
    key: "instanceID",
    label: "instance",
  },
];

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedCustomer: {
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

const toast = useToast();
const router = useRouter();
const customersFormInstance = getCurrentInstance();

const loadingOverlay = ref(false);
const customerExist = ref(true);
const category = ref([]);
const subCategory = ref([]);
const professions = ref([]);
const vendorList = ref();
const partUnit = ref([]);
const insepctionList = ref([]);
const usstates = ref([]);
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
  ALTER2QTY4: null,
  ALTER2QTY3: null,
  ALTER2PRICE1: null,
  ALTER2PRICE4: null,
  ALTER2PRICE3: null,
  ALTER2PRICE2: null,
  ALTER2PRICE5: null,
  ALTER2QTY5: null,
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
  CODE: null,
  TODAY: null, // YYYY-MM-DD HH:MM:SS
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
  BuiltInHouse: null,
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
  override: null,
  grossprofit: null,
  CryoThermControlPanelNumber: null,
  CryoThermHeaterNumber: null,
  amps: null,
  ETLCriticalComponent: null,
  sds: null,
  SubassemblyInventoried: null,
  LeftTankAssembly: null,
  RightTankAssembly: null,
  RevisedBy: null,
  Recommendations: null,
  StatementOfNeed: null,
  SupportorProject: null,
});









const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/materials/parts/parts/${props.selectedCustomer}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        customerExist.value = true;
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key];
          }
        }
      }
    },
    onResponseError({}) {
      customerExist.value = false;
    },
  });
  propertiesInit();
  loadingOverlay.value = false;
  fetchWorkCentersBy();
};
const propertiesInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch("/api/materials/categories", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        category.value = response._data.body;
        console.log("category is ", response._data.body);
      }
    },
    onResponseError() {
      category.value = [];
    },
  });
  await useApiFetch("/api/materials/subcategories", {
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
  await useApiFetch("/api/common/partUnit", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        console.log("order unit is", response._data.body.unit);
        partUnit.value = response._data.body
          .map((item) => item.unit)
          .filter((unit) => unit !== null && unit !== undefined);
      }
    },
    onResponseError() {
      partUnit.value = [];
    },
  });
  await useApiFetch("/api/common/getInspectionNumbers", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        insepctionList.value = response._data.body;
        console.log("insepction ", response._data.body);
      }
    },
    onResponseError() {
      insepctionList.value = [];
    },
  });


  await useApiFetch(
    `/api/materials/parts/parts/transactions?model=${props.selectedPartModel}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("transation vlau eis", response._data.body);
          InventoryTransactions.value = response._data.body;
        }
      },
      onResponseError() {
        // orders = []
      },
    }
  );

  await useApiFetch("/api/materials/parts/getVendor", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        vendorList.value = response._data.body;

        console.log("v", vendorList.value);
      }
    },
    onResponseError() {
      // orders = []
    },
  });
  await useApiFetch(
  `/api/materials/parts/getJobsTotal?instanceId=${props.selectedPartInstace}`,
  {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        console.log("jobdetails", response._data);
        jobDetails.value =response._data;
      }
    },
    onResponseError({ response }) {
      console.error("Error fetching job details:", response);
      // Handle error, maybe reset jobDetails or show a notification
    },
  }
);


  await useApiFetch(
    `/api/materials/parts/parts/podetails?instanceId=${props.selectedPartInstace}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("the value of po", response._data.body);
          poDetails.value = response._data.body;
        }
      },
      onResponseError() {
        // orders = []
      },
    }
  );

getRevisions();



  await useApiFetch("/api/materials/parts/accountsList",
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("the value of accountlist", response._data.body);
          accountList.value = response._data.body;
        }
      },
      onResponseError() {
        // orders = []
      },
    }
  );



  loadingOverlay.value = false;
};

const handleClose = async () => {
  // Check if props.selectedPartInstace is defined and has vnode with onClose
  if (props.selectedPartInstace?.vnode?.props?.onClose) {
    emit("close");
  } else {
    // Fallback to go back in the router history
    router.go(-1);
  }
};

const getRevisions=async()=>{
  await useApiFetch(
    `/api/materials/parts/revisions?instanceId=${props.selectedPartInstace}`,
    {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("the value of revision", response._data.body);
          revisions.value = response._data.body;
        }
      },
      onResponseError() {
        // orders = []
      },
    }
  );

}

const fetchWorkCentersBy = async () => {
    try {
        const response = await useApiFetch('/api/materials/workcenter', {
            method: 'GET',
        });
        if (response) {
            console.log(response)
            const workCenterIds = formData.WORKCENTERS
                .split(',')
                .map(id => id.trim()) 
                .filter(id => id !== ""); 

            const filteredResponse = response.filter(val => workCenterIds.includes(val.UniqueId));

            workplaces.value = filteredResponse;
            console.log("work center is",filteredResponse);
        } else {
            console.log('Unexpected response structure or status code:', response);
        }
    } catch (error) {
        console.error(error);
        return { workcenters: [] };
    }
}

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

const revision=async()=>{
  if(props.selectedPartInstace!=null){
    console.log("meth dfadsf");

    const response = await useApiFetch(`/api/materials/parts/parts/revision?instanceIdForRevision=${props.selectedPartInstace}&id=${props.selectedCustomer}`, {
        method: "PUT",
        onResponse({ response }) {
            if (response.status === 200) {
              console.log("status is",response.status);
              toast.add({
                title: "Success",
                description: "Revision Add",
                icon: "i-heroicons-check-circle",
                color: "green",
              });
            }
          },


      });
 

}


getRevisions();


}


const onSubmit = async (event: FormSubmitEvent<any>) => {
  if(props.selectedCustomer!=null){
console.log("event is",event.data);
    const now = new Date();
    const isoString = now.toISOString();
    event.data.TODAY =isoString;
    
      console.log("form data is",event.data)
        await useApiFetch(`/api/materials/parts/parts/${props.selectedCustomer}`, {
          method: "PUT",
          body: event.data,
          onResponse({ response }) {
            if (response.status === 200) {
              console.log("status is",response.status);
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
  else{
    console.log("form data is",event.data)
        await useApiFetch(`/api/materials/parts/parts/${props.selectedCustomer}`, {
          method: "POST",
          body: event.data,
          onResponse({ response }) {
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
   emit('save');

};

if (props.selectedCustomer !== null) editInit();
else propertiesInit();
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
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound
      :name="'Customer not found'"
      :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'"
    />
  </template>
  <template v-else>
    <UForm
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
    <div class="gmsBlueTitlebar pl-2 h-6">
  <label class="text-white font-bold">Part Information</label>
</div>
<div class="overflow-auto">

      <div>
        <div>
          <div class="flex flex-row space-x-5">
            <div class="basis-1/5">
              <UFormGroup label="Category" name="fname">
                <UInputMenu
                  v-model="formData.PARTTYPE"
                  placeholder="Category"
                  :options="category"
                />
              </UFormGroup>
            </div>

            <div class="basis-1/5">
              <UFormGroup label="Sub Category" name="lname">
                <UInputMenu
                  v-model="formData.SUBCATEGORY"
                  placeholder="Sub Category"
                  :options="subCategory"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Stock Number" name="title">
                <UInput
                  v-model="formData.STOCKNUMBER"
                  placeholder="Stock Number"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Inspection" name="position">
                <UInputMenu
                  v-model="formData.InspectionLevel"
                  placeholder="Inspection"
                  :options="insepctionList"
                />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Order Unit" name="market">
                <UInputMenu v-model="formData.UNIT" :options="partUnit" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Multiple" name="number">
                <UInput v-model="formData.MULTIPLE" placeholder="" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Inventory Unit" name="profession">
                <UInputMenu
                  v-model="formData.InventoryUnit"
                  :options="partUnit"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Account#" name="Account">
                <UInputMenu
                  v-model="formData.AccountNumber"
                  :options="accountList"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Description" name="Description">
                <UInput
                  v-model="formData.DESCRIPTION"
                  :options="insepctionList"
                />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/5">
              <UFormGroup label="Order Cost" name="Order Cost">
                <UInput v-model="formData.ORDERCOST" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Inventory Cost" name="Inventory Cost">
                <UInput v-model="formData.InventoryCost"  placeholder="" />
              </UFormGroup>
            </div>
            <div class="basis-1/5">
              <UFormGroup label="Selling Price" name="Selling Price">
                <UInput v-model="formData.SELLINGPRICE" />
              </UFormGroup>
            </div>
            <div class="basis-2/5">
              <UFormGroup label="Specification" name="Account">
                <UInput v-model="formData.SPECIFICATIONS" />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-5">
            <div class="basis-1.2/5">
              <UFormGroup label="Drawing/Mannul" name="Drawing/Mannul">
                <UInput type="file" size="sm" icon="i-heroicons-folder" />
              </UFormGroup>
            </div>
            <div class="basis-1.2/5">
              <UFormGroup label="PDS" name="PDS">
                <UInput type="file" size="sm" icon="i-heroicons-folder" />
              </UFormGroup>
            </div>
            <div class="basis-1.2/5">
              <UFormGroup label="SDS" name="SDS">
                <UInput type="file" size="sm" icon="i-heroicons-folder" />
              </UFormGroup>
            </div>
          </div>
       

          <div class="gmsBlueTitlebar mt-3 ">
            <div class=" pl-2 text-white font-bold">Primary Vendor</div>
          </div>

          <div class="grid grid-cols-3 gap-3 mt-2">
            <!-- First Grid Section -->
            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2">
                <UFormGroup label="Manufacturer" name="Manufacturer">
                  <UInputMenu
                    v-model="formData.PRIMARYMANTXT"
                    :options="vendorList"
                  />
                </UFormGroup>
              </div>
              <div class="col-span-1">
                <UFormGroup label="Dealer" name="Dealer">
                  <UInputMenu
                    v-model="formData.PRIMARYDEATXT"
                    :options="vendorList"
                  />
                </UFormGroup>
              </div>
              <div class="col-span-1">
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput placeholder="1" v-model="formData.PRIMARYLEADTIME" />
                </UFormGroup>
              </div>
              <div class="col-span-2">
                <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
            <!-- Second Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput v-Model="formData.PRIMARYMANNUM" placeholder="" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput v-model="formData.PRIMARYDEANUM" placeholder="1" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput v-model="formData.PRIMARYUL" />
                </UFormGroup>
              </div>
            </div>

           <div class="col-span-1 grid grid-cols-2 gap-2">
            <!-- <div class="flex flex-row w-full space-x-2"> -->
              <div class="grid grid-cols-1 gap-1">
                <div class="text-center">Qty</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYQTY1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYQTY2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYQTY3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYQTY4" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYQTY5" />
                  </UFormGroup>
                </div>
              </div>
              <!-- Second Grid Section -->
              <div class="grid grid-cols-1">
                <div class=" text-center">Price</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYPRICE1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYPRICE2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYPRICE3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYPRICE4" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.PRIMARYPRICE5" />
                  </UFormGroup>
                </div>
              </div>
            </div>
           <!-- </div> -->

          </div>
        </div>

        <div></div>
      </div>

      <div class="flex flex-row  mt-[30px]">

     
         <div class="basis-1/2 gmsBlueTitlebar">
            <div class="pl-2  text-white font-bold">Alternative Vendor #1</div>
          </div>
<div class="basis-1/2 ml-2  gmsBlueTitlebar">

  <div class=" text-white pl-2 font-bold">Alternative Vendor #2</div>
  </div>
      </div>

      <div class="flex flex-row space-x-5 mt-2">
        <div class="basis-1/2">
          <!-- Shipping Information -->
          <div class="flex flex-row space-x-5 ">
            <!-- First Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Manufacturer" name="Manufacturer">
                  <UInputMenu
                    v-model="formData.ALTER1MANTXT"
                    :options="vendorList"
                  />



                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Dealer" name="Dealer">
        
                  <UInputMenu
                    v-model="formData.ALTER1DEATXT"
                    :options="vendorList"
                  />

                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput placeholder="1" v-model="formData.ALTER1LEADTIME" />
                </UFormGroup>
              </div>
            </div>
            <!-- Second Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput placeholder="" v-model="formData.ALTER1MANNUM" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput placeholder="1" v-model="formData.ALTER1DEANUM" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput placeholder="14.56" />
                </UFormGroup>
              </div>
            </div>

            <div class="flex flex-row space-x-2">
              <div class="grid grid-cols-1 gap-1">
                <div class="basis-1/2 text-center">Qty</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1QTY1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1QTY2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1QTY3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1QTY4" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1QTY5" />
                  </UFormGroup>
                </div>
              </div>
              <!-- Second Grid Section -->
              <div class="grid grid-cols-1">
                <div class="basis-1/2 text-center">Price</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1PRICE1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1PRICE2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1PRICE3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1PRICE4" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER1PRICE5" />
                  </UFormGroup>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="basis-1/2">
          <!-- Billing Information -->
          <div class="flex flex-row space-x-5 ">
            <!-- First Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Manufacturer" name="Manufacturer">
               
                  <UInputMenu
                    placeholder="Garmin"
                    v-model="formData.ALTER2MANTXT"
                     :options="vendorList"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Dealer" name="Dealer">
                 
                  <UInputMenu
                  :options="vendorList"
                 
                    v-model="formData.ALTER2DEATXT"
                  />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Lead Time" name="Lead Time">
                  <UInput placeholder="1" v-model="formData.ALTER2LEADTIME" />
                </UFormGroup>
              </div>
            </div>
            <!-- Second Grid Section -->
            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput placeholder="" v-model="formData.ALTER2MANNUM" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="Part Number" name="Part Number">
                  <UInput placeholder="1" v-model="formData.ALTER2DEANUM" />
                </UFormGroup>
              </div>
              <div>
                <UFormGroup label="UL Number" name="UL Number">
                  <UInput placeholder="14.56" v-model="formData.ALTER2UL" />
                </UFormGroup>
              </div>
            </div>

            <div class="flex flex-row space-x-2">
              <div class="grid grid-cols-1 gap-1">
                <div class="basis-1/2 text-center">Qty</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2QTY1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2QTY2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2QTY3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2QTY3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2QTY4" />
                  </UFormGroup>
                </div>
              </div>
              <!-- Second Grid Section -->
              <div class="grid grid-cols-1">
                <div class="basis-1/2 text-center">Price</div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2PRICE1" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2PRICE2" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2PRICE3" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2PRICE4" />
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup>
                    <UInput v-model="formData.ALTER2PRICE5" />
                  </UFormGroup>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5">
              <div>
                <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div class="gmsBlueTitlebar mt-4 ">
            <div class=" pl-2 text-white font-bold">Inventory</div>
          </div>

<div class="flex flex-row space-x-3 ">
  <!-- Left Side - Job Details Table -->
  <div class="basis-1/3 h-96 overflow-auto">
    <UTable :rows="jobDetails" :columns="jobDetailsColumns" />
  </div>

  <!-- Middle - Comments Textarea -->
  <div class="basis-1/3">
    <UFormGroup label="Comments" name="Comments">
      <UTextarea class="w-full h-full" :rows="18" />
    </UFormGroup>
  </div>

  <!-- Right Side - PO Details Table -->
  <div class="basis-1/3">
    <UTable :rows="poDetails" :columns="poDetailsColumns" class="h-96 w-full" />
  </div>
</div>
  <!-- Right Side - Inputs and People Table -->
  <div class="flex flex-row   p-3">
    <div class="space-y-2 mr-2 mt-4  basis-1/2">
      <div class="flex items-center space-x-2">
        <label>On Order</label>
        <UInput class="flex-1" />
      </div>
      <div class="flex items-center space-x-2">
        <label>On Hand</label>
        <UInput class="flex-1" v-model="formData.OnHand" />
      </div>
      <div class="flex items-center space-x-2">
        <label>Required</label>
        <UInput class="flex-1" />
      </div>
      <div class="flex items-center space-x-2">
        <label>Available</label>
        <UInput class="flex-1" />
      </div>
      <div class="flex items-center space-x-2">
        <label>Minimum</label>
        <UInput class="flex-1" v-model="formData.minimum" />
      </div>
    </div>

    <div class="ml-4 basis-1/2">
      <UTable :rows="workplaces" :columns="workplacesColumns" class="h-48 w-full" />
    </div>
  </div>



<div class="space-x-3 mt-6">
  <!-- Left Side - Inventory Transactions Table -->

  <div class="gmsBlueTitlebar  ">
          <div class=" pl-2 text-white font-bold">Inventory Transactions</div>
        </div>
  <div class="basis-1/2 h-96 overflow-auto">
    <UTable :columns="InventoryTransactionsColumns" :rows="InventoryTransactions" />
  </div>




</div>
<div class="gmsBlueTitlebar mt-4 ">
            <div class=" pl-2 text-white font-bold">Revision History</div>
          </div>
<div class="flex flex-row space-x-3">
  <!-- Left Side - Revisions Table -->
  <div class="basis-1/2 h-32 overflow-auto">
    <UTable :columns="revisionsColumns" :rows="revisions" />
  </div>

  <!-- Right Side - Revised By Input -->
   <div class=basis-1/2> 
     <UFormGroup label="Revised By" name="fname" class="basis-1/2">
       <UInputMenu placeholder="Revised By" />
     </UFormGroup>
     <UFormGroup  class="basis-1/2 mt-2 ">
      <UButton 
  color="cyan" 
  :disabled="props.selectedPartInstace==null" 
  variant="outline" 
  @click="revision" 
  label="Revision" 
  
/>

     </UFormGroup>
    </div>

</div>


      <div class="flex justify-end gap-3">
      
        <UButton color="cyan" variant="outline" type="submit" label="Save" />
      </div>
    </div>
    </UForm> 
  </template>
</template>
