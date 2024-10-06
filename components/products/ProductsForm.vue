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
  if (productsFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (props.selectedProduct === null) { // Create Product

  } else { // Update Product

  }
  emit('save')
}

const modalMeta = ref({
  isProductModalOpen: false,
  modalTitle: "New Product",
})


const items = [{
  slot: 'generalSpecs',
  label: 'General Specs',
}, {
  slot: 'readyRef',
  label: 'Ready Ref',
}, {
  slot: 'paraTherm',
  label: 'PARATherm',
}, {
  slot: 'cryoPress',
  label: 'CRYOPress',
}, {
  slot: 'cryoTherm',
  label: 'CRYOTherm',
}, {
  slot: 'duraLast',
  label: 'DURALast',
}]




if (props.selectedProduct !== null)
  editInit()
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
    <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">

      <div class="flex flex-col">
        <div class="flex flex-row border-b-[3px] border-black">
          <div class="basis-7/12 border-r-[3px] border-black">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Products
            </div>
            <div class="w-full p-3 flex flex-col space-y-2">
              <div class="flex flex-row justify-between">
                <UFormGroup name="Product Line Filter">
                  <UInputMenu v-model="formData.market" v-model:query="formData.market" :options="markets" />
                </UFormGroup>

                <div>
                  <UCheckbox label="Show Active Only" />
                </div>
              </div>

              <div>
                <UTable :rows="people" :ui="{
                  wrapper: 'h-[250px] border-[1px] border-gray-400 dark:border-gray-700',
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
                }" />
              </div>
            </div>

            <div>
              <div class="border-t-[3px] border-black px-2 pt-2 mx-0">
                <UTabs class="product-tabs" :items="items" :ui="{
                  list: {
                    background: 'bg-gms-purple-400',
                    tab: {
                      inactive: '!text-white'
                    }
                  },

                }">

                  <template #generalSpecs="{ item }">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/3">
                          <UFormGroup label="Product Line" name="productline">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup label="Model" name="model">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup label="Description" name="description">
                            <UInput />
                          </UFormGroup>

                        </div>
                      </div>
                      <div class="flex flex-row justify-end">
                        <div>
                          <UCheckbox label="Variable Pricing" />
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/5">
                          <UFormGroup label="Unit" name="unit">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Inventory Unit" name="inventoryunit">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Net Weight" name="netweight">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Net Weight Full" name="netweightfull">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Ship Weight" name="shipweight">
                            <UInput />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/5">
                          <UFormGroup label="Length" name="length">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Width" name="width">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Height" name="height">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Electrical" name="electrical">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/5">
                          <UFormGroup label="Amps" name="amps">
                            <UInput />
                          </UFormGroup>
                        </div>
                      </div>
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/3">
                          <UFormGroup label="Warranty Type" name="warrantytype">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/3">
                          <UFormGroup label="Other Specification" name="otherspecification">
                            <UInput />
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
                              <input type="file" id="file-upload" class="hidden" />
                              <label for="file-upload"
                                class="flex items-center justify-between bg-white border border-black p-1 rounded cursor-pointer">
                                <span class="text-gray-500">Choose a file...</span>
                                <button type="button" class="bg-gms-purple text-white px-4 py-1  rounded">
                                  ...
                                </button>
                              </label>
                            </div>
                          </UFormGroup>
                        </div>
                      </div>
                    </div>
                  </template>


                  <template #readyRef="{ item }">
                    
                  </template>


                  <template #paraTherm="{ item }">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Wax Capacity">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Tank Depth">
                            <UInput />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                        </div>
                        <div class="basis-1/4">
                        </div>
                      </div>
                    </div>
                  </template>


                  <template #cryoPress="{ item }">

                  </template>


                  <template #cryoTherm="{ item }">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Category">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Walls">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Sections">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Switchable">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                      </div>

                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Corian #">
                            <div class="flex">
                              <UInput />
                              <UButton color="gms-purple" label="..." />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Powder Coat #">
                            <div class="flex">
                              <UInput />
                              <UButton color="gms-purple" label="..." />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="C-Unit #">
                            <div class="flex">
                              <UInput />
                              <UButton color="gms-purple" label="..." />
                            </div>
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="Control Panel #">
                            <div class="flex">
                              <UInput />
                              <UButton color="gms-purple" label="..." />
                            </div>
                          </UFormGroup>
                        </div>
                      </div>

                      <div class="flex flex-row space-x-2 pb-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Heater #">
                            <div class="flex">
                              <UInput />
                              <UButton color="gms-purple" label="..." />
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
                                <UFormGroup label="Tank Assembly #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Gal.">
                                  <UInput />
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Pump #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Frame #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Jets">
                                  <UInput />
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
                                <UFormGroup label="Tank Assembly #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Gal.">
                                  <UInput />
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Tank #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Pump #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>
                            </div>

                            <div class="flex flex-row space-x-2">
                              <div class="basis-1/2">
                                <UFormGroup label="Frame #">
                                  <div class="flex">
                                    <UInput />
                                    <UButton color="gms-purple" label="..." />
                                  </div>
                                </UFormGroup>
                              </div>

                              <div class="basis-1/2">
                                <UFormGroup label="Jets">
                                  <UInput />
                                </UFormGroup>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  </template>


                  <template #duraLast="{ item }">
                    <div class="px-3 pb-3 flex flex-col space-y-2 bg-gms-gray-100">
                      <div class="flex flex-row space-x-2">
                        <div class="basis-1/4">
                          <UFormGroup label="Category">
                            <UInputMenu />
                          </UFormGroup>
                        </div>
                        <div class="basis-1/4">
                          <UFormGroup label="SubCategory">
                            <UInputMenu />
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
                  <UInput class="flex-1 sm-field" />
                </div>
              </div>
              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Suggested Price</div>
                <div class="basis-1/4">0.00</div>
              </div>
              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Product Labor</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">0.00 hr</div>
              </div>
              <div class="flex flex-row space-x-2 items-end pb-5 border-b-[2px] border-black">
                <div class="basis-1/2">Subassembly Labor</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">0.00 hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Total Labor</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">0.00 hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Material Cost</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">0.00 hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/2">Total Cost</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">0.00 hr</div>
              </div>

              <div class="flex flex-row space-x-2 items-end pb-8">
                <div class="basis-1/2">Gross Profit</div>
                <div class="basis-1/4">$0.00</div>
                <div class="basis-1/4 flex justify-end">100.00%</div>
              </div>

              <div class="flex flex-row space-x-2 items-end">
                <div class="basis-1/3">Units Shipped</div>
                <div class="basis-1/3">YTD = </div>
                <div class="basis-1/3 flex justify-end">Total = </div>
              </div>


              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Operations" color="gms-purple" variant="solid" block />
                  </div>
                  <div class="basis-1/2">
                    <UButton label="Clone Operations" color="gms-purple" variant="solid" block />
                  </div>

                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Parts List" color="gms-purple" variant="solid" block />
                  </div>
                  <div class="basis-1/2">
                    <UButton label="View Serials" color="gms-purple" variant="solid" block />
                  </div>

                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UButton label="View Costs" color="gms-purple" variant="solid" block />
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
                <UTable :rows="people" :ui="{
                  wrapper: 'h-[342px] border-[1px] border-gray-400 dark:border-gray-700',
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
                }" />
              </div>
            </div>


          </div>
          <div class="basis-2/12">
            <div class="w-full px-3 py-1 gmsPurpleTitlebar">
              Job History
            </div>
            <div class="p-3 w-full">
              <div>
                <UTable :rows="people" :ui="{
                  wrapper: 'h-[779px] border-[1px] border-gray-400 dark:border-gray-700',
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
                }" />
              </div>
            </div>
          </div>
        </div>

        <div class="px-3 pt-3 flex flex-row justify-between">
          <div class="basis-7/12 flex flex-row space-x-2">
            <div class="basis-1/6">
              <UButton label="Add" color="green" variant="outline" icon="i-heroicons-plus" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Modify" variant="outline" icon="i-heroicons-pencil-square" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Revision" variant="outline" icon="i-heroicons-pencil-square" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Inactive" color="red" variant="outline" icon="i-heroicons-minus-circle" block />
            </div>
            <div class="basis-1/6">
              <UButton label="Clear" color="red" variant="outline" icon="i-f7-rays" block />
            </div>

          </div>
          <div>
            <UButton label="WEBSITE UPDATE" color="green" variant="outline" icon="i-heroicons-arrow-path" />
          </div>
          <div>
            <UButton label="Bulk Inactive" color="red" variant="outline" icon="i-heroicons-minus-circle" />
          </div>
        </div>
      </div>








    </UForm>


  </template>
