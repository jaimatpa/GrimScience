<script lang="ts" setup>
  import MarketingForm from '~/components/marketing/MarketingForm.vue';
import PartsUsed from '~/components/marketing/PartsUsed.vue';
import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })
  
  useSeoMeta({
   title: 'Grimm-Marketing projects'
  })

  const route = useRoute()
  const toast = useToast()

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const headerFilters = ref({
    markets: {
      label: 'Market',
      filter: 'market',
      options: []
    }, 
    professions: {
      label: 'Profession', 
      filter: 'source',
      options: []
    }, 
    categories: {
      label: 'Category', 
      filter: 'ParadynamixCatagory', 
      options: []
    }, 
    conferences: {
      label: 'Conference', 
      filter: 'SourceConfrence',
      options: []
    }, 
    usstates: {
      label: 'State', 
      filter: 'state',
      api: '/api/common/usstates',
      options: []
    }
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'number',
        label: 'Project#',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'fname',
        label: 'Qty.',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'lname',
        label: 'Description',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'company1',
        label: 'type',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'homephone',
        label: 'Opened',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'Closed',
        label: 'Closed',
        sortable: false,
        sortDirection: 'none',
        filterable: false
      },
      {
        key: '% Complete',
        label: '% Complete',
        sortable: false,
        sortDirection: 'none',
        filterable: false
      },
      {
        key: 'ProjectCost',
        label: 'ProjectCost',
        sortable: false,
        sortDirection: 'none',
        filterable: false
      },
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
  const modalMeta = ref({
    isPartsUsed: false,
    isCustomerModalOpen: false,
    isOrderDetailModalOpen: false,
    isQuoteDetailModalOpen: false,
    isServiceOrderDetailModalOpen: false,
    isSiteVisitModalOpen: false,
    modalTitle: "New Customer",
  })
  const filterValues = ref({
    market: null,
    source: null,
    ParadynamixCatagory: null,
    SourceConfrence: null,
    number: null,
    fname: null,
    lname: null,
    company1: null,
    homephone: null,
    workphone: null,
    state: null,
    zip: null
  })
  const selectedColumns = ref(gridMeta.value.defaultColumns)
  const exportIsLoading = ref(false)

  const columns = computed(() => gridMeta.value.defaultColumns.filter(column => selectedColumns.value.includes(column)))
  Object.entries(route.query).forEach(([key, value]) => {
    switch(key.toLowerCase()) {
      case 'page':
        gridMeta.value.page = Number(value);
        break;
      case 'pagesize':
        gridMeta.value.pageSize = Number(value);
        break;
      case 'sortby':
        gridMeta.value.sort.column = value as unknown as string;
        break;
      case 'sortorder':
        gridMeta.value.sort.direction = value as unknown as string;
        break;
    }
  })

  const init = async () => {
    fetchGridData()
    for(const key in headerFilters.value) {
      const apiURL = headerFilters.value[key]?.api?? `/api/customers/${key}`;
      console.log("Api url is",apiURL)
      await useApiFetch(apiURL, {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
          
            headerFilters.value[key].options = [null, ...response._data.body];
          }
        }
      })
    }
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
    await useApiFetch('/api/customers/', {
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
  const onCreate = () => {
    gridMeta.value.selectedCustomerId = null
    modalMeta.value.modalTitle = "New Customer";
    modalMeta.value.isCustomerModalOpen = true
  }
  const onEdit = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isCustomerModalOpen = true
  }
  const onOrderDetail = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.isOrderDetailModalOpen = true
  }
  const onQuoteDetail = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.isQuoteDetailModalOpen = true
  }
  const onServiceOrderDetail = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.isServiceOrderDetailModalOpen = true
  }
  const onSiteVisitDetail = (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID
    modalMeta.value.isSiteVisitModalOpen = true
  }
  const onAdd=()=>{
    modalMeta.value.isPartsUsed = true

  }
  const onDelete = async (row: any) => {
    await useApiFetch(`/api/customers/${row?.UniqueID}`, {
      method: 'DELETE', 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-trash-solid',
            color: 'green'
          })
          fetchGridData()
        }
      }
    })
  }
  const handleModalClose = () => {
    modalMeta.value.isCustomerModalOpen = false
  }
  const handleModalSave = async () => {
    handleModalClose()
    fetchGridData()
  }
  const handlePageChange = async () => {
    fetchGridData()
  }
  const handleFilterChange = () => {
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
  const excelExport = async () => {
    exportIsLoading.value = true
    const params = {
        sortBy: gridMeta.value.sort.column,
        sortOrder: gridMeta.value.sort.direction,
        ...filterValues.value,
      }
    const paramsString = Object.entries(params)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => {
        if(value !== null)
        return `${key}=${value}`
      })
      .join("&") 
    location.href = `/api/customers/exportlist?${paramsString}`
    exportIsLoading.value = false
  }
  const onSelect = async (row) => {
    gridMeta.value.selectedCustomerId = row?.UniqueID;
  }
  const onDblClick = async () =>{
    if(gridMeta.value.selectedCustomerId){
      modalMeta.value.modalTitle = "Edit Project";
      modalMeta.value.isCustomerModalOpen = true
    }
  }
  const onAdded = () => {
    modalMeta.value.isCustomerModalOpen = true
    modalMeta.value.modalTitle = "New Project";

  }
