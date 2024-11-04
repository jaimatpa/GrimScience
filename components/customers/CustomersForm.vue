<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const emit = defineEmits(["close", "save", "select"]);
const props = defineProps({
  selectedCustomer: {
    type: [String, Number, null],
    required: true,
  },
  isModal: {
    type: [Boolean],
  },
});

watch(
  () => props.selectedCustomer,
  async (newValue, oldValue) => {
    if (newValue) {
      try {
        await editInit();
      } catch (error) {
        console.error("Error in watcher:", error);
      }
    }
  },
  { immediate: true }
);
const action = ref("add");
const toast = useToast();
const router = useRouter();
const customersFormInstance = getCurrentInstance();
const handleClear = () => {
  Object.keys(formData).forEach((key) => (formData[key] = null));
};
const loadingOverlay = ref(false);
const customerExist = ref(true);
const markets = ref([]);
const professions = ref([]);
const categories = ref([]);
const conferences = ref([]);
const usstates = ref([]);
const formData = reactive({
  UniqueID: null,
  market: null,
  number: null,
  source: professions[0],
  sourcedescription: null,
  SourceConfrence: null,
  fname: null,
  mi: null,
  lname: null,
  title: null,
  position: null,
  company1: null,
  company2: null,
  country: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  workphone: null,
  homephone: null,
  cellphone: null,
  fax: null,
  email: null,
  website: null,
  notes: null,
  billcompany1: null,
  billcompany2: null,
  billcountry: null,
  billaddress: null,
  billcity: null,
  billstate: null,
  billzip: null,
  billphone: null,
  billfax: null,
  attn: null,
  adddate: null,
  ParadynamixCatagory: null,
  fullname: null,
  Extension: null,
  ExtensionBill: null,
});

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        customerExist.value = true;
        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            formData[key] = response._data.body[key];
          }
        }
      }
    },
    onResponseError({}) {
      customerExist.value = false;
    },
  });
  propertiesInit();
  loadingOverlay.value = false;
};
const propertiesInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch("/api/customers/markets", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        markets.value = response._data.body;
      }
    },
    onResponseError() {
      markets.value = [];
    },
  });
  await useApiFetch("/api/customers/conferences", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        conferences.value = response._data.body;
      }
    },
    onResponseError() {
      conferences.value = [];
    },
  });
  await useApiFetch("/api/customers/categories", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        categories.value = response._data.body;
      }
    },
    onResponseError() {
      categories.value = [];
    },
  });
  await useApiFetch("/api/customers/professions", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        professions.value = response._data.body;
      }
    },
    onResponseError() {
      professions.value = [];
    },
  });
  await useApiFetch("/api/common/usstates", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        usstates.value = response._data.body;
      }
    },
    onResponseError() {
      usstates.value = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ];
    },
  });
  loadingOverlay.value = false;
};
const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.fname)
    errors.push({ path: "fname", message: "Please enter your frist name." });
  if (!state.lname)
    errors.push({ path: "lname", message: "Please enter a your last name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  if (!state.lname)
    errors.push({ path: "lname", message: "Please enter a your last name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  return errors;
};
const handleClose = async () => {
  if (customersFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const items = [
  {
    label: "Shipping Information",
    key: "shipping",
  },
  {
    label: "Billing Information",
    key: "billing",
  },
];
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (props.selectedCustomer === null) {
    await useApiFetch("/api/customers", {
      method: "POST",
      body: event.data,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
  } else {
    // Update Customer
    await useApiFetch(`/api/customers/${props.selectedCustomer}`, {
      method: "PUT",
      body: event.data,
      onResponse({ response }) {
        if (response.status === 200) {
          toast.add({
            title: "Success",
            description: response._data.message,
            icon: "i-heroicons-check-circle",
            color: "green",
          });
        }
      },
    });
  }
  emit("save");
};

const modalMeta = ref({
  isCustomerModalOpen: false,
  isOrderDetailModalOpen: false,
  isQuoteDetailModalOpen: false,
  isServiceOrderDetailModalOpen: false,
  isSiteVisitModalOpen: false,
  isSerialRecordModalOpen: false,
  isPrintLabelModalOpen: false,
  modalTitle: "New Customer",
});

const onOrderDetail = () => {
  modalMeta.value.isOrderDetailModalOpen = true;
};
const onQuoteDetail = () => {
  modalMeta.value.isQuoteDetailModalOpen = true;
};
const onServiceOrderDetail = () => {
  modalMeta.value.isServiceOrderDetailModalOpen = true;
};
const onSiteVisitDetail = () => {
  modalMeta.value.isSiteVisitModalOpen = true;
};
const onSerialRecord = () => {
  modalMeta.value.isSerialRecordModalOpen = true;
};
const onPrintLabel = () => {
  modalMeta.value.isPrintLabelModalOpen = true;
};
if (props.selectedCustomer !== null) editInit();
else propertiesInit();
</script>

<template>
  <div class="vl-parent">
    <loading
      v-model:active="loadingOverlay"
      :is-full-page="true"
      color="#000000"
      backgroundColor="#1B2533"
      loader="dots"
    />
  </div>
  <template v-if="!props.isModal && !customerExist">
    <CommonNotFound
      :name="'Customer not found'"
      :message="'The customer you are looking for does not exist'"
      :to="'/customers/customers/list'"
    />
  </template>
  <template v-else>
    <div>
      <UForm
        :validate="validate"
        :validate-on="['submit']"
        :state="formData"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div>
          <div class="flex flex-col space-y-2">
            <div class="grid grid-cols-1">
              <div class="gmsPurpleTitlebar py-1">
                <h2>Customer Information</h2>
              </div>
              <div class="flex flex-col space-y-2 p-3">
                <div class="flex flex-row space-x-3">
                  <div class="basis-1/5">
                    <UFormGroup label="Market" name="market">
                      <UInputMenu
                        v-model="formData.market"
                        v-model:query="formData.market"
                        :options="markets"
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/5">
                    <UFormGroup label="Number" name="number">
                      <UInput v-model="formData.number" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/5">
                    <UFormGroup label="Profession" name="profession">
                      <UInputMenu
                        v-model="formData.source"
                        v-model:query="formData.source"
                        :options="professions"
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/5">
                    <UFormGroup label="Category" name="categories">
                      <UInputMenu
                        v-model="formData.ParadynamixCatagory"
                        v-model:query="formData.ParadynamixCatagory"
                        :options="categories"
                      />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/5">
                    <UFormGroup label="Conferences" name="conferences">
                      <UInputMenu
                        v-model="formData.SourceConfrence"
                        v-model:query="formData.SourceConfrence"
                        :options="conferences"
                      />
                    </UFormGroup>
                  </div>
                </div>
              </div>

              <UTabs
                :items="items"
                :ui="{
                  wrapper: ' bg-gms-purple',
                  list: {
                    base: 'relative',
                    background: 'bg-gms-purple',
                    rounded: 'rounded-none',
                    shadow: 'shadow-none',
                    width: '',
                    marker: {
                      rounded: 'rounded-none',
                      shadow: 'shadow-none',
                    },
                    tab: {
                      background: '',
                      active: 'text-gray-900 dark:text-white',
                      inactive:
                        'text-gray-100 dark:text-gray-200 bg-gms-purple',
                      shadow: '',
                    },
                  },
                }"
              >
                <template #item="{ item }">
                  <div class="bg-white">
                    <div v-if="item.key === 'shipping'">
                      <div class="grid grid-cols-3 gap-3 p-3">
                        <div>
                          <div class="flex flex-row gap-3">
                            <div class="w-5/12">
                              <UFormGroup label="First" name="fname">
                                <UInput v-model="formData.fname" />
                              </UFormGroup>
                            </div>
                            <div class="w-2/12">
                              <UFormGroup label="MI" name="md">
                                <UInput v-model="formData.mi" />
                              </UFormGroup>
                            </div>
                            <div class="w-5/12">
                              <UFormGroup label="Last" name="lname">
                                <UInput v-model="formData.lname" />
                              </UFormGroup>
                            </div>
                          </div>
                          <div class="flex gap-3">
                            <div>
                              <UFormGroup label="Title" name="title">
                                <UInput v-model="formData.title" />
                              </UFormGroup>
                            </div>
                            <div>
                              <UFormGroup label="Position" name="position">
                                <UInput v-model="formData.position" />
                              </UFormGroup>
                            </div>
                          </div>
                          <div>
                            <UFormGroup label="Company 1" name="company1">
                              <UInput v-model="formData.company1" />
                            </UFormGroup>
                          </div>
                          <div>
                            <UFormGroup label="Company 2" name="company2">
                              <UInput v-model="formData.company2" />
                            </UFormGroup>
                          </div>
                          <div class="w-full">
                            <UFormGroup label="Country" name="country">
                              <UInput v-model="formData.country" />
                            </UFormGroup>
                          </div>
                        </div>
                        <div class="">
                          <div class="w-full">
                            <UFormGroup label="Address" name="address">
                              <UInput v-model="formData.address" />
                            </UFormGroup>
                          </div>
                          <div class="flex flex-row gap-3">
                            <div class="basis-3/6">
                              <UFormGroup label="City" name="city">
                                <UInput v-model="formData.city" />
                              </UFormGroup>
                            </div>
                            <div class="basis-1/6">
                              <UFormGroup label="State" name="state">
                                <UInputMenu
                                  v-model="formData.state"
                                  :options="usstates"
                                />
                              </UFormGroup>
                            </div>
                            <div class="basis-2/6">
                              <UFormGroup label="Zip" name="zip">
                                <UInput v-model="formData.zip" />
                              </UFormGroup>
                            </div>
                          </div>
                          <div class="flex flex-row gap-3">
                            <UFormGroup label="Fax" name="fax">
                              <UInput v-model="formData.fax" />
                            </UFormGroup>
                            <UFormGroup label="Homephone" name="homephone">
                              <UInput v-model="formData.homephone" />
                            </UFormGroup>
                          </div>
                          <div class="flex gap-3">
                            <UFormGroup label="Email" name="email">
                              <UInput v-model="formData.email" type="email" />
                            </UFormGroup>
                            <UFormGroup label="Workphone" name="workphone">
                              <UInput v-model="formData.workphone" />
                            </UFormGroup>
                          </div>
                          <div class="flex gap-3">
                            <UFormGroup label="Website" name="website">
                              <UInput v-model="formData.website" />
                            </UFormGroup>
                            <UFormGroup label="Cellphone" name="cellphone">
                              <UInput v-model="formData.cellphone" />
                            </UFormGroup>
                          </div>
                        </div>

                        <div
                          class="flex flex-row justify-end align-bottom space-x-3"
                        >
                          <div class="basis-2/12">
                            <UFormGroup label="Ext" name="ext">
                              <UInput v-model="formData.Extension" />
                            </UFormGroup>
                          </div>
                          <div class="w-full">
                            <UFormGroup label="Comment" name="comment">
                              <UTextarea
                                v-model="formData.notes"
                                :rows="4"
                                type="text"
                              />
                            </UFormGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="item.key === 'billing'">
                      <div class="grid grid-cols-2 gap-3 p-3">
                        <div>
                          <UFormGroup label="Attn" name="attn">
                            <UInput v-model="formData.attn" />
                          </UFormGroup>
                          <UFormGroup label="Company1" name="billcompany1">
                            <UInput v-model="formData.billcompany1" />
                          </UFormGroup>
                          <UFormGroup label="Company2" name="billcompany2">
                            <UInput v-model="formData.billcompany2" />
                          </UFormGroup>
                          <UFormGroup label="Country" name="country">
                            <UInput v-model="formData.billcountry" />
                          </UFormGroup>
                        </div>
                        <div>
                          <div class="flex flex-row space-x-3">
                            <div class="w-full">
                              <UFormGroup label="Address" name="address">
                                <UInput v-model="formData.billaddress" />
                              </UFormGroup>
                            </div>
                          </div>
                          <div class="flex flex-row space-x-3">
                            <div class="basis-1/2">
                              <UFormGroup label="City" name="billcity">
                                <UInput v-model="formData.billcity" />
                              </UFormGroup>
                            </div>
                            <div class="basis-1/4">
                              <UFormGroup label="State" name="billstate">
                                <UInputMenu
                                  v-model="formData.billstate"
                                  :options="usstates"
                                />
                              </UFormGroup>
                            </div>
                            <div class="basis-1/4">
                              <UFormGroup label="Zip" name="billzip">
                                <UInput v-model="formData.billzip" />
                              </UFormGroup>
                            </div>
                          </div>
                          <div class="flex flex-row space-x-3">
                            <div class="basis-5/12">
                              <UFormGroup label="Fax" name="billfax">
                                <UInput v-model="formData.billfax" />
                              </UFormGroup>
                            </div>
                            <div class="basis-5/12">
                              <UFormGroup label="Phone" name="billphone">
                                <UInput v-model="formData.billphone" />
                              </UFormGroup>
                            </div>
                            <div class="basis-2/12">
                              <UFormGroup label="Ext" name="ExtensionBill">
                                <UInput v-model="formData.ExtensionBill" />
                              </UFormGroup>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </UTabs>
            </div>
            <div class="p-3 flex space-x-4">
              <div class="w-1/6">
                <UButton
                  color="primary"
                  variant="outline"
                  type="submit"
                  :icon="
                    selectedCustomer !== null
                      ? 'i-heroicons-pencil-square'
                      : 'i-heroicons-plus'
                  "
                  :label="
                    selectedCustomer !== null
                      ? 'Modify Customer'
                      : 'Add Customer'
                  "
                  block
                />
              </div>

              <div class="w-1/6">
                <UButton
                  icon="i-heroicons-cursor-arrow-ripple"
                  variant="outline"
                  color="green"
                  label="Select"
                  truncate
                  @click="emit('select')"
                  block
                >
                </UButton>
              </div>

              <div class="w-1/6">
                <UButton
                  color="red"
                  variant="outline"
                  label="Clear"
                  icon="i-heroicons-arrow-path"
                  @click="handleClear"
                  block
                />
              </div>
            </div>
          </div>
        </div>
      </UForm>
      <div class="grid grid-cols-6 space-x-2">
        <div class="col-span-1">
          <div class="w-full px-3 py-1 gmsPurpleTitlebar">
            <h2>Serial Record</h2>
          </div>
          <div class="mt-4 p-3">
            <UButton
              label="View Serial Record"
              color="primary"
              variant="outline"
              icon="i-heroicons-eye"
              block
              @click="onSerialRecord"
            />
          </div>
        </div>
        <div class="col-span-5 flex flex-col">
          <div class="w-full px-3 py-1 gmsPurpleTitlebar">
            <h2>Create New</h2>
          </div>
          <div class="grid grid-cols-5 space-x-3 mt-4 p-3">
            <div>
              <UButton
                label="Label"
                @click="onPrintLabel()"
                color="green"
                variant="outline"
                icon="i-heroicons-tag"
                block
              />
            </div>
            <div>
              <UButton
                label="Order"
                color="green"
                variant="outline"
                icon="i-heroicons-shopping-cart"
                @click="onOrderDetail()"
                block
              />
            </div>
            <div>
              <UButton
                label="Quote"
                color="green"
                variant="outline"
                icon="i-heroicons-currency-dollar"
                @click="onQuoteDetail()"
                block
              />
            </div>
            <div>
              <UButton
                label="Service Order"
                color="green"
                variant="outline"
                icon="i-heroicons-chat-bubble-left-ellipsis"
                @click="onServiceOrderDetail()"
                block
              />
            </div>
            <div>
              <UButton
                label="Site Visit"
                color="green"
                variant="outline"
                icon="i-heroicons-clipboard-document-list"
                @click="onSiteVisitDetail()"
                block
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- serials records -->
    <UDashboardModal
      v-model="modalMeta.isSerialRecordModalOpen"
      title="Serial Record Finished Goods"
      :ui="{
        header: {
          base: 'bg-gms-blue',
        },
        width: 'w-[1250px]',
      }"
    >
      <MaterialsSerialsSerialList :is-page="false" />
    </UDashboardModal>
    <!-- Print Label Modal -->
    <UDashboardModal
      v-model="modalMeta.isPrintLabelModalOpen"
      title="Shipping Label"
      :ui="{
        header: {
          base: 'bg-gms-purple',
        },
        width: 'w-[800px]',
      }"
    >
      <CommonPrintLabel
        :customer-data="formData"
        action="customer"
        :is-page="false"
      />
    </UDashboardModal>
    <!-- Order Modal -->
    <UDashboardModal
      v-model="modalMeta.isOrderDetailModalOpen"
      title="Invoice"
      :ui="{
        header: {
          base: 'bg-gms-purple',
        },
        width: 'w-[1250px]',
      }"
    >
      <InvoiceDetail
        :selected-customer="selectedCustomer"
        @close="modalMeta.isOrderDetailModalOpen = false"
      />
    </UDashboardModal>
    <!-- Quote Modal -->
    <UDashboardModal
      v-model="modalMeta.isQuoteDetailModalOpen"
      title="Quote"
      :ui="{
        header: {
          base: 'bg-gms-purple',
        },
        width: 'w-[1250px]',
      }"
    >
      <CustomersQuoteDetail :selected-customer="selectedCustomer" />
    </UDashboardModal>
    <!-- Service Order Modal -->
    <UDashboardModal
      v-model="modalMeta.isServiceOrderDetailModalOpen"
      title="Service Order"
      :ui="{
        header: {
          base: 'bg-gms-purple',
        },
        width: 'w-[1250px]',
      }"
    >
      <ServiceOrderDetail
        :selected-customer="selectedCustomer"
        :form-action="action"
        :selected-complaint="null"
        :selected-order="null"
        :selected-serial="null"
      />
    </UDashboardModal>
    <!-- Site Visit Modal -->
    <UDashboardModal
      v-model="modalMeta.isSiteVisitModalOpen"
      title="Site Visit"
      :ui="{
        header: {
          base: 'bg-gms-purple',
        },
        width: 'w-[1250px]',
      }"
    >
      <CustomersSiteVisitDetail :selected-customer="selectedCustomer" />
    </UDashboardModal>
  </template>
</template>
