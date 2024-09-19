<script lang="ts" setup>
const bugLookup = ref('')
const openBugsOnly = ref(false)
const selectedBugId = ref(null)
const selectedBug = ref({
  id: '',
  date: '',
  form: '',
  by: '',
  description: '',
  details: '',
  status: 'Alive',
  type: '',
  cost: '',
  authorizedBy: '',
  resolveVersion: ''
})

const filters = ref({
  id: '',
  date: '',
  form: '',
  by: '',
  description: ''
})

const columns = [
  { key: 'id', label: '#' },
  { key: 'date', label: 'Date' },
  { key: 'form', label: 'Form' },
  { key: 'by', label: 'By' },
  { key: 'description', label: 'Description' },
  { key: 'details', label: 'Details' },
  { key: 'type', label: 'Type' },
  { key: 'cost', label: 'Cost' },
  { key: 'authorizedBy', label: 'Approved' },
  { key: 'resolveVersion', label: 'Resolved In Version' }
]

const bugs = ref([
  { id: 31924, date: '2024-09-17', form: 'frmUtilitiesSettings', by: '#73 Dylan Downs', description: 'des', details: 'details', type: '', cost: '', authorizedBy: '', resolveVersion: '', status: 'Alive' },
  { id: 31922, date: '2024-09-16', form: 'frmAccountingPayables', by: '#41 Leith Stetson', description: '', details: '', type: '', cost: '', authorizedBy: '', resolveVersion: '', status: 'Dead' },
  { id: 31921, date: '2024-09-16', form: '', by: '', description: '', details: '', type: '', cost: '', authorizedBy: '', resolveVersion: '', status: 'Alive' },
  { id: 31920, date: '2024-09-16', form: 'frmShippingRates', by: '#41 Leith Stetson', description: '', details: '', type: '', cost: '', authorizedBy: '', resolveVersion: '', status: 'Alive' },
  { id: 31918, date: '2024-04-02', form: 'frmQuote', by: '#1 Joseph Grimm', description: 'Move Quote #1539', details: 'From Cust #9833 to Cust #26049', type: 'Bug', cost: '', authorizedBy: 'Joseph Grimm', resolveVersion: 'Joseph Grimm', status: 'Alive' },
])

const formOptions = ['frmUtilitiesSettings', 'frmAccountingPayables', 'frmShippingRates', 'frmQuote', 'frmPartsList', 'frmVendorInvoice', 'frmPermissions']
const userOptions = ['#73 Dylan Downs', '#41 Leith Stetson', '#1 Joseph Grimm', '#82 Esteal Hendricks', '#84 Douglas Wright']
const typeOptions = ['Bug', 'Feature Request', 'Improvement']

const filteredBugs = computed(() => {
  return bugs.value.filter(bug => {
    const matchesFilters = Object.keys(filters.value).every(key => {
      const filterValue = filters.value[key].toLowerCase()
      const bugValue = String(bug[key]).toLowerCase()
      return bugValue.includes(filterValue)
    })
    
    const matchesOpenOnly = openBugsOnly.value ? bug.status === 'Alive' : true
    const matchesLookup = bugLookup.value === '' || 
      Object.values(bug).some(value => 
        String(value).toLowerCase().includes(bugLookup.value.toLowerCase())
      )
    
    return matchesFilters && matchesOpenOnly && matchesLookup
  })
})

const selectBug = (bug) => {
  selectedBugId.value = bug.id
  selectedBug.value = { ...bug }
}

const printBugs = () => {
  // Implement print functionality
}

const designBug = () => {
  // Implement design functionality
}

const printBugDetails = () => {
  // Implement print bug details functionality
}

const addBug = () => {
  // Implement add bug functionality
}

const modifyBug = () => {
  // Implement modify bug functionality
}

const clearBugDetails = () => {
  selectedBugId.value = null
  selectedBug.value = {
    id: '',
    date: '',
    form: '',
    by: '',
    description: '',
    details: '',
    status: 'Alive',
    type: '',
    cost: '',
    authorizedBy: '',
    resolveVersion: ''
  }
}

