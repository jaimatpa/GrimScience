<template>
  <div class="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-4">Bugs</h1>
    
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-4">
        <UInput v-model="filters.id" placeholder="#" class="w-20" />
        <UInput v-model="filters.date" placeholder="Date" class="w-32" />
        <UInput v-model="filters.form" placeholder="Form" class="w-40" />
        <UInput v-model="filters.by" placeholder="By" class="w-40" />
        <UInput v-model="filters.description" placeholder="Description" class="w-60" />
      </div>
      <div class="flex items-center space-x-4">
        <UCheckbox v-model="openBugsOnly" label="Open Bugs Only" />
        <UButton icon="i-heroicons-printer" variant="soft" @click="printBugs">
          Print
        </UButton>
      </div>
    </div>
    
    <UTable :columns="columns" :rows="filteredBugs" @select="selectBug" :selected="selectedBugId" selectable>
      <template #id-data="{ row }">
        {{ row.id }}
      </template>
    </UTable>
    
    <div class="mt-6 p-4 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Bug Details</h2>
      <div class="grid grid-cols-2 gap-x-4 gap-y-6">
        <div>
          <label for="bugId" class="block text-sm font-medium text-gray-700 mb-1">Bug ID</label>
          <UInput id="bugId" v-model="selectedBug.id" />
        </div>

        <div>
          <label for="dateReported" class="block text-sm font-medium text-gray-700 mb-1">Date Reported</label>
          <UInput id="dateReported" v-model="selectedBug.date" type="date" />
        </div>

        <div>
          <label for="formReported" class="block text-sm font-medium text-gray-700 mb-1">Form Reported</label>
          <USelect id="formReported" v-model="selectedBug.form" :options="formOptions" />
        </div>

        <div>
          <label for="reportedBy" class="block text-sm font-medium text-gray-700 mb-1">By</label>
          <USelect id="reportedBy" v-model="selectedBug.by" :options="userOptions" />
        </div>

        <div class="col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <UInput id="description" v-model="selectedBug.description" />
        </div>

        <div class="col-span-2">
          <label for="details" class="block text-sm font-medium text-gray-700 mb-1">Details of Bug</label>
          <UTextarea id="details" v-model="selectedBug.details" rows="3" />
        </div>

        <div>
          <label for="bugType" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <USelect id="bugType" v-model="selectedBug.type" :options="typeOptions" />
        </div>

        <div>
          <label for="cost" class="block text-sm font-medium text-gray-700 mb-1">Cost</label>
          <UInput id="cost" v-model="selectedBug.cost" type="number" />
        </div>

        <div>
          <label for="authorizedBy" class="block text-sm font-medium text-gray-700 mb-1">Authorized By</label>
          <USelect id="authorizedBy" v-model="selectedBug.authorizedBy" :options="userOptions" />
        </div>

        <div>
          <label for="resolveVersion" class="block text-sm font-medium text-gray-700 mb-1">Resolve in Version</label>
          <UInput id="resolveVersion" v-model="selectedBug.resolveVersion" />
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <URadio v-model="selectedBug.status" :options="['Alive', 'Dead']" />
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

  </div>
</template>


<script setup>
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