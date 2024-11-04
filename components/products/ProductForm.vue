<script setup lang="ts">
import type { FormError, FormSubmitEvent,  } from '#ui/types'
import type { UTableColumn } from "~/types";
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import Parts from '~/pages/materials/parts.vue';
const { handleFileInput, files} = useFileStorage();

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedProduct: {
    type: [String, Number, null],
    required: true
  },
  isModal: {
    type: [Boolean]
  }
})

onMounted(() => {
  init();
  tabItems();
});

const route = useRoute();
const toast = useToast();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const user = useCookie<string>('user');
const username = "#"+user.value.payrollnumber+" "+user.value.fname+" "+user.value.lname

const router = useRouter()
const productsFormInstance = getCurrentInstance();


const fileName = ref(null)

const loadingOverlay = ref(false)
const tabKey = ref(0)
const productExist = ref(true)
const selectedFormField = ref(null)
const revisions = ref([]);
const jobHistory = ref([]);
const multipleProductSelect = ref([]);
const sourceCloneModel = ref(null);
const PRODUCTLINE = ref([])
const UNIT = ref([])
const InventoryUnit = ref([])
const ELECTRICAL = ref([])
const WARRENTY = ref([])
const AccountNumber = ref([])
const CRYOTHERMCATEGORY = ref([])
const CRYOTHERMWALLS = ref([])
const CRYOTHERMSECTIONS = ref([])
const CRYOTHERMWARMTANKSWITCHABLE = ref([])
const DURALASTCATEGORY = ref([])
const DURALASTSUBCATEGORY = ref([])
const selectedJobId = ref(null)

const costCalculation = ref({
  materialCost: null,
  productLabor: null,
  productLabourHours: null,
  subAssemblyLaborCost: null,
  subAssemblyLaborHours: null,
  totalLaborCost: null,
  totalHours: null,
  totalCost: null,
  suggestedPrice: null,
  grossProfitPercent: null,
  grossProfit: null
})

const formData = reactive({
  UniqueID: null,
  PRODUCTLINE: null,
  MODEL: null,
  DESCRIPTION: null,
  SELLINGPRICE: null,
  VariablePricing: true,
  UNIT: null,
  InventoryUnit: null,
  NETWEIGHT: null,
  NETWEIGHTFULL: null,
  SHIPWEIGHT: null,
  LENGTH: null,
  WIDTH: null,
  HEIGHT: null,
  ELECTRICAL: null,
  amps: null,
  WARRENTY: null,
  SPECIFICATIONS: null,
  AccountNumber: null,
  SPECSHEET: null,
  WAXCAPACITY: null,
  TANKDEPTH: null,
  CRYOTHERMCATEGORY: null,
  CRYOTHERMWALLS: null,
  CRYOTHERMSECTIONS: null,
  CRYOTHERMWARMTANKSWITCHABLE: null,
  CryothermCorianNumber: null,
  CryothermPcoatNumber: null,
  CryoThermControlPanelNumber: null,
  CryoThermHeaterNumber: null,
  CryothermLeftCunitNumber: null,
  LeftTankAssembly: null,
  CRYOTHERMGALLONSLEFT: null,
  CryothermLeftTank: null,
  CryothermLeftPump: null,
  CryothermLeftFrame: null,
  CryothermLeftJets: null,
  RightTankAssembly: null,
  CRYOTHERMGALLONSRIGHT: null,
  CryothermRightTank: null,
  CryothermRightPump: null,
  CryothermRightFrame: null,
  CryothermRightJets: null,
  DURALASTCATEGORY: null,
  DURALASTSUBCATEGORY: null,
})

const gridMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "select",
      label: "Select",
      kind: "actions",
    },
    {
      key: "MODEL",
      label: "Model",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "DESCRIPTION",
      label: "Description",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
    {
      key: "grossprofit",
      label: "Gross Profit",
      sortable: true,
      sortDirection: "none",
      filterable: true,
    },
  ],
  page: 1,
  pageSize: 50,
  numberOfProducts: 0,
  products: [],
  selectedProductId: null,
  selectProduct: null,
  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  isLoading: false,
});

const revisionColumns = ref([
  {
    key: "TODAY",
    label: "Date",
  },
  {
    key: "CODE",
    label: "Type",
  },
]);

const jobColumns = ref([
  {
    key: "NUMBER",
    label: "Job#",
  },
  {
    key: "DATECLOSED",
    label: "Closed",
  },
]);

const selectedColumns = ref(gridMeta.value.defaultColumns);

const columns = computed(() =>
  gridMeta.value.defaultColumns.filter((column) =>
    selectedColumns.value.includes(column)
  )
);

const headerFilters = ref({
  productline: {
    label: "Product Line",
    filter: "PRODUCTLINE",
    options: [],
  },
});

const headerCheckboxes = ref({
  isActive: {
    label: 'Show Active Only',
    filterKey: 'CODE',
    isChecked: true
  }
})

const filterValues = ref({
  MODEL: null,
  DESCRIPTION: null,
  grossprofit: null,
  CODE: true
});

const watchCheckbox = (property, filterKey) => {
  watch(
    () => headerCheckboxes.value[property].isChecked,
    (newCheckedValue) => {
      filterValues.value[filterKey] = newCheckedValue ? "1" : "0";
    }
  );
}

watchCheckbox('isActive', 'CODE');

const modalMeta = ref({
  isProductModalOpen: false,
  modalTitle: "New Product",
  modalDescription: "Create new product",
  isPartsModalOpen: false,
  isOperationsModalOpen: false,
  isSerialModalOpen: false,
  isCloneModalOpen: false,
  isPartsLookupModelOpne: false,
  partsLookupModalCategory:null,
  partsLookupModalSubCategory: null,
  partsLookupModalFieldValue: null,
  isJobFormModalOpen: false,
});

