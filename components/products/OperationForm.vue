<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
const { handleFileInput, files} = useFileStorage();

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedOperation: {
    type: [String, Number, null],
    required: true
  }, 
  isModal: {
    type: [Boolean]
  }
})

const toast = useToast()
const router = useRouter()
const operationFormInstance = getCurrentInstance();

const actionType = ref('')

const loadingOverlay = ref(false)
const operationExist = ref(true)
const WorkCenter = ref([])

const formData = reactive({
  UniqueID: null,
  Operation: null,
  week: null,
  Hours: null,
  WorkCenter: null,

})

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/products/${props.selectedOperation}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        loadingOverlay.value = false
        operationExist.value = true
        console.log(response._data.body)
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    }, 
    onResponseError({}) {
      operationExist.value = false
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}
const propertiesInit = async () => {
  loadingOverlay.value = true
  await useApiFetch('/api/products/workcenter', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        wo.value = response._data.body;
      }
    }, 
    onResponseError() {
      PRODUCTLINE.value = []
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
  if(operationFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
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
    isViewPdfModalOpen: false,

})
const handlePartsLookup = (category, subCategory) => {
  modalMeta.value.isPartsLookupModelOpne = true
  modalMeta.value.modalTitle = "Parts Lookup"
  modalMeta.value.partsLookupModalCategory = category
  modalMeta.value.partsLookupModalSubCategory = subCategory
} 

const handleOpenPdf = () => {
  modalMeta.value.isViewPdfModalOpen = true;
  modalMeta.value.modalTitle = "Specsheet"
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

    </UForm>

  </template>
</template>
