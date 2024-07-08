<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const customersItems = [
  [{
    label: 'List',
    to: '/customers/customers/list',
    exact: true
  }, {
    label: 'Service Orders',
    to: '/service/serviceorders/list'
  }, {
    label: 'Message',
    to: '/customers/messages/list'
  }, {
    label: 'Quote',
    to: '/customers/quotes/list'
  }, {
    label: 'Invoice',
    to: '/customers/invoices/list'
  }, {
    label: 'Site Visit',
    to: '/customers/visits/list'
  }]
]
const serviceItems = [
  [{
    label: 'Customers',
    to: '/customers/customers/list',
    exact: true
  }, {
    label: 'Service Order',
    to: '/service/serviceorders/list'
  }, {
    label: 'Schedule',
    to: '/service/schedule'
  }, {
    label: 'Calendar',
    to: '/service/calendar'
  }]
]
const marketingItems = [
  [{
    label: 'Products',
    to: '/marketing/list',
    exact: true
  }, {
    label: 'Job Cost',
    to: '/marketing/cost'
  }, {
    label: 'Report',
    to: '/marketing/report'
  }, {
    label: 'Field Sales & Service',
    to: '/marketing/sales'
  }, {
    label: 'Territories',
    to: '/marketing/territories'
  }, {
    label: 'Projects',
    to: '/marketing/projects'
  }]
]
const employeesItems = [
  [{
    label: 'List',
    to: '/employees/list',
    exact: true
  }, {
    label: 'Organization',
    to: '/employees/organization'
  }]
]
const accountingItems = [
  [{
    label: 'Payables',
    to: '/accounting/payables',
    exact: true
  }, {
    label: 'Receivables',
    to: '/accounting/receivables'
  }]
]
const ITItems = [
  [{
    label: 'Corian Parts Monitor',
    to: '/it/monitor',
    exact: true
  }]
]
const engineeringItems = [
  [{
    label: 'Change Orders',
    to: '/engineering/orders',
    exact: true
  }, {
    label: 'Non-Conformance',
    to: '/engineering/nonconformance'
  }, {
    label: 'Investigation',
    to: '/engineering/investigation'
  }, {
    label: 'CAPA',
    to: '/engineering/capa'
  }, {
    label: 'Approvals',
    to: '/engineering/approvals'
  }, {
    label: 'KQI',
    to: '/engineering/kqi'
  }, {
    label: 'Projects',
    to: '/engineering/projects'
  }]
]
const materialsItems = [
  [{
    label: 'Parts',
    to: '/materials/parts',
    exact: true
  }, {
    label: 'Purchases',
    to: '/materials/purchases'
  }, {
    label: 'Vendors',
    to: '/materials/vendors'
  }, {
    label: 'Requisitions',
    to: '/materials/requisitions'
  }, {
    label: 'Serials',
    to: '/materials/serials'
  }, {
    label: 'MRP',
    to: '/materials/mrp'
  }, {
    label: 'Transactions',
    to: '/materials/transactions'
  }, {
    label: 'Journal',
    to: '/materials/journal'
  }, {
    label: 'Report',
    to: '/materials/report'
  }]
]
const manufacturingItems = [
  [{
    label: 'Jobs',
    to: '/manufacturing/jobs',
    exact: true
  }, {
    label: 'Schedule',
    to: '/manufacturing/schedule'
  }, {
    label: 'Labor Report',
    to: '/manufacturing/labor'
  }, {
    label: 'Projects',
    to: '/manufacturing/projects'
  }]
]
const maintenanceItems = [
  [{
    label: 'Equipment',
    to: '/maintenance/equipment',
    exact: true
  }, {
    label: 'Calibration',
    to: '/maintenance/calibration'
  }, {
    label: 'Workstations',
    to: '/maintenance/workstations'
  }]
]
const utilitiesItems = [
  [{
    label: 'Shipping Rates',
    to: '/utilities/rates',
    exact: true
  }, {
    label: 'Label - Parts',
    to: '/utilities/parts'
  }, {
    label: 'Label - Folders',
    to: '/utilities/folders'
  }, {
    label: 'Settings',
    to: '/utilities/settings'
  }, {
    label: 'App Projects',
    to: '/utilities/projects'
  }, {
    label: 'Permissions',
    to: '/utilities/permissions'
  }]
]
const helpItems = [
  [{
    label: 'Help',
    to: '/help/help',
    exact: true
  }, {
    label: 'About',
    to: '/help/about'
  }, {
    label: 'Operational',
    to: '/help/operational'
  }, {
    label: 'Create',
    to: '/help/create'
  }, {
    label: 'Update',
    to: '/help/update'
  }]
]

