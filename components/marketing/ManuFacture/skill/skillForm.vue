<script setup lang="ts">
import type subcategory from '~/server/api/projects/usedParts/subcategory';
import type { FormError, FormSubmitEvent } from '#ui/types'
import DatePickerClient from '~/components/common/DatePicker.client.vue';

useSeoMeta({
    title: 'Grimm-skill'
  })
const formData = reactive({
  catagory: null,
  subcatagory: null,
  Name: null,
  weeks:null,
  frequency:null,
  date:ref(new Date()),
  courseoutline:null,

})
const props = defineProps({
  selectedSkill: {
    type: [String, Number, null],
    required: true
  }
})
const category=ref([{}]);
const subCategory=ref([{}]);
const toast = useToast()
const onSubmit = async (event: FormSubmitEvent<any>) => {

  if(props.selectedSkill==null){
    await useApiFetch('/api/projects/skill', {
      method: 'POST',
      body: formData, 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          });
        }
      }
    });

  }
  else{
    console.log("put ");
    await useApiFetch(`/api/projects/skill/${props.selectedSkill}`, {
      method: 'PUT',
      body: formData, 
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: 'i-heroicons-check-circle',
            color: 'green'
          });
        }
      }
    });
  }


  
};

onMounted(() => {
    init()
    if(props.selectedSkill!=null){
      editInit()
    }
  })


  const editInit = async () => {
  await useApiFetch(`/api/projects/skill/${props.selectedSkill}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key]
          }
        }
      }
    },
   
  })
}


  const init = async () => {
    await useApiFetch("/api/projects/skill/category", {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            category.value = response._data.body.filter(item => item !== null);
            console.log("the category  is like",response._data.body);
          }
        }
      })


      await useApiFetch("/api/projects/skill/subCategory", {
        method: 'GET',
        onResponse({ response }) {
          if(response.status === 200) {
            subCategory.value=response._data.body;
            console.log("the response is like",response._data.body);
          }
        }
      })



  }


</script>

<template>
       <UForm
      :validate-on="['submit']"
      :state="formData"
      class="space-y-4"
      
    >

<div class="flex flex-row space-x-3">
        <div class="basis-1/5">
          <UFormGroup
            label="Categeory"
            name="Categeory"
          >
            <USelectMenu
              v-model="formData.catagory"
              placeholder="Categeory"
              :options="category"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Sub Category"
            name="Sub Category"
          >
            <USelectMenu
              v-model="formData.subcatagory"
              placeholder="Sub Category"
              :options="subCategory"
            />
          </UFormGroup>
        </div>

        <div class="basis-1/5">
          <UFormGroup
            label="Description"
            name="Description"
          >
            <UInput
              v-model="formData.Name"
              placeholder="Description"
            />
          </UFormGroup>
        </div>
        <div class="basis-1/5">
          <UFormGroup
            label="Weeks"
            name="Weeks"
          >
            <UInput
              v-model="formData.weeks"
              placeholder="Weeks"
            />
          </UFormGroup>
        </div>

        <div class="basis-1/5">
          <UFormGroup
            label="Course Outline"
            name="Course Outline"
          >
            <UInput
              v-model="formData.courseoutline"
              placeholder="Course Outline"
            />
          </UFormGroup>
        </div>

        <div class="basis-1/2">
                <UFormGroup
                  label="Date Opened"
                  name="DOpened"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid"   variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <DatePickerClient v-model="formData.date" is-required @close="close" />

                          </template>
                        </UPopover>
                    </UFormGroup>
              </div>


    </div>
    <UButton color="cyan" variant="outline"
          type="submit"
          label="Save"
          @click="onSubmit"
          
        />
    </UForm>

    
</template>
