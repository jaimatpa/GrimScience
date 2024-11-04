<script lang="ts" setup>
import type { UTableColumn } from '~/types';

const toast = useToast();
const emit = defineEmits(['update']);
const packageName = ref('');
const packageContents = ref<{ content: string, MODEL: number }[]>([]);
const gridMeta = ref({
    defaultColumns: <UTableColumn[]>[{
        key: "PRODUCTLINE",
        label: "Product Line"
    }, {
        key: "MODEL",
        label: "Number"
    }, {
        key: "DESCRIPTION",
        label: "Description"
    }],
    products: [],
    productLines: [],
    categories: [],
    subCategories: [],
    selectedPart: null,
    selectedContent: null,
    packages: [],
    isLoading: false,
    isLoadingRates: false,
    isLoadingContent: false,
    isLoadingPackages: false,
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
    sort: {
        column: "UniqueID",
        direction: "asc",
    },
});
const formData = ref({
    name: "",
    productsOnOrder: [],
    instanceId: null,
    shippingRateId: null,
    rates: {}
});


const rateTypes = ['UPG', 'UP2', 'UPN', 'PM', 'SM'];
const rateRows = ref({
    UPG: Array(8).fill('0.00'),
    UP2: Array(8).fill('0.00'),
    UPN: Array(8).fill('0.00'),
    PM: Array(8).fill('0.00'),
    SM: Array(8).fill('0.00')
});
const filterValues = ref({
    PRODUCTLINE: '',
    PARTTYPE: '',
    SUBCATEGORY: ''
});
const fetchGridData = async () => {
    gridMeta.value.isLoading = true;
    await useApiFetch('/api/products/productline', {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                gridMeta.value.productLines = response._data.body;
            }
        },
        onResponseError() {
            gridMeta.value.productLines = []
        }
    })
    await useApiFetch('/api/materials/parts/categoryList', {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                gridMeta.value.categories = response._data.body;
            }
        },
        onResponseError() {
            gridMeta.value.categories = []
        }
    });

    gridMeta.value.isLoading = false;
};
async function fetchContents(instanceId) {
    gridMeta.value.isLoadingContent = true;
    await useApiFetch(`/api/utilities/shipping/contents?instanceId=${instanceId}`, {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                packageContents.value = response._data.body.map(c => ({ content: `#${c.MODEL} ${c.DESCRIPTION}`, MODEL: c.MODEL }));
                formData.value.productsOnOrder = response._data.body.map(c => ({ id: c.UniqueID }));
            }
        },
        onResponseError() {
            packageContents.value = []
        }
    });
    gridMeta.value.isLoadingContent = false;
};
onMounted(async () => {
    await fetchGridData();
    await fetchRates();
});

async function fetchProducts() {
    gridMeta.value.isLoading = true;
    await useApiFetch('/api/utilities/shipping/products', {
        method: 'GET',
        params: {
            page: gridMeta.value.page,
            pageSize: gridMeta.value.pageSize,
            sortBy: gridMeta.value.sort.column,
            sortOrder: gridMeta.value.sort.direction,
            ...filterValues.value,
        },
        onResponse({ response }) {
            if (response.status === 200) {
                const { products, pagination } = response._data.body;
                gridMeta.value.products = products;
                gridMeta.value.total = pagination.total;
                gridMeta.value.totalPages = pagination.totalPages;

            }
            gridMeta.value.isLoading = false;
        }
    });
}
const columns = ref([{
    key: "content",
    label: 'Contents'
}]);

const handleDblClick = () => {
    packageContents.value.push({
        content: `#${gridMeta.value.selectedPart.MODEL} - ${gridMeta.value.selectedPart.DESCRIPTION}`
    });
    const newProduct = { id: gridMeta.value.selectedPart.UniqueID };

    const exists = formData.value.productsOnOrder.some(product => product.id === newProduct.id);

    if (!exists) {
        formData.value.productsOnOrder.push(newProduct);
    }
};

async function fetchRates() {
    gridMeta.value.isLoadingRates = true;
    try {
        await useApiFetch('/api/utilities/shipping/rates', {
            method: 'GET',
            onResponse({ response }) {
                if (response._data.body) {
                    gridMeta.value.packages = response._data.body;
                }
            }
        });
    } catch (error) {
        console.error('Error fetching rates:', error);
    } finally {
        gridMeta.value.isLoadingRates = false;
    }
}

