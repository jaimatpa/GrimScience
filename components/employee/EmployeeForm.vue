<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { format } from "date-fns";

const fileRef = ref<HTMLInputElement>();

const emit = defineEmits(["close", "save"]);
const props = defineProps({
  isModal: {
    type: [Boolean]
  },
  selectedEmployee: {
    type: Object,
    required: true,
  },
});

const toast = useToast();
const router = useRouter();
const organizationFormInstance = getCurrentInstance();

const loadingOverlay = ref(false);
const employeeExist = ref(true);
const markets = ref([
  "Administration",
  "Engineering",
  "Manufacturing",
  "Sales & Marketing",
]);
const usstates = ref([]);
const formData = reactive({
  UniqueID: null,
  PAYROLLNO: null,
  payrollnumber: null,
  SSNO: null,
  fname: null,
  mi: null,
  lname: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  HoursPerWeek: null,
  HourlyWage: null,
  SECURITYCODE: null,
  department: null,
  email: null,
  SPEMAIL: null,
  HIREDATE: null,
  DOB: null,
  AnnualSalary: null,
  SpouseName: null,
  SPWPHONE: null,
  SPCPHONE: null,
  homephone: null,
  cellphone: null,
  EmployeePicture: null,
  ACTIVE: null,
  dateterminated: null,
  SALARY: null,
  responsibilities: null,
  qualifications: null,
  competencies: null,
  benefits: null,
});

const employeeForm = reactive({
  employeeFiles: null,
  companyKeys: null,
  companyExemptions: null,
  companyCreditCards: null,
  payrollExemptions: null,
  payrollStatus: null,
  payrollAllowances: null,
  payrollCityTax: null,
  payrollAW: null,
  payrollAWD: null,
});

const convertToDate = (dateString) => {
  if (!dateString) {
    return new Date(); // Return today's date if the date string is empty
  }
  return new Date(dateString);
};

