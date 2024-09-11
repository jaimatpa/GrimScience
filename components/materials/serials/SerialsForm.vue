<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
    selectedSerial: {
        type: [String, Number, null],
    },
    isModal: {
        type: [Boolean],
    },
});

const toast = useToast();
const router = useRouter();

const ascIcon = "i-heroicons-bars-arrow-up-20-solid";
const descIcon = "i-heroicons-bars-arrow-down-20-solid";
const noneIcon = "i-heroicons-arrows-up-down-20-solid";

const serialsFormInstance = getCurrentInstance();

const loadingOverlay = ref(false);
const serialExist = ref(true);
const usstates = ref([]);

const productLines = ref([]);
let products = ref([]);
const categories = ref([]);
let subCategories = ref([]);
let parts = ref([]);
const jobs = ref([]);

const serialStatuses = ref<string[]>(["Ordered", "Scheduled", "In-Process", "Inventory", "Shipped", "Complaint", "Destroyed", "Lost"]);

const formData = reactive({
    UniqueID: null,
    instanceID: 0,
    productProductLine: null,
    productProduct: null,
    partCategory: null,
    partSubCategory: null,
    partPart: null,
    serialJob: null,
    serialDescription: null,
    serialSerial: null,
    serialStatus: null,
    serialQuantity: 1,
    serialInvoiceNumber: null,
    serialCustomer: null,
    bpid: null,
    OrderID: null,
    MasterInventoryID: null,
    assetflag: null,
});

const revHistGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "revDate",
            label: "Rev. Date",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "Status",
            label: "Status",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "Serial",
            label: "Serial",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "customerDetail",
            label: "Customer",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
        {
            key: "invoiceNumber",
            label: "Invoice #",
            sortable: false,
            sortDirection: "none",
            filterable: false,
        },
    ],
    page: 1,
    pageSize: 50,
    // numberOfCustomers: 0,
    serials: [],
    isLoading: false,
});

