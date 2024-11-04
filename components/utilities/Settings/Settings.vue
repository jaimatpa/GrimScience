<script setup>
import { ref, onMounted } from "vue";
import ColorPicker from "./color.vue";
import PopupCard from "./popup.vue";
import PopupCard02 from "./popup2.vue";

onMounted(async () => {
  await allCompanyData();
  await allEnvData();
});

const inventoryDetailGridMeta = ref({
  defaultColumns: [
    {
      key: "UOM",

      filterable: true,
    },
    {
      key: "Applied",
    },
    {
      key: "Reading",
    },
    {
      key: "Adjusted",
    },
    {
      key: "Min",
    },
  ],

  sort: {
    column: "UniqueID",
    direction: "asc",
  },
  details: [],
  selectedDetail: null,
  reportTableData: "",
  isLoading: false,
});

const toast = useToast();
const dbData = ref({
  Provider: "",
  Source: "",
  Network: "True",
  Initial: "",
  ID: "",
  Password: "",
});

const data = `provider=${dbData.value.Provider};Data Source=${
  dbData.value.Source
};Network Library=${dbData.value.Network};Initial Catalog=${
  dbData.value.Initial
};User ID ${dbData.value.ID}Password=${dbData.value.Password || "****"}`;
const companyAllData = ref({
  creditStoreUserName: "",
  creditStoreName: "",
  creditCardPassword: "",
  laborrate: "",
  serviceLaborRate: "",
  travelrate: "",
  onsiterate: "",
  profitRate: "",
  upsellrate: "",
  panelColors: "",
  formColors: "",
  labelPinPrintPath: "",
  invoicePinPrintPath: "",
  updatePath: "",
  URN: "",
  path: "",
  dbCustomPath: "",
});

const allCompanyData = async () => {
  await useApiFetch(`/api/utilities/Settings/getData?type=companyInfo`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.companyDataList;
        companyAllData.value = filters;
        // console.log("hello API POST -----------------", filters);
      }
    },
  });
};

const allEnvData = async () => {
  await useApiFetch(`/api/utilities/Settings/getData?type=envFle`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        const filters = response._data.sqlData;
        dbData.value = filters;
        //  console.log("hello API POST -----------------", filters);
      }
    },
  });
};

// const saveInformation = async () => {
//   const formData = {
//     creditStoreUserName: companyAllData.value.creditStoreUserName,
//     creditStoreName: companyAllData.value.creditStoreName,
//     creditCardPassword: companyAllData.value.creditCardPassword,
//     laborrate: companyAllData.value.laborrate,
//     serviceLaborRate: companyAllData.value.serviceLaborRate,
//     travelrate: companyAllData.value.travelrate,
//     onsiterate: companyAllData.value.onsiterate,
//     profitRate: companyAllData.value.profitRate,
//     upsellrate: companyAllData.value.upsellrate,
//     panelColors: companyAllData.value.panelColors,
//     formColors: companyAllData.value.formColors,
//     labelPinPrintPath: companyAllData.value.labelPinPrintPath,
//     invoicePinPrintPath: companyAllData.value.invoicePinPrintPath,
//     updatePath: companyAllData.value.updatePath,
//     URN: companyAllData.value.URN,
//   };
//   // console.log(formData)

//   try {
//     const {data} = await useFetch("/api/utilities/Settings/postData", {
//       method: "POST",
//       body: formData,
//     });
//     if (data.statusCode === 200) {
//       console.log("Form submitted successfully:", data.value);
//       toast.add({
//         title: "Successfully Save",
//         description: response._data.message,
//         icon: "i-heroicons-check-circle",
//         color: "green",
//       });
//     } else {
//       // inventoryDetailGridMeta.value.reportTableData = data._rawValue.body;
//        console.log("Form submitted successfully:", data.value);
//     }
//   } catch (err) {
//     console.error("Unexpected error:", err);
//   }
// };

const saveInformation = async () => {
  const formData = {
    creditStoreUserName: companyAllData.value.creditStoreUserName,
    creditStoreName: companyAllData.value.creditStoreName,
    creditCardPassword: companyAllData.value.creditCardPassword,
    laborrate: companyAllData.value.laborrate,
    serviceLaborRate: companyAllData.value.serviceLaborRate,
    travelrate: companyAllData.value.travelrate,
    onsiterate: companyAllData.value.onsiterate,
    profitRate: companyAllData.value.profitRate,
    upsellrate: companyAllData.value.upsellrate,
    panelColors: companyAllData.value.panelColors,
    formColors: companyAllData.value.formColors,
    labelPinPrintPath: companyAllData.value.labelPinPrintPath,
    invoicePinPrintPath: companyAllData.value.invoicePinPrintPath,
    updatePath: companyAllData.value.updatePath,
    URN: companyAllData.value.URN,
  };

  await useApiFetch(`/api/utilities/Settings/postData`, {
    method: "POST",
    body: formData,
    onResponse({ response }) {
      console.log(response);
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      } else {
        toast.add({
          title: "Failed",
          description: response._data.message,
          icon: "i-heroicons-check-circle",
          color: "red",
        });
      }
    },
  });
};

