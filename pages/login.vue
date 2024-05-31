<script setup lang="ts">
  import { object, string, type InferType } from 'yup'
  import type { FormSubmitEvent } from '#ui/types' 
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/css/index.css';

  definePageMeta({
    layout: 'auth'
  })

  useSeoMeta({
    title: 'Login'
  })

  const token = useCookie<string>('token');

  const users = ref([])
  const loadingOverlay = ref(false);
  const schema = object({
    user: string().required('Username is required!'),
    password: string()
      .required('Password is required!')
  })

  type FormDataSchema = InferType<typeof schema>

  const formData = ref({
    user: null,
    password: null
  })

  const init = () => {
    loadingOverlay.value = true;
    useApiFetch('/api/auth/employees', {
      onResponse({ response }) {
        if(response.status === 200){
          loadingOverlay.value = false;
          users.value = response._data.body
        }
      }
    })
  }

  const onSubmit = (event: FormSubmitEvent<FormDataSchema>) => {
    useApiFetch('/api/auth/login', {
      method: 'POST',
      body: event.data,
      async onResponse({ response }) {
        if(response.status === 200) {
          token.value = response._data.token;
          await navigateTo("/")
        }
      }
    })
  }

  init();
</script>

<template>
  <div>
    <div class="vl-parent">
      <loading
        v-model:active="loadingOverlay"
        :is-full-page="true"
        color="#000000"
        backgroundColor="#1B2533"
        loader="dots"
      />
    </div>
    <UCard 
      class="w-[360px] bg-white/75 dark:bg-white/5 backdrop-blur"
    > 
      <div class="text-center text-2xl font-[1000] w-full">
        Welcome
      </div>
      <UForm :schema="schema" :state="formData" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Username" name="user">
          <UInputMenu  
            v-model="formData.user" 
            v-model:query="formData.user"
            :options="users"
          />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="formData.password" type="password" />
        </UFormGroup>
        <UButton 
          type="submit" 
          :ui="{
            base: 'w-full justify-center'
          }"
        >
            Login
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
