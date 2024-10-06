<script lang="ts" setup>
const props = defineProps({
  purchaseId: {
    type: number,
    required: true,
  },
});
import PurchaseDetails from "./TabItems/PurchaseDetails.vue";
import VendorInfo from "./TabItems/VendorInfo.vue";
import PartsList from "./TabItems/PartsList.vue";
import PartsOnOrder from "./TabItems/PartsOnOrder.vue";
import Notes from "./TabItems/Notes.vue";
import { number } from "yup";

console.log("view Purchase modal");

// tan items
const items = [
  {
    key: "purchase_details",
    label: "Purchase Details",
  },
  {
    key: "vendor_info",
    label: "Vendor Info",
  },
  {
    key: "parts_list",
    label: "Parts Lookup",
  },
  {
    key: "parts_on_order",
    label: "Parts on Order",
  },
  {
    key: "notes",
    label: "Notes",
  },
];

// fetch selected purchase
const purchsaeData = ref({
  isLoading: false,
  purchase: null,
});

const fetchPurchasesData = async () => {
  purchsaeData.value.isLoading = true;
  await useApiFetch(`/api/materials/purchase/${props?.purchaseId}`, {
    method: "GET",
    onResponse: ({ response }) => {
      console.log(response?._data?.body, "====> purchases list");
      purchsaeData.value.purchase = response?._data?.body;
      purchsaeData.value.isLoading = false;
    },
  });
};

fetchPurchasesData();
</script>

<template>
  <UTabs :items="items" class="w-full h-[75vh] overflow-y-auto px-2">
    <template #item="{ item }">
      <UCard>
        <template #header>
          <div class="px-4 py-2 gmsBlueTitlebar">
            <h2>{{ item?.label }}</h2>
          </div>
        </template>

        <div v-if="item.key === 'purchase_details'" class="space-y-3">
          <PurchaseDetails :purchase="purchsaeData.purchase" />
        </div>
        <div v-else-if="item.key === 'vendor_info'" class="space-y-3">
          <VendorInfo :purchase="purchsaeData.purchase" />
        </div>
        <div v-else-if="item.key === 'parts_list'" class="space-y-3">
          <PartsList />
        </div>
        <div v-else-if="item.key === 'parts_on_order'" class="space-y-3">
          <PartsOnOrder />
        </div>
        <div v-else-if="item.key === 'notes'" class="space-y-3">
          <Notes />
        </div>
      </UCard>
    </template>
  </UTabs>
</template>
