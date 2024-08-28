<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';

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

const loadingOverlay = ref(false)
const productExist = ref(true)
const markets = ref([])

const formData = reactive({
  UniqueID: null,
  
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
  if(productsFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if(props.selectedProduct === null) { // Create Product
    
  } else { // Update Product
    
  }
  emit('save')
}

const modalMeta = ref({
    isProductModalOpen: false,
    modalTitle: "New Product",
})

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
            name="productline"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
          <UFormGroup
            label="Model"
            name="model"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
          <UFormGroup
            label="Description"
            name="description"
          >
            <UInput
              
            />
          </UFormGroup>
          <div class="mt-2">
            <UCheckbox
              label="Variable Pricing"
            />
          </div>
        </div>
        
      </div>
  
      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Unit"
            name="unit"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Inventory Unit"
            name="inventoryunit"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Net Weight"
            name="netweight"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Net Weight Full"
            name="netweightfull"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Ship Weight"
            name="shipweight"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>

      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Length"
            name="length"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Width"
            name="width"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Height"
            name="height"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Electrical"
            name="electrical"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Amps"
            name="amps"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>

      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/3">
          <UFormGroup
            label="Warranty Type"
            name="warrantytype"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
          <UFormGroup
            label="Other Specification"
            name="otherspecification"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
          <UFormGroup
            label="No Label"
            name="noname"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>

      </div>
      <div class="flex flex-row space-x-3">
     
        <div class="w-1/3">
            <UFormGroup
            label="Spec Sheet"
            name="specSheet"
            >
            <div class="relative">
                <input
                type="file"
                id="file-upload"
                class="hidden"
                
                />
                <label
                for="file-upload"
                class="flex items-center justify-between bg-gray-100 border p-1 rounded cursor-pointer"
                >
                <span class="text-gray-500">Choose a file...</span>
                <button
                    type="button"
                    class="bg-[#9b4b99] text-white px-4  rounded"
                >
                    ...
                </button>
                </label>
            </div>
            </UFormGroup>
        </div>
       
      </div>

      <div class="my-2">
        <div class="font-bold">
          Ready Ref
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/2">
          <UFormGroup
            label="Wax Capacity"
            name="waxcapacity"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/2">
          <UFormGroup
            label="Tank Depth"
            name="tankdepth"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
      </div>

      <div class="my-2">
        <div class="font-bold">
          PARATherm
        </div>
      </div>

      <div class="my-2">
        <div class="font-bold">
          CRYOPress
        </div>
      </div>

      

      <div class="my-2">
        <div class="font-bold">
         CRYOTherm
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/4">
          <UFormGroup
            label="Category"
            name="thermcategory"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup
            label="Walls"
            name="walls"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup
            label="Sections"
            name="section"
          >
            <UInputMenu
             
            />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup
            label="Switchable"
            name="productline"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Corian#"
            name="corian"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Powder Coat#"
            name="powdercoat"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="C-Unit#"
            name="cunit"
          >
            <UInput
             
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Control Panel#"
            name="controlpanel"
          >
            <UInput
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Heater#"
            name="heater"
          >
            <UInput
              
            />
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
                  name="lefttankassembly"
                >
                  <UInput
                    
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Gal."
                  name="leftgal"
                >
                  <UInput
                    
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Tank#"
                  name="lefttank"
                >
                  <UInput
                    
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Pump#"
                  name="leftpump"
                >
                  <UInput
                    
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup
                  label="Frame#"
                  name="leftframe"
                >
                  <UInput
                    
                  />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup
                  label="Jets"
                  name="leftjets"
                >
                  <UInput
                    
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
                      name="righttankassembly"
                    >
                      <UInput
                        
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup
                      label="Gal."
                      name="rightgal"
                    >
                      <UInput
                        v-model="formData.company2"
                      />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UFormGroup
                      label="Tank#"
                      name="righttank"
                    >
                      <UInput
                        
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup
                      label="Pump#"
                      name="rightpump"
                    >
                      <UInput
                       
                      />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UFormGroup
                      label="Frame#"
                      name="rightframe"
                    >
                      <UInput
                        
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup
                      label="Jets"
                      name="rightjets"
                    >
                      <UInput
                       
                      />
                    </UFormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  

      <div class="my-2">
        <div class="font-bold">
          DURALast
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/4">
          <UFormGroup
            label="Category"
            name="category"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup
            label="SubCategory"
            name="subcategory"
          >
            <UInputMenu
              
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex justify-start gap-3">
        <UButton 
          color="cyan" 
          variant="outline"
          type="submit"
          :icon="selectedProduct !== null ? 'i-heroicons-pencil-square': 'i-heroicons-plus'"
          :label="selectedProduct !== null ? 'Modify Product' : 'Add Product'"
        />
        <UButton color="red" variant="outline"
          :label="!isModal ? 'Go back': 'Cancel'"
          @click="handleClose"
        />
      </div>

    </UForm>
    

  </template>
</template>
