<template>
    <div class="container mx-auto p-4">
        <UCard>

            <UCardBody class="p-4">
                <UForm :state="formState" class="grid grid-cols-2 gap-3">
                    <!-- Top Section -->
                    <div class="mb-6 col-span-1">
                        <!-- First Row -->
                        <div class="flex gap-4 mb-4">
                            <!-- Package Info -->
                            <UInput v-model="formState.packageInfo" placeholder="C17" class="w-full" />
                        </div>

                        <!-- Second Row -->
                        <div class="flex gap-4 mb-4">
                            <!-- Quantity -->
                            <UInput v-model="formState.quantity" type="number" min="1" class="w-24" />
                            <!-- Product -->
                            <div class="relative w-full">
                                <div class="w-full border border-black rounded-md" @click="isOpen = !isOpen">
                                    <div class="flex items-center justify-between p-2">
                                        <span>{{ selectedLabel || 'Select a product' }}</span>
                                        <UIcon name="i-heroicons-chevron-down" :class="{ 'rotate-180': isOpen }" />
                                    </div>
                                </div>

                                <div v-if="isOpen"
                                    class="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[250px] overflow-y-auto"
                                    @scroll="handleScroll">
                                    <div>
                                        <div v-for="option in productOptions" :key="option.value"
                                            class="p-2 cursor-pointer hover:bg-gray-100" @click="selectProduct(option)">
                                            {{ option.label }}
                                        </div>

                                        <!-- Bottom loader -->
                                        <div v-if="loading" class="p-2 text-center text-gray-500">
                                            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
                                            Loading more...
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </div>

                        <!-- Third Row -->
                        <UInput v-model="formState.packageInfo2" placeholder="Zone (8)" class="w-full" />
                    </div>
                    <div class="col-span-1 preview-label">
                        <div class="border rounded-lg p-4 bg-gray-50 h-full">
                            <h3 class="text-lg font-semibold mb-4">Preview</h3>
                            <div class="mb-4">
                                <p>{{ formState.packageInfo }}</p>
                                <p>{{ formState.packageInfo2 }}</p>
                            </div>
                            <div class="mb-4 flex justify-end">
                                <p>{{ formState.shippingAddress }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- Shipping Address Section -->
                    <div class="mb-4 col-span-2">
                        <div class="text-sm font-bold mb-2">TO</div>
                        <UTextarea v-model="formState.shippingAddress" :rows="6" class="w-full font-mono"
                            placeholder="Enter shipping address..." />
                    </div>
                </UForm>
            </UCardBody>

            <UCardFooter class="flex justify-end p-4">
                <UButton color="purple" variant="outline" icon="i-heroicons-printer" @click="handlePrint"
                    :loading="printing">
                    Print Label
                </UButton>
            </UCardFooter>
        </UCard>

        <!-- Print Copies Dialog -->
        <UDashboardModal v-model="showCopiesDialog" title="Print Copies" :ui="{
            header: {
                base: 'bg-gms-purple',
            },
            width: 'w-[400px]',
        }">
            <div class="p-4">

                <UFormGroup label="Number of copies">
                    <UInput v-model="copies" type="number" min="1" :rules="{ required: true, min: 1 }" />
                </UFormGroup>

                <div class="mt-2 flex justify-end">
                    <UButton color="gray" variant="ghost" @click="showCopiesDialog = false">
                        Cancel
                    </UButton>
                    <UButton color="purple" variant="outline" @click="confirmPrint">
                        Print
                    </UButton>
                </div>

            </div>

        </UDashboardModal>

        <!-- Name Inclusion Dialog -->
        <UModal v-model="showNameConfirmDialog">
            <UCard>
                <UCardHeader>
                    <UCardTitle>Confirm Name Inclusion</UCardTitle>
                </UCardHeader>
                <UCardBody>
                    <p>Do you want to print the {{ props.action === 'VENDOR' ? 'vendor' : 'customer' }} name?</p>
                </UCardBody>
                <UCardFooter class="flex justify-end space-x-2">
                    <UButton color="gray" variant="ghost" @click="confirmNameInclusion(false)">
                        No
                    </UButton>
                    <UButton color="purple" @click="confirmNameInclusion(true)">
                        Yes
                    </UButton>
                </UCardFooter>
            </UCard>
        </UModal>
    </div>
</template>




