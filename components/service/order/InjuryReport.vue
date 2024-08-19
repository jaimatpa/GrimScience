<script setup lang="ts">
  import type { FormError } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';
  import { format } from 'date-fns'

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedComplaint: {
      type: [Number, String, null],
    }
  })
  const toast = useToast()
  const loadingOverlay = ref(false)
  const formData = reactive({
    PERSONREPORTING: null,
    DATEREPORTED: null,
    TIMEREPORTED: null, 
    INJUREDNAME: null,
    ADDRESS: null,
    DATEINJURED: null,
    CITY: null,
    ZIP: null,
    HOMEPHONE: null, 
    WORKPHONE: null,
    INJURYDESC: null, 
    PATIENTTREATED: null,
    HOSPNAME: null,
    PHYSTREAT: null,
    PHYSNAME: null,
    PHYSCOMMENTS: null, 
    PHYSNO: null,
    LASTVISIT: null, 
    UNDERCARE: null,
    INJURYNATURE: null, 
    DEATH: null,
    REPORTBYDATE: null,
    REVIEWBYDATE: null,
    REPORTBY: null, 
    REVIEWBY: null, 
    STATE: null
  })
  const statusGroup = ref([
    { value: 0, label: "No" },
    { value: 1, label: "Yes" },
  ]);
  const injuryGroup = ref([
    { value: 0, label: "Minor Injury(Blister, Small Cut, Etc.)" },
    { value: 1, label: "Serious Injury(Loss of Limb, Sight, Etc.)" },
    { value: 2, label: "Death" }
  ])
  const employees = ref([])
  const usstates = ref([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]);

  const editInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/service/orders/${props.selectedComplaint}`, {
      method: 'GET',
      onResponse({response}) {
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    })
    await propertiesInit()
  }
  const propertiesInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/tbl/tblEmployee?ACTIVE=1`, {
      method: 'GET',
      onResponse({response}) {
        if(response.status === 200) {
          employees.value = response._data.body.map(item=>`${item.fname||''} ${item.lname||''}`)
          employees.value.unshift(null)
        }
      }
    })
    loadingOverlay.value = false
  }
  const validate = (state: any): FormError[] => {
    const errors = []

    return errors
  }
  const onSave = async () => {
    await useApiFetch(`/api/service/orders/${props.selectedComplaint}`, {
      method: 'PUT',
      body: {
        ...formData
      },
      onResponse({response}) {
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
    emit('close')
  }

  if(props.selectedComplaint) 
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="formData"
  >
    <div class="flex flex-col">
      <div class="flex justify-between px-4 py-2 gmsTealTitlebar">
        <h2 class="flex items-center">Patient Information</h2>
      </div>
      <div class="px-4 py-1 flex flex-col space-y-1">
        <div class="flex flex-row space-x-2">
          <div class="basis-5/12">
            <UFormGroup label="Person Reporting">
              <UInput v-model="formData.PERSONREPORTING"/>
            </UFormGroup>
          </div>
          <div class="basis-7/12 flex flex-row space-x-2">
            <div class="basis-1/3 w-full">
              <UFormGroup label="Date Reported">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DATEREPORTED && format(formData.DATEREPORTED, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.DATEREPORTED" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Time Reported">
                <UInput v-model="formData.TIMEREPORTED"/>
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Date of Injury">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DATEINJURED && format(formData.DATEINJURED, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                  <template #panel="{ close }">
                    <CommonDatePicker v-model="formData.DATEINJURED" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="flex flex-row space-x-2">
          <div class="basis-5/12">
            <UFormGroup label="Injured Patient's Name">
              <UInput v-model="formData.INJUREDNAME"/>
            </UFormGroup>
          </div>
          <div class="basis-7/12 flex flex-row space-x-2">
            <div class="basis-1/3">
              <UFormGroup label="Home Phone">
                <UInput v-model="formData.HOMEPHONE"/>
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Work Phone">
                <UInput v-model="formData.WORKPHONE"/>
              </UFormGroup>
            </div>
            <div class="basis-1/3"></div>
          </div>
        </div>
        <div class="flex flex-row space-x-2">
          <div class="basis-5/12">
            <UFormGroup label="Address">
              <UInput v-model="formData.ADDRESS"/>
            </UFormGroup>
          </div>
          <div class="basis-7/12 flex flex-row space-x-2">
            <div class="basis-6/12 w-full">
              <UFormGroup label="City">
                <UInput v-model="formData.CITY"/>
              </UFormGroup>
            </div>
            <div class="basis-2/12 w-full">
              <UFormGroup label="State">
                <USelect v-model="formData.STATE" :options="usstates" />
              </UFormGroup>
            </div>
            <div class="basis-1/3">
              <UFormGroup label="Zip">
                <UInput v-model="formData.ZIP"/>
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="w-full">
          <UFormGroup label="Patient's Description of Injury">
            <UTextarea :rows="3" v-model="formData.INJURYDESC"/>
          </UFormGroup>
        </div>
      </div>
      <div  class="px-4 pt-2 border-[1px] border-slate-600 border-l-0 border-b-0 border-r-0 mt-1 flex flex-col space-y-2">
        <div class="flex flex-row space-x-4">
          <div class="basis-5/12 h-[186px]">
            <div class="border-[1px] border-slate-300 p-2 pt-1 h-full">
              <UFormGroup label="1. Was patient treated at hospital?">
                <div class="p-2">
                  <div class="flex flex-row space-x-5">
                    <URadio 
                      v-for="status of statusGroup"
                      :key = 'status.value'
                      v-model="formData.PATIENTTREATED"
                      v-bind="status"
                    />
                  </div>
                  <div class="mt-1">
                    <UFormGroup label="Name of Hospital">
                      <UInput v-model="formData.HOSPNAME" />
                    </UFormGroup>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
          <div class="basis-7/12">
            <div class="border-[1px] border-slate-300 p-3 pt-1 pb-0">
              <UFormGroup label="2. Did physician trean injured patient?">
                <div class="p-2 flex flex-row space-x-3">
                  <div class="basis-1/2">
                    <div class="flex flex-row space-x-5">
                      <URadio 
                        v-for="status of statusGroup"
                        :key = 'status.value'
                        v-model="formData.PHYSTREAT"
                        v-bind="status"
                      />
                    </div>
                    <div class="mt-1">
                      <UFormGroup label="Physician">
                        <UInput v-model="formData.PHYSNAME" />
                      </UFormGroup>
                    </div>
                    <div class="mt-1">
                      <UFormGroup label="Physician Phone">
                        <UInput v-model="formData.PHYSNO" />
                      </UFormGroup>
                    </div>
                  </div>
                  <div class="basis-1/2 mt-1">
                    <UFormGroup label="Physician">
                      <UTextarea :rows="5" v-model="formData.PHYSCOMMENTS"/>
                    </UFormGroup>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="flex flex-row space-x-4">
          <div class="basis-5/12">
            <div class="border-[1px] border-slate-300 p-3 pt-1 pb-0">
              <UFormGroup label="3. Is patient still under physician's care?">
                <div class="p-2">
                  <div class="flex flex-row space-x-5">
                    <URadio 
                      v-for="status of statusGroup"
                      :key = 'status.value'
                      v-model="formData.UNDERCARE"
                      v-bind="status"
                    />
                  </div>
                  <div class="mt-1">
                    <UFormGroup label="Date of Last Visit">
                      <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.LASTVISIT && format(formData.LASTVISIT, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-[250px]'}"/>
                        <template #panel="{ close }">
                          <CommonDatePicker v-model="formData.LASTVISIT" is-required @close="close" />
                        </template>
                      </UPopover>
                    </UFormGroup>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
          <div class="basis-7/12 h-[126px]">
            <div class="border-[1px] border-slate-300 p-3 pt-1 pb-0 h-full">
              <UFormGroup label="4. Indicate Nature of Injury">
                <div class="p-2 flex flex-row">
                  <div class="basis-1/2 space-y-2">
                    <URadio 
                      v-for="injury of injuryGroup"
                      :key = 'injury.value'
                      v-model="formData.INJURYNATURE"
                      v-bind="injury"
                    />
                  </div>
                  <div class="flex items-end">
                    <UPopover :popper="{ placement: 'bottom-start' }" :ui="{trigger: 'ml-[-370px] pt-[50px]'}">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.DEATH && format(formData.DEATH, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-[250px]'}"/>
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.DEATH" is-required @close="close" />
                      </template>
                    </UPopover>
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="border-[1px] border-slate-300 p-3 pb-0">
          <UFormGroup label="IMPORTANT!">
            <div class="p-2">
              <p class="font-semibold">Device related death, serious injury, or malfunctions must be reported to FDA within 30 calendar days from becoming aware of the event. Notify Grimm Scientifics' President within 1 hour of any patient injury.</p>
              <div class="flex justify-between mt-2">
                <UFormGroup label="Received By">
                  <div class="flex flex-row space-x-4">
                    <div class="min-w-[350px]">
                      <USelect v-model="formData.REPORTBY" :options="employees"/>
                    </div>
                    <div class="min-w-[350px]">
                      <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.REPORTBYDATE && format(formData.REPORTBYDATE, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                        <template #panel="{ close }">
                          <CommonDatePicker v-model="formData.REPORTBYDATE" is-required @close="close" />
                        </template>
                      </UPopover>
                    </div>
                  </div>
                </UFormGroup>
                <UFormGroup label="Reviewed By">
                  <div class="flex flex-row space-x-4">
                    <div class="min-w-[350px]">
                      <USelect v-model="formData.REVIEWBY" :options="employees"/>
                    </div>
                    <div class="min-w-[350px]">
                      <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.REVIEWBYDATE && format(formData.REVIEWBYDATE, 'dd/MM/yyyy')" variant="outline" :ui="{base: 'w-full'}"/>
                        <template #panel="{ close }">
                          <CommonDatePicker v-model="formData.REVIEWBYDATE" is-required @close="close" />
                        </template>
                      </UPopover>
                    </div>
                  </div>
                </UFormGroup>
              </div>
            </div>
          </UFormGroup>
        </div>
      </div>
      <div class="mt-2 px-4 flex flex-row-reverse">
        <div>
          <UButton icon="i-f7-rays" label="Clear From" color="red" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate/>
        </div>
        <div class="mr-4">
          <UButton icon="i-heroicons-document-text-20-solid" label="Save" color="green" variant="outline" :ui="{base: 'min-w-[200px]', truncate: 'flex justify-center w-full'}" truncate @click="onSave"/>
        </div>
      </div>
    </div>

  </UForm>
</template>