const handleSelect = (part: any) => {
    gridMeta.value.selectedPart = part;
};

const handleProductSelect = (p: any) => {
    gridMeta.value.selectedContent = p;
};
const handleRemoveContent = () => {
    console.log(gridMeta.value.selectedContent)
    packageContents.value = packageContents.value.filter(
        c => c.MODEL !== gridMeta.value.selectedContent.MODEL
    );
    gridMeta.value.selectedContent = null;
};
const handleClearForm = () => {
    packageName.value = '';
    packageContents.value = [];
    formData.value = {
        name: "",
        productsOnOrder: [],
        instanceId: null,
        shippingRateId: null,
        rates: {}
    };
    fetchRates();
};
function handlePkgSelection(pkg) {
    formData.value.instanceId = pkg.INSTANCEID;
    formData.value.shippingRateId = pkg.ShippingRateID;
    formData.value.name = pkg.NAME;
    const rateMapping = {
        UPG: 'E',
        UP2: 'B',
        UPN: 'A',
        PM: 'C',
        SM: 'D'
    };

    Object.entries(rateMapping).forEach(([display, apiType]) => {
        rateRows.value[display] = Array(8).fill('0.00').map((_, index) => {
            const key = `SHIPZONE${index + 1}${apiType}`;
            return pkg[key] || '0.00';
        });
    });

    fetchContents(pkg.INSTANCEID);
}
// In your Vue component
const handleRateChange = (rateType: string, zoneIndex: number, value: string) => {
    rateRows.value[rateType][zoneIndex] = value;

    // Map display types to database types
    const rateTypeMap = {
        UPG: 'E',
        UP2: 'B',
        UPN: 'A',
        PM: 'C',
        SM: 'D'
    };

    // Update formData rates
    formData.value.rates = {};
    Object.entries(rateRows.value).forEach(([displayType, rates]) => {
        const dbType = rateTypeMap[displayType];
        rates.forEach((rate, index) => {
            formData.value.rates[`SHIPZONE${index + 1}${dbType}`] = rate;
        });
    });
};
function handleFilterChange() {
    gridMeta.value.page = 1;
    fetchProducts();
}
const handlePageChange = async (newPage: number) => {
    try {
        gridMeta.value.isLoading = true;
        gridMeta.value.page = newPage;
        await fetchProducts();
    } catch (error) {
        console.error('Error changing page:', error);
    } finally {
        gridMeta.value.isLoading = false;
    }
};
const handleRemovePkg = async () => {
    if (!formData.value.instanceId || !formData.value.shippingRateId) {
        toast.add({
            title: "Error",
            description: "Please select a package to delete",
            icon: "i-heroicons-exclamation-triangle",
            color: "red",
        });
        return;
    }

    await useApiFetch('/api/utilities/shipping/rates', {
        method: 'DELETE',
        params: {
            instanceId: formData.value.instanceId,
            shippingRateId: formData.value.shippingRateId
        },
        onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: "Package deleted successfully",
                    icon: "i-heroicons-check-circle",
                    color: "green"
                });
                handleClearForm();
                fetchRates();
            }
        }
    });
};
const handleModify = async () => {
    if (!formData.value.instanceId) {
        toast.add({
            title: "Error",
            description: "Please select a package to modify",
            icon: "i-heroicons-exclamation-triangle",
            color: "red",
        });
        return;
    }

    // Update form data with current rates
    formData.value.rates = {};
    rateTypes.forEach(type => {
        rateRows.value[type].forEach((rate, index) => {
            formData.value.rates[`SHIPZONE${index + 1}${type}`] = rate;
        });
    });

    await useApiFetch('/api/utilities/shipping/rates', {
        method: 'PUT',
        body: formData.value,
        onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: response._data.message,
                    icon: "i-heroicons-check-circle",
                    color: "green"
                });
                fetchRates();
            }
        }
    });
};

