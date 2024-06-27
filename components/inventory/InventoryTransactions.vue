<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';   
  import type { UTableColumn } from '~/types';
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedOrder: {
      type: [Number, String, null]
    }
  })
  
  const toast = useToast()
  
  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"
  const loadingOverlay = ref(false)
  const formData = reactive({
    transactionID: null,
    By: null,
    Dated: null,
    Justification: null,
  })
  const inventoryFilterValues = ref({
    Dated: null,
    By: null, 
    uniqueid: null,
    JobID: null, 
    COMPLAINTNUMBER: null, 
    ServiceReportID: null,
    InvoiceID: null, 
    PONumber: null,
    VendorInvoiceID: null,
  })
  const productFilterValues = ref({
    PARTTYPE: null,
    SUBCATEGORY: null,
    MODEL: null, 
    DESCRIPTION: null, 
  })
  const inventoryDetailFilterValues = ref({
    MODEL: null, 
  })
  const inventoryGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'Dated',
        label: 'Date',
      }, {
        key: 'By',
        label: 'By',
        filterable: true
      }, {
        key: 'uniqueid',
        label: '#',
        filterable: true
      }, {
        key: 'type',
        label: 'Type',
      },{
        key: 'JobID',
        label: 'Job#',
        filterable: true
      }, {
        key: 'COMPLAINTNUMBER',
        label: 'Complaint#',
        filterable: true
      }, {
        key: 'ServiceReportID',
        label: 'Service Report#',
        filterable: true
      }, {
        key: 'InvoiceID',
        label: 'Invoice#',
        filterable: true
      }, {
        key: 'PONumber',
        label: 'PO#',
        filterable: true
      }, {
        key: 'VendorInvoiceID',
        label: 'Vendor Invoice#',
        filterable: true
      }
    ],    
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    inventories: [],
    selectedInventory: null,
    isLoading: false
  })
  const productGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'PARTTYPE',
        label: 'Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'SUBCATEGORY',
        label: 'Sub Category',
        filterable: true,
        filterOptions: []
      }, {
        key: 'MODEL',
        label: 'Stock#',
        filterable: true,
      }, {
        key: 'DESCRIPTION',
        label: 'Description',
        filterable: true
      }, {
        key: 'OnHand',
        label: 'Current On Hand',
      }
    ],    
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    products: [],
    selectedProductID: null,
    isLoading: false
  })
  const inventoryDetailGridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'MODEL',
        label: 'Stock#',
        filterable: true
      }, {
        key: 'DESCRIPTION',
        label: 'Desc.',
      }, {
        key: 'UNIT',
        label: 'Inv.Unit',
      }, {
        key: 'QtyChange',
        label: 'Adjustment',
      }, {
        key: 'OnHand',
        label: 'Hand Count',
      }
    ],    
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    details: [],
    selectedInventoryTrasaction: null,
    isLoading: false
  })

  const editInit = async () => {
    loadingOverlay.value = true
    await inventoryFetchGridData()
    await productFetchGridData()
    await inventoryDetailFetchGridData()
    loadingOverlay.value = false
  }
  const propertiesInit = async () => {
    // loadingOverlay.value = true

    // loadingOverlay.value = false
  }
  const inventoryFetchGridData = async () => {
    await useApiFetch(`/api/inventorytransactions`, {
      method: 'GET',
      params: {...inventoryFilterValues.value},
      onResponse({ response }) {
        if(response.status === 200) {
          inventoryGridMeta.value.inventories = response._data.body;
        }
      }
    })
  }
  const productFetchGridData = async () => {
    await useApiFetch(`/api/product/parts`, {
      method: 'GET',
      params: {...productFilterValues.value},
      onResponse({ response }) {
        if(response.status === 200) {
          productGridMeta.value.products = response._data.body;
        }
      }
    })
    await useApiFetch(`/api/product/categories`, {
      method: 'GET',
      params: { partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          productGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'PARTTYPE') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
    await useApiFetch(`/api/product/subcategories`, {
      method: 'GET',
      params: { category: productFilterValues.value.PARTTYPE, partflag: 1 },
      onResponse({ response }) {
        if(response.status === 200) {
          productGridMeta.value.defaultColumns.forEach((column: any) => {
            if(column.key === 'SUBCATEGORY') column.filterOptions = [null, ...response._data.body]
          })
        }
      }
    })
  }
  const inventoryDetailFetchGridData = async () => {
    inventoryGridMeta.value.selectedInventory && 
    await useApiFetch(`/api/inventorytransactions/${inventoryGridMeta.value.selectedInventory.uniqueid}`, {
      method: 'GET',
      params: {...inventoryDetailFilterValues.value},
      onResponse({ response }) {
        if(response.status === 200) {
          inventoryDetailGridMeta.value.details = response._data.body;
        }
      }
    })
  }
  const onInventorySelect = async (row) => {
    inventoryGridMeta.value.selectedInventory = row;
    if(JSON.stringify({...inventoryGridMeta.value.selectedInventory.value, class:""})=== JSON.stringify({...row, class: ""})) inventoryGridMeta.value.selectedInventory = null;
    else {
      inventoryGridMeta.value.selectedInventory = {...row, class:""}
    }
    inventoryGridMeta.value.inventories.forEach((product) => {
      if(product.uniqueid === row.uniqueid && row.class != 'bg-gray-200') {
        product.class = 'bg-gray-200'
      }else{
        delete product.class
      }
    })
    formData.transactionID = row.uniqueid
    formData.By = row.By
    formData.Dated = new Date(row.Dated)
    formData.Justification = row.Justification
    inventoryDetailFetchGridData()
  }
  const onInventoryDblClick = async () =>{
    if(inventoryGridMeta.value.selectedInventory){
      // modalMeta.value.modalTitle = "Edit";
      // modalMeta.value.modalDescription = "Edit customer information"
      // modalMeta.value.isOrderDetailModalOpen = true
    }
  }
  const handleInventorySortingButton = async (btnName: string) => {
    for(const column of inventoryGridMeta.value.defaultColumns) {
      if(column.sortable) {
        if (column.key === btnName) {
          switch(column.sortDirection) {
            case 'none':
              column.sortDirection = 'asc';
              inventoryGridMeta.value.sort.column = btnName;
              inventoryGridMeta.value.sort.direction = 'asc';
              break;
            case 'asc':
              column.sortDirection = 'desc';
              inventoryGridMeta.value.sort.column = btnName;
              inventoryGridMeta.value.sort.direction = 'desc';
              break;
            default:
              column.sortDirection = 'none';
              inventoryGridMeta.value.sort.column = 'UniqueID';
              inventoryGridMeta.value.sort.direction = 'asc';
              break;
          }
        } else {
          column.sortDirection = 'none';
        }
      }
    }
    inventoryFetchGridData()
  }
  const handleInventoryFilterInputChange = async (event, name) => {
    console.log(name)
    if (inventoryFilterValues.value.hasOwnProperty(name)) {
      inventoryFilterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
    inventoryFetchGridData()
  }
  const handleProductSortingButton = async (btnName: string) => {
    for(const column of productGridMeta.value.defaultColumns) {
      if(column.sortable) {
        if (column.key === btnName) {
          switch(column.sortDirection) {
            case 'none':
              column.sortDirection = 'asc';
              productGridMeta.value.sort.column = btnName;
              productGridMeta.value.sort.direction = 'asc';
              break;
            case 'asc':
              column.sortDirection = 'desc';
              productGridMeta.value.sort.column = btnName;
              productGridMeta.value.sort.direction = 'desc';
              break;
            default:
              column.sortDirection = 'none';
              productGridMeta.value.sort.column = 'UniqueID';
              productGridMeta.value.sort.direction = 'asc';
              break;
          }
        } else {
          column.sortDirection = 'none';
        }
      }
    }
    productFetchGridData()
  }
  const handleProductFilterInputChange = async (event, name) => {
    if (productFilterValues.value.hasOwnProperty(name)) {
      productFilterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
    productFetchGridData()
  }
  const handleStockSortingButton = async (btnName: string) => {
    for(const column of productGridMeta.value.defaultColumns) {
      if(column.sortable) {
        if (column.key === btnName) {
          switch(column.sortDirection) {
            case 'none':
              column.sortDirection = 'asc';
              productGridMeta.value.sort.column = btnName;
              productGridMeta.value.sort.direction = 'asc';
              break;
            case 'asc':
              column.sortDirection = 'desc';
              productGridMeta.value.sort.column = btnName;
              productGridMeta.value.sort.direction = 'desc';
              break;
            default:
              column.sortDirection = 'none';
              productGridMeta.value.sort.column = 'UniqueID';
              productGridMeta.value.sort.direction = 'asc';
              break;
          }
        } else {
          column.sortDirection = 'none';
        }
      }
    }
    inventoryDetailFetchGridData()
  }
  const handleInventoryDetailFilterInputChange = async (event, name) => {
    if (inventoryDetailFilterValues.value.hasOwnProperty(name)) {
      inventoryDetailFilterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
    inventoryDetailFetchGridData()
  }
  const onInventoryEdit = (row) => {
    inventoryGridMeta.value.selectedInventory = row
    // modalMeta.value.modalTitle = "Edit";
    // modalMeta.value.modalDescription = "Edit invoice information"
    // modalMeta.value.isOrderDetailModalOpen = true
  }
  const onInventoryDelete = async (row: any) => {

  }
  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
    if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
    if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
    return errors
  }
  async function onSubmit(event: FormSubmitEvent<any>) {

    emit('save', event.data)
  }
  editInit()
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    @submit="onSubmit"
  >
    <div class="flex flex-col">
      <div class="flex justify-between bg-slate-400 px-3 py-1">
        <div class="flex items-center">
          Inventroy transactions
        </div>
        <div class="flex flex-row space-x-5">
          <div class="flex flex-row space-x-3">
            <div class="flex items-center">Stock# Search</div>
            <div class="min-w-[150px]">
              <UInput v-model="inventoryFilterValues.uniqueid" />
            </div>
          </div>
          <div>
            <UButton label="Refresh List" color="gray"/>
          </div>
        </div>
      </div>
      <div class="p-4">
        <UTable
          :rows="inventoryGridMeta.inventories"
          :columns="inventoryGridMeta.defaultColumns"
          :loading="inventoryGridMeta.isLoading"
          class="w-full"
          :ui="{
            wrapper: 'overflow-auto h-80 border-2 border-gray-300 dark:border-gray-700',
            divide: 'divide-gray-200 dark:divide-gray-800',
            tr: {
              active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
            },
            th: { 
              base: 'sticky top-0 z-10',
              color: 'bg-white dark:text-gray dark:bg-[#111827]',
              padding: 'p-0'
            }, 
            td: {
              base: 'h-[41px]',
              padding: 'py-1'
            }
          }"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
          @select="onInventorySelect"
          @dblclick="onInventoryDblClick"
        >
          <template v-for="column in inventoryGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
            <template v-if="column.kind !== 'actions'">
              <div class="px-1 py-1">
                <CommonSortAndInputFilter 
                  @handle-sorting-button="handleInventorySortingButton" 
                  @handle-input-change="handleInventoryFilterInputChange"
                  :label="column.label"
                  :sortable="column.sortable"
                  :sort-key="column.key" 
                  :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                  :filterable="column.filterable"
                  :filter-key="column.key"
                />
              </div>
              </template>
              <template v-else class='bg-slate-400'>
                <div class="flex justify-center text-center w-[53px]">
                  {{ column.label }}
                </div>
              </template>
          </template>
          <template #UniqueID-data="{row}">
            <div class="w-[50px]">
              {{ row.UniqueID }}
            </div>
          </template>
          <template #edit-data="{row}">
            <UTooltip text="Detail" class="flex justify-center">
              <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onInventoryEdit(row)"/>
            </UTooltip>
          </template>
          <template #delete-data="{row}">
            <UTooltip text="Delete" class="flex justify-center">
              <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)"/>
            </UTooltip>
          </template>
        </UTable>
        <div class="flex items-center bg-slate-400 px-3 py-1 mt-4">
          Parts Used
        </div>
        <div class="flex flex-row-reverse p-4">
          <div class="min-w-[100px]">
            <UButton  label="Remove Part" :ui="{base: 'min-w-[125px] justify-center'}"/>
          </div>
        </div>
        <div class="flex flex-row space-x-3 p-4 pt-0">
          <div class="basis-1/2">
            <UTable
              :rows="productGridMeta.products"
              :columns="productGridMeta.defaultColumns"
              :loading="productGridMeta.isLoading"
              class="w-full"
              :ui="{
                wrapper: 'overflow-y-auto h-80 border-2 border-gray-300 dark:border-gray-700',
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: { 
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0'
                }, 
                td: {
                  base: 'h-[41px]',
                  padding: 'py-1'
                }
              }"
              :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
              @select=""
              @dblclick=""
            >
            <template v-for="column in productGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
              <template v-if="!column.filterOptions">
                <div class="px-1 py-1">
                  <CommonSortAndInputFilter 
                    @handle-sorting-button="handleProductSortingButton" 
                    @handle-input-change="handleProductFilterInputChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                  />
                </div>
              </template>
              <template v-else>
                <div class="px-1 py-1 min-w-[120px]">
                  <CommonSortAndSelectFilter 
                    @handle-sorting-button="handleProductSortingButton" 
                    @handle-select-change="handleProductFilterInputChange"
                    :label="column.label"
                    :sortable="column.sortable"
                    :sort-key="column.key" 
                    :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                    :value="productFilterValues[column.key]"
                    :filterable="column.filterable"
                    :filter-key="column.key"
                    :filter-options="column.filterOptions"
                  />
                </div>
              </template>
            </template>
              <template #UniqueID-data="{row}">
                <div class="w-[50px]">
                  {{ row.UniqueID }}
                </div>
              </template>
              <template #edit-data="{row}">
                <UTooltip text="Detail" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onInventoryEdit(row)"/>
                </UTooltip>
              </template>
              <template #delete-data="{row}">
                <UTooltip text="Delete" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)"/>
                </UTooltip>
              </template>
            </UTable>
          </div>
          <div class="basis-1/2">
            <UTable
              :rows="inventoryDetailGridMeta.details"
              :columns="inventoryDetailGridMeta.defaultColumns"
              :loading="inventoryDetailGridMeta.isLoading"
              class="w-full"
              :ui="{
                wrapper: 'overflow-y-auto h-80 border-2 border-gray-300 dark:border-gray-700',
                divide: 'divide-gray-200 dark:divide-gray-800',
                th: { 
                  base: 'sticky top-0 z-10',
                  color: 'bg-white dark:text-gray dark:bg-[#111827]',
                  padding: 'p-0'
                }, 
                td: {
                  base: 'h-[41px]',
                  padding: 'py-1'
                }
              }"
              :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
              @select=""
              @dblclick=""
            >
              <template v-for="column in inventoryDetailGridMeta.defaultColumns" v-slot:[`${column.key}-header`]>
                <template v-if="column.kind !== 'actions'">
                  <div class="px-1 py-1">
                    <CommonSortAndInputFilter 
                      @handle-sorting-button="handleStockSortingButton" 
                      @handle-input-change="handleInventoryDetailFilterInputChange"
                      :label="column.label"
                      :sortable="column.sortable"
                      :sort-key="column.key" 
                      :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                      :filterable="column.filterable"
                      :filter-key="column.key"
                    />
                  </div>
                  </template>
                  <template v-else class='bg-slate-400'>
                    <div class="flex justify-center text-center w-[53px]">
                      {{ column.label }}
                    </div>
                  </template>
              </template>
              <template #UniqueID-data="{row}">
                <div class="w-[50px]">
                  {{ row.UniqueID }}
                </div>
              </template>
              <template #edit-data="{row}">
                <UTooltip text="Detail" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onInventoryEdit(row)"/>
                </UTooltip>
              </template>
              <template #delete-data="{row}">
                <UTooltip text="Delete" class="flex justify-center">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onInventoryDelete(row)"/>
                </UTooltip>
              </template>
            </UTable>
          </div>

        </div>
        <div class="flex flex-row">
          <div class="basis-1/2 p-4">
            <div class="flex justify-center">
              Transaction#: {{ formData.transactionID }}
            </div>
          </div>
          <div class="basis-1/2 p-4 flex flex-row space-x-3">
            <div class="basis-1/2 flex flex-col space-y-3">
              <UFormGroup
                label="By"
              >
                <UInput 
                  v-model="formData.By"
                />
              </UFormGroup>
              <UFormGroup
                label="Date"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.Dated && format(formData.Dated, 'MM/dd/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.Dated" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Justification"
              >
                <UTextarea
                  v-model="formData.Justification"
                  :rows="5"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between gap-3 px-8">
      <div>
        <UButton icon="i-heroicons-minus-circle" label="Delete" color="red" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
      </div>
      <div class="flex flex-row space-x-5">
        <UButton icon="i-f7-rays" label="Clear Form" color="red" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
        <UButton icon="i-heroicons-document-text" type="submit" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
      </div>
    </div>
  </UForm>
</template>
