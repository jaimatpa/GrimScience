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
const markets = ref([])
const professions = ref([])
const categories = ref([])
const conferences = ref([])
const usstates = ref([])
const formData = reactive({
  UniqueID: null,
  market: null,
  number: null,
  source: professions[0],
  sourcedescription: null,
  SourceConfrence: null,
  fname: null,
  mi: null,
  lname: null,
  title: null,
  position: null,
  company1: null,
  company2: null,
  country: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  workphone: null,
  homephone: null,
  cellphone: null,
  fax: null,
  email: null,
  website: null,
  notes: null,
  billcompany1: null,
  billcompany2: null,
  billcountry: null,
  billaddress: null,
  billcity: null,
  billstate: null,
  billzip: null,
  billphone: null,
  billfax: null,
  attn: null,
  adddate: null,
  ParadynamixCatagory: null,
  fullname: null,
  Extension: null,
  ExtensionBill: null,
})

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
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
  await useApiFetch('/api/customers/markets', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        markets.value = response._data.body;
      }
    }, 
    onResponseError() {
      markets.value = []
    }
  })
  await useApiFetch('/api/customers/conferences', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        conferences.value = response._data.body;
      }
    }, 
    onResponseError() {
      conferences.value = []
    }
  })
  await useApiFetch('/api/customers/categories', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        categories.value = response._data.body;
      }
    },
    onResponseError() {
      categories.value = []
    }
  })
  await useApiFetch('/api/customers/professions', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        professions.value = response._data.body;
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
              v-model="formData.fname"
              placeholder="Category"
            />
          </UFormGroup>
        </div>
       
        <div class="basis-1/5">
          <UFormGroup
            label="Sub Category"
            name="lname"
          >
            <UInputMenu
              v-model="formData.lname"
              placeholder="Sub Category"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Stock Number"
            name="title"
          >
            <UInput
              v-model="formData.title"
              placeholder="Stock Number"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inspection"
            name="position"
          >
            <UInput
              v-model="formData.position"
              placeholder="Inspection"
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
              v-model="formData.market"
              v-model:query="formData.market"
              :options="markets"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Multiple"
            name="number"
          >
            <UInput
              v-model="formData.number"
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
              v-model="formData.source"
              v-model:query="formData.source"
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
              v-model="formData.ParadynamixCatagory"
              v-model:query="formData.ParadynamixCatagory"
              :options="categories"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Description"
            name="Description"
          >
            <UInputMenu
              v-model="formData.SourceConfrence"
              v-model:query="formData.SourceConfrence"
              :options="conferences"
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
              v-model="formData.market"
              v-model:query="formData.market"
              :options="markets"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inventory Cost"
            name="Inventory Cost"
          >
            <UInput
              v-model="formData.number"
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
           

            />
          </UFormGroup>
        </div>
        <div class="basis-2/5">
          <UFormGroup
            label="Specification"
            name="Account"
          >
            <UInput
             
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
        <div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="people" />
         
        </div>
        <div class="">
          <UFormGroup
            label="Comments"
            name="Comments"
          >
            <UTextarea 
          class="w-48 "
              
            />
          </UFormGroup>
        </div>

    </div>
    
    
</div>
<div class="grid grid-cols-1 mt-6 h-48 w-60">
    <UTable :rows="InventoryTransactions" />
     
    </div>

</div>


      <div class="flex flex-row space-x-5">
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
        <UInput placeholder="1" />
      </UFormGroup>
    </div>
  </div>
  <!-- Second Grid Section -->
  <div class="grid grid-cols-1 gap-5">
    
    <div>
      <UFormGroup label="Part Number" name="Part Number">
        <UInput placeholder="" />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup label="Part Number" name="Part Number">
        <UInput placeholder="1" />
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
        <div class="basis-1/2 text-center">
         Qty
        </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
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
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
      </UFormGroup>
    </div>
    <div>
      <UFormGroup >
        <UInput />
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




      



      <div class="flex flex-row">
        <div class="basis-1/2 text-center">
          Shipping Information
        </div>
        <div class="basis-1/2 text-center">
          Billing Information
        </div>
      </div>
  
      <div class="flex flex-row space-x-5">
        <div class="basis-1/2">
          <!-- Shipping Information -->
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Company1"
                  name="company1"
                >
                  <UInput
                    v-model="formData.company1"
                    placeholder="Company1"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Company2"
                  name="company2"
                >
                  <UInput
                    v-model="formData.company2"
                    placeholder="Company2"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Country"
                  name="country"
                >
                  <UInput
                    v-model="formData.country"
                    placeholder="Country"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Address"
                  name="address"
                >
                  <UInput
                    v-model="formData.address"
                    placeholder="Address"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="City"
                  name="city"
                >
                  <UInput
                    v-model="formData.city"
                    placeholder="Dallas"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="State"
                  name="state"
                >
                  <UInputMenu
                    v-model="formData.state"
                    :options="usstates"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="Zip"
                  name="zip"
                >
                  <UInput
                    v-model="formData.zip"
                    placeholder="65254"
                  />
                </UFormGroup>
              </div>
            </div>





            
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Fax"
                  name="fax"
                >
                  <UInput
                    v-model="formData.fax"
                    placeholder="Fax"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Homephone"
                  name="homephone"
                >
                  <UInput
                    v-model="formData.homephone"
                    placeholder="(564)-324-2342"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-6/12">
                <UFormGroup
                  label="Email"
                  name="email"
                >
                  <UInput
                    v-model="formData.email"
                    type="email"
                    placeholder="email"
                  />
                </UFormGroup>
              </div>
              <div class="basis-5/12">
                <UFormGroup
                  label="Workphone"
                  name="workphone"
                >
                  <UInput
                    v-model="formData.workphone"
                    placeholder="(564)-324-2342"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/12">
                <UFormGroup
                  label="Ext"
                  name="ext"
                >
                  <UInput
                    v-model="formData.Extension"
                    placeholder="1"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Website"
                  name="website"
                >
                  <UInput
                    v-model="formData.website"
                    placeholder="website"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Cellphone"
                  name="cellphone"
                >
                  <UInput
                    v-model="formData.cellphone"
                    placeholder="(564)-324-2342"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Comment"
                  name="comment"
                >
                  <UTextarea
                    v-model="formData.notes"
                    :rows="3"
                    type="text"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="basis-1/2"> 
          <!-- Billing Information -->
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Company1"
                  name="billcompany1"
                >
                  <UInput
                    v-model="formData.billcompany1"
                    placeholder="Bill Company1"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Company2"
                  name="billcompany2"
                >
                  <UInput
                    v-model="formData.billcompany2"
                    placeholder="Bill Company2"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Country"
                  name="country"
                >
                  <UInput
                    v-model="formData.billcountry"
                    placeholder="Bill Country"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Address"
                  name="address"
                >
                  <UInput
                    v-model="formData.billaddress"
                    placeholder="Bill Address"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="City"
                  name="billcity"
                >
                  <UInput
                    v-model="formData.billcity"
                    placeholder="Dallas"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="State"
                  name="billstate"
                >
                  <UInputMenu
                    v-model="formData.billstate"
                    :options="usstates"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/4">
                <UFormGroup
                  label="Zip"
                  name="billzip"
                >
                  <UInput
                    v-model="formData.billzip"
                    placeholder="65254"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Fax"
                  name="billfax"
                >
                  <UInput
                    v-model="formData.billfax"
                    placeholder="Fax"
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Phone"
                  name="billphone"
                >
                  <UInput
                    v-model="formData.billphone"
                    placeholder="(564)-324-2342"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Ext"
                  name="ExtensionBill"
                >
                  <UInput
                    v-model="formData.ExtensionBill"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="w-full">
                <UFormGroup
                  label="Attn"
                  name="attn"
                >
                  <UInput
                    v-model="formData.attn"
                    placeholder="Attn"
                  />
                </UFormGroup>
              </div>
            </div>
          </div>
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
