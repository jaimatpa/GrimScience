<script setup>
import { ref, defineProps } from 'vue';

// Props
const props = defineProps({
  selectedRow: Object,
  isOpen: {
    type: Boolean,
    default: false,
  },
  submitData: {
    type: Object,
    required: true,
  },
});

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

  console.log(formData);

  try {
    const { data, error } = await useFetch("/api/materials/requisitions/postAllDataApi?type=Popup", {
      method: "POST",
      body: formData,
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

// Close the popup
const closePopup = () => {
  props.isOpen = false;
};
</script>

<template>
  <div class="py-[30px] px-[30px]">
    <p>Selected Row: {{ props.selectedRow.DESCRIPTION }}</p>
    <p>Selected Row: {{ props.selectedRow.STOCKNUMBER }}</p>
    <p>selectedRow Option: {{ props.selectedRow.description }}</p>
    <p>Employee Option: {{ props.submitData.employeeOption }}</p>
    <p>Input Data: {{ props.submitData.inputData }}</p>
    <p>Required Date: {{ props.submitData.requireDate }}</p>
    
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8">
        <UInput v-model="inputFieldData" label="Enter a value" class="mt-4" />
      </div>

      <div class="col-span-4 flex space-x-2">
        <UButton
          class="px-[30px] py-[2px] border border-[#4682B4] text-[#4682B4] bg-transparent hover:text-white"
          @click="handleSubmit"
        >
          Ok
        </UButton>

        <UButton
          class="px-[30px] py-[2px] text-red-600 border border-red-600 bg-transparent hover:bg-red-600 hover:text-white"
          variant="ghost"
          @click="closePopup"
        >
          Cancel
        </UButton>
      </div>
    </div>
  </div>
</template>


<!-- <script>
export default {
  props: {
    selectedRow: Object,
    isOpen: {
      type: Boolean,
      default: false,
    },
    submitData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      inputValue: "",
    };
  },

  methods: {
    handlePopupSubmit() {
      this.$emit("save", this.inputValue);
    },
    closePopup() {
      this.$emit("close");
    },
  },
};

const inputFieldData =ref()


const handleSubmit = async () => {

  const formData = {
    Needed: inputFieldData.value,
    STOCKNUMBER: selectedRow.value.STOCKNUMBER,
    Date: submitData.value.inputData,
    RequireDate: submitData.value.requireDate,
    Employee: submitData.value.employeeOption,
  };

console.log(formData)

  try {
    const { data, error } = await useFetch("/api/maintenance/equipment/insertData", {
      method: "POST",
      body: formData,
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




</script>

<template>
  <div class="py-[30px] px-[30px]">
    <p>Selected Row: {{ selectedRow.DESCRIPTION }}</p>
    <p>Selected Row: {{ selectedRow.STOCKNUMBER }}</p>
    <p>Employee Option: {{ submitData.employeeOption }}</p>
    <p>Input Data: {{ submitData.inputData }}</p>
    <p>Required Date: {{ submitData.requireDate }}</p>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8">
        <UInput v-model="inputFieldData" label="Enter a value" class="mt-4" />
      </div>

      <div class="col-span-4 flex space-x-2">
        <UButton
          class="px-[30px] py-[2px] border border-[#4682B4] text-[#4682B4] bg-transparent hover:text-white"
          @click="handleSubmit"
        >
          Ok
        </UButton>

        <UButton
          class="px-[30px] py-[2px] text-red-600 border border-red-600 bg-transparent hover:bg-red-600 hover:text-white"
          variant="ghost"
          @click="closePopup"
        >
          Cancel
        </UButton>
      </div>
    </div>
  </div>
</template> -->