const editInit = async () => {
  loadingOverlay.value = true;
  await useApiFetch(`/api/employees/${props?.selectedEmployee?.UniqueID}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        loadingOverlay.value = false;
        employeeExist.value = true;

        for (const key in response._data.body) {
          if (response._data.body[key] !== undefined) {
            if (["HIREDATE", "DOB", "dateterminated"].includes(key)) {
              formData[key] = convertToDate(response._data.body[key]);
            } else {
              formData[key] = response._data.body[key];
            }
          }
        }
      }
    },
    onResponseError({ }) {
      employeeExist.value = false;
    },
  });
  propertiesInit();
  loadingOverlay.value = false;
};

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  formData.EmployeePicture = URL.createObjectURL(input.files[0]);
}

function onFileClick() {
  fileRef.value?.click();
}

const propertiesInit = async () => {
  loadingOverlay.value = true;
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
  return errors;
};
const handleClose = async () => {
  if (organizationFormInstance?.vnode?.props.onClose) {
    emit("close");
  } else {
    router.go(-1);
  }
};
const onSubmit = async (event: FormSubmitEvent<any>) => {
  if (props.selectedEmployee === null) {
    // Create Employee

    await useApiFetch("/api/employees", {
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
    // Update Employee
    await useApiFetch(`/api/employees/${props.selectedEmployee.UniqueID}`, {
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

const items = [
  {
    slot: "companyInfo",
    label: "Company Info",
  },
  {
    slot: "payroll",
    label: "Payroll",
  },
  {
    slot: "permission",
    label: "Permission",
  },
];

const permissionTab = ref({
  customers: {
    label: "Customers",
    isChecked: false,
  },
  marking: {
    label: "Marketing",
    isChecked: false,
  },
  employees: {
    label: "Employees",
    isChecked: false,
  },
  accounting: {
    label: "Accounting",
    isChecked: false,
  },
  it: {
    label: "IT",
    isChecked: false,
  },
  engineering: {
    label: "Engineering",
    isChecked: false,
  },
  materials: {
    label: "Materials",
    isChecked: false,
  },
  manufacturing: {
    label: "Manufacturing",
    isChecked: false,
  },
  maintenance: {
    label: "Maintenance",
    isChecked: false,
  },
  utilities: {
    label: "Utilities",
    isChecked: false,
  },
  help: {
    label: "Help",
    isChecked: false,
  },
});

const modalMeta = ref({
  isWorkCenterModalOpen: false,
  modalTitle: "Work Center",
  modalDescription: "Work Center Information",
});

const handleWCModalOpen = () => {
  modalMeta.value.isWorkCenterModalOpen = true;
  modalMeta.value.modalTitle = "Work Center";
  modalMeta.value.modalDescription = "Work Center Information";
};
const handleWCModalClose = () => {
  modalMeta.value.isWorkCenterModalOpen = false;
};

if (props?.selectedEmployee !== null) editInit();
else propertiesInit();
</script>

<template>
  <div class="vl-parent">
    <loading v-model:active="loadingOverlay" :is-full-page="true" color="#000000" backgroundColor="#1B2533"
      loader="dots" />
  </div>
  <UForm :validate="validate" :validate-on="['submit']" :state="formData" class="space-y-4" @submit="onSubmit">

    <div class="flex flex-col">
      <div class="flex flex-row border-b-[6px] border-black">
        <div class="basis-2/3">
          <div class="flex justify-between px-4 py-2 gmsTealHeader">
            <h1 class="flex items-center">Employee Roster</h1>
          </div>
          <div class="border-r-[3px] border-black">
            <div class="flex justify-between px-4 py-2 gmsTealTitlebar">
              <h2 class="flex items-center">Employee Information</h2>
            </div>
            <div class="w-full p-4 flex flex-row space-x-4">
              <div class="basis-1/2 flex flex-col space-y-2">
                <div class="flex flex-row space-x-2 justify-start">

                  <div>
                    <UCheckbox label="Active" />
                  </div>

                  <div>
                    <UCheckbox label="Inactive" />
                  </div>

                </div>

                <div>
                  <UTable :rows="people" :ui="{
                    wrapper: 'h-[158px] border-[1px] border-gray-400 dark:border-gray-700',
                    tr: {
                      active: 'hover:bg-gray-200 dark:hover:bg-gray-800/50'
                    },
                    th: {
                      padding: 'p-1',
                      base: 'sticky top-0 z-10',
                      color: 'bg-white dark:text-gray dark:bg-[#111827]',
                    },
                    td: {
                      padding: 'py-0 px-1'
                    },
                    checkbox: { padding: 'p-1 w-[10px]' }
                  }" />
                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-1/3">
                    <UFormGroup label="Payroll(#)" name="PAYROLLNO">
                      <UInput v-model="formData.PAYROLLNO" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/3">
                    <UFormGroup label="Payroll #(Display)" name="payrollnumber">
                      <UInput v-model="formData.payrollnumber" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/3">
                    <UFormGroup label="SS #" name="SSNO">
                      <UInput v-model="formData.SSNO" />
                    </UFormGroup>
                  </div>
                </div>

                <div class="flex flex-row space-x-2">
                  <div class="basis-5/12">
                    <UFormGroup label="First" name="fname">
                      <UInput v-model="formData.fname" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/6">
                    <UFormGroup label="MI" name="mi">
                      <UInput v-model="formData.mi" />
                    </UFormGroup>
                  </div>
                  <div class="basis-5/12">
                    <UFormGroup label="Last" name="lname">
                      <UInput v-model="formData.lname" />
                    </UFormGroup>
                  </div>
                </div>

                <div class="flex flex-row space-x-2">
                  <div class="w-full">
                    <UFormGroup label="Address" name="address">
                      <UInput v-model="formData.address" placeholder="Address" />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UFormGroup label="City" name="city">
                      <UInput v-model="formData.city" placeholder="Dallas" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/4">
                    <UFormGroup label="State" name="state">
                      <UInputMenu v-model="formData.state" :options="usstates" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/4">
                    <UFormGroup label="Zip" name="zip">
                      <UInput v-model="formData.zip" placeholder="65254" />
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-row space-x-2">
                  <div class="basis-1/2">
                    <UFormGroup label="Hours Per Week" name="HoursPerWeek">
                      <UInput v-model="formData.HoursPerWeek" />
                    </UFormGroup>
                  </div>
                  <div class="basis-1/2">
                    <UFormGroup label="Hourly Wage" name="HourlyWage">
                      <UInput v-model="formData.HourlyWage" />
                    </UFormGroup>
                  </div>
                </div>


              </div>
              <div class="basis-1/4 flex flex-col space-y-1">
                <div class="px-2 py-1 border-[1px] border-slate-300 space-y-1">
                  <div>Security</div>
                  <div>
                    <UFormGroup label="Security Code">
                      <UInput />
                    </UFormGroup>
                  </div>
                </div>

                <div class="">
                  <UFormGroup label="Department" name="department">
                    <UInputMenu v-model="formData.department" v-model:query="formData.department" :options="markets" />
                  </UFormGroup>
                </div>
                <div class="">
                  <UFormGroup label="Employee Email" name="email">
                    <UInput v-model="formData.email" />
                  </UFormGroup>
                </div>

                <div class="">
                  <UFormGroup label="Spouse Email" name="SPEMAIL">
                    <UInput v-model="formData.SPEMAIL" />
                  </UFormGroup>
                </div>

                <div class="">
                  <UFormGroup name="EmployeePicture" label="Employee Picture" class="gap-2" :ui="{
                    container: 'flex flex-wrap items-center gap-3',
                    help: 'mt-0',
                  }">
                    <UAvatar :src="formData.EmployeePicture" alt="Avatar" />

                    <UButton label="Choose" color="white" size="sm" @click="onFileClick" />

                    <input ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif"
                      @change="onFileChange" />
                  </UFormGroup>
                </div>
                <div class="">
                  <UFormGroup label="Date Hired" name="HIREDATE">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.HIREDATE && format(formData.HIREDATE, 'dd/MM/yyyy')
                        " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.HIREDATE" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div class="">
                  <UFormGroup label="Date of Birth" name="DOB">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid"
                        :label="formData.DOB && format(formData.DOB, 'dd/MM/yyyy')" variant="outline" :ui="{
                          base: 'w-full',
                          truncate: 'flex justify-center w-full',
                        }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.DOB" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div class="">
                  <UFormGroup label="Annual Salary" name="AnnualSalary">
                    <UInput v-model="formData.AnnualSalary" />
                  </UFormGroup>
                </div>


              </div>
              <div class="basis-1/4 flex flex-col space-y-2">
                <div class="p-2 border-[1px] border-slate-300 space-y-1">
                  <div>Spouse</div>
                  <div class="">
                    <UFormGroup label="Name" name="SpouseName">
                      <UInput v-model="formData.SpouseName" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Work Phone" name="SPWPHONE">
                      <UInput v-model="formData.SPWPHONE" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Cell Phone" name="SPCPHONE">
                      <UInput v-model="formData.SPCPHONE" />
                    </UFormGroup>
                  </div>
                </div>

                <div class="p-2 border-[1px] border-slate-300 space-y-1">
                  <div>Employee</div>
                  <div class="">
                    <UFormGroup label="Home" name="homephone">
                      <UInput v-model="formData.homephone" />
                    </UFormGroup>
                  </div>
                  <div class="">
                    <UFormGroup label="Cell Phone" name="cellphone">
                      <UInput v-model="formData.cellphone" />
                    </UFormGroup>
                  </div>
                </div>
                <div class="">
                  <UFormGroup label="Date of Termination" name="DOB">
                    <UPopover :popper="{ placement: 'bottom-start' }">
                      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formData.dateterminated &&
                        format(formData.dateterminated, 'dd/MM/yyyy')
                        " variant="outline" :ui="{
                      base: 'w-full',
                      truncate: 'flex justify-center w-full',
                    }" truncate />
                      <template #panel="{ close }">
                        <CommonDatePicker v-model="formData.dateterminated" is-required @close="close" />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>
                <div class="flex items-center justify-end gap-2 text-center">
                  <UFormGroup name="ACTIVE" label="">
                    <UCheckbox v-model="formData.ACTIVE" name="ACTIVE" label="Active" class="pt-4" />
                  </UFormGroup>
                </div>

              </div>


            </div>
          </div>

        </div>

        <div class="basis-1/3 flex flex-col space-y-2 justify-between">


          <!-- Side Tabs company, payroll, permission  -->
          <div>
            <UTabs :items="items" class="w-full">

              <template #companyInfo="{ item }">
                <div class="p-4 flex flex-col space-y-2 ">

                  <div class="pb-5">
                    <UFormGroup label="Employee Files" name="employeeFiles">
                      <UInput v-model="employeeForm.employeeFiles" />
                    </UFormGroup>
                  </div>
                  <div class="w-full gmsTealTitlebar px-3 py-1 mt-6">
                    Company Information
                  </div>
                  <div class="flex flex-row space-x-2">
                    <div class="basis-3/5">
                      <UFormGroup label="Company Keys" name="companyKeys">
                        <UInput v-model="employeeForm.companyKeys" />
                      </UFormGroup>
                    </div>
                    <div class="basis-2/5">
                      <UFormGroup label="Exemptions" name="companyExemptions">
                        <UInput v-model="employeeForm.companyExemptions" />
                      </UFormGroup>
                    </div>
                  </div>
                  <div class="mt-3">
                    <UFormGroup label="Company Credit Cards" name="companyCreditCards">
                      <UTextarea v-model="employeeForm.companyCreditCards" :rows="4" type="text" />
                    </UFormGroup>
                  </div>
                </div>
              </template>

              <template #payroll="{ item }">
                <div class="p-4 flex flex-col space-y-2">
                  <div class="flex flex-row space-x-3">
                    <div class="basis-2/6">
                      <UFormGroup label="Exemptions" name="payrollExemptions">
                        <USelect v-model="employeeForm.payrollExemptions" :options="[]" />
                      </UFormGroup>
                    </div>
                    <div class="basis-2/6">
                      <UFormGroup label="Status" name="payrollStatus">
                        <USelect v-model="employeeForm.payrollStatus" :options="[]" />
                      </UFormGroup>
                    </div>
                    <div class="basis-2/6">
                      <UFormGroup label="Allowances" name="payrollAllowances">
                        <UInput v-model="employeeForm.payrollAllowances" />
                      </UFormGroup>
                    </div>
                  </div>

                  <div class="flex flex-row space-x-3 mt-3">
                    <div class="basis-2/5">
                      <UFormGroup label="City Tax" name="payrollCityTax">
                        <USelect v-model="employeeForm.payrollCityTax" :options="[]" />
                      </UFormGroup>
                    </div>
                    <div class="basis-3/5">
                      <UFormGroup label="Additional Witholding" name="payrollAW">
                        <UInput v-model="employeeForm.payrollAW" />
                      </UFormGroup>
                    </div>
                  </div>
                  <div class="mt-3">
                    <UFormGroup label="Additional Withholding Description" name="payrollAWD">
                      <UInput v-model="employeeForm.payrollAWD" />
                    </UFormGroup>
                  </div>
                </div>
              </template>

              <template #permission="{ item }">
                <div class="p-4 flex flex-col space-y-1">
                  <template v-for="(checkbox, index) in permissionTab" :key="index">
                    <div class="basis-1/5 pb-1.5">
                      <UCheckbox v-model="checkbox.isChecked" :label="checkbox.label" />
                    </div>
                  </template>
                </div>
              </template>
            </UTabs>

          </div>

          <div class="flex flex-col space-y-1 px-4 py-4 border-t-[3px] border-black">
            <div class="flex flex-row space-x-2">
              <div class="basis-1/2">
                <UButton label="Add Employee" color="green" variant="outline" icon="i-heroicons-plus" block />
              </div>
              <div class="basis-1/2">
                <UButton label="Modify Employee" color="primary" variant="outline" icon="i-heroicons-pencil-square"
                  block />
              </div>
            </div>
            <div class="flex flex-row space-x-2">
              <div class="basis-1/2">
                <UButton label="Preview Report" color="primary" variant="outline" icon="i-heroicons-eye-20-solid"
                  block />
              </div>
              <div class="basis-1/2">
                <UButton label="Clear Form" color="red" variant="outline" icon="i-f7-rays" block />
              </div>
            </div>
            <div>
              <UButton label="Sync to Quickbooks" color="green" variant="outline" icon="i-heroicons-plus" block />
            </div>

          </div>


        </div>
      </div>

      <div class="">
        <div class="w-full px-3 py-1 gmsTealTitlebar flex flex-row justify-between items-center">
          <div>HR</div>
          <div class="">
            <UButton icon="i-heroicons-eye" color="primary" variant="outline" label="Work Center Information"
              :ui="{ base: 'w-fit', truncate: 'flex justify-center w-full' }" @click="handleWCModalOpen" truncate />
          </div>
        </div>
        <div class="px-3 flex flex-col space-y-2">
          <div class="flex justify-between space-x-3">
            <div class="basis-2/6">
              <UFormGroup label="Salary History" name="SALARY">
                <UTextarea v-model="formData.SALARY" :rows="4" type="text" />
              </UFormGroup>
            </div>
            <div class="basis-2/6">
              <UFormGroup label="Responsibilites" name="responsibilities">
                <UTextarea v-model="formData.responsibilities" :rows="4" type="text" />
              </UFormGroup>
            </div>
            <div class="basis-2/6">
              <UFormGroup label="Qualifications" name="qualifications">
                <UTextarea v-model="formData.qualifications" :rows="4" type="text" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex justify-between space-x-3">
            <div class="basis-1/2">
              <UFormGroup label="Competencies" name="competencies">
                <UTextarea v-model="formData.competencies" :rows="4" type="text" />
              </UFormGroup>
            </div>
            <div class="basis-1/2">
              <UFormGroup label="Benefits" name="benefits">
                <UTextarea v-model="formData.benefits" :rows="4" type="text" />
              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UForm>


  <!-- <div class="flex flex-row space-x-2 justify-end">
        <div class="w-[120px]">
          <UButton variant="outline" color="red" :label="'Cancel'"
            :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" @click="handleClose" truncate />
        </div>
        <div v-if="props.selectedEmployee === null" class="w-[180px]">
          <UButton icon="i-heroicons-plus-20-solid" type="submit" variant="outline" color="green"
            label="Add Employee" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
        </div>
        <div v-else class="w-[180px]">
          <UButton icon="i-heroicons-plus-20-solid" type="submit" variant="outline" color="blue"
            label="Modify Employee" :ui="{ base: 'w-full', truncate: 'flex justify-center w-full' }" truncate />
        </div>
      </div> -->

  <!-- Work Center Modal -->
  <UDashboardModal v-model="modalMeta.isWorkCenterModalOpen" :title="modalMeta.modalTitle"
  :ui="{
      title: 'text-lg text-white',
      header: {
        base: 'flex flex-row min-h-[0] items-center bg-gms-blue mt-0 gms-modalHeader',
      },
      body: { base: 'mt-0 gap-y-0 gms-modalForm' },
      width: 'w-[900px] sm:max-w-9xl',
      }"
    >
    <JobWorkCenterForm :selected-employee="props.selectedEmployee" @close="handleWCModalClose" />
  </UDashboardModal>

</template>
