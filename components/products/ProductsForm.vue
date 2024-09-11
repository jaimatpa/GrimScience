<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
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

const toast = useToast()
const router = useRouter()
const productsFormInstance = getCurrentInstance();

const actionType = ref('')
const fileName = ref(null)

const loadingOverlay = ref(false)
const productExist = ref(true)
const selectedFormField = ref(null)
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

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/products/${props.selectedProduct}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        productExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    }, 
    onResponseError({}) {
      productExist.value = false
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
        PRODUCTLINE.value = response._data.body;
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
        UNIT.value = response._data.body;
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
        InventoryUnit.value = response._data.body;
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
        ELECTRICAL.value = response._data.body;
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
        WARRENTY.value = response._data.body;
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
        AccountNumber.value = response._data.body;
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
        CRYOTHERMCATEGORY.value = response._data.body;
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
        CRYOTHERMWALLS.value = response._data.body;
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
        CRYOTHERMSECTIONS.value = response._data.body;
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
        CRYOTHERMWARMTANKSWITCHABLE.value = response._data.body;
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
        DURALASTCATEGORY.value = response._data.body;
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
        DURALASTSUBCATEGORY.value = response._data.body;
      }
    }, 
    onResponseError() {
      DURALASTSUBCATEGORY.value = []
    }
  })
  loadingOverlay.value = false
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.PRODUCTLINE) errors.push({ path: 'PRODUCTLINE', message: 'Please enter product line.' })
  if (!state.MODEL) errors.push({ path: 'MODEL', message: 'Please enter a model.' })
  if (!state.DESCRIPTION) errors.push({ path: 'DESCRIPTION', message: 'Please entter a description.' })
  return errors
}
const handleClose = async () => {
  if(productsFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const handlePartsListClose = async () => {
  modalMeta.value.isPartsLookupModelOpne = false;
}
const handleFileUpload = (event) => {
  fileName.value = event.target.files[0].name
}

const onSubmit = async (event: FormSubmitEvent<any>) => {

  if(props.selectedProduct === null) { // Create Product
    await useApiFetch('/api/products', {
      method: 'POST',
      body:{
        data:  event.data,
        files: files.value
      }, 
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
  } else { // Update Product
    if(actionType.value === "revision") {
      await useApiFetch(`/api/products/revisions/${props.selectedProduct}`, {
        method: 'PUT',
        body: {
          data: event.data,
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
    } else if(actionType.value === "inactive") {
      await useApiFetch('/api/products/inactive/'+ props.selectedProduct, {
        method: 'PUT',
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
    } else if(actionType.value === "createOrModify") {
      await useApiFetch(`/api/products/${props.selectedProduct}`, {
        method: 'PUT',
        body: {
          data: event.data,
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
    }
    
  }
  emit('save')
}

const modalMeta = ref({
    isProductModalOpen: false,
    modalTitle: "New Product",
    isPartsLookupModelOpne: false,
    partsLookupModalCategory:null,
    partsLookupModalSubCategory: null,
    partsLookupModalFieldValue: null,
    isViewPdfModalOpen: false,

})
const handlePartsLookup = (category, subCategory, fieldName) => {
  selectedFormField.value = fieldName
  modalMeta.value.isPartsLookupModelOpne = true
  modalMeta.value.modalTitle = "Parts Lookup"
  modalMeta.value.partsLookupModalCategory = category
  modalMeta.value.partsLookupModalSubCategory = subCategory
  modalMeta.value.partsLookupModalFieldValue = formData[fieldName]

} 

const setProductFormData = (data) => {
  formData[selectedFormField.value] = data
}

if(props.selectedProduct !== null) 
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
  <template v-if="!props.isModal && !productExist">
    <CommonNotFound
      :name="'Product not found'"
      :message="'The product you are looking for does not exist'"
      :to="'/products/products/list'"
    />
  </template>
  <template v-else>
    <div class="my-2">
        <div class="font-bold">
          General Specs
        </div>
    </div>
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="flex flex-row space-x-3">
        <div class="basis-1/3">
          <UFormGroup
            label="Product Line"
            name="PRODUCTLINE"
          >
            <UInputMenu
              v-model="formData.PRODUCTLINE"
              v-model:query="formData.PRODUCTLINE"
              :options="PRODUCTLINE"
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

        <div class="basis-1/3">
          <UFormGroup
            label="Selling Price"
            name="SELLINGPRICE"
          >
            <UInput
              v-model="formData.SELLINGPRICE"
            />
          </UFormGroup>
          <div class="mt-2">
            <UCheckbox
              v-model="formData.VariablePricing"
              label="Variable Pricing"

            />
          </div>
        </div>
        
      </div>
  
      <div class="flex flex-row space-x-3">
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

      <div class="flex flex-row space-x-3">
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

      <div class="flex flex-row space-x-3">
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
          <UFormGroup
            label="Account"
            name="AccountNumber"
          >
            <UInputMenu
              v-model="formData.AccountNumber"
              v-model:query="formData.AccountNumber"
              :options="AccountNumber"
            />
          </UFormGroup>
        </div>

      </div>
      <div class="flex flex-row space-x-3">
        <div class="w-1/3">
          <UFormGroup label="Spec Sheet" name="SPECSHEET">
            <div class="relative flex flex-row">
              <input
                type="file"
                id="file-upload"
                @input="handleFileInput"
                @change="handleFileUpload"
                class="hidden"
              />
              <label
                for="file-upload"
                class="flex items-center justify-between bg-gray-100 border p-1 rounded cursor-pointer"
              >
                <span class="text-gray-500">{{ fileName || 'Choose a file...' }}</span>
                <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded"
                >
                  ...
                </button> 
                
              </label>
                <a v-if="formData.SPECSHEET != null" class="bg-[#9b4b99] text-white py-1 px-2 ml-2 rounded" :href="formData.SPECSHEET">Download Pdf</a> 
            </div>
          </UFormGroup>
        </div>
      </div>

      <div v-if="formData.PRODUCTLINE === 'Ready Ref' || 
      formData.PRODUCTLINE === 'Ready Ref Play Clock' || 
      formData.PRODUCTLINE === 'Ready Ref Play Clock Option' ||
      formData.PRODUCTLINE === null
      ">
          <div class="my-2">
            <div class="font-bold">
              Ready Ref
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Wax Capacity"
                name="WAXCAPACITY"
              >
                <UInput
                  v-model="formData.WAXCAPACITY"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Tank Depth"
                name="TANKDEPTH"
              >
                <UInput
                  v-model="formData.TANKDEPTH"
                />
              </UFormGroup>
            </div>
          </div>
      </div>
      <div v-if="formData.PRODUCTLINE === 'PARATherm' || 
      formData.PRODUCTLINE === 'PARATherm Option' ||
      formData.PRODUCTLINE === null
      ">
        <div class="my-2">
          <div class="font-bold">
            PARATherm
          </div>
        </div>
      </div>
     
      <div v-if="formData.PRODUCTLINE === 'CRYOPress' || 
      formData.PRODUCTLINE === 'CRYOPress Option' ||
      formData.PRODUCTLINE === null
      ">
        <div class="my-2">
          <div class="font-bold">
            CRYOPress
          </div>
        </div>
      </div>
      

      <div v-if="formData.PRODUCTLINE === 'CRYOTherm' || 
      formData.PRODUCTLINE === 'CRYOTherm Option' || 
      formData.PRODUCTLINE === 'CRYOTherm ReadyFit' ||
      formData.PRODUCTLINE === null
      ">
        <div class="my-2">
          <div class="font-bold">
          CRYOTherm
          </div>
        </div>

        <div class="flex flex-row space-x-3">
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

        <div class="flex flex-row space-x-3">
          <div class="basis-1/5">
            <UFormGroup
              label="Corian#"
              name="CryothermCorianNumber"
            >
            <div class="flex flex-row">
              <UInput
                v-model="formData.CryothermCorianNumber"
              />
              <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                  @click="handlePartsLookup('Corian', 'CRYOTherm Case', 'CryothermCorianNumber')"
                >
                  ...
              </button>
            </div>
              
            </UFormGroup>
          </div>
          <div class="basis-1/5">
            <UFormGroup
              label="Powder Coat#"
              name="CryothermPcoatNumber"
            >
            <div class="flex flex-row">
              <UInput
                v-model="formData.CryothermPcoatNumber"
              />
              <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                  @click="handlePartsLookup('Powder Coat', null, 'CryothermPcoatNumber')"
                >
                  ...
              </button>
            </div>
            </UFormGroup>
          </div>
          <div class="basis-1/5">
            <UFormGroup
              label="C-Unit#"
              name="CryothermLeftCunitNumber"
            >
            <div class="flex flex-row">
               <UInput
                v-model="formData.CryothermLeftCunitNumber"
              />
              <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                  @click="handlePartsLookup('Consending Unit', 'Assembly', 'CryothermLeftCunitNumber')"
                >
                  ...
              </button>
            </div>
             
            </UFormGroup>
          </div>
          <div class="basis-1/5">
            <UFormGroup
              label="Control Panel#"
              name="CryoThermControlPanelNumber"
            >
            <div class="flex flex-row">
               <UInput
                v-model="formData.CryoThermControlPanelNumber"
              />
              <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                  @click="handlePartsLookup('Elictrical Assembly', 'Control Panel', 'CryoThermControlPanelNumber')"
                >
                  ...
              </button>
            </div>
             
            </UFormGroup>
          </div>
          <div class="basis-1/5">
            <UFormGroup
              label="Heater#"
              name="CryoThermHeaterNumber"
            >
            <div class="flex flex-row">
              <UInput
                v-model="formData.CryoThermHeaterNumber"
              />
              <button
                  type="button"
                  class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                  @click="handlePartsLookup('Elictrical', 'Heater', 'CryoThermHeaterNumber')"
                >
                  ...
              </button>
            </div>
              
            </UFormGroup>
          </div>
        </div>

        <div class="flex flex-row">
          <div class="basis-1/2 text-center">
            Left Tank
          </div>
          <div class="basis-1/2 text-center">
            Right Tank
          </div>
        </div>

        <div class="flex flex-row space-x-5">
          <div class="basis-1/2">
            <!-- Left Tank -->
            <div class="flex flex-col space-y-2">
              <div class="flex flex-row space-x-3">
                <div class="basis-1/2">
                  <UFormGroup
                    label="Tank Assembly#"
                    name="LeftTankAssembly"
                  >
                  <div class="flex flex-row">
                    <UInput
                      v-model="formData.LeftTankAssembly"
                    />
                    <button
                        type="button"
                        class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                        @click="handlePartsLookup('Tank', 'Assembly', 'LeftTankAssembly')"
                      >
                        ...
                    </button>
                  </div>
                   
                  </UFormGroup>
                </div>
                <div class="basis-1/2">
                  <UFormGroup
                    label="Gal."
                    name="CRYOTHERMGALLONSLEFT"
                  >
                    <UInput
                      v-model="formData.CRYOTHERMGALLONSLEFT"
                    />
                  </UFormGroup>
                </div>
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-1/2">
                  <UFormGroup
                    label="Tank#"
                    name="CryothermLeftTank"
                  >
                  <div class="flex flex-row">
                    <UInput
                      v-model="formData.CryothermLeftTank"
                    />
                    <button
                        type="button"
                        class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                        @click="handlePartsLookup('Tank', null, 'CryothermLeftTank')"
                      >
                        ...
                    </button>
                  </div>
                    
                  </UFormGroup>
                </div>
                <div class="basis-1/2">
                  <UFormGroup
                    label="Pump#"
                    name="CryothermLeftPump"
                  >
                  <div class="flex flex-row">
                    <UInput
                      v-model="formData.CryothermLeftPump"
                    />
                    <button
                        type="button"
                        class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                        @click="handlePartsLookup('Pump', null, 'CryothermLeftPump')"
                      >
                        ...
                    </button>
                  </div>
                    
                  </UFormGroup>
                </div>
              </div>
              <div class="flex flex-row space-x-3">
                <div class="basis-1/2">
                  <UFormGroup
                    label="Frame#"
                    name="CryothermLeftFrame"
                  >
                  <div class="flex flex-row">
                    <UInput
                      v-model="formData.CryothermLeftFrame"
                    />
                    <button
                        type="button"
                        class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                        @click="handlePartsLookup('Frame', null, 'CryothermLeftFrame')"
                      >
                        ...
                    </button>
                  </div>
                    
                  </UFormGroup>
                </div>
                <div class="basis-1/2">
                  <UFormGroup
                    label="Jets"
                    name="CryothermLeftJets"
                  >
                    <UInput
                      v-model="formData.CryothermLeftJets"
                    />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </div>
          <div class="basis-1/2"> 
            <!-- Right Tank -->
            <div class="flex flex-col space-y-2">
              <div class="flex flex-row space-x-3">
                <div class="flex flex-col space-y-2">
                  <div class="flex flex-row space-x-3">
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Tank Assembly#"
                        name="RightTankAssembly"
                      >
                      <div class="flex flex-row">
                        <UInput
                          v-model="formData.RightTankAssembly"
                        />
                        <button
                            type="button"
                            class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                            @click="handlePartsLookup('Tank', 'Assembly', 'RightTankAssembly')"
                          >
                            ...
                        </button>
                      </div>
                        
                      </UFormGroup>
                    </div>
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Gal."
                        name="CRYOTHERMGALLONSRIGHT"
                      >
                        <UInput
                          v-model="formData.CRYOTHERMGALLONSRIGHT"
                        />
                      </UFormGroup>
                    </div>
                  </div>
                  <div class="flex flex-row space-x-3">
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Tank#"
                        name="CryothermRightTank"
                      >
                      <div class="flex flex-row">
                        <UInput
                          v-model="formData.CryothermRightTank"
                        />
                        <button
                            type="button"
                            class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                            @click="handlePartsLookup('Tank', null, 'CryothermRightTank')"
                          >
                            ...
                        </button>
                      </div>
                      </UFormGroup>
                    </div>
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Pump#"
                        name="CryothermRightPump"
                      >
                      <div class="flex flex-row">
                        <UInput
                          v-model="formData.CryothermRightPump"
                        />
                        <button
                            type="button"
                            class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                            @click="handlePartsLookup('Pump', null, 'CryothermRightPump')"
                          >
                            ...
                          </button>
                      </div>
                        
                      </UFormGroup>
                    </div>
                  </div>
                  <div class="flex flex-row space-x-3">
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Frame#"
                        name="CryothermRightFrame"
                      >
                      <div class="flex flex-row">
                        <UInput
                          v-model="formData.CryothermRightFrame"
                        />
                        <button
                            type="button"
                            class="bg-[#9b4b99] text-white px-4 rounded -ml-1"
                            @click="handlePartsLookup('Frame', null, 'CryothermLeftFrame')"
                          >
                            ...
                        </button>
                      </div>
                        
                      </UFormGroup>
                    </div>
                    <div class="basis-1/2">
                      <UFormGroup
                        label="Jets"
                        name="CryothermRightJets"
                      >
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
        </div>
      </div>

      
      <div v-if="formData.PRODUCTLINE === 'DURALast'">
        <div class="my-2">
          <div class="font-bold">
            DURALast
          </div>
        </div>

        <div class="flex flex-row space-x-3">
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
        </div>
      </div>

      

      <div class="flex justify-start gap-3">
        <UButton 
          color="green" 
          variant="outline"
          type="submit"
          :icon="selectedProduct !== null ? 'i-heroicons-pencil-square': 'i-heroicons-plus'"
          :label="selectedProduct !== null ? 'Modify Product' : 'Add Product'"
          name="action"
          value="modify"
          @click="actionType = 'createOrModify'"
        />
        <div class="flex justify-start gap-3" v-if="selectedProduct !== null"> 
          <UButton 
            color="cyan" 
            variant="outline"
            type="submit"
            :icon="selectedProduct !== null ? 'i-heroicons-pencil-square': 'i-heroicons-plus'"
            label="Revision"
            @click="actionType = 'revision'"
          />
          <UButton 
            
            color="red" 
            variant="outline"
            type="submit"
            :icon="selectedProduct !== null ? 'i-heroicons-minus-circle-20-solid': 'i-heroicons-plus'"
            label="Inactive"
            @click="actionType = 'inactive'"
          />
       </div>
        
        <UButton color="red" variant="outline"
          :label="!isModal ? 'Go back': 'Cancel'"
          @click="handleClose"
        />
      </div>

    </UForm>

    <!-- Parts List Modal -->
    <UDashboardModal
      v-model="modalMeta.isPartsLookupModelOpne"
      :title="modalMeta.modalTitle"
      :ui="{
        title: 'text-lg',
        header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'w-[1800px] sm:max-w-9xl'
      }"
    >
      <MaterialsPartsPartList 
      :is-page="false" 
      :category="modalMeta.partsLookupModalCategory" 
      :subCategory="modalMeta.partsLookupModalSubCategory" 
      :fieldValue="modalMeta.partsLookupModalFieldValue" 
      :fromProductForm="true" 
      @productFormData="setProductFormData"
      @close="handlePartsListClose"
      />
    </UDashboardModal>

  </template>
</template>
