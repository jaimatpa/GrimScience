<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";
import type { UTableColumn } from "~/types";
import Parts from "~/pages/materials/parts.vue";
const toast = useToast();

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  selectedCustomer: {
    type: [Number, String, null],
    required: false,
  },
  selectedOrder: {
    type: [Number, String, null],
  },
});

const user = useCookie<string>('user');
const username = user.value.fname+" "+user.value.lname

const productTableMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "productline",
      label: "Product Line",
    },
    {
      key: "model",
      label: "Number",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "sellingPrice",
      label: "Price",
    },
  ],

  productsTableValue: [],
  selectedProduct: null,
  isPartModalOpen: false,
  isLoading: false,
});

const productFilterValues = ref({
  productLine: null,
  model: null,
  showOnlyInventory: false,
});

const quantityTableMeta = ref({
  defaultColumns: <UTableColumn[]>[
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "number",
      label: "Number",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "price",
      label: "Price",
    },
  ],

  quantityTableValue: [],
  selectedQuantity: null,
  isLoading: false,
});

const loadingOverlay = ref(false);

//Customer informations
const customerFormData = reactive({
  market: null,
  number: null,
  source: null,
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

//Quote-Order information
const orderFormData = reactive({
  Backorder: null,
  InstallationBy: null,
  MDET: null,
  MDET1: null,
  Notes: null,
  Quote: null,
  QuoteInvioceNumber: null,
  QuoteOrderNumber: null,
  TrackingNumbers: null,
  UniqueID: null,
  acceptancedate: null,
  checking: null,
  checknoorcreditcardinfo: null,
  cod: null,
  complaintID: null,
  customerid: props.selectedCustomer,
  datepromised: null,
  estimatedbooking: null,
  estimatedship: null,
  exempt: null,
  expirationdate: null,
  fob: null,
  invoicedate: null,
  invoicenumber: null,
  laborcost: null,
  lessdiscount: null,
  lessdown: null,
  materialcost: null,
  orderdate: null,
  orderid: null,
  purchaseordernumber: null,
  quotenumber: null,
  referphone1: null,
  referphone2: null,
  referphone3: null,
  referredby: null,
  shipdate: null,
  shipping: null,
  shippingmethod: null,
  soldby: null,
  source: null,
  sourcedescription: null,
  specialinstructions1: null,
  specialinstructions2: null,
  status: 'Quote Pending',
  subtotal: null,
  tax: null,
  terms: null,
  total: null,
  warranty: null,
  weekstodelivery: null,
  zone: null,
});

const fetchProducts = async () => {
  if (!productFilterValues.value.productLine) {
    productTableMeta.value.productsTableValue = [];
    return;
  }
  productTableMeta.value.isLoading = true;
  try {
    await useApiFetch("/api/quotes/productLineTbl", {
      method: "GET",
      params: {
        ...productFilterValues.value,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          productTableMeta.value.productsTableValue = response._data.body;
        }
      },
      onResponseError({ response }) {
        productTableMeta.value.productsTableValue = [];
        toast.add({
          title: "Error",
          description: "Failed to fetch products",
          color: "red",
        });
      },
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    productTableMeta.value.isLoading = false;
  }
};

const quoteDetails = async (id=props.selectedOrder) => {
  loadingOverlay.value = true;
  if (propsOrderId.value) {
    await useApiFetch(`/api/quotes/singleOrder`, {
      method: "GET",
      params: {
        orderId: propsOrderId.value,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          loadingOverlay.value = false;
          for (const key in response._data.body) {
            if (response._data.body[key]) {
              orderFormData[key] = response._data.body[key];
            }
          }
        }
      },
    });
  }
  await customerDetails();
  loadingOverlay.value = false;
};

const customerDetails = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/tbl/tblCustomers/${props.selectedCustomer}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        for (const key in response._data.body) {
          if (response._data.body[key]) {
            customerFormData[key] = response._data.body[key];
          }
        }
      }
    },
  });
  loadingOverlay.value = false;
};

