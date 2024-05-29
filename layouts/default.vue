<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const customersItems = [
  [{
    label: 'List',
    to: '/customers/list',
    exact: true
  }, {
    label: 'Service Orders',
    to: '/customers/orders'
  }, {
    label: 'Message',
    to: '/customers/message'
  }, {
    label: 'Quote',
    to: '/customers/quote'
  }, {
    label: 'Invoice',
    to: '/customers/invoice'
  }, {
    label: 'Site Visit',
    to: '/customers/visit'
  }]
]
const serviceItems = [
  [{
    label: 'Cust List',
    to: '/service/list',
    exact: true
  }, {
    label: 'Service Order',
    to: '/service/order'
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
  id: 'home',
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'Home',
    shortcuts: ['G', 'H']
  }
}, {
  id: 'inbox',
  label: 'Inbox',
  icon: 'i-heroicons-inbox',
  to: '/inbox',
  badge: '4',
  tooltip: {
    text: 'Inbox',
    shortcuts: ['G', 'I']
  }
}, {
  id: 'users',
  label: 'Users',
  icon: 'i-heroicons-user-group',
  to: '/users',
  tooltip: {
    text: 'Users',
    shortcuts: ['G', 'U']
  }
}, {
  id: 'settings',
  label: 'Settings',
  to: '/settings',
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: 'General',
    to: '/settings',
    exact: true
  }, {
    label: 'Members',
    to: '/settings/members'
  }, {
    label: 'Notifications',
    to: '/settings/notifications'
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
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
    }
  }]
}]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <!-- <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar> -->

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <!-- <UDashboardSidebarLinks :links="links" /> -->
        <div class="w-full">
          <MenuItem 
            :select-items="customersItems"
            label="Customer"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="serviceItems"
            label="Service"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="marketingItems"
            label="Marketing"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="employeesItems"
            label="Employees"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="accountingItems"
            label="Accounting"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="ITItems"
            label="IT"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="engineeringItems"
            label="Engineering"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="materialsItems"
            label="Materials"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="manufacturingItems"
            label="Manufacturing"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="maintenanceItems"
            label="Maintenance"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="utilitiesItems"
            label="Utilities"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <div class="w-full">
          <MenuItem 
            :select-items="helpItems"
            label="Help"
            icon="i-heroicons-users"
          >
          </MenuItem>
        </div>
        <UDivider />

        <!-- <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="colors => defaultColors = colors"
        /> -->

        <div class="flex-1" />

        <!-- <UDashboardSidebarLinks :links="footerLinks" /> -->

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