const init = async () => {
  fetchGridData();
  for (const key in headerFilters.value) {
    const apiURL = headerFilters.value[key]?.api ?? `/api/products/${key}`;
    await useApiFetch(apiURL, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          headerFilters.value[key].options = [null, ...response._data.body];
        }
      },
    });
  }
};
const fetchGridData = async () => {
  gridMeta.value.isLoading = true;
  await useApiFetch("/api/products/numbers", {
    method: "GET",
    params: {
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.numberOfProducts = response._data.body;
      }
    },
  });
  if (gridMeta.value.numberOfProducts === 0) {
    gridMeta.value.products = [];
    gridMeta.value.numberOfProducts = 0;
    gridMeta.value.isLoading = false;
    return;
  }
  if (
    gridMeta.value.page * gridMeta.value.pageSize >
    gridMeta.value.numberOfProducts
  ) {
    gridMeta.value.page =
      Math.ceil(gridMeta.value.numberOfProducts / gridMeta.value.pageSize) | 1;
  }
  await useApiFetch("/api/products/", {
    method: "GET",
    params: {
      page: gridMeta.value.page,
      pageSize: gridMeta.value.pageSize,
      sortBy: gridMeta.value.sort.column,
      sortOrder: gridMeta.value.sort.direction,
      ...filterValues.value,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        gridMeta.value.products = response._data.body;
      }
      gridMeta.value.isLoading = false;
    },
  });
};
const editInit = async (id) => {
  loadingOverlay.value = true
  gridMeta.value.selectedProductId = id
  await useApiFetch(`/api/products/${id}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        productExist.value = true
        gridMeta.value.selectProduct = response._data.body
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
    onResponseError({ }) {
      productExist.value = false
    }
  })
  tabItems();
  await useApiFetch('/api/products/revisions/'+id, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          revisions.value = response._data.body
        }
      }
    }, 
    onResponseError() {
      revisions.value = []
    }
  })
  await useApiFetch('/api/products/jobhistory/'+id, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          jobHistory.value = response._data.body;
        }
      }
    }, 
    onResponseError() {
      jobHistory.value = []
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/products/productline', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        
        PRODUCTLINE.value = ["" , ...response._data.body];
        console.log(PRODUCTLINE.value)
      }
    }, 
    onResponseError() {
      PRODUCTLINE.value = []
    }
  })
  await useApiFetch('/api/products/unit', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        UNIT.value = ["", ...response._data.body];
      }
    }, 
    onResponseError() {
      UNIT.value = []
    }
  })
  await useApiFetch('/api/products/inventoryUnit', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        InventoryUnit.value =["", ... response._data.body];
      }
    }, 
    onResponseError() {
      InventoryUnit.value = []
    }
  })
  await useApiFetch('/api/products/electrical', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        ELECTRICAL.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      ELECTRICAL.value = []
    }
  })
  await useApiFetch('/api/products/warrenty', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        WARRENTY.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      WARRENTY.value = []
    }
  })
  await useApiFetch('/api/products/accountNumber', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        AccountNumber.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      AccountNumber.value = []
    }
  })
  await useApiFetch('/api/products/cryothermCategory', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        CRYOTHERMCATEGORY.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      CRYOTHERMCATEGORY.value = []
    }
  })
  await useApiFetch('/api/products/cryothermWalls', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        CRYOTHERMWALLS.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      CRYOTHERMWALLS.value = []
    }
  })
  await useApiFetch('/api/products/cryothermSections', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        CRYOTHERMSECTIONS.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      CRYOTHERMSECTIONS.value = []
    }
  })
  await useApiFetch('/api/products/cryothermWarmTankSwitchable', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        CRYOTHERMWARMTANKSWITCHABLE.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      CRYOTHERMWARMTANKSWITCHABLE.value = []
    }
  })
  await useApiFetch('/api/products/duraLastCategory', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        DURALASTCATEGORY.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      DURALASTCATEGORY.value = []
    }
  })
  await useApiFetch('/api/products/duraLastSubCategory', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        DURALASTSUBCATEGORY.value =["", ...response._data.body];
      }
    }, 
    onResponseError() {
      DURALASTSUBCATEGORY.value = []
    }
  })
  loadingOverlay.value = false
}

const onMultipleSelect = (row) => {
  if(multipleProductSelect.value.includes(row.UniqueID) ){
    const index = multipleProductSelect.value.indexOf(row.UniqueID)
    multipleProductSelect.value.splice(index, 1)
  } else {
    multipleProductSelect.value = [...multipleProductSelect.value,row?.UniqueID]
  }
}

const onSelect = async (row) => {
  gridMeta.value.selectProduct = row
  gridMeta.value.selectedProductId = row?.UniqueID;
  costCalculation.value = {
    materialCost: null,
    productLabor: null,
    productLabourHours: null,
    subAssemblyLaborCost: null,
    subAssemblyLaborHours: null,
    totalLaborCost: null,
    totalHours: null,
    totalCost: null,
    suggestedPrice: null,
    grossProfitPercent: null,
    grossProfit: null
  }
  gridMeta.value.products.forEach((pro) => {
    if (pro.UniqueID === row.UniqueID) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });

  await useApiFetch(`/api/products/${row?.UniqueID}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        productExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
    onResponseError({ }) {
      productExist.value = false
    }
  })
  tabItems()
  
  await useApiFetch('/api/products/revisions/'+row?.UniqueID, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          revisions.value = response._data.body
        }
      }
    }, 
    onResponseError() {
      revisions.value = []
    }
  })
  await useApiFetch('/api/products/jobhistory/'+row?.UniqueID, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        if(response._data.body.length > 0) {
          jobHistory.value = response._data.body;
        }
      }
    }, 
    onResponseError() {
      jobHistory.value = []
    }
  })

};