</script>

<template>
  <UDashboardPage>

    
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" 
        title="Projects"
      >
      </UDashboardNavbar>


      
    

      <div class="px-4 py-2 gmsBlueTitlebar">
        <h2>Projects List</h2>
      </div>
      <div class="flex justify-between m-2">
  <!-- Left Section: Form Group -->
  <div class="flex items-center space-x-3">
    <UFormGroup
      label="Number of Search Items To Return"
      name="zip"
      class="flex items-center space-x-4"
    >
      <UInput class="inline-block" />
    </UFormGroup>
  </div>

  <!-- Right Section: Checkboxes -->
  <div class="flex items-center space-x-11 ">
    <div>
      <UCheckbox label="Marketing" />
    </div>
    <div>
      <UCheckbox label="Accounting" />
    </div>
    <div>
      <UCheckbox label="Engineering" />
    </div>
    <div>
      <UCheckbox label="Manufacturing" />
    </div>
    <div>
      <UCheckbox label="Show Open Only" />
    </div>
  </div>
  <div>
    <div class="mr-5">
        
        <UButton color="green" variant="outline"
          type="submit"
          label="New Project"
          icon="i-heroicons-plus"
          @click="onAdded()"
        />
      </div>
  </div>
</div>

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
        @select="onSelect"
        @dblclick="onDblClick"
      >
        <template v-for="column in columns" v-slot:[`${column.key}-header`]>
          <template v-if="column.kind !== 'actions'">
            <div class="px-4 py-3.5">
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
            <template v-else class='bg-slate-400'>
              <div class="flex justify-center text-center w-[53px]">
                {{ column.label  }}
              </div>
            </template>
        </template>
        <template #label-data="{row}">
          <UTooltip text="Label" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-tag" @click=""/>
          </UTooltip>
        </template>
        <template #order-data="{row}">
          <UTooltip text="Order" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-shopping-cart" @click="onOrderDetail(row)"/>
          </UTooltip>
        </template>
        <template #quote-data="{row}">
          <UTooltip text="Quote" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-currency-dollar" @click="onQuoteDetail(row)"/>
          </UTooltip>
        </template>
        <template #serviceOrder-data="{row}">
          <UTooltip text="Service Order" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-chat-bubble-left-ellipsis" @click="onServiceOrderDetail(row)"/>
          </UTooltip>
        </template>
        <template #siteVisit-data="{row}">
          <UTooltip text="Site Visit" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-clipboard-document-list" @click="onSiteVisitDetail(row)"/>
          </UTooltip>
        </template>
        <template #edit-data="{row}">
          <UTooltip text="Edit" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="onEdit(row)"/>
          </UTooltip>
        </template>
        <template #delete-data="{row}">
          <UTooltip text="Delete" class="flex justify-center">
            <UButton color="gray" variant="ghost" icon="i-heroicons-trash" @click="onDelete(row)"/>
          </UTooltip>
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="gridMeta.pageSize" :total="gridMeta.numberOfCustomers | 0" v-model="gridMeta.page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- New Customer Detail Modal -->
  <UDashboardModal
    v-model="modalMeta.isCustomerModalOpen"
    :title="modalMeta.modalTitle"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-9xl'
    }"
  >
    <MarketingForm @close="handleModalClose" @save="handleModalSave" :selected-customer="gridMeta.selectedCustomerId" :is-modal="true"/>
  </UDashboardModal>
  <!-- Order Modal -->
  <UDashboardModal
    v-model="modalMeta.isOrderDetailModalOpen"
    title="Invoice"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl', 
    }"
  >
    <InvoiceDetail :selected-customer="gridMeta.selectedCustomerId" @close="modalMeta.isOrderDetailModalOpen = false"/>
  </UDashboardModal>      
  <!-- Quote Modal -->
  <UDashboardModal
    v-model="modalMeta.isQuoteDetailModalOpen"
    title="Quote"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-7xl'
    }"
  >
    <CustomersQuoteDetail :selected-customer="gridMeta.selectedCustomerId"/>
  </UDashboardModal>
  <!-- Service Order Modal -->
  <UDashboardModal
    v-model="modalMeta.isServiceOrderDetailModalOpen"
    title="Service Order"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl'
    }"
  >
    <ServiceOrderDetail :selected-customer="gridMeta.selectedCustomerId"/>
  </UDashboardModal>





  
  <!-- Site Visit Modal -->
  <UDashboardModal
    v-model="modalMeta.isSiteVisitModalOpen"
    title="Site Visit"
    :ui="{
      title: 'text-lg',
      header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl'
    }"
  >
    <CustomersSiteVisitDetail :selected-customer="gridMeta.selectedCustomerId"/>
  </UDashboardModal>
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
  </UDashboardModal> 
</template>
<style scoped>
</style>