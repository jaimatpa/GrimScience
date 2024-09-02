<!-- VendorInvoiceModal.vue -->
<template>
    <UCard>

        <div class="grid grid-cols-2 gap-4">
            <!-- Vendor Invoice Record -->
            <UCard>
                <template #header>
                    <h4 class="font-bold mb-2">Details</h4>
                </template>
                <UTable :ui="uiConfig" :rows="rows" :columns="columns" />
            </UCard>
            <UCard>
                <template #header>
                    <h4 class="font-bold mb-2">Vendor Invoice Record</h4>
                </template>
                <div>
                    <UFormGroup label="Qty">
                        <UInput v-model="quantity" icon="i-heroicons-envelope" />
                    </UFormGroup>
                    <UFormGroup label="Price">
                        <UInput v-model="price" icon="i-heroicons-envelope" />
                    </UFormGroup>
                </div>
                <template #footer>
                    <div class="flex gap-2 justify-end">

                        <UButton @click="refresh" variant="outline" color="green" icon="i-heroicons-arrow-path">Refresh
                        </UButton>
                        <UButton @click="updatePricing" variant="outline" icon="i-heroicons-arrow-path" color="teal">
                            Update
                            Pricing</UButton>
                    </div>

                </template>
            </UCard>

            <div class="col-span-2">
                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">PO #</h4>
                    </template>
                    <UTable :ui="uiConfig" :rows="poRows" :columns="poColumns" />
                    <template #footer>
                        <div>
                            <UButton @click="syncToQB" color="green" variant="outline" class="mr-2">Sync To QB</UButton>
                            <UButton @click="createAsset" color="teal" variant="outline" class="mr-2">Create Asset
                            </UButton>
                            <UButton @click="recalcAllReceivings" variant="outline" color="blue">Recalc All Receivings
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </div>
            <!-- Payable -->
            <div class="col-span-2">
                <UCard>

                    <template #header>
                        <h4 class="font-bold mb-2">Payable</h4>

                    </template>
                    <div class="grid grid-cols-3 gap-2">
                        <UFormGroup label="Invoice #:">
                            <UInput v-model="invoiceNumber" />
                        </UFormGroup>

                        <UFormGroup label="Invoice Date:">
                            <UInput v-model="invoiceDate" type="date" />
                        </UFormGroup>

                        <UFormGroup label="Terms:">
                            <UInput v-model="terms" />
                        </UFormGroup>

                        <UFormGroup label="Discount:">
                            <UInput v-model="discount" />
                        </UFormGroup>

                        <UFormGroup label="Date Received:">
                            <UInput v-model="dateReceived" type="date" />
                        </UFormGroup>

                        <UFormGroup label="Entered By:">
                            <USelect v-model="enteredBy" :options="enteredByOptions" />
                        </UFormGroup>

                        <UFormGroup label="Sub Total:">
                            <div class="flex gap-2">
                                <div class="basis-2/3">
                                    <USelect v-model="qbAcct" :options="qbAcctOptions" />
                                </div>
                                <UInput v-model="subTotal" readonly />
                            </div>
                        </UFormGroup>

                        <UFormGroup label="Tax:">
                            <UInput v-model="tax" />
                        </UFormGroup>

                        <UFormGroup label="Freight:">
                            <UInput v-model="freight" />
                        </UFormGroup>

                        <UFormGroup label="Other:">
                            <UInput v-model="other" />
                        </UFormGroup>

                        <UFormGroup label="Total:">
                            <UInput v-model="total" readonly />
                        </UFormGroup>

                        <UFormGroup label="Due Date:">
                            <UInput v-model="dueDate" type="date" />
                        </UFormGroup>

                        <UFormGroup label="Amount Due:">
                            <div class="flex gap-2">
                                <div class="basis-2/3">
                                    <USelect v-model="techOption" :options="techOptions" />
                                </div>
                                <UInput v-model="amountDue" readonly />
                            </div>
                        </UFormGroup>

                        <UFormGroup label="Price">
                            <UInput v-model="price" icon="i-heroicons-envelope" />
                        </UFormGroup>

                        <UFormGroup label="Ship To">
                            <USelect v-model="shipTo" :options="shipToOptions" />
                        </UFormGroup>
                    </div>
                </UCard>
            </div>

        </div>

        <div class="mt-4">
            <label>
                <input type="checkbox" v-model="overrideReceiving"> Override Receiving (Ignore Received)
            </label>
        </div>

        <div class="mt-4 flex justify-between">

            <div>
                <!-- <UButton @click="viewPO" color="blue" class="mr-2">View PO</UButton> -->
                <UButton @click="save" color="gms-blue" class="mr-2">Save</UButton>
                <UButton @click="deleteInvoice" variant="outline" color="red">Delete</UButton>
            </div>
        </div>
    </UCard>
    <UDashboardModal v-model="showCreateAssetModal" title="Create Asset" :ui="modalUIConfig">
        <CreateAssets />
    </UDashboardModal>