const fetchQuoteNumber = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/quotes/quotenumber`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        orderFormData.quotenumber = response._data.body.quotenumber
        orderFormData.invoicedate = response._data.body.invoicedate
        orderFormData.expirationdate = response._data.body.expirationdate
      }
    },
  });
  loadingOverlay.value = false;
};

const sourceDescriptionList = ref([]);
const sourceList = ref([]);
const productLineList = ref([]);
const statusList = ref([]);

const fetchSourceDescription = async (source) => {
  if (!source) {
    sourceDescriptionList.value = [];
    return;
  }
  await useApiFetch(`/api/quotes/sourceDescriptions`, {
    method: "GET",
    query: { source },
    onResponse({ response }) {
      if (response.status === 200) {
        sourceDescriptionList.value = response._data.body;
      }
    },
    onResponseError({ error }) {
      sourceDescriptionList.value = [];
    },
  });
};

watch(
  () => orderFormData.source,
  async (newSource) => {
    await fetchSourceDescription(newSource);
  },
  { immediate: true }
);

watch(() => orderFormData.invoicedate, async (newInvoiceDate) => {
  if (newInvoiceDate) {
    const expirationdate = new Date(newInvoiceDate);
    expirationdate.setMonth(newInvoiceDate.getMonth() + 1);
    orderFormData.expirationdate = expirationdate
  }
});

watch(() => orderFormData.estimatedship, async (newEstimatedship) => {
  if (newEstimatedship) {
    const estimatedbooking = new Date(newEstimatedship);
    estimatedbooking.setDate(newEstimatedship.getDate() - 126);
    orderFormData.estimatedbooking = estimatedbooking
  }
});

const fetchDropdownOptions = async () => {
  await useApiFetch("/api/quotes/source", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        sourceList.value = response._data.body;
      }
    },
    onResponseError() {
      sourceList.value = [];
    },
  });

  await useApiFetch("/api/quotes/productLineList", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        productLineList.value = response._data.body;
      }
    },
    onResponseError() {
      productLineList.value = [];
    },
  });

  await useApiFetch("/api/quotes/OrderStatuses", {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        statusList.value = response._data.body;
      }
    },
    onResponseError() {
      statusList.value = [];
    },
  });
};

const fetchOrderDetails = async () => {
  try {
    await useApiFetch(`/api/quotes/quantityTbl`, {
      method: "GET",
      query: { orderId: propsOrderId.value },
      onResponse({ response }) {
        if (response.status === 200) {
          quantityTableMeta.value.quantityTableValue = response._data.body;
        }
      },
      onResponseError({ error }) {
        quantityTableMeta.value.quantityTableValue = [];
        toast.add({
          title: "Error",
          description: "Failed to fetch order details",
          color: "red",
        });
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const orderDetailsFormData = reactive({
  orderid: props.selectedOrder || 0,
  quantity: null,
  type: null,
  name: null,
  price: null,
  bpid: null,
});

const addOrderItem = async () => {

  if (!orderDetailsFormData.orderid) {
    await createOrder();
    orderDetailsFormData.orderid = propsOrderId.value;
  }

  if (orderDetailsFormData.quantity <= 0) {
    toast.add({
      title: "Error",
      description: "Quantity must be greater than 0",
      color: "red",
    });
    return;
  }

  await useApiFetch("/api/quotes/addOrder", {
    method: "POST",
    body: { ...orderDetailsFormData, customerid:props.selectedCustomer, quotenumber:orderFormData.quotenumber, status:orderFormData.status, invoicedate:orderFormData.invoicedate, expirationdate: orderFormData.expirationdate, username },
    onResponse({ response }) {
      if (response.status === 200) {

        orderDetailsFormData.quantity = null;
        orderDetailsFormData.type = null;
        orderDetailsFormData.name = null;
        orderDetailsFormData.price = null;
        orderDetailsFormData.bpid = null;

        toast.add({
          title: "Success",
          description: "Order item added successfully",
          color: "green",
        });
        quoteDetails(response._data.body)
        fetchOrderDetails(response._data.body);
      }
    },

    onResponseError({ response }) {
      toast.add({
        title: "Error",
        description: response._data?.message || "Failed to add order item",
        color: "red",
      });
    },
  });
};

const removeOrderDetail = async () => {
  if (!orderDetailsRowData.uniqueid) {
    toast.add({
      title: "Error",
      description: "No item selected to remove",
      color: "red",
    });
    return;
  }
  const confirmed = await confirm(
    "Are you sure you want to remove this item from the order? This cannot be undone."
  );
  if (!confirmed) return;

  await useApiFetch("/api/quotes/remove", {
    method: "DELETE",
    body: {
      orderDetailId: orderDetailsRowData.uniqueid,
    },
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Item removed successfully",
          color: "green",
        });
        fetchOrderDetails();
      }
    },
    onResponseError({ response }) {
      toast.add({
        title: "Error",
        description: response._data?.message || "Failed to remove item",
        color: "red",
      });
    },
  });
};

const productInstanceId = ref(null);

const selectProductLine = (row) => {
  productInstanceId.value = row.instanceid;
  productTableMeta.value.selectedProduct = row.uniqueid;

  orderDetailsFormData.quantity = 1;
  orderDetailsFormData.type = row.model;
  orderDetailsFormData.name = row.description;
  orderDetailsFormData.price = row.sellingPrice;
  orderDetailsFormData.bpid = row.uniqueid;

  productTableMeta.value.productsTableValue.forEach((quotes) => {
    quotes.class = quotes.uniqueid === row.uniqueid ? "bg-blue-100" : "";
  });
};

const handlePriceUpdate = async () => {
  await useApiFetch("/api/quotes/priceupdate", {
    method: "POST",
    body: {
      orderDetailId: orderDetailsRowData.uniqueid,
      newPrice: orderDetailsRowData.price,
    },

    onResponse({ response }) {
      if (response.status === 200) {
        orderDetailsRowData.isPriceUpdateModalOpen = false;

        toast.add({
          title: "Success",
          description: "Price updated successfully",
          color: "green",
        });
        
        fetchOrderDetails();
      }
    },
    onResponseError({ response }) {
      toast.add({
        title: "Error",
        description: response._data?.message || "Failed to update price",
        color: "red",
      });
    },
  });
};

const quoteFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    quoteFile.value = file;
  } else {
    event.target.value = "";
  }
};

const fileUpload = async (orderFormData: any) => {
  const formData = new FormData();

  if (quoteFile.value) {
    formData.append("Quote", quoteFile.value);
  }
  try {
    const response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const responseData = await response.json();
      responseData.files.forEach((file) => {
        if (file.fileType === "Quote") {
          orderFormData.Quote = file.url;
        }
      });
      quoteFile.value = null;
      toast.add({
        title: "Success",
        description: "File Added successfully!",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    } else {
      throw new Error("Upload failed!");
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("An error occurred while uploading the file. Please try again.");
  }
};

const handleSave = async () => {
  loadingOverlay.value = true;
  try {
    if (quoteFile.value) {
      await fileUpload(orderFormData);
    }

    await useApiFetch("/api/quotes/savequote", {
      method: "POST",
      body: {
        orderFormData: {
          ...orderFormData,
        },
        orderDetails: quantityTableMeta.value.quantityTableValue.map(
          (item) => ({
            quantity: item.quantity,
            number: item.number,
            name: item.description,
            price: item.price,
            type: item.type || item.number,
            serial: item.serial || "",
            uniqueid: item.uniqueid,
            inventoryid: item.inventoryid || "0",
            bpid: item.bpid || "0",
          })
        ),
        orderid: propsOrderId.value,
        customerid: props.selectedCustomer,
      },
      onResponse({ response }) {
        if (response.status === 200) {
          quoteDetails(response._data.body.orderid)
          toast.add({
            title: "Success",
            description: "Quote saved successfully",
            color: "green",
          });
        }
      },
      onResponseError({ response }) {
        toast.add({
          title: "Error",
          description: response._data?.message || "Failed to save quote",
          color: "red",
        });
      },
    });
  } catch (error) {
    console.error("Error saving quote:", error);
    toast.add({
      title: "Error",
      description: "An unexpected error occurred while saving",
      color: "red",
    });
  } finally {
    loadingOverlay.value = false;
  }
};

const handlePreviewReport = async () => {
  if (!propsOrderId.value) {
    toast.add({
      title: "Error",
      description: "Please save the quote first before previewing.",
      color: "red",
    });
    return;
  }

  const pdfUrl = `/api/quotes/pdfpreview/${propsOrderId.value}`;
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Failed to fetch PDF");

    const blob = await response.blob();
    const pdfContentUrl = URL.createObjectURL(blob);
    window.open(pdfContentUrl, "_blank");
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "Error generating preview. Please try again.",
      color: "red",
    });
  }
};

const orderDetailsRowData = reactive({
  orderid: props.selectedOrder,
  quantity: null,
  type: null,
  name: null,
  bpid: null,
  serial: null,
  inventoryid: null,

  uniqueid: null,
  price: null,

  isPriceUpdateModalOpen: false,
});

const selectQuantityRow = (row) => {
  orderDetailsRowData.uniqueid = row.uniqueid;
  orderDetailsRowData.price = row.price;

  quantityTableMeta.value.quantityTableValue.forEach((order) => {
    order.class = order.uniqueid === row.uniqueid ? "bg-blue-100" : "";
  });
};

const handlePriceUpdateModal = () => {
  if (!orderDetailsRowData.uniqueid) {
    toast.add({
      title: "Error",
      description: "No item selected to update price.",
      color: "red",
    });
    return;
  } else orderDetailsRowData.isPriceUpdateModalOpen = true;
};

const dblclickOpenParts = () => {
  productTableMeta.value.isPartModalOpen = true;
};

// add if no props
const createOrder = async () => {
    await useApiFetch(`/api/quotes/quotenumber`, {
      method: "POST",
      body: {
        ...orderFormData
      },
      onResponse({ response }) {
        if (response.status === 200) {
          const createdOrder = response._data.body;
          propsOrderId.value = response._data.body.UniqueID;

          for (const key in createdOrder) {
            if (createdOrder[key]) {
              orderFormData[key] = createdOrder[key];
            }
          }
        }
      },
    });
};

const fetchQuoteNumber = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/quotes/quotenumber`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        orderFormData.quotenumber = response._data.body.quotenumber;
        orderFormData.invoicedate = response._data.body.invoicedate;
        orderFormData.expirationdate = response._data.body.expirationdate;
      }
    },
  });
  loadingOverlay.value = false;
};
const propsOrderId = ref(null);

