<script lang="ts" setup>
  import type skill from '~/server/api/projects/skill';
import type { UTableColumn } from '~/types';

  onMounted(() => {
    init()
  })
  
  useSeoMeta({
    title: 'Grimm-Customers'
  })

  const route = useRoute()
  const toast = useToast()

  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const headerFilters = ref({ 
    category: {
      label: 'Category', 
      filter: 'Catagory',
      options: []
    }, 
    subCategory: {
      label: 'Subcategory', 
      filter: 'subcatagory', 
      options: []
    }, 
  })
  const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: 'UniqueID',
        label: 'Skill#',
      }, {
        key: 'Catagory',
        label: 'Category'
      }, {
        key: 'subcatagory',
        label: 'Sub Category'

      }, {
        key: 'weeks',
        label: 'Weeks'
      },{
        key: 'delete',
        label: 'Del',
        kind: 'actions'
      }
    ],
    page: 1,
    pageSize: 50,
    numberOfCustomers: 0, 
    skills: [],
    selectedSkillId: null,
    sort: {
      column: 'UniqueID', 
      direction: 'asc'
    }, 
    isLoading: false
  })
  const modalMeta = ref({
    isCustomerModalOpen: false,
    isOrderDetailModalOpen: false,
    isQuoteDetailModalOpen: false,
    isServiceOrderDetailModalOpen: false,
    isSiteVisitModalOpen: false,
    modalTitle: "New Customer",
  })
  const filterValues = ref({
    skill: null,
    Catagory:null,
    subcatagory:null
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
      console.log("the key is",key);
      const apiURL = headerFilters.value[key]?.api?? `/api/projects/skill/${key}`;
      await useApiFetch(apiURL, {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            headerFilters.value[key].options = [null, ...response._data.body];
            console.log("the response is like",response._data.body);
          }
        }
      })
    }
  }

  const handleModalClose = () => {
    modalMeta.value.isCustomerModalOpen = false
  }
  const handleModalSave = async () => {
    handleModalClose()
    fetchGridData()
  }
  const fetchGridData = async () => {
    gridMeta.value.isLoading = true
    await useApiFetch('/api/projects/skill/number', {
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
      gridMeta.value.skills = []
      gridMeta.value.numberOfCustomers = 0
      gridMeta.value.isLoading = false
      return;
    }
    if(gridMeta.value.page * gridMeta.value.pageSize > gridMeta.value.numberOfCustomers) {
      gridMeta.value.page = Math.ceil(gridMeta.value.numberOfCustomers / gridMeta.value.pageSize) | 1
    }
    // table data coming in there
    console.log("filter value is",filterValues.value);
    await useApiFetch('/api/projects/skill', {
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
          console.log("the skill is",response._data.body);
          gridMeta.value.skills=response._data.body;
          console.log("the skill is", gridMeta.value.skills);

        }
        gridMeta.value.isLoading = false
      }
    });
  }
  const onCreate = () => {
    gridMeta.value.selectedSkillId = null
    modalMeta.value.modalTitle = "New Skill";
    modalMeta.value.isCustomerModalOpen = true
  }
  const onEdit = (row) => {
    gridMeta.value.selectedSkillId = row?.UniqueID
    modalMeta.value.modalTitle = "Edit";
    modalMeta.value.isCustomerModalOpen = true
  }
  const onOrderDetail = (row) => {
    gridMeta.value.selectedSkillId = row?.UniqueID
    modalMeta.value.isOrderDetailModalOpen = true
  }
  const onQuoteDetail = (row) => {
    gridMeta.value.selectedSkillId = row?.UniqueID
    modalMeta.value.isQuoteDetailModalOpen = true
  }
  const onServiceOrderDetail = (row) => {
    gridMeta.value.selectedSkillId = row?.UniqueID
    modalMeta.value.isServiceOrderDetailModalOpen = true
  }
  const onSiteVisitDetail = (row) => {
    gridMeta.value.selectedSkillId = row?.UniqueID
    modalMeta.value.isSiteVisitModalOpen = true
  }
  const onDelete = async (row: any) => {
    console.log("row is ",row?.UniqueID);
    await useApiFetch(`/api/projects/skill/${row?.UniqueID}`, {
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
    gridMeta.value.selectedSkillId = row?.UniqueID;
  }
  const onDblClick = async () =>{
    if(gridMeta.value.selectedSkillId){
      modalMeta.value.modalTitle = "Edit";
      modalMeta.value.isCustomerModalOpen = true
    }
  }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsTealHeader" 
        title="Skill Lookup"
      >
      </UDashboardNavbar>



      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3  ">
            <div class="basis-1/7 max-w-[200px]">
              <UFormGroup
                label="skill"
                name="skill"
              >
                <UInput
                  v-model="filterValues.skill"
                  @update:model-value="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <template v-for="[key, value] in Object.entries(headerFilters)" :key="key">
              <template v-if="value.options.length > 1">
                <div class="basis-1/7 max-w-[200px]">
                  <UFormGroup
                    :label="value.label"
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
            
           
          </div>
        </template>
        <template #right>
          <UButton color="green" variant="outline"
            label="Add Skill"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardToolbar>

      <UTable
        :rows="gridMeta.skills"
        :columns="gridMeta.defaultColumns"
        :loading="gridMeta.isLoading"
        class="w-full h-[400px]  overflow-y-auto"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800', 
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
            padding: 'p-0'
          }, 
          td: {
            padding: 'py-2'
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
                {{ column.label }}
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
      width: 'w-[1000px] sm:max-w-7xl'
    }"
  >
       <MarketingManuFactureSkillForm @save="handleModalSave"  :selectedSkill="gridMeta.selectedSkillId"/>

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
    <InvoiceDetail :selected-customer="gridMeta.selectedSkillId" @close="modalMeta.isOrderDetailModalOpen = false"/>
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
  </UDashboardModal>

</template>
<style scoped>
</style>