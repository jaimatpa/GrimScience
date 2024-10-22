<template>
  <div id="container">
    <div id="map" ref="mapRef"></div>
    <div id="infoi">
      <h4 style="color: black">Map Filters</h4>
      <form>
        <div
          v-for="(filter, key) in filters"
          :key="key"
          :style="{ backgroundColor: filter.color, padding: '6px' }"
        >
          <input
            type="checkbox"
            v-model="filter.checked"
            :id="key"
            :name="key"
            class="cursor-pointer"
          />
          <label
            :for="key"
            :style="{ color: filter.labelColor }"
            class="cursor-pointer"
          >
            <i><strong>CRYO</strong>Therm</i> {{ filter.label }}
          </label>
        </div>
      </form>
    </div>
  </div>

  <!-- Invoice Modal -->
  <UDashboardModal
    v-model="modalMeta.isInvoiceModalOpen"
    title="Invoice"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl',
    }"
  >
    <InvoiceDetail
      :selected-customer="gridMeta.selectedCustomerId"
      :selected-order="gridMeta.selectedOrderId"
      @close="modalMeta.isInvoiceModalOpen = false"
    />
  </UDashboardModal>

  <!-- Quote Modal -->
  <UDashboardModal
    v-model="modalMeta.isQuoteModalOpen"
    title="Quote"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1000px] sm:max-w-7xl',
    }"
  >
    <CustomersQuoteDetail
      :selected-customer="gridMeta.selectedCustomerId"
      :selected-order="gridMeta.selectedOrderId"
    />
  </UDashboardModal>

  <!-- Service Order Modal -->
  <UDashboardModal
    v-model="modalMeta.isServiceOrderModalOpen"
    title="Service Order"
    :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-purple mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[1250px] sm:max-w-9xl',
    }"
  >
    <ServiceOrderDetail :selected-customer="gridMeta.selectedCustomerId" />
  </UDashboardModal>

  <!-- Site Visit Modal -->
  <UDashboardModal
    v-model="modalMeta.isSiteVisitModalOpen"
    title="Site Visit"
    :ui="{
      title: 'text-lg',
      header: {
        base: 'flex flex-row min-h-[0] items-center',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[1800px] sm:max-w-9xl',
    }"
  >
    <CustomersSiteVisitDetail
      :selected-customer="gridMeta.selectedCustomerId"
    />
  </UDashboardModal>
</template>

<script setup lang="ts">
import InvoiceDetail from "~/components/invoice/InvoiceDetail.vue";
import { useMap } from "../../composables/useMap";
const { mapRef, filters, initMap, openDetails, modalMeta, gridMeta } = useMap();

onMounted(() => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnm8l8a4EJtuibuVLa04QmneDNgJQNHcU&callback=initMap`;
  script.async = true;
  document.head.appendChild(script);
  window.initMap = initMap;
  window.openDetails = openDetails;
});
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  position: relative;
}

#map {
  height: 100%;
}

#infoi {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}

label {
  font-family: Arial, sans-serif;
  font-size: 15px;
  margin-left: 4px;
}

input[type="checkbox"] {
  transform: scale(1.5);
  margin-right: 5px;
}

h4 {
  font-family: Arial, sans-serif;
  color: #000;
  font-size: 20px;
  margin-top: 0;
}
</style>
