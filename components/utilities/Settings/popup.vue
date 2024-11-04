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
  <div class="py-[10px] px-[30px]">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8">
        <p class="text-sm text-gray-500 whitespace-pre-line pr-[10px]">
          Please update your Sharepoint path to and including the Paradynamix
          Sharepoint (i.e. "\\Users\Lefti Snifton\OneDrive - Paradynamix\Paradynamix")
        </p>
      </div>

      <div class="col-span-4 flex flex-col items-end space-y-2">
        <UButton variant="outline" @click="handleSubmit" class="px-[22px]">Ok</UButton>
        <UButton variant="outline" @click="closePopup">Cancel</UButton>
      </div>

      <div class="col-span-12 mt-4">
        <UInput v-model="inputFieldData" />
      </div>
    </div>
  </div>
</template>

