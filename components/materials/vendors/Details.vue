<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
            loader="dots" />
    </div>
    <!-- <div class="flex flex-row space-x-3"> -->
    <UCard>
        <UForm class="flex flex-col gap-3 space-y-3">

            <!-- Vendor Information section -->
            <UFormGroup class="space-y-3">
                <UFormGroup label="Number">
                    <UInput v-model="form.number" />
                </UFormGroup>
                <UFormGroup label="Name">
                    <UInput v-model="form.name" />
                </UFormGroup>
                <UFormGroup label="Website">
                    <UInput v-model="form.website" />
                </UFormGroup>
                <UFormGroup label="Address">
                    <UInput v-model="form.address" />
                </UFormGroup>
                <UFormGroup label="City">
                    <UInput v-model="form.city" />
                </UFormGroup>
                <UFormGroup label="State">
                    <USelect v-model="form.state" :options="stateOptions" />
                </UFormGroup>
                <UFormGroup label="ZIP">
                    <UInput v-model="form.zip" />
                </UFormGroup>
                <UFormGroup label="Customer Number">
                    <UInput v-model="form.customerNumber" />
                </UFormGroup>
                <UFormGroup label="Terms">
                    <UInput v-model="form.terms" />
                </UFormGroup>
                <UFormGroup label="Country">
                    <UInput v-model="form.country" />
                </UFormGroup>
                <UFormGroup label="Ship Via">
                    <UInput v-model="form.shipVia" />
                </UFormGroup>
            </UFormGroup>

            <!-- Representative sections -->
            <div class="grid grid-cols-5 gap-3">


                <!-- Vendor Approval section -->
                <div class="col-span-1 h-full ">
                    <UCard class="space-y-3">
                        <UFormGroup label="Inside Representative">
                            <UFormGroup label="Name">
                                <UInput v-model="form.insideRep.name" />
                            </UFormGroup>
                            <div class="flex gap-3">
                                <UFormGroup class="basis-2/3" label="Telephone">
                                    <UInput v-model="form.insideRep.telephone" />
                                </UFormGroup>
                                <UFormGroup class="basis-1/3" label="Ext">
                                    <UInput v-model="form.insideRep.ext" />
                                </UFormGroup>
                            </div>
                            <UFormGroup label="Fax">
                                <UInput v-model="form.insideRep.fax" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="form.insideRep.email" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>

                </div>
                <div class="col-span-1 h-full">

                    <UCard class="space-y-3">
                        <UFormGroup label="Technical Support">
                            <UFormGroup label="Name">
                                <UInput v-model="form.techSupport.name" />
                            </UFormGroup>
                            <div class="flex gap-3">
                                <UFormGroup class="basis-2/3" label="Telephone">
                                    <UInput v-model="form.techSupport.telephone" />
                                </UFormGroup>
                                <UFormGroup class="basis-1/3" label="Ext">
                                    <UInput v-model="form.techSupport.ext" />
                                </UFormGroup>
                            </div>
                            <UFormGroup label="Fax">
                                <UInput v-model="form.techSupport.fax" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="form.techSupport.email" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>

                </div>
                <div class="col-span-1 h-full">
                    <UCard class="">
                        <UFormGroup label="Field Representative">
                            <UFormGroup label="Name">
                                <UInput v-model="form.fieldRep.name" />
                            </UFormGroup>
                            <UFormGroup label="Cell">
                                <UInput v-model="form.fieldRep.cell" />
                            </UFormGroup>
                            <UFormGroup label="Fax">
                                <UInput v-model="form.fieldRep.fax" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="form.fieldRep.email" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>
                </div>
                <div class="col-span-2 row-span-2">
                    <UCard class="h-full">
                        <div class="space-y-3">
                            <UFormGroup label="Vendor Approval">
                                <UFormGroup label="Status">
                                    <USelect v-model="form.vendorApproval.status" :options="statusOptions" />
                                </UFormGroup>
                                <UFormGroup label="Approved By">
                                    <USelect v-model="form.vendorApproval.approvedBy" :options="approvedByOptions" />
                                </UFormGroup>
                                <UFormGroup label="Approved Date">
                                    <UInput v-model="form.vendorApproval.approvedDate" type="date" />
                                </UFormGroup>
                            </UFormGroup>
                        </div>
                        <div class="mt-2">

                            <UTabs :items="items" :default-index="0" @change="handleTabChange" />
                            <UCard v-if="activeTab === 0">
                                <UFormGroup label="Order History">
                                    <UTable :rows="orderHistoryData" @select="onOrderRowClick" />
                                </UFormGroup>
                                <UButton class="mt-1" :disabled="!selectedOrder" @click="">
                                    View Check
                                </UButton>

                            </UCard>
                            <UCard v-if="activeTab === 1">
                                <UFormGroup label="Check History">
                                    <UTable :rows="checkHistoryData" @select="onCheckRowClick" />
                                </UFormGroup>
                                <UButton class="mt-1" :disabled="!selectedCheck" @click="">
                                    View Check
                                </UButton>

                            </UCard>

                        </div>
                    </UCard>
                </div>
                <div class="col-span-3 h-full">

                    <UCard>
                        <UFormGroup label="Comments">
                            <UTextarea v-model="form.comments" rows="3" />
                        </UFormGroup>
                    </UCard>
                </div>

            </div>


        </UForm>
        <UCardFooter class="flex gap-3">
            <UButton>
                {{ isCreating ? 'Create Vendor' : 'Save Changes' }}
            </UButton>
            <UButton color='red'>
                Cancel
            </UButton>
        </UCardFooter>
    </UCard>
    <!-- <template> -->
    <div v-if="isVisible">
        <form @submit.prevent="save">
            <!-- (Your form fields here, bound to the `form` object) -->
            <button type="submit"></button>
            <button type="button" @click="close"></button>
        </form>
    </div>
    <!-- </template> -->
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

