<template>
    <UCard>

        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">Details</h4>
                    </template>
                    <div class="grid grid-cols-2 gap-2">
                        <UFormGroup label="Po">
                            <UInput v-model="po" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Date">
                            <UInput v-model="date" type="date" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Ship To">
                            <USelect v-model="shipTo" :options="shipToOptions" />
                        </UFormGroup>
                        <UFormGroup label="Order Closed">
                            <UInput v-model="orderClosed" type="date" icon="i-heroicons-envelope" />
                        </UFormGroup>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">Vendor Information</h4>
                        <p>{{ vendorName }}</p>
                        <p>{{ vendorAddress }}</p>
                        <p>{{ vendorCity }}</p>
                    </template>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <UFormGroup label="To">
                            <UInput v-model="vendorContact" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="TEL">
                            <UInput v-model="vendorTel" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="FAX">
                            <UInput v-model="vendorFax" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Date Required">
                            <UInput v-model="dateRequired" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Ship Via">
                            <UInput v-model="shipVia" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="FOB">
                            <USelect v-model="fob" :options="fobOptions" />
                        </UFormGroup>

                        <UFormGroup label="Terms">
                            <UInput v-model="terms" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Our Customer">
                            <UInput v-model="ourCustomer" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Sales Order #">
                            <UInput v-model="salesOrder" icon="i-heroicons-envelope" />
                        </UFormGroup>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">Parts On Order</h4>
                    </template>
                    <div class="h-full flex flex-col">
                        <div class="flex gap-2">
                            <div class="basis-4/5">
                                <UFormGroup label="Stock #">
                                    <UInput v-model="stockNumber" icon="i-heroicons-envelope" />
                                </UFormGroup>
                            </div>
                            <div class="basis-1/5 flex items-end justify-center">
                                <UButton icon="i-heroicons-trash" color="red">
                                    Remove
                                </UButton>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <UFormGroup label="Qty">
                                <UInput v-model="quantity" icon="i-heroicons-envelope" />
                            </UFormGroup>
                            <UFormGroup label="Price">
                                <UInput v-model="price" icon="i-heroicons-envelope" />
                            </UFormGroup>
                        </div>
                    </div>
                    <template #footer>
                        <div class="flex justify-end gap-2 mt-2">
                            <UButton icon="i-heroicons-arrow-path" color="blue">Refresh</UButton>
                            <UButton icon="i-heroicons-arrow-path" color="green" variant="outline">Update Pricing
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </div>

            <UCard>
                <UTable :rows="parts" class="w-full" :ui="{
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-1'
                    },
                    td: {
                        padding: 'p-1'
                    }
                }" />
            </UCard>
            <UCard>
                <UTable :rows="orderDetails" class="w-full" :ui="{
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-1'
                    },
                    td: {
                        padding: 'p-1'
                    }
                }" />

            </UCard>

            <div class="mt-4 text-right">
                <p>FREIGHT: ${{ freight.toFixed(2) }}</p>
                <p class="font-bold">TOTAL: ${{ total.toFixed(2) }}</p>
            </div>

            <UCard>
                <template #header>
                    <h4 class="font-bold mb-2">Notes</h4>
                </template>
                <UTextarea v-model="notes" rows="3"></UTextarea>
            </UCard>
            <UFormGroup label="Authorized">
                <USelect v-model="authorized" :options="authorizedUsers" />
            </UFormGroup>

        </div>
        <template #footer>
            <div class="mt-4 flex gap-3 justify-end">
                <UButton>Save</UButton>
                <UButton>Preview Purchase</UButton>
                <UButton @click="openVendorInvoice">Receive Goods</UButton>
            </div>
        </template>
    </UCard>

    <!-- <VendorInvoiceModal v-if="showVendorInvoice" @close="closeVendorInvoice" /> -->
    <UDashboardModal v-model="showVendorInvoice" title="Vendor Invoice" :ui="modalUIConfig">
        <VendorInvoice />
    </UDashboardModal>

</template>

<script setup>
import { ref, computed } from 'vue'
import VendorInvoice from './VendorInvoice.vue';

// Data
const po = ref('9052')
const date = ref('2019-10-22')
const shipTo = ref('')
const orderClosed = ref(false)

const vendorName = ref('Ace Lock Safe Security')
const vendorAddress = ref('130 Second Street')
const vendorCity = ref('Marietta, OH 45750')
const vendorContact = ref('Rob Wigal')
const vendorTel = ref('(740) 373-1224')
const vendorFax = ref('(740) 373-3327')
const dateRequired = ref('ASAP')
const shipVia = ref('')
const fob = ref('Marietta, OH')
const terms = ref('')
const ourCustomer = ref('')
const salesOrder = ref('')

const stockNumber = ref('400415')
const quantity = ref(1)
const price = ref(15.00)
const fobOptions = [
    'Marietta, OH',
    'Chicago, IL',
    'Los Angeles, CA',
    'New York, NY',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'Austin, TX',
    'Columbus, OH',
    'Fort Worth, TX',
    'Jacksonville, FL',
    'Charlotte, NC',
    'Indianapolis, IN',
    'San Francisco, CA',
    'Seattle, WA',
    'Denver, CO',
    'Washington, D.C.'
];
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
const authorizedUsers = [
    'Joseph Grimm',
    'Anna Smith',
    'Michael Johnson',
    'Emily Davis',
    'David Brown',
    'Laura Wilson',
    'James Taylor',
    'Sophia Anderson',
    'Robert Thomas',
    'Olivia Martinez'
];

const parts = ref([
    {
        category: 'Factory',
        subCategory: 'Security &',
        stock: '400414',
        description: 'Rekey',
        inventoryUnit: 'Each',
        order: 'Each',
        required: 0,
        onOrder: 0,
        onHand: 0
    },
    {
        category: 'Factory',
        subCategory: 'Security &',
        stock: '400415', description: 'Half Hour Labor', inventoryUnit: 'Each', order: 'Day', required: 0, onOrder: 0, onHand: 0
    },
    {
        category: 'Factory',
        subCategory: 'Security &',
        stock: '400416',
        description: 'Service Call',
        inventoryUnit: 'Each',
        order: 'Each',
        required: 0,
        onOrder: 0,
        onHand: 4
    },
    {
        category: 'Factory',
        subCategory: 'Security &',
        stock: '400417',
        description: 'General Clutch Lever Lock',
        inventoryUnit: 'Each',
        order: 'Each',
        required: 0,
        onOrder: 0,
        onHand: 2
    },
])

const orderDetails = ref([
    { quantity: 2, received: '', stock: '400415', part: '', description: 'Half Hour Labor', price: 15.00, unit: 'Day', amount: 30.00, inspection: '', idTag: '' },
    { quantity: 2, received: '', stock: '400416', part: '', description: 'Service Call', price: 40.00, unit: 'Each', amount: 80.00, inspection: '', idTag: '' },
    { quantity: 1, received: '', stock: '400417', part: '', description: 'General Clutch Lever Lock', price: 118.00, unit: 'Each', amount: 118.00, inspection: '', idTag: '' },
])

const freight = ref(0)
const total = computed(() => {
    return orderDetails.value.reduce((sum, item) => sum + item.amount, 0) + freight.value
})

const notes = ref('707 Gillman Ave. Locks keyed alike')
const authorized = ref('Joseph Grimm')
const showVendorInvoice = ref(false)

const openVendorInvoice = () => {
    showVendorInvoice.value = true
}

const closeVendorInvoice = () => {
    showVendorInvoice.value = false
}
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};
</script>