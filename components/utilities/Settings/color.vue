<template>
  <div class="color-picker-wrapper border rounded-lg p-4 bg-white shadow-sm">
    <!-- Color Palette Grid -->
    <div class="grid grid-cols-10 gap-1 mb-4">
      <div
        v-for="color in colorPalette"
        :key="color"
        class="w-6 h-6 rounded-sm cursor-pointer hover:scale-110 transition"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      ></div>
    </div>


    <!-- Grayscale Row -->
    <div class="grid grid-cols-10 gap-1 mb-4">
      <div
        v-for="n in 1"
        :key="n"
        class="w-6 h-6 rounded-sm cursor-pointer hover:scale-110 transition"
        :style="{
          backgroundColor: `rgb(${n * 25.5}, ${n * 25.5}, ${n * 25.5})`,
        }"
        @click="selectColor(`rgb(${n * 25.5}, ${n * 25.5}, ${n * 25.5})`)"
      ></div>
    </div>


    <div class="flex gap-1 mb-4">
    <span>custom color</span><br/>
      <div
        v-for="(color, idx) in customColor"
        :key="idx"
        class="w-6 h-6 rounded-sm cursor-pointer hover:scale-110 transition"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      ></div>
    </div>


    <div class="py-3">
      <UButton
        class="w-full"
        variant="outline"
        @click="isCustomColorOpen = true"
      >
        Define Custom Color
      </UButton>
    </div>


    <!-- Custom Color Modal -->
    <UModal v-model="isCustomColorOpen">
      <UCard >
        <UCardHeader>
          <UCardTitle>Define Custom Color</UCardTitle>
        </UCardHeader>
        <UCardBody>
          <div class="flex flex-col gap-4 pb-[20px]">
         
            <div class="flex items-center gap-4">
              <input
                type="color"
                v-model="selectedColor"
                @input="handleColorChange"
                class="w-[450px] h-20 rounded cursor-pointer"
              />
            </div>


            <!-- HEX Input -->
            <UFormGroup label="HEX Color">
              <UInput
                v-model="hexValue"
                class="font-mono"
                placeholder="#000000"
                @input="handleHexInput"
              />
            </UFormGroup>


            <!-- RGB Inputs -->
            <div class="grid grid-cols-3 gap-2">
              <UFormGroup label="Red">
                <UInput
                  v-model="rgbValues.r"
                  type="number"
                  min="0"
                  max="255"
                  @input="handleRgbInput"
                />
              </UFormGroup>
              <UFormGroup label="Green">
                <UInput
                  v-model="rgbValues.g"
                  type="number"
                  min="0"
                  max="255"
                  @input="handleRgbInput"
                />
              </UFormGroup>
              <UFormGroup label="Blue">
                <UInput
                  v-model="rgbValues.b"
                  type="number"
                  min="0"
                  max="255"
                  @input="handleRgbInput"
                />
              </UFormGroup>
            </div>
          </div>
        </UCardBody>
        <UCardFooter class="gap-2 py-3 space-x-2">
          <UButton variant="outline" @click="applyCustomColor"> Apply </UButton>
          <UButton variant="outline" @click="isCustomColorOpen = false">
            Cancel
          </UButton>
        </UCardFooter>
      </UCard>
    </UModal>


    <!-- Action Buttons -->
    <div class="flex gap-2 mt-4">
      <UButton variant="outline" color="primary" @click="confirm">OK</UButton>
      <UButton variant="outline" @click="cancel">Cancel</UButton>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from "vue";


const props = defineProps({
  modelValue: {
    type: String,
    default: "#000000",
  },
});


const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);


const selectedColor = ref(props.modelValue || "#000000");
const hexValue = ref(props.modelValue || "#000000");
const isCustomColorOpen = ref(false);
const recentColors = ref([
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
]);
const customColor = ref([
  "#E8EBF2",
  "#E8EBF2",
  "#E8EBF2",
  "#E8EBF2",
  "#E8EBF2",
]);
const rgbValues = ref({ r: 0, g: 0, b: 0 });


// Color palette array remains the same...
const colorPalette = [
  "#FF0000",
  "#FF4D00",
  "#FF9900",
  "#FFCC00",
  "#FFFF00",
  "#CCFF00",
  "#99FF00",
  "#4DFF00",
  "#00FF00",
  "#00FF4D",
  "#00FF99",
  "#00FFCC",
  "#00FFFF",
  "#00CCFF",
  "#0099FF",
  "#004DFF",
  "#0000FF",
  "#4D00FF",
  "#9900FF",
  "#CC00FF",
  "#FF00FF",
  "#FF00CC",
  "#FF0099",
  "#FF004D",
  "#FF0000",
  "#4D0000",
  "#990000",
  "#CC0000",
  "#FF0000",
  "#FF4D4D",
];


// Convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};


// Convert RGB to hex
const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};


const handleColorChange = (event) => {
  const newColor = event.target.value;
  selectedColor.value = newColor;
  hexValue.value = newColor.toUpperCase();
  const rgb = hexToRgb(newColor);
  if (rgb) {
    rgbValues.value = rgb;
  }
  emit("update:modelValue", newColor);
};


const handleHexInput = (event) => {
  let value = event.target.value;
  if (value.startsWith("#")) {
    const rgb = hexToRgb(value);
    if (rgb) {
      rgbValues.value = rgb;
      selectedColor.value = value;
      emit("update:modelValue", value);
    }
  }
};


const handleRgbInput = () => {
  const { r, g, b } = rgbValues.value;
  if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
    const hex = rgbToHex(r, g, b);
    selectedColor.value = hex;
    hexValue.value = hex.toUpperCase();
    emit("update:modelValue", hex);
  }
};


const selectColor = (color) => {
  selectedColor.value = color;


  hexValue.value = color.toUpperCase();
  const rgb = hexToRgb(color);
  if (rgb) {
    rgbValues.value = rgb;
  }
  updateRecentColors(color);
  emit("update:modelValue", color);
};


const applyCustomColor = () => {
  selectColor(selectedColor.value);


  isCustomColorOpen.value = false;
};






const updateRecentColors = (color) => {
  if (!recentColors.value.includes(color)) {
    recentColors.value.unshift(color);
    recentColors.value = recentColors.value.slice(0, 5);
  }
};


const confirm = () => {
  emit("confirm", selectedColor.value);
};


const cancel = () => {
  emit("cancel");
};
</script>


<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  padding: 0;
  background: transparent;
}


input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}


input[type="color"]::-webkit-color-swatch {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>





