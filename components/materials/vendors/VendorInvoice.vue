<!-- VendorInvoiceModal.vue -->
<template>
    <UCard>

        <div class="grid grid-cols-2 gap-4">
            <UCard>
                <template #header>
                    <h4 class="font-bold mb-2">Details</h4>
                </template>
                <UTable :rows="rows" :columns="columns" :loading="isLoading"
                    :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" :ui="uiConfig"
                    @select="handleRowSelect" />
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
                            Update Pricing</UButton>
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
                            <!-- <UButton @click="syncToQB" color="green" variant="outline" class="mr-2">Sync To QB</UButton>
                            <UButton @click="createAsset" color="teal" variant="outline" class="mr-2">Create Asset
                            </UButton> -->
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
                            <UInput v-model="formData.invoiceNumber" />
                        </UFormGroup>

                        <UFormGroup label="Terms:">
                            <UInput v-model="formData.terms" />
                        </UFormGroup>

                        <UFormGroup label="Discount:">
                            <UInput v-model="formData.discount" />
                        </UFormGroup>
                        <UFormGroup label="Date Received:">
                            <UInput type="date"
                                :value="formData.Received ? new Date(formData.Received).toISOString().substr(0, 10) : ''"
                                @input="event => formData.Received = event.target.value" />
                        </UFormGroup>


                        <UFormGroup label="Entered By:">
                            <USelectMenu v-model="formData.Employee" :options="enteredByOptions" />
                        </UFormGroup>

                        <div class="flex gap-2">
                            <!-- <div class="basis-1.5/3"> -->

                            <UFormGroup label="Sub Total:">
                                <UInput v-model="formData.subtotal" readonly />
                            </UFormGroup>
                            <!-- </div> -->
                            <!-- <div class="basis-1.5/3"> -->
                            <UFormGroup label="QB Acct:">
                                <USelect v-model="formData.qbAcct" :options="qbAcctOptions" />
                            </UFormGroup>
                            <!-- </div> -->
                        </div>

                        <UFormGroup label="Tax:">
                            <UInput v-model="formData.taxamt" />
                        </UFormGroup>

                        <UFormGroup label="Freight:">
                            <UInput v-model="formData.freightAmt" />
                        </UFormGroup>

                        <UFormGroup label="Other:">
                            <UInput v-model="formData.Other" />
                        </UFormGroup>

                        <UFormGroup label="Total:">
                            <UInput v-model="formData.invoicetotal" readonly />
                        </UFormGroup>

                        <UFormGroup label="Due Date:">
                            <UInput type="date" :value="formatDate(formData.duedate)"
                                @input="event => formData.duedate = event.target.value" />
                        </UFormGroup>


                        <UFormGroup label="Amount Due:">
                            <UInput v-model="formData.invoicetotal" readonly />
                        </UFormGroup>

                    </div>

                </UCard>
            </div>

        </div>

        <div class="mt-4">
            <label>
                <input type="checkbox" v-model="formData.overrideReceiving"> Override Receiving (Ignore Received)
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
const props = defineProps({
    ponum: {
        type: String,
        required: true
    }
});
const toast = useToast();

const formData = ref({
    uniqueid: 0,
    dateStamp: '',
    PONum: '',
    discount: '',
    terms: '',
    Other: '',
    Employee: '',
    subtotal: '',
    invoicetotal: '',
    freightAmt: '',
    taxamt: '',
    invoiceNumber: '',
    Received: '',
    vOpenClosed: null,
    checknumber: null,
    duedate: '',
    checkdate: null,
    CheckID: null
});

function formatDate(dateString) {
    if (!dateString) return '';

    // Extract the date part by splitting on space
    const datePart = dateString.split(' ')[0]; // Get "8/21/2017"
    const [month, day, year] = datePart.split('/');

    // Format and return the date in YYYY-MM-DD format
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}



const poColumns = [
    { key: 'ORDERED', label: 'Qty.' },
    { key: 'RECEIVED', label: 'Total Rec.' },
    { key: 'STOCKNUMBER', label: 'Stock #' },
    { key: 'PARTNUMBER', label: 'Part #' },
    { key: 'InspectionLevel', label: 'Insp.' },
    { key: 'DESCRIPTION', label: 'Description' },
    { key: 'UNITPRICE', label: 'Price' },
    { key: 'UNIT', label: 'Unit' },
    { key: 'AMOUNT', label: 'Amount' },
]
const poRows = ref([]);
const refresh = () => {
    init();
}

const updatePricing = () => {
    init();
}

const recalcAllReceivings = () => {
}

const save = () => {
    useApiFetch(`/api/materials/vendors/invoice?vin=${formData.value.uniqueid}`, {
        method: 'PUT',
        data: formData.value,
        onResponse({ response }) {
            console.log(response);
             toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle-solid",
          color: "green",
        });
        }
    })
}

const deleteInvoice = () => {
    useApiFetch(`/api/materials/vendors/invoice?vin=${formData.value.uniqueid}`, {
        method: 'DELETE',
        onResponse({ response }) {
            console.log(response);
             toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-trash-solid",
          color: "green",
        });
        }
    })
}


const emit = defineEmits(['close']);
const columns = [
    {
        key: 'invoiceNumber',
        label: 'Invoice #'
    },
    {
        key: 'Received',
        label: 'Invoice Date'
    },
    {
        key: 'invoicetotal',
        label: 'Amount'
    },
    {
        key: 'Employee',
        label: 'Received By'
    }
];

const rows = ref([]);
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
const enteredByOptions = ['Peggy Grimm', 'Esteal Hendricks', ""]
const qbAcctOptions = ['Account 1', 'Account 2']
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};
async function init() {
    useApiFetch(`/api/materials/vendors/invoice?ponum=${props.ponum}`, {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                console.log(response._data.body)
                rows.value = response._data.body.rows
                poRows.value = response._data.body.poDetails
            }
        }
    })

}
init();
const handleRowSelect = (row) => {
    console.log(row)
    Object.keys(row).forEach((key) => {
        if (formData.value.hasOwnProperty(key)) {
            formData.value[key] = row[key];
        }
    });
}
</script>