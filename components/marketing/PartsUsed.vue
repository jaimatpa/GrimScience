<script setup lang="ts">
import { number } from 'yup';

const items = ref([]);
const isOpen = ref(false);
const tbBpId=ref(null);

const qty=ref(null);
const props = defineProps({
     // Or use the correct type (e.g., Number) based on your data
  selectedCustomer: {
    type: [String, Number, null],
    required: true
  }// Or use the correct type based on your data
});
const partsTable2 = ref([{}]);
const headerFilters = ref({
  parttype: {
    filter: 'parttype ',
    options: [] // Ensure this array has options
  },
  subcategory: {
    filter: 'subcategory ',
    options: [] // Ensure this array has options
  },
});

const filterValues = ref({
  parttype: null,
  subcategory: null,

  })
onMounted(() => {
  init();
});

const handleFilterInputChange = async (event, name) => {
    if (filterValues.value.hasOwnProperty(name)) {
      filterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
  }


const init = async () => {
  for (const key in headerFilters.value) {
    console.log("The key is", key);

    // Define the API URL based on the key
    const apiURL = headerFilters.value[key]?.api ?? `/api/projects/usedParts/${key}`;
    console.log("API URL is", apiURL);

    // Fetch data from the API
    await useApiFetch(apiURL, {
      method: 'GET',
      onResponse({ response }) {
        if (response.status === 200) {
          // Populate the options array with the API response
          headerFilters.value[key].options = [null, ...response._data.body];
          console.log("The response is", headerFilters.value[key].options);
        }
      }
    });
   parts();
  }
};

const parts=async ()=>{
  await useApiFetch('/api/projects/partsHoursDetails/', {
  method: 'GET',
  params: { JobId: props.selectedCustomer },  // Pass the cleanedParams directly
  onResponse({ response }) {
    if (response.status === 200) {
      partsTable2.value=response._data.body;
      console.log("2nd table is", response._data.body);
      console.log("the  props is",props.selectedCustomer);
      
    }
  }
});
}



const handleFilterChange = () => {
  console.log("filter value is",filterValues.value);
      fetchGridData();
  }

  const fetchGridData = async () => {
  // Remove properties where the value is null
  const cleanedParams = Object.fromEntries(
    Object.entries(filterValues.value).filter(([key, value]) => value !== null)
  );

  // Log the cleaned parameters for debugging
  console.log("Filtered Params:", cleanedParams);

  // Fetch data from the API
  await useApiFetch('/api/projects/usedParts/', {
    method: 'GET',
    params: cleanedParams,  // Pass the cleanedParams directly
    onResponse({ response }) {
      if (response.status === 200) {
        console.log("the  props is",props.selectedCustomer);
        items.value=response._data.body;
      }
    }
  });





};


const onSelect = async (row) => {
  tbBpId.value=row.UniqueID;
    console.log("bpBp is id is",tbBpId.value);
  }
  const handleRowClick = async () => {
    isOpen.value=true;
  }


  const insertQty = async () => {
    await useApiFetch(`/api/projects/insertOperationWork?JobID=${props.selectedCustomer}&OperationID=${456}&tblBPID=${tbBpId.value}&Qty=${qty.value}`, {
    method: 'POST',
    onResponse({ response }) {
      if (response.status === 200) {
        console.log("qty is insertd");
        parts();
        isOpen.value=false;
      }
    }
  });

  }



</script>
<template>
  <UDashboardNavbar class="gmsPurpleTitlebar" 
    title="Parts used"
  />
  <div class="flex flex-row space-x-20">
    <div class="basis-1/2 h-[500px] overflow-auto flex flex-wrap gap-4">
      <template v-for="[key, value] in Object.entries(headerFilters)" :key="key">
        <template v-if="value.options.length > 1">
          <div class="basis-1/7 max-w-[200px]">
            <UFormGroup
              :label="value.filter"
              :name="key"
            >
              <USelect
                v-model="filterValues[`${value.filter}`]"
                :options="value.options"
                @change="handleFilterChange()"
              />
            </UFormGroup>
          </div>
        </template>
      </template>
      <div>
        <UTable :rows="items" @select="onSelect" @dblclick="handleRowClick() " />
      </div>
    </div>

    <div class="basis-1/2 h-[500px] overflow-auto">
      <UTable :rows="partsTable2" />
    </div>
  </div>
  <UModal v-model="isOpen">
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      How Many Items Would You Like to Place on this Job
    </template>

  
        <input type="number" v-model="qty" class="border rounded p-2 w-full" placeholder="Enter number of items" />
    

    <template #footer>
      <div class="p-2 flex justify-end">
        <button @click="insertQty" class="bg-blue-500 text-white rounded px-4 py-2">Submit</button>
      </div>
    </template>
  </UCard>
</UModal>







</template>

    