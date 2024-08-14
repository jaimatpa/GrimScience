<script lang="ts" setup>
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
        label: 'Number',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'fname',
        label: 'First',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'lname',
        label: 'Last',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'company1',
        label: 'Company',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'homephone',
        label: 'HomePhone',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'workphone',
        label: 'WorkPhone',
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
        key: 'zip',
        label: 'Zip',
        sortable: true,
        sortDirection: 'none',
        filterable: true
      }, {
        key: 'label',
        label: 'Label',
        kind: 'actions'
      }, {
        key: 'order',
        label: 'Order',
        kind: 'actions'
      }, {
        key: 'quote',
        label: 'Quote',
        kind: 'actions'
      }, {
        key: 'serviceOrder',
        label: 'Service Order',
        kind: 'actions'
      }, {
        key: 'siteVisit',
        label: 'Site Visit',
        kind: 'actions'
      }, {
        key: 'edit',
        label: 'Edit',
        kind: 'actions'
      }, {
        key: 'delete',
        label: 'Del',
        kind: 'actions'
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
  const modalMeta = ref({
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
      console.log("the key is",key);
      const apiURL = headerFilters.value[key]?.api?? `/api/customers/${key}`;
      await useApiFetch(apiURL, {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            headerFilters.value[key].options = [null, ...response._data.body];
            console.log("the response is",response._data.body);
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
    // table data coming in there
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
          console.log("the customer area",response._data.body);
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
      modalMeta.value.modalTitle = "Edit";
      modalMeta.value.isCustomerModalOpen = true
    }
  }
</script>

<template>
  <CustomersCustomerList :is-page="true" />
</template>
<style scoped>
</style>