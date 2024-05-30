<script setup lang="ts">
import { tr } from 'date-fns/locale';

const { userInfo } = useDashboard()

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login'
})

const token = useCookie<string>('token');
const toast = useToast()

const loading = ref(false);
let fields = ref([{
  name: 'user',
  type: 'select',
  label: 'Username',
  placeholder: 'Select your username',
  options: []
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}])

const init = () => {
  loading.value = true;
  customAxios({
    method: 'GET',
    url: '/api/auth/employees'
  }).then((res)=>{
    if(res.status == 200){
      loading.value = false
      fields.value[0].options = res.data.body
    }
  })
}

const validate = (state: any) => {
  console.log(state);
  const errors = []
  if (!state.user) errors.push({ path: 'user', message: 'Username is required' })
  else if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const onSubmit = async (data: any) => {
  // const errors = validate(data);
  // if (errors.length === 0) {
    const res = await customAxios({
      method: 'POST',
      url: '/api/auth/login',
      data: data
    }).then(res=>{
      if (res?.status == 200) {
        token.value = res.data.token;
        userInfo.value = res.data.body;
        navigateTo("/")
      }
    })
  // }
}

init();
</script>

<template>
  <ULandingCard 
    class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
  >
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
  </ULandingCard>
</template>