const deleteBug = () => {
  // Implement delete bug functionality
}
</script>


<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="bg-red-400" title="Bugs">
      </UDashboardNavbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Filters</h2>
      </div>

      <UDashboardToolbar class="bg-gms-gray-100">
        <template #left>
          <div class="flex space-x-4">
            <UInput v-model="filters.id" placeholder="#" class="w-20" />
            <UInput v-model="filters.date" placeholder="Date" class="w-32" />
            <UInput v-model="filters.form" placeholder="Form" class="w-40" />
            <UInput v-model="filters.by" placeholder="By" class="w-40" />
            <UInput v-model="filters.description" placeholder="Description" class="w-60" />
          </div>
        </template>
        <template #right>
          <div class="flex items-center space-x-4">
            <UCheckbox v-model="openBugsOnly" label="Open Bugs Only" />
            <UButton icon="i-heroicons-printer" variant="soft" @click="printBugs">
              Print
            </UButton>
          </div>
        </template>
      </UDashboardToolbar>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Bug List</h2>
      </div>

      <UTable
        :columns="columns"
        :rows="filteredBugs"
        @select="selectBug"
        :selected="selectedBugId"
        selectable
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800',
          th: {
            base: 'sticky top-0 z-10',
            padding: 'pb-0',
          },
          td: {
            padding: 'py-1',
          },
        }"
      >
        <template #id-data="{ row }">
          {{ row.id }}
        </template>
      </UTable>

      <div class="px-4 py-2 gmsTealTitlebar">
        <h2>Bug Details</h2>
      </div>

      <div class="mt-6 p-4 border rounded-lg">
        <div class="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <UFormGroup label="Bug ID" name="bugId">
              <UInput id="bugId" v-model="selectedBug.id" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Date Reported" name="dateReported">
              <UInput id="dateReported" v-model="selectedBug.date" type="date" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Form Reported" name="formReported">
              <USelect id="formReported" v-model="selectedBug.form" :options="formOptions" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="By" name="reportedBy">
              <USelect id="reportedBy" v-model="selectedBug.by" :options="userOptions" />
            </UFormGroup>
          </div>

          <div class="col-span-2">
            <UFormGroup label="Description" name="description">
              <UInput id="description" v-model="selectedBug.description" />
            </UFormGroup>
          </div>

          <div class="col-span-2">
            <UFormGroup label="Details of Bug" name="details">
              <UTextarea id="details" v-model="selectedBug.details" rows="3" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Type" name="bugType">
              <USelect id="bugType" v-model="selectedBug.type" :options="typeOptions" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Cost" name="cost">
              <UInput id="cost" v-model="selectedBug.cost" type="number" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Authorized By" name="authorizedBy">
              <USelect id="authorizedBy" v-model="selectedBug.authorizedBy" :options="userOptions" />
            </UFormGroup>
          </div>

          <div>
            <UFormGroup label="Resolve in Version" name="resolveVersion">
              <UInput id="resolveVersion" v-model="selectedBug.resolveVersion" />
            </UFormGroup>
          </div>

          <div class="col-span-2">
            <UFormGroup label="Status" name="status">
              <URadio v-model="selectedBug.status" :options="['Alive', 'Dead']" />
            </UFormGroup>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <div class="space-x-2">
            <UButton variant="outline" icon="i-heroicons-pencil" @click="designBug">Design</UButton>
            <UButton variant="outline" icon="i-heroicons-printer" @click="printBugDetails">Print</UButton>
          </div>

          <div class="space-x-2">
            <UButton icon="i-heroicons-plus" color="green" @click="addBug">Add</UButton>
            <UButton icon="i-heroicons-pencil-square" @click="modifyBug">Modify</UButton>
            <UButton icon="i-heroicons-x-mark" @click="clearBugDetails">Clear</UButton>
            <UButton icon="i-heroicons-trash" color="red" @click="deleteBug">Delete</UButton>
          </div>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
