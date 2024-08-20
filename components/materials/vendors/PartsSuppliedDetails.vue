<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';


const people = ref({})

const InventoryTransactions = ref([])


const emit = defineEmits(['close', 'save'])
const props = defineProps({
    modalData: {},
    isModal: {
        type: [Boolean]
    }
})

const toast = useToast()
const router = useRouter()
const customersFormInstance = getCurrentInstance();

const loadingOverlay = ref(false)
const customerExist = ref(true)
const markets = ref([])
const professions = ref([])
const categories = ref([])
const conferences = ref([])
const usstates = ref([])
const formData = ref({
    UniqueID: null,
    instanceID: '',
    oldproductid: '',
    oldpartid: '',
    partflag: false,
    subassemblyflag: false,
    productflag: false,
    supplyflag: false,
    ALTER2LEADTIME: '',
    ALTER2MANTXT: '',
    ALTER2MANNUM: '',
    ALTER2DEATXT: '',
    ALTER2DEANUM: '',
    ALTER2QTY1: '',
    ALTER2QTY2: '',
    ALTER2QTY4: '',
    ALTER2QTY3: '',
    ALTER2PRICE1: '',
    ALTER2PRICE4: '',
    ALTER2PRICE3: '',
    ALTER2PRICE2: '',
    ALTER2PRICE5: '',
    ALTER2QTY5: '',
    ALTER1LEADTIME: '',
    ALTER1MANTXT: '',
    ALTER1MANNUM: '',
    ALTER1DEATXT: '',
    ALTER1DEANUM: '',
    ALTER1QTY1: '',
    ALTER1QTY2: '',
    ALTER1QTY4: '',
    ALTER1QTY3: '',
    ALTER1PRICE1: '',
    ALTER1PRICE4: '',
    ALTER1PRICE3: '',
    ALTER1PRICE2: '',
    ALTER1PRICE5: '',
    ALTER1QTY5: '',
    PRIMARYQTY5: '',
    PRIMARYPRICE5: '',
    PRIMARYPRICE2: '',
    PRIMARYPRICE3: '',
    PRIMARYPRICE4: '',
    PRIMARYPRICE1: '',
    PRIMARYQTY3: '',
    PRIMARYQTY4: '',
    PRIMARYQTY2: '',
    PRIMARYQTY1: '',
    PRIMARYDEANUM: '',
    PRIMARYDEATXT: '',
    PRIMARYMANNUM: '',
    PRIMARYMANTXT: '',
    PRIMARYLEADTIME: '',
    SELLINGPRICE: '',
    SUBCATEGORY: '',
    PARTTYPE: '',
    SPECIFICATIONS: '',
    DESCRIPTION: '',
    STOCKNUMBER: '',
    UNIT: '',
    MULTIPLE: '',
    CODE: '',
    TODAY: '',
    PRODUCTLINE: '',
    MODEL: '',
    WARRENTY: '',
    SHIPWEIGHT: '',
    NETWEIGHTFULL: '',
    ELECTRICAL: '',
    NETWEIGHT: '',
    OnHand: '',
    AdjustedAmount: '',
    Reason: '',
    COMMENT: '',
    ORDERCOST: '',
    WORKCENTERS: '',
    ALTER2UL: '',
    ALTER1UL: '',
    PRIMARYUL: '',
    DRAWINGCUSTOM: '',
    EQUIPMENTFLAG: '',
    PlanID: '',
    GeneralType: '',
    AccountNumber: '',
    InventoryUnit: '',
    InventoryCost: '',
    HEIGHT: '',
    WIDTH: '',
    LENGTH: '',
    SPECSHEET: '',
    TANKDEPTH: '',
    WAXCAPACITY: '',
    CRYOTHERMSECTIONS: '',
    CRYOTHERMWALLS: '',
    CRYOTHERMGALLONSLEFT: '',
    CRYOTHERMGALLONSRIGHT: '',
    CRYOTHERMCATEGORY: '',
    DURALASTSUBCATEGORY: '',
    DURALASTCATEGORY: '',
    PARADYNAMIXSUBCATEGORY: '',
    PARADYNAMIXCATEGORY: '',
    CRYOTHERMWARMTANKSWITCHABLE: '',
    VariablePricing: '',
    BuiltInHouse: false,
    minimum: '',
    CryothermCorianNumber: '',
    CryothermPcoatNumber: '',
    CryothermLeftFrame: '',
    CryothermLeftTank: '',
    CryothermLeftPump: '',
    CryothermLeftJets: '',
    CryothermLeftCunitNumber: '',
    CryothermRightFrame: '',
    CryothermRightTank: '',
    CryothermRightPump: '',
    CryothermRightJets: '',
    CryothermRightCunitnumber: '',
    InspectionLevel: '',
    MDET: '',
    MDET1: '',
    override: '',
    grossprofit: '',
    CryoThermControlPanelNumber: '',
    CryoThermHeaterNumber: '',
    amps: '',
    ETLCriticalComponent: false,
    sds: '',
    SubassemblyInventoried: '',
    LeftTankAssembly: '',
    RightTankAssembly: '',
    RevisedBy: '',
    Recommendations: '',
    StatementOfNeed: '',
    SupportorProject: ''
});
const revData = {
    action: formData.value.CODE,
    date: formData.value.TODAY
}
const partCategories = ref({})
const subCategories = ref({})
const inspectionNumbers = ref({});
(async function propertiesInit() {
    loadingOverlay.value = true
    await useApiFetch('/api/common/partCategories', {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                partCategories.value = response._data.body
                    .map(e => e.PARTTYPE)
                    .filter(partType => partType !== null && partType !== undefined && partType.trim() !== '');
            }
            console.log({ response: response._data.body })
        },
        onResponseError(err) {

            console.log(err)
        }
    })
    await useApiFetch(`/api/materials/vendors/vendorSuppliedParts?search=${props.modalData.NAME}`, {
        method: 'GET',
        onResponse({ response }) {
            for (const key in response._data.body) {
                if (response._data.body[key] !== undefined) {
                    formData[key] = response._data.body[key]
                }
            }

        },
        onResponseError() {
            markets.value = []
        }
    })
    await useApiFetch(`/api/materials/vendors/transactions?model=${formData.value.MODEL}`, {
        method: 'GET',
        onResponse({ response }) {
            console.log(response._data.body)
        },
        onResponseError() {
            markets.value = []
        }
    })
    watch(
        () => formData.value.PARTTYPE,
        async (newCategory) => {
            if (newCategory) {
                await useApiFetch(`/api/common/partSubCategories?PARTTYPE=${newCategory}`, {
                    method: 'GET',
                    onResponse({ response }) {
                        if (response.status === 200) {
                            subCategories.value = response._data.body
                                .map(e => e.SUBCATEGORY)
                                .filter(subCategory => subCategory !== null && subCategory !== undefined && subCategory.trim() !== '');
                        }
                        console.log({ response: response._data.body });
                    },
                    onResponseError() {
                        subCategories.value = [];
                    }
                });
            } else {
                subCategories.value = [];
            }
        }
    );
    watch(
        () => [formData.value.PARTTYPE, formData.value.SUBCATEGORY],
        async ([newCategory, newSubCategory]) => {
            if (newCategory && newSubCategory) {
                await useApiFetch(`/api/common/getInspectionNumbers?PARTTYPE=${newCategory}&SUBCATEGORY=${newSubCategory}`, {
                    method: 'GET',
                    onResponse({ response }) {
                        if (response.status === 200) {
                            inspectionNumbers.value = response._data.body
                                .map(e => ({ STOCKNUMBER: e.STOCKNUMBER, InspectionLevel: e.InspectionLevel }))
                                .filter(item => item.STOCKNUMBER !== null && item.InspectionLevel !== null);
                        }
                        console.log({ response: response._data.body });
                    },
                    onResponseError() {
                        inspectionNumbers.value = [];
                    }
                });
            } else {
                inspectionNumbers.value = [];
            }
        }
    );

    loadingOverlay.value = false;
})()
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
        <UForm class="space-y-4">
            <div class="flex gap-3">
                <UCard class="">
                    <template #header>
                        Parts Information
                    </template>
                    <div class="space-y-3">
                        <UCard>
                            <div class="grid grid-cols-4 gap-3">
                                <div class="basis-1/5">
                                    <UFormGroup label="Category" name="categories">
                                        <USelectMenu v-model="formData.PARTTYPE" :options="partCategories">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>

                                <div class="basis-1/5">
                                    <UFormGroup label="Sub Category" name="subCategories">
                                        <USelectMenu v-model="formData.SUBCATEGORY" :options="subCategories">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Stock Number" name="title">
                                        <UInput v-model="formData.STOCKNUMBER" placeholder="Stock Number" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inspection" name="inspectionNumbers">
                                        <USelectMenu v-model="formData.InspectionLevel" :options="inspectionNumbers">
                                        </USelectMenu>
                                    </UFormGroup>
                                </div>
                            </div>
                            <div class="flex flex-row space-x-3">
                                <div class="flex gap-3 basis-1/5">
                                    <div class="basis-3/4">
                                        <UFormGroup label="Order Unit" name="market">
                                            <UInput v-model="formData.UNIT" />
                                        </UFormGroup>
                                    </div>
                                    <div class="basis-1/4">
                                        <UFormGroup label="Multiple" name="number">
                                            <UInput v-model="formData.MULTIPLE" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inventory Unit" name="profession">
                                        <UInput v-model="formData.InventoryUnit" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Account#" name="Account">
                                        <UInput v-model="formData.AccountNumber" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-2/5">
                                    <UFormGroup label="Description" name="Description">
                                        <UInput v-model="formData.DESCRIPTION" />
                                    </UFormGroup>
                                </div>
                            </div>
                            <div class="flex flex-row space-x-3">
                                <div class="basis-1/5">
                                    <UFormGroup label="Order Cost" name="Order Cost">
                                        <UInput v-model="formData.ORDERCOST" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Inventory Cost" name="Inventory Cost">
                                        <UInput v-model="formData.InventoryCost" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-1/5">
                                    <UFormGroup label="Selling Price" name="selling-price">
                                        <UInput v-model="formData.SELLINGPRICE" />
                                    </UFormGroup>
                                </div>
                                <div class="basis-2/5">
                                    <UFormGroup label="Specification" name="specification">
                                        <UInput v-model="formData.SPECIFICATIONS" />
                                    </UFormGroup>
                                </div>

                            </div>
                           

                        </UCard>

                        <UCard>
                            <!-- First Grid Section -->
                            <div class="flex flex-row space-x-5">

                                <div class="grid grid-cols-1 gap-5">
                                    <div>
                                        <UFormGroup label="Manufacturer" name="Manufacturer">
                                            <UInput placeholder="Garmin" v-model="formData.PRIMARYMANTXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Dealer" name="Dealer">
                                            <UInput placeholder="walmart.com" v-model="formData.PRIMARYDEATXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Lead Time" name="Lead Time">
                                            <UInput placeholder="walmart.com" v-model="formData.PRIMARYLEADTIME" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <!-- Second Grid Section -->
                                <div class="grid grid-cols-1 gap-5">

                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="formData.PRIMARYMANNUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="formData.PRIMARYDEANUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="UL Number" name="UL Number">
                                            <UInput placeholder="14.56" v-model="formData.PRIMARYUL" />
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
                                                <UInput v-model="formData.PRIMARYQTY1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYQTY2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYQTY3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYQTY4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYQTY5" />
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
                                                <UInput v-model="formData.PRIMARYPRICE1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYPRICE2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYPRICE3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYPRICE4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.PRIMARYPRICE5" />
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
                        <UCard>
                            <!-- First Grid Section -->
                            <div class="flex flex-row space-x-5">

                                <div class="grid grid-cols-1 gap-5">
                                    <div>
                                        <UFormGroup label="Manufacturer" name="Manufacturer">
                                            <UInput placeholder="Garmin" v-model="formData.ALTER1MANTXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Dealer" name="Dealer">
                                            <UInput placeholder="walmart.com" v-model="formData.ALTER1DEATXT" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Lead Time" name="Lead Time">
                                            <UInput placeholder="walmart.com" v-model="formData.ALTER1LEADTIME" />
                                        </UFormGroup>
                                    </div>
                                </div>
                                <!-- Second Grid Section -->
                                <div class="grid grid-cols-1 gap-5">

                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="formData.ALTER1MANNUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="Part Number" name="Part Number">
                                            <UInput placeholder="Garmin" v-model="formData.ALTER1DEANUM" />
                                        </UFormGroup>
                                    </div>
                                    <div>
                                        <UFormGroup label="UL Number" name="UL Number">
                                            <UInput placeholder="14.56" v-model="formData.ALTER1UL" />
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
                                                <UInput v-model="formData.ALTER1QTY1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1QTY2" />

                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1QTY3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1QTY4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1QTY5" />
                                            </UFormGroup>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 ">
                                        <div class="basis-1/2 text-center">
                                            Price
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1PRICE1" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1PRICE2" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1PRICE3" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1PRICE4" />
                                            </UFormGroup>
                                        </div>
                                        <div>
                                            <UFormGroup>
                                                <UInput v-model="formData.ALTER1PRICE5" />
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
                </UCard>

                <div class="space-y-3">

                    <div class="grid grid-cols-1">
                        <UCard class="mt-6 h-48 overflow-y-auto">
                            <UTable :rows="people" />
                        </UCard>
                    </div>
                    <UCard>
                        <div class="space-y-2 mt-2">
                            <div class="flex items-center space-x-2">
                                <UFormGroup label="On Order">
                                    <UInput />
                                </UFormGroup>
                            </div>

                            <div class="flex items-center space-x-2">
                                <UFormGroup label="On Hand">
                                    <UInput v-model="formData.OnHand" />
                                </UFormGroup>
                            </div>

                            <div class="flex items-center space-x-2">
                                <UFormGroup label="Required">
                                    <UInput v-model="formData.OnHand" />
                                </UFormGroup>
                            </div>

                            <div class="flex items-center space-x-2">
                                <UFormGroup label="Available">
                                    <UInput />
                                </UFormGroup>
                            </div>
                            <div class="flex items-center space-x-2">
                                <UFormGroup label="Minimum">
                                    <UInput v-model="formData.minimum" />
                                </UFormGroup>
                            </div>
                        </div>
                    </UCard>
                    <div class="grid grid-cols-1">
                        <UCard class="h-48 overflow-y-auto">
                            <UTable :rows="people" />
                        </UCard>

                    </div>


                </div>
                <div>

                    <div class="grid grid-cols-1 mt-6 h-48 w-72">

                        <UCard class="h-48 overflow-y-auto">
                            <UTable :rows="orders" />
                        </UCard>
                    </div>
                    <div class="grid grid-cols-1 mt-6 h-48">

                        <UCard class="h-48 overflow-y-auto">
                            <UTable :rows="people" />
                        </UCard>
                    </div>
                    <div class="">
                        <UFormGroup label="Comments" name="Comments">
                            <UTextarea class="w-48 " v-model="formData.COMMENT" />
                        </UFormGroup>
                    </div>



                </div>
                <div class="grid grid-cols-1 mt-6 h-48 w-60">
                    <UCard class="h-48 overflow-y-auto">
                        <UTable :rows="InventoryTransactions" />
                    </UCard>

                </div>

            </div>

            <div class="flex justify-end gap-3">
                <UButton color="red" variant="outline" :label="!isModal ? 'Go back' : 'Cancel'" />
                <UButton color="cyan" variant="outline" type="submit" label="Save" />
            </div>
        </UForm>
    </template>
</template>
