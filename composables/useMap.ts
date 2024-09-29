import { ref, shallowRef, reactive, watch, computed, watchEffect } from "vue";
import { useFetch } from "#app";

interface Filter {
  checked: boolean;
  color: string;
  label: string;
  labelColor: string;
}

interface Pin {
  position: google.maps.LatLngLiteral;
  type: string;
  id: number;
  title: string;
  content: string | null;
  address: string;
  model?: string;
  serialNo?: string;
}

export const useMap = () => {
  const mapRef = ref<HTMLElement | null>(null);
  const map = shallowRef<google.maps.Map | null>(null);
  const markers = ref<google.maps.Marker[]>([]);

  const filters = reactive<Record<string, Filter>>({
    pendingInstalls: {
      checked: false,
      color: "darkgreen",
      label: "Pending Installations",
      labelColor: "#fff",
    },
    checkups: {
      checked: false,
      color: "lightblue",
      label: "Checkups",
      labelColor: "#222",
    },
    serviceReports: {
      checked: false,
      color: "red",
      label: "Open Field Complaints",
      labelColor: "#fff",
    },
    siteVisits: {
      checked: false,
      color: "blue",
      label: "Open Site Visits",
      labelColor: "#fff",
    },
    orderPendings: {
      checked: false,
      color: "orange",
      label: "Orders Pending",
      labelColor: "#222",
    },
    openQuotes: {
      checked: false,
      color: "yellow",
      label: "Open Quotes",
      labelColor: "#222",
    },
    shippedOrders: {
      checked: false,
      color: "white",
      label: "Shipped Orders",
      labelColor: "#222",
    },
  });

  const iconBase =
    "https://www.grimmscientific.com/wp-content/uploads/2019/07/";

  const icons: Record<string, string> = {
    pendingInstalls: iconBase + "darkgreen.png",
    checkups: iconBase + "lightblue.png",
    serviceReports: iconBase + "red.png",
    siteVisits: iconBase + "blue.png",
    orderPendings: iconBase + "orange-1.png",
    openQuotes: iconBase + "yellow.png",
    shippedOrders: iconBase + "white.png",
  };

  const {
    data: pins,
    refresh: refreshPins,
    error: pinsError,
  } = useFetch<Pin[]>("/api/map", {
    params: { action: "getPins" },
    key: "map-pins",
  });

  const initMap = () => {
    if (!mapRef.value) return;
    const mapOptions: google.maps.MapOptions = {
      zoom: 5,
      center: { lat: 39.809734, lng: -98.55562 },
    };
    map.value = new google.maps.Map(mapRef.value, mapOptions);
    setPins();
  };

  const setPins = () => {
    clearMarkers();
    if (!pins.value || !map.value) return;
    pins.value.forEach((pin) => {
      if (filters[pin.type]?.checked) {
        const marker = new google.maps.Marker({
          position: {
            lat: Number(pin.position.lat),
            lng: Number(pin.position.lng),
          },
          map: map.value,
          icon: icons[pin.type],
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="bg-white pb-5 text-black space-y-3">
              <h3 class="text-2xl font-medium">Zip: ${
                pin.zip || "Zip unavailable"
              }</h3>
              ${
                pin.serialNo
                  ? `<p class="text-xl font-medium">Serial #: <button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id})">${pin.serialNo}</button></p>`
                  : ""
              }
              ${
                pin.model
                  ? `<p class="text-xl font-medium">Model #: <button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id})">${pin.model}</button></p>`
                  : ""
              }
              ${
                !pin.model && !pin.serialNo && pin.city && pin.state
                  ? `<button class="bg-black px-3 py-1 text-white font-medium text-xl" onclick="openDetails(${pin?.type}, ${pin?.id} )">${pin.city}, ${pin.state}</button>`
                  : ""
              }
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map.value, marker);
        });

        markers.value.push(marker);
      }
    });
  };

  const clearMarkers = () => {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];
  };

  const modalMeta = ref({
    isServiceOrderModalOpen: false,
    isOrderDetailModalOpen: false,
  });

  const gridMeta = ref({
    selectedCustomerId: null,
    selectedOrderId: null,
  });

  const handleModalClose = () => {
    gridMeta.value.selectedCustomerId = "";
    modalMeta.value.isServiceOrderModalOpen = false;
    modalMeta.value.isOrderDetailModalOpen = false;
  };


  const getInfo = async (tblName: string, id: number) => {
    await useApiFetch(`/api/mapLocation/${tblName}/${id}`, {
      method: "GET",
      onResponse({ response }) {
        if (response.status === 200) {
          if (tblName === "tblComplaints") {
            gridMeta.value.selectedCustomerId = response._data.body.CustomerID;
            modalMeta.value.isServiceOrderModalOpen = true;
          }

          if (tblName === "tblOrder") {
            gridMeta.value.selectedCustomerId = response._data.body.customerID;
            gridMeta.value.selectedOrderId = response._data.body.orderid;
            modalMeta.value.isOrderDetailModalOpen = true;
          }
        }
      },
    });
  };

  const openDetails = (type: string, id: number) => {
    if ((id && type?.name === "checkups") || type?.name === "serviceReports") {
      getInfo("tblComplaints", id);
    }
    if (
      (id && type?.name === "pendingInstalls") ||
      type?.name === "shippedOrders"
    ) {
      getInfo("tblOrder", id);
    } else {
      console.log("Type---", type.name);
      console.log("ID-----", id);
    }
  };

  watch(
    filters,
    () => {
      setPins();
    },
    { deep: true }
  );
  watch(pinsError, (error) => {
    if (error) {
      console.error("Error fetching pins:", error);
    }
  });

  return {
    mapRef,
    filters,
    pins,
    pinsError,
    refreshPins,
    initMap,
    openDetails,
    modalMeta,
    gridMeta,
    handleModalClose,
  };
};
