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
import type { NUMBER } from 'sequelize';
import { id } from 'date-fns/locale';

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
const newTableOfCompletion=ref([]);
const employeeOptions=ref([]);
const selectedProjectItem = ref(null);
const jobList = ref([]);
const joblistLabel=ref([]);
const form=reactive( {
        NUMBER: null,
        QUANTITY:null,
        Cost:null,
        PerType:null,     
        ProjectType:null,
        DATEOPENED:ref(new Date()),
        ByEmployee:null,
        ProductionDate:ref(new Date()),
        ProductionBy:null,
        DATECLOSED:ref(new Date()),
        ClosedBy:null,
        Catagory:null,
        SubCatagory:null,
        PART:null,
        InstanceID:null
            });



const newEntry = reactive({
  ShipDate: null,
  Serial: null,
  PlanID: null,
  Quantity: '',
  SingleMaterialCost: 10,
  PartsList: null,
  dateEntered: ref(new Date()),
  SingleLaborHours: null,
  SingleLaborCost: 10,
  ScheduledQty: null,
  ScheduledDate: ref(new Date()),
  CostPerUnit: 10
});


const columns = [{
  key: 'Quantity',
  label: '#'
}, {
  key: 'dateEntered',
  label: 'Completion Date'
}, {
  key: 'Schedule Date',
  label: 'ScheduledDate'
}]

const jobColumns = [{
  key: 'label',
  label: 'Linked Job#'
}]





const employeeHours= ref([{}]);






const weekly = ref([]);


const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[{
    key: 'week',
    label: 'Week'
  }, {
    key: 'Operation',
    label: 'Operation'
  }, {
    key: 'WorkCenter',
    label: 'Work Center'
  }, {
    key: 'Hours',
    label: 'Hrs'
  }, {
    key: 'reworkhrs',
    label: 'Rework Hours'
  }, {
    key: 'verified',
    label: 'Verified'
  }, {
    key: 'delete',
    label: 'Del',
    kind: 'actions'
  }],

  isLoading: false
});

const gridMeta1 = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'StartTime',
      label: 'Date'
    },
    {
      key: 'Name',
      label: 'Employee'
    },
    {
      key: 'Hours',
      label: 'Hrs.'
    }, {
    key: 'delete',
    label: 'Del',
    kind: 'actions'
  }
  ],

  isLoading: false
});





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
 
    tableOfCompletion.value.push({ ...newEntry});
    console.log("table of completion",tableOfCompletion.value);


 
}



const toast = useToast()
const router = useRouter()
const customersFormInstance = getCurrentInstance();

const loadingOverlay = ref(false)
const customerExist = ref(true)
const markets = ref([])
const professions = ref([]);
const totalHours=ref();
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


const partlist = ref([]);

const selectCategoryForList=ref();
const projectItemList=ref([]);
const modalMeta = ref({
    isPartsUsed: false,
    isPartLisingModalOpen: false,
    isQuoteDetailModalOpen: false,
    isServiceOrderDetailModalOpen: false,
    isSiteVisitModalOpen: false,
    manuFactureModal:false,
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
          employeeOptions.value= response._data.body;
           console.log("employees",response._data.body);
      
        }
      }
    })
  }
  const addJob = async () => {
  // Check if the selected project item is not empty and has a value property
  if (selectedProjectItem.value && selectedProjectItem.value.value) {
    console.log("Selected value is", selectedProjectItem.value.label);

    // Create a new job object with only the value property
    const newJob = {
      value: selectedProjectItem.value.value   // Use the value property directly
    };

    // Push the new job object into the jobList
    jobList.value.push(newJob);
    joblistLabel.value.push({
  label: selectedProjectItem.value.label,
});


    console.log("Updated jobList is", jobList.value);
  } else {
    console.error('Selected project item or value cannot be empty');
  }
};
const operation=ref([]);


const handleRowClick = async () => {
  console.log('Row double-clicked:', operation.value);

  try {
     await useApiFetch('/api/projects/operationHour', {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          employeeHours.value=response._data.body;
          console.log("dd",response._data.body);
          totalHours.value = response._data.body[0]?.totalHour;
           console.log("total hour is",totalHours.value);
      
        }
      },
      params: {
        operationId: operation.value,
        jobid: props.selectedCustomer
      }
      
    });

    
  } catch (error) {
    console.error("Error fetching operation hour:", error);
  }
};




