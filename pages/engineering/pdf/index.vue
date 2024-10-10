
 <template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent>
     
        <div v-if="pdfContent">
          <iframe :src="pdfContent" style="width: 100%; height: 600px;" frameborder="0"></iframe>
        </div>

        <PrintModal v-if="isModalOpen" @close="isModalOpen = false" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isModalOpen = ref(false);
const rowData = ref({});
const uniqueIDP = ref(''); 
const pdfContent = ref(''); 

const fetchData = async (id) => {
  const pdfUrl = `/api/engineering/changeorder/pdf/${id}`;
  try {
    const response = await fetch(pdfUrl);
    console.log(response)

    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }
 
    const blob = await response.blob();
    pdfContent.value = URL.createObjectURL(blob); 
  } catch (error) {
    console.error(error);
    alert('Error fetching the PDF. Please try again later. ');
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  uniqueIDP.value = params.get('id');
  rowData.value = Object.fromEntries(params.entries()); 

  if (uniqueIDP.value) {
    fetchData(uniqueIDP.value); 
  } else {
    alert('Unique ID is missing! The function cannot execute.');
  }
});
</script>

<style scoped>
</style> 