</template>

<script setup>
import { ref } from 'vue';
import CreateAssets from './CreateAssets.vue';
const showCreateAssetModal = ref(false);

const quantity = ref(1)
const price = ref(326.95000)
const invoiceNumber = ref('')
const invoiceDate = ref('2024-08-19')
const terms = ref('')
const discount = ref('')
const dateReceived = ref('2024-08-19')
const enteredBy = ref('')
const subTotal = ref('0.00')
const qbAcct = ref('')
const tax = ref('')
const freight = ref('')
const other = ref('')
const total = ref('0.00')
const dueDate = ref('2024-08-19')
const amountDue = ref('0.00')
const techOption = ref('3B Tech')
const overrideReceiving = ref(false)
const poColumns = [
    { key: 'quantity', label: 'Qty.' },
    { key: 'received', label: 'Rec.' },
    { key: 'totalReceived', label: 'Total R...' },
    { key: 'stockNumber', label: 'Stock #' },
    { key: 'partNumber', label: 'Part #' },
    { key: 'inspection', label: 'Insp.' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'unit', label: 'Unit' },
    { key: 'amount', label: 'Amount' },
    { key: 'inspectionDetails', label: 'Inspec...' }
]
const poRows = [
    {
        quantity: 1,
        received: 1,
        totalReceived: '030603',
        stockNumber: '5466771',
        partNumber: '0',
        inspection: 'Personal Computer',
        description: '326.9',
        price: 0,
        unit: '0.00',
        amount: '',
        inspectionDetails: ''
    }
]
const refresh = () => {
    // Implement refresh logic
}

const updatePricing = () => {
    // Implement update pricing logic
}

const syncToQB = () => {
    // Implement sync to QB logic
}

const createAsset = () => {
    // Implement create asset logic
    showCreateAssetModal.value = true
}

const recalcAllReceivings = () => {
    // Implement recalc all receivings logic
}

const viewPO = () => {
    // Implement view PO logic
}

const save = () => {
    // Implement save logic
}

const deleteInvoice = () => {
    // Implement delete logic
}

const close = () => {
    // Emit an event to close the modal
    emit('close')
}

const emit = defineEmits(['close']);
const columns = [
    {
        key: 'invoiceNumber',
        label: 'Invoice #'
    },
    {
        key: 'invoiceDate',
        label: 'Invoice Date'
    },
    {
        key: 'amount',
        label: 'Amount'
    },
    {
        key: 'receivedBy',
        label: 'Received By'
    }
];

const rows = [
    { invoiceNumber: 'INV-001', invoiceDate: '2024-08-01', amount: 1500.00, receivedBy: 'John Doe' },
    { invoiceNumber: 'INV-002', invoiceDate: '2024-08-05', amount: 2300.00, receivedBy: 'Jane Smith' },
    { invoiceNumber: 'INV-003', invoiceDate: '2024-08-10', amount: 980.00, receivedBy: 'Michael Johnson' },
    { invoiceNumber: 'INV-004', invoiceDate: '2024-08-15', amount: 1250.00, receivedBy: 'Emily Davis' }
];
const uiConfig = {
    divide: 'divide-gray-200 dark:divide-gray-800',
    th: {
        base: 'sticky top-0 z-10',
        color: 'bg-white dark:text-gray dark:bg-[#111827]',
        padding: 'p-1'
    },
    td: {
        padding: 'p-1'
    }
}
const enteredByOptions = ['Option 1', 'Option 2']
const qbAcctOptions = ['Account 1', 'Account 2']
const techOptions = ['3B Tech', "3B Tech Info"]
const shipToOptions = [
    'Atlanta, GA',
    'Boston, MA',
    'Miami, FL',
    'Nashville, TN',
    'Orlando, FL',
    'Portland, OR',
    'San Jose, CA',
    'Las Vegas, NV',
    'Baltimore, MD',
    'Milwaukee, WI',
    'Cleveland, OH',
    'Kansas City, MO',
    'Omaha, NE',
    'New Orleans, LA',
    'Minneapolis, MN',
    'Salt Lake City, UT',
    'Raleigh, NC',
    'Richmond, VA',
    'Louisville, KY',
    'Buffalo, NY'
];
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};
</script>