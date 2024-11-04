<script setup lang="ts">
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import VendorInvoice from './VendorInvoice.vue';
import { format } from 'date-fns';
const qty1 = ref(0);
const qty2 = ref(0);
const qty3 = ref(0);
const qty4 = ref(0);
const qty5 = ref(0);

const price1 = ref(0);
const price2 = ref(0);
const price3 = ref(0);
const price4 = ref(0);
const price5 = ref(0);

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
    vendorDetails?: any
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
    isLoadingDetails.value = true;
    try {
        await useApiFetch('/api/materials/parts/getPOByUniqueId', {
            method: 'GET',
            params: { UniqueID },
            onResponse({ response }) {
                console.log(response)
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
await fetchPOByInstanceId(props.modalData.UniqueID);



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
    let orderedQuantity = parseFloat(formData.value.ORDERED);
    let unitPrice = parseFloat(formData.value.UNITPRICE);

    if (price5.value) {
        unitPrice = parseFloat(price5.value);
    } else if (price4.value) {
        unitPrice = parseFloat(price4.value);
    } else if (price3.value) {
        unitPrice = parseFloat(price3.value);
    } else if (price2.value) {
        unitPrice = parseFloat(price2.value);
    } else if (price1.value) {
        unitPrice = parseFloat(price1.value);
    }

    const calculatedAmount = unitPrice * orderedQuantity;
    formData.value.UNITPRICE = unitPrice;
    try {
        const response = await useApiFetch('/api/materials/vendors/savePODetails', {
            method: 'POST',
            body: {
                ...formData.value,
                AMOUNT: calculatedAmount,
                vendor: props.isCreating ? props.vendorDetails : null,
                VENDORDATE: vendorDate,
                Shipto: shipTo,
                OPENCLOSED: openclosed,
                SALESORDER: salesOrder,
                Notes: notes
            }
        });
        if (response) {
            addNewPoItemModal.value.isOpen = false;
        }
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
const handleSelectRow = (row) => {
    addNewPoItemModal.value.isOpen = true;
    addNewPoItemModal.value.data = row;

    formData.value.RECEIVED = 0;
    formData.value.DESCRIPTION = row.DESCRIPTION;
    formData.value.STOCKNUMBER = row.MODEL;
    formData.value.PARTNUMBER = row.ALTER1MANNUM;
    formData.value.UNIT = row.UNIT;
    formData.value.POUID = row.UniqueID;
    formData.value.PTNUM = row.instanceID;


    qty1.value = row.PRIMARY1QTY1 || row.ALTER1QTY1 || 0;
    qty2.value = row.PRIMARY2QTY2 || row.ALTER2QTY2 || 0;
    qty3.value = row.PRIMARY3QTY3 || row.ALTER3QTY3 || 0;
    qty4.value = row.PRIMARY4QTY4 || row.ALTER4QTY4 || 0;
    qty5.value = row.PRIMARY5QTY5 || row.ALTER5QTY5 || 0;

    price1.value = row.PRIMARYPRICE1 || row.ALTER1PRICE1 || 0;
    price2.value = row.PRIMARYPRICE2 || row.ALTER2PRICE2 || 0;
    price3.value = row.PRIMARYPRICE3 || row.ALTER3PRICE3 || 0;
    price4.value = row.PRIMARYPRICE4 || row.ALTER4PRICE4 || 0;
    price5.value = row.PRIMARYPRICE5 || row.ALTER5PRICE5 || 0;
    if (row.approvalstatus === "Not Used on Medical Devices" || row.approvalstatus === "Not Approved") {
        console.log("error: no approval status")
        toast.add({
            title: "Error",
            description: `Error. You are attempting to add an FDA medical device part from an unapproved vendor. Vendor's current status is: ${row.approvalstatus}`,
            icon: 'i-heroicons-check-circle',
            color: 'red'
        })
        return;
    }
};

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

<template>
    <div class="vl-parent">
        <loading v-model:active="isLoadingDetails" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
            loader="dots" />
    </div>
    <div class="flex flex-col gap-4 p-4 h-full bg-white">
        <div class="px-4 py-2 gmsBlueTitlebar">
            <h2>Purchase Lookup</h2>
        </div>
        <div class="grid grid-cols-11 gap-4  bg-white">
            <div class="col-span-2">
                <div class="px-4 py-2 gmsBlueTitlebar">
                    <h2>Details</h2>
                </div>
                <div class="bg-white shadow p-4">
                    <div class="flex flex-col gap-3">
                        <UFormGroup label="Po">
                            <UInput v-model="poNumber" :disabled="true" />
                        </UFormGroup>
                        <UFormGroup label="Date">
                            <UInput v-model="poDate" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <UFormGroup label="Ship To">
                            <UInputMenu v-model="shipTo" :options="shipToOptions" icon="i-heroicons-envelope" />
                        </UFormGroup>
                        <div class="mt-3">
                            <UCheckbox v-model="openclosed" label="Order Closed" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-4 ">
                <div class="px-4 py-2 gmsBlueTitlebar">
                    <h2>Vendor Information</h2>
                </div>
                <div class="p-4">
                    <p>{{ vendorName }}</p>
                    <p>{{ vendorAddress }}</p>
                    <p>{{ vendorCityStateZip }}</p>
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
                </div>
            </div>

            <!-- Parts On Order -->
            <div class="col-span-5 bg-white">
                <div class="px-4 py-2 gmsBlueTitlebar">
                    <h2>Parts On Order</h2>
                </div>

                <div class="grid grid-cols-2 gap-4 p-4 ">
                    <!-- Stock # -->
                    <div class="flex flex-col items-start gap-2">
                        <UCard>
                            <div class="flex gap-3 flex-1">
                                <label class="font-bold">Stock #</label>
                                <p>190021</p>
                                <UButton color="blue">Remove</UButton>
                            </div>

                        </UCard>
                        <UCard>
                            <div class="flex items-center justify-center flex-1">
                                <UButton color="blue">Non Conformance</UButton>
                            </div>
                        </UCard>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <label for="qty1">Qty:</label>
                            <input id="qty1" type="text" value="1"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex flex-col">
                            <label for="price1">Price:</label>
                            <input id="price1" type="text" value="5.94"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div class="flex flex-col">
                            <label for="qty2">Qty:</label>
                            <input id="qty2" type="text" value="25"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex flex-col">
                            <label for="price2">Price:</label>
                            <input id="price2" type="text" value="5.94"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div class="flex flex-col">
                            <label for="qty3">Qty:</label>
                            <input id="qty3" type="text" value="200"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex flex-col">
                            <label for="price3">Price:</label>
                            <input id="price3" type="text" value="4.31"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div class="flex flex-col">
                            <label for="qty4">Qty:</label>
                            <input id="qty4" type="text" value="50"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex flex-col">
                            <label for="price4">Price:</label>
                            <input id="price4" type="text" value="4.00"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div class="flex flex-col">
                            <label for="qty5">Qty:</label>
                            <input id="qty5" type="text" value="300"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex flex-col">
                            <label for="price5">Price:</label>
                            <input id="price5" type="text" value="3.50"
                                class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div class="flex gap-2 mt-2">
                            <UButton icon="i-heroicons-arrow-path" color="blue">Refresh</UButton>
                            <UButton icon="i-heroicons-arrow-path" color="blue" variant="outline">Update Pricing
                            </UButton>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="grid grid-cols-11 gap-4 overflow-hidden">
            <!-- Parts Lookup Table -->
            <div class="col-span-6">
                <div class="px-4 py-2 gmsBlueTitlebar">
                    <h2>Parts Lookup</h2>
                </div>
                <div class="overflow-auto h-[40vh] mt-2">
                    <UTable :rows="suppliedParts" @select="handleSelectRow" :loading="isLoadingDetails"
                        :columns="partsCols" class="w-full" :ui="{
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
                </div>
            </div>
            <div class="col-span-5">
                <div class="bg-white shadow p-4">
                    <ul class="flex border-b">
                        <li class="mr-4">
                            <button class="pb-2 px-4 text-blue-500 border-b-2 border-blue-500">Details</button>
                        </li>
                        <li>
                            <button class="pb-2 px-4 text-gray-500">Accounts</button>
                        </li>
                    </ul>
                    <div class="overflow-auto h-[40vh] mt-2">
                        <UTable :rows="orderDetails" :loading="isLoadingDetails" :columns="detailsColumns"
                            @select="row => setStockDetails(row)" class="w-full" :ui="{
                                divide: 'divide-gray-200 dark:divide-gray-800',
                                th: {
                                    base: 'sticky top-0 z-10',
                                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                                    padding: 'p-1'
                                },
                                td: {
                                    padding: 'p-1 border border-gray-200'
                                }
                            }" />
                    </div>
                </div>

                <div class="flex justify-between">
                    <div class="flex gap-4">
                        <div class="mt-4 flex gap-3 justify-end">
                            <UButton color="" icon="i-heroicons-clipboard-document-list" variant="outline">Save
                            </UButton>
                            <UButton icon="i-heroicons-eye" variant="outline">Preview Purchase</UButton>
                            <UButton icon="i-heroicons-eye" variant="outline" @click="openVendorInvoice">Receive Goods
                            </UButton>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex justify-between">
                            <span>Freight:</span>
                            <span>$0.00</span>
                        </div>
                        <div class="font-bold text-lg mt-2">
                            <span>Total:</span>
                            <span>$225.72</span>
                        </div>
                    </div>

                </div>
                <div class="flex flex-col bg-white shadow p-4">
                    <div class="flex flex-col">
                        <label for="notes">Notes</label>
                        <textarea id="notes"
                            class="border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="2">Electronics Inventory</textarea>
                    </div>
                    <div class="flex items-center ml-4">
                        <UFormGroup label="Authorized">
                            <USelect v-model="authorized" :options="authorizedUsers" />
                        </UFormGroup>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <UDashboardModal v-model="showVendorInvoice" title="Vendor Invoice" :ui="modalUIConfig">
        <VendorInvoice :ponum="modalData.UniqueID" />
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