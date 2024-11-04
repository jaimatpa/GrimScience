<script lang="ts" setup>
import CustomersSiteVisitDetail from '~/components/customers/CustomersSiteVisitDetail.vue';

useSeoMeta({
  title: 'Grimm-Site Visit'
})
</script>


<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsPurpleHeader" title="Site Visits" />
      <div class="overflow-y-scroll">
        <CustomersSiteVisitDetail/>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>