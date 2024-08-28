<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useDatePicker } from 'v-calendar';
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
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
const PlanID=ref([]);
const planData=ref([]);

const planDatacolumns = [{
  key: 'Step',
  label: 'Step'
}, {
  key: 'Description',
  label: 'Desc'
},{
  key: 'delete',
label: 'Del',
  kind: 'actions'
}]

const jobColumns = [{
  key: 'label',
  label: 'Linked Job#'
}]

const modalMeta = ref({
    skillModal: false,

  })

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
            });




const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const newEntry = ref({
  ShipDate: null,
  Serial: null,
  PlanID: null,
  Quantity: '',
  SingleMaterialCost: 10,
  PartsList: null,
  dateEntered: null,
  SingleLaborHours: null,
  SingleLaborCost: 10,
  ScheduledQty: null,
  ScheduledDate: ref(new Date()),
  CostPerUnit: 10
});

const employeeHours= ref([{}]);




const weekly = ref([]);
const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: 'week',
      label: 'Week',
    },
    {
      key: 'Operation',
      label: 'Operation',
    },
    {
      key: 'WorkCenter',
      label: 'Work Center',
    },
    {
      key: 'Hours',
      label: 'Hours',
    },
    {
        key: 'delete',
        label: 'Del',
        kind: 'actions'
      }
    
  ],

  isLoading: false
});






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


const partlist = ref([]);

const selectCategoryForList=ref();
const projectItemList=ref([]);

  onMounted(() => {
    init()
  })
  const init = async () => {
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


const handleRowClick = async () => {
  console.log('plain double-clicked:', PlanID.value);

  try {
     await useApiFetch('/api/projects/planDetails', {
      method: 'GET',

      onResponse({ response }) {
        if(response.status === 200) {
            planData.value=response._data.body;
      
        }
      },
      params: {
        PLANID:PlanID.value
      }
      
    });

    
  } catch (error) {
    console.error("Error fetching operation hour:", error);
  }
};




const editInit = async () => {
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

    await useApiFetch(`/api/projects/operations/${props.selectedCustomer}`, {
      method: 'GET',
      
      onResponse({ response }) {
        if(response.status === 200) {
          console.log("operation is",response._data.body);  
          weekly.value=response._data.body;
        }
      }
    })





  loadingOverlay.value = false
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




const onStepDelete = async (row: any) => {
  console.log("unique id is",row);
  await useApiFetch('/api/projects/planDetails', {
      method: 'DELETE',

      onResponse({ response }) {
        if(response.status === 200) {
            planData.value=response._data.body;
      
        }
      },
      params: {
        UniqueID:row.UniqueID
      }
      
    });
    handleRowClick();

  }



const onDelete = async (row: any) => {
    console.log("row is ",row.uniqueID);
    await useApiFetch(`/api/projects/operations/${row?.uniqueID}`, {
      method: 'DELETE', 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-trash-solid',
            color: 'green'
          })
          
        }
      }
    })
    init();

  }
const onSubmit = async () => {
  modalMeta.value.skillModal=true;

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
    PlanID.value=row.PlanID;

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
    <UDashboardNavbar class="gmsBlueHeader" 
        title="Manufacturing Sequence"
      >
      </UDashboardNavbar>
  <div class="flex flex-row">
    <div class="h-[400px] w-[65%] overflow-y-auto">
    <UTable
      :rows="weekly"
      :columns="gridMeta.defaultColumns"
      @select="onSelect"
      @click="handleRowClick"
    >
      <template #delete-data="{ row }">
        <UTooltip text="Delete" class="flex justify-center">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="onDelete(row)"
          />
        </UTooltip>
      </template>
    </UTable>
  </div>
     <div class="m-5">
      <div class="h-[250px] w-[450px] overflow-y-auto ml-5">
  <UTable class="mb-5" :columns="planDatacolumns" :rows="planData">
    <template #delete-data="{ row }">
      <UTooltip text="Delete" class="flex justify-center">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-trash"
          @click="onStepDelete(row)"
        />
      </UTooltip>
    </template>
  </UTable>
</div>



    <!-- <div class="m-5">
      <UTable :rows="productProjects" />
    </div> -->
<div   class="flex mt-5 justify-end">
  <UButton color="cyan" variant="outline"
        type=""
        label="Add Skill"
        @click="onSubmit"
  
        
      />
    </div>


</div>

</div>
</template>


<UDashboardModal
    v-model="modalMeta.skillModal"
    title="Skills"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl'
    }"
  >
    <MarketingManuFactureSkillList :selected-customer="selectedCustomer" />
  </UDashboardModal>



</template>
