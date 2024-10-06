<script setup>
const props = defineProps({
  modalMeta: {
    type: Object,
    required: true,
  },
});

const { modalMeta } = props;

const formData = reactive({
  date: null,
  vendor: null,
  phone: null,
  total: null,
  open: false,
  ship_to: null,
});

const vendors = ref([]);
const ship_to_options = ref([
  "707 Gilman Avenue",
  "PO BOX 2143",
  "2422 Waterford Rd.",
]);

// fetch vendors

const fetchVendors = async () => {
  await useApiFetch(`/api/materials/purchase/dropdown/vendors`, {
    method: "GET",
    onResponse: ({ response }) => {
      console.log(response);

      vendors.value = response?._data?.body;
    },
  });
};

const onSubmit = async () => {
  console.log(formData);
  await useApiFetch(`/api/materials/purchase/`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
    },
    onResponse: ({ response }) => {
      console.log(response);
      const message = response?._data?.message;
      const status = response?._data?.status;
      if (status === 201) {
        toast.add({
          title: "Success",
          description: message,
          color: "green",
        });
        modalMeta.isOrderDetailModalOpen = false;
      }
    },
  });
};

fetchVendors();
</script>

<template>
  <UForm
    :state="formData"
    :validate="validate"
    :validate-on="['submit']"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormGroup label="Vendor" name="vendor">
      <!-- <UInput v-model="formData.vendor" placeholder="Vandor Name" /> -->
      <UInputMenu
        v-model="formData.vendor"
        :options="vendors"
        by="UniqueID"
        option-attribute="NAME"
        value-attribute="UniqueID"
        :search-attributes="['NAME']"
        placeholder="-- select a vendor --"
      >
        <template #option="{ option: person }">
          <span class="truncate">{{ person.NAME }}</span>
        </template>
      </UInputMenu>
    </UFormGroup>
    <UFormGroup label="Phone" name="phone">
      <UInput v-model="formData.phone" placeholder="Phone Number" />
    </UFormGroup>
    <UFormGroup label="Total" name="total">
      <UInput v-model="formData.total" placeholder="Total" />
    </UFormGroup>
    <UFormGroup label="Date" name="date">
      <UInput v-model="formData.date" type="date" placeholder="Select Date" />
    </UFormGroup>
    <UFormGroup label="Date" name="date">
      <UInputMenu v-model="ship_to" :options="ship_to_options" />
    </UFormGroup>
    <UFormGroup label="Open" name="open">
      <UCheckbox v-model="formData.open" label="Is Open?" />
    </UFormGroup>
    <UButton
      color="cyan"
      variant="solid"
      type="submit"
      label="Create Purchase"
      class="text-center w-[max-content]"
    />
  </UForm>
</template>
