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
  const user = useCookie<string>('user');

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
      if (response.status === 200) {
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
          user.value = JSON.stringify(response._data.body);
          token.value = response._data.token;
          await navigateTo("/")
        }
      }
    })
  }

init();
</script>

 <template>
  <div class="bg-gray-700 px-[20px] py-[30px]">
    <div class="w-[360px]">
 
      <div class="flex justify-center items-center mb-4">
        <img src="../public/grimm_logo_menu_dropshadow_v2.png" alt="Grimm Logo" />
      </div>

      <div class="vl-parent mb-4">
        <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
          loader="dots" />
      </div>


      <UCard class="w-full bg-gray-500 border border-gray-600">
        <div class="text-center text-2xl font-[1000] w-full text-white">
          Welcome
        </div>
        <UForm :schema="schema" :state="formData" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Username" name="user">
            <UInputMenu v-model="formData.user" v-model:query="formData.user" :options="users" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="formData.password" type="password" />
          </UFormGroup>
          <UButton type="submit"
          
          :ui="{
              base: 'w-full justify-center border border-gray-600 0 ',
              
              text: 'text-gray-600',
             
            }"
             style="background-color: #2d3748;"
            >
            Login
          </UButton>
        </UForm>
      </UCard>


      <div class="mt-4 text-center text-white">
        © Copyright 2024 - Grimm Scientific Industries
      </div>
      <div class="text-center text-white text-sm">
        Commit ID {COMMIT}
      </div>
    </div>
  </div>
</template>

<!-- <template>


  <div>
    <div class="w-[360px] flex justify-center items-center">
      <img src="../public/grimm_logo_menu_dropshadow_v2.png" alt="Grimm Logo" />
    </div>
    <div class="vl-parent">
      <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
        loader="dots" />
    </div>
    <UCard class="w-[360px]">
      <div class="text-center text-2xl font-[1000] w-full">
        Welcome
      </div>
      <UForm :schema="schema" :state="formData" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Username" name="user">
          <UInputMenu v-model="formData.user" v-model:query="formData.user" :options="users" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="formData.password" type="password" />
        </UFormGroup>
        <UButton type="submit" :ui="{
          base: 'w-full justify-center'
        }">
          Login
        </UButton>
      </UForm>
    </UCard>
    <div style="margin-top: 20px; text-align: center;">
      © Copyright 2024 - Grimm Scientific Industries
    </div>
    <div style="margin-top: 5px; font-size: 10px; text-align: center">
      Commit ID {COMMIT}
    </div>
  </div>


</template> -->
