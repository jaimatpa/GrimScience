<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['close'])

const state = reactive({
  fname: undefined,
  md: undefined,
  lname: undefined,
  title: undefined,
  position: undefined,
  company1: undefined,
  company2: undefined,
  coutry: undefined,
  address: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,
  fax: undefined,
  email: undefined,
  website: undefined,
  homephone: undefined,
  workphone: undefined,
  cellphone: undefined,
  ext: undefined,
  comment: undefined
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  console.log(state.fname, state.lames)
  if (!state.fname) errors.push({ path: 'fname', message: 'Please enter your frist name.' })
  if (!state.lname) errors.push({ path: 'lname', message: 'Please enter a your last name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  emit('close')
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col">
      <div class="flex flex-row space-x-1">
        <div class="basis-1/3">
          <UFormGroup
            label="Frist"
            name="fname"
          >
            <UInput
              v-model="state.fname"
              placeholder="John"
              autofocus
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
          <UFormGroup
            label="Middle"
            name="md"
          >
            <UInput
              v-model="state.md"
              placeholder="John"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/3">
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
      </div>
      <div class="flex flex-row space-x-1 mt-1">
        <div class="basis-1/2">
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
        <div class="basis-1/2">
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
      <div class="flex flex-row space-x-1 mt-1">
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
      <div class="flex flex-row space-x-1 mt-1">
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
            <UInput
              v-model="state.state"
              placeholder="NY"
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
      <div class="flex flex-row space-x-1 mt-1">
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
      <div class="flex flex-row space-x-1 mt-1">
        <div class="basis-1/2">
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
        <div class="basis-1/2">
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
      </div>
      <div class="flex flex-row space-x-1 mt-1">
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
      <div class="flex flex-row space-x-1 mt-1">
        <div class="w-full">
          <UFormGroup
            label="Ext"
            name="ext"
          >
            <UInput
              v-model="state.ext"
              placeholder="1"
            />
          </UFormGroup>
        </div>
      </div>
      <div class="flex flex-row space-x-1 mt-1">
        <div class="w-full">
          <UFormGroup
            label="comment"
            name="comment"
          >
            <UInput
              v-model="state.comment"
              type="text"
              placeholder=""
            />
          </UFormGroup>
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