const links = [{
  id: 'customers',
  label: 'Customers',
  icon: 'i-heroicons-user-group',
  to: '/customers',
  defaultOpen: route.path.startsWith('/customers'),
  tooltip: {
    text: 'customers',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'List',
    to: '/customers/customers/list',
    exact: true
  }, {
    label: 'Service Orders',
    to: '/service/serviceorders/list'
  }, {
    label: 'Message',
    to: '/customers/messages/list'
  }, {
    label: 'Quote',
    to: '/customers/quotes/list'
  }, {
    label: 'Invoice',
    to: '/customers/invoices/list'
  }, {
    label: 'Site Visit',
    to: '/customers/visits/list'
  }]
}, {
  id: 'service',
  label: 'Service',
  icon: 'i-heroicons-chat-bubble-bottom-center-text',
  to: '/service',
  defaultOpen: route.path.startsWith('/service') && !route.path.match('/service/serviceorders'),
  tooltip: {
    text: 'customers',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Customers',
    to: '/customers/customers/list',
    exact: true
  }, {
    label: 'Service Order',
    to: '/service/serviceorders/list'
  }, {
    label: 'Schedule',
    to: '/service/schedule'
  }, {
    label: 'Calendar',
    to: '/service/calendar'
  }]
}, 
{
  id: 'marketing',
  label: 'Marketing',
  icon: 'i-heroicons-megaphone',
  to: '/marketing',
  defaultOpen: route.path.startsWith('/marketing'),
  tooltip: {
    text: 'customers',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Products',
    to: '/marketing/list',
    exact: true
  }, {
    label: 'Job Cost',
    to: '/marketing/cost'
  }, {
    label: 'Report',
    to: '/marketing/report'
  }, {
    label: 'Field Sales & Service',
    to: '/marketing/sales'
  }, {
    label: 'Territories',
    to: '/marketing/territories'
  }, {
    label: 'Projects',
    to: '/marketing/projects'
  }]
},
{
  id: 'employees',
  label: 'Employees',
  icon: 'i-heroicons-user',
  to: '/employees',
  defaultOpen: route.path.startsWith('/employees'),
  tooltip: {
    text: 'employees',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'List',
    to: '/employees/list',
    exact: true
  }, {
    label: 'Organization',
    to: '/employees/organization'
  }]
},
{
  id: 'accounting',
  label: 'Accounting',
  icon: 'i-heroicons-currency-dollar',
  to: '/accounting',
  defaultOpen: route.path.startsWith('/accounting'),
  tooltip: {
    text: 'accounting',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Payables',
    to: '/accounting/payables',
    exact: true
  }, {
    label: 'Receivables',
    to: '/accounting/receivables'
  }]
},
{
  id: 'it',
  label: 'IT',
  icon: 'i-heroicons-cpu-chip',
  to: '/it',
  defaultOpen: route.path.startsWith('/it'),
  tooltip: {
    text: 'IT',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Corian Parts Monitor',
    to: '/it/monitor',
    exact: true
  }]
},
{
  id: 'engineering',
  label: 'Engineering',
  icon: 'i-heroicons-cog-8-tooth',
  to: '/engineering',
  defaultOpen: route.path.startsWith('/engineering'),
  tooltip: {
    text: 'engineering',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Change Orders',
    to: '/engineering/orders',
    exact: true
  }, {
    label: 'Non-Conformance',
    to: '/engineering/nonconformance'
  }, {
    label: 'Investigation',
    to: '/engineering/investigation'
  }, {
    label: 'CAPA',
    to: '/engineering/capa'
  }, {
    label: 'Approvals',
    to: '/engineering/approvals'
  }, {
    label: 'KQI',
    to: '/engineering/kqi'
  }, {
    label: 'Projects',
    to: '/engineering/projects'
  }]
},
{
  id: 'materials',
  label: 'Materials',
  icon: 'i-heroicons-cube',
  to: '/materials',
  defaultOpen: route.path.startsWith('/materials'),
  tooltip: {
    text: 'materials',
    shortcuts: ['G', 'A']
  }, 
  children: [{
    label: 'Parts',
    to: '/materials/parts',
    exact: true
  }, {
    label: 'Purchases',
    to: '/materials/purchases'
  }, {
    label: 'Vendors',
    to: '/materials/vendors'
  }, {
    label: 'Requisitions',
    to: '/materials/requisitions'
  }, {
    label: 'Serials',
    to: '/materials/serials'
  }, {
    label: 'MRP',
    to: '/materials/mrp'
  }, {
    label: 'Transactions',
    to: '/materials/transactions'
  }, {
    label: 'Journal',
    to: '/materials/journal'
  }, {
    label: 'Report',
    to: '/materials/report'
  }]
},
{
  id: 'manufacturing',
  label: 'Manufacturing',
  icon: 'i-heroicons-user',
  to: '/manufacturing',
  defaultOpen: route.path.startsWith('/manufacturing'),
  tooltip: {
    text: 'manufacturing',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Jobs',
    to: '/manufacturing/jobs',
    exact: true
  }, {
    label: 'Schedule',
    to: '/manufacturing/schedule'
  }, {
    label: 'Labor Report',
    to: '/manufacturing/labor'
  }, {
    label: 'Projects',
    to: '/manufacturing/projects'
  }]
},
{
  id: 'maintenance',
  label: 'Maintenance',
  icon: 'i-heroicons-wrench-screwdriver',
  to: '/maintenance',
  defaultOpen: route.path.startsWith('/maintenance'),
  tooltip: {
    text: 'maintenance',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Equipment',
    to: '/maintenance/equipment',
    exact: true
  }, {
    label: 'Calibration',
    to: '/maintenance/calibration'
  }, {
    label: 'Workstations',
    to: '/maintenance/workstations'
  }]
},
{
  id: 'utilities',
  label: 'Utilities',
  icon: 'i-heroicons-wrench',
  to: '/utilities',
  defaultOpen: route.path.startsWith('/utilities'),
  tooltip: {
    text: 'utilities',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Shipping Rates',
    to: '/utilities/rates',
    exact: true
  }, {
    label: 'Label - Parts',
    to: '/utilities/parts'
  }, {
    label: 'Label - Folders',
    to: '/utilities/folders'
  }, {
    label: 'Settings',
    to: '/utilities/settings'
  }, {
    label: 'App Projects',
    to: '/utilities/projects'
  }, {
    label: 'Permissions',
    to: '/utilities/permissions'
  }]
},
{
  id: 'help',
  label: 'Help',
  icon: 'i-heroicons-question-mark-circle',
  to: '/help',
  defaultOpen: route.path.startsWith('/help'),
  tooltip: {
    text: 'help',
    shortcuts: ['G', 'U']
  }, 
  children: [{
    label: 'Help',
    to: '/help/help',
    exact: true
  }, {
    label: 'About',
    to: '/help/about'
  }, {
    label: 'Operational',
    to: '/help/operational'
  }, {
    label: 'Create',
    to: '/help/create'
  }, {
    label: 'Update',
    to: '/help/update'
  }]
}, {
  id: 'settings',
  label: 'Settings',
  to: '/settings',
  icon: 'i-heroicons-cog',
  defaultOpen: route.path.startsWith('/settings'),
  children: [{
    label: 'General',
    to: '/settings',
    exact: true
  }],
  tooltip: {
    text: 'Settings',
    shortcuts: ['G', 'S']
  }
}]