</template>


<!-- <div class="flex flex-row space-x-3">


      <div class="my-2">
        <div class="font-bold">
          Ready Ref
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/2">
          <UFormGroup label="Wax Capacity" name="waxcapacity">
            <UInput />
          </UFormGroup>
        </div>
        <div class="basis-1/2">
          <UFormGroup label="Tank Depth" name="tankdepth">
            <UInput />
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
          <UFormGroup label="Category" name="thermcategory">
            <UInputMenu />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup label="Walls" name="walls">
            <UInputMenu />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup label="Sections" name="section">
            <UInputMenu />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup label="Switchable" name="productline">
            <UInputMenu />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup label="Corian#" name="corian">
            <UInput />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="Powder Coat#" name="powdercoat">
            <UInput />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="C-Unit#" name="cunit">
            <UInput />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="Control Panel#" name="controlpanel">
            <UInput />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup label="Heater#" name="heater">
            <UInput />
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

          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup label="Tank Assembly#" name="lefttankassembly">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Gal." name="leftgal">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup label="Tank#" name="lefttank">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Pump#" name="leftpump">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-row space-x-3">
              <div class="basis-1/2">
                <UFormGroup label="Frame#" name="leftframe">
                  <UInput />
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Jets" name="leftjets">
                  <UInput />
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="basis-1/2">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row space-x-3">
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UFormGroup label="Tank Assembly#" name="righttankassembly">
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup label="Gal." name="rightgal">
                      <UInput v-model="formData.company2" />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UFormGroup label="Tank#" name="righttank">
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup label="Pump#" name="rightpump">
                      <UInput />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <UFormGroup label="Frame#" name="rightframe">
                      <UInput />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup label="Jets" name="rightjets">
                      <UInput />
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
          <UFormGroup label="Category" name="category">
            <UInputMenu />
          </UFormGroup>
        </div>
        <div class="basis-1/4">
          <UFormGroup label="SubCategory" name="subcategory">
            <UInputMenu />
          </UFormGroup>
        </div>
      </div>

      <div class="flex justify-start gap-3">
        <UButton color="cyan" variant="outline" type="submit"
          :icon="selectedProduct !== null ? 'i-heroicons-pencil-square' : 'i-heroicons-plus'"
          :label="selectedProduct !== null ? 'Modify Product' : 'Add Product'" />
        <UButton color="red" variant="outline" :label="!isModal ? 'Go back' : 'Cancel'" @click="handleClose" />
      </div> -->