const handleAdd = async () => {
    if (!formData.value.name || formData.value.productsOnOrder.length === 0) {
        toast.add({
            title: "Validation Error",
            description: "Name and at least one product are required.",
            icon: "i-heroicons-exclamation-triangle",
            color: "red",
        });
        return;
    }

    // Format rates for submission
    formData.value.rates = {};
    rateTypes.forEach(type => {
        rateRows.value[type].forEach((rate, index) => {
            formData.value.rates[`SHIPZONE${index + 1}${type}`] = rate;
        });
    });

    await useApiFetch('/api/utilities/shipping/rates', {
        method: 'POST',
        body: formData.value,
        onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: response._data.message,
                    icon: "i-heroicons-check-circle",
                    color: "green"
                });
                handleClearForm();
                fetchRates();
            }
        }
    });
};
onMounted(() => {
    fetchRates();
});
</script>


<template>
    <div class="grid grid-cols-3 bg-gms-gray-50 gap-1">
        <div class="space-y-3 col-span-2 ">
            <div class="">
                <div class="px-4 py-2 gmsRedTitlebar">
                    <h2>Contents Lookup</h2>
                </div>

                <UDashboardToolbar class="">
                    <template #left>
                        <div class="grid grid-cols-3 gap-3">

                            <USelect v-model="filterValues.PRODUCTLINE" :options="gridMeta.productLines"
                                @change="handleFilterChange" placeholder="Product Line" />

                            <USelect v-model="filterValues.PARTTYPE" :options="gridMeta.categories"
                                @change="handleFilterChange" placeholder="Category" />
                            <USelect v-model="filterValues.SUBCATEGORY" :options="gridMeta.subCategories"
                                @change="handleFilterChange" placeholder="Sub-Category" />
                        </div>
                    </template>
                </UDashboardToolbar>
                <div class="h-[20vh] p-4 overflow-hidden">
                    <UTable :rows="gridMeta.products" :columns="gridMeta.defaultColumns" :loading="gridMeta.isLoading"
                        class="w-full" :ui="{
                            wrapper: 'relative flex flex-col h-full',
                            table: 'min-w-full',
                            thead: 'sticky top-0 z-10',
                            tbody: 'overflow-auto',
                            tr: {
                                color: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            },
                            th: {
                                base: 'sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800',
                                padding: 'px-3 py-2',
                                color: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                                font: 'font-semibold',
                                size: 'text-sm'
                            },
                            td: {
                                base: 'border-b border-gray-200 dark:border-gray-800',
                                padding: 'px-3 py-2',
                                color: 'text-gray-700 dark:text-gray-200',
                                font: '',
                                size: 'text-sm'
                            }
                        }" :empty-state="{
                            icon: 'i-heroicons-circle-stack-20-solid',
                            label: 'No items.',
                        }" @select="handleSelect" @dblclick="handleDblClick">

                    </UTable>
                </div>
                <div class="flex items-center justify-between px-4">
                    <UPagination :max="7" v-model="gridMeta.page" :total="gridMeta.total | 0"
                        :page-size="gridMeta.pageSize" @update:model-value="handlePageChange" />
                </div>
            </div>

            <div>
                <div class="px-4 py-2 gmsRedTitlebar">
                    <h2>Package</h2>
                </div>
                <div class="flex p-4 gap-3">
                    <div class="flex-grow space-y-4">
                        <UInput v-model="formData.name" placeholder="Name" />
                        <div class="h-[20vh] overflow-hidden">
                            <UTable :rows="packageContents" :columns="columns" :loading="gridMeta.isLoadingContent"
                                class="w-full" :ui="{
                                    wrapper: 'relative flex flex-col h-full',
                                    table: 'min-w-full',
                                    thead: 'sticky top-0 z-10',
                                    tbody: 'overflow-auto',
                                    tr: {
                                        color: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    },
                                    th: {
                                        base: 'sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800',
                                        padding: 'px-3 py-2',
                                        color: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                                        font: 'font-semibold',
                                        size: 'text-sm'
                                    },
                                    td: {
                                        base: 'border-b border-gray-200 dark:border-gray-800',
                                        padding: 'px-3 py-2',
                                        color: 'text-gray-700 dark:text-gray-200',
                                        font: '',
                                        size: 'text-sm'
                                    }
                                }" :empty-state="{
                                    icon: 'i-heroicons-circle-stack-20-solid',
                                    label: 'No items.',
                                }" @select="handleProductSelect">

                            </UTable>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <UButton color="red" @click="handleRemoveContent" icon="i-heroicons-trash" variant="solid">
                            Remove From
                        </UButton>

                        <UButton @click="handleAdd" :disabled="formData.instanceId" color="red" icon="i-heroicons-plus"
                            variant="solid">
                            Add
                        </UButton>

                        <UButton color="red" icon="i-heroicons-pencil-square" :disabled="!formData.instanceId"
                            @click="handleModify" variant="solid">
                            Modify
                        </UButton>

                        <UButton icon="i-heroicons-trash" :ui="{ red: { solid: 'gms-pink-700' } }"
                            @click="handleRemovePkg" color="red" variant="solid">
                            Delete
                        </UButton>

                        <UButton color="red" variant="outline" icon="i-heroicons-arrow-path" @click="handleClearForm">
                            Clear Form
                        </UButton>
                    </div>
                </div>

            </div>

            <div>
                <div class="px-4 py-2 gmsRedTitlebar">
                    <h2>Rates</h2>
                </div>
                <div class="overflow-x-auto bg-gms-gray-50 p-4">
                    <div class="grid grid-cols-10 gap-0">

                        <div class="col-span-1 mt-1">

                            <div class="text-sm font-semibold">Zone</div>
                            <div class="!mt-8 ">
                                <div class="text-sm font-semibold mt-12 text-right pr-3">UPG</div>
                                <div class="text-sm font-semibold mt-5 text-right pr-3">UP2</div>
                                <div class="text-sm font-semibold mt-5 text-right pr-3">UPN</div>
                                <div class="text-sm font-semibold mt-5 text-right pr-3">PM</div>
                                <div class="text-sm font-semibold mt-5 text-right pr-3">SM</div>
                            </div>
                        </div>
                        <div class="col-span-9">
                            <div class="grid grid-cols-8 border p-2">
                                <div v-for="zone in 8" :key="zone" class="text-sm text-center border-l-0">
                                    {{ zone }}
                                </div>
                            </div>
                            <div class="grid grid-cols-8 border p-2 mt-2">
                                <div v-for="(rate, index) in rateRows.UPG" :key="index" class="mt-2">
                                    <UInput v-model="rateRows.UPG[index]" type="number"
                                        @update:model-value="(value) => handleRateChange('UPG', index, value)" />
                                </div>
                                <div v-for="(rate, index) in rateRows.UP2" :key="index" class="mt-2">
                                    <UInput v-model="rateRows.UP2[index]" type="number"
                                        @update:model-value="(value) => handleRateChange('UP2', index, value)" />
                                </div>

                                <div v-for="(rate, index) in rateRows.UPN" :key="index" class="mt-2">
                                    <UInput v-model="rateRows.UPN[index]" type="number"
                                        @update:model-value="(value) => handleRateChange('UPN', index, value)" />
                                </div>

                                <div v-for="(rate, index) in rateRows.PM" :key="index" class="mt-2">
                                    <UInput v-model="rateRows.PM[index]" type="number"
                                        @update:model-value="(value) => handleRateChange('PM', index, value)" />
                                </div>

                                <div v-for="(rate, index) in rateRows.SM" :key="index" class="mt-2">
                                    <UInput v-model="rateRows.SM[index]" type="number"
                                        @update:model-value="(value) => handleRateChange('SM', index, value)" />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>


        <div>
            <div class="px-4 py-2 gmsRedTitlebar">
                <h2>Packages</h2>
            </div>
            <div class="border rounded-md overflow-y-auto mt-4 bg-white">

                <template v-if="gridMeta.packages.length > 0">
                    <div v-for="pkg in gridMeta.packages" :key="pkg.NAME" :class="[
                        'p-2 cursor-pointer border-b hover:bg-gray-100',
                        { 'bg-blue-100': formData?.name === pkg.NAME }
                    ]" @click="handlePkgSelection(pkg)">
                        {{ pkg.NAME }}
                    </div>
                </template>
            </div>
        </div>
    </div>

</template>
