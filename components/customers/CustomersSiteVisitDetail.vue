<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css'; 
  import { format } from 'date-fns'  
  import type { UTableColumn } from '~/types';

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedCustomer: {
      type: [Number, String, null],
      required: true
    },
    selectedOrder: {
      type: [Number, String, null]
    }
  })

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"
  const markets = ref([])
  const professions = ref([])
  const states = ref([])
  const territories = ref([])

  const quotedColumns = ref([{
    key: 'productline',
    label: 'Product Line',
  }, {
    key: 'number',
    label: 'Number'
  }, {
    key: 'description',
    label: 'Description'
  }, {
    key: 'price',
    label: 'Price'
  }])
  const quotedQuantityColumns = ref([{
    key: 'quantity',
    label: 'Quantity',
  }, {
    key: 'number',
    label: 'Number'
  }, {
    key: 'description',
    label: 'Description'
  }, {
    key: 'price',
    label: 'Price'
  }])
  const loadingOverlay = ref(false)
  const formData = reactive({
    customerID: props.selectedCustomer,
    market: null,
    number: null,
    source: null,
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
    siteVisit: null,
    visit: null,
    siteVisitDate: new Date(),
    reason: null,
    by: null,
    productline: null,
    invoice: null,
    quote: null,
    complaint: null,
    comment: null
  })
  const statusGroup = ref([
    {value: 1, label: 'Open'}, 
    {value: 0, label: 'Close'}
  ])
  const filterValues = ref({
    market: null,
    profession: null,
    territory: null,
    state: null,
    date: null,
    reason: null, 
    visitnumber: null,
    productline: null,
    by: null,
    customerid: null,
    company: null,
    city: null,
    status: null
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'date',
        label: 'Date',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'reason',
        label: 'Reason',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'visitnumber',
        label: 'Visit #',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'productLine',
        label: 'Product Line',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'by',
        label: 'By',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'customer#',
        label: 'Customer #',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'company',
        label: 'Company',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      },{
        key: 'city',
        label: 'City',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'state',
        label: 'State',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'status',
        label: 'Status',
        sortDirection: 'none',
        filterable: true, 
        filterOptions: [{
          name: 'Open',
          value: 'Open'
        }, {
          name: 'Close',
          value: 'Close'
        }]
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfCustomers: 0, 
    customers: [],
    selectedCustomerId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const exportIsLoading = ref(false)
  const selectedColumns = ref(gridMeta.value.defaultColumns)
  const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))

  const editInit = async () => {
    loadingOverlay.value = true
    // await useApiFetch(`/api/tbl/tblCustomers/${props.selectedOrder}`, {
    //   method: 'GET',
    //   onResponse({ response }) {
    //     if(response.status === 200) {
    //       loadingOverlay.value = false
    //       for (const key in response._data.body) {
    //         if (response._data.body[key] !== undefined) {
    //           formData[key] = response._data.body[key]
    //         }
    //       }
    //     }
    //   }
    // })
    await propertiesInit()
    loadingOverlay.value = false
  }

  const propertiesInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/tbl/tblCustomers/${props.selectedCustomer}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          for (const key in response._data.body) {
            if (response._data.body[key]) {
              formData[key] = response._data.body[key]
            }
          }
        }
      }
    })

    await useApiFetch('/api/customers/markets', {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          markets.value = [null, ...response._data.body];
        }
      },
    });

    await useApiFetch('/api/customers/professions', {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          professions.value = [null, ...response._data.body];
        }
      },
    });
    
    await useApiFetch('/api/common/usstates', {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          states.value = [null, ...response._data.body];
        }
      },
    });

    await useApiFetch('/api/customers/territories', {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          territories.value = [null, ...response._data.body];
        }
      },
    });

    loadingOverlay.value = false
  }

  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
    if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
    if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
    return errors
  }
  const fetchGridData = async () => {
    gridMeta.value.isLoading = true
    await useApiFetch('/api/customers/numbers', {
      method: 'GET',
      params: {
        ...filterValues.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.numberOfCustomers = response._data.body
        }
      }
    })
    if(gridMeta.value.numberOfCustomers === 0){
      gridMeta.value.customers = []
      gridMeta.value.numberOfCustomers = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfCustomers) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfCustomers / gridMeta.value.pageSize) | 1
    }
    await useApiFetch('/api/customers/list', {
      method: 'GET',
      params: {
        page: gridMeta.value.page,
        pageSize: gridMeta.value.pageSize, 
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value,
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          gridMeta.value.customers = response._data.body
        }
        gridMeta.value.isLoading = false
      }
    });
  }
  const handleFilterChange = () => {
    gridMeta.value.page = 1
    fetchGridData()
  }
  const handleSelectChange = () => {
    gridMeta.value.page = 1
    fetchGridData()
  }
  const handleSortingButton = async (btnName: string) => {
    gridMeta.value.page = 1
    for(const column of columns.value) {
      if(column.sortable) {
        if (column.key === btnName) {
          switch(column.sortDirection) {
            case 'none':
              column.sortDirection = 'asc';
              gridMeta.value.sort.column = btnName;
              gridMeta.value.sort.direction = 'asc';
              break;
            case 'asc':
              column.sortDirection = 'desc';
              gridMeta.value.sort.column = btnName;
              gridMeta.value.sort.direction = 'desc';
              break;
            default:
              column.sortDirection = 'none';
              gridMeta.value.sort.column = 'UniqueID';
              gridMeta.value.sort.direction = 'asc';
              break;
          }
        } else {
          column.sortDirection = 'none';
        }
      }
    }
    fetchGridData()
  }
  const handleFilterInputChange = async (event, name) => {
    gridMeta.value.page = 1
    if (filterValues.value.hasOwnProperty(name)) {
      filterValues.value[name] = event;
    } else {
      console.error(`Filter does not have property: ${name}`);
    }
    fetchGridData()
  }


  async function onSubmit(event: FormSubmitEvent<any>) {
    emit('save', event.data)
    emit('close')
  }
  if(props.selectedOrder) 
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
    @submit="onSubmit"
  >
    <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
      Sort
    </div>
    <div class="flex flex-row justify-between w-full p-3">
      <div class="flex flex-row space-x-4">
        <div class="min-w-[120px]">
          <UFormGroup
            label="Market"
            name="market"
          >
            <USelect
              v-model="filterValues.market"
              :options="markets"
            />
          </UFormGroup>
        </div>
        <div class="min-w-[120px]">
          <UFormGroup
            label="Profession"
            name="profession"
          >
            <USelect
              v-model="filterValues.profession"
              :options="professions"
            />
          </UFormGroup>
        </div>
        <div class="min-w-[120px]">
          <UFormGroup
            label="Territory"
            name="territory"
          >
            <USelect
              v-model="filterValues.territory"
              :options="territories"
            />
          </UFormGroup>
        </div>
        <div class="min-w-[120px]">
          <UFormGroup
            label="State"
            name="state"
          >
            <USelect
              v-model="filterValues.state"
              :options="states"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="flex items-end">
        <UButton 
          :loading="exportIsLoading"
          label="Export to Excel" 
          color="gray"
          @click=""
        >
          <template #trailing>
            <UIcon name="i-heroicons-document-text" class="text-green-500 w-5 h-5" />
          </template>
        </UButton>
      </div>
    </div>
    <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
      Lookup
    </div>
    <div class="w-full p-3">
      <UTable
        :rows="gridMeta.customers"
        :columns="columns"
        :loading="gridMeta.isLoading"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800', 
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'p-0'
          }, 
          td: {
            padding: 'py-1'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        @select=""
        @dblclick=""
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="!column.filterOptions">
            <div class="px-1 py-1">
              <CommonSortAndInputFilter 
                @handle-sorting-button="handleSortingButton" 
                @handle-input-change="handleFilterInputChange"
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
            <div class="px-1 py-1">
              <CommonSortAndSelectFilter 
                @handle-sorting-button="handleSortingButton" 
                @handle-select-change="handleSelectChange"
                :label="column.label"
                :sortable="column.sortable"
                :sort-key="column.key" 
                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                :filterable="column.filterable"
                :filter-key="column.key"
                :filter-options="column.filterOptions"
              />
            </div>
          </template>
        </template>
      </UTable>
    </div>
    <div class="flex flex-row space-x-3 w-full p-3">
      <div class="basis-1/3">
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Site Visit
        </div>
        <div class="flex flex-col space-y-2 p-2">
          <div class="flex flex-row space-x-5 ml-4">
            <URadio 
              v-for="status of statusGroup"
              :key = 'status.value'
              v-model="formData.siteVisit"
              v-bind="status"
            />
          </div>
          <UFormGroup
            label="Visit#"
          >
            <UInput 
              v-model="formData.visit"
              disabled
            />
          </UFormGroup>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup
                label="Date"
              >
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.siteVisitDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.siteVisitDate" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="By"
              >
                <USelect
                  v-model="filterValues.by"
                  :options="[]"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2">
              <UFormGroup
                label="Reason"
              >
                <USelect
                  v-model="filterValues.reason"
                  :options="[]"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2 space-x-2">
              <UFormGroup
                label="Product Line"
              >
                <USelect
                  v-model="filterValues.productline"
                  :options="[]"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-document-text" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-eye" label="Preview" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
          <div class="flex flex-row space-x-2">
            <div class="basis-1/2 w-full">
              <UButton icon="i-f7-rays" label="Clear" color="red" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
            <div class="basis-1/2 w-full">
              <UButton icon="i-heroicons-minus-circle" label="Delete" color="red" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/3">
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Location
        </div>
        <div class="flex flex-col space-y-2 p-2">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Customer#"
              >
                <UInput 
                  v-model="formData.customerID"
                  disabled
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2 flex justify-end">
              <UButton icon="i-heroicons-cursor-arrow-ripple" label="Select/View Customer" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" truncate/>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="First"
              >
                <UInput 
                  v-model="formData.fname"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Last"
              >
                <UInput 
                  v-model="formData.lname"
                />
              </UFormGroup>
            </div>
          </div>
          <UFormGroup
            label="Position"
          >
            <UInput 
              v-model="formData.position"
            />
          </UFormGroup>
          <UFormGroup
            label="Company 1"
          >
            <UInput 
              v-model="formData.company1"
            />
          </UFormGroup>
          <UFormGroup
            label="Company 2"
          >
            <UInput 
              v-model="formData.company2"
            />
          </UFormGroup>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Address"
              >
                <UInput 
                  v-model="formData.address"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="E-mail"
              >
                <UInput 
                  v-model="formData.email"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="City"
              >
                <UInput 
                  v-model="formData.city"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="State"
              >
                <USelect
                  v-model="formData.state"
                  :options="[]"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="Zip"
              >
                <UInput 
                  v-model="formData.zip"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Work"
              >
                <UInput 
                  v-model="formData.workphone"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Cell"
              >
                <UInput 
                  v-model="formData.cellphone"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/3">
        <div class="w-full px-3 py-1 bg-slate-400 border-2 border-slate-600 border-l-0 border-b-0 border-r-0">
          Comments
        </div>
        <div class="flex flex-col space-y-2 p-2">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/3">
              <UFormGroup 
                label="Invoice#"
              >
                <USelect
                  v-model="formData.invoice"
                  :options="[]"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup 
                label="Quote#"
              >
                <USelect
                  v-model="formData.quote"
                  :options="[]"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup 
                label="Complain#"
              >
                <USelect
                  v-model="formData.complaint"
                  :options="[]"
                />
              </UFormGroup>
            </div>
          </div>
            <UTextarea
              :rows="8"
              v-model="formData.comment"
            />
        </div>
        <div class="flex flex-row space-x-5 mt-5 p-2 ">
          <UFormGroup
            label="Created By"
          >
          <UInput
            v-model="formData.customerID"
            />
          </UFormGroup>
          <UFormGroup
            label="Date"
          >
            <UPopover  :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.siteVisitDate, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
              <template #panel="{ close }">
                <CommonDatePicker v-model="formData.siteVisitDate" is-required @close="close" />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
      </div>
    </div>
  </UForm>
</template>
