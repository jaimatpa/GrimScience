<script setup lang="ts">
import PartsList from "./PartsList.vue";
</script>
<template>
  <div>
    <div
      class="flex flex-col justify-between border border-solid border-gray-500 p-2 w-1/2"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">
          <p>Stock #</p>
          <p>132062</p>
        </div>
        <UButton>Remove</UButton>
        <UButton>NonConformation</UButton>
      </div>

      <table>
        <thead class="w-full">
          <th></th>
          <th class="text-center">Qty</th>
          <th class="text-center">Price</th>
        </thead>
        <tbody v-for="row in [1, 2, 3, 4, 5]">
          <tr :key="row">
            <td v-if="row === 1">Min</td>
            <td v-else></td>
            <td><UInput /></td>
            <td><UInput /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <PartsList />
  </div>
</template>