<script setup lang="ts">

// Types
interface FormState {
    shippingAddress: string
    packageInfo: string
    packageInfo2: string
    quantity: string
    selectedProduct: string
}

// Props
const props = defineProps<{
    orderData?: any
    customerData?: any
    action?: string
    vid?: number
}>()

// State
const formState = reactive<FormState>({
    shippingAddress: '',
    packageInfo: '',
    packageInfo2: '',
    quantity: '1',
    selectedProduct: '',
})

// UI state
const printing = ref(false)
const showCopiesDialog = ref(false)
const showNameConfirmDialog = ref(false)
const copies = ref(1)
const productOptions = ref<Array<{ label: string; value: string }>>([])
const pendingOperation = ref<((include: boolean) => void) | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const isOpen = ref(false)
const selectedLabel = ref('')

// Scroll handling
const scrollPosition = ref(0)
const debouncedScroll = refDebounced(scrollPosition, 300)

// Market codes mapping
const marketCodes: Record<string, string> = {
    'Referee': 'R',
    'R': 'R',
    'Home': 'H',
    'H': 'H',
    'Salon': 'S',
    'S': 'S',
    'Clinical': 'C',
    'C': 'C',
    'Football Stadium': 'F',
    'F': 'F',
    'Dealer': 'D',
    'D': 'D'
}

// Helper functions
const getMarketCode = (market?: string): string => {
    if (!market) return ''
    return marketCodes[market] || market.charAt(0)
}

const cleanString = (str?: string | null): string => {
    return (str || '').trim()
}

