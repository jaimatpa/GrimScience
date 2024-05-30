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
  const toast = useToast()

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
    customAxios({
      method: 'GET',
      url: '/api/auth/employees'
    }).then((res)=>{
      if(res.status == 200){
        loadingOverlay.value = false
        users.value = res.data.body
      }
    })
  }

  const onSubmit = async (event: FormSubmitEvent<FormDataSchema>) => {
    const res = await customAxios({
      method: 'POST',
      url: '/api/auth/login',
      data: event.data
    })
    if (res?.status == 200) {
      token.value = res.data.token;
      await navigateTo("/")
    }
  }

  init();
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
  <UCard 
    class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
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

      <div class=" text-center w-full">
        <UButton 
          type="submit" 
          trailingIcon="i-heroicons-arrow-right-20-solid"
        >
          Submit
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