const customerGridMeta = ref({
    defaultColumns: <UTableColumn[]>[
        {
            key: "number",
            label: "Number",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "fname",
            label: "First",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "lname",
            label: "Last",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "company1",
            label: "Company",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "homephone",
            label: "HomePhone",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "workphone",
            label: "WorkPhone",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "state",
            label: "State",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
        {
            key: "zip",
            label: "Zip",
            sortable: true,
            sortDirection: "none",
            filterable: true,
        },
    ],
    page: 1,
    pageSize: 50,
    numberOfCustomers: 0,
    customers: [],
    selectedCustomerId: null,
    selectCustomer: null,
    sort: {
        column: "UniqueID",
        direction: "asc",
    },
    isLoading: false,
});

let customerFilterValues = ref({
    market: null,
    source: null,
    ParadynamixCatagory: null,
    SourceConfrence: null,
    number: null,
    fname: null,
    lname: null,
    company1: null,
    homephone: null,
    workphone: null,
    state: null,
    zip: null,
});

const selectedColumns = ref(customerGridMeta.value.defaultColumns);

const columns = computed(() => customerGridMeta.value.defaultColumns.filter((column) => selectedColumns.value.includes(column)));

const handlePageChange = async () => {
    getCustomers();
};

const handleSortingButton = async (btnName: string) => {
    customerGridMeta.value.page = 1;
    for (const column of columns.value) {
        if (column.sortable) {
            if (column.key === btnName) {
                switch (column.sortDirection) {
                    case "none":
                        column.sortDirection = "asc";
                        customerGridMeta.value.sort.column = btnName;
                        customerGridMeta.value.sort.direction = "asc";
                        break;
                    case "asc":
                        column.sortDirection = "desc";
                        customerGridMeta.value.sort.column = btnName;
                        customerGridMeta.value.sort.direction = "desc";
                        break;
                    default:
                        column.sortDirection = "none";
                        customerGridMeta.value.sort.column = "UniqueID";
                        customerGridMeta.value.sort.direction = "asc";
                        break;
                }
            } else {
                column.sortDirection = "none";
            }
        }
    }
    getCustomers();
};
const handleFilterInputChange = async (event, name) => {
    customerGridMeta.value.page = 1;
    if (customerFilterValues.value.hasOwnProperty(name)) {
        customerFilterValues.value[name] = event;
    } else {
        console.error(`Filter does not have property: ${name}`);
    }
    getCustomers();
};

const onSelect = async (row) => {
    customerGridMeta.value.selectedCustomerId = row?.UniqueID;

    customerGridMeta.value.customers.forEach((cus) => {
        if (cus.UniqueID === row.UniqueID) {
            cus.class = "bg-gray-200";
        } else {
            delete cus.class;
        }
    });
    formData.serialCustomer = row;

    onCustomerModalClose();
};

//Return to inventory action method

const onReturnToInventory = async () => {
    if (props.selectedSerial !== null) {

        const serialData = {
            Serial: formData.serialSerial,
            instanceID: formData.instanceID,
            BPID: formData.bpid,
            JobID: formData.serialJob,
            Qty: formData.serialQuantity
        };

        await useApiFetch(`/api/materials/serials/returntoinventory`, {
            method: "POST",
            params: serialData,
            onResponse({ response }) {
                if (response.status === 200) {
                    toast.add({
                        title: "Success",
                        description: response._data.message,
                        icon: "i-heroicons-check-circle",
                        color: "green",
                    });

                    emit("save");
                }
            },
            // onResponseError() {
                
            // },
        });
    }
};

const editInit = async () => {
    loadingOverlay.value = true;

    //Get Serial Detail

    await useApiFetch(`/api/materials/serials/${props.selectedSerial}`, {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                loadingOverlay.value = false;
                serialExist.value = true;

                const data = response._data.body;

                formData.UniqueID = data.uniqueid;
                formData.instanceID = parseInt(data.instanceID) || 0;
                formData.serialJob = data.JobID;
                formData.serialDescription = data.BP !== null || data.BP !== undefined ? `#${data.BP.model} ${data.BP.description}` : null;
                formData.serialSerial = data.Serial;
                formData.serialStatus = data.Status;
                formData.serialQuantity = data.Qty;
                formData.serialInvoiceNumber = data.InvoiceNumber;
                formData.serialCustomer = data.Customer;
                formData.OrderID = data.OrderID;
                formData.bpid = data.BP?.UniqueID;
                formData.MasterInventoryID = data.MasterInventoryID;
                formData.assetflag = data.assetflag;
            }
        },
        onResponseError({}) {
            serialExist.value = false;
        },
    });

    //Get Revision History Grid Data

    revHistGridMeta.value.serials = [];
    await useApiFetch(`/api/materials/serials/revhistories`, {
        method: "GET",
        params: { instanceID: formData.instanceID },
        onResponse({ response }) {
            if (response.status === 200) {
                revHistGridMeta.value.serials = response._data.body;
            }
        },
        onResponseError() {
            revHistGridMeta.value.serials = [];
        },
    });

    propertiesInit();
    loadingOverlay.value = false;
};
const propertiesInit = async () => {
    loadingOverlay.value = true;

    await useApiFetch("/api/materials/productlines", {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                productLines.value = response._data.body;
            }
        },
        onResponseError() {
            productLines.value = [];
        },
    });

    getProducts(formData.productProductLine);

    //Get Categories
    categories.value = [];
    await useApiFetch("/api/materials/categories", {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                categories.value = response._data.body;
            }
        },
        onResponseError() {
            categories.value = [];
        },
    });

    getSubCategories(formData.partCategory);

    //get jobs
    await useApiFetch("/api/materials/serials/jobs", {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                jobs.value = response._data.body;
            }
        },
        onResponseError() {
            jobs.value = [];
        },
    });

    await useApiFetch("/api/common/usstates", {
        method: "GET",
        onResponse({ response }) {
            if (response.status === 200) {
                usstates.value = response._data.body;
            }
        },
        onResponseError() {
            usstates.value = [
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
            ];
        },
    });
    loadingOverlay.value = false;
    console.log(serialExist.value);
};
const validate = (state: any): FormError[] => {
    const errors = [];
    // if (!state.fname) errors.push({ path: "fname", message: "Please enter your frist name." });
    // if (!state.lname) errors.push({ path: "lname", message: "Please enter a your last name." });
    // if (!state.email) errors.push({ path: "email", message: "Please enter an email." });
    if (!formData.serialSerial) errors.push({ path: "serial", message: "Please enter serial." });
    if (!formData.bpid) {
        errors.push({ path: "product", message: "Please select product or part to ensure BPID." });
        errors.push({ path: "part", message: "Please select product or part to ensure BPID." });
    }
    return errors;
};
const handleClose = async () => {
    if (serialsFormInstance?.vnode?.props.onClose) {
        emit("close");
    } else {
        router.go(-1);
    }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
    if (props.selectedSerial === null) {
        // Create Serial
        await useApiFetch("/api/materials/serials", {
            method: "POST",
            body: event.data,
            onResponse({ response }) {
                if (response.status === 200) {
                    toast.add({
                        title: "Success",
                        description: response._data.message,
                        icon: "i-heroicons-check-circle",
                        color: "green",
                    });
                }
            },
        });
    } else {
        // Update Serial

        const serialData = {
            Serial: formData.serialSerial,
            instanceID: formData.instanceID,
            BPID: formData.bpid,
            Status: formData.serialStatus,
            Customer: formData.serialCustomer?.UniqueID,
            OrderID: formData.OrderID,
            JobID: formData.serialJob,
            Qty: formData.serialQuantity,
            MasterInventoryID: formData.MasterInventoryID,
            assetflag: formData.assetflag
        };

        await useApiFetch(`/api/materials/serials`, {
            method: "PUT",
            params: serialData,
            onResponse({ response }) {
                if (response.status === 200) {
                    toast.add({
                        title: "Success",
                        description: response._data.message,
                        icon: "i-heroicons-check-circle",
                        color: "green",
                    });
                }
            },
        });
    }
    emit("save");
};

