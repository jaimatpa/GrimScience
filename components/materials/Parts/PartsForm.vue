<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';


const people = [{
  name: 'Lindsay Walton',
 
}, {
  name: 'Lindsay Walton',

}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}, {
  name: 'Lindsay Walton',
}]

const InventoryTransactions = [{
  id: '5645',
  date:5/5/12,
  Qty:'2',
}, {
    id: '5645',
  date:5/5/12,
  Qty:'2',

}, {
    id: '5645',
  date:5/5/12,
  Qty:'2',
}, {
    id: '5645',
  date:5/5/12,
  Qty:'2',
}, {
    id: '5645',
  date:5/5/12,
  Qty:'2',
}, {
    id: '5645',
  date:5/5/12,
  Qty:'2',
}]

const orders = [{
  po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',
}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',

}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',
}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',
}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',
}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',
}]





const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true
  }, 
  isModal: {
    type: [Boolean]
  }
})

const toast = useToast()
const router = useRouter()
const customersFormInstance = getCurrentInstance();

const loadingOverlay = ref(false)
const customerExist = ref(true)
const category = ref([])
const subCategory=ref([]);
const professions = ref([])
const partUnit = ref([])
const insepctionList = ref([])
const usstates = ref([])
const formData = reactive({
  UniqueID: null,
  instanceID: null,
  oldproductid: null,
  oldpartid: null,
  partflag: null,
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
  TODAY: null,
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
  loadingOverlay.value = true
  await useApiFetch(`/api/materials/parts/parts/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        customerExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    }, 
    onResponseError({}) {
      customerExist.value = false
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/materials/categories', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        category.value = response._data.body;
        console.log('category is ',response._data.body);
      }
    }, 
    onResponseError() {
      category.value = []
    }
  })
  await useApiFetch('/api/materials/subcategories', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        subCategory.value = response._data.body;
    
      }
    }, 
    onResponseError() {
      subCategory.value = []
    }
  })
  await useApiFetch('/api/common/partUnit', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        console.log("order unit is",response._data.body.unit);
        partUnit.value = response._data.body
    .map(item => item.unit)
    .filter(unit => unit !== null && unit !== undefined);


      }
    },
    onResponseError() {
      partUnit.value = []
    }
  })
  await useApiFetch('/api/common/getInspectionNumbers', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        insepctionList.value = response._data.body;
        console.log("insepction ",response._data.body)
      }
    },
    onResponseError() {
      professions.value = []
    }
  })
  await useApiFetch('/api/common/usstates',  {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        usstates.value = response._data.body;
      }
    },
    onResponseError() {
      usstates.value = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
      ];
    }
  })
  loadingOverlay.value = false
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
  if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
const handleClose = async () => {
  if(customersFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if(props.selectedCustomer === null) { // Create Customer
    await useApiFetch('/api/customers', {
      method: 'POST',
      body: event.data, 
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })
  } else { // Update Customer
    await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
      method: 'PUT',
      body: event.data, 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })
  }
  emit('save')
}

if(props.selectedCustomer !== null) 
  editInit()
else 
  propertiesInit()
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
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
    <div class="flex flex-row">
        <div>
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Category"
            name="fname"
          >
            <UInputMenu
              v-model="formData.PARTTYPE"
              placeholder="Category"
              :options="category"
            />
          </UFormGroup>
        </div>
       
        <div class="basis-1/5">
          <UFormGroup
            label="Sub Category"
            name="lname"
          >
            <UInputMenu
              v-model="formData.SUBCATEGORY"
              placeholder="Sub Category"
              :options="subCategory"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Stock Number"
            name="title"
          >
            <UInput
              v-model="formData.STOCKNUMBER"
              placeholder="Stock Number"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inspection"
            name="position"
          >
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
          <UFormGroup
            label="Order Unit"
            name="market"
          >
            <UInputMenu
              v-model="formData.UNIT"
              :options="partUnit"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Multiple"
            name="number"
          >
            <UInput
              v-model="formData.MULTIPLE"
              placeholder=""
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inventory Unit"
            name="profession"
          >
            <UInputMenu
              v-model:query="formData.InventoryUnit"
              :options="professions"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Account#"
            name="Account"
          >
            <UInputMenu
              v-model="formData.AccountNumber"
              :options="partUnit"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Description"
            name="Description"
          >
            <UInput
              v-model="formData.DESCRIPTION"
              :options="insepctionList"
            />
          </UFormGroup>
        </div>
      </div>
      
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Order Cost"
            name="Order Cost"
          >
            <UInputMenu
              v-model="formData.ORDERCOST"
              :options="category"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inventory Cost"
            name="Inventory Cost"
          >
            <UInput
              v-model="formData.InventoryCost"
              placeholder=""
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Selling Price"
            name="Selling Price"
          >
            <UInput
           
   v-model="formData.SELLINGPRICE"
            />
          </UFormGroup>
        </div>
        <div class="basis-2/5">
          <UFormGroup
            label="Specification"
            name="Account"
          >
            <UInput
   v-model="formData.SPECIFICATIONS"
             
            />
          </UFormGroup>
        </div>
        
      </div>
      <div class="flex flex-row space-x-5">
        <div class="basis-1.2/5">
          <UFormGroup
            label="Drawing/Mannul"
            name="Drawing/Mannul"
          >
          <UInput type="file" size="sm" icon="i-heroicons-folder" />
          </UFormGroup>
        </div>
        <div class="basis-1.2/5">
          <UFormGroup
            label="PDS"
            name="PDS"
          >
          <UInput type="file" size="sm" icon="i-heroicons-folder" />

          </UFormGroup>
        </div>
        <div class="basis-1.2/5">
          <UFormGroup
            label="SDS"
            name="SDS"
          >
          <UInput type="file" size="sm" icon="i-heroicons-folder" />

          </UFormGroup>
        </div>
       
        
      </div>
      <div class="flex flex-row  mt-[30px] text-center">
        <div class="basis-1/2 ">
         Primary Vendor 
        </div>
      </div>
      
      <div class="flex flex-row space-x-5 mt-5 mt-[60px]">
  <!-- First Grid Section -->
  <div class="grid grid-cols-1 gap-5">
    <div>
      <UFormGroup label="Manufacturer" name="Manufacturer">
        <UInput placeholder="Garmin" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Dealer" name="Dealer">
        <UInput placeholder="Walmart.com" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Lead Time" name="Lead Time">
        <UInput placeholder="1" v-model="formData.PRIMARYLEADTIME" />
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

  <div class="flex flex-row space-x-2">
    <div class="grid grid-cols-1 gap-1">
        <div class="basis-1/2 text-center">
         Qty
        </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.PRIMARYQTY1"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYQTY2" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYQTY3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYQTY4" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYQTY5" />
      </UFormGroup>
    </div>
  </div>
  <!-- Second Grid Section -->
  <div class="grid grid-cols-1 ">
    <div class="basis-1/2 text-center">
         Price
        </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYPRICE1" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYPRICE2" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYPRICE3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYPRICE4"   />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.PRIMARYPRICE5" />
      </UFormGroup>
    </div>
   
  </div>




  </div>

  <div  class="grid grid-cols-1 gap-5">
    <div>
      <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
        <UInput />
      </UFormGroup>
    </div>
  </div>





</div>
    </div>
<div>

       <div class="grid grid-cols-1 h-48">
        <UTable :rows="people" />
         
        </div>
     <div class="space-y-2 mt-2">
            <div class="flex items-center space-x-2">
  <label >On Order</label>
  <UInput   class="flex-1" />
    </div>

    <div class="flex items-center space-x-2">
  <label >On Hand</label>
  <UInput  class="flex-1" />
    </div>

    <div class="flex items-center space-x-2">
  <label >Required</label>
  <UInput  class="flex-1" />
    </div>

    <div class="flex items-center space-x-2">
  <label >Available</label>
  <UInput  class="flex-1" />
    </div>
    <div class="flex items-center space-x-2">
  <label >Minimum</label>
  <UInput class="flex-1" />
    </div>
</div>
<div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="people" />
         
        </div>
        

</div>
<div>

    <div class="grid grid-cols-1 mt-6 h-48 w-72">
        <UTable :rows="orders" />
         
        </div>
        <div class="flex flex-row space-x-3">
        <div class="grid grid-cols-1 mt-6 ">
        <UTable :rows="people" />
         
        </div>
      

        <div class="mt-10 ">
            <UFormGroup
              label="Comments"
              name="Comments"
            >
              <UTextarea 
            class="w-32 "
              :rows="18"
            
                
              />
            </UFormGroup>
          </div>
    </div>
    
    
</div>
<div class="grid grid-cols-1 mt-6  w-60">
    <UTable :rows="InventoryTransactions" />
     
    </div>

</div>



      <div class="flex flex-row">
        <div class="basis-1/2 text-center">
          Alternative Vendor #1 
        </div>
        <div class="basis-1/2 text-center">
         Alternative Vendor #2
        </div>
      </div>
  
      <div class="flex flex-row space-x-5">
        <div class="basis-1/2">
          <!-- Shipping Information -->
          <div class="flex flex-row space-x-5 mt-5">
  <!-- First Grid Section -->
  <div class="grid grid-cols-1 gap-5">
    <div>
      <UFormGroup label="Manufacturer" name="Manufacturer">
        <UInput placeholder="Garmin" v-model="formData.ALTER1MANTXT" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Dealer" name="Dealer">
        <UInput placeholder="Walmart.com" v-model="formData.ALTER1DEATXT" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Lead Time" name="Lead Time" >
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
        <UInput placeholder="1"  v-model="formData.ALTER1DEANUM" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="UL Number" name="UL Number">
        <UInput placeholder="14.56"  />
      </UFormGroup>
    </div>
   
  </div>

  <div class="flex flex-row space-x-2">
    <div class="grid grid-cols-1 gap-1">
        <div class="basis-1/2 text-center">
         Qty
        </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER1QTY1" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER1QTY2" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1QTY3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1QTY4"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1QTY5"  />
      </UFormGroup>
    </div>
  </div>
  <!-- Second Grid Section -->
  <div class="grid grid-cols-1 ">
    <div class="basis-1/2 text-center">
         Price
        </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER1PRICE1" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1PRICE2" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1PRICE3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER1PRICE4" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER1PRICE5" />
      </UFormGroup>
    </div>
   
  </div>




  </div>

  <div  class="grid grid-cols-1 gap-5">
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
          <div class="flex flex-row space-x-5 mt-5">
  <!-- First Grid Section -->
  <div class="grid grid-cols-1 gap-5">
    <div>
      <UFormGroup label="Manufacturer" name="Manufacturer">
        <UInput placeholder="Garmin" v-model="formData.ALTER2MANTXT"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Dealer" name="Dealer">
        <UInput placeholder="Walmart.com" v-model="formData.ALTER2DEATXT"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Lead Time" name="Lead Time">
        <UInput placeholder="1"  v-model="formData.ALTER2LEADTIME"/>
      </UFormGroup>
    </div>
  </div>
  <!-- Second Grid Section -->
  <div class="grid grid-cols-1 gap-5">
    
    <div>
      <UFormGroup label="Part Number" name="Part Number">
        <UInput placeholder=""  v-model="formData.ALTER2MANNUM"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Part Number" name="Part Number">
        <UInput placeholder="1"  v-model="formData.ALTER2DEANUM" />
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
        <div class="basis-1/2 text-center">
         Qty
        </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2QTY1"    />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2QTY2" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2QTY3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2QTY3"/>
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2QTY4" />
      </UFormGroup>
    </div>
  </div>
  <!-- Second Grid Section -->
  <div class="grid grid-cols-1 ">
    <div class="basis-1/2 text-center">
         Price
        </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER2PRICE1"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER2PRICE2"  />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput  v-model="formData.ALTER2PRICE3" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER2PRICE4" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput v-model="formData.ALTER2PRICE5" />
      </UFormGroup>
    </div>
   
  </div>




  </div>

  <div  class="grid grid-cols-1 gap-5">
    <div>
      <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
        <UInput />
      </UFormGroup>
    </div>
  </div>





</div>
        </div>
      </div>
  

  <div class="flex flex-row space-x-3">
    <div class="basis-1/2 h-32 overflow-auto ">
      <UTable :rows="people" />

    </div>
         
       
        <UFormGroup
          label="Revised By"
          name="fname"
          class="basis-1/2"
        >
          <UInputMenu
           
            placeholder="Revised By"
          />
        </UFormGroup>
        <div>
        
        </div>

       
        

</div>





      <div class="flex justify-end gap-3">
        <UButton color="red" variant="outline"
          :label="!isModal ? 'Go back': 'Cancel'"
          @click="handleClose"
        />
        <UButton color="cyan" variant="outline"
          type="submit"
          label="Save"
        />
      </div>
    </UForm>





    
  </template>
</template>
