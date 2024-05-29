<script setup lang="ts">
import { useRouter } from '#vue-router';
const { userInfo } = useDashboard()

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login'
})

const router = useRouter();
const token = useCookie<string>('token');
const toast = useToast()

let fields = ref([{
  name: 'user',
  type: 'select',
  label: 'Username',
  placeholder: 'Enter your username',
  options: []
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}])

const init = async () => {
  const res = await customAxios({
    method: 'GET',
    url: '/api/auth/employees'
  })
  if(res.status == 200){
    fields.value[0].options = res.data.body
  }
}

const validate = (state: any) => {
  const errors = []
  if (!state.user) errors.push({ path: 'user', message: 'Username is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const onSubmit = async (data: any) => {
  const res = await customAxios({
    method: 'POST',
    url: '/api/auth/login',
    data: data
  })
  if (res?.status == 200) {
    token.value = res.data.token;
    userInfo.value = res.data.body
    // router.push("/");
    navigateTo("/")
  } else {
    toast.add({title: 'Fail'})
  }
}

init();
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Welcome"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
    
    </UAuthForm>
  </UCard>
</template>
