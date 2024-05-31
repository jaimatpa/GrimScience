<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';

  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    selectedCustomer: {
      type: [Number, null],
      required: true
    }
  })

  const states = [
    'CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'MI', 'GA', 'NC',
    'NJ', 'VA', 'WA', 'MA', 'IN', 'TN', 'MO', 'MD', 'WI', 'MN',
    'AZ', 'CO', 'AL', 'SC', 'LA', 'KY', 'OR', 'OK', 'CT', 'IA',
    'MS', 'AR', 'UT', 'NV', 'WV', 'ID', 'NM', 'NE', 'WY', 'ME',
    'HI', 'NH', 'VT', 'ND', 'SD', 'AK', 'DE', 'MT', 'RI'
  ];

  const loadingOverlay = ref(false)
  const markets = ref([])
  const professions = ref([])
  const categories = ref([])
  const conferences = ref([])
  const state = reactive({
    UniqueID: null,
    market: null,
    number: null,
    source: professions[0],
    sourcedescription: null,
    SourceConfrence: null,
    fname: null,
    mi: null,
    lname: null,
    title: null,
    position: null,
    company1: null,
    company2: null,
    country: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    workphone: null,
    homephone: null,
    cellphone: null,
    fax: null,
    email: null,
    website: null,
    notes: null,
    billcompany1: null,
    billcompany2: null,
    billcountry: null,
    billaddress: null,
    billcity: null,
    billstate: null,
    billzip: null,
    billphone: null,
    billfax: null,
    attn: null,
    adddate: null,
    ParadynamixCatagory: null,
    fullname: null,
    Extension: null,
    ExtensionBill: null,
  })

  const editInit = async () => {
    loadingOverlay.value = true
    await useApiFetch(`/api/tbl/tblCustomers/${props.selectedCustomer}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          loadingOverlay.value = false
          for (const key in response._data.body) {
            if (response._data.body[key] !== undefined) {
              state[key] = response._data.body[key]
            }
          }
        }
      }
    })
    await propertiesInit()
    loadingOverlay.value = false
  }

  const propertiesInit = async () => {
    loadingOverlay.value = true
    loadingOverlay.value = false
  }

  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
    if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
    if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
    return errors
  }

  async function onSubmit(event: FormSubmitEvent<any>) {
    emit('save', event.data)
    emit('close')
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
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex flex-row space-x-3">
      <div class="basis-1/5">
        <UFormGroup
          label="Frist"
          name="fname"
        >
          <UInput
            v-model="state.fname"
            placeholder="John"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Middle"
          name="md"
        >
          <UInput
            v-model="state.mi"
            placeholder="John"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Last"
          name="lname"
        >
          <UInput
            v-model="state.lname"
            placeholder="Doe"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Title"
          name="title"
        >
          <UInput
            v-model="state.title"
            placeholder="Full-Stack Developer"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Position"
          name="position"
        >
          <UInput
            v-model="state.position"
            placeholder="CTO"
          />
        </UFormGroup>
      </div>
    </div>

    <div class="flex flex-row space-x-3">
      <div class="basis-1/5">
        <UFormGroup
          label="Market"
          name="market"
        >
          <UInputMenu
            v-model="state.market"
            v-model:query="state.market"
            :options="markets"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Number"
          name="number"
        >
          <UInput
            v-model="state.number"
            placeholder=""
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Profession"
          name="profession"
        >
          <UInputMenu
            v-model="state.source"
            v-model:query="state.source"
            :options="professions"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Categories"
          name="categories"
        >
          <UInputMenu
            v-model="state.ParadynamixCatagory"
            v-model:query="state.ParadynamixCatagory"
            :options="categories"
          />
        </UFormGroup>
      </div>
      <div class="basis-1/5">
        <UFormGroup
          label="Conferences"
          name="conferences"
        >
          <UInputMenu
            v-model="state.SourceConfrence"
            v-model:query="state.SourceConfrence"
            :options="conferences"
          />
        </UFormGroup>
      </div>
    </div>

    <div class="flex flex-row">
      <div class="basis-1/2 text-center">
        Shipping Information
      </div>
      <div class="basis-1/2 text-center">
        Billing Information
      </div>
    </div>

    <div class="flex flex-row space-x-5">
      <div class="basis-1/2">
        <!-- Shipping Information -->
        <div class="flex flex-col space-y-2">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Company1"
                name="company1"
              >
                <UInput
                  v-model="state.company1"
                  placeholder="Company1"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Company2"
                name="company2"
              >
                <UInput
                  v-model="state.company2"
                  placeholder="Company2"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Country"
                name="country"
              >
                <UInput
                  v-model="state.country"
                  placeholder="Country"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Address"
                name="address"
              >
                <UInput
                  v-model="state.address"
                  placeholder="Address"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="City"
                name="city"
              >
                <UInput
                  v-model="state.city"
                  placeholder="Dallas"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="State"
                name="state"
              >
                <USelect
                  v-model="state.state"
                  :options="states"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="Zip"
                name="zip"
              >
                <UInput
                  v-model="state.zip"
                  placeholder="65254"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Fax"
                name="fax"
              >
                <UInput
                  v-model="state.fax"
                  placeholder="Fax"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Homephone"
                name="homephone"
              >
                <UInput
                  v-model="state.homephone"
                  placeholder="(564)-324-2342"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-6/12">
              <UFormGroup
                label="Email"
                name="email"
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="email"
                />
              </UFormGroup>
            </div>
            <div class="basis-5/12">
              <UFormGroup
                label="Workphone"
                name="workphone"
              >
                <UInput
                  v-model="state.workphone"
                  placeholder="(564)-324-2342"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/12">
              <UFormGroup
                label="Ext"
                name="ext"
              >
                <UInput
                  v-model="state.Extension"
                  placeholder="1"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Website"
                name="website"
              >
                <UInput
                  v-model="state.website"
                  placeholder="website"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Cellphone"
                name="cellphone"
              >
                <UInput
                  v-model="state.cellphone"
                  placeholder="(564)-324-2342"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Comment"
                name="comment"
              >
                <UTextarea
                  v-model="state.notes"
                  :rows="3"
                  type="text"
                  placeholder=""
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/2"> 
        <!-- Billing Information -->
        <div class="flex flex-col space-y-2">
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Company1"
                name="billcompany1"
              >
                <UInput
                  v-model="state.billcompany1"
                  placeholder="Bill Company1"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Company2"
                name="billcompany2"
              >
                <UInput
                  v-model="state.billcompany2"
                  placeholder="Bill Company2"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Country"
                name="country"
              >
                <UInput
                  v-model="state.billcountry"
                  placeholder="Bill Country"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Address"
                name="address"
              >
                <UInput
                  v-model="state.billaddress"
                  placeholder="Bill Address"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="City"
                name="billcity"
              >
                <UInput
                  v-model="state.billcity"
                  placeholder="Dallas"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="State"
                name="billstate"
              >
                <USelect
                  v-model="state.billstate"
                  :options="states"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/4">
              <UFormGroup
                label="Zip"
                name="billzip"
              >
                <UInput
                  v-model="state.billzip"
                  placeholder="65254"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/2">
              <UFormGroup
                label="Fax"
                name="billfax"
              >
                <UInput
                  v-model="state.billfax"
                  placeholder="Fax"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup
                label="Phone"
                name="billphone"
              >
                <UInput
                  v-model="state.billphone"
                  placeholder="(564)-324-2342"
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Ext"
                name="ExtensionBill"
              >
                <UInput
                  v-model="state.ExtensionBill"
                  placeholder=""
                />
              </UFormGroup>
            </div>
          </div>
          <div class="flex flex-row space-x-3">
            <div class="w-full">
              <UFormGroup
                label="Attn"
                name="attn"
              >
                <UInput
                  v-model="state.attn"
                  placeholder="Attn"
                />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton
        type="submit"
        label="Save"
        color="black"
      />
    </div>
  </UForm>
</template>
