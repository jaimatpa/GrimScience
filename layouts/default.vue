<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();

const customersItems = [
  [
    {
      label: "List",
      to: "/customers/customers/list",
      exact: true,
    },
    {
      label: "Service Orders",
      to: "/service/serviceorders/list",
    },
    {
      label: "Message",
      to: "/customers/messages/list",
    },
    {
      label: "Quote",
      to: "/customers/quotes/list",
    },
    {
      label: "Invoice",
      to: "/customers/invoices/list",
    },
    {
      label: "Site Visit",
      to: "/customers/visits/list",
    },
  ],
];
const serviceItems = [
  [
    {
      label: "Customers",
      to: "/customers/customers/list",
      exact: true,
    },
    {
      label: "Service Order",
      to: "/service/serviceorders/list",
    },
    {
      label: "Schedule",
      to: "/service/schedule",
    },
    {
      label: "Calendar",
      to: "/service/calendar",
    },
  ],
];
const marketingItems = [
  [
    {
      label: "Products",
      to: "/marketing/list",
      exact: true,
    },
    {
      label: "Job Cost",
      to: "/marketing/cost",
    },
    {
      label: "Report",
      to: "/marketing/report",
    },
    {
      label: "Field Sales & Service",
      to: "/marketing/sales",
    },
    {
      label: "Territories",
      to: "/marketing/territories",
    },
    {
      label: "Projects",
      to: "/marketing/projects",
    },
  ],
];
const employeesItems = [
  [
    {
      label: "List",
      to: "/employees/list",
      exact: true,
    },
    {
      label: "Organization",
      to: "/employees/organization",
    },
  ],
];
const accountingItems = [
  [
    {
      label: "Payables",
      to: "/accounting/payables",
      exact: true,
    },
    {
      label: "Receivables",
      to: "/accounting/receivables",
    },
  ],
];
const ITItems = [
  [
    {
      label: "Corian Parts Monitor",
      to: "/it/monitor",
      exact: true,
    },
  ],
];
const engineeringItems = [
  [
    {
      label: "Change Orders",
      to: "/engineering/orders",
      exact: true,
    },
    {
      label: "Non-Conformance",
      to: "/engineering/nonconformance",
    },
    {
      label: "Investigation",
      to: "/engineering/investigation",
    },
    {
      label: "CAPA",
      to: "/engineering/capa",
    },
    {
      label: "Approvals",
      to: "/engineering/approvals",
    },
    {
      label: "KQI",
      to: "/engineering/kqi",
    },
    {
      label: "Projects",
      to: "/engineering/projects",
    },
  ],
];
const materialsItems = [
  [
    {
      label: "Parts",
      to: "/materials/parts",
      exact: true,
    },
    {
      label: "Purchases",
      to: "/materials/purchases",
    },
    {
      label: "Vendors",
      to: "/materials/vendors",
    },
    {
      label: "Requisitions",
      to: "/materials/requisitions",
    },
    {
      label: "Serials",
      to: "/materials/serials",
    },
    {
      label: "MRP",
      to: "/materials/mrp",
    },
    {
      label: "Transactions",
      to: "/materials/transactions",
    },
    {
      label: "Journal",
      to: "/materials/journal",
    },
    {
      label: "Report",
      to: "/materials/report",
    },
  ],
];
const manufacturingItems = [
  [
    {
      label: "Jobs",
      to: "/manufacturing/jobs",
      exact: true,
    },
    {
      label: "Schedule",
      to: "/manufacturing/schedule",
    },
    {
      label: "Labor Report",
      to: "/manufacturing/labor",
    },
    {
      label: "Projects",
      to: "/manufacturing/projects",
    },
  ],
];
const maintenanceItems = [
  [
    {
      label: "Equipment",
      to: "/maintenance/equipment",
      exact: true,
    },
    {
      label: "Calibration",
      to: "/maintenance/calibration",
    },
    {
      label: "Workstations",
      to: "/maintenance/workstations",
    },
  ],
];
const utilitiesItems = [
  [
    {
      label: "Shipping Rates",
      to: "/utilities/rates",
      exact: true,
    },
    {
      label: "Label - Parts",
      to: "/utilities/parts",
    },
    {
      label: "Label - Folders",
      to: "/utilities/folders",
    },
    {
      label: "Settings",
      to: "/utilities/settings",
    },
    {
      label: "App Projects",
      to: "/utilities/projects",
    },
    {
      label: "Permissions",
      to: "/utilities/permissions",
    },
  ],
];
const helpItems = [
  [
    {
      label: "Help",
      to: "/help/help",
      exact: true,
    },
    {
      label: "About",
      to: "/help/about",
    },
    {
      label: "Operational",
      to: "/help/operational",
    },
    {
      label: "Create",
      to: "/help/create",
    },
    {
      label: "Update",
      to: "/help/update",
    },
  ],
];

