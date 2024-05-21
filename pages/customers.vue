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
    key: 'company',
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
]

const q = ref('')
const selected = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isNewCustomerModalOpen = ref(false)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))

// const { data: customers, pending } = await useFetch<User[]>('/api/customers', { query, default: () => [] })
const pending = false
const customers = [
  {
    UniqueID: 1,
    fname: 'Lindsay',
    lname: 'Walton',
    company: 'Grimm',
    homephone: '2342-23424',
    workphone: '2342-342',
    city: 'Dallas',
    state: 'Texas',
    zip: '3242',
    email: 'lindsay.walton@example.com',
  },
  {
    UniqueID: 2,
    fname: 'Lindsay',
    lname: 'Walton',
    company: 'Grimm',
    homephone: '2342-23424',
    workphone: '2342-342',
    city: 'Dallas',
    state: 'Texas',
    zip: '3242',
    email: 'lindsay.walton@example.com',
  },
]

function onSelect(row: User) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
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
            label="New user"
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

      <UDashboardModal
        v-model="isNewCustomerModalOpen"
        title="New user"
        description="Add a new customer to your database"
        :ui="{ width: 'max-w-xl' }"
      >
        <!-- ~/components/customers/customersForm.vue -->
        <CustomersForm @close="isNewCustomerModalOpen = false" />
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
        @select="onSelect"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              v-bind="row.avatar"
              :alt="row.name"
              size="xs"
            />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid">asdfasd</UButton>
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