const footerLinks = [{
  label: 'Invite people',
  icon: 'i-heroicons-plus',
  to: '/settings/members'
}, {
  label: 'Help & Support',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, 
// {
//   key: 'code',
//   label: 'Code',
//   commands: [{
//     id: 'source',
//     label: 'View page source',
//     icon: 'i-simple-icons-github',
//     click: () => {
//       window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
//     }
//   }]
// }
]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>

    <slot />

    <UDashboardPanel class="bg-gms-gray-400"
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
      
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <div class="w-full p-3 mt-5 flex justify-center items-center">
            <img src="../public/grimm_logo_menu_dropshadow_v2.png" alt="Grimm Avatar"/>
          </div>
          
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <div class="text-center text-white mt-5">
            <!-- {{userInfo.fname + " " + userInfo.lname}} -->
          </div>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" 
          :ui="{container: 'bg-sky-400'}"
        />


        <!-- <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="colors => defaultColors = colors"
        /> -->

        <div class="flex-1" />

        <!-- <UDashboardSidebarLinks :links="footerLinks" /> -->

        <UDivider class="white-divider" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <CommonUserDropdown />
        </template>

                
      </UDashboardSidebar>
    </UDashboardPanel>
    <div class="hidden bg-{slate}-50 hover:bg-{color}-100 dark:bg-{color}-800"></div>
    

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
