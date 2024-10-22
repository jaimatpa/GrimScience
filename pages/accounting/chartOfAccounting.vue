<script lang="ts" setup>
interface ChartAccount {
    AcctNumber: string;
    Description: string;
    UniqueID?: number;
}

const accounts = ref<ChartAccount[]>([])
const selectedAccount = ref<ChartAccount | null>(null)
const isLoading = ref(false)
const columns = [
    {
        key: 'AcctNumber',
        label: 'Number'
    },
    {
        key: 'Description',
        label: 'Name'
    },
    {
        key: 'typeOfAccount',
        label: 'Type of Account'
    },
    {
        key: 'balance',
        label: 'Balance'
    }
]

const initialFormState: ChartAccount = {
    AcctNumber: '',
    Description: '',
    UniqueID: 0
}
const toast = useToast();

const formData = ref<ChartAccount>({ ...initialFormState })

const isEditing = computed(() => selectedAccount.value !== null)

const resetForm = () => {
    formData.value = { ...initialFormState }
    selectedAccount.value = null
}

const handleSelect = (account: ChartAccount) => {
    selectedAccount.value = account
    formData.value = { ...account }
}

const fetchAccounts = async () => {
    isLoading.value = true
    try {
        const response = await useApiFetch('/api/accounting/chartOfAccounting', {
            method: 'GET'
        })
        if (response) {
            accounts.value = response.body
        }
    } catch (error) {
        console.error('Error fetching accounts:', error)
    } finally {
        isLoading.value = false
    }
}

const saveAccount = async () => {
    try {
        if (isEditing.value) {
            await modifyAccount()
        } else {
            await createAccount()
        }
        await fetchAccounts()
        resetForm()
    } catch (error) {
        console.error('Error saving account:', error)
    }
}

const createAccount = async () => {
    const { UniqueID, ...data } = formData.value
    console.log(data)
    await useApiFetch('/api/accounting/chartOfAccounting', {
        method: 'POST',
        body: data,
         onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: response._data.message,
                    icon: "i-heroicons-check-circle",
                    color: "green",
                });
                fetchAccounts();
            }
        },
        onResponseError({response}) {
            toast.add({
                    title: "Error",
                    description: response._data.message,
                    icon: "i-heroicons-exclamation-triangle",
                    color: "red",
                });
        },
    })
}

const modifyAccount = async () => {
    await useApiFetch('/api/accounting/chartOfAccounting', {
        method: 'PUT',
        body: formData.value,
        onResponse({ response }) {
            if (response.status === 200) {
                toast.add({
                    title: "Success",
                    description: response._data.message,
                    icon: "i-heroicons-check-circle",
                    color: "green",
                });
                fetchAccounts();
            }
        },
        onResponseError({response}) {
            toast.add({
                    title: "Error",
                    description: response._data.message,
                    icon: "i-heroicons-exclamation-triangle",
                    color: "red",
                });
        },
    })
}

onMounted(() => {
    fetchAccounts();
})
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar class="gmsTealHeader text-white" title="Accounting">
                <template #right>
                    <UButton color="!white" icon="i-heroicons-printer" variant="ghost">Print View</UButton>
                </template>
            </UDashboardNavbar>

            <div class="px-4 py-2 gmsTealTitlebar">
                <h2>Chart Of Accounting</h2>
            </div>
            <UDashboardPanelContent>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <UFormGroup label="Number">
                        <UInput v-model="formData.AcctNumber" placeholder="Enter account number" />
                    </UFormGroup>

                    <UFormGroup label="Description">
                        <UInput v-model="formData.Description" placeholder="Enter description" />
                    </UFormGroup>
                </div>

                <div class="flex gap-2 mb-6">
                    <UButton variant="outline" color="green"
                        :icon="isEditing ? 'i-heroicons-pencil' : 'i-heroicons-plus'"
                        :label="isEditing ? 'Modify' : 'Add'" @click="saveAccount" />
                    <UButton color="red" variant="outline" icon="i-heroicons-x-mark" label="Clear Form"
                        @click="resetForm" />
                </div>

                <UTable :rows="accounts" :columns="columns" :loading="isLoading" class="w-full" :ui="{
                    divide: 'divide-gray-200 dark:divide-gray-800',
                    th: {
                        base: 'sticky top-0 z-10',
                        color: 'bg-white dark:text-gray dark:bg-[#111827]',
                        padding: 'p-0',
                    },
                    td: {
                        padding: 'py-1',
                    },
                }" :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                }" @select="handleSelect">

                </UTable>
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>