// Products loading
const loadProducts = async (page = 1) => {
    if (loading.value) return

    try {
        loading.value = true
        if (!props.orderData) {
            await useApiFetch(`/api/common/shipping-label/products?productFlag=1&page=${page}`, {
                method: 'GET',
                onResponse: ({ response }) => {
                    if (response.status === 200) {
                        if (page === 1) {
                            productOptions.value = response._data.body
                            if (productOptions.value.length > 0 && !formState.selectedProduct) {
                                selectProduct(productOptions.value[0])
                            }
                        } else {
                            productOptions.value = [...productOptions.value, ...response._data.body]
                        }
                        hasMore.value = response._data.hasMore
                        currentPage.value = page
                    }
                }
            })
        } else {
            await useApiFetch(`/api/common/shipping-label/?order-details=${props.orderData.UniqueId}&page=${page}`, {
                method: 'GET',
                onResponse: ({ response }) => {
                    if (response.status === 200) {
                        const newOptions = response._data.body.map(product => ({
                            label: `#${product.type} - ${product.name || ''}`,
                            value: product.type
                        }))
                        if (page === 1) {
                            productOptions.value = newOptions
                            if (productOptions.value.length > 0 && !formState.selectedProduct) {
                                selectProduct(productOptions.value[0])
                            }
                        } else {
                            productOptions.value = [...productOptions.value, ...newOptions]
                        }
                        hasMore.value = response._data.hasMore
                        currentPage.value = page
                    }
                }
            })
        }
    } catch (error) {
        console.error('Failed to load products:', error)
        useToast().add({
            title: 'Error',
            description: 'Failed to load products',
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}


// Scroll handling
const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    const scrollPosition = target.scrollTop + target.clientHeight
    const scrollHeight = target.scrollHeight

    if (scrollHeight - scrollPosition < 50 && !loading.value && hasMore.value) {
        loadProducts(currentPage.value + 1)
    }
}
const selectProduct = (option: { label: string; value: string }) => {
    formState.selectedProduct = option.value
    selectedLabel.value = option.label
    isOpen.value = false
}

// Watch debounced scroll for infinite loading
watch(debouncedScroll, async (position) => {
    if (position > 0 && !loading.value && hasMore.value) {
        currentPage.value++
        await loadProducts(currentPage.value)
    }
})

// Load customer/vendor data
const loadVendorData = () => {
    showNameConfirmDialog.value = true
    pendingOperation.value = (includeVendorName: boolean) => {
        const addressParts = []
        if (includeVendorName && props.customerData?.irname) {
            addressParts.push(props.customerData.irname)
        }

        if (props.customerData) {
            addressParts.push(
                cleanString(props.customerData.name),
                cleanString(props.customerData.address),
                `${cleanString(props.customerData.city)}, ${cleanString(props.customerData.state)} ${cleanString(props.customerData.zip)}`,
                '\n\n'
            )
        }

        formState.shippingAddress = addressParts.filter(Boolean).join('\n')
    }
}

const loadCustomerData = () => {
    showNameConfirmDialog.value = true
    pendingOperation.value = (includeCustomerName: boolean) => {
        const addressParts = []

        if (props.customerData) {
            if (includeCustomerName) {
                const name = `${cleanString(props.customerData.fname)} ${cleanString(props.customerData.lname)}`
                if (name.trim()) addressParts.push(name)
            }

            const company1 = cleanString(props.customerData.company1)
            const company2 = cleanString(props.customerData.company2)

            if (company1) addressParts.push(company1)
            if (company2) addressParts.push(company2)

            const address = cleanString(props.customerData.address)
            if (address) addressParts.push(address)

            const cityStateZip = [
                cleanString(props.customerData.city),
                cleanString(props.customerData.state),
                cleanString(props.customerData.zip)
            ].filter(Boolean).join(', ')

            if (cityStateZip) addressParts.push(cityStateZip)

            if (props.orderData?.purchaseordernumber && props.orderData.purchaseordernumber !== 'Verbal') {
                addressParts.push(`PO: ${props.orderData.purchaseordernumber}`)
            }

            formState.shippingAddress = addressParts.filter(Boolean).join('\n')

            // Set package info
            const marketCode = getMarketCode(props.customerData.market)
            formState.packageInfo = `${marketCode}${props.customerData.number || ''}${props.orderData?.sourcecode || ''}`

            // Set zone info if available
            if (props.orderData?.zone) {
                formState.packageInfo2 = `Zone (${props.orderData.zone})`
            } else if (props.customerData.zip) {
                calculateZoneFromZip(props.customerData.zip)
            }
        }
    }
}

// Calculate zone from zip
const calculateZoneFromZip = async (zip: string) => {
    try {
        await useApiFetch(`/api/common/shipping-label/zone?zip=${zip}`, {
            method: 'GET',
            onResponse: ({ response }) => {
                if (response.status === 200) {
                    formState.packageInfo2 = `Zone (${response._data.body[0].ground})`
                }
            }
        })
    } catch (error) {
        console.error('Failed to calculate zone:', error)
    }
}

const confirmNameInclusion = (include: boolean) => {
    showNameConfirmDialog.value = false
    if (pendingOperation.value) {
        pendingOperation.value(include)
        pendingOperation.value = null
    }
}

// Print functions
const handlePrint = () => {
    showCopiesDialog.value = true
}
const confirmPrint = async () => {
    if (copies.value < 1) return;

    printing.value = true;
    try {
        // Get the preview HTML content
        const previewLabel = document.querySelector('.preview-label')
        if (!previewLabel) throw new Error('Preview element not found')

        const labelHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: monospace;
                        }
                        .label-page {
                            page-break-after: always;
                            padding: 20px;
                        }
                        .label-page:last-child {
                            page-break-after: avoid;
                        }
                        .package-info {
                            margin-bottom: 2rem;
                        }
                        .shipping-address {
                            padding-left: 6rem;
                        }
                    </style>
                </head>
                <body>
                    ${Array(copies.value).fill(previewLabel.outerHTML).join('\n')}
                </body>
            </html>
        `

        // Send to API for PDF generation
        await useApiFetch('/api/common/shipping-label/print', {
            method: 'POST',
            body: {
                html: labelHtml
            },
            onResponse: ({ response }) => {
  const blob = new Blob([response._data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
            }
        })
   
        showCopiesDialog.value = false

        useToast().add({
            title: 'Success',
            description: `Generated ${copies.value} label(s)`,
            color: 'green'
        })
    } catch (error) {
        console.error('Print error:', error)
        useToast().add({
            title: 'Error',
            description: 'Failed to generate labels',
            color: 'red'
        })
    } finally {
        printing.value = false
    }
}
onClickOutside(isOpen, () => {
    isOpen.value = false
})
// Initialize
onMounted(async () => {
    if (props.action === 'VENDOR' && props.vid) {
        loadVendorData()
    } else if (props.customerData) {
        loadCustomerData()
    }
    await loadProducts()
})

// Cleanup
onUnmounted(() => {
    scrollPosition.value = 0
})
</script>