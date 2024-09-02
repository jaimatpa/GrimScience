<template>
    <UCard>

        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">Details</h4>
                    </template>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-3">
                            <UFormGroup label="Po">
                                <UInput v-model="poNumber" :disabled="true" icon="i-heroicons-envelope" />
                            </UFormGroup>
                            <UFormGroup label="Date">
                                <UInput v-model="poDate" icon="i-heroicons-envelope" />
                            </UFormGroup>
                            <div class="mt-3">
                                <UCheckbox v-model="openclosed" label="Order Closed" />
                            </div>
                        </div>
                        <UFormGroup label="Ship To">
                            <UInputMenu v-model="shipTo" :options="shipToOptions" icon="i-heroicons-envelope" />
                        </UFormGroup>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h4 class="font-bold mb-2">Vendor Information</h4>
                        <p>{{ vendorName }}</p>
                        <p>{{ vendorAddress }}</p>
                        <p>{{ vendorCityStateZip }}</p>
                    </template>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <UFormGroup label="To">
                            <UInput v-model="irName" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="TEL">
                            <UInput v-model="irPhone" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="FAX">
                            <UInput v-model="irFax" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="EMAIL">
                            <UInput v-model="irEmail" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="WEBSITE">
                            <UInput v-model="website" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Date Required">
                            <UInput v-model="vendorDate" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Ship Via">
                            <UInput v-model="vendorShip" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="FOB">
                            <USelect v-model="vendorFob" :options="fobOptions" />
                        </UFormGroup>
                        <UFormGroup label="Terms">
                            <UInput v-model="vendorTerms" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Our Customer">
                            <UInput v-model="vendorCustomerNumber" icon="i-heroicons-envelope" />
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
                                <UButton icon="i-heroicons-trash" @click="deleteStock" color="red">
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
                <UTable :rows="suppliedParts" @select="(row) => {
                    addNewPoItemModal.isOpen = true;
                    addNewPoItemModal.data = row
                    formData.RECEIVED = 0;
                    formData.DESCRIPTION = row.DESCRIPTION;
                    formData.STOCKNUMBER = row.MODEL;
                    formData.PARTNUMBER = row.ALTER1MANNUM;
                    formData.UNITPRICE = row.ALTER1PRICE1;
                    formData.UNIT = row.UNIT;
                    formData.POUID = row.UniqueID;
                    formData.PTNUM = row.instanceID;
                    console.log(row.instanceID)
                }" :columns="partsCols" class="w-full" :ui="{
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
                <UTable :rows="orderDetails" :columns="detailsColumns" @select="row => setStockDetails(row)"
                    class="w-full" :ui="{
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
                <p>FREIGHT: $0.00</p>
                <p class="font-bold">TOTAL: {{ !isCreating ? modalData.TOTAL : 0 }}</p>
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
                <UButton>Preview Purchase</UButton>
                <UButton @click="openVendorInvoice">Receive Goods</UButton>
            </div>
        </template>
    </UCard>

    <UDashboardModal v-model="showVendorInvoice" title="Vendor Invoice" :ui="modalUIConfig">
        <VendorInvoice />
    </UDashboardModal>
    <UDashboardModal v-model="addNewPoItemModal.isOpen" title="Order PO Items" :ui="confirmationModalUIConfig">

        <div>
            <UFormGroup label="Enter Qty">
                <UInput v-model="formData.ORDERED" />
            </UFormGroup>
            <div class="flex gap-4 mt-4">
                <UButton @click="handleCreatePo">
                    Submit
                </UButton>
            </div>
        </div>
    </UDashboardModal>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VendorInvoice from './VendorInvoice.vue';
import { format } from 'date-fns';
const addNewPoItemModal = ref({
    isOpen: false,
    data: null
});
const shipToOptions = ref([
    "707 Gilman Avenue",
    "PO Box 2134",
    "2422 Waterford Rd.0"
])
const toast = useToast()

// const terms = ref('');
interface ModalData {
    UniqueID: string;
    PONUMBER: number;
    VENDORTERMS: string;
    VENDORDATE: string;
    VENDORFOB: string;
    VENDORSHIP: string;
    IREMAIL: string | null;
    IRFAX: string;
    IRPHONE: string;
    IRNAME: string;
    NAME: string;
    ADDESS: string;
    CITYSTATEZIP: string;
    VENDOR: string;
    TOTAL: string;
    VENDORCUSTOMERNUMBER: string;
    DATE: string;
    WEBSITE: string;
    SALESORDER: string;
    IREXT: string;
    RejectReason: string | null;
    OPENCLOSED: string;
    Notes: string;
    AuthorizedBy: string;
    Shipto: string | null;
}

const props = defineProps<{
    modalData?: ModalData;
    isCreating?: boolean;
    vendorDetails: any
}>();
const createFormData = reactive<ModalData>({
    ADDESS: '',
    AuthorizedBy: '',
    CITYSTATEZIP: '',
    DATE: format(new Date(), 'dd-MM-yyyy'),
    IRFAX: '',
    IRNAME: '',
    IRPHONE: '',
    NAME: '',
    IREMAIL: null,
    Notes: '',
    OPENCLOSED: '',
    PONUMBER: 0,
    RejectReason: null,
    SALESORDER: '',
    Shipto: null,
    TOTAL: '',
    UniqueID: '',
    VENDORTERMS: '',
    VENDORDATE: '',
    VENDORFOB: '',
    VENDORSHIP: '',
    VENDORCUSTOMERNUMBER: '',
    VENDOR: '',
    WEBSITE: '',
    IREXT: ''
});

const poNumber = computed({
    get: () => props.isCreating ? createFormData.PONUMBER : props.modalData.PONUMBER,
    set: (value) => props.isCreating ? createFormData.PONUMBER = value : props.modalData.PONUMBER = value
})

const poDate = computed({
    get: () => props.isCreating ? createFormData.DATE : props.modalData.DATE,
    set: (value) => props.isCreating ? createFormData.DATE = value : props.modalData.DATE = value
})

const poDateInputType = computed(() => {
    return props.modalData.DATE ? 'input' : 'date' || props.vendorDetails?.DATE ? 'input' : 'date'
})
const shipTo = computed({
    get: () => props.isCreating ? createFormData.Shipto : props.modalData.Shipto,
    set: (value) => props.isCreating ? createFormData.Shipto = value : props.modalData.Shipto = value
})

const vendorName = computed(() => props.isCreating ? createFormData.NAME : props.modalData.NAME)
const vendorAddress = computed(() => props.isCreating ? createFormData.ADDESS : props.modalData.ADDESS)
const vendorCityStateZip = computed(() => props.isCreating ? createFormData.CITYSTATEZIP : props.modalData.CITYSTATEZIP)

const irName = computed({
    get: () => props.isCreating ? createFormData.IRNAME : props.modalData.IRNAME,
    set: (value) => props.isCreating ? createFormData.IRNAME = value : props.modalData.IRNAME = value
})

const irPhone = computed({
    get: () => props.isCreating ? createFormData.IRPHONE : props.modalData.IRPHONE,
    set: (value) => props.isCreating ? createFormData.IRPHONE = value : props.modalData.IRPHONE = value
})

const irFax = computed({
    get: () => props.isCreating ? createFormData.IRFAX : props.modalData.IRFAX,
    set: (value) => props.isCreating ? createFormData.IRFAX = value : props.modalData.IRFAX = value
})

const irEmail = computed({
    get: () => props.isCreating ? createFormData.IREMAIL : props.modalData.IREMAIL,
    set: (value) => props.isCreating ? createFormData.IREMAIL = value : props.modalData.IREMAIL = value
})

const website = computed({
    get: () => props.isCreating ? createFormData.WEBSITE : props.modalData.WEBSITE,
    set: (value) => props.isCreating ? createFormData.WEBSITE = value : props.modalData.WEBSITE = value
})

const vendorDate = computed({
    get: () => props.isCreating ? createFormData.VENDORDATE : props.modalData.VENDORDATE,
    set: (value) => props.isCreating ? createFormData.VENDORDATE = value : props.modalData.VENDORDATE = value
})

const vendorShip = computed({
    get: () => props.isCreating ? createFormData.VENDORSHIP : props.modalData.VENDORSHIP,
    set: (value) => props.isCreating ? createFormData.VENDORSHIP = value : props.modalData.VENDORSHIP = value
})

const vendorFob = computed({
    get: () => props.isCreating ? createFormData.VENDORFOB : props.modalData.VENDORFOB,
    set: (value) => props.isCreating ? createFormData.VENDORFOB = value : props.modalData.VENDORFOB = value
})

const vendorCustomerNumber = computed({
    get: () => props.isCreating ? createFormData.VENDORCUSTOMERNUMBER : props.modalData.VENDORCUSTOMERNUMBER,
    set: (value) => props.isCreating ? createFormData.VENDORCUSTOMERNUMBER = value : props.modalData.VENDORCUSTOMERNUMBER = value
})

const salesOrder = computed({
    get: () => props.isCreating ? createFormData.SALESORDER : props.modalData.SALESORDER,
    set: (value) => props.isCreating ? createFormData.SALESORDER = value : props.modalData.SALESORDER = value
})
const notes = computed({
    get: () => props.isCreating ? createFormData.Notes : props.modalData.Notes,
    set: (value) => props.isCreating ? createFormData.SALESORDER = value : props.modalData.SALESORDER = value
})
const vendorTerms = computed({
    get: () => props.isCreating ? createFormData.VENDORTERMS : props.modalData.VENDORTERMS,
    set: (value) => props.isCreating ? createFormData.VENDORTERMS = value : props.modalData.VENDORTERMS = value
})
const openclosed = computed({
    get: () => props.isCreating ? createFormData.OPENCLOSED : props.modalData.OPENCLOSED,
    set: (value) => props.isCreating ? createFormData.OPENCLOSED = value : props.modalData.OPENCLOSED = value
})
const authorized = computed({
    get: () => props.isCreating ? createFormData.AuthorizedBy : props.modalData.AuthorizedBy,
    set: (value) => props.isCreating ? createFormData.AuthorizedBy = value : props.modalData.AuthorizedBy = value
})
const showVendorInvoice = ref(false)
const orderDetails = ref([])
const stockNumber = ref('000000');
const quantity = ref(0);
const price = ref(0);
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
const authorizedUsers = ref([
    "Joseph Grimm",
    'Esteal Hendricks',
    'John Lantz',
    'Douglas Wright'
]);
const suppliedParts = ref([]);
const isLoadingDetails = ref(false);
const formData = ref({
    ORDERED: 0,
    RECEIVED: 0,
    DESCRIPTION: '',
    STOCKNUMBER: '',
    PARTNUMBER: '',
    UNITPRICE: 0,
    UNIT: '',
    AMOUNT: 0,
    POUID: 0,
    PTNUM: 0
});
const partsCols = ref([{
    key: "PARTTYPE",
    label: "Cat."
}, {
    key: "SUBCATEGORY",
    label: "Sub Cat."
}, {
    key: "MODEL",
    label: "Stock #"
},
{
    key: "DESCRIPTION",
    label: "Description"
},
{
    key: "InventoryUnit",
    label: "Inventory Unit"
},
{
    key: 'OnHand',
    label: "On Hand"
}
]);

const detailsColumns = ref([
    {
        key: 'ORDERED',
        label: 'QTY'
    },
    {
        key: 'RECEIVED',
        label: 'Rec.',
    },
    {
        key: 'DESCRIPTION',
        label: 'Description',
    },
    {
        key: "STOCKNUMBER",
        label: "Stock #"
    },
    {
        key: 'PARTNUMBER',
        label: 'Part #',
    },
    {
        key: 'UNITPRICE',
        label: 'Price',
    },
    {
        key: 'UNIT',
        label: 'Unit',
    },
    {
        key: 'AMOUNT',
        label: 'Amount',
    },
    {
        key: 'INSPECTED',
        label: 'Insp.',
    },
    {
        key: 'IDTAG',
        label: 'ID Tag',
    },
]);
// console.log({ vendorDetails: props.vendorDetails })
const fetchVendorSuppliedParts = async () => {
    isLoadingDetails.value = true;
    try {
        await useApiFetch('/api/materials/vendors/vendorSuppliedParts', {
            method: 'GET',
            params: {
                search: props.modalData?.NAME || props.vendorDetails?.NAME,
            },
            onResponse({ response }) {
                if (response.status === 200) {
                    console.log({ response: response._data.body })
                    suppliedParts.value = response._data.body || [];
                }
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        isLoadingDetails.value = false;
    }
}
const fetchPOByInstanceId = async (UniqueID) => {
    if (props.isCreating) {
        orderDetails.value = [];
        return;
    }

    isLoadingDetails.value = true;
    try {
        await useApiFetch('/api/materials/vendors/getPOByUniqueId', {
            method: 'GET',
            params: { UniqueID },
            onResponse({ response }) {
                if (response.status === 200) {
                    orderDetails.value = response._data.body || [];
                }
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        isLoadingDetails.value = false;
    }
};
fetchVendorSuppliedParts();
watch(() => props.isCreating, (isCreating) => {
    if (!isCreating) {
        fetchPOByInstanceId(props.modalData.UniqueID);
    } else {
        console.log('need to fetch all PO', props.modalData)
    }
}, { immediate: true });



watch(orderDetails, (newOrderDetails) => {
    if (newOrderDetails.length > 0) {
        stockNumber.value = newOrderDetails[0].STOCKNUMBER || '000000';
        quantity.value = newOrderDetails[0].ORDERED || 0;
        price.value = newOrderDetails[0].UNITPRICE || 0;
    } else {
        stockNumber.value = '000000';
        quantity.value = 0;
        price.value = 0;
    }
});


watch(() => addNewPoItemModal.value.data, (newData) => {
    if (newData.ALTER1PRICE1 === "") {
        toast.add({
            title: "Error",
            description: "No Price Found",
            icon: 'i-heroicons-check-circle',
            color: 'red'
        })
        return addNewPoItemModal.value.isOpen = false
    }
    if (newData) {
        formData.value = {
            ORDERED: newData.ORDERED,
            RECEIVED: 0,
            DESCRIPTION: newData.DESCRIPTION,
            STOCKNUMBER: newData.MODEL,
            PARTNUMBER: newData.ALTER1MANNUM,
            UNITPRICE: newData.ALTER1PRICE1,
            UNIT: newData.UNIT,
            AMOUNT: 0,
            POUID: newData.UniqueID,
            PTNUM: newData.instanceID
        };
    }
});


const openVendorInvoice = () => {
    showVendorInvoice.value = true
}

const closeVendorInvoice = () => {
    showVendorInvoice.value = false
}
const setStockDetails = (row) => {
    console.log(row);
    stockNumber.value = row.STOCKNUMBER
    quantity.value = row.ORDERED
    price.value = row.UNITPRICE
}

const handleCreatePo = async () => {
    isLoadingDetails.value = true;
    const calculatedAmount = formData.value.UNITPRICE * formData.value.ORDERED;
    console.log({
        ...formData.value, AMOUNT: calculatedAmount
    })
    try {
        await useApiFetch('/api/materials/vendors/savePODetails', {
            method: 'POST',
            body: {
                ...formData.value, AMOUNT: calculatedAmount
            },
            onResponse({ response }) {
                if (response) {
                    console.log({ response: response._data.body })
                    orderDetails.value = response._data.body || [];
                }
            }
        });
        addNewPoItemModal.value.isOpen = false;
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        isLoadingDetails.value = false;
    }
};
const deleteStock = async () => {

    await useApiFetch('/api/materials/vendors/deleteStock', {
        method: 'DELETE',
        params: {
            STOCKNUMBER: stockNumber.value
        },
        onResponse({ response }) {
            if (response) {
                console.log({ response: response._data.body })
                toast.add({
                    title: "Error",
                    description: "Deleted Stock",
                    icon: 'i-heroicons-check-circle',
                    color: 'red'
                })
            }
        }
    });
}

(async function () {
    await useApiFetch('/api/materials/vendors/getvendor', {
        method: 'GET',
        params: {
            id: props.vendorDetails.UniqueID
        },
        onResponse({ response }) {
            if (response) {
                console.log(response._data.body)
                createFormData.NAME = response._data.body.NAME;
                createFormData.IREMAIL = response._data.body.IREMAIL;
                createFormData.IRPHONE = response._data.body.IRPHONE;
                createFormData.IRNAME = response._data.body.IRNAME;
                createFormData.IRFAX = response._data.body.IRFAX;
                createFormData.VENDORDATE = response._data.body.VENDORDATE;
                createFormData.ADDESS = response._data.body.ADDESS;
                createFormData.VENDORFOB = `${response._data.body.CITY} +" " + ${response._data.body.STATE}`;
                createFormData.AuthorizedBy = response._data.body.ApprovedBy;
                createFormData.WEBSITE = response._data.body.WEBSITE;
                createFormData.CITYSTATEZIP = `${response._data.body.CITY + " " + response._data.body.STATE + " " + response._data.body.ZIP}`;
            }
        }
    });
})();
const saveVendor = async function () {

}
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};
const confirmationModalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-96 sm:max-w-9xl',
};
</script>