<script setup lang="ts">
const items = [{
    Category:"new",
  Sub: 'Sub Assembly',
  "Part#":'new Part',
  Description:'new Description',
  Qty:'1',
  Cost:'100',
  Unit:'uni',
  Amount:'100',
  "Stock Number":'100',


}, {
    Category:"new",
  Sub: 'Sub Assembly',
  "Part#":'new Part',
  Description:'new Description',
  Qty:'1',
  Cost:'100',
  Unit:'uni',
  Amount:'100',
  "Stock Number":'100',

}, {
    Category:"new",
  Sub: 'Sub Assembly',
  "Part#":'new Part',
  Description:'new Description',
  Qty:'1',
  Cost:'100',
  Unit:'uni',
  Amount:'100',
  "Stock Number":'100',
}]

const partsTable2 = [{
    Qty:"100",
    "Part #":'parts',
    Description:'this is good product',
    Cost:'100',
    Unit:'200',
    Amount:'1000',
    NonConformance:'d'


}, {
    Qty:"100",
    "Part #":'parts',
    Description:'this is good product',
    Cost:'100',
    Unit:'200',
    Amount:'1000',
    NonConformance:'d'
}, {
    Qty:"100",
    "Part #":'parts',
    Description:'this is good product',
    Cost:'100',
    Unit:'200',
    Amount:'1000',
    NonConformance:'d'
}]
const headerFilters = ref({
    markets: {
      label: 'Market',
      filter: 'market',
      options: []
    }, 
    professions: {
      label: 'Profession', 
      filter: 'source',
      options: []
    }, 
    categories: {
      label: 'Category', 
      filter: 'ParadynamixCatagory', 
      options: []
    }, 
    conferences: {
      label: 'Conference', 
      filter: 'SourceConfrence',
      options: []
    }, 
    usstates: {
      label: 'State', 
      filter: 'state',
      api: '/api/common/usstates',
      options: []
    }
  })

</script>
<template>
     <UDashboardNavbar class="gmsPurpleTitlebar" 
        title="Parts used"
      >
      </UDashboardNavbar>
   <div class="flex flex-row space-x-20">
    <div class="basis-1/2">
        <UTable :rows="items" />

    </div>
    <div class="basis-1/2">
        <UTable :rows="partsTable2" />
    </div>
    
   </div>
   <div class="flex justify-end gap-3">
        
        <UButton color="cyan" variant="outline"
          type="submit"
          label="Save"
        />
      </div>
    </template>