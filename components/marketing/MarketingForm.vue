<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useDatePicker } from 'v-calendar';
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import PartsUsed from './PartsUsed.vue';
import PartsList from '../job/PartsList.vue';
import { format } from 'date-fns'
import DatePickerClient from '../common/DatePicker.client.vue';
import type { UTableColumn } from '~/types';

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
const tableOfCompletion = ref([]);
const jobList = ref([
{
  job:''
}
]);


const date = ref(new Date());
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const newEntry = ref({
  qty: '',
  completionDate:formatDate(date.value),
  scheduleDate: '',
});




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

const employeeHours= [{
  Date: '1',
  Employee:'emon',
  Hrs:'1'
 
}, {
  Date: '1',
  Employee:'emon',
  Hrs:'1'

}, {
  Date: '1',
  Employee:'emon',
  Hrs:'1'

}, {
  Date: '1',
  Employee:'emon',
  Hrs:'1'
}, {
  Date: '1',
  Employee:'emon',
  Hrs:'1'
}, {
  Date: '1',
  Employee:'emon',
  Hrs:'1'

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

const weekly = [{
  "#": '1',
  Week:8,
  Operation:'Website Wizard Page',
  "Work Center":'54',
  Hrs: '20',
 "Rework Hours":'dfkalsdf',
 "Verfied":'done'
}, {
    po: 'PO54654',
  date:5/5/12,
  ordered:'2',
  recieved:'54',
  Price: '',
 vender:'dfkalsdf',

}, {
  "#": '1',
  Week:8,
  Operation:'Website Wizard Page',
  "Work Center":'54',
  Hrs: '20',
 "Rework Hours":'dfkalsdf',
 "Verfied":'done'
}, {
  "#": '1',
  Week:8,
  Operation:'Website Wizard Page',
  "Work Center":'54',
  Hrs: '20',
 "Rework Hours":'dfkalsdf',
 "Verfied":'done'
}, {
  "#": '1',
  Week:8,
  Operation:'Website Wizard Page',
  "Work Center":'54',
  Hrs: '20',
 "Rework Hours":'dfkalsdf',
 "Verfied":'done'
}, {
  "#": '1',
  Week:8,
  Operation:'Website Wizard Page',
  "Work Center":'54',
  Hrs: '20',
 "Rework Hours":'dfkalsdf',
 "Verfied":'done'
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


const onUsed = () => {
    modalMeta.value.isPartsUsed = true
  }

  const onPartListing = () => {
    modalMeta.value.isPartLisingModalOpen = true
  }


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

const addInventory = () => {
 
    tableOfCompletion.value.push({ ...newEntry.value });
    console.log("table of completion",tableOfCompletion.value);


 
}



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
const projectTypes=['Products','Sub Assembly'];
const selected = ref(projectTypes[0])
const RelieveInventory=['Serial/Unit','Operation']
const selectedInventory=ref(RelieveInventory[0])
const employeeName=ref([]);
const category=['Marketing',
'Accounting',
'Engineering',
'Manufacturing']
const selectedCategory=ref(category[0]);
const subCategorielist=ref([]);
const subCategorySeleted=ref();
const partlist = ref([]);
const selectPart=ref([]);
const selectCategoryForList=ref([]);
const projectItemList=ref([]);
const selectedProjectItem=ref([]);
const modalMeta = ref({
    isPartsUsed: false,
    isPartLisingModalOpen: false,
    isQuoteDetailModalOpen: false,
    isServiceOrderDetailModalOpen: false,
    isSiteVisitModalOpen: false,
    modalTitle: "New Customer",
  })

  onMounted(() => {
    init()
  })
  const init = async () => {
    fetchDropdownData();

  
  }
  const fetchDropdownData = async () => {
    await useApiFetch('/api/projects/employees', {
      method: 'GET', 
      onResponse({ response }) {
        if(response.status === 200) {
           employeeName.value = response._data.body;
           console.log("employees",employeeName.value);
      
        }
      }
    })
  }
  const addJob = async () => {
  if (selectedProjectItem.value) { // Check if the selected job is not empty
    const jobString = selectedProjectItem.value.toString();
  
  // Push the new job object into the jobList
  jobList.value.push({ job: jobString });

  } else {
    console.error('Job cannot be empty');
  }
};

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

const subCategories = async () => {
  console.log("category is",selectedCategory);
  try {
    loadingOverlay.value = true;
    await useApiFetch('/api/projects/subCategory', {
      method: 'GET',
      params: {
        subCategory: selectedCategory.value
      },
      onResponse({ response }) {
        if (response.status === 200) {
          subCategorielist.value = response._data.body;
        
        } else {
          markets.value = [];
          console.error('Unexpected response status:', response.status);
        }
      },
      onResponseError(error) {
        markets.value = [];
        console.error('API fetch error:', error);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    loadingOverlay.value = false;
  }
};

const productItem = async () => {
  try {
    loadingOverlay.value = true;
    await useApiFetch('/api/projects/projectItem', {
      method: 'GET',
      params: {
        category: selectCategoryForList.value
      },
      onResponse({ response }) {
        if (response.status === 200) {
       console.log("response is",response._data.body);
       projectItemList.value=response._data.body;
       
        
        } else {
          markets.value = [];
          console.error('Unexpected response status:', response.status);
        }
      },
      onResponseError(error) {
        markets.value = [];
        console.error('API fetch error:', error);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    loadingOverlay.value = false;
  }
};




const part = async () => {
  console.log("category is",selectedCategory);
  try {
    loadingOverlay.value = true;
    await useApiFetch('/api/projects/parts', {
      method: 'GET',
      params: {
        category:selectedCategory.value,
        subCategory: subCategorySeleted.value
      },
      onResponse({ response }) {
        if (response.status === 200) {
          // subCategorielist.value = response._data.body;
          console.log("parts are",response._data.body);
          partlist.value = response._data.body;

   
         
        
        } else {
          markets.value = [];
          console.error('Unexpected response status:', response.status);
        }
      },
      onResponseError(error) {
        markets.value = [];
        console.error('API fetch error:', error);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    loadingOverlay.value = false;
  }
};




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
// Computed property to transform data into the required format
const employeeOptions = computed(() => {
  return employeeName.value.map(employee => ({
    label: `${employee.fName} ${employee.lName}`,
    value: employee.UniqueID
  }));
});
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
          <UInputMenu v-model="selected" :options="projectTypes" />
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
           
            <UInputMenu v-model="selectedInventory" :options="RelieveInventory" />
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
                   :options="employeeOptions"
                    
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              
              <div class="basis-1/2">
                <UFormGroup
                  label="Ready To Produce"
                  name="RTOProduce"
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
                    :options="employeeOptions"
                    
                  />
                </UFormGroup>
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
                    :options="employeeOptions"
                    
                  />
                </UFormGroup>
              </div>
            </div>

            <div v-if="selected === 'Sub Assembly'">
            <UTabs :items="items" class="w-full">
    <template #item="{ item }">


        <div v-if="item.key === 'sub'" class="Category">
            <div class="flex flex-row space-x-2">
          <UFormGroup label="Category" class="basis-1/2" name="Category">
            
           
            <UInputMenu 
            @change="subCategories"
            v-model="selectedCategory" :options="category" 
            />
          </UFormGroup>
          <UFormGroup label="Sub Category" class="basis-1/2"  name="Sub Category">
            <UInputMenu 
            :options="subCategorielist" v-model="subCategorySeleted"  @change="part" />
          </UFormGroup>
          
        </div>
        <UFormGroup label="Part"  name="Part" class="mt-2">
            <UInputMenu 
            :options="partlist"
            v-model="selectPart"
            />
          </UFormGroup>
          <div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="tableOfCompletion" />
         
        </div>
        <div class="flex flex-row space-x-2 mt-2">
          <UFormGroup label="Qty" class="basis-1/3" name="Qty">
            <UInput
              v-model="newEntry.qty"
            />
          </UFormGroup>
          <div class="mt-6">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />
          
              <template #panel="{ close }">
                <DatePickerClient v-model="date" is-required @close="close" />
              </template>
            </UPopover>
            </div>

            

            



<div class="basis-1/3 mt-6">


  <UButton
 
  color="cyan"
  variant="outline"
  icon="i-heroicons-pencil-square"
  type="submit"
  label="Put into Inventory"
   @click="addInventory()"
/>

</div>
        </div>
        



    </div>
        <div v-else-if="item.key === 'Operation'" class="space-y-3">
            <div class="grid grid-cols-1 mt-6 h-48">
              <UTable :rows="weekly" />
              

        </div>
        <div class="flex flex-row space-x-4 mt-2">
        <div class="grid grid-cols-1 mt-6 h-48 basis-1/2 ">
                <h2 class="font-medium">Employee Hours For Selected Operation</h2>
              <UTable :rows="employeeHours" />

                </div>
                <div class="basis-1/2 ">
                <div class="flex flex-row mt-6 ">
                  <div  class="basis-1/2">
                    <h2 class="font-medium">Rework</h2>
              
                    <UTooltip text="Edit" >
                  <UButton
                    color="cyan"
                    variant="outline"
                    icon="i-heroicons-pencil-square"
                    type="submit"
                    label="Rework Parts"
                     @click="onUsed()"
                  />
                </UTooltip>

                    <UFormGroup
                  label="Hours"
                  name="Hours"
                  class="mt-3"
                >
            <UInput
             
            />
            </UFormGroup>
                  </div>
                  <div class="mt-3 ml-10 ">
                    <h2>Rework Cost</h2>
                    <h2>$00</h2>

                  </div>

                  </div>
                  <div class="mt-5 flex justify-center">
                    <UTooltip text="Edit" >
                     <UButton
                       color="green"
                       variant="outline"
                       icon="i-heroicons-plus"
                       type="submit"
                       label="Verify  & Close Operation"
                      
                     />
                   </UTooltip> 

                  </div>
                </div>
                
                
        </div>
        <div class="flex flex-row">
          <div class="basis-1/2">
            <h2 class="font-medium">Manage Time Entries </h2>
            <UTooltip text="Edit" >
                       <UButton
                         class="text-[#1c96c5]"
                         variant="outline"
                         icon="i-heroicons-pencil-square"
                         type="submit"
                         label="Move Selected Entries to Operation:"
                        
                       />
                     </UTooltip> 

          </div>
          <div class="basis-1/2">

            <UFormGroup
           label="Destination Operation"
           name="Destination"
         >
           <UInputMenu
            
             
           />
            </UFormGroup>
          </div>


        </div>
    </div>
        <div v-else-if="item.key === 'project'" class="flex flex-row space-x-3">
          <div class="basis-1/2">
            <UTable :rows="jobList" />


          </div>
          <div class="basis-1/2 ">
            <div>
            <UFormGroup label="Category" class="basis-1/2" name="Category">
            
           
            <UInputMenu 
            @change="productItem"
            v-model="selectCategoryForList" :options="category" 
            />
          </UFormGroup>
        </div>

<div>
  <UFormGroup label="Project Item" class="basis-1/2 mt-6" name="ProjectItem">
            
           
            <UInputMenu 
            :options="projectItemList" v-model="selectedProjectItem"
            />
          </UFormGroup>

  
</div>
<div class="basis-1/2 mt-6 ">
  <UButton
               class="text-[#1c96c5] ml-3"
               variant="outline"
               icon="i-heroicons-magnifying-glass"
               type="submit"
               label="Add Job"
               @click="addJob"
            

              
             />
  </div>

          </div>
        </div>

      
        </template>

  </UTabs>
</div>
 


  
      <div class="flex justify-end gap-3">
        <UTooltip text="Edit" >
          <UButton color="red" variant="outline"
            :label="!isModal ? 'Go back': 'Cancel'"
            @click="handleClose"
          />
          <UButton
               class="text-[#1c96c5] ml-3"
               variant="outline"
               icon="i-heroicons-magnifying-glass"
               type="submit"
               label="View Instructions"
            

              
             />

             <UButton
               class="text-[#1c96c5] ml-3"
               variant="outline"
               icon="i-heroicons-magnifying-glass"
               type="submit"
               label="View Parts Listing"
             @click="onPartListing()"

              
             />
           </UTooltip> 
        <UButton color="cyan" variant="outline"
          type="submit"
          label="Save"
        />
      </div>
    </UForm>
  </template>
   <!-- is Part Modal -->
   <UDashboardModal
    v-model="modalMeta.isPartsUsed"
    
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-10' },
      width: 'w-[1500px] sm:max-w-9xl', 
    }"
  >
    <PartsUsed  @close="modalMeta.isPartsUsed = true"/>
  </UDashboardModal> 
<!-- is Part Listing Modal -->
<UDashboardModal
    v-model="modalMeta.isPartLisingModalOpen"
    
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1500px] sm:max-w-9xl', 
    }"
  >
    <PartsList @close="modalMeta.isPartLisingModalOpen = true"/>
  </UDashboardModal> 



</template>
