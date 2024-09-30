<template>
    <UCard>
        <template #header>
            <div class="flex flex-wrap justify-between">
                <h3 class="text-lg font-bold">Asset Management</h3>
                <UButton color="primary" variant="outline" icon="i-heroicons-plus-circle" @click="addNewAsset">
                    Add New Asset
                </UButton>
            </div>
        </template>
        <div class="space-y-4">
            <!-- Filters -->
            <div class="flex space-x-4">
                <UCheckbox v-model="showToolsOnly" label="Show Tools Only" />
                <UCheckbox v-model="showClientAssetsOnly" label="Show Client Assets Only" />
                <UCheckbox v-model="showLeithOwnedOnly" label="Show Leith Owned Only" />
                <UCheckbox v-model="hideSubAssets" label="Hide Sub Assets" />
                <UCheckbox v-model="hideRetired" label="Hide Retired" />
            </div>

            <!-- Search and filters -->
            <div class="grid grid-cols-3 gap-4">
                <UInput v-model="search" placeholder="Search" />
                <USelect v-model="category" :options="categoryOptions" placeholder="Category" />
                <USelect v-model="subCategory" :options="subCategoryOptions" placeholder="Sub Category" />
            </div>

            <!-- Part Information -->
            <UCard>
                <template #header>
                    <h4 class="font-semibold">Part Information</h4>
                </template>
                <div class="grid grid-cols-3 gap-4">
                    <USelect v-model="partCategory" :options="partCategoryOptions" label="Category" />
                    <USelect v-model="partSubCategory" :options="partSubCategoryOptions" label="Sub Category" />
                    <USelect v-model="part" :options="partOptions" label="Part" />
                </div>
            </UCard>

            <!-- Asset Serial Information -->
            <UCard>
                <template #header>
                    <h4 class="font-semibold">Asset Serial Information</h4>
                </template>
                <div class="grid grid-cols-2 gap-4">
                    <UInput v-model="pdxSerial" label="PDX Serial" />
                    <UInput v-model="manufacturingSerial" label="Manufacturing Serial #" />
                    <UInput v-model="inServiceDate" type="date" label="In-Service Date" />
                    <UInput v-model="boxPartCount" type="number" label="Box/Part Count" />
                    <USelect v-model="owner" :options="ownerOptions" label="Owner" />
                    <USelect v-model="location" :options="locationOptions" label="Location" />
                    <USelect v-model="subLocation" :options="subLocationOptions" label="Sub-Location" />
                </div>
                <div class="mt-4 flex justify-between">
                    <UButton @click="verifyCreateFolder">Verify / Create Folder</UButton>
                    <UButton @click="openPrintModal">Print Asset Tag</UButton>
                </div>
            </UCard>

            <!-- Asset Log Entry -->
            <UCard>
                <template #header>
                    <h4 class="font-semibold">Asset Log Entry</h4>
                </template>
                <div class="grid grid-cols-2 gap-4">
                    <USelect v-model="logBy" :options="logByOptions" label="By" />
                    <UInput v-model="changeDate" type="date" label="Change Date" />
                    <USelect v-model="status" :options="statusOptions" label="Status" />
                    <UInput v-model="retirementDate" type="date" label="Retirement Date" />
                    <UTextarea v-model="change" label="Change" />
                </div>
            </UCard>

            <!-- Asset Change Log -->
            <UCard class="mt-6">
                <template #header>
                    <div class="flex justify-between items-center">
                        <h4 class="text-lg font-semibold">Asset Change Log</h4>
                        <UButton color="primary" icon="i-heroicons-plus" @click="addChangeEntry">
                            Add Change Entry
                        </UButton>
                    </div>
                </template>
                <UTable :columns="logColumns" :rows="logRows"
                    :empty-state="{ icon: 'i-heroicons-document-text', label: 'No log entries found' }">
                    <template #empty-state="{ label, icon }">
                        <div class="flex flex-col items-center justify-center py-6 px-4 text-center">
                            <UIcon :name="icon" class="mb-2 h-8 w-8 text-gray-400" />
                            <p class="text-sm text-gray-500">{{ label }}</p>
                        </div>
                    </template>
                    <template #actions-data="{ row }">
                        <div class="flex space-x-2">
                            <UButton color="blue" icon="i-heroicons-pencil" size="sm" @click="modifyChangeEntry(row)">
                                Modify
                            </UButton>
                            <UButton color="red" icon="i-heroicons-trash" size="sm" @click="deleteLogEntry(row)">
                                Delete
                            </UButton>
                        </div>
                    </template>
                </UTable>

            </UCard>
        </div>
    </UCard>
    <UModal v-model="isPrintModalOpen">
        <UCard>
            <template #header>
                <h3 class="text-lg font-bold">Print Asset Tag</h3>
            </template>
            <div class="p-4">
                <UForm :state="printForm" @submit="handlePrintSubmit">
                    <UFormGroup label="Quantity" name="quantity">
                        <UInput v-model="printForm.quantity" type="number" min="1" placeholder="Enter quantity" />
                    </UFormGroup>
                    <div class="mt-4 flex justify-end space-x-2">
                        <UButton color="gray" @click="isPrintModalOpen = false">
                            Cancel
                        </UButton>
                        <UButton type="submit" color="primary">
                            Print
                        </UButton>
                    </div>
                </UForm>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang='ts'>
const showToolsOnly = ref(false)
const showClientAssetsOnly = ref(false)
const showLeithOwnedOnly = ref(false)
const hideSubAssets = ref(false)
const hideRetired = ref(true)

const search = ref('')
const category = ref(null)
const subCategory = ref(null)

const partCategory = ref('Office Supply')
const partSubCategory = ref('Clip/Staples')
const part = ref('#150207 Binder Clips Med.')

const pdxSerial = ref('150207001')
const manufacturingSerial = ref('')
const inServiceDate = ref('2024-08-30')
const boxPartCount = ref(null)
const owner = ref(null)
const location = ref('PDX Office')
const subLocation = ref('Inventory Shelf')

const logBy = ref('#41 Leith Stetson')
const changeDate = ref('2024-08-30')
const status = ref('Inventory')
const retirementDate = ref(null)
const change = ref('Put Into Service')

// Options for selects would be defined here
const categoryOptions = ref([])
const subCategoryOptions = ref([])
const partCategoryOptions = ref(['Office Supply'])
const partSubCategoryOptions = ref(['Clip/Staples'])
const partOptions = ref(['#150207 Binder Clips Med.'])
const ownerOptions = ref([])
const locationOptions = ref(['PDX Office'])
const subLocationOptions = ref(['Inventory Shelf'])
const logByOptions = ref(['#41 Leith Stetson'])
const statusOptions = ref(['Inventory'])

const logColumns = [
    { key: 'logDate', label: 'Log Date' },
    { key: 'status', label: 'Status' },
]

const logRows = ref([])

// Functions would be implemented here
const verifyCreateFolder = () => {
    // Implementation
}
const isPrintModalOpen = ref(false)
const printForm = reactive({
    quantity: 1
})

function openPrintModal() {
    isPrintModalOpen.value = true
}

const addNewAsset = () => {
    // Implementation
}

const addChangeEntry = () => {
    // Implementation
}

const modifyChangeEntry = () => {
    // Implementation
}

const deleteLogEntry = () => {
    // Implementation
}

const clearForm = () => {
    // Implementation
}
</script>