const getProducts = async (productLine: string) => {
    if (productLine === null || productLine === "") {
        products.value = [];
    } else {
        products.value = [];
        await useApiFetch(`/api/materials/serials/products`, {
            method: "GET",
            params: { productLine: productLine },
            onResponse({ response }) {
                if (response.status === 200) {
                    products.value = response._data.body;
                }
            },
            onResponseError() {
                products.value = [];
            },
        });
    }

};

const getSubCategories = async (category: string) => {
    if (category === null || category === "") {
        subCategories.value = [];
        parts.value = [];
    } else {
        subCategories.value = [];
        parts.value = [];
        await useApiFetch(`/api/materials/subcategories`, {
            method: "GET",
            params: { category: category },
            onResponse({ response }) {
                if (response.status === 200) {
                    subCategories.value = response._data.body;

                    getParts(formData.partCategory, formData.partSubCategory);
                }
            },
            onResponseError() {
                subCategories.value = [];
            },
        });
    }
};

const getParts = async (category: string, subCategory: string) => {
    if (category === null || subCategory === null || category === "" || subCategory === "") {
        parts.value = [];
    } else {
        parts.value = [];
        await useApiFetch(`/api/materials/distinctparts`, {
            method: "GET",
            params: { PARTTYPE: category, SUBCATEGORY: subCategory },
            onResponse({ response }) {
                if (response.status === 200) {
                    parts.value = response._data.body.map((obj: any) => ({
                        ...obj,
                        partDetail: `#${obj.MODEL} ${obj.DESCRIPTION}`,
                    }));
                }
            },
            onResponseError() {
                parts.value = [];
            },
        });
    }
};

const getCustomers = async () => {
    customerGridMeta.value.isLoading = true;
    await useApiFetch("/api/customers/numbers", {
        method: "GET",
        params: {
            ...customerFilterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                customerGridMeta.value.numberOfCustomers = response._data.body;
            }
        },
    });
    if (customerGridMeta.value.numberOfCustomers === 0) {
        customerGridMeta.value.customers = [];
        customerGridMeta.value.numberOfCustomers = 0;
        customerGridMeta.value.isLoading = false;
        return;
    }
    if (customerGridMeta.value.page * customerGridMeta.value.pageSize > customerGridMeta.value.numberOfCustomers) {
        customerGridMeta.value.page = Math.ceil(customerGridMeta.value.numberOfCustomers / customerGridMeta.value.pageSize) | 1;
    }
    await useApiFetch("/api/customers/", {
        method: "GET",
        params: {
            page: customerGridMeta.value.page,
            pageSize: customerGridMeta.value.pageSize,
            sortBy: customerGridMeta.value.sort.column,
            sortOrder: customerGridMeta.value.sort.direction,
            ...customerFilterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                customerGridMeta.value.customers = response._data.body;
            }
            customerGridMeta.value.isLoading = false;
        },
    });
};

const modalMeta = ref({
    isCustomerSelectModalOpen: false,
});