if (!props.selectedOrder) {
  await fetchDropdownOptions();
  await customerDetails();
  await fetchQuoteNumber();
} else {
  propsOrderId.value = props.selectedOrder;
  await quoteDetails();
  await fetchOrderDetails();
  await fetchDropdownOptions();
}
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

  <UForm :state="customerFormData">
    <div class="flex flex-col">
      <div class="flex flex-row border-b-[4px] border-black">
        <div class="basis-2/5 border-r-[3px] border-black">
          <div class="w-full px-3 py-2 gmsPurpleTitlebar">
            Quote Information
          </div>
          <div class="flex flex-col px-3 py-3 space-y-1">
            <div class="flex flex-row">
              <div class="basis-1/2">
                <UFormGroup label="Quote #" name="quoteID">
                  <div>
                    {{
                      orderFormData.quotenumber ? orderFormData.quotenumber : ""
                    }}
                  </div>
                </UFormGroup>
              </div>
              <div class="basis-1/2 flex flex-col space-y-1">
                <div>
                  <UFormGroup label="Quote Date(Invoice Date)" name="quoteDate">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton
                        icon="i-heroicons-calendar-days-20-solid"
                        :label="
                          orderFormData.invoicedate &&
                          format(orderFormData.invoicedate, 'MM/dd/yyyy')
                        "
                        variant="outline"
                        :ui="{ base: 'w-full' }"
                      />
                      <template #panel="{ close }">
                        <CommonDatePicker
                          v-model="orderFormData.invoicedate"
                          is-required
                          @close="close"
                        />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div>
                  <UFormGroup label="Expiration Date" name="expirationDate">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton
                        icon="i-heroicons-calendar-days-20-solid"
                        :label="
                          orderFormData.expirationdate &&
                          format(orderFormData.expirationdate, 'MM/dd/yyyy')
                        "
                        variant="outline"
                        :ui="{
                          base: 'w-full',
                          truncate: 'flex justify-center w-full',
                        }"
                      />
                      <template #panel="{ close }">
                        <CommonDatePicker
                          v-model="orderFormData.expirationdate"
                          @close="close"
                        />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
              </div>
            </div>
            <div>
              <UFormGroup label="Source" name="source">
                <UInputMenu
                  v-model="orderFormData.source"
                  :options="sourceList"
                />
              </UFormGroup>
            </div>
            <div>
              <UFormGroup label="Source Description" name="sourceDescription">
                <UInputMenu
                  v-model="orderFormData.sourcedescription"
                  :options="sourceDescriptionList"
                />
              </UFormGroup>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="basis-1/2">
                <UFormGroup label="Estimated Booking" name="bookingEst">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        orderFormData.estimatedbooking &&
                        format(orderFormData.estimatedbooking, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{ base: 'w-full' }"
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="orderFormData.estimatedbooking"
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
              <div class="basis-1/2">
                <UFormGroup label="Estimated Ship" name="shipEst">
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton
                      icon="i-heroicons-calendar-days-20-solid"
                      :label="
                        orderFormData.estimatedship &&
                        format(orderFormData.estimatedship, 'MM/dd/yyyy')
                      "
                      variant="outline"
                      :ui="{ base: 'w-full' }"
                    />
                    <template #panel="{ close }">
                      <CommonDatePicker
                        v-model="orderFormData.estimatedship"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </UFormGroup>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info (Read only) -->

        <div class="basis-3/5">
          <div class="w-full px-3 py-2 gmsPurpleTitlebar">
            Customer Informaton
          </div>
          <div class="flex flex-col px-3 py-3 space-y-2">
            <div>
              Customer#
              {{ customerFormData.number ? customerFormData.number : "" }}
            </div>
            <div class="flex flex-row space-x-4">
              <div class="basis-1/2">
                <div class="font-bold border-b-[1px] border-black">
                  Shipping Information
                </div>
                <div class="flex flex-col mt-4 space-y-3">
                  <div>
                    {{ customerFormData.fname ? customerFormData.fname : "" }}
                    {{ customerFormData.lname ? customerFormData.lname : "" }}
                  </div>
                  <div>
                    {{
                      customerFormData.company1 ? customerFormData.company1 : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.company2 ? customerFormData.company2 : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.address ? customerFormData.address : ""
                    }}
                  </div>
                  <div>
                    {{ customerFormData.city ? customerFormData.city : "" }}
                    {{
                      customerFormData.state
                        ? `, ${customerFormData.state}`
                        : ""
                    }}
                    {{
                      customerFormData.zip
                        ? `,
                ${customerFormData.zip}`
                        : ""
                    }}
                  </div>
                  <div class="flex flex-row">
                    <div class="basis-1/2">
                      {{
                        customerFormData.homephone
                          ? `H: ${customerFormData.homephone}`
                          : ""
                      }}
                    </div>
                    <div class="basis-1/2">
                      {{
                        customerFormData.workphone
                          ? `W: ${customerFormData.workphone}`
                          : ""
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="basis-1/2">
                <div class="font-bold border-b-[1px] border-black">
                  Billing Information
                </div>
                <div class="flex flex-col mt-4 space-y-3">
                  <div>
                    {{ customerFormData.attn ? customerFormData.attn : "" }}
                  </div>
                  <div>
                    {{
                      customerFormData.billcompany1
                        ? customerFormData.billcompany1
                        : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.billcompany2
                        ? customerFormData.billcompany2
                        : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.billaddress
                        ? customerFormData.billaddress
                        : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.billcity ? customerFormData.billcity : ""
                    }}
                    {{
                      customerFormData.billstate
                        ? `, ${customerFormData.billstate}`
                        : ""
                    }}
                    {{
                      customerFormData.billzip
                        ? `, ${customerFormData.billzip}`
                        : ""
                    }}
                  </div>
                  <div>
                    {{
                      customerFormData.billphone
                        ? customerFormData.billphone
                        : ""
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle section -->
      <div class="border-b-[4px] border-black px-3 py-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-1">
            <UFormGroup label="Quote" name="quote">
              <div class="flex items-center h-[30px]">
                <div
                  class="flex-grow truncate border border-gray-300 px-2 text-sm bg-white h-full flex items-center"
                >
                  <span v-if="quoteFile" class="truncate">
                    {{ quoteFile.name }}
                  </span>
                  <span v-else-if="orderFormData.Quote" class="truncate">
                    {{ orderFormData.Quote.split("/").pop() }}
                  </span>
                </div>
                <label class="cursor-pointer flex h-full">
                  <div
                    class="bg-gms-purple text-white px-3 h-full flex items-center border-y border-r border-gray-300"
                  >
                    <span class="material-icons text-sm">...</span>
                  </div>
                  <input
                    type="file"
                    class="hidden"
                    accept="application/pdf"
                    @change="handleFileChange"
                  />
                </label>
              </div>
            </UFormGroup>
          </div>

          <div class="col-span-2 ms-3 mt-auto">
            <UFormGroup label="" name="">
              <UInput />
            </UFormGroup>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mt-3">
          <div class="col-span-1 w-[200px]">
            <UFormGroup label="Status" name="status">
              <USelect v-model="orderFormData.status" :options="statusList" />
            </UFormGroup>
          </div>

          <div class="col-span-2 ms-3">
            <UFormGroup label="Notes" name="notes">
              <UInput v-model="orderFormData.Notes" />
            </UFormGroup>
          </div>
        </div>
      </div>

      <!-- Items Quoted section -->
      <div>
        <div class="w-full px-3 py-2 gmsPurpleTitlebar">Items Quoted</div>
        <div class="w-full px-3 py-3">
          <div class="flex flex-col">
            <div class="flex justify-between mb-3">
              <div class="flex flex-row space-x-2">
                <UFormGroup
                  label="Product Line"
                  name="productLine"
                  class="w-[200px]"
                >
                  <USelect
                    v-model="productFilterValues.productLine"
                    :options="productLineList"
                    @change="fetchProducts"
                  />
                </UFormGroup>
                <UFormGroup label="Model" name="categories" class="w-[200px]">
                  <UInput
                    v-model="productFilterValues.model"
                    @update:modelValue="fetchProducts"
                  />
                </UFormGroup>
              </div>
              <div class="flex justify-between items-center space-x-2">
                <label for="Inventory" class="cursor-pointer"
                  >Show Only Available Inventory</label
                >
                <UCheckbox
                  v-model="productFilterValues.showOnlyInventory"
                  @change="fetchProducts"
                  id="Inventory"
                />
              </div>
            </div>

            <div>
              <UTable
                :columns="productTableMeta.defaultColumns"
                :rows="productTableMeta.productsTableValue"
                @select="selectProductLine"
                @dblclick="dblclickOpenParts"
                :ui="{
                  wrapper:
                    'h-48 overflow-y-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                  },
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white',
                    padding: 'py-0',
                  },
                  td: {
                    base: 'h-[22px]',
                    padding: 'py-0',
                  },
                }"
              />
            </div>

            <div class="flex justify-between my-3">
              <div class="flex flex-row space-x-3 items-center">
                <div>Qty</div>
                <UInput
                  v-model="orderDetailsFormData.quantity"
                  class="w-[80px]"
                />
                <div>Serial</div>
              </div>

              <div class="flex justify-between items-center space-x-3">
                <div>
                  <UButton
                    label="ADD"
                    color="gms-purple"
                    :ui="{ base: 'min-w-[125px] justify-center' }"
                    @click="addOrderItem"
                  />
                </div>
              </div>
            </div>

            <div>
              <UTable
                :columns="quantityTableMeta.defaultColumns"
                :rows="quantityTableMeta.quantityTableValue"
                @select="selectQuantityRow"
                @dblclick="handlePriceUpdateModal"
                :ui="{
                  wrapper:
                    'h-28 overflow-y-auto border border-gray-400 dark:border-gray-700 gms-ModalFormText',
                  divide: 'divide-gray-200 dark:divide-gray-800',
                  tr: {
                    active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
                  },
                  th: {
                    base: 'sticky top-0 z-10',
                    color: 'bg-white',
                    padding: 'py-0',
                  },
                  td: {
                    base: 'h-[22px]',
                    padding: 'py-0',
                  },
                }"
              />
            </div>
            <div class="ms-auto mt-2">
              <UButton
                label="Update Price"
                color="gms-gray"
                variant="outline"
                @click="handlePriceUpdateModal"
                :ui="{
                  base: 'min-w-[140px]',
                  truncate: 'flex justify-center w-full',
                }"
                truncate
              />
            </div>

            <!-- Button Actions -->
            <div class="flex justify-between mt-4 mb-1">
              <div>
                <UButton
                  icon="i-heroicons-document-text"
                  label="Save"
                  color="green"
                  variant="outline"
                  @click="handleSave"
                  :ui="{
                    base: 'min-w-[200px]',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
              <div class="flex flex-row space-x-3">
                <UButton
                  icon="i-heroicons-printer"
                  label="Print Folder Label"
                  variant="outline"
                  color="gms-purple"
                  :ui="{
                    base: 'min-w-[200px]',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
                <UButton
                  icon="i-heroicons-chat-bubble-oval-left-ellipsis"
                  label="Preview Report"
                  color="primary"
                  variant="outline"
                  @click="handlePreviewReport"
                  :ui="{
                    base: 'min-w-[200px]',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
                <UButton
                  icon="i-heroicons-minus-circle"
                  label="Remove"
                  color="gms-red"
                  variant="outline"
                  @click="removeOrderDetail"
                  :ui="{
                    base: 'min-w-[200px]',
                    truncate: 'flex justify-center w-full',
                  }"
                  truncate
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UForm>

  <!-- Add this near your other dialogs -->
  <UDashboardModal
    v-model="orderDetailsRowData.isPriceUpdateModalOpen"
    title="GSM"
    :ui="{
      title: 'text-lg text-black',
      header: {
        base: 'flex flex-row min-h-[0] items-center border-white border-b-[2px]',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'w-[400px]',
    }"
  >
    <div class="space-y-3 p-5">
      <div class="grid grid-cols-2">
        <div>Please enter in a new price?</div>

        <div class="flex flex-col gap-2">
          <div class="ms-auto">
            <UButton
              label="OK"
              color="gray"
              variant="outline"
              @click="handlePriceUpdate"
              :ui="{
                base: 'w-[60px]',
              }"
            />
          </div>
          <div class="ms-auto">
            <UButton
              label="Cancel"
              color="gray"
              variant="outline"
              @click="orderDetailsRowData.isPriceUpdateModalOpen = false"
              :ui="{
                base: 'w-[60px]',
              }"
            />
          </div>
        </div>
      </div>

      <div>
        <UInput
          v-model="orderDetailsRowData.price"
          step="0.01"
          :ui="{
            base: 'w-full',
            input: 'border border-gray-300',
          }"
        />
      </div>
    </div>
  </UDashboardModal>

  <!-- Parts Modal -->
  <UDashboardModal
    v-model="productTableMeta.isPartModalOpen"
    title="Parts"
    :ui="{
      title: 'text-lg gmsBlueHeader',
      header: {
        base: 'flex flex-row min-h-[0] items-center gmsBlueHeader border-white border-b-[1px]',
        padding: 'pt-5 sm:px-9',
      },
      body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
      width: 'container sm:max-w-7xl',
    }"
  >
    <Parts
      :selected-parts="productInstanceId"
      :selected-partInstace="productInstanceId"
      :isModal="true"
    />
  </UDashboardModal>
</template>