const items = ref([])

const tabItems = () =>{
  items.value = [{
    slot: 'generalSpecs',
    label: 'General Specs',}]

  if(formData.PRODUCTLINE === 'Ready Ref' || 
      formData.PRODUCTLINE === 'Ready Ref Play Clock' || 
      formData.PRODUCTLINE === 'Ready Ref Play Clock Option' ||
      formData.PRODUCTLINE === null){
    items.value = [...items.value, {
      slot: 'readyRef',
      label: 'Ready Ref',
    }]
  }
  if(formData.PRODUCTLINE === 'PARATherm' || 
        formData.PRODUCTLINE === 'PARATherm Option' ||
        formData.PRODUCTLINE === null){
    items.value = [...items.value, {
    slot: 'paraTherm',
    label: 'PARATherm',
  }]
  }
  if(formData.PRODUCTLINE === 'CRYOPress' || 
        formData.PRODUCTLINE === 'CRYOPress Option' ||
        formData.PRODUCTLINE === null){
    items.value = [...items.value, {
    slot: 'cryoPress',
    label: 'CRYOPress',
  }]
  }
  if(formData.PRODUCTLINE === 'CRYOTherm' || 
        formData.PRODUCTLINE === 'CRYOTherm Option' || 
        formData.PRODUCTLINE === 'CRYOTherm ReadyFit' ||
        formData.PRODUCTLINE === null){
    items.value = [...items.value, {
    slot: 'cryoTherm',
    label: 'CRYOTherm',
  }]
  }
  if(formData.PRODUCTLINE === 'DURALast'){
    items.value = [...items.value, {
    slot: 'duraLast',
    label: 'DURALast',
  }]
  }

  tabKey.value = tabKey.value ? 1 : 0

}


Object.entries(route.query).forEach(([key, value]) => {
  switch (key.toLowerCase()) {
    case "page":
      gridMeta.value.page = Number(value);
      break;
    case "pagesize":
      gridMeta.value.pageSize = Number(value);
      break;
    case "sortby":
      gridMeta.value.sort.column = value as unknown as string;
      break;
    case "sortorder":
      gridMeta.value.sort.direction = value as unknown as string;
      break;
  }
});


const handleSortingButton = async (btnName: string) => {
  gridMeta.value.page = 1;
  for (const column of columns.value) {
    if (column.sortable) {
      if (column.key === btnName) {
        switch (column.sortDirection) {
          case "none":
            column.sortDirection = "asc";
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = "asc";
            break;
          case "asc":
            column.sortDirection = "desc";
            gridMeta.value.sort.column = btnName;
            gridMeta.value.sort.direction = "desc";
            break;
          default:
            column.sortDirection = "none";
            gridMeta.value.sort.column = "UniqueID";
            gridMeta.value.sort.direction = "asc";
            break;
        }
      } else {
        column.sortDirection = "none";
      }
    }
  }
  fetchGridData();
};

const handleFilterChange = () => {
  gridMeta.value.page = 1;
  fetchGridData();
};

const handleFilterInputChange = async (event, name) => {
  gridMeta.value.page = 1;
  if (filterValues.value.hasOwnProperty(name)) {
    filterValues.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  fetchGridData();
};

const handleCostCalculation = async () => {
  if(gridMeta.value.selectedProductId){
    if (!Number.isNaN(formData.SELLINGPRICE)) {
      loadingOverlay.value = true
      await useApiFetch('/api/products/costandprofit/'+gridMeta.value.selectedProductId, {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            costCalculation.value = response._data.body;
          }
        }, 
        onResponseError() {
          costCalculation.value = {
            materialCost: null,
            productLabor: null,
            productLabourHours: null,
            subAssemblyLaborCost: null,
            subAssemblyLaborHours: null,
            totalLaborCost: null,
            totalHours: null,
            totalCost: null,
            suggestedPrice: null,
            grossProfitPercent: null,
            grossProfit: null
          }
        }
      })
      loadingOverlay.value = false
    }
  }
  
  
}

const handlePartListModal = () => {
  if(gridMeta.value.selectedProductId){

  }
  modalMeta.value.isPartsModalOpen = true
}
const handleOperationtModal = () => {
  if(gridMeta.value.selectedProductId){
    
  }
  modalMeta.value.isOperationsModalOpen = true
  modalMeta.value.modalTitle = "Manufacturing Sequence";
  modalMeta.value.modalDescription = `Manufacturing Sequence ${
    gridMeta.value.selectProduct.MODEL ? gridMeta.value.selectProduct.MODEL : gridMeta.value.selectProduct.MODEL
  }`;
}
const handleSerialsModal = () => {
  if(gridMeta.value.selectedProductId){
    
  }
  modalMeta.value.isSerialModalOpen = true
  modalMeta.value.modalTitle = "Serial Record Finished Goods";
  modalMeta.value.modalDescription = "Serial Record" 
}

const handleCloneModal = () => {
  if(gridMeta.value.selectedProductId){
    sourceCloneModel.value = null
    modalMeta.value.isCloneModalOpen = true
  }
  
}