const links = [
  {
    id: "customers",
    label: "Customers",
    icon: "i-heroicons-user-group",
    to: "/customers",
    defaultOpen: route.path.startsWith("/customers"),
    tooltip: {
      text: "customers",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#9b4b99]",
    activeClass: "!text-white before:!bg-[#b95db7]",
    children: [
      {
        label: "List",
        to: "/customers/customers/list",
        exact: true,
      },
      {
        label: "Service Orders",
        to: "/service/serviceorders/list",
      },
      {
        label: "Message",
        to: "/customers/messages/list",
      },
      {
        label: "Quote",
        to: "/customers/quotes/list",
      },
      {
        label: "Invoice",
        to: "/customers/invoices/list",
      },
      {
        label: "Site Visit",
        to: "/customers/visits/list",
      },
    ],
  },
  {
    id: "service",
    label: "Service",
    icon: "i-heroicons-user-group",
    to: "/service",
    defaultOpen:
      route.path.startsWith("/service") &&
      !route.path.match("/service/serviceorders"),
    tooltip: {
      text: "customers",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#9b4b99]",
    activeClass: "!text-white before:!bg-[#b95db7]",
    children: [
      {
        label: "Customers",
        to: "/customers/customers/list",
        exact: true,
      },
      {
        label: "Service Order",
        to: "/service/serviceorders/list",
      },
      {
        label: "Schedule",
        to: "/service/schedule",
      },
      {
        label: "Calendar",
        to: "/service/calendar",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "i-heroicons-user-group",
    to: "/marketing",
    defaultOpen: route.path.startsWith("/marketing"),
    tooltip: {
      text: "customers",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#9b4b99]",
    activeClass: "!text-white before:!bg-[#b95db7]",
    children: [
      {
        label: "Products",
        to: "/marketing/list",
        exact: true,
      },
      {
        label: "Job Cost",
        to: "/marketing/cost",
      },
      {
        label: "Report",
        to: "/marketing/report",
      },
      {
        label: "Field Sales & Service",
        to: "/marketing/sales",
      },
      {
        label: "Territories",
        to: "/marketing/territories",
      },
      {
        label: "Projects",
        to: "/marketing/projects",
      },
    ],
  },
  {
    id: "employees",
    label: "Employees",
    icon: "i-heroicons-user-group",
    to: "/employees",
    defaultOpen: route.path.startsWith("/employees"),
    tooltip: {
      text: "employees",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#15889c]",
    activeClass: "!text-white before:!bg-[#1da1b8]",
    children: [
      {
        label: "List",
        to: "/employees/list",
        exact: true,
      },
      {
        label: "Organization",
        to: "/employees/organization",
      },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: "i-heroicons-user-group",
    to: "/accounting",
    defaultOpen: route.path.startsWith("/accounting"),
    tooltip: {
      text: "accounting",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#15889c]",
    activeClass: "!text-white before:!bg-[#1da1b8]",
    children: [
      {
        label: "Payables",
        to: "/accounting/payables",
        exact: true,
      },
      {
        label: "Receivables",
        to: "/accounting/receivables",
      },
    ],
  },
  {
    id: "it",
    label: "IT",
    icon: "i-heroicons-user-group",
    to: "/it",
    defaultOpen: route.path.startsWith("/it"),
    tooltip: {
      text: "IT",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#15889c]",
    activeClass: "!text-white before:!bg-[#1da1b8]",
    children: [
      {
        label: "Corian Parts Monitor",
        to: "/it/monitor",
        exact: true,
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: "i-heroicons-user-group",
    to: "/engineering",
    defaultOpen: route.path.startsWith("/engineering"),
    tooltip: {
      text: "engineering",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#0d4c8b]",
    activeClass: "!text-white before:!bg-[#1361ae]",
    children: [
      {
        label: "Change Orders",
        to: "/engineering/orders",
        exact: true,
      },
      {
        label: "Non-Conformance",
        to: "/engineering/nonconformance",
      },
      {
        label: "Investigation",
        to: "/engineering/investigation",
      },
      {
        label: "CAPA",
        to: "/engineering/capa",
      },
      {
        label: "Approvals",
        to: "/engineering/approvals",
      },
      {
        label: "KQI",
        to: "/engineering/kqi",
      },
      {
        label: "Projects",
        to: "/engineering/projects",
      },
    ],
  },
  {
    id: "materials",
    label: "Materials",
    icon: "i-heroicons-user-group",
    to: "/materials",
    defaultOpen: route.path.startsWith("/materials"),
    tooltip: {
      text: "materials",
      shortcuts: ["G", "A"],
    },
    backgroundClass: "bg-[#0d4c8b]",
    activeClass: "!text-white before:!bg-[#1361ae]",
    children: [
      {
        label: "Parts",
        to: "/materials/parts",
        exact: true,
      },
      {
        label: "Purchases",
        to: "/materials/purchases",
      },
      {
        label: "Vendors",
        to: "/materials/vendors",
      },
      {
        label: "Requisitions",
        to: "/materials/requisitions",
      },
      {
        label: "Serials",
        to: "/materials/serials",
      },
      {
        label: "MRP",
        to: "/materials/mrp",
      },
      {
        label: "Transactions",
        to: "/materials/transactions",
      },
      {
        label: "Journal",
        to: "/materials/journal",
      },
      {
        label: "Report",
        to: "/materials/report",
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: "i-heroicons-user-group",
    to: "/manufacturing",
    defaultOpen: route.path.startsWith("/manufacturing"),
    tooltip: {
      text: "manufacturing",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#0d4c8b]",
    activeClass: "!text-white before:!bg-[#1361ae]",
    children: [
      {
        label: "Jobs",
        to: "/manufacturing/jobs",
        exact: true,
      },
      {
        label: "Schedule",
        to: "/manufacturing/schedule",
      },
      {
        label: "Labor Report",
        to: "/manufacturing/labor",
      },
      {
        label: "Projects",
        to: "/manufacturing/projects",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: "i-heroicons-user-group",
    to: "/maintenance",
    defaultOpen: route.path.startsWith("/maintenance"),
    tooltip: {
      text: "maintenance",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#bf5163]",
    activeClass: "!text-white before:!bg-[#ec6279]",
    children: [
      {
        label: "Equipment",
        to: "/maintenance/equipment",
        exact: true,
      },
      {
        label: "Calibration",
        to: "/maintenance/calibration",
      },
      {
        label: "Workstations",
        to: "/maintenance/workstations",
      },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: "i-heroicons-user-group",
    to: "/utilities",
    defaultOpen: route.path.startsWith("/utilities"),
    tooltip: {
      text: "utilities",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#bf5163]",
    activeClass: "!text-white before:!bg-[#ec6279]",
    children: [
      {
        label: "Shipping Rates",
        to: "/utilities/rates",
        exact: true,
      },
      {
        label: "Label - Parts",
        to: "/utilities/parts",
      },
      {
        label: "Label - Folders",
        to: "/utilities/folders",
      },
      {
        label: "Settings",
        to: "/utilities/settings",
      },
      {
        label: "App Projects",
        to: "/utilities/projects",
      },
      {
        label: "Permissions",
        to: "/utilities/permissions",
      },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: "i-heroicons-user-group",
    to: "/help",
    defaultOpen: route.path.startsWith("/help"),
    tooltip: {
      text: "help",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-[#bf5163]",
    activeClass: "!text-white before:!bg-[#ec6279]",
    children: [
      {
        label: "Help",
        to: "/help/help",
        exact: true,
      },
      {
        label: "About",
        to: "/help/about",
      },
      {
        label: "Operational",
        to: "/help/operational",
      },
      {
        label: "Create",
        to: "/help/create",
      },
      {
        label: "Update",
        to: "/help/update",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    to: "/settings",
    icon: "i-heroicons-cog-8-tooth",
    defaultOpen: route.path.startsWith("/settings"),
    backgroundClass: "bg-[#666]",
    activeClass: "!text-white before:!bg-[#777]",
    children: [
      {
        label: "General",
        to: "/settings",
        exact: true,
      },
    ],
    class: "menuGray",
    tooltip: {
      text: "Settings",
      shortcuts: ["G", "S"],
    },
  },
];

const footerLinks = [
  {
    label: "Invite people",
    icon: "i-heroicons-plus",
    to: "/settings/members",
  },
  {
    label: "Help & Support",
    icon: "i-heroicons-question-mark-circle",
    click: () => (isHelpSlideoverOpen.value = true),
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
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
];

const defaultColors = ref(
  ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color),
  }))
);
const colors = computed(() =>
  defaultColors.value.map((color) => ({
    ...color,
    active: appConfig.ui.primary === color.label,
  }))
);

const getUiConfig = (link) => {
  return {
    wrapper: "relative !min-h-[auto] !min-w-[auto]",
    container: link.backgroundClass,
    base: "group text-white relative flex items-center gap-1.5 px-2.5 py-1.5 w-full rounded-md font-medium text-sm focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75",
    active: link.activeClass,
    icon: {
      inactive: "text-white",
    },
    dot: {
      wrapper: "w-px h-full mx-[9.5px] bg-gray-200 dark:bg-gray-700 relative",
      after:
        "after:absolute after:z-[1] after:w-px after:h-full after:bg-gray-200 after:dark:bg-gray-700 after:transform after:translate-y-full",
      base: "w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      active: "bg-gray-900 dark:bg-white",
      inactive:
        "bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-200",
    },
  };
};
</script>

<template>
  <UDashboardLayout>

    <slot />

    <UDashboardPanel 
      class="bg-gms-gray-400"
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
      
    >
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <div class="w-full p-3 mt-2">
            <img
              src="../public/grimm_logo_menu_dropshadow_v2.png"
              alt="Grimm Avatar"
            />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar
        :ui="{
          body: 'flex-1 px-4 flex flex-col !gap-y-0 overflow-y-auto',
        }"
      >
        <template #header>
          <div class="text-center text-white mt-5">
            <!-- {{userInfo.fname + " " + userInfo.lname}} -->
          </div>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks
          v-for="link in links"
          :key="link.id"
          :links="[link]"
          :ui="getUiConfig(link)"
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

<style scoped>
#customers {
  background-color: #000 !important;
}
/* Scoped CSS for component-specific styling */
.white-divider div {
  border-color: #fff !important;
}

.header-text-white div {
  color: #fff !important;
  font-size: 24px !important;
}

/* Navbar Style */

/* #headlessui-disclosure-button-nQ5bhjxrh1P_114, #headlessui-disclosure-button-nQ5bhjxrh1P-5  {
    background-color: #9b4b99!important;
}

#headlessui-disclosure-button-nQ5bhjxrh1P_114 button:hover::before, #headlessui-disclosure-button-nQ5bhjxrh1P-5 button:hover::before  {
    background-color: #b95db7!important;
}

#headlessui-disclosure-button-nQ5bhjxrh1P_114 button, #headlessui-disclosure-button-nQ5bhjxrh1P-5 button, #headlessui-disclosure-button-nQ5bhjxrh1P_114 button span, #headlessui-disclosure-button-nQ5bhjxrh1P-5 button span {
color:#fff!important;
} */

/* MENU STYLES */
.menuPurple {
  background-color: #9b4b99 !important;
  border-bottom: 1px solid #fff;
}

.menuPurple button:hover::before,
.menuPurple a:hover::before,
.menuPurple a:hover::after {
  background-color: #b95db7 !important;
}

.menuPurple button,
.menuPurple button span,
.menuPurple a,
.menuPurple a span {
  color: #fff !important;
}

.menuPurple ul li span.bg-gray-400,
.menuPurple ul li span.bg-gray-900,
.menuPurple ul li span.bg-gray-200::before,
.menuPurple ul li span.bg-gray-400::after {
  background-color: #fff !important;
}

/* --- */

.menuTeal {
  background-color: #15889c !important;
  border-bottom: 1px solid #fff;
}

.menuTeal button:hover::before,
.menuTeal a:hover::before,
.menuTeal a.text-gray-900::before {
  background-color: #1da1b8 !important;
}

.menuTeal button,
.menuTeal button span,
.menuTeal a,
.menuTeal a span {
  color: #fff !important;
}

.menuTeal ul li span.bg-gray-400,
.menuTeal ul li span.bg-gray-900,
.menuTeal ul li span.bg-gray-200::before,
.menuTeal ul li span.bg-gray-400::after {
  background-color: #fff !important;
}

/* --- */

.menuBlue {
  background-color: #0d4c8b !important;
  border-bottom: 1px solid #fff;
}

.menuBlue button:hover::before,
.menuBlue a:hover::before,
.menuBlue a.text-gray-900::before {
  background-color: #1361ae !important;
}

.menuBlue button,
.menuBlue button span,
.menuBlue a,
.menuBlue a span {
  color: #fff !important;
}

.menuBlue ul li span.bg-gray-400,
.menuBlue ul li span.bg-gray-900,
.menuBlue ul li span.bg-gray-200::before,
.menuBlue ul li span.bg-gray-400::after {
  background-color: #fff !important;
}

/* --- */

.menuRed {
  background-color: #bf5163 !important;
  border-bottom: 1px solid #fff;
}

.menuRed button:hover::before,
.menuRed a:hover::before,
.menuRed a.text-gray-900::before {
  background-color: #ec6279 !important;
}

.menuRed button,
.menuRed button span,
.menuRed a,
.menuRed a span {
  color: #fff !important;
}

.menuRed ul li span.bg-gray-400,
.menuRed ul li span.bg-gray-900,
.menuRed ul li span.bg-gray-200::before,
.menuRed ul li span.bg-gray-400::after {
  background-color: #fff !important;
}

/* --- */

.menuGray {
  background-color: #666 !important;
  border-bottom: 1px solid #fff;
}

.menuGray button:hover::before,
.menuGray a:hover::before,
.menuGray a.text-gray-900::before {
  background-color: #777 !important;
}

.menuGray button,
.menuGray button span,
.menuGray a,
.menuGray a span {
  color: #fff !important;
}

.menuGray ul li span.bg-gray-400,
.menuGray ul li span.bg-gray-900,
.menuGray ul li span.bg-gray-200::before,
.menuGray ul li span.bg-gray-400::after {
  background-color: #fff !important;
}

/* --- */

/* Header Styles */

.gmsPurpleTitlebar h2,
.gmsTealTitlebar h2,
.gmsBlueTitlebar h2,
.gmsRedTitlebar h2 {
  color: #000;
  font-size: 16px;
}

.gmsPurpleHeader {
  background-color: #9b4b99;
}

.gmsPurpleHeader h1 {
  color: #fff !important;
  font-size: 19px;
}

.gmsPurpleTitlebar {
  background-color: #bb8abc;
}

/* --- */

.gmsTealHeader {
  background-color: #15889c;
}

.gmsTealHeader h1 {
  color: #fff !important;
  font-size: 19px;
}

.gmsTealTitlebar {
  background-color: #91bdca;
}

/* --- */

.gmsBlueHeader {
  background-color: #0d4c8b;
}

.gmsBlueHeader h1 {
  color: #fff !important;
  font-size: 19px;
}

.gmsBlueTitlebar {
  background-color: #7491bd;
}

/* --- */

.gmsRedHeader {
  background-color: #bf5163;
}

.gmsRedHeader h1 {
  color: #fff !important;
  font-size: 19px;
}

.gmsRedTitlebar {
  background-color: #bf5163;
}

/* --- */

/* Button Styles */
button {
  transition: all 0.1s;
}
</style>
