<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useDatePicker } from 'v-calendar';
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';


const items = [{
    key:"sub",
  label: 'Sub Assembly',
}, {
    key:'project',
  label: 'Product Projects',

}, {
    key: 'Operation',
  label: 'Operations',
}]
const tableOfCompletion= [{
  "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564"
 
}, {
    "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564"
}, {
    "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564"
}, {
    "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564"
}, {
    "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564",
}, {
    "#": '1',
  "Completion Date":"dlfakjdsa",
  "Shedule Date":"1564"
}]

const productProjects= [{
  "Linked Job #": '1',
 
}, {
    "Linked Job #": '1',

}, {
    "Linked Job #": '1',

}, {
    "Linked Job #": '1',
}, {
    "Linked Job #": '1',
}, {
    "Linked Job #": '1',

}]





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
 
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Project#"
            name="Project#"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>
       
        <div class="basis-1/5">
          <UFormGroup
            label="Project Qty."
            name="PName"
          >
            <UInput

            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="ProjectType"
            name="PType"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Lastest Cost"
            name="LCost"
          >
            <UInput
          
            />
          </UFormGroup>
          </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Relieve Inventory Per:"
            name="RelieveI"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>

        </div>
  
       
            <div class="flex flex-row space-x-3">
              
              <div class="basis-1/2">
                <UFormGroup
                  label="Date Opened"
                  name="DOpened"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker  is-required @close="close" />
                          </template>
                        </UPopover>
                    </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="By"
                  name="By"
                >
                  <UInputMenu
                   
                    
                  />
                </UFormGroup>
              </div>
            </div>
                 <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Ready To Produce "
                  name="RProduce"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker  is-required @close="close" />
                          </template>
                        </UPopover>
                    </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="By"
                  name="By"
                >
                  <UInputMenu
                   
                    
                  />
                </UFormGroup>
              </div>
              <div>
            </div>
             
            </div>
           <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
                <UFormGroup
                  label="Project Closed"
                  name="PClosed"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker  is-required @close="close" />
                          </template>
                        </UPopover>
                    </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="By"
                  name="By"
                >
                  <UInputMenu
                   
                    
                  />
                </UFormGroup>
              </div>
            </div>


            <UTabs :items="items" class="w-full">
    <template #item="{ item }">


        <div v-if="item.key === 'sub'" class="Category">
            <div class="flex flex-row space-x-2">
          <UFormGroup label="Category" class="basis-1/2" name="name">
            <UInput />
          </UFormGroup>
          <UFormGroup label="Sub Category" class="basis-1/2"  name="Sub Category">
            <UInput  />
          </UFormGroup>
          
        </div>
        <UFormGroup label="Part"  name="Part" class="mt-2">
            <UInputMenu />
          </UFormGroup>
          <div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="tableOfCompletion" />
         
        </div>
        <div class="flex flex-row space-x-2 mt-2">
          <UFormGroup label="Qty" class="basis-1/2" name="Qty">
            <UInput />
          </UFormGroup>
          <UFormGroup
                 
                  class="basis-1/2 mt-6"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker  is-required @close="close" />
                          </template>
                        </UPopover>
                    </UFormGroup>
          
        </div>
        



    </div>
        <div v-else-if="item.key === 'Operation'" class="space-y-3">
            <div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="productProjects" />
         
        </div>
        
    </div>
        <div v-else-if="item.key === 'project'" class="space-y-3">
        
        </div>
        </template>

  </UTabs>






  
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
