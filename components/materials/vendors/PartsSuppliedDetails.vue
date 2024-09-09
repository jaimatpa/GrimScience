<script setup lang="ts">
import { format, parseISO } from 'date-fns';
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import Workcenter from './Workcenter.vue';
const required = ref({});
const jobList = ref([]);
const usedOn = ref([]);
const matchingWorkplaces = ref([])
const workplaces = ref([]);
const InventoryTransactions = ref([]);
const showWorkCenter = ref(false);
const partCategories = ref([]);
const subCategories = ref([]);
const inspectionNumbers = ref([]);
const accountList = ref([]);
const partsList = ref([]);

const InventoryTransactionsColumns = [
    {
        key: 'UID',
        label: 'Unique ID'
    },
    {
        key: 'QtyChange',
        label: 'QTY'
    },
    {
        key: 'Dated',
        label: 'Date',
        formatter: (value) => formatDate(value as string),
    }
];
const revisions = ref([])
const revisionsColumns = [
    {
        key: 'code',
        label: 'Action'
    },
    {
        key: 'today',
        label: 'Date',
    },

];
const poDetails = ref([])


const loadingOverlay = ref(false);

const emit = defineEmits(['close', 'save'])
const props = defineProps({
    isModal: {
        type: [Boolean]
    },
    modalData: {
        type: Object,
        required: true
    }
})
console.log('from props', props.modalData)

// const loadingOverlay = ref(false)
const customerExist = ref(true)

const fetchPartCategories = async () => {
    loadingOverlay.value = true;
    try {
        const response = await useApiFetch('/api/common/partCategories', { method: 'GET' });
        // if (response.status === 200) {
        partCategories.value = response.body
            .map(e => e.PARTTYPE)
            .filter(partType => partType !== null && partType.trim() !== '');
        // }
    } catch (error) {
        console.log(error);
    } finally {
        loadingOverlay.value = false;
    }
};

const fetchSubCategories = async (cat) => {
    loadingOverlay.value = true;

    try {
        console.log({ cat: props.modalData.value.PARTTYPE })
        const response = await useApiFetch(`/api/common/partSubCategories?PARTTYPE=${cat}`, { method: 'GET' });
        console.log(response.body)
        subCategories.value = response.body.map(e => e.SUBCATEGORY)
        // .filter(subCategory => subCategory !== null && subCategory.trim() !== '');
    } catch (error) {
        subCategories.value = [];
    } finally {
        loadingOverlay.value = false;
    }
};

