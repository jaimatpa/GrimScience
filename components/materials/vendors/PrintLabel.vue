<template>
    <div class="container mx-auto p-4">
        <UCard>
            <UForm class="space-y-3">
                <UFormGroup>
                    <UInput v-model="fromAddress"  />
                </UFormGroup>

                <div class="flex gap-3">
                    <div class="basis-1/3">
                        <UFormGroup>
                            <UInput v-model="packageInfo" />
                        </UFormGroup>
                    </div>
                    <div class="basis-2/3">
                        <UFormGroup>
                            <USelect v-model="shippingMethod" :options="shippingOptions" />
                        </UFormGroup>
                    </div>
                </div>

                <UFormGroup>
                    <UTextarea v-model="toAddress" rows="3" placeholder="Enter recipient's address" />
                </UFormGroup>
            </UForm>

            <div class="mt-6 border rounded-lg p-4 bg-gray-50">
                <h3 class="text-lg font-semibold mb-4">Preview</h3>
                <div class="mb-4">
                    <p>{{ fromAddress }}</p>
                </div>
                <div class="mb-4">
                    <p><strong>To:</strong></p>
                    <p>{{ toAddress }}</p>
                </div>
            </div>

            <template #footer>
                <UButton color="gms-blue" variant="outline" class="hover:bg-gms-blue-500 hover:text-white"
                    @click="printLabel">Print Label</UButton>
            </template>
        </UCard>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    isVisible: Boolean,
    data: Object,
    isModal: Boolean,
});

const emit = defineEmits(['close']);

const fromAddress = ref('')
const shippingMethod = ref('')
const packageInfo = ref('')
const toAddress = ref('3M\nSt Paul, MN 55144')

const shippingOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Overnight', value: 'overnight' }
]

function printLabel() {
    // Implement print functionality here
    console.log('Printing label...')
}
const loadingOverlay = ref(false);
</script>