const items = [
  {
    label: "Shipping",
    key: "Shipping",
  },
  {
    label: "Tax",
    key: "Tax",
  },
  {
    label: "Company Info",
    key: "Company",
  },
  {
    label: "System",
    key: "System",
  },
  {
    label: "SQL",
    key: "SQL",
  },
  {
    label: "Paradynamix Service/Utils",
    key: "Paradynamix",
  },
  {
    label: "Inventory Journal Setup",
    key: "Inventory",
  },
];

const colorPickers = ref({
  panel: {
    isOpen: false,
    tempColor: "",
  },
  form: {
    isOpen: false,
    tempColor: "",
  },
});

const togglePanelColorPicker = () => {
  colorPickers.value.panel.isOpen = !colorPickers.value.panel.isOpen;
  if (colorPickers.value.panel.isOpen) {
    colorPickers.value.panel.tempColor = companyAllData.value.panelColors;
    colorPickers.value.form.isOpen = false;
  }
};

const toggleFormColorPicker = () => {
  colorPickers.value.form.isOpen = !colorPickers.value.form.isOpen;
  if (colorPickers.value.form.isOpen) {
    colorPickers.value.form.tempColor = companyAllData.value.formColors;
    colorPickers.value.panel.isOpen = false;
  }
};


const handlePanelColorConfirm = (selectedColor) => {
  companyAllData.value.panelColors = selectedColor;
  colorPickers.value.panel.isOpen = false;
};
const handleFormColorConfirm = (selectedColor) => {
  companyAllData.value.formColors = selectedColor;
  colorPickers.value.form.isOpen = false;
};
const handleColorCancel = (type) => {
  colorPickers.value[type].isOpen = false;
};

const openModal = () => {
  modalMeta.value.isServiceOrderModalOpen = true;
};
const openModal02 = () => {
  modalMeta.value.permissionModal = true;
};
const modalMeta = ref({
  isServiceOrderModalOpen: false,
  permissionModal: false,
});

const handleModalClose = () => {
  modalMeta.value.isServiceOrderModalOpen = false;
  modalMeta.value.permissionModal = false;
};

const handleModalSave = (data) => {
  modalMeta.value.permissionModal = false;
  console.log("Received input data from PopupCard:", data);
};
</script>

