<script setup lang="ts">
import type subcategory from '~/server/api/projects/usedParts/subcategory';
import type { FormError, FormSubmitEvent } from '#ui/types'
import DatePickerClient from '~/components/common/DatePicker.client.vue';
import { format } from 'date-fns';

useSeoMeta({
    title: 'Grimm-skill'
  })
const formData = reactive({
  Catagory: null,
  subcatagory: null,
  Name: null,
  weeks:null,
  frequency:null,
  date:ref(new Date()),
  courseoutline:null,

})
const emit = defineEmits(['close', 'save'])
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
  emit('save')
  


  
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
            subCategory.value = response._data.body
  .filter(item => item != null) // Filter out null or undefined values
  .map(item => {
    // Perform any additional mapping if needed
    return item;
  });
            console.log("sub catagory is",response._data.body);
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
        <div class="basis-2/6">
          <UFormGroup
            label="Categeory"
            name="Categeory"
          >
            <USelectMenu
              v-model="formData.Catagory"
              placeholder="Categeory"
              :options="category"
            />
          </UFormGroup>
        </div>
        <div class="basis-2/6">
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
        <div class="basis-2/6">
          <UFormGroup
            label="Frequency"
            name="Frequency"
          >
            <UInput
              v-model="formData.frequency"
              placeholder="Frequency"
              :options="subCategory"
            />
          </UFormGroup>
        </div>




    </div>
<div class="flex flex-row space-x-3">

       
  <div class="basis-2/6">
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

        <div class="basis-2/6">
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

        <div class="basis-2/6">
                <UFormGroup
                  label="Date Opened"
                  name="DOpened"
                >
                <UPopover :popper="{ placement: 'bottom-start' }">
                          <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(formData.date, 'd MMM, yyy')"  variant="outline" :ui="{base: 'w-full', truncate: 'flex justify-center w-full'}" truncate/>
                          <template #panel="{ close }">
                            <DatePickerClient v-model="formData.date" is-required @close="close" />

                          </template>
                        </UPopover>
                    </UFormGroup>
              </div>
  </div>
    <div >
          <UFormGroup
            label="Description"
            name="Description"
          >
            <UTextarea
              v-model="formData.Name"
              placeholder="Description"
            />
          </UFormGroup>
        </div>


    <UButton color="cyan" variant="outline"
          type="submit"
          label="Save"
          @click="onSubmit"
          
        />
    </UForm>

    
</template>