const fetchTransactionsByModel = async (search: string) => {
    loadingOverlay.value = true;
    if (!search) return;

    try {
        const response = await useApiFetch(`/api/materials/vendors/transactions?model=${search}`, {
            method: 'GET',
        });

        if (response.body) {
            InventoryTransactions.value = response.body
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchPODetailsByInstanceId = async (search: string) => {
    loadingOverlay.value = true;
    if (!search) return;
    console.log(search);
    try {
        const response = await useApiFetch(`/api/materials/vendors/podetails?instanceId=${search}`, {
            method: 'GET',
        });
        console.log(response)
        if (response.body) {
            poDetails.value = response.body
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchRevisionsByInstanceId = async (search: string) => {
    loadingOverlay.value = true;
    if (!search) return;

    try {
        const response = await useApiFetch(`/api/materials/vendors/revisions?instanceId=${search}`, {
            method: 'GET',
        });
        console.log(revisions)
        if (response.body) {
            revisions.value = response.body
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchWorkCentersBy = async () => {
    loadingOverlay.value = true;

    try {
        const response = await useApiFetch('/api/materials/vendors/workcenters', {
            method: 'GET',
        });
        // const workCenterIds = ;
        if (response) {
            console.log(response);

            const workCenterIds = props.modalData.WORKCENTERS
                .split(',')
                .map(id => id.trim())  // Trim any whitespace
                .filter(id => id !== "")
            workplaces.value = response;
            matchingWorkplaces.value = response.filter(workplace =>
                workCenterIds.includes(workplace.UniqueId)
            );
        } else {
            console.log('Unexpected response structure or status code:', response);
        }
    } catch (error) {
        console.error(error);
        return { workcenters: [] };
    } finally {
        loadingOverlay.value = false;

    }
}
const fetchAccountLists = async () => {
    loadingOverlay.value = true;
    try {
        const response = await useApiFetch(`/api/common/accountlist`, {
            method: 'GET',
        });

        if (response.body) {
            accountList.value = response.body
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchPartUnits = async () => {
    loadingOverlay.value = true;
    try {
        const response = await useApiFetch(`/api/common/partUnit`, {
            method: 'GET',
        });

        if (response.body) {
            partsList.value = response.body.map(part => part.unit).filter(unit => unit && unit.trim() !== '');
        } else {
            console.log('Unexpected response structure or status code:', response);
        }

    } catch (error) {
        console.error('Error fetching supplied parts:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchUsedOn = async (instanceID) => {
    loadingOverlay.value = true;

    try {
        // Make a GET request to your API endpoint
        const response = await useApiFetch('/api/materials/vendors/usedOn', {
            method: 'GET',
            query: {
                instanceId: instanceID,
            }
        });
        usedOn.value = response;
        console.log(response);
    } catch (error) {
        console.error('Error fetching job list:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const fetchJobs = async (model) => {
    try {
        // Make a GET request to your API endpoint
        const response = await useApiFetch('/api/materials/vendors/getJob', {
            method: 'GET',
            query: {
                model,
            }
        });
        jobList.value = response;
        console.log(response);
    } catch (error) {
        console.error('Error fetching job list:', error);
    }
};
const fetchRequired = async (model) => {
    try {
        // Make a GET request to your API endpoint
        const response = await useApiFetch('/api/materials/vendors/getRequired', {
            method: 'GET',
            query: {
                model,
            }
        });
        required.value = response[0];
        console.log(response);
    } catch (error) {
        console.error('Error fetching job list:', error);
    }
}
const fetchAllData = async () => {
    loadingOverlay.value = true;
    console.log('PARTTYPE:', props.modalData.PARTTYPE, 'MODEL:', props.modalData.MODEL, 'instanceID:', props.modalData.instanceID);

    if (!props.modalData.PARTTYPE || !props.modalData.MODEL || !props.modalData.instanceID) {
        console.error('Missing required modalData fields');
        loadingOverlay.value = false;
        return;
    }

    try {
        await Promise.all([
            fetchPartCategories(),
            fetchAccountLists(),
            fetchPartUnits(),
            fetchSubCategories(props.modalData.PARTTYPE),
            fetchTransactionsByModel(props.modalData.MODEL),
            fetchRevisionsByInstanceId(props.modalData.instanceID),
            fetchPODetailsByInstanceId(props.modalData.instanceID),
            fetchUsedOn(props.modalData.instanceID),
            fetchWorkCentersBy(),
            fetchJobs(props.modalData.MODEL),
            fetchRequired(props.modalData.MODEL)
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loadingOverlay.value = false;
    }
};
const modalUIConfig = {
    title: 'text-lg',
    header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
    body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
    width: 'w-[1800px] sm:max-w-9xl',
};
fetchAllData();

function formatDate(unformattedDate: string): string {
    const date = parseISO(unformattedDate);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}
const save = () => {

}


</script>

<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
            loader="dots" />
    </div>
    <template v-if="!props.isModal && !customerExist">
        <CommonNotFound :name="'Customer not found'" :message="'The customer you are looking for does not exist'"
            :to="'/customers/customers/list'" />
    </template>
    <template v-else>
        <UForm class="space-y-4" :state="modalData">
            <div class="flex flex-col gap-4">

                <div class="space-y-3">

                    <div class="gap-4 flex flex-col">
                        <UCard>
                            <template #header>
                                Parts Information
                            </template>
                            <div class="grid grid-cols-4 gap-4">

                                <div class="basis-1/5">
                                    <UFormGroup label="Category" name="categories">
                                        <USelectMenu v-model="modalData.PARTTYPE" :options="partCategories">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>

                                <div class="basis-1/5">
                                    <UFormGroup label="Sub Category" name="subCategories">
                                        <USelectMenu v-model="modalData.SUBCATEGORY" :options="subCategories">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Stock Number" name="title">
                                        <UInput v-model="modalData.STOCKNUMBER" placeholder="Stock Number" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inspection" name="inspectionNumbers">
                                        <USelectMenu v-model="modalData.InspectionLevel" :options="inspectionNumbers">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>
                            </div>

                            <div class="flex flex-row space-x-3">
                                <div class="flex gap-3 basis-1/5">
                                    <div class="basis-3/4">
                                        <UFormGroup label="Order Unit" name="market">
                                            <UInputMenu v-model="modalData.UNIT" :options="partsList" />
                                        </UFormGroup>
                                    </div>
                                    <div class="basis-1/4">
                                        <UFormGroup label="Multiple" name="number">
                                            <UInput v-model="modalData.MULTIPLE" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inventory Unit" name="profession">
                                        <UInput v-model="modalData.InventoryUnit" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Account#" name="Account">
                                        <UInputMenu v-model="modalData.AccountNumber" :options="accountList" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-2/5">
                                    <UFormGroup label="Description" name="Description">
                                        <UInput v-model="modalData.DESCRIPTION" />
                                    </UFormGroup>
                                </div>
                            </div>
                            <div class="flex flex-row space-x-3">
                                <div class="basis-1/5">
                                    <UFormGroup label="Order Cost" name="Order Cost">
                                        <UInput v-model="modalData.ORDERCOST" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inventory Cost" name="Inventory Cost">
                                        <UInput v-model="modalData.InventoryCost" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Selling Price" name="selling-price">
                                        <UInput v-model="modalData.SELLINGPRICE" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-2/5">
                                    <UFormGroup label="Specification" name="specification">
                                        <UInput v-model="modalData.SPECIFICATIONS" />
                                    </UFormGroup>
                                </div>

                            </div>
                        </UCard>


                    </div>



                    <div class="flex gap-4">
                        <UCard class="w-full">
                            <template #header>
                                Primary Manufacturer
                            </template>
                            <div class="flex flex-row space-x-5">

                                <div class="grid grid-cols-1 gap-5">
                                    <div>
                                        <UFormGroup label="Manufacturer" name="Manufacturer">
                                            <UInput placeholder="Garmin" v-model="modalData.PRIMARYMANTXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Dealer" name="Dealer">
                                            <UInput placeholder="walmart.com" v-model="modalData.PRIMARYDEATXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Lead Time" name="Lead Time">
                                            <UInput placeholder="walmart.com" v-model="modalData.PRIMARYLEADTIME" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 gap-5">

                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="modalData.PRIMARYMANNUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="modalData.PRIMARYDEANUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="UL Number" name="UL Number">
                                            <UInput placeholder="14.56" v-model="modalData.PRIMARYUL" />
                                        </UFormGroup>
                                    </div>

                                </div>

                                <div class="flex flex-row space-x-2 ">
                                    <div class="grid grid-cols-1 gap-1 flex-grow">
                                        <div class="basis-1/2 text-center">
                                            Qty
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYQTY1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYQTY2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYQTY3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYQTY4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYQTY5" />
                                            </UFormGroup>
                                        </div>
                                    </div>
                                    <!-- Second Grid Section -->
                                    <div class="grid grid-cols-1 ">
                                        <div class="basis-1/2 text-center">
                                            Price
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYPRICE1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYPRICE2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYPRICE3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYPRICE4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.PRIMARYPRICE5" />
                                            </UFormGroup>
                                        </div>

                                    </div>
                                </div>




                            </div>

                            <div class="grid grid-cols-1 gap-5">
                                <div>
                                    <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                                        <UInput />
                                    </UFormGroup>
                                </div>
                            </div>

                        </UCard>
                        <UCard class="w-full">
                            <template #header>
                                Secondary Manufacturer
                            </template>
                            <div class="flex flex-row space-x-5">

                                <div class="grid grid-cols-1 gap-5">
                                    <div>
                                        <UFormGroup label="Manufacturer" name="Manufacturer">
                                            <UInput placeholder="Garmin" v-model="modalData.ALTER1MANTXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Dealer" name="Dealer">
                                            <UInput placeholder="walmart.com" v-model="modalData.ALTER1DEATXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Lead Time" name="Lead Time">
                                            <UInput placeholder="walmart.com" v-model="modalData.ALTER1LEADTIME" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 gap-5">

                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="modalData.ALTER1MANNUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="modalData.ALTER1DEANUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="UL Number" name="UL Number">
                                            <UInput placeholder="14.56" v-model="modalData.ALTER1UL" />
                                        </UFormGroup>
                                    </div>

                                </div>

                                <div class="flex flex-row space-x-2">
                                    <div class="grid grid-cols-1 gap-1">
                                        <div class="basis-1/2 text-center">
                                            Qty
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1QTY1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1QTY2" />

                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1QTY3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1QTY4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1QTY5" />
                                            </UFormGroup>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 ">
                                        <div class="basis-1/2 text-center">
                                            Price
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1PRICE1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1PRICE2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1PRICE3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1PRICE4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="modalData.ALTER1PRICE5" />
                                            </UFormGroup>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-5">
                                <div>
                                    <UFormGroup label="Last Ordered Date:" name="Last Ordered Date">
                                        <UInput />
                                    </UFormGroup>
                                </div>
                            </div>

                        </UCard>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-4">

                    <div class="grid grid-cols-1">
                        <UCard class="overflow-y-auto">
                            <template #header>
                                <div class="flex justify-between">
                                    <span>
                                        Workplaces
                                    </span>
                                    <UButton @click="showWorkCenter = true">Add</UButton>
                                </div>
                            </template>
                            <div class="h-40 overflow-y-auto">
                                <UTable :rows="matchingWorkplaces" />
                            </div>
                        </UCard>
                    </div>
                    <div class="col-span-2">
                        <UCard>
                            <template #header>
                                Qty Information
                            </template>
                            <div class="flex flex-wrap gap-4">
                                <div class="flex items-center space-x-2">
                                    <UFormGroup label="On Order">
                                        <UInput v-model="required.ordered" />
                                    </UFormGroup>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <UFormGroup label="On Hand">
                                        <UInput v-model="modalData.OnHand" />
                                    </UFormGroup>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <UFormGroup label="Required">
                                        <UInput v-model="required.required" />
                                    </UFormGroup>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <UFormGroup label="Available" v-model="modalData.PRIMARYQTY1">
                                        <UInput />
                                    </UFormGroup>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <UFormGroup label="Minimum">
                                        <UInput v-model="modalData.minimum" />
                                    </UFormGroup>
                                </div>
                            </div>
                        </UCard>
                    </div>
                    <div class="grid grid-cols-1">
                        <UCard>
                            <template #header>
                                Revisions
                            </template>
                            <div class="h-40 overflow-y-auto">
                                <UTable :rows="revisions" :columns="revisionsColumns" />
                            </div>
                        </UCard>

                    </div>
                </div>
                <div class="grid grid-cols-6 gap-4">

                    <UCard class="col-span-2">
                        <template #header>
                            Used ON
                        </template>
                        <div class="overflow-y-auto h-96">
                            <UTable :rows="usedOn" :columns="[{ key: 'Expr1', label: 'Jobs' }]" />

                        </div>
                    </UCard>
                    <UCard class="col-span-1">
                        <template #header>
                            Jobs
                        </template>
                        <div class="overflow-y-auto h-96">
                            <UTable :rows="jobList" />

                        </div>
                    </UCard>
                    <UCard class=" col-span-2">
                        <template #header>
                            Inventory transactions
                        </template>
                        <div class="overflow-y-auto h-96">

                            <UTable :columns="InventoryTransactionsColumns" :rows="InventoryTransactions" />
                        </div>
                    </UCard>
                    <UCard class="col-span-1">
                        <UFormGroup label="Comments" name="Comments">
                            <UTextarea v-model="modalData.COMMENT" />
                        </UFormGroup>
                    </UCard>


                </div>

            </div>
            <div class="flex justify-end gap-3">
                <UButton color="cyan" variant="outline" @click="save()" type="submit" label="Save" />
            </div>
        </UForm>
    </template>
    <UDashboardModal v-model="showWorkCenter" title="Select Workcenter" :ui="modalUIConfig">
        <Workcenter :work-centers="workplaces" />
    </UDashboardModal>
</template>
