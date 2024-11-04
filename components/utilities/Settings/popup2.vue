<script setup>
import { ref, defineProps, defineEmits } from "vue";
const toast = useToast();

// Props
const props = defineProps({
  selectedRow: Object,
  isOpen: {
    type: Boolean,
    default: true,
  },
  submitData: {
    type: Object,
    required: true,
  },
});

// Ref for input field
const inputFieldData = ref("");

// Emit events
const emit = defineEmits(["close", "save"]);
const handleSubmit = () => {
  emit("save", inputFieldData.value);
};

const closePopup = () => {
  emit("close");
};
</script>

<template>
  <div class="py-[10px]">
 
      <div class="col-span-12 w-full py-10px">
        <p class="text-sm text-gray-500 py-[10px] bg-white mb-[10px] justify-center flex">
          Are you Sure you wish to rest and Seed Permission ?
        </p>
      </div>

      <div class="flex justify-center space-x-2">
        <UButton  variant="outline" @click="closePopup" class="px-[22px]">Yes</UButton>
        <UButton  variant="outline" @click="closePopup" class="px-[22px]">No</UButton>
        <UButton  variant="outline" @click="closePopup">Cancel</UButton>
      </div>
    </div>

</template>
