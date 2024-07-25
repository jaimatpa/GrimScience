<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true
  }, 
  isModal: {
    type: [Boolean]
  }
})

const toast = useToast()
const router = useRouter()
const customersFormInstance = getCurrentInstance();
const now = new Date();

const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0'); 
const year = now.getFullYear();

const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');

const formattedDate = month + '/' + day + '/' + year;
const formattedTime = hour + ':' + minute;

const loadingOverlay = ref(false)
const customerExist = ref(true)
const markets = ref([])
const phone = ref({
  type: 'home',
  number: null
})
const phoneTypes = [{
  name: 'home', 
  value: 'Home'
}, {
  name: 'work',
  value: 'Work'
}, {
  name: 'cell', 
  value: 'Cell'
}, {
  name: 'other', 
  value: 'Other'
}]
const formData = reactive({
  CUSTOMER: null,
 vendor: null,
 NAME: null,
 COMPANY: null,
 TAKENBY: null,
 DATE: null,
 MESSAGE: null,
 HOME: null,
 For: null,
 TIME: null
})

const editInit = async () => {
  loadingOverlay.value = true
  await useApiFetch(`/api/customers/messages/${props.selectedCustomer}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {        
        loadingOverlay.value = false
        customerExist.value = true
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    }, 
    onResponseError({}) {
      customerExist.value = false
    }
  })
  propertiesInit()
  loadingOverlay.value = false
}
const propertiesInit = async () => {
  // loadingOverlay.value = true
  await useApiFetch('/api/customers/markets', {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        markets.value = response._data.body;
      }
    }
  })
  // loadingOverlay.value = false
}
const validate = (state: any): FormError[] => {
  const errors = []
  // if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
  // if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
  // if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
const handleClose = async () => {
  if(customersFormInstance?.vnode?.props.onClose) {
    emit('close')
  } else {
    router.go(-1)
  }
}
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if(props.selectedCustomer === null) { // Create Customer
    await useApiFetch('/api/customers/messages', {
      method: 'POST',
      body: event.data, 
      onResponse({ response }) {
        if(response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          })
        }
      }
    })
  } else { // Update Customer
    await useApiFetch(`/api/customers/messages/${props.selectedCustomer}`, {
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

const isCustomerModalOpen = ref(false)

const handleCustomerClick = () => {
  isCustomerModalOpen.value = true
}

const handleCustomerSelect = async (val) => {
  formData.CUSTOMER = val
}

const handleCustomerModalClose = async () => {
  isCustomerModalOpen.value = false
}

if(props.selectedCustomer !== null) 
  editInit()
else 
  propertiesInit()
</script>

<template>
  <div class="vl-parent">
    <loading
      v-model:active="loadingOverlay"
      :is-full-page="true"
      color="#000000"
      backgroundColor="#1B2533"
      loader="dots"
    />
  </div>
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound
      :name="'Customer not found'"
      :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'"
    />
  </template>
  <template v-else>
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="flex flex-col space-y-4">
        <div class="flex flex-row space-x-2">
          <div class="min-w-[200px] cursor-pointer text-center font-bold px-3 py-1 bg-slate-300" @click="handleCustomerClick">
            Customer
          </div>
          <div class="w-full">
            <UInput
              v-model="formData.CUSTOMER"
            />
          </div>
        </div>
        <div class="flex flex-row space-x-2">
          <div class="min-w-[200px] text-center font-bold px-3 py-1 bg-slate-300">
            Vendor
          </div>
          <div class="w-full">
            <UInput
              v-model="formData.vendor"
            />
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-col space-y-3">
              <div class="min-w-[200px]">
                <UFormGroup
                  label="Name"
                  name="name"
                >
                  <UInput
                    v-model="formData.NAME"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
              <div class="min-w-[200px]">
                <UFormGroup
                  label="Company"
                  name="company"
                >
                  <UInput
                    v-model="formData.COMPANY"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="min-w-[200px]">
                <UFormGroup
                  label="For"
                  name="for"
                >
                  <USelect
                    v-model="formData.For"
                    :options="[formData.For]"
                  />
                </UFormGroup>
              </div>
              <div class="min-w-[200px]">
                <UFormGroup
                  label="By"
                  name="by"
                >
                  <USelect
                    v-model="formData.TAKENBY"
                    :options="[formData.TAKENBY]"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="min-w-[200px]">
                <UFormGroup
                  label="Date"
                  name="date"
                >
                  <UInput
                    v-model="formData.DATE"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
              <div class="min-w-[200px]">
                <UFormGroup
                  label="Time"
                  name="time"
                >
                  <UInput
                    v-model="formData.TIME"
                    placeholder=""
                  />
                </UFormGroup>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-y-4">
            <div>
              <UFormGroup
                label="Home"
                name="phone"
              >
                <div class="mt-2">
                  <UInput
                    v-model="formData.HOME"
                    placeholder=""
                  />
                </div>
              </UFormGroup>
            </div>
            <div>
              <UFormGroup
                label="Work"
                name="phone"
              >
                <div class="mt-2">
                  <UInput
                    v-model="phone.number"
                    placeholder=""
                  />
                </div>
              </UFormGroup>
            </div>
            <div>
              <UFormGroup
                label="Cell"
                name="phone"
              >
                <div class="mt-2">
                  <UInput
                    v-model="phone.number"
                    placeholder=""
                  />
                </div>
              </UFormGroup>
            </div>
            <div>
              <UFormGroup
                label="Other"
                name="phone"
              >
                <div class="mt-2">
                  <UInput
                    v-model="phone.number"
                    placeholder=""
                  />
                </div>
              </UFormGroup>
            </div>
          </div>
          
        </div>
        <div class="w-full">
          <UFormGroup
            label="Message"
            name="mesage"
          >
            <UTextarea v-model="formData.MESSAGE" color="white" variant="outline" placeholder="Please leave your message..." />
          </UFormGroup>
        </div>
      </div>
  
      <div class="flex justify-end gap-3">
        <UButton
          :label="!isModal ? 'Go back': 'Cancel'"
          color="gray"
          variant="ghost"
          @click="handleClose"
        />
        <UButton
          type="submit"
          label="Save"
          color="black"
        />
      </div>
    </UForm>
    <!-- Site Visit Modal -->
    <UDashboardModal
      v-model="isCustomerModalOpen"
      title="Select Customer"
      :ui="{
        title: 'text-lg',
        header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' }, 
        body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
        width: 'w-[1200px] sm:max-w-8xl'
      }"
    >
      <CustomersCustomerList @select="handleCustomerSelect" @close="handleCustomerModalClose" />
    </UDashboardModal>
  </template>
</template>
