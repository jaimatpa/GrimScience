<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
            loader="dots" />
    </div>
    <UCard>
        <UForm class="flex flex-col gap-3 space-y-3">

            <!-- Vendor Information section -->
            <UFormGroup class="space-y-3">
                <UFormGroup label="Number">
                    <UInput v-model="formData.NUMBER" />
                </UFormGroup>
                <UFormGroup label="Name">
                    <UInput v-model="formData.NAME" />
                </UFormGroup>
                <UFormGroup label="Website">
                    <UInput v-model="formData.WEBSITE" />
                </UFormGroup>
                <UFormGroup label="Address">
                    <UInput v-model="formData.ADDESS" />
                </UFormGroup>
                <UFormGroup label="City">
                    <UInput v-model="formData.CITY" />
                </UFormGroup>
                <UFormGroup label="State">
                    <UInput v-model="formData.STATE" />
                </UFormGroup>
                <UFormGroup label="ZIP">
                    <UInput v-model="formData.ZIP" />
                </UFormGroup>
                <UFormGroup label="Customer Number">
                    <UInput v-model="formData.CUSTNUMBER" />
                </UFormGroup>
                <UFormGroup label="Terms">
                    <UInput v-model="formData.TERMS" />
                </UFormGroup>
                <UFormGroup label="Country">
                    <UInput v-model="formData.COUNTRY" />
                </UFormGroup>
                <UFormGroup label="Ship Via">
                    <UInput v-model="formData.SHIPVIA" />
                </UFormGroup>
            </UFormGroup>

            <!-- Representative sections -->
            <div class="grid grid-cols-5 gap-3">
                <!-- Inside Representative section -->
                <div class="col-span-1 h-full">
                    <UCard class="space-y-3">
                        <UFormGroup label="Inside Representative">
                            <UFormGroup label="Name">
                                <UInput v-model="formData.IRNAME" />
                            </UFormGroup>
                            <div class="flex gap-3">
                                <UFormGroup class="basis-2/3" label="Telephone">
                                    <UInput v-model="formData.IRPHONE" />
                                </UFormGroup>
                                <UFormGroup class="basis-1/3" label="Ext">
                                    <UInput v-model="formData.IREXT" />
                                </UFormGroup>
                            </div>
                            <UFormGroup label="Fax">
                                <UInput v-model="formData.IRFAX" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="formData.IREMAIL" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>
                </div>

                <!-- Technical Support section -->
                <div class="col-span-1 h-full">
                    <UCard class="space-y-3">
                        <UFormGroup label="Technical Support">
                            <UFormGroup label="Name">
                                <UInput v-model="formData.TSNAME" />
                            </UFormGroup>
                            <div class="flex gap-3">
                                <UFormGroup class="basis-2/3" label="Telephone">
                                    <UInput v-model="formData.TSPHONE" />
                                </UFormGroup>
                                <UFormGroup class="basis-1/3" label="Ext">
                                    <UInput v-model="formData.TSEXT" />
                                </UFormGroup>
                            </div>
                            <UFormGroup label="Fax">
                                <UInput v-model="formData.TSFAX" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="formData.TSEMAIL" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>
                </div>

                <!-- Field Representative section -->
                <div class="col-span-1 h-full">
                    <UCard>
                        <UFormGroup label="Field Representative">
                            <UFormGroup label="Name">
                                <UInput v-model="formData.FRNAME" />
                            </UFormGroup>
                            <UFormGroup label="Cell">
                                <UInput v-model="formData.FRCELL" />
                            </UFormGroup>
                            <UFormGroup label="Fax">
                                <UInput v-model="formData.FRFAX" />
                            </UFormGroup>
                            <UFormGroup label="Email">
                                <UInput v-model="formData.FREMAIL" type="email" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>
                </div>

                <!-- Vendor Approval section -->
                <div class="col-span-2 row-span-2">
                    <UCard class="h-full">
                        <UFormGroup label="Vendor Approval" class="space-y-3">
                            <UFormGroup label="Status">
                                <UInputMenu v-model="formData.ApprovalStatus" :options="statusOptions" />
                            </UFormGroup>
                            <UFormGroup label="Approved By">
                                <UInputMenu v-model="formData.ApprovedBy" :options="approvedByOptions" />
                            </UFormGroup>
                            <UFormGroup label="Approved Date">
                                <UInput v-model="formData.ApprovedDate" type="date" />
                            </UFormGroup>
                        </UFormGroup>
                    </UCard>
                </div>

                <!-- Comments section -->
                <div class="col-span-3 h-full">
                    <UCard>
                        <UFormGroup label="Comments">
                            <UTextarea v-model="formData.COMMENTS" rows="3" />
                        </UFormGroup>
                    </UCard>
                </div>

            </div>

        </UForm>
        <UCardFooter class="flex gap-3 mt-3">
            <UButton @click="isCreating ? create() : save()">
                {{ isCreating ? 'Create Vendor' : 'Save Changes' }}
            </UButton>
        </UCardFooter>
    </UCard>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isVisible: Boolean,
    data: Object,
    isModal: Boolean,
    isCreating: Boolean,
});

const emit = defineEmits(['close']);

const loadingOverlay = ref(false);

// Initialize form data
const formData = reactive({ ...props.data });

// Watch for changes in the data prop and update formData
watch(() => props.data, (newValue) => {
    Object.assign(formData, newValue);
}, { deep: true, immediate: true });

const selectedCheck = ref(null);
const selectedOrder = ref(null);

const stateOptions = [
    { label: 'Ohio', value: 'OH' },
];

const statusOptions = ref([]);

const approvedByOptions = ref([])

const items = [
    { label: 'Order History' },
    { label: 'Check History' },
];

const activeTab = ref(0);

const toast = useToast()
useApiFetch('/api/auth/employees', {
    onResponse({ response }) {
        if (response.status === 200) {
            loadingOverlay.value = false;
            approvedByOptions.value = response._data.body
        }
    }
})
const save = async () => {
    console.log('Form Data:', formData);
    await useApiFetch('/api/materials/vendors/update', {
        method: 'PUT',
        body: formData,
        onResponse({ response }) {
            toast.add({
                title: "Success",
                description: response._data.message,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            });
            console.log(response)
        }
    });
};
const create = async () => {
    console.log('Form Data:', formData);
    await useApiFetch('/api/materials/vendors/create', {
        method: 'POST',
        body: formData,
        onResponse({ response }) {
            toast.add({
                title: "Success",
                description: response._data.message,
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })
        }
    });
};
await useApiFetch('/api/common/vendorStatus', {
    method: 'GET',
    onResponse({ response }) {
        statusOptions.value = response._data.body
            .map(e => e.ApprovalStatus)
            .filter(status => status !== null && status !== "");
    }
});


</script>