<template>
  <div class="px-4 py-2 gmsRedHeader">
    <h3 class="text-lg font-bold text-white">Settings</h3>
  </div>

  <div class="pt-2">
    <UTabs :items="items">
      <template #item="{ item }">
        <UCard class="h-[750px]">
          <div v-if="item.key === 'Shipping'" class="space-y-1">
            <ul>
              <h1>Shipping</h1>
            </ul>
          </div>
          <div v-else-if="item.key === 'Tax'" class="space-y-1">
            <ul>
              <h1>Tax</h1>
            </ul>
          </div>
          <div v-else-if="item.key === 'Company'" class="space-y-1">
            <div class="py-2">
              <h3>CREDIT CARD PROCESSING INFORMATION</h3>
            </div>

            <div class="grid grid-cols-4">
              <div class="space-y-2">
                <UFormGroup label="User Name">
                  <UInput v-model="companyAllData.creditStoreUserName" />
                </UFormGroup>
                <UFormGroup label="Store Name">
                  <UInput v-model="companyAllData.creditStoreName" />
                </UFormGroup>
                <UFormGroup label="Password">
                  <UInput v-model="companyAllData.creditCardPassword" />
                </UFormGroup>
              </div>

              <div class=""></div>

              <div class="space-y-2">
                <UFormGroup label="Direct Labor Rate">
                  <UInput v-model="companyAllData.laborrate" />
                </UFormGroup>
                <UFormGroup label="Service Labor Rate">
                  <UInput v-model="companyAllData.travelrate" />
                </UFormGroup>
                <UFormGroup label="Travel Labor Rate">
                  <UInput />
                </UFormGroup>
                <UFormGroup label="Mileage Rate">
                  <UInput v-model="companyAllData.onsiterate" />
                </UFormGroup>
                <UFormGroup label="Profit Rate">
                  <UInput v-model="companyAllData.profitRate" />
                </UFormGroup>
                <UFormGroup label="Upsell Rate">
                  <UInput v-model="companyAllData.upsellrate" />
                </UFormGroup>
              </div>
              <div class=""></div>
            </div>
          </div>

          <div v-else-if="item.key === 'System'" class="space-y-1">
            <div class="grid grid-cols-3 space-x-[70px]">
              <div class="space-y-2">
                <UFormGroup label="Base Panel Color">
                  <UInput v-model="companyAllData.panelColors" />
                </UFormGroup>
                <UFormGroup label="Base Form Color">
                  <UInput v-model="companyAllData.formColors" />
                </UFormGroup>
              </div>
              <div class="space-y-6 mt-[27px]">
                <!-- Panel Color Picker Button -->
                <div>
                  <UButton
                    :color="colorPickers.panel.isOpen ? 'primary' : 'gray'"
                    variant="outline"
                    class="items-center"
                    @click="togglePanelColorPicker"
                  >
                    #
                    <div
                      v-if="companyAllData.panelColors"
                      :style="{ backgroundColor: companyAllData.panelColors }"
                      class="w-4 h-4 rounded"
                    />
                  </UButton>

                  <!-- Panel Color Picker Modal -->
                  <div
                    v-if="colorPickers.panel.isOpen"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="() => handleColorCancel('panel')"
                  >
                    <div
                      class="bg-white rounded-lg shadow-lg"
                      style="width: 400px"
                    >
                      <div class="p-4">
                        <ColorPicker
                          v-model="colorPickers.panel.tempColor"
                          @confirm="handlePanelColorConfirm"
                          @cancel="() => handleColorCancel('panel')"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Color Picker Button -->
                <div>
                  <UButton
                    :color="colorPickers.form.isOpen ? 'primary' : 'gray'"
                    variant="outline"
                    class="items-center bg-red"
                    @click="toggleFormColorPicker"
                  >
                    #
                    <div
                      v-if="companyAllData.formColors"
                      :style="{ backgroundColor: companyAllData.formColors }"
                      class="w-4 h-4 rounded"
                    />
                  </UButton>

                  <!-- Form Color Picker Modal -->
                  <div
                    v-if="colorPickers.form.isOpen"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="() => handleColorCancel('form')"
                  >
                    <div
                      class="bg-white rounded-lg shadow-lg"
                      style="width: 400px"
                    >
                      <div class="p-4">
                        <ColorPicker
                          v-model="colorPickers.form.tempColor"
                          @confirm="handleFormColorConfirm"
                          @cancel="() => handleColorCancel('form')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <UTextarea
                  :rows="8"
                  class="w-full"
                  placeholder="Enter text here..."
                />
              </div>
            </div>
            <div class="py-2 space-y-2">
              <UFormGroup label="Shipping Label Print path">
                <UInput v-model="companyAllData.labelPinPrintPath" />
              </UFormGroup>
              <UFormGroup label="DotMatrix Server Path (invoice)">
                <UInput v-model="companyAllData.invoicePinPrintPath" />
              </UFormGroup>
              <UFormGroup label="Update Path(Location of version XML)">
                <UInput v-model="companyAllData.updatePath" />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-2 space-x-5">
              <div>
                <UFormGroup label="Help HTML Location">
                  <UInput v-model="companyAllData.URN" />
                </UFormGroup>
              </div>

              <div class="flex items-center pt-2">
                <UFormGroup>
                  <UCheckbox v-model="companyAllData.upsellrate" />
                </UFormGroup>
                <span class="ml-5">Use Zebra Printer For Parts Label</span>
              </div>
            </div>
          </div>

          <div v-else-if="item.key === 'SQL'" class="space-y-1">
            <div class="py-2">
              <h3 class="text-red-500 font-bold text-lg">
                Warning: Modification of this Area could
              </h3>
            </div>

            <div class="grid grid-cols-3 space-x-[70px]">
              <div class="space-y-2">
                <UFormGroup label="Provider">
                  <UInput v-model="dbData.Provider" />
                </UFormGroup>
                <UFormGroup label="Data Source">
                  <UInput v-model="dbData.Source" />
                </UFormGroup>
                <UFormGroup label="Network Library">
                  <UInput v-model="dbData.Network" />
                </UFormGroup>
                <UFormGroup label="Initial Catalog">
                  <UInput v-model="dbData.Initial" />
                </UFormGroup>
                <UFormGroup label="ID">
                  <UInput v-model="dbData.ID" />
                </UFormGroup>
              </div>
              <div class="space-y-2"></div>
              <div class="space-y-2"></div>
            </div>
            <div class="grid grid-cols-3 space-x-5">
              <div>
                <UFormGroup label="Password">
                  <UInput v-model="dbData.Password" type="password" />
                </UFormGroup>
              </div>
              <div class="space-y-2">
                <UFormGroup label="String Builder">
                  <UInput v-model="data" />
                </UFormGroup>
              </div>
              <div class="items-center mt-[23px]">
                <UFormGroup>
                  <UButton variant="outline" >#</UButton>
                </UFormGroup>
              </div>
            </div>
          </div>

          <div v-else-if="item.key === 'Paradynamix'" class="space-y-1">
            <div class="grid grid-cols-3 space-x-[70px]">
              <div class="space-y-4">
                <UButton variant="outline">Process Subassembly Script</UButton>
                <br />
                <UButton variant="outline">
                  Process Subassembly Script
                </UButton>
              </div>
              <div class="space-y-4">
                <UButton @click="openModal" variant="outline"
                  >Update SharePont path</UButton
                >

                <UButton @click="openModal" variant="outline"
                  >Update Secure SharePont path</UButton
                >
              </div>
              <div class="space-y-4">
                <UButton @click="openModal02" variant="outline"
                  >Seed Permission</UButton
                >
              </div>
            </div>
          </div>

          <div v-else-if="item.key === 'Inventory'" class="space-y-1">
            <div class="flex flex-row space-x-2 pt-[15px] px-[25px] pt-[10px]">
              <div class="basis-3/5">
                <UFormGroup label="Trigger">
                  <UInputMenu />
                </UFormGroup>
              </div>
              <div class="basis-3/5">
                <UFormGroup label="Account Debit">
                  <UInputMenu />
                </UFormGroup>
              </div>
              <div class="basis-3/5">
                <UFormGroup label="Account Debit">
                  <UInputMenu />
                </UFormGroup>
              </div>
              <div class="basis-3/5">
                <UFormGroup label="Product Line">
                  <UInputMenu />
                </UFormGroup>
              </div>

              <div class="basis-3/7 pt-[25px]">
                <UButton
                  icon="i-heroicons-plus"
                  variant="outline"
                  color="green"
                  @click="CreateTable"
                />
              </div>
            </div>
            <div class="px-[25px]">
              <UTable
                :rows="inventoryDetailGridMeta.details"
                :columns="inventoryDetailGridMeta.defaultColumns"
                :loading="inventoryDetailGridMeta.isLoading"
                class="w-full mt-[10px]"
                :ui="{
                  wrapper:
                    'overflow-y-auto h-60 border-2 border-gray-300 dark:border-gray-700',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    padding: 'p-0',
                  },
                  td: {
                    base: 'h-[31px]',
                    padding: 'py-0',
                  },
                }"
                :empty-state="{
                  icon: 'i-heroicons-circle-stack-20-solid',
                  label: 'No items.',
                }"
                @select="onSelect"
              >
              </UTable>
              <div class="basis-3/9 pt-[20px] flex justify-end">
                <UButton
                  variant="outline"
                  label="DELETE"
                  color="red"
                  @click="onRemoveReport"
                />
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UTabs>
    <div class="flex justify-end space-x-3 pt-[20px] mr-[30px]">
      <UButton
        icon="i-heroicons-document-text"
        label="Save"
        color="green"
        variant="outline"
        @click="saveInformation"
        truncate
      />

      <UButton
        icon="i-heroicons-minus-circle"
        label="Cancel"
        color="red"
        variant="outline"
        truncate
      />
    </div>
  </div>

  <UDashboardModal
    v-model="modalMeta.isServiceOrderModalOpen"
    title="Update the Sharepoint path on this machine"
    :ui="{
      title: 'text-sm text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-[#E8EBF2] py-4',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[500px] sm:max-w-9xl',
    }"
  >
    <PopupCard @close="handleModalClose" @save="handleModalSave" />
  </UDashboardModal>

  <UDashboardModal
    v-model="modalMeta.permissionModal"
    title=""
    :ui="{
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[400px] sm:max-w-9xl',
    }"
  >
    <PopupCard02 @close="handleModalClose" @save="handleModalSave" />
  </UDashboardModal>
</template>