const editInit = async () => {
  console.log("project is",props.selectedCustomer);
  if(props.selectedCustomer!=null){
  loadingOverlay.value = true;
  console.log("project is",)
  await useApiFetch(`/api/projects/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        customerExist.value = true
        console.log("details is", response._data.body)
        
        for (const key in response._data.body) {
            form[key] = response._data.body[key]
          
        }
      }
    }, 
    onResponseError({}) {
      customerExist.value = false
    }
  })

  subCategories();
  part();
}
  propertiesInit();
  await useApiFetch(`/api/projects/linkedJob/getJob/${props.selectedCustomer}`, {
      method: 'GET',
      
      onResponse({ response }) {
  if (response.status === 200) {
    const updatedJobList = response._data.body.map(job => {
    return {
      // Assign linkedJob to joblabel.label
      label: job.linkedJob
    };
  });

  // Update jobList with the transformed data
  joblistLabel.value = updatedJobList;
  }
}

    })

    getOperation();





  loadingOverlay.value = false
}

const getOperation = async () => {
await useApiFetch(`/api/projects/operations/${props.selectedCustomer}`, {
      method: 'GET',
      
      onResponse({ response }) {
        if(response.status === 200) {
          console.log("operation is",response._data.body);  
          weekly.value=response._data.body;
        }
      }
    })

  }

const getInventory = async () => {
  loadingOverlay.value = true;
  console.log("project is",)
  await useApiFetch(`/api/projects/inventoryDetails/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        customerExist.value = true
        console.log("details of inventory", response._data.body)
        
        tableOfCompletion.value=response._data.body;
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
        subCategory: form.Catagory
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
const filteredData = ref([]);
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
          console.log("prjeic sss",response._data.body);
          filteredData.value = response._data.body
          .filter(item => item !== null && item !== undefined)
          .map(item => ({
            label: item.NUMBER, // Field name for display
            value: item.JobID // Field name for value
          }));
      
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
        category:form.Catagory,
        subCategory: form.SubCatagory
      },
      onResponse({ response }) {
        if (response.status === 200) {
          // subCategorielist.value = response._data.body;
          console.log("parts are",response._data.body);
          partlist.value = response._data.body.map(item => ({
            label: `${item.model} - ${item.description}`,
            value: item.instanceID, // or any other identifier you prefer
          }))

   
         
        
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

const onSubmit = async (event: FormSubmitEvent<any>) => {
  console.log("insert function calling",form);
  form.PerType=selectedInventory.value;
  form.ProjectType=form.Catagory;
  form.InstanceID=form.PART.value;
  console.log("form instance",form.PART.value);
  form.PART=form.PART.label;
  

  console.log("selectCategoryForList",selectCategoryForList)
  if(props.selectedCustomer === null) {
    await useApiFetch('/api/projects', {
      method: 'POST',
      body: form, 
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

    console.log("table of completion a",tableOfCompletion.value);
   
    insertInventory();


    console.log("Job Linked is there",JSON.stringify(jobList.value));

   AddLinkedJob();

    
    





  }
  
  else { // Update Customer
    console.log("its cclall");
    await useApiFetch(`/api/projects/${props.selectedCustomer}`, {
      method: 'PUT',
      body: form, 
      onResponse({ response }) {
        if (response.status === 200) {
          console.log("linked job is",response._data);
        // jobList.value=response._data;
         
        }
      }
    })
    insertInventory();
    AddLinkedJob();
  }
  emit('save');
}
const AddLinkedJob = async () => {
await useApiFetch(`/api/projects/linkedJob/${props.selectedCustomer}`, {
      method: 'POST',
      body: JSON.stringify({
        jobData: jobList.value,
    selectedCustomer: props.selectedCustomer
      }),
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
          console.log("successful");
        }
      }
    })
  }

  const onSelect = async (row) => {
    operation.value=row.uniqueID;
    console.log("operation id is",operation.value);
  }

const  handleRowDoubleClick=()=>{
  modalMeta.value.manuFactureModal=true; 
}
 const deleteOperation=async(row)=>{
  console.log("row id in operations",row);
  await useApiFetch(`/api/projects/operations/${row.uniqueID}`, {
      method: 'DELETE',
      
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
          getOperation();
        }
      }
    })

 }

 const deleteHour=async(row)=>{
  console.log("row id in operations",row);
  await useApiFetch(`/api/projects/operations/operation/${row.UID}`, {
      method: 'DELETE',
      
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
      , params: {
        UniqueID: row.UID.value,
       
      }
    })
    handleRowClick();
 }



 





const insertInventory = async () => {
  console.log("inventory list value is",tableOfCompletion.value);
 await useApiFetch('/api/projects/insertInventory', {
      method: 'POST',
      body: JSON.stringify({
    tableOfCompletion: tableOfCompletion.value,
    selectedCustomer: props.selectedCustomer
  }),
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
          console.log("successful");
        }
      }
    })

  }