// Define the type for the form data
interface VendorForm {
    number: string;
    name: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    customerNumber: string;
    terms: string;
    country: string;
    shipVia: string;
    insideRep: {
        name: string;
        telephone: string;
        ext: string;
        fax: string;
        email: string;
    };
    techSupport: {
        name: string;
        telephone: string;
        ext: string;
        fax: string;
        email: string;
    };
    fieldRep: {
        name: string;
        cell: string;
        fax: string;
        email: string;
    };
    vendorApproval: {
        status: string;
        approvedBy: string;
        approvedDate: string;
    };
    comments: string;
}

const props = defineProps({
    isVisible: Boolean,
    data: Object as () => Partial<VendorForm>,
    isModal: Boolean,
    isCreating: Boolean, // New prop to determine if we're creating a new vendor
});

const emit = defineEmits(['close']);

const loadingOverlay = ref(false);

// Initial form data
const form = ref<VendorForm>({
    number: '',
    name: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    customerNumber: '',
    terms: '',
    country: '',
    shipVia: '',
    insideRep: {
        name: '',
        telephone: '',
        ext: '',
        fax: '',
        email: ''
    },
    techSupport: {
        name: '',
        telephone: '',
        ext: '',
        fax: '',
        email: ''
    },
    fieldRep: {
        name: '',
        cell: '',
        fax: '',
        email: ''
    },
    vendorApproval: {
        status: '',
        approvedBy: '',
        approvedDate: ''
    },
    comments: ''
});

// Populate the form if we are editing an existing vendor
watch(() => ({
    number: '123456',
    name: 'Example Vendor',
    website: 'https://www.example.com',
    address: '123 Example St',
    city: 'Sample City',
    state: 'CA',
    zip: '12345',
    customerNumber: '987654',
    terms: 'Net 30',
    country: 'USA',
    shipVia: 'FedEx',
    insideRep: {
        name: 'John Doe',
        telephone: '555-1234',
        ext: '101',
        fax: '555-5678',
        email: 'johndoe@example.com'
    },
    techSupport: {
        name: 'Jane Smith',
        telephone: '555-8765',
        ext: '102',
        fax: '555-4321',
        email: 'janesmith@example.com'
    },
    fieldRep: {
        name: 'Bob Brown',
        cell: '555-6789',
        fax: '555-9876',
        email: 'bobbrown@example.com'
    },
    vendorApproval: {
        status: 'Approved',
        approvedBy: 'Alice Johnson',
        approvedDate: '2024-08-19'
    },
    comments: 'Reliable vendor with good support'
}), (newData) => {
    if (!props.isCreating && newData) {
        form.value = { ...form.value, ...newData };
    }
}, { immediate: true });



const selectedCheck = ref(null);
const selectedOrder = ref(null);

const stateOptions = [
    { label: 'Ohio', value: 'OH' },
    // Add more state options here
];

const statusOptions = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
];

const approvedByOptions = [
    { label: 'Joseph Grimm', value: 'Joseph Grimm' },
    // Add more options here
];

const items = [
    { label: 'Order History' },
    { label: 'Check History' },
];

const activeTab = ref(0);

const handleTabChange = (index: number) => {
    activeTab.value = index;
};

const onOrderRowClick = (row: any) => {
    selectedOrder.value = row;
};

const onCheckRowClick = (row: any) => {
    selectedCheck.value = row;
};
const checkHistoryData = ref([
    { id: 1, details: 'Check 1 Details' },
    { id: 2, details: 'Check 2 Details' }
]);
const orderHistoryData = ref([
    { id: 1, details: 'Order 1 Details' },
    { id: 2, details: 'Order 2 Details' }
]);
const save = () => {
    if (props.isCreating) {
        // Handle create logic
    } else {
        // Handle update logic
    }
};
const close = () => {
    emit('close');
};
</script>
