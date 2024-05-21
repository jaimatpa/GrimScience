<script lang="ts" setup>
import type { User } from '~/types'

const defaultColumns = [{
    key: 'UniqueID',
    label: '#'
  }, {
    key: 'fname',
    label: 'First',
    sortable: true
  }, {
    key: 'lname',
    label: 'Last',
    sortable: true
  }, 
  {
    key: 'department',
    label: 'Company',
    sortable: true
  }, 
  {
    key: 'homephone',
    label: 'Home Phone',
    sortable: true
  }, 
  {
    key: 'workphone',
    label: 'Work Phone',
    sortable: true
  }, 
  {
    key: 'email',
    label: 'Email',
    sortable: true
  }, 
  {
    key: 'city',
    label: 'City',
    sortable: true
  }, 
  {
    key: 'state',
    label: 'State',
    sortable: true
  },
  {
    key: 'zip',
    label: 'Zip',
    sortable: true
  },
  {
    key: 'actions'
  }
]

const q = ref('')
const selected = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isNewCustomerModalOpen = ref(false)
const isEditCustomerModalOpen = ref(false)
const customers = ref([])
const selectedCustomer = ref({})

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const { data } = await customAxios({
  method: 'GET', 
  url: '/api/tbl/tblEmployee/'
})
customers.value = data.body;
const pending = false

function onSelect(row: User) {
  console.log(selected)
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

const onEdit = (row) => {
  selectedCustomer.value = row
  isEditCustomerModalOpen.value = true
}

const onDelete = async (row: any) => {
  const res = await customAxios({
    method: 'DELETE',
    url: '/api/tbl/tblEmployee/',
    data: {
      UniqueID: row?.UniqueID
    }
  })
  if (res.status === 200) {
    const leftCustomers = customers.value.filter((item: any) => {
      if(item.UniqueID !== row.UniqueID){
        console.log(item)
        return item
      }
    })
    customers.value = leftCustomers;
  }
}

const handleModalClose = () => {
  isNewCustomerModalOpen.value = false
}

const handleModalSave = async (data) => {
  const res = await customAxios({
    method: 'POST',
    url: '/api/tbl/tblEmployee/',
    data: data
  })
  console.log(res)
  customers.value = [...customers.value, res.data.body] 
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="customers"
        :badge="customers.length"
      >
        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter customers..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton
            label="New customer"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="isNewCustomerModalOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <!-- Create Customer Modal -->
      <UDashboardModal
        v-model="isNewCustomerModalOpen"
        title="New customer"
        description="Add a new customer to your database"
        :ui="{ width: 'max-w-xl' }"
      >
        <!-- ~/components/customers/customersForm.vue -->
        <CustomersCreateForm @close="handleModalClose" @save="handleModalSave" v-model="selectedCustomer"/>
      </UDashboardModal>

      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="customers"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"

      >
        <template #actions-data="{ row }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-20-solid" @click="onEdit(row)"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-trash-20-solid" @click="onDelete(row)"/>
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
