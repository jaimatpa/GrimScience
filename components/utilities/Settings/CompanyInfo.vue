<script lang="ts" setup>
import { ref, onMounted } from "vue";

const companyAllData = ref({
  creditStoreUserName: "",
  creditStoreName: "",
  creditCardPassword: "",
  laborrate: "",
  serviceLaborRate: "",
  travelrate: "",
  onsiterate: "",
  profitRate: "",
  upsellrate: "",
});

onMounted(async () => {
  await init();
  await allCompanyData();
});

const init = async () => {};

const allCompanyData = async () => {
  await useApiFetch(`/api/utilities/Settings/getData?type=companyInfo`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.companyDataList;
        companyAllData.value = filters;
    
      }
    },
  });
};


// const saveAllData = async () => {
//   try {
//     const formData = {
//       creditStoreUserName: companyAllData.value.creditStoreUserName,
//       creditStoreName: companyAllData.value.creditStoreName,
//       creditCardPassword: companyAllData.value.creditCardPassword,
//       laborrate: companyAllData.value.laborrate,
//       serviceLaborRate: companyAllData.value.serviceLaborRate,
//       travelrate: companyAllData.value.travelrate,
//       onsiterate: companyAllData.value.onsiterate,
//       profitRate: companyAllData.value.profitRate,
//       upsellrate: companyAllData.value.upsellrate,
//     };
    
//     console.log("hello API POST -----------------", formData);
//     debugger;

//     await useApiFetch(`/api/utilities/Settings/insertData`, {
//       method: "POST",
//       body: JSON.stringify(formData), // Send data to the API
//       headers: {
//         "Content-Type": "application/json",
//       },
//       onResponse({ response }) {
//         if (response.status === 200) {
//           console.log("Data successfully saved!", response);
//         }
//       },
//     });
//   } catch (error) {
//     console.error("Error saving data:", error);
//   }
// };


</script>

<template>
  <div class="py-2">
    <h3>CREDIT CARD PROCESSING INFORMATION</h3>
  </div>

  <div class="grid grid-cols-3">
    <div class="space-y-2">
      <UFormGroup label="User Name">
        <UInput v-model="companyAllData.creditStoreUserName" />
      </UFormGroup>
      <UFormGroup label="Store Name">
        <UInput v-model="companyAllData.creditStoreName" />
      </UFormGroup>
      <UFormGroup label="Password">
        <UInput v-model="companyAllData.creditCardPassword" />
      </UFormGroup>
    </div>

    <div class=""></div>

    <div class="space-y-2">
      <UFormGroup label="Direct Labor Rate">
        <UInput v-model="companyAllData.laborrate" />
      </UFormGroup>
      <UFormGroup label="Service Labor Rate">
        <UInput v-model="companyAllData.serviceLaborRate" />
      </UFormGroup>
      <UFormGroup label="Travel Labor Rate">
        <UInput v-model="companyAllData.travelrate" />
      </UFormGroup>
      <UFormGroup label="Mileage Rate">
        <UInput v-model="companyAllData.onsiterate" />
      </UFormGroup>
      <UFormGroup label="Profit Rate">
        <UInput v-model="companyAllData.profitRate" />
      </UFormGroup>
      <UFormGroup label="Upsell Rate">
        <UInput v-model="companyAllData.upsellrate" />
      </UFormGroup>
    </div>
  </div>

  <div class="flex justify-end space-x-3 pt-3">
    <UButton
      icon="i-heroicons-document-text"
      label="Save"
      color="green"
      variant="outline"
      truncate
      @click="saveAllData"
    />

    <UButton
      icon="i-heroicons-document-text"
      label="Cancel"
      color="red"
      variant="outline"
      truncate
    />
  </div>
</template>