if(props.selectedCustomer !== null) 
 {
  editInit();
  getInventory();
 }
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
             v-model="form.NUMBER"
            />
          </UFormGroup>
        </div>
       
        <div class="basis-1/5">
          <UFormGroup
            label="Project Qty."
            name="QUANTITY"
          >
            <UInput
           v-model="form.QUANTITY"
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
          v-model="form.Cost"
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
                          <UButton icon="i-heroicons-calendar-days-20-solid"  :label="format(form.DATEOPENED, 'd MMM, yyy')"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <DatePickerClient v-model="form.DATEOPENED" is-required @close="close" />

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
                 v-model="form.ByEmployee"  :options="employeeOptions"
                    
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
                          <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(form.ProductionDate, 'd MMM, yyy')"   variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker  v-model="form.ProductionDate"  is-required @close="close" />
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
                  v-model="form.ProductionBy"  :options="employeeOptions"
                    
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
                          <UButton icon="i-heroicons-calendar-days-20-solid"  :label="format(form.DATECLOSED, 'd MMM, yyy')"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker v-model="form.DATECLOSED" is-required @close="close" />
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
                   v-model="form.ClosedBy" :options="employeeOptions"
                    
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
            v-model="form.Catagory" :options="category" 
            />
          </UFormGroup>
          <UFormGroup label="Sub Category" class="basis-1/2"  name="Sub Category">
            <UInputMenu 
            :options="subCategorielist" v-model="form.SubCatagory"  @change="part" />
          </UFormGroup>
          
        </div>
        <UFormGroup label="Part"  name="Part" class="mt-2">
            <UInputMenu 
            :options="partlist"
            v-model="form.PART"
            />
          </UFormGroup>
          <div class="grid grid-cols-1 mt-6 h-48">
        <UTable :rows="tableOfCompletion" :columns="columns" />
         
        </div>
        <div class="flex flex-row space-x-2 mt-2">
          <UFormGroup label="Qty" class="basis-1/3" name="Qty">
            <UInput
              v-model="newEntry.Quantity"
            />
          </UFormGroup>
          <div class="mt-6">
            <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"  :label="format(newEntry.dateEntered, 'd MMM, yyy')"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <CommonDatePicker v-model="newEntry.dateEntered" is-required @close="close" />
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
    <div v-else-if="item.key === 'Operation' && props.selectedCustomer !== null" class="space-y-3">
            <div class="grid grid-cols-1 mt-6 h-48">
         
              <UTable :rows="weekly" :columns="gridMeta.defaultColumns"  @select="onSelect" @click="handleRowClick"  @dblclick="handleRowDoubleClick">
                <template #delete-data="{row}">
          <UTooltip text="Delete" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="deleteOperation(row)"/>
          </UTooltip>
        </template>
              </UTable>





              

        </div>
        <div class="flex flex-row space-x-4 mt-2">
        <div class="grid grid-cols-1 mt-6 h-48 basis-1/2 ">
                <h2 class="font-medium">Employee Hours For Selected Operation</h2>
                <UTable :rows="employeeHours" :columns="gridMeta1.defaultColumns">
                    <template #delete-data="{ row }">
                      <UTooltip text="Delete" class="flex justify-center">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="deleteHour(row)" />
                      </UTooltip>
                    </template>
                  </UTable>
                 
                  
                  <h1 class="mt-5 flex justify-end mr-2 font-bold">Total Hours: {{ totalHours }}</h1>
                  
                  
                  
                  
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
            <UTable :rows="joblistLabel" :columns="jobColumns" />

            
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
      v-model="selectedProjectItem" 
      :options="filteredData" 
      
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
          type=""
          label="Save"
          @click="onSubmit"
          
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
    <PartsUsed :selected-customer="selectedCustomer" 
      @close="modalMeta.isPartsUsed = true"/>
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
    <MarketingPartList :selectedProduct="selectedCustomer"  @close="modalMeta.isPartLisingModalOpen = true"/>
  </UDashboardModal> 



  <UDashboardModal
    v-model="modalMeta.manuFactureModal"
    
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-10' },
      width: 'w-[1500px] sm:max-w-9xl', 
    }"
  >
  <MarketingManuFactureList :selected-customer="selectedCustomer"  v-model="modalMeta.manuFactureModal" />

  </UDashboardModal> 





</template>
