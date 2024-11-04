<script setup>
import { ref, defineProps, defineEmits } from "vue";
const toast = useToast();
// Props
// const props = defineProps({
//   selectedRow: Object,
//   isOpen: {
//     type: Boolean,
//     default: true,
//   },
//   submitData: {
//     type: Object,
//     required: true,
//   },
// });

// Ref for input field
const inputFieldData = ref("");

// Handle form submission
const handleSubmit = async () => {
  const formData = {
    Needed: inputFieldData.value,
    STOCKNUMBER: props.selectedRow.STOCKNUMBER,
    description: props.selectedRow.DESCRIPTION,
    date: props.submitData.DESCRIPTION,
    RequireDate: props.submitData.requireDate,
    Employee: props.submitData.employeeOption,
  };

  try {
    const { data, error } = await useFetch(
      "/api/materials/requisitions/postAllDataApi?type=Popup",
      {
        method: "POST",
        body: formData,
      }
    );
    toast.add({
      title: "Success",
      description: "update successfully.",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
    if (error.value) {
      console.error("Error submitting form:", error.value);
    } else {
      console.log("Form submitted successfully:", data.value);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};
const emit = defineEmits(["close"]);
const closePopup = () => {
  emit(close);
};
</script>

<template>
  <div class="py-[30px] px-[30px]">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-8">
        <UInput v-model="inputFieldData" label="Enter a value" class="mt-4" />
      </div>

      <div class="flex space-x-1">
        <UButton
          class="px-[20px] py-[0px] border border-[#4682B4] text-[#4682B4] bg-transparent hover:text-white"
          @click="handleSubmit"
        >
          Ok
        </UButton>

        <UButton
          class="px-[20px] py-[2px] text-red-600 border border-red-600 bg-transparent hover:bg-red-600 hover:text-white"
          variant="ghost"
          @click="closePopup"
        >
          Cancel
        </UButton>
      </div>
    </div>
  </div>
</template>
