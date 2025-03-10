<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();
const isTimeEntryModalOpen = ref(false);
const handleTimeEntryModal = () => {
  isTimeEntryModalOpen.value = true;
}

const links = [
  {
    id: "general",
    label: "General",
    icon: "i-heroicons-map-pin",
    to: "/general",
    defaultOpen: route.path.startsWith("/general"),
    tooltip: {
      text: "General",
      shortcuts: ["G", "U"],
    },
    backgroundClass: "bg-green-800",
    activeClass: "!text-white before:!bg-black/20",
    children: [
      {
        label: "Map",
        to: "/general/map",
        exact: true,
      },
      {
        label: "Bug Report",
        to: "/general/bug/list",
      },

    ],
  },
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
    icon: "i-heroicons-chat-bubble-bottom-center-text---",
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
    icon: "i-heroicons-megaphone---",
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
        to: "/marketing/products/list",
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
    icon: "i-heroicons-user",
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
    icon: "i-heroicons-currency-dollar---",
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
      {
        label: "Chart Of Accounts",
        to: "/accounting/chartOfAccounting",
      },
    ],
  },
  {
    id: "it",
    label: "IT",
    icon: "i-heroicons-cpu-chip---",
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
    icon: "i-heroicons-cog-8-tooth",
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
    icon: "i-heroicons-cube---",
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
        to: "/materials/serials/list",
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
    icon: "i-heroicons-user---",
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
    icon: "i-heroicons-wrench-screwdriver",
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
    icon: "i-heroicons-user-group---",
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
        label: "Work Centers",
        to: "/utilities/work-centers",
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
    icon: "i-heroicons-question-mark-circle---",
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
    icon: "i-heroicons-cog---",
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
    wrapper: "relative !min-h-[auto] !min-w-[auto] border-b-[1px] border-white",
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

const Logout = () => {
  const token = useCookie('token');
  const user = useCookie('user');
  token.value = null;
  user.value = null;
  navigateTo('/login');
}

const currentTime = ref('');

const getCurrentTime = () => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use 12-hour format
  };
  currentTime.value = new Date().toLocaleTimeString(undefined, options);
};
const user = useCookie('user');

const fullname = computed(() => {
  return `${user.value?.fname || ''} ${user.value?.lname || ''}`.trim()
})

const modalTitle = computed(() => {
  return `Time Entries For: ${fullname.value}`
})
onMounted(() => {
  getCurrentTime();
  setInterval(getCurrentTime, 1000);
});

</script>

<template>
  <div class="bg-gms-gray-400" style="height:100vh;width:100vw;">
    <UDashboardLayout style="max-width:1500px;background-color:#fff;margin-left:auto;margin-right:auto;">

      <slot />

      <UDashboardPanel class="bg-gms-gray-400" :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
        <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
          <template #left>
            <div class="w-full p-3 mt-5 flex justify-center items-center">
              <img src="../public/grimm_logo_menu_dropshadow_v2.png" alt="Grimm Avatar" />
            </div>
          </template>
        </UDashboardNavbar>

        <UDashboardSidebar :ui="{
          body: 'flex-1 px-4 flex flex-col !gap-y-0 overflow-y-auto',
        }">
          <template #header>
            <div class="text-center  mt-2 mb-2">
              <UAvatar
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC"
                alt="Avatar" size="3xl" />
            </div>
            <div class="text-center text-white mb-1">
              Logged in as Leith Stetson
            </div>
            <div class="text-center text-white mb-3 font-bold text-2xl">
              {{ currentTime }}
            </div>
            <div class="text-center text-white mb-10">
              <UButtonGroup>
                <UButton label="Time Entry" @click="handleTimeEntryModal" icon="i-heroicons-plus" color="green" />
                <UButton label="Log Out" color="white" icon="i-heroicons-arrow-left-on-rectangle" @click="Logout" />
              </UButtonGroup>
            </div>
            <UDashboardSearchButton />
          </template>

          <UDashboardSidebarLinks v-for="link in links" :key="link.id" :links="[link]" :ui="getUiConfig(link)" />


          <template #footer>
            <CommonUserDropdown class="border-t-[1px] border-white py-1 mt-[-8px]" />
          </template>


        </UDashboardSidebar>
      </UDashboardPanel>
      <div class="hidden bg-slate-50 hover:bg-{color}-100 dark:bg-{color}-800"></div>

      <ClientOnly>
        <LazyUDashboardSearch :groups="groups" />
      </ClientOnly>

    </UDashboardLayout>
  </div>

  <UDashboardModal v-model="isTimeEntryModalOpen" :ui="{
    background: 'bg-gray-100',
    width: 'w-[800px] sm:max-w-9xl',
    header: {
      base: 'bg-gms-blue'
    },
    body: {
      padding: 'py-0 sm:pt-0',

    }
  }" :title="modalTitle">

    <GeneralTimeEntry />
  </UDashboardModal>
</template>