const onChangeCustomer = () => {
    // reset customer filter values
    customerFilterValues.value = {
        market: null,
        source: null,
        ParadynamixCatagory: null,
        SourceConfrence: null,
        number: null,
        fname: null,
        lname: null,
        company1: null,
        homephone: null,
        workphone: null,
        state: null,
        zip: null,
    };

    getCustomers();
    modalMeta.value.isCustomerSelectModalOpen = true;
};
const onCustomerModalClose = () => {
    // reset customer filter values
    customerFilterValues.value = {
        market: null,
        source: null,
        ParadynamixCatagory: null,
        SourceConfrence: null,
        number: null,
        fname: null,
        lname: null,
        company1: null,
        homephone: null,
        workphone: null,
        state: null,
        zip: null,
    };

    modalMeta.value.isCustomerSelectModalOpen = false;
};

if (props.selectedSerial !== null) editInit();
else propertiesInit();
</script>

<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533" loader="dots" />
    </div>
    <template v-if="!props.isModal && !serialExist">
        <CommonNotFound :name="'Customer not found'" :message="'The customer you are looking for does not exist'" :to="'/customers/customers/list'" />
    </template>
    <template v-else>
        <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
            <div class="flex flex-row">
                <div class="">Product</div>
            </div>
            <div class="flex flex-row space-x-3">
                <div class="basis-1/3">
                    <UFormGroup label="Product Line" name="productLine">
                        <UInputMenu
                            v-model="formData.productProductLine"
                            :nullable="true"
                            :options="productLines"
                            @change="getProducts(formData.productProductLine)" />
                    </UFormGroup>
                </div>
                <div class="basis-2/3">
                    <UFormGroup label="Product" name="product">
                        <UInputMenu
                            v-model="formData.productProduct"
                            :nullable="true"
                            option-attribute="productInfo"
                            :options="products"
                            @change="formData.bpid = formData.productProduct.UniqueID" />
                    </UFormGroup>
                </div>
            </div>

            <div class="flex flex-row">
                <div class="">Part</div>
            </div>

            <div class="flex flex-row space-x-3">
                <div class="basis-1/4">
                    <UFormGroup label="Category" name="category">
                        <UInputMenu
                            v-model="formData.partCategory"
                            :nullable="true"
                            :options="categories"
                            @change="getSubCategories(formData.partCategory)" />
                    </UFormGroup>
                </div>
                <div class="basis-1/4">
                    <UFormGroup label="Sub Category" name="subCategory">
                        <UInputMenu
                            v-model="formData.partSubCategory"
                            :nullable="true"
                            :options="subCategories"
                            @change="getParts(formData.partCategory, formData.partSubCategory)" />
                    </UFormGroup>
                </div>
                <div class="basis-2/4">
                    <UFormGroup label="Part" name="part">
                        <UInputMenu
                            v-model="formData.partPart"
                            option-attribute="partDetail"
                            @change="formData.bpid = formData.partPart.UniqueID"
                            :nullable="true"
                            :options="parts">
                            <!-- <template #option="{ option }">
                                <div class="flex flex-row space-x-2">
                                    <div class="">#{{ option.MODEL + " " + option.DESCRIPTION }}</div>
                                    
                                </div>
                            </template> -->
                        </UInputMenu>
                    </UFormGroup>
                </div>
            </div>

            <div class="flex flex-row">
                <div class="">Serial</div>
            </div>

            <div class="flex flex-row space-x-3">
                <div class="basis-full">
                    <div class="flex flex-col space-y-2">
                        <div class="flex flex-row space-x-3">
                            <div class="basis-1/4">
                                <UFormGroup label="Jobs" name="jobs">
                                    <UInputMenu
                                        :nullable="true"
                                        v-model="formData.serialJob"
                                        option-attribute="number"
                                        value-attribute="number"
                                        :options="jobs" />
                                </UFormGroup>
                            </div>
                            <div v-if="props.selectedSerial !== null" class="basis-3/4">
                                <UFormGroup label="Description" name="description">
                                    <div class="font-semibold">
                                        {{ formData.serialDescription }}
                                    </div>
                                </UFormGroup>
                            </div>
                        </div>

                        <div class="flex flex-row space-x-3">
                            <div class="basis-1/4">
                                <UFormGroup label="Serial" name="serial">
                                    <UInput type="number" v-model="formData.serialSerial" />
                                </UFormGroup>
                            </div>
                            <div class="basis-1/4">
                                <UFormGroup label="Status" name="status">
                                    <UInputMenu v-model="formData.serialStatus" :options="serialStatuses" />
                                </UFormGroup>
                            </div>
                            <div class="basis-1/4">
                                <UFormGroup label="Quantity To Add" name="qtyToAdd">
                                    <UInput v-model="formData.serialQuantity" type="number" />
                                </UFormGroup>
                            </div>
                            <div v-if="props.selectedSerial !== null" class="basis-1/4">
                                <UFormGroup label="Invoice #" name="invoiceNumber">
                                    <UInput disabled v-model="formData.serialInvoiceNumber" />
                                </UFormGroup>
                            </div>
                        </div>
                        <div class="flex flex-row space-x-3">
                            <div class="basis-2/3">
                                <UFormGroup label="Customer" name="customer">
                                    <div class="mr-3">
                                        {{
                                            formData.serialCustomer
                                                ? (formData.serialCustomer?.lname ?? "") +
                                                  " " +
                                                  (formData.serialCustomer?.fname ?? "") +
                                                  ". " +
                                                  (formData.serialCustomer?.company1 ?? "")
                                                : ""
                                        }}
                                    </div>
                                </UFormGroup>
                            </div>
                            <div class="basis-1/3">
                                <div class="mt-3">
                                    <UButton color="gray" variant="outline" label="Change Customer" @click="onChangeCustomer" />
                                    <UButton
                                        v-if="formData.serialCustomer !== null"
                                        class="mt-3"
                                        color="red"
                                        variant="outline"
                                        label="Remove Selected Customer"
                                        @click="formData.serialCustomer = null" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <template v-if="props.selectedSerial !== null">
                <div class="flex flex-row">
                    <div class="">Revision History</div>
                </div>

                <!-- Revision History Grid -->

                <div class="flex flex-row">
                    <div class="w-full">
                        <UTable
                            :columns="revHistGridMeta.defaultColumns"
                            :rows="revHistGridMeta.serials"
                            :ui="{
                                wrapper: 'h-56 border-2 border-gray-300 dark:border-gray-700',
                                th: {
                                    base: 'sticky top-0 z-10',
                                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                                    padding: 'p-1',
                                },
                            }" />
                    </div>
                </div>
            </template>

            <div class="flex justify-start gap-3 mt-3">
                <UButton
                    color="cyan"
                    variant="outline"
                    type="submit"
                    :icon="selectedSerial !== null ? 'i-heroicons-pencil-square' : 'i-heroicons-plus'"
                    :label="selectedSerial !== null ? 'Modify Serial' : 'Add Serial'" />

                <UButton v-if="selectedSerial !== null" label="Print Serial Tag" color="green" variant="outline" icon="i-heroicons-tag" />

                <UButton
                    v-if="selectedSerial !== null"
                    label="Return To Inventory"
                    color="purple"
                    variant="outline"
                    icon="i-heroicons-arrow-path"
                    @click="onReturnToInventory" />

                <UButton color="red" variant="outline" :label="!isModal ? 'Go back' : 'Cancel'" @click="handleClose" />
            </div>
        </UForm>

        <!-- Customer selection Modal -->
        <UDashboardModal
            v-model="modalMeta.isCustomerSelectModalOpen"
            title="Customers"
            :ui="{
                title: 'text-lg',
                header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
                body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
                width: 'w-[1800px] sm:max-w-9xl',
            }">
            <UTable
                :rows="customerGridMeta.customers"
                :columns="columns"
                :loading="customerGridMeta.isLoading"
                class="w-full"
                :ui="{
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-0',
                    },
                    td: {
                        padding: 'py-1',
                    },
                }"
                :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                }"
                @select="onSelect"
                @dblclick="onSelect">
                <template v-for="column in columns" v-slot:[`${column.key}-header`]>
                    <template v-if="column.kind !== 'actions'">
                        <div class="px-4 py-3.5">
                            <CommonSortAndInputFilter
                                @handle-sorting-button="handleSortingButton"
                                @handle-input-change="handleFilterInputChange"
                                :label="column.label"
                                :sortable="column.sortable"
                                :sort-key="column.key"
                                :sort-icon="column?.sortDirection === 'none' ? noneIcon : column?.sortDirection === 'asc' ? ascIcon : descIcon"
                                :filterable="column.filterable"
                                :filter-key="column.key" />
                        </div>
                    </template>
                </template>
            </UTable>
            <div class="flex flex-row justify-end mr-20 mt-1">
                <UPagination
                    :max="7"
                    :page-count="customerGridMeta.pageSize"
                    :total="customerGridMeta.numberOfCustomers | 0"
                    v-model="customerGridMeta.page"
                    @update:model-value="handlePageChange()" />
            </div>
        </UDashboardModal>
    </template>
</template>
