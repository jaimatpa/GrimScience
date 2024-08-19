<script setup>
const props = defineProps({
  modalMeta: {
    type: Object,
    required: true,
  },
});

const { modalMeta } = props;

const formData = reactive({
  UniqueId: 1,
  date: null,
  vendor: null,
  phone: null,
  total: null,
  open: false,
});

const onSubmit = async () => {
  console.log(formData);
  await useApiFetch(`/api/materials/purchase/`, {
    method: "POST",
    body: JSON.stringify(formData),
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
      <UInput v-model="formData.vendor" placeholder="Vandor Name" />
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
