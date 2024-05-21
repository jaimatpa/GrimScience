<script setup lang="ts">
import { useRouter } from '#vue-router';

const router = useRouter();
const token = useCookie<string>('token');
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login'
})

const fields = [{
  name: 'user',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter your username'
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}]

// username mode
const validate = (state: any) => {
  const errors = []
  if (!state.user) errors.push({ path: 'user', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const providers = [{
  label: 'Continue with GitHub',
  icon: 'i-simple-icons-github',
  color: 'white' as const,
  click: () => {
    console.log('Redirect to GitHub')
  }
}]

const onSubmit = async (data: any) => {
  const res:any = await $fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
  if (res) {
    token.value = res.token;
    // setCookie(res, 'token', res.token);
    router.push("/");
  } else {
    console.log("Client Login fail Message", res.error);
  }
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Welcome back"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #description>
        Don't have an account? <NuxtLink
          to="/signup"
          class="text-primary font-medium"
        >Sign up</NuxtLink>.
      </template>

      <template #password-hint>
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Forgot password?</NuxtLink>
      </template>

      <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
