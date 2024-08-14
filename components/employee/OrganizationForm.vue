<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';

const emit = defineEmits(['close', 'save'])
const props = defineProps({
    selectedOrganization: {
        type: [String, Number, null],
        required: true
    },
    isModal: {
        type: [Boolean]
    }
})

const toast = useToast()
const router = useRouter()
const organizationFormInstance = getCurrentInstance();
const loadingOverlay = ref(false)
const organizaationExist = ref(true)
const isLoading = ref(false)
const formData = reactive({
    ReportsTo: null,
    Title: null,
    Employee: null,
    JobDescription: null,
    WorkCenters:  null
})

const editInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/employees/organization/${props.selectedOrganization}`, {
        method: 'GET',
        onResponse({ response }) {
            if (response.status === 200) {
                loadingOverlay.value = false
                organizaationExist.value = true

                for (const key in response._data.body) {
                    if (response._data.body[key] !== undefined) {
                        formData[key] = response._data.body[key];
                    }
                }
            }
        },
        onResponseError({ }) {
            organizaationExist.value = false
        }
    })
    loadingOverlay.value = false
}

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.ReportsTo) errors.push({ path: 'ReportsTo', message: 'Please enter your report name.' })
    if (!state.Title) errors.push({ path: 'Title', message: 'Please enter a your title.' })
    if (!state.Employee) errors.push({ path: 'Employee', message: 'Please enter your name.' })
    // if (!state.JobDescription) errors.push({ path: 'JobDescription', message: 'Please enter your Job Description.' })
    // if (!state.WorkCenters) errors.push({ path: 'WorkCenters', message: 'Please enter your Work Centers.' })
    return errors
}
const handleClose = async () => {
    if (organizationFormInstance?.vnode?.props.onClose) {
        emit('close')
    } else {
        router.go(-1)
    }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
    if (props.selectedOrganization === null) { // Create Organization
        isLoading.value = true

        await useApiFetch('/api/employees/organization', {
            method: 'POST',
            body: event.data,
            onResponse({ response }) {
                if (response.status === 200) {
                    isLoading.value = false
                    toast.add({
                        title: "Success",
                        description: response._data.message,
                        icon: 'i-heroicons-check-circle',
                        color: 'green'
                    })
                }
            }
        })
    } else { // Update Organization
        await useApiFetch(`/api/employees/organization/${props.selectedOrganization}`, {
            method: 'PUT',
            body: event.data,
            onResponse({ response }) {
                if (response.status === 200) {
                    toast.add({
                        title: "Success",
                        description: response._data.message,
                        icon: 'i-heroicons-check-circle',
                        color: 'green'
                    })
                }
            }
        })
    }
    emit('save')
}

const modalMeta = ref({
    modalTitle: "View Position",
    modalDescription: "",
    isPositionModalOpen: false,
});



if (props.selectedOrganization !== null)
    editInit()
</script>

<template>
    <div class="vl-parent">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
            loader="dots" />
    </div>
    <template v-if="!props.isModal && !organizaationExist">
        <CommonNotFound :name="'Organization not found'" :message="'The organization you are looking for does not exist'"
            :to="'/employees/organization'" />
    </template>
    <template v-else>

        <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">
            <div class="">
                <div class="flex flex-col space-y-4">
                    <div class="flex flex-row space-x-3">
                        <div class="basis-2/6">
                            <UFormGroup label="Reports To" name="ReportsTo">
                                <UInput v-model="formData.ReportsTo" placeholder="" />
                            </UFormGroup>
                        </div>
                        <div class="basis-2/6">
                            <UFormGroup label="Title" name="Title">
                                <UInput v-model="formData.Title" placeholder="" />
                            </UFormGroup>
                        </div>
                        <div class="basis-2/6">
                            <UFormGroup label="Employee" name="Employee">
                                <UInput v-model="formData.Employee" placeholder="" />
                            </UFormGroup>
                        </div>
                    </div>

                    <div class="flex flex-row space-x-5">
                        <div class="basis-1/2">
                            <UFormGroup label="Job Description" name="JobDescription">
                                <UTextarea v-model="formData.JobDescription" :rows="4" type="text" placeholder="" />
                            </UFormGroup>
                        </div>
                        <div class="basis-1/2">
                            <UFormGroup label="Work Centers" name="WorkCenters">
                                <UTextarea v-model="formData.WorkCenters" :rows="4" type="text" placeholder="" />
                            </UFormGroup>
                        </div>
                    </div>
                </div>
            </div>


            <div class="flex flex-row space-x-4 justify-end mt-2">
                <div class="w-[120px]">
                    <UButton variant="outline" color="red" :label="!isModal ? 'Go back' : 'Cancel'"
                        :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" @click="handleClose" truncate />
                </div>
                <div>
                    <UButton :disabled="selectedOrganization === null && true " icon="i-heroicons-eye" label="View Position Details" variant="outline" :ui="{base: 'min-w-[200px] w-full', truncate: 'flex justify-center w-full'}" @click="modalMeta.isPositionModalOpen = true" truncate/>
                </div>
                <div v-if="selectedOrganization === null" class="w-[180px]">
                    <UButton icon="i-heroicons-plus-20-solid" type="submit" variant="outline" color="green"
                    :disabled="isLoading" label="Add Employee" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
                </div>
                <div v-else class="w-[180px]">
                    <UButton icon="i-heroicons-pencil-square" type="submit" variant="outline" color="blue"
                        label="Modify Employee" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }"
                        :disabled="isLoading" truncate />
                </div>
            </div>
        </UForm>
    </template>

    <!-- New Positon  Modal -->
  <UDashboardModal
    v-model="modalMeta.isPositionModalOpen"
    :title="modalMeta.modalTitle"
    :description="modalMeta.modalDescription"
    :ui="{
      width: 'w-[1600px] sm:max-w-8xl',
      body: { padding: 'py-0 sm:pt-0' },
    }"
  >
    <EmployeeViewPositionForm
      @close="{}"
      @save="{}"
      :selected-organization="selectedOrganization"
      :is-modal="true"
    />
  </UDashboardModal>
</template>
