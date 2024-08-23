<script setup lang="ts">
const props = defineProps({
  purchase: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="flex items-start justify-between">
    <div class="w-[30%]">
      <div class="flex items-center gap-2 justify-between">
        <p>Vendor Name:</p>
        <p>{{ purchase?.vendor }}</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Date :</p>
        <p>{{ purchase?.date }}</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Vendor Address :</p>
        <p>P.O. Box 677</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Vendor City :</p>
        <p>Marietta</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Vendor State & Zip :</p>
        <p>OH 44202</p>
      </div>
    </div>
    <div class="w-[30%] border-x border-solid border-gray-600 px-5">
      <div class="flex items-center gap-2 justify-between">
        <p>Date Required :</p>
        <p>ASAP</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Ship Via :</p>
        <p>Deliver</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>FOB :</p>
        <p>Marietta, OH 45750</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Terms :</p>
        <p>Net 30</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Our Customer :</p>
        <p>GR84000</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>Sales Order # :</p>
        <p>??????</p>
      </div>
    </div>
    <div class="w-[30%]">
      <div class="flex items-center gap-2 justify-between">
        <p>To :</p>
        <p>Derrik Thompson</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>TEL :</p>
        <p>(317) 822-5721</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>FAX :</p>
        <p>(317) 822-5721</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>EMAIL :</p>
        <p>test@gmailcom</p>
      </div>
      <div class="flex items-center gap-2 justify-between">
        <p>URL :</p>
        <p>www.digikey.com</p>
      </div>
    </div>
  </div>
</template>
