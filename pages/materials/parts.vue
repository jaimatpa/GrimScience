<script setup></script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Parts"> </UDashboardNavbar>
      <MaterialsPartsPartList :is-page="true" />

      <!-- <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1">
          <UPagination
            :max="7"
            :page-count="gridMeta.pageSize"
            :total="gridMeta.numberOfCustomers | 0"
            v-model="gridMeta.page"
            @update:model-value="handlePageChange()"
          />
        </div>
      </div> -->
    </UDashboardPanel>
  </UDashboardPage>
  <!-- Parts Detail Modal -->


</template>
<style scoped></style>