const handleCloneModalClick = async () => {
  if(gridMeta.value.selectedProductId){
    if(sourceCloneModel.value){
      loadingOverlay.value = true
      await useApiFetch(`/api/products/productoperations/cloneoperation`, {
        method: 'PUT',
        body: { targetId:sourceCloneModel.value, sourceId:gridMeta.value.selectProduct.MODEL, username },
        onResponse({ response }) {
          if(response.status === 200) {
            sourceCloneModel.value = null
            modalMeta.value.isCloneModalOpen = false
            toast.add({
              title: "Success",
              description: "Instruction cloned successfully",
              icon: "i-heroicons-check-circle",
              color: "green",
            });
          }
        },
      });
      loadingOverlay.value = false
    }else{
      toast.add({
        title: "Validation Error",
        description: "Please provide a model",
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    }
  }
  
}

const closeCloneModal = () => {
  sourceCloneModel.value = null
  modalMeta.value.isCloneModalOpen = false
}

const handleFileUpload = (event) => {
  fileName.value = event.target.files[0].name
  formData.SPECSHEET = null
}

const create = async () =>{
  if(gridMeta.value.selectProduct == null && formData.PRODUCTLINE && formData.MODEL){
    loadingOverlay.value = true
    await useApiFetch('/api/products', {
      method: 'POST',
      body:{
        data:  formData,
        files: files.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          editInit(response._data.body.UniqueID)
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })

    fetchGridData()
    loadingOverlay.value = false
  }
}

const modify = async () =>{
  if(gridMeta.value.selectedProductId){
    loadingOverlay.value = true
    await useApiFetch(`/api/products/${gridMeta.value.selectedProductId}`, {
      method: 'PUT',
      body: {
        data: formData,
        files: files.value
      }, 
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
    loadingOverlay.value = false
  }
}

const revision = async () =>{
  if(gridMeta.value.selectedProductId) {
    loadingOverlay.value = true
    await useApiFetch(`/api/products/revisions/${gridMeta.value.selectedProductId}`, {
      method: 'PUT',
      body: {
        data: formData,
        files: files.value
      }, 
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
    
    await useApiFetch('/api/products/revisions/'+gridMeta.value.selectedProductId, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data.body.length > 0) {
            revisions.value = response._data.body
          }
        }
      }, 
      onResponseError() {
        revisions.value = []
      }
    })
    loadingOverlay.value = false
  }
  
}

const inactive = async () =>{
  if(gridMeta.value.selectedProductId){
    loadingOverlay.value = true
    await useApiFetch('/api/products/inactive/'+ gridMeta.value.selectedProductId, {
      method: 'PUT',
      body: formData, 
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
    await useApiFetch('/api/products/revisions/'+gridMeta.value.selectedProductId, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          if(response._data.body.length > 0) {
            revisions.value = response._data.body
          }
        }
      }, 
      onResponseError() {
        revisions.value = []
      }
    })
    fetchGridData()
    loadingOverlay.value = false
  }
 
}

const clear = async () =>{
  gridMeta.value.selectedProductId = null
  gridMeta.value.selectProduct = null
  for( const key in formData){
    formData[key] = null
  }
  for( const key in costCalculation.value){
    costCalculation.value[key] = null
  }
  revisions.value = []
  jobHistory.value = []
}

const handleBulkInactive = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/products/bulkInactiveProduct/', {
    method: 'PUT',
    body: {data:multipleProductSelect}, 
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
  fetchGridData()
  loadingOverlay.value = false
}

const setProductFormData = (data) => {
  console.log(data)
  formData[selectedFormField.value] = data.MODEL
}

const handlePartsListClose = async () => {
  modalMeta.value.isPartsLookupModelOpne = false;
}

const handlePartsLookup = (category, subCategory, fieldName) => {
  selectedFormField.value = fieldName
  modalMeta.value.isPartsLookupModelOpne = true
  modalMeta.value.modalTitle = "Parts Lookup"
  modalMeta.value.partsLookupModalCategory = category
  modalMeta.value.partsLookupModalSubCategory = subCategory
  modalMeta.value.partsLookupModalFieldValue = formData[fieldName]

}

const onRevisionSelect = async (row) => {
  gridMeta.value.selectProduct = row
  gridMeta.value.selectedProductId = row?.UniqueID;
  costCalculation.value = {
    materialCost: null,
    productLabor: null,
    productLabourHours: null,
    subAssemblyLaborCost: null,
    subAssemblyLaborHours: null,
    totalLaborCost: null,
    totalHours: null,
    totalCost: null,
    suggestedPrice: null,
    grossProfitPercent: null,
    grossProfit: null
  }
  revisions.value.forEach((pro) => {
    if (pro.UniqueID === row.UniqueID) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });
  await useApiFetch(`/api/products/${gridMeta.value.selectedProductId}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false
        productExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
    onResponseError({ }) {
      productExist.value = false
    }
  })
  tabItems()

};

const handleJobSelect = async (row) => {

  selectedJobId.value = row?.UniqueID;

  jobHistory.value.forEach((pro) => {
    if (pro.UniqueID === row.UniqueID) {
      pro.class = "bg-gray-200";
    } else {
      delete pro.class;
    }
  });


};

const handleJobDblClick = async (row) => {

  if (selectedJobId.value) {
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.modalDescription = "Edit Job information";
    modalMeta.value.isJobFormModalOpen = true;
  }

};

const handleModalClose = () => {
  modalMeta.value.isJobFormModalOpen = false;
};

const handleModalSave = async () => {
  handleModalClose();
};

const openJobDetailsForm = (jobId) => {
  selectedJobId.value = jobId
}


if (props.selectedProduct !== null)
  editInit(props.selectedProduct)
else
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <template v-if="!props.isModal && !productExist">
    <CommonNotFound :name="'Product not found'" :message="'The product you are looking for does not exist'"
      :to="'/products/products/list'" />
  </template>


  <template v-else>
    <UForm class="space-y-4">

      <div class="flex flex-col">
        <div class="flex flex-row border-b-[3px] border-black">
          <div class="basis-7/12 border-r-[3px] border-black">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Products
            </div>
            <div class="w-full p-3 flex flex-col space-y-2">
              <div class="flex flex-row justify-between">
                <template
                  v-for="[key, value] in Object.entries(headerFilters)"
                  :key="key"
                >
                  <template v-if="value.options.length > 1">
                    <div class="basis-1/7 max-w-[200px]">
                      <UFormGroup :name="key">
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
                  <template v-for="checkbox in headerCheckboxes">
                    <div>
                      <UCheckbox
                        v-model="filterValues[checkbox.filterKey]"
                        :label="checkbox.label"
                        @update:model-value="handleFilterChange"
                      />
                    </div>
                  </template>
                </div>
              </div>

              <div>

                <UTable
                  :rows="gridMeta.products"
                  :columns="columns"
                  :loading="gridMeta.isLoading"
                  class="w-full"
                  :ui="{
                    wrapper: 'h-[300px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'p-1'
                    },
                  }"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                  }"
                  @select="onSelect"
                >
                  <template  #select-data="{ row }">
                    <UTooltip v-if="row.CODE != 'Inactive'" text="Select" >
                      <UCheckbox
                        @change="onMultipleSelect(row)"
                      />
                    </UTooltip>
                  </template>
                  <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                      <div class="">
                        <CommonSortAndInputFilter
                          @handle-sorting-button="handleSortingButton"
                          @handle-input-change="handleFilterInputChange"
                          :label="column.label"
                          :sortable="column.sortable"
                          :sort-key="column.key"
                          :sort-icon="
                            column?.sortDirection === 'none'
                              ? noneIcon
                              : column?.sortDirection === 'asc'
                              ? ascIcon
                              : descIcon
                          "
                          :filterable="column.filterable"
                          :filter-key="column.key"
                        />
                      </div>
                    </template>
                    <template v-else class="bg-slate-400">
                      <div class="flex w-[53px]">
                        {{ column.label }}
                      </div>
                    </template>
                  </template>
                </UTable>
                <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
                  <div
                    class="flex flex-row justify-end mt-1"
                  >
                    <UPagination
                      :max="7"
                      :page-count="gridMeta.pageSize"
                      :total="gridMeta.numberOfProducts | 0"
                      v-model="gridMeta.page"
                      @update:model-value="handlePageChange()"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="border-t-[3px] border-black px-2 pt-2 mx-0" :key="tabKey">

                <UTabs class="product-tabs" :items="items"  :ui="{
                  list: {
                    background: 'bg-gms-purple-400',
                    tab: {
                      inactive: '!text-white'
                    }
                  },

                }">

                
                
                  <template #generalSpecs="{ item }" >
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/3">
                          <UFormGroup
                            label="Product Line"
                            name="PRODUCTLINE"
                          >
                            <UInputMenu
                              v-model="formData.PRODUCTLINE"
                              v-model:query="formData.PRODUCTLINE"
                              :options="PRODUCTLINE"
                              @change="tabItems"
                            />
                          </UFormGroup>
                          
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup
                            label="Model"
                            name="model"
                          >
                            <UInput
                              v-model="formData.MODEL"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup
                            label="Description"
                            name="DESCRIPTION"
                          >
                            <UInput
                              v-model="formData.DESCRIPTION"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row justify-end">

                        <div class="mt-2">
                          <UCheckbox
                            v-model="formData.VariablePricing"
                            label="Variable Pricing"

                          />
                        </div>
                        
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Unit"
                            name="UNIT"
                          >
                            <UInputMenu
                              v-model="formData.UNIT"
                              v-model:query="formData.UNIT"
                              :options="UNIT"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Inventory Unit"
                            name="InventoryUnit"
                          >
                            <UInputMenu
                              v-model="formData.InventoryUnit"
                              v-model:query="formData.InventoryUnit"
                              :options="InventoryUnit"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Net Weight"
                            name="NETWEIGHT"
                          >
                            <UInput
                              v-model="formData.NETWEIGHT"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Net Weight Full"
                            name="NETWEIGHTFULL"
                          >
                            <UInput
                              v-model="formData.NETWEIGHTFULL"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Ship Weight"
                            name="SHIPWEIGHT"
                          >
                            <UInput
                            v-model="formData.SHIPWEIGHT"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Length"
                            name="LENGTH"
                          >
                            <UInput
                              v-model="formData.LENGTH"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Width"
                            name="WIDTH"
                          >
                            <UInput
                              v-model="formData.WIDTH"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Height"
                            name="HEIGHT"
                          >
                            <UInput
                              v-model="formData.HEIGHT"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Electrical"
                            name="ELECTRICAL"
                          >
                            <UInputMenu
                              v-model="formData.ELECTRICAL"
                              v-model:query="formData.ELECTRICAL"
                              :options="ELECTRICAL"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup
                            label="Amps"
                            name="amps"
                          >
                            <UInput
                              v-model="formData.amps"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/3">
                          <UFormGroup
                            label="Warranty Type"
                            name="WARRENTY"
                          >
                            <UInputMenu
                              v-model="formData.WARRENTY"
                              v-model:query="formData.WARRENTY"
                              :options="WARRENTY"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup
                            label="Other Specification"
                            name="SPECIFICATIONS"
                          >
                            <UInput
                              v-model="formData.SPECIFICATIONS"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup label="No Label" name="noname">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="w-2/3">
                          <UFormGroup label="Spec Sheet" name="specSheet">
                            <div class="relative">
                              <input
                                type="file"
                                id="file-upload"
                                @input="handleFileInput"
                                @change="handleFileUpload"
                                class="hidden"
                              />
                              <label for="file-upload"
                                class="flex items-center justify-between bg-white border border-black p-1 rounded cursor-pointer">
                                <span class="text-gray-500">{{formData.SPECSHEET ? formData.SPECSHEET :  fileName || 'Choose a file...'  }}</span>
                                <button type="button" class="bg-gms-purple text-white px-4 py-1  rounded">
                                  ...
                                </button>
                              </label>
                              
                            </div>
                        
                            
                     
                      
                            
                          </UFormGroup>
                        </div>
                        <a v-if="formData.SPECSHEET != null" class="bg-[#9b4b99] text-white py-2 px-2 mt-6 h-8 rounded" :href="formData.SPECSHEET">Download Pdf</a>
                        
                      </div>
                    </div>
                  </template>


                  <template #readyRef="{ item }" v-if="formData.PRODUCTLINE === 'Ready Ref' || 
                  formData.PRODUCTLINE === 'Ready Ref Play Clock' || 
                  formData.PRODUCTLINE === 'Ready Ref Play Clock Option' ||
                  formData.PRODUCTLINE === null
                  ">
                  </template>


                  <template #paraTherm="{ item }" v-if="formData.PRODUCTLINE === 'PARATherm' || 
                  formData.PRODUCTLINE === 'PARATherm Option' ||
                  formData.PRODUCTLINE === null
                  ">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Wax Capacity"
                            name="WAXCAPACITY"
                          >
                            <UInput
                              v-model="formData.WAXCAPACITY"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Tank Depth"
                            name="TANKDEPTH"
                          >
                            <UInput
                              v-model="formData.TANKDEPTH"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                        </div>
                        <div class="basis-1/4">
                        </div>
                      </div>
                    </div>
                  </template>


                  <template #cryoPress="{ item }" v-if="formData.PRODUCTLINE === 'CRYOPress' || 
                  formData.PRODUCTLINE === 'CRYOPress Option' ||
                  formData.PRODUCTLINE === null
                  ">
                  </template>


                  <template #cryoTherm="{ item }" v-if="formData.PRODUCTLINE === 'CRYOTherm' || 
                  formData.PRODUCTLINE === 'CRYOTherm Option' || 
                  formData.PRODUCTLINE === 'CRYOTherm ReadyFit' ||
                  formData.PRODUCTLINE === null
                  ">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Category"
                            name="CRYOTHERMCATEGORY"
                          >
                            <UInputMenu
                              v-model="formData.CRYOTHERMCATEGORY"
                              v-model:query="formData.CRYOTHERMCATEGORY"
                              :options="CRYOTHERMCATEGORY"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Walls"
                            name="CRYOTHERMWALLS"
                          >
                            <UInputMenu
                              v-model="formData.CRYOTHERMWALLS"
                              v-model:query="formData.CRYOTHERMWALLS"
                              :options="CRYOTHERMWALLS"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Sections"
                            name="CRYOTHERMSECTIONS"
                          >
                            <UInputMenu
                              v-model="formData.CRYOTHERMSECTIONS"
                              v-model:query="formData.CRYOTHERMSECTIONS"
                              :options="CRYOTHERMSECTIONS"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Switchable"
                            name="CRYOTHERMWARMTANKSWITCHABLE"
                          >
                            <UInputMenu
                              v-model="formData.CRYOTHERMWARMTANKSWITCHABLE"
                              v-model:query="formData.CRYOTHERMWARMTANKSWITCHABLE"
                              :options="CRYOTHERMWARMTANKSWITCHABLE"
                            />
                          </UFormGroup>
                        </div>
                      </div>

                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Corian #" name="CryothermCorianNumber">
                            <div class="flex">
                              <UInput
                                v-model="formData.CryothermCorianNumber"
                              />
                              <UButton color="gms-purple" label="..." @click="handlePartsLookup('Corian', 'CRYOTherm Case', 'CryothermCorianNumber')" />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Powder Coat #" name="CryothermPcoatNumber" >
                            <div class="flex">
                              <UInput
                                v-model="formData.CryothermPcoatNumber"
                              />
                              <UButton color="gms-purple" label="..." @click="handlePartsLookup('Powder Coat', null, 'CryothermPcoatNumber')" />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="C-Unit #" name="CryothermLeftCunitNumber">
                            <div class="flex">
                              <UInput
                                v-model="formData.CryothermLeftCunitNumber"
                              />
                              <UButton color="gms-purple" label="..." @click="handlePartsLookup('Consending Unit', 'Assembly', 'CryothermLeftCunitNumber')" />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Control Panel #" name="CryoThermControlPanelNumber">
                            <div class="flex">
                              <UInput 
                                v-model="formData.CryoThermControlPanelNumber"
                              />
                              <UButton color="gms-purple" label="..." @click="handlePartsLookup('Elictrical Assembly', 'Control Panel', 'CryoThermControlPanelNumber')" />
                            </div>
                          </UFormGroup>
                        </div>
                      </div>

                      <div class="flex flex-row space-x-2 pb-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Heater #" name="CryoThermHeaterNumber">
                            <div class="flex">
                              <UInput
                                v-model="formData.CryoThermHeaterNumber"
                              />
                              <UButton color="gms-purple" label="..."  @click="handlePartsLookup('Elictrical', 'Heater', 'CryoThermHeaterNumber')" />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">

                        </div>
                        <div class="basis-1/4">

                        </div>
                        <div class="basis-1/4">
                        </div>
                      </div>

                      <div class="flex flex-row space-x-4">
                        <div class="basis-1/2">
                          <div class="w-full px-3 py-1 gmsPurpleTitlebar">
                            Left Tank
                          </div>
                          <div class="bg-gms-gray-200 p-2 flex flex-col space-y-1">
                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank Assembly #" name="LeftTankAssembly">
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.LeftTankAssembly"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Tank', 'Assembly', 'LeftTankAssembly')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Gal." name="CRYOTHERMGALLONSLEFT">
                                  <UInput
                                    v-model="formData.CRYOTHERMGALLONSLEFT"
                                  />
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank #" name="CryothermLeftTank">
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermLeftTank"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Tank', null, 'CryothermLeftTank')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Pump #" name="CryothermLeftPump">
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermLeftPump"
                                    />
                                    <UButton color="gms-purple" label="..."  @click="handlePartsLookup('Pump', null, 'CryothermLeftPump')" />
                                  </div>
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Frame #" name="CryothermLeftFrame">
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermLeftFrame"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Frame', null, 'CryothermLeftFrame')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Jets" name="CryothermLeftJets">
                                  <UInput
                                    v-model="formData.CryothermLeftJets"
                                  />
                                </UFormGroup>
                              </div>
                            </div>

                          </div>
                        </div>

                        <div class="basis-1/2">
                          <div class="w-full px-3 py-1 gmsPurpleTitlebar">
                            Right Tank
                          </div>
                          <div class="bg-gms-gray-200 p-2 flex flex-col space-y-1">
                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank Assembly #"  name="RightTankAssembly">
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.RightTankAssembly"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Tank', 'Assembly', 'RightTankAssembly')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Gal." name="CRYOTHERMGALLONSRIGHT">
                                  <UInput
                                    v-model="formData.CRYOTHERMGALLONSRIGHT"
                                  />
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank #" name="CryothermRightTank" >
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermRightTank"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Tank', null, 'CryothermRightTank')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Pump #" name="CryothermRightPump" >
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermRightPump"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Pump', null, 'CryothermRightPump')" />
                                  </div>
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Frame #" name="CryothermRightFrame" >
                                  <div class="flex">
                                    <UInput
                                      v-model="formData.CryothermRightFrame"
                                    />
                                    <UButton color="gms-purple" label="..." @click="handlePartsLookup('Frame', null, 'CryothermLeftFrame')" />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Jets" name="CryothermRightJets">
                                  <UInput
                                    v-model="formData.CryothermRightJets"
                                  />
                                </UFormGroup>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  </template>


                  <template #duraLast="{ item }" v-if="formData.PRODUCTLINE === 'DURALast'">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup
                            label="Category"
                            name="DURALASTCATEGORY"
                          >
                            <UInputMenu
                              v-model="formData.DURALASTCATEGORY"
                              v-model:query="formData.DURALASTCATEGORY"
                              :options="DURALASTCATEGORY"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup
                            label="SubCategory"
                            name="DURALASTSUBCATEGORY"
                          >
                            <UInputMenu
                              v-model="formData.DURALASTSUBCATEGORY"
                              v-model:query="formData.DURALASTSUBCATEGORY"
                              :options="DURALASTSUBCATEGORY"
                            />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                        </div>
                        <div class="basis-1/4">
                        </div>
                      </div>
                    </div>
                  </template>
              
                </UTabs>
            
              </div>
            </div>
          </div>

          <div class="basis-3/12 border-r-[3px] border-black">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Cost
            </div>
            <div class="p-3 w-full flex flex-col space-y-2 bg-gray-200">
              <div class="flex flex-row space-x-2 items-end">
                <label>Selling Price</label>
                <div class="flex space-x-1 items-end">
                  <div>$</div>
                  <UInput
                    v-model="formData.SELLINGPRICE"
                  />
                </div>
              </div>
              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Suggested Price</div>
                <div class="basis-1/4">{{ costCalculation.suggestedPrice ? "$"+costCalculation.suggestedPrice : "" }}</div>
              </div>
              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Product Labor</div>
                <div class="basis-1/4">{{costCalculation.productLabor ? "$"+costCalculation.productLabor : "" }}</div>
                <div class="basis-1/4 flex justify-end">{{costCalculation.productLabourHours }} hr</div>
              </div>
              <div class="flex flex-row space-x-2 items-end pb-5 border-b-[2px] border-black">
                <div class="basis-1/2">Subassembly Labor</div>
                <div class="basis-1/4">{{costCalculation.subAssemblyLaborCost ? "$"+costCalculation.subAssemblyLaborCost :""}}</div>
                <div class="basis-1/4 flex justify-end">{{costCalculation.subAssemblyLaborHours}} hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Total Labor</div>
                <div class="basis-1/4">{{costCalculation.totalCost ? "$"+costCalculation.totalCost :""}}</div>
                <div class="basis-1/4 flex justify-end">{{costCalculation.totalHours}} hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Material Cost</div>
                <div class="basis-1/4">{{ costCalculation.materialCost ? "$"+costCalculation.materialCost :"" }}</div>
                <div class="basis-1/4 flex justify-end"></div>
              
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Total Cost</div>
                <div class="basis-1/4">{{costCalculation.totalCost ? "$"+costCalculation.totalCost :"" }}</div>
                <div class="basis-1/4 flex justify-end"></div>
                
              </div>

              <div class="flex flex-row space-x-2 items-end pb-8">
                <div class="basis-1/2">Gross Profit</div>
                <div class="basis-1/4">{{costCalculation.grossProfit ? "$"+ costCalculation.grossProfit :"" }}</div>
                <div class="basis-1/4 flex justify-end">{{costCalculation.grossProfitPercent}}%</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/3">Units Shipped</div>
                <div class="basis-1/3">YTD = </div>
                <div class="basis-1/3 flex justify-end">Total = </div>
              </div>


              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Operations" @click="handleOperationtModal" color="gms-purple" variant="solid" block />
                  </div>
                  <div class="basis-1/2">
                    <UButton label="Clone Operations" @click="handleCloneModal" color="gms-purple" variant="solid" block />
                  </div>

                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Parts List" @click="handlePartListModal" color="gms-purple" variant="solid" block />
                  </div>
                  <div class="basis-1/2">
                    <UButton label="View Serials" @click="handleSerialsModal" color="gms-purple" variant="solid" block />
                  </div>

                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Costs" @click="handleCostCalculation" color="gms-purple" variant="solid" block />
                  </div>
                  <div class="basis-1/2"></div>

                </div>
              </div>
            </div>


            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Revision History
            </div>

            <div class="p-3 w-full">
              <div>
                <UTable 
                :columns="revisionColumns"
                :rows="revisions"
                :ui="{
                  wrapper: 'h-[362px] border-[1px] border-gray-400 dark:border-gray-700',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: {
                    padding: 'p-1',
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  },
                  td: {
                    padding: 'p-1'
                  },
                  checkbox: { padding: 'p-1 w-[10px]' }
                  
                }" 
                @select="onRevisionSelect"
                />
              </div>
            </div>


          </div>
          <div class="basis-2/12">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Job History
            </div>
            <div class="p-3 w-full">
              <div>
                <UTable 
                :columns="jobColumns"
                :rows="jobHistory"
                :ui="{
                  wrapper: 'h-[804px] border-[1px] border-gray-400 dark:border-gray-700',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                  },
                  th: {
                    padding: 'p-1',
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  },
                  td: {
                    padding: 'p-1'
                  },
                  checkbox: { padding: 'p-1 w-[10px]' }
                }" 
                @select="handleJobSelect"
                @dblclick="handleJobDblClick"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="px-3 pt-3 flex flex-row justify-between">
          <div class="basis-7/12 flex flex-row space-x-2">
            <div class="basis-1/6">
              <UButton label="Add" color="green" variant="outline" icon="i-heroicons-plus"  @click="create"  block />
            </div>
            <div class="basis-1/6">
              <UButton label="Modify" variant="outline" icon="i-heroicons-pencil-square"  @click="modify" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Revision" variant="outline" icon="i-heroicons-pencil-square" @click="revision" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Inactive" color="red" variant="outline" icon="i-heroicons-minus-circle" @click="inactive" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Clear" color="red" variant="outline" icon="i-f7-rays" @click="clear" block />
            </div>

          </div>
          <!-- <div>
            <UButton label="WEBSITE UPDATE" color="green" variant="outline" icon="i-heroicons-arrow-path" />
          </div> -->
          <div>
            <UButton label="Bulk Inactive" color="red" variant="outline" icon="i-heroicons-minus-circle" @click="handleBulkInactive" />
          </div>
        </div>
      </div>

    </UForm>

     <!-- Parts List Modal -->
  <UDashboardModal
    v-model="modalMeta.isPartsModalOpen"
    title="Parts Listing"
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1000px] sm:max-w-9xl',
    }"
  >
    <ProductsPartList :selected-product="gridMeta.selectedProductId" :sub-title="gridMeta.selectProduct.MODEL+' '+gridMeta.selectProduct.DESCRIPTION"/>
  </UDashboardModal>

  <!-- Manufacturing Sequnce Modal -->
  <UDashboardModal
    v-model="modalMeta.isOperationsModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      title: 'text-lg text-white',
      description: 'text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
    }"
  >
    <ProductsManufacturingSequenceForm :selected-product="gridMeta.selectedProductId" :instance-id="gridMeta.selectProduct.instanceID" />
  </UDashboardModal>

  <!-- Serials Modal -->
  <UDashboardModal
    v-model="modalMeta.isSerialModalOpen"
    :ui="{
      width: 'w-[1800px] sm:max-w-7xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <MaterialsSerialsSerialList :is-page="true" :productModel="gridMeta.selectProduct.MODEL" />
  </UDashboardModal>

  <!-- Clone Operation Modal -->
  <UDashboardModal
      v-model="modalMeta.isCloneModalOpen"
      :ui="{
        header: {
          base: 'flex flex-row min-h-[0] items-center',
          padding: 'p-0 pt-1',
        },
        body: { base: 'gap-y-1', padding: 'py-0 sm:pt-0' },
        width: 'w-[300px]',
      }"
    >
      <div class="px-6" >
        <div class="">
          <div class="">What model would you like to clone these instructions to?</div>
          
        </div>
        <div class="mt-3">
          <UInput v-model="sourceCloneModel" ></UInput>
        </div>
        
        <div class="flex flex-row-reverse mt-2">
          <div class="min-w-[60px] ">
            <UButton
              label="Cancel"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              truncate
              @click="closeCloneModal"
            />
          </div>
          <div class="min-w-[60px] mr-3">
            <UButton
              label="OK"
              :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
              @click="handleCloneModalClick"
              truncate
            />
          </div>
          
        </div>
      </div>
    </UDashboardModal>

    <!-- Parts Modal -->
    <UDashboardModal
      v-model="modalMeta.isPartsLookupModelOpne"

      :ui="{
        title: 'text-lg',
        header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'w-[1540px] sm:max-w-9xl'
      }"
    >
      <Parts
      :isModal="true" 
      :category="modalMeta.partsLookupModalCategory" 
      :subCategory="modalMeta.partsLookupModalSubCategory" 
      :fieldValue="modalMeta.partsLookupModalFieldValue" 
      :fromProductForm="true" 
      @select="setProductFormData"
      @close="handlePartsListClose"
      />
    </UDashboardModal>

    <!-- Job Detail Modal -->
    <UDashboardModal v-model="modalMeta.isJobFormModalOpen" :title="modalMeta.modalTitle"
      :description="modalMeta.modalDescription" :ui="{
        width: 'w-[1100px] sm:max-w-7xl',
        body: { padding: 'py-0 sm:pt-0' },
      }"
    >
      <JobForm
        @close="handleModalClose"
        @save="handleModalSave"
        :selected-job="selectedJobId"
        @open="openJobDetailsForm"
      />
    </UDashboardModal>

  </template>